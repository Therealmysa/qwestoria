import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, Trophy, Target, Users, Star, Gift, Clock, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdBanner from "@/components/advertisements/AdBanner";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [selectedMission, setSelectedMission] = useState<any>(null);

  const { data: userMissions, isLoading: isLoadingMissions } = useQuery({
    queryKey: ['user-missions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('user_missions')
        .select('*, mission:missions(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, brad_coins')
        .order('brad_coins', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const { data: recentMissions, isLoading: isLoadingRecentMissions } = useQuery({
    queryKey: ['recent-missions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  const completeMission = async (missionId: string) => {
    if (!user) {
      toast.error("Vous devez être connecté pour compléter une mission.");
      return;
    }

    setSelectedMission(missionId);

    const { data: missionData, error: missionError } = await supabase
      .from('missions')
      .select('reward_amount')
      .eq('id', missionId)
      .single();

    if (missionError) {
      console.error("Erreur lors de la récupération des détails de la mission:", missionError);
      toast.error("Erreur lors de la récupération des détails de la mission.");
      setSelectedMission(null);
      return;
    }

    const { reward_amount } = missionData;

    const { error } = await supabase
      .from('user_missions')
      .insert([{ user_id: user.id, mission_id: missionId }]);

    if (error) {
      console.error("Erreur lors de l'insertion de la mission utilisateur:", error);
      toast.error("Erreur lors de la complétion de la mission.");
      setSelectedMission(null);
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ brad_coins: (profile?.brad_coins || 0) + reward_amount })
      .eq('id', user.id);

    if (profileError) {
      console.error("Erreur lors de la mise à jour du profil:", profileError);
      toast.error("Erreur lors de la mise à jour de votre solde.");
      setSelectedMission(null);
      return;
    }

    toast.success(`Mission complétée ! Vous avez gagné ${reward_amount} BradCoins.`);
    setSelectedMission(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900">
      {/* Banner Ad */}
      <div className="container mx-auto px-4 pt-6">
        <AdBanner position="banner" maxAds={1} />
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Section */}
            <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Bienvenue, {profile?.username} !</CardTitle>
                <CardDescription>Voici un aperçu de votre progression et des dernières activités.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Continuez à explorer et à accomplir des missions pour gagner des récompenses !</p>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <Coins className="h-6 w-6 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">BradCoins</p>
                      <p className="text-xl font-bold">{profile?.brad_coins || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-6 w-6 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Missions Complétées</p>
                      <p className="text-xl font-bold">{userMissions?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Missions */}
            <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Dernières Missions</CardTitle>
                <CardDescription>Voici les dernières missions disponibles.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingRecentMissions ? (
                  <p>Chargement des missions...</p>
                ) : (
                  recentMissions?.map((mission) => (
                    <div key={mission.id} className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">{mission.title}</h3>
                        <p className="text-xs text-gray-500">{mission.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => completeMission(mission.id)}
                        disabled={selectedMission === mission.id}
                      >
                        {selectedMission === mission.id ? "En cours..." : "Compléter"}
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Classement</CardTitle>
                <CardDescription>Les meilleurs joueurs de Qwestoria.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingLeaderboard ? (
                  <p>Chargement du classement...</p>
                ) : (
                  <div className="space-y-2">
                    {leaderboard?.map((player, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{index + 1}.</span>
                          <span>{player.username}</span>
                        </div>
                        <Badge variant="secondary">{player.brad_coins} BC</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Sidebar Ads */}
            <AdBanner position="sidebar" maxAds={2} />
            
            {/* Quick Actions */}
            <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Actions Rapides</CardTitle>
                <CardDescription>Accès rapide aux fonctionnalités clés.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Button variant="secondary" onClick={() => navigate("/missions")}>
                  <Target className="h-4 w-4 mr-2" />
                  Voir les Missions
                </Button>
                <Button variant="secondary" onClick={() => navigate("/shop")}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Visiter la Boutique
                </Button>
                <Button variant="secondary" onClick={() => navigate("/leaderboard")}>
                  <Star className="h-4 w-4 mr-2" />
                  Consulter le Classement
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Popup Ads */}
      <AdBanner position="popup" maxAds={1} />
    </div>
  );
};

export default Dashboard;
