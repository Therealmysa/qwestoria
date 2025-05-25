
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, MousePointer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminAdvertisements = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link_url: "",
    image_url: "",
    position: "sidebar",
    is_active: true
  });
  const queryClient = useQueryClient();

  const { data: advertisements, isLoading } = useQuery({
    queryKey: ['admin-advertisements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createAdMutation = useMutation({
    mutationFn: async (adData: any) => {
      const { error } = await supabase
        .from('advertisements')
        .insert([adData]);
      
      if (error) throw error;

      // Log admin action
      await supabase.from('admin_logs').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action: 'create_advertisement',
        target_type: 'advertisement',
        details: adData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-advertisements'] });
      toast.success("Publicité créée avec succès");
      setShowCreateDialog(false);
      setFormData({ title: "", description: "", link_url: "", image_url: "", position: "sidebar", is_active: true });
    },
    onError: () => {
      toast.error("Erreur lors de la création");
    }
  });

  const toggleAdMutation = useMutation({
    mutationFn: async ({ adId, isActive }: { adId: string, isActive: boolean }) => {
      const { error } = await supabase
        .from('advertisements')
        .update({ is_active: isActive })
        .eq('id', adId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-advertisements'] });
      toast.success("Statut mis à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    }
  });

  const deleteAdMutation = useMutation({
    mutationFn: async (adId: string) => {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', adId);
      
      if (error) throw error;

      // Log admin action
      await supabase.from('admin_logs').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action: 'delete_advertisement',
        target_type: 'advertisement',
        target_id: adId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-advertisements'] });
      toast.success("Publicité supprimée");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    }
  });

  const handleCreateAd = () => {
    createAdMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Gestion des Publicités
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Publicité
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle publicité</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Titre de la publicité"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Description de la publicité"
                    />
                  </div>
                  <div>
                    <Label htmlFor="link_url">URL de destination</Label>
                    <Input
                      id="link_url"
                      value={formData.link_url}
                      onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="image_url">URL de l'image</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sidebar">Barre latérale</SelectItem>
                        <SelectItem value="banner">Bannière</SelectItem>
                        <SelectItem value="popup">Popup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Actif</Label>
                  </div>
                  <Button onClick={handleCreateAd} className="w-full">
                    Créer la publicité
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
                  <TableHead>Publicité</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advertisements?.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {ad.image_url && (
                          <img
                            src={ad.image_url}
                            alt={ad.title}
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{ad.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {ad.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {ad.position}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Eye className="h-3 w-3 mr-1" />
                          {ad.impression_count}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MousePointer className="h-3 w-3 mr-1" />
                          {ad.click_count}
                        </div>
                        <div className="text-purple-600 font-medium">
                          {ad.impression_count > 0 
                            ? `${((ad.click_count / ad.impression_count) * 100).toFixed(1)}%`
                            : '0%'
                          }
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={ad.is_active}
                        onCheckedChange={(checked) => 
                          toggleAdMutation.mutate({ adId: ad.id, isActive: checked })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteAdMutation.mutate(ad.id)}
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

export default AdminAdvertisements;
