
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, ShieldCheck, Flame, Search, User2, Briefcase, GraduationCap, Gem, BrainCircuit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdBanner from "@/components/advertisements/AdBanner";

const Missions = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [availableMissions, setAvailableMissions] = useState<any[]>([]);
  const [completedMissions, setCompletedMissions] = useState<any[]>([]);

  const categories = [
    { value: "all", label: "Toutes" },
    { value: "daily", label: "Quotidiennes", icon: Flame },
    { value: "weekly", label: "Hebdomadaires", icon: ShieldCheck },
    { value: "special", label: "Spéciales", icon: Sparkles },
    { value: "community", label: "Communauté", icon: User2 },
    { value: "career", label: "Carrière", icon: Briefcase },
    { value: "education", label: "Éducation", icon: GraduationCap },
    { value: "luxury", label: "Luxe", icon: Gem },
    { value: "innovation", label: "Innovation", icon: BrainCircuit }
  ];

  const difficulties = [
    { value: "all", label: "Toutes" },
    { value: "easy", label: "Facile" },
    { value: "medium", label: "Moyenne" },
    { value: "hard", label: "Difficile" },
    { value: "expert", label: "Expert" }
  ];

  const { data: missions, isLoading: isLoadingMissions } = useQuery({
    queryKey: ['missions', searchTerm, selectedCategory, selectedDifficulty],
    queryFn: async () => {
      let query = supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const { data: userMissions, isLoading: isLoadingUserMissions } = useQuery({
    queryKey: ['user-missions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_missions')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  useEffect(() => {
    if (missions && userMissions) {
      const completedMissionIds = userMissions.map(um => um.mission_id);
      setAvailableMissions(missions.filter(mission => !completedMissionIds.includes(mission.id)));
      setCompletedMissions(missions.filter(mission => completedMissionIds.includes(mission.id)));
    }
  }, [missions, userMissions]);

  const completeMissionMutation = useMutation({
    mutationFn: async (missionId: string) => {
      const { data, error } = await supabase
        .from('user_missions')
        .insert([{ user_id: user?.id, mission_id: missionId }]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Mission accomplie !");
      // Invalidate queries to refetch missions data
      // queryClient.invalidateQueries({ queryKey: ['missions'] });
      // queryClient.invalidateQueries({ queryKey: ['user-missions'] });
    },
    onError: (error) => {
      toast.error("Erreur lors de la validation de la mission.");
      console.error("Error completing mission:", error);
    }
  });

  const handleCompleteMission = async (missionId: string) => {
    completeMissionMutation.mutate(missionId);
  };

  const isLoading = isLoadingMissions || isLoadingUserMissions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900">
      {/* Banner Ad */}
      <div className="container mx-auto px-4 pt-6">
        <AdBanner position="banner" maxAds={1} />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border dark:border-slate-600/15 bg-white/90 backdrop-blur-md shadow-2xl dark:shadow-slate-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-blue-500" />
                  <span>Missions</span>
                </CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Explorez les missions disponibles et accomplissez-les pour gagner des récompenses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Rechercher une mission..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Difficulté" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty.value} value={difficulty.value}>
                          {difficulty.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-2"></div>
                    <p className="text-sm">Chargement des missions...</p>
                  </div>
                ) : (
                  <>
                    {availableMissions.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableMissions.map((mission) => (
                          <Card key={mission.id} className="bg-white dark:bg-slate-700/20 border border-slate-200 dark:border-slate-600/30">
                            <CardHeader>
                              <CardTitle className="text-lg font-semibold">{mission.title}</CardTitle>
                              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                {mission.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                Récompense: {mission.reward_coins} BradCoins
                              </p>
                              <Button onClick={() => handleCompleteMission(mission.id)}>
                                Accomplir la mission
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Aucune mission disponible pour le moment.
                        </p>
                      </div>
                    )}

                    {completedMissions.length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold mt-8 mb-4">Missions Accomplies</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {completedMissions.map((mission) => (
                            <Card key={mission.id} className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700">
                              <CardHeader>
                                <CardTitle className="text-lg font-semibold">{mission.title}</CardTitle>
                                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                  {mission.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                  Récompense: {mission.reward_coins} BradCoins
                                </p>
                                <Badge className="bg-green-500 text-white">Mission Accomplie</Badge>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sidebar Ads */}
            <AdBanner position="sidebar" maxAds={2} />
            
            <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border dark:border-slate-600/15 bg-white/90 backdrop-blur-md shadow-2xl dark:shadow-slate-500/20">
              <CardHeader>
                <CardTitle>Filtres</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Filtrer les missions par catégorie et difficulté.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="block text-sm font-medium mb-2">Catégories</Label>
                    <ScrollArea className="h-[200px] w-full rounded-md border">
                      <div className="p-3">
                        {categories.map((category) => (
                          <div key={category.value} className="flex items-center space-x-2 py-1">
                            <Checkbox
                              id={`category-${category.value}`}
                              checked={selectedCategory === category.value}
                              onCheckedChange={(checked) => {
                                setSelectedCategory(checked ? category.value : "all");
                              }}
                            />
                            <Label htmlFor={`category-${category.value}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {category.icon && <category.icon className="inline-block h-4 w-4 mr-1" />}
                              {category.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <div>
                    <Label className="block text-sm font-medium mb-2">Difficultés</Label>
                    <ScrollArea className="h-[150px] w-full rounded-md border">
                      <div className="p-3">
                        {difficulties.map((difficulty) => (
                          <div key={difficulty.value} className="flex items-center space-x-2 py-1">
                            <Checkbox
                              id={`difficulty-${difficulty.value}`}
                              checked={selectedDifficulty === difficulty.value}
                              onCheckedChange={(checked) => {
                                setSelectedDifficulty(checked ? difficulty.value : "all");
                              }}
                            />
                            <Label htmlFor={`difficulty-${difficulty.value}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {difficulty.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
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

export default Missions;
