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
          <Card key={stat.title} className="relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5`}></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des Abonnements</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Début</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Prix</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions?.map((subscription) => (
                  <TableRow key={subscription.id}>
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
                        <span className="font-medium">{subscription.profiles?.username || 'Utilisateur'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center gap-1">
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
                      >
                        {subscription.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(subscription.started_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {subscription.expires_at 
                        ? new Date(subscription.expires_at).toLocaleDateString()
                        : 'Illimité'
                      }
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">
                        €{((subscription.subscription_plans?.price_monthly || 0) / 100).toFixed(2)}/mois
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubscriptions;
