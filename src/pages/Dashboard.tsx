
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

  const { data: completedMissions, isLoading: isLoadingMissions } = useQuery({
    queryKey: ['completed-missions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('mission_submissions')
        .select(`
          *,
          mission:missions(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'verified')
        .order('created_at', { ascending: false })
        .limit(5);
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
      if (!user?.id) return [];
      
      // Get missions that the user hasn't submitted yet
      const { data: submittedMissionIds } = await supabase
        .from('mission_submissions')
        .select('mission_id')
        .eq('user_id', user.id);
      
      const submittedIds = submittedMissionIds?.map(s => s.mission_id) || [];
      
      let query = supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (submittedIds.length > 0) {
        query = query.not('id', 'in', `(${submittedIds.join(',')})`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
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

    navigate(`/missions/${missionId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900">
      <div className="container mx-auto px-4 pt-6">
        <AdBanner position="banner" maxAds={1} />
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Bienvenue, {profile?.username} !</CardTitle>
                <CardDescription>Voici un aperçu de votre progression et des dernières activités.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Continuez à explorer et à accomplir des missions pour gagner des récompenses !</p>
              </CardContent>
            </Card>

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
                      <p className="text-xl font-bold">{completedMissions?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Missions Récemment Complétées */}
            <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Missions Récemment Complétées</CardTitle>
                <CardDescription>Vos dernières missions vérifiées avec succès.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingMissions ? (
                  <p>Chargement des missions...</p>
                ) : completedMissions && completedMissions.length > 0 ? (
                  completedMissions.slice(0, 3).map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-600/10 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium">{submission.mission?.title}</h3>
                        <p className="text-xs text-gray-500">{submission.mission?.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-yellow-600 flex items-center gap-1">
                            <Coins className="h-3 w-3" />
                            {submission.mission?.reward_coins} BradCoins
                          </span>
                          <span className="text-xs text-gray-500">
                            Complétée le {new Date(submission.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Trophy className="h-3 w-3 mr-1" />
                        Complétée
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Aucune mission complétée pour le moment.</p>
                )}
                <Button variant="ghost" onClick={() => navigate("/missions")} className="w-full">
                  Voir toutes les missions
                </Button>
              </CardContent>
            </Card>

            {/* Nouvelles Missions Disponibles */}
            <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Nouvelles Missions Disponibles</CardTitle>
                <CardDescription>Découvrez les nouvelles missions et commencez à les accomplir.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingAvailableMissions ? (
                  <p>Chargement des missions...</p>
                ) : availableMissions && availableMissions.length > 0 ? (
                  availableMissions.slice(0, 3).map((mission) => (
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startMission(mission.id)}
                      >
                        Commencer
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Toutes les missions disponibles ont été complétées !</p>
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
                        <Badge variant="secondary">{player.brad_coins?.[0]?.balance || 0} BC</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <AdBanner position="sidebar" maxAds={2} />
            
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

      <AdBanner position="popup" maxAds={1} />
    </div>
  );
};

export default Dashboard;
