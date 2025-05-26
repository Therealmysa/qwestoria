import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Crown, Calendar as CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminMissionSubmissions from "./AdminMissionSubmissions";

const AdminMissions = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reward_coins: 0,
    is_vip_only: false,
    external_link: "",
    starts_at: undefined as Date | undefined,
    ends_at: undefined as Date | undefined
  });
  const queryClient = useQueryClient();

  const { data: missions, isLoading } = useQuery({
    queryKey: ['admin-missions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createMissionMutation = useMutation({
    mutationFn: async (missionData: any) => {
      const { error } = await supabase
        .from('missions')
        .insert([missionData]);
      
      if (error) throw error;

      await supabase.from('admin_logs').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action: 'create_mission',
        target_type: 'mission',
        details: missionData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-missions'] });
      toast.success("Mission créée avec succès");
      setShowCreateDialog(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erreur lors de la création");
    }
  });

  const updateMissionMutation = useMutation({
    mutationFn: async ({ id, missionData }: { id: string, missionData: any }) => {
      const { error } = await supabase
        .from('missions')
        .update(missionData)
        .eq('id', id);
      
      if (error) throw error;

      await supabase.from('admin_logs').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action: 'update_mission',
        target_type: 'mission',
        target_id: id,
        details: missionData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-missions'] });
      toast.success("Mission mise à jour");
      setShowEditDialog(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    }
  });

  const deleteMissionMutation = useMutation({
    mutationFn: async (missionId: string) => {
      // D'abord supprimer les soumissions associées
      const { error: submissionsError } = await supabase
        .from('mission_submissions')
        .delete()
        .eq('mission_id', missionId);
      
      if (submissionsError) throw submissionsError;

      // Ensuite supprimer la mission
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', missionId);
      
      if (error) throw error;

      await supabase.from('admin_logs').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action: 'delete_mission',
        target_type: 'mission',
        target_id: missionId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-missions'] });
      toast.success("Mission supprimée");
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Erreur lors de la suppression");
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      reward_coins: 0,
      is_vip_only: false,
      external_link: "",
      starts_at: undefined,
      ends_at: undefined
    });
    setSelectedMission(null);
  };

  const handleCreateMission = () => {
    const missionData = {
      ...formData,
      starts_at: formData.starts_at?.toISOString(),
      ends_at: formData.ends_at?.toISOString()
    };
    createMissionMutation.mutate(missionData);
  };

  const handleUpdateMission = () => {
    if (!selectedMission) return;
    const missionData = {
      ...formData,
      starts_at: formData.starts_at?.toISOString(),
      ends_at: formData.ends_at?.toISOString()
    };
    updateMissionMutation.mutate({ id: selectedMission.id, missionData });
  };

  const handleEditMission = (mission: any) => {
    setSelectedMission(mission);
    setFormData({
      title: mission.title,
      description: mission.description,
      reward_coins: mission.reward_coins,
      is_vip_only: mission.is_vip_only || false,
      external_link: mission.external_link || "",
      starts_at: mission.starts_at ? new Date(mission.starts_at) : undefined,
      ends_at: mission.ends_at ? new Date(mission.ends_at) : undefined
    });
    setShowEditDialog(true);
  };

  const handleDeleteMission = (missionId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette mission ? Toutes les soumissions associées seront également supprimées.")) {
      deleteMissionMutation.mutate(missionId);
    }
  };

  const getMissionStatus = (mission: any) => {
    const now = new Date();
    const startsAt = mission.starts_at ? new Date(mission.starts_at) : null;
    const endsAt = mission.ends_at ? new Date(mission.ends_at) : null;

    if (startsAt && now < startsAt) {
      return <Badge variant="outline">Programmée</Badge>;
    }
    if (endsAt && now > endsAt) {
      return <Badge variant="destructive">Expirée</Badge>;
    }
    return <Badge className="bg-green-500">Active</Badge>;
  };

  const MissionForm = ({ isEdit = false }) => (
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
          placeholder="Description détaillée"
          className="min-h-[100px]"
        />
      </div>
      
      <div>
        <Label htmlFor="reward_coins">Récompense (BradCoins)</Label>
        <Input
          id="reward_coins"
          type="number"
          value={formData.reward_coins}
          onChange={(e) => setFormData({ ...formData, reward_coins: parseInt(e.target.value) })}
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Date de début (optionnel)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.starts_at && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.starts_at ? (
                  format(formData.starts_at, "PPP", { locale: fr })
                ) : (
                  <span>Choisir une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.starts_at}
                onSelect={(date) => setFormData({ ...formData, starts_at: date })}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Date de fin (optionnel)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.ends_at && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.ends_at ? (
                  format(formData.ends_at, "PPP", { locale: fr })
                ) : (
                  <span>Choisir une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.ends_at}
                onSelect={(date) => setFormData({ ...formData, ends_at: date })}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="is_vip_only"
          checked={formData.is_vip_only}
          onCheckedChange={(checked) => setFormData({ ...formData, is_vip_only: checked })}
        />
        <Label htmlFor="is_vip_only">Mission VIP uniquement</Label>
      </div>
      
      <Button 
        onClick={isEdit ? handleUpdateMission : handleCreateMission} 
        className="w-full"
      >
        {isEdit ? "Mettre à jour" : "Créer"} la mission
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="missions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="missions" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Missions
          </TabsTrigger>
          <TabsTrigger value="submissions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Soumissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="missions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Gestion des Missions
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle Mission
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Créer une nouvelle mission</DialogTitle>
                    </DialogHeader>
                    <MissionForm />
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Récompense</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
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
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {mission.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-yellow-600">
                            {mission.reward_coins} BC
                          </span>
                        </TableCell>
                        <TableCell>
                          {mission.is_vip_only ? (
                            <Badge variant="secondary">
                              <Crown className="h-3 w-3 mr-1" />
                              VIP
                            </Badge>
                          ) : (
                            <Badge variant="outline">Public</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {getMissionStatus(mission)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {mission.starts_at && (
                              <div>Début: {format(new Date(mission.starts_at), "dd/MM/yy")}</div>
                            )}
                            {mission.ends_at && (
                              <div>Fin: {format(new Date(mission.ends_at), "dd/MM/yy")}</div>
                            )}
                            {!mission.starts_at && !mission.ends_at && (
                              <span className="text-gray-500">Permanente</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditMission(mission)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteMission(mission.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <AdminMissionSubmissions />
        </TabsContent>
      </Tabs>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier la mission</DialogTitle>
          </DialogHeader>
          <MissionForm isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMissions;
