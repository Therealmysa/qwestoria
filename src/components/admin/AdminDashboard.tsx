
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, ShoppingBag, DollarSign, TrendingUp, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersResult, missionsResult, submissionsResult, coinsResult, adsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('missions').select('id', { count: 'exact' }),
        supabase.from('mission_submissions').select('id', { count: 'exact' }),
        supabase.from('brad_coins').select('balance').gte('balance', 0),
        supabase.from('advertisements').select('click_count, impression_count')
      ]);

      const totalCoins = coinsResult.data?.reduce((sum, coin) => sum + coin.balance, 0) || 0;
      const totalClicks = adsResult.data?.reduce((sum, ad) => sum + ad.click_count, 0) || 0;
      const totalImpressions = adsResult.data?.reduce((sum, ad) => sum + ad.impression_count, 0) || 0;

      return {
        totalUsers: usersResult.count || 0,
        totalMissions: missionsResult.count || 0,
        totalSubmissions: submissionsResult.count || 0,
        totalCoins,
        totalClicks,
        totalImpressions
      };
    }
  });

  const statCards = [
    {
      title: "Utilisateurs Total",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      description: "Membres inscrits"
    },
    {
      title: "Missions Créées",
      value: stats?.totalMissions || 0,
      icon: FileText,
      color: "from-green-500 to-green-600",
      description: "Missions disponibles"
    },
    {
      title: "Soumissions Total",
      value: stats?.totalSubmissions || 0,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      description: "Missions soumises"
    },
    {
      title: "BradCoins Circulants",
      value: stats?.totalCoins || 0,
      icon: DollarSign,
      color: "from-yellow-500 to-yellow-600",
      description: "Total en circulation"
    },
    {
      title: "Clics Publicités",
      value: stats?.totalClicks || 0,
      icon: ShoppingBag,
      color: "from-red-500 to-red-600",
      description: "Engagement publicitaire"
    },
    {
      title: "Impressions Pubs",
      value: stats?.totalImpressions || 0,
      icon: Eye,
      color: "from-indigo-500 to-indigo-600",
      description: "Vues publicitaires"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
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
                  {stat.value.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>
              Vue d'ensemble des dernières activités
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Nouvelles inscriptions aujourd'hui</span>
                <span className="font-semibold text-blue-600">+12</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Missions soumises aujourd'hui</span>
                <span className="font-semibold text-green-600">+34</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">BradCoins distribués</span>
                <span className="font-semibold text-yellow-600">+2,450</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Publicitaire</CardTitle>
            <CardDescription>
              Statistiques des publicités cette semaine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Taux de clic moyen</span>
                <span className="font-semibold text-purple-600">2.3%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">CTR cette semaine</span>
                <span className="font-semibold text-indigo-600">+0.4%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Revenus estimés</span>
                <span className="font-semibold text-green-600">€127.50</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
