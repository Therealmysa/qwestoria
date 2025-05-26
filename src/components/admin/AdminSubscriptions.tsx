import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Crown, DollarSign, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminSubscriptions = () => {
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans(name, price_monthly)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Récupérer les profils utilisateurs séparément
      const userIds = data?.map(sub => sub.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);

      // Joindre manuellement les données
      const subscriptionsWithProfiles = data?.map(subscription => {
        const profile = profilesData?.find(p => p.id === subscription.user_id);
        return {
          ...subscription,
          profiles: profile
        };
      });

      return subscriptionsWithProfiles;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['subscription-stats'],
    queryFn: async () => {
      const [activeResult, totalResult, revenueResult] = await Promise.all([
        supabase.from('user_subscriptions').select('id', { count: 'exact' }).eq('status', 'active'),
        supabase.from('user_subscriptions').select('id', { count: 'exact' }),
        supabase.from('user_subscriptions').select('subscription_plans(price_monthly)').eq('status', 'active')
      ]);

      const monthlyRevenue = revenueResult.data?.reduce((sum, sub) => {
        return sum + (sub.subscription_plans?.price_monthly || 0);
      }, 0) || 0;

      return {
        activeSubscriptions: activeResult.count || 0,
        totalSubscriptions: totalResult.count || 0,
        monthlyRevenue: monthlyRevenue / 100 // Convert from cents to euros
      };
    }
  });

  const statCards = [
    {
      title: "Abonnements Actifs",
      value: stats?.activeSubscriptions || 0,
      icon: Users,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Total Abonnements",
      value: stats?.totalSubscriptions || 0,
      icon: TrendingUp,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Revenus Mensuels",
      value: `€${stats?.monthlyRevenue?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: "from-yellow-500 to-yellow-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={stat.title} className="relative overflow-hidden card-enhanced">
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-10 dark:opacity-20`}></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="card-enhanced">
        <CardHeader className="border-b border-gray-200 dark:border-white/10">
          <CardTitle className="text-white dark:text-white">Gestion des Abonnements</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-300">Chargement...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5">
                    <TableHead className="text-gray-700 dark:text-gray-300">Utilisateur</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Plan</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Statut</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Début</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Expiration</TableHead>
                    <TableHead className="text-right text-gray-700 dark:text-gray-300">Prix</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions?.map((subscription) => (
                    <TableRow key={subscription.id} className="border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {subscription.profiles?.avatar_url ? (
                            <img
                              src={subscription.profiles.avatar_url}
                              alt={subscription.profiles.username || 'Utilisateur'}
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                              {subscription.profiles?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <span className="font-medium text-gray-900 dark:text-white">{subscription.profiles?.username || 'Utilisateur'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700">
                          <Crown className="h-3 w-3" />
                          {subscription.subscription_plans?.name || 'Plan inconnu'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            subscription.status === 'active' ? 'default' :
                            subscription.status === 'cancelled' ? 'destructive' :
                            'secondary'
                          }
                          className={
                            subscription.status === 'active' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700'
                              : subscription.status === 'cancelled'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                          }
                        >
                          {subscription.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {new Date(subscription.started_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {subscription.expires_at 
                          ? new Date(subscription.expires_at).toLocaleDateString()
                          : 'Illimité'
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-mono text-gray-900 dark:text-white">
                          €{((subscription.subscription_plans?.price_monthly || 0) / 100).toFixed(2)}/mois
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubscriptions;
