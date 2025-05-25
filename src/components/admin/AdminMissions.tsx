
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminMissions = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reward_coins: 0,
    is_vip_only: false,
    external_link: ""
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

      // Log admin action
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
      setFormData({ title: "", description: "", reward_coins: 0, is_vip_only: false, external_link: "" });
    },
    onError: () => {
      toast.error("Erreur lors de la création");
    }
  });

  const deleteMissionMutation = useMutation({
    mutationFn: async (missionId: string) => {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', missionId);
      
      if (error) throw error;

      // Log admin action
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
    onError: () => {
      toast.error("Erreur lors de la suppression");
    }
  });

  const handleCreateMission = () => {
    createMissionMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
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
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle mission</DialogTitle>
                </DialogHeader>
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
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_vip_only"
                      checked={formData.is_vip_only}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_vip_only: checked })}
                    />
                    <Label htmlFor="is_vip_only">Mission VIP uniquement</Label>
                  </div>
                  <Button onClick={handleCreateMission} className="w-full">
                    Créer la mission
                  </Button>
                </div>
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
                  <TableHead>Créée le</TableHead>
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
                      {new Date(mission.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMissions;
