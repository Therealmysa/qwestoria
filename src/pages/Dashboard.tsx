
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Trophy, Target, Users, Star, Gift, Clock, Zap, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdBanner from "@/components/advertisements/AdBanner";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

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
        .select('username, brad_coins:brad_coins(balance)')
        .order('brad_coins.balance', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const { data: availableMissions, isLoading: isLoadingAvailableMissions } = useQuery({
    queryKey: ['available-missions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const { data: bradCoinsBalance } = useQuery({
    queryKey: ['brad-coins', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { data, error } = await supabase
        .from('brad_coins')
        .select('balance')
        .eq('user_id', user.id)
        .single();
      if (error) return 0;
      return data?.balance || 0;
    },
    enabled: !!user?.id,
  });

  const startMission = async (missionId: string) => {
    if (!user) {
      toast.error("Vous devez être connecté pour commencer une mission.");
      return;
    }

    // Vérifier si l'utilisateur a déjà cette mission
    const existingMission = userMissions?.find(um => um.mission_id === missionId);
    if (existingMission) {
      toast.error("Vous avez déjà cette mission.");
      return;
    }

    const { error } = await supabase
      .from('user_missions')
      .insert([{ user_id: user.id, mission_id: missionId }]);

    if (error) {
      console.error("Erreur lors du démarrage de la mission:", error);
      toast.error("Erreur lors du démarrage de la mission.");
      return;
    }

    toast.success("Mission ajoutée à votre liste !");
    // Recharger les missions utilisateur
    window.location.reload();
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
                      <p className="text-xl font-bold">{bradCoinsBalance || 0}</p>
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

            {/* Available Missions */}
            <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Missions Disponibles</CardTitle>
                <CardDescription>Découvrez les nouvelles missions et commencez à les accomplir.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingAvailableMissions ? (
                  <p>Chargement des missions...</p>
                ) : (
                  availableMissions?.slice(0, 3).map((mission) => {
                    const isAlreadyStarted = userMissions?.some(um => um.mission_id === mission.id);
                    return (
                      <div key={mission.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-600/10 rounded-lg">
                        <div>
                          <h3 className="text-sm font-medium">{mission.title}</h3>
                          <p className="text-xs text-gray-500">{mission.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-yellow-600 flex items-center gap-1">
                              <Coins className="h-3 w-3" />
                              {mission.reward_coins} BradCoins
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isAlreadyStarted ? (
                            <Badge variant="secondary">En cours</Badge>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startMission(mission.id)}
                            >
                              Commencer
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <Button variant="ghost" onClick={() => navigate("/missions")} className="w-full">
                  Voir toutes les missions
                </Button>
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
                        <Badge variant="secondary">{player.brad_coins?.[0]?.balance || 0} BC</Badge>
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
