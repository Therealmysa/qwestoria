
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
import { Plus, Edit, Trash2, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminShop = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "pack",
    image_url: "",
    is_vip_only: false
  });
  const queryClient = useQueryClient();

  const { data: shopItems, isLoading } = useQuery({
    queryKey: ['admin-shop-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createItemMutation = useMutation({
    mutationFn: async (itemData: any) => {
      const { error } = await supabase
        .from('shop_items')
        .insert([itemData]);
      
      if (error) throw error;

      // Log admin action
      await supabase.from('admin_logs').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action: 'create_shop_item',
        target_type: 'shop_item',
        details: itemData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shop-items'] });
      toast.success("Article créé avec succès");
      setShowCreateDialog(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erreur lors de la création");
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, itemData }: { id: string, itemData: any }) => {
      const { error } = await supabase
        .from('shop_items')
        .update(itemData)
        .eq('id', id);
      
      if (error) throw error;

      // Log admin action
      await supabase.from('admin_logs').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action: 'update_shop_item',
        target_type: 'shop_item',
        target_id: id,
        details: itemData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shop-items'] });
      toast.success("Article mis à jour");
      setShowEditDialog(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('shop_items')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;

      // Log admin action
      await supabase.from('admin_logs').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action: 'delete_shop_item',
        target_type: 'shop_item',
        target_id: itemId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shop-items'] });
      toast.success("Article supprimé");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    }
  });

  const resetForm = () => {
    setFormData({ 
      name: "", 
      description: "", 
      price: 0, 
      category: "pack", 
      image_url: "", 
      is_vip_only: false 
    });
    setSelectedItem(null);
  };

  const handleCreateItem = () => {
    createItemMutation.mutate(formData);
  };

  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image_url: item.image_url || "",
      is_vip_only: item.is_vip_only || false
    });
    setShowEditDialog(true);
  };

  const handleUpdateItem = () => {
    if (!selectedItem) return;
    updateItemMutation.mutate({ id: selectedItem.id, itemData: formData });
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      deleteItemMutation.mutate(itemId);
    }
  };

  const ItemForm = ({ isEdit = false }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nom de l'article"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description de l'article"
        />
      </div>
      <div>
        <Label htmlFor="price">Prix (BradCoins)</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
        />
      </div>
      <div>
        <Label htmlFor="category">Catégorie</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pack">Pack</SelectItem>
            <SelectItem value="skin">Skin</SelectItem>
            <SelectItem value="emote">Emote</SelectItem>
            <SelectItem value="vbucks">V-Bucks</SelectItem>
            <SelectItem value="accessory">Accessoire</SelectItem>
          </SelectContent>
        </Select>
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
      <div className="flex items-center space-x-2">
        <Switch
          id="is_vip_only"
          checked={formData.is_vip_only}
          onCheckedChange={(checked) => setFormData({ ...formData, is_vip_only: checked })}
        />
        <Label htmlFor="is_vip_only">VIP uniquement</Label>
      </div>
      <Button 
        onClick={isEdit ? handleUpdateItem : handleCreateItem} 
        className="w-full"
      >
        {isEdit ? "Mettre à jour" : "Créer"} l'article
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Gestion de la Boutique
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Article
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un nouvel article</DialogTitle>
                </DialogHeader>
                <ItemForm />
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
                  <TableHead>Article</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shopItems?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-yellow-600">
                        {item.price} BC
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.is_vip_only ? (
                        <Badge variant="secondary">
                          <Crown className="h-3 w-3 mr-1" />
                          VIP
                        </Badge>
                      ) : (
                        <Badge variant="outline">Public</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
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

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'article</DialogTitle>
          </DialogHeader>
          <ItemForm isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminShop;
