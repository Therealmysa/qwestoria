
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, ShoppingBag, DollarSign, TrendingUp, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Get all stats in parallel
      const [usersResult, missionsResult, submissionsResult, coinsResult, adsResult, recentUsers, recentSubmissions, totalRevenue] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('missions').select('id', { count: 'exact' }),
        supabase.from('mission_submissions').select('id', { count: 'exact' }),
        supabase.from('brad_coins').select('balance'),
        supabase.from('advertisements').select('click_count, impression_count'),
        // Recent users (today)
        supabase.from('profiles').select('id', { count: 'exact' }).gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
        // Recent submissions (today)
        supabase.from('mission_submissions').select('id', { count: 'exact' }).gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
        // Total revenue from BradCoins purchases
        supabase.from('bradcoins_purchases').select('price_paid_cents').eq('status', 'completed')
      ]);

      const totalCoins = coinsResult.data?.reduce((sum, coin) => sum + coin.balance, 0) || 0;
      const totalClicks = adsResult.data?.reduce((sum, ad) => sum + ad.click_count, 0) || 0;
      const totalImpressions = adsResult.data?.reduce((sum, ad) => sum + ad.impression_count, 0) || 0;
      const revenue = totalRevenue.data?.reduce((sum, purchase) => sum + purchase.price_paid_cents, 0) || 0;

      return {
        totalUsers: usersResult.count || 0,
        totalMissions: missionsResult.count || 0,
        totalSubmissions: submissionsResult.count || 0,
        totalCoins,
        totalClicks,
        totalImpressions,
        recentUsers: recentUsers.count || 0,
        recentSubmissions: recentSubmissions.count || 0,
        totalRevenue: revenue / 100, // Convert cents to euros
        ctr: totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : 0
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
      color: "from-slate-500 to-slate-600",
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
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border dark:border-slate-600/15 bg-white/90 backdrop-blur-md shadow-xl dark:shadow-slate-500/20 transform hover:scale-[1.02] transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5`}></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border dark:border-slate-600/15 bg-white/90 backdrop-blur-md shadow-xl dark:shadow-slate-500/20 transform hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-amber-500 dark:from-white dark:via-[#f1c40f] dark:to-[#9b87f5] text-base sm:text-lg">Activité Récente</CardTitle>
            <CardDescription className="dark:text-gray-300 text-sm">
              Vue d'ensemble des dernières activités
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-slate-600/5 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Nouvelles inscriptions aujourd'hui</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm">+{stats?.recentUsers || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-slate-600/5 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Missions soumises aujourd'hui</span>
                <span className="font-semibold text-green-600 dark:text-green-400 text-sm">+{stats?.recentSubmissions || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-slate-600/5 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Revenus totaux</span>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400 text-sm">€{stats?.totalRevenue?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border dark:border-slate-600/15 bg-white/90 backdrop-blur-md shadow-xl dark:shadow-slate-500/20 transform hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-amber-500 dark:from-white dark:via-[#f1c40f] dark:to-[#9b87f5] text-base sm:text-lg">Performance Publicitaire</CardTitle>
            <CardDescription className="dark:text-gray-300 text-sm">
              Statistiques des publicités en temps réel
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-slate-600/5 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Taux de clic (CTR)</span>
                <span className="font-semibold text-slate-600 dark:text-slate-400 text-sm">{stats?.ctr || 0}%</span>
              </div>
              <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-slate-600/5 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total clics</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-sm">{stats?.totalClicks || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-slate-600/5 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total impressions</span>
                <span className="font-semibold text-green-600 dark:text-green-400 text-sm">{stats?.totalImpressions || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
