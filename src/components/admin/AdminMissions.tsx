
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Edit, Trash2, Eye, Users, Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Mission {
  id: string;
  title: string;
  description: string;
  reward_coins: number;
  is_vip_only: boolean;
  starts_at: string;
  ends_at?: string;
  external_link?: string;
}

const AdminMissions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reward_coins: 0,
    is_vip_only: false,
    starts_at: "",
    ends_at: "",
    external_link: ""
  });
  const queryClient = useQueryClient();

  const { data: missions, isLoading } = useQuery({
    queryKey: ['admin-missions', searchTerm],
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

  const createMissionMutation = useMutation({
    mutationFn: async (missionData: any) => {
      const { error } = await supabase
        .from('missions')
        .insert([{
          ...missionData,
          starts_at: missionData.starts_at || new Date().toISOString(),
          ends_at: missionData.ends_at || null
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-missions'] });
      toast.success("Mission créée avec succès");
      setShowCreateDialog(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating mission:', error);
      toast.error("Erreur lors de la création");
    }
  });

  const updateMissionMutation = useMutation({
    mutationFn: async ({ id, ...missionData }: any) => {
      const { error } = await supabase
        .from('missions')
        .update({
          ...missionData,
          ends_at: missionData.ends_at || null,
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
    onError: (error) => {
      console.error('Error updating mission:', error);
      toast.error("Erreur lors de la mise à jour");
    }
  });

  const deleteMissionMutation = useMutation({
    mutationFn: async (missionId: string) => {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', missionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-missions'] });
      toast.success("Mission supprimée avec succès");
    },
    onError: (error) => {
      console.error('Error deleting mission:', error);
      toast.error("Erreur lors de la suppression");
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
      external_link: ""
    });
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
      external_link: mission.external_link || ""
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const MissionForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Titre de la mission"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description de la mission"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="reward_coins">Récompense (BradCoins)</Label>
        <Input
          id="reward_coins"
          type="number"
          value={formData.reward_coins}
          onChange={(e) => setFormData({ ...formData, reward_coins: parseInt(e.target.value) || 0 })}
          placeholder="Nombre de BradCoins"
        />
      </div>
      <div>
        <Label htmlFor="external_link">Lien externe (optionnel)</Label>
        <Input
          id="external_link"
          value={formData.external_link}
          onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div>
        <Label htmlFor="starts_at">Date de début</Label>
        <Input
          id="starts_at"
          type="datetime-local"
          value={formData.starts_at}
          onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="ends_at">Date de fin (optionnel)</Label>
        <Input
          id="ends_at"
          type="datetime-local"
          value={formData.ends_at}
          onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is_vip_only"
          checked={formData.is_vip_only}
          onCheckedChange={(checked) => setFormData({ ...formData, is_vip_only: checked })}
        />
        <Label htmlFor="is_vip_only">Réservé aux VIP</Label>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => {
          setShowCreateDialog(false);
          setShowEditDialog(false);
          resetForm();
          setSelectedMission(null);
        }}>
          Annuler
        </Button>
        <Button onClick={handleSubmit}>
          {selectedMission ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-3 sm:space-y-6">
      <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-base sm:text-xl">Gestion des Missions</span>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une mission..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      resetForm();
                      setShowCreateDialog(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Mission
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Créer une nouvelle mission</DialogTitle>
                  </DialogHeader>
                  <MissionForm />
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-2"></div>
              <p className="text-sm">Chargement...</p>
            </div>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="block lg:hidden space-y-3">
                {missions?.map((mission) => (
                  <Card key={mission.id} className="p-3 dark:bg-slate-700/20 border border-slate-200 dark:border-slate-600/30">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-1 line-clamp-2">{mission.title}</div>
                        <div className="text-xs text-gray-500 mb-2 line-clamp-2">{mission.description}</div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {mission.is_vip_only && (
                            <Badge variant="secondary" className="text-xs">
                              <Users className="h-3 w-3 mr-1" />
                              VIP
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            <Coins className="h-3 w-3 mr-1" />
                            {mission.reward_coins}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0 ml-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(mission)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMissionMutation.mutate(mission.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mission</TableHead>
                      <TableHead>Récompense</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {missions?.map((mission) => (
                      <TableRow key={mission.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{mission.title}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">{mission.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            <Coins className="h-3 w-3 mr-1" />
                            {mission.reward_coins}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {mission.is_vip_only ? (
                            <Badge variant="secondary" className="text-xs">VIP</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Public</Badge>
                          )}
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
                              onClick={() => deleteMissionMutation.mutate(mission.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Modifier la mission</DialogTitle>
                  </DialogHeader>
                  <MissionForm />
                </DialogContent>
              </Dialog>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMissions;
