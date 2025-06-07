
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Coins, RotateCcw, Filter, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdminOperations } from "@/hooks/useAdminOperations";
import { validateMissionData } from "@/utils/inputSanitization";
import MissionFormFields from "./MissionFormFields";

interface Mission {
  id: string;
  title: string;
  description: string;
  reward_coins: number;
  is_vip_only: boolean;
  starts_at: string;
  ends_at?: string;
  external_link?: string;
  is_daily?: boolean;
  reset_hours?: number;
  difficulty_level?: string;
  platform?: string;
  mission_type?: string;
  created_at?: string;
  updated_at?: string;
}

interface MissionFormData {
  title: string;
  description: string;
  reward_coins: number;
  is_vip_only: boolean;
  starts_at: string;
  ends_at: string;
  external_link: string;
  is_daily: boolean;
  reset_hours: number;
  difficulty_level: string;
  platform: string;
  mission_type: string;
}

const AdminMissions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtres
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");
  const [platformFilter, setPlatformFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [vipFilter, setVipFilter] = useState<string>("");
  const [dailyFilter, setDailyFilter] = useState<string>("");

  const [formData, setFormData] = useState<MissionFormData>({
    title: "",
    description: "",
    reward_coins: 0,
    is_vip_only: false,
    starts_at: "",
    ends_at: "",
    external_link: "",
    is_daily: false,
    reset_hours: 24,
    difficulty_level: "",
    platform: "",
    mission_type: ""
  });
  const queryClient = useQueryClient();
  const { deleteMission, isDeletingMission } = useAdminOperations();

  const { data: missions, isLoading } = useQuery({
    queryKey: ['admin-missions', searchTerm, difficultyFilter, platformFilter, typeFilter, vipFilter, dailyFilter],
    queryFn: async () => {
      let query = supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      
      if (difficultyFilter && difficultyFilter !== "all") {
        query = query.eq('difficulty_level', difficultyFilter);
      }
      
      if (platformFilter && platformFilter !== "all") {
        query = query.eq('platform', platformFilter);
      }
      
      if (typeFilter && typeFilter !== "all") {
        query = query.eq('mission_type', typeFilter);
      }
      
      if (vipFilter && vipFilter !== "all") {
        query = query.eq('is_vip_only', vipFilter === "vip");
      }
      
      if (dailyFilter && dailyFilter !== "all") {
        query = query.eq('is_daily', dailyFilter === "daily");
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Mission[];
    }
  });

  const cleanupMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('cleanup_expired_missions');
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-missions'] });
      toast.success("Missions expirées supprimées avec succès");
    },
    onError: (error) => {
      console.error('Error cleaning up missions:', error);
      toast.error("Erreur lors du nettoyage");
    }
  });

  const createMissionMutation = useMutation({
    mutationFn: async (missionData: MissionFormData) => {
      const validation = validateMissionData(missionData);
      
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const { error } = await supabase
        .from('missions')
        .insert([{
          ...validation.sanitizedData,
          starts_at: validation.sanitizedData.starts_at || new Date().toISOString(),
          ends_at: validation.sanitizedData.ends_at || null,
          is_daily: missionData.is_daily,
          reset_hours: missionData.is_daily ? missionData.reset_hours : null,
          difficulty_level: missionData.difficulty_level || null,
          platform: missionData.platform || null,
          mission_type: missionData.mission_type || null
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-missions'] });
      toast.success("Mission créée avec succès");
      setShowCreateDialog(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error creating mission:', error);
      toast.error(error.message || "Erreur lors de la création");
    }
  });

  const updateMissionMutation = useMutation({
    mutationFn: async ({ id, ...missionData }: { id: string } & MissionFormData) => {
      const validation = validateMissionData(missionData);
      
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const { error } = await supabase
        .from('missions')
        .update({
          ...validation.sanitizedData,
          ends_at: validation.sanitizedData.ends_at || null,
          is_daily: missionData.is_daily,
          reset_hours: missionData.is_daily ? missionData.reset_hours : null,
          difficulty_level: missionData.difficulty_level || null,
          platform: missionData.platform || null,
          mission_type: missionData.mission_type || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-missions'] });
      toast.success("Mission mise à jour avec succès");
      setShowEditDialog(false);
      setSelectedMission(null);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error updating mission:', error);
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      reward_coins: 0,
      is_vip_only: false,
      starts_at: "",
      ends_at: "",
      external_link: "",
      is_daily: false,
      reset_hours: 24,
      difficulty_level: "",
      platform: "",
      mission_type: ""
    });
  };

  const clearFilters = () => {
    setDifficultyFilter("");
    setPlatformFilter("");
    setTypeFilter("");
    setVipFilter("");
    setDailyFilter("");
  };

  const handleEdit = (mission: Mission) => {
    setSelectedMission(mission);
    setFormData({
      title: mission.title,
      description: mission.description,
      reward_coins: mission.reward_coins,
      is_vip_only: mission.is_vip_only,
      starts_at: mission.starts_at ? new Date(mission.starts_at).toISOString().slice(0, 16) : "",
      ends_at: mission.ends_at ? new Date(mission.ends_at).toISOString().slice(0, 16) : "",
      external_link: mission.external_link || "",
      is_daily: mission.is_daily || false,
      reset_hours: mission.reset_hours || 24,
      difficulty_level: mission.difficulty_level || "",
      platform: mission.platform || "",
      mission_type: mission.mission_type || ""
    });
    setShowEditDialog(true);
  };

  const handleSubmit = () => {
    if (selectedMission) {
      updateMissionMutation.mutate({ id: selectedMission.id, ...formData });
    } else {
      createMissionMutation.mutate(formData);
    }
  };

  const handleDelete = (missionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) {
      deleteMission(missionId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const activeFiltersCount = [difficultyFilter, platformFilter, typeFilter, vipFilter, dailyFilter].filter(f => f && f !== "all").length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
            <span className="text-lg">Gestion des Missions</span>
            
            {/* Barre de recherche et actions */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-2">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une mission..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="relative"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                  {activeFiltersCount > 0 && (
                    <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
                
                <Button
                  onClick={() => cleanupMutation.mutate()}
                  variant="outline"
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                  disabled={cleanupMutation.isPending}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Nettoyer expirées</span>
                  <span className="sm:hidden">Nettoyer</span>
                </Button>
                
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        resetForm();
                        setShowCreateDialog(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Nouvelle Mission</span>
                      <span className="sm:hidden">Nouvelle</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Créer une nouvelle mission</DialogTitle>
                    </DialogHeader>
                    <MissionFormFields
                      formData={formData}
                      onChange={setFormData}
                    />
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" onClick={() => {
                        setShowCreateDialog(false);
                        resetForm();
                      }}>
                        Annuler
                      </Button>
                      <Button 
                        onClick={handleSubmit}
                        disabled={createMissionMutation.isPending}
                      >
                        {createMissionMutation.isPending ? "Création..." : "Créer"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardTitle>
          
          {/* Panneau de filtres */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label htmlFor="difficulty-filter" className="text-sm font-medium">Difficulté</Label>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="facile">Facile</SelectItem>
                    <SelectItem value="moyen">Moyen</SelectItem>
                    <SelectItem value="difficile">Difficile</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="platform-filter" className="text-sm font-medium">Plateforme</Label>
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="toutes">Toutes</SelectItem>
                    <SelectItem value="pc">PC</SelectItem>
                    <SelectItem value="console">Console</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="type-filter" className="text-sm font-medium">Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="victoire">Victoire</SelectItem>
                    <SelectItem value="elimination">Élimination</SelectItem>
                    <SelectItem value="survie">Survie</SelectItem>
                    <SelectItem value="exploration">Exploration</SelectItem>
                    <SelectItem value="defi">Défi</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="vip-filter" className="text-sm font-medium">Accès</Label>
                <Select value={vipFilter} onValueChange={setVipFilter}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-full"
                >
                  <X className="h-4 w-4 mr-1" />
                  Effacer
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-2"></div>
              <p className="text-sm">Chargement...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Mission</TableHead>
                    <TableHead className="min-w-[100px]">Récompense</TableHead>
                    <TableHead className="min-w-[80px]">Type</TableHead>
                    <TableHead className="min-w-[120px]">Propriétés</TableHead>
                    <TableHead className="min-w-[140px]">Période</TableHead>
                    <TableHead className="min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {missions?.map((mission) => (
                    <TableRow key={mission.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{mission.title}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{mission.description}</div>
                          {mission.difficulty_level && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {mission.difficulty_level}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          <Coins className="h-3 w-3 mr-1" />
                          {mission.reward_coins}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {mission.is_vip_only ? (
                            <Badge variant="secondary" className="text-xs">VIP</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Public</Badge>
                          )}
                          {mission.mission_type && (
                            <div className="text-xs text-gray-500">{mission.mission_type}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {mission.is_daily && (
                            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                              Journalière ({mission.reset_hours}h)
                            </Badge>
                          )}
                          {mission.platform && (
                            <div className="text-xs text-gray-500">{mission.platform}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(mission.starts_at)}
                          {mission.ends_at && (
                            <div className="text-xs text-gray-500">
                              → {formatDate(mission.ends_at)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(mission)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(mission.id)}
                            disabled={isDeletingMission}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Modifier la mission</DialogTitle>
                  </DialogHeader>
                  <MissionFormFields
                    formData={formData}
                    onChange={setFormData}
                  />
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => {
                      setShowEditDialog(false);
                      setSelectedMission(null);
                      resetForm();
                    }}>
                      Annuler
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={updateMissionMutation.isPending}
                    >
                      {updateMissionMutation.isPending ? "Mise à jour..." : "Mettre à jour"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMissions;
