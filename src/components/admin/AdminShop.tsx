
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
import { Search, Plus, Edit, Trash2, ShoppingBag, Coins, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  is_vip_only: boolean;
  available_until?: string;
}

const AdminShop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    image_url: "",
    is_vip_only: false,
    available_until: ""
  });
  const queryClient = useQueryClient();

  const { data: shopItems, isLoading } = useQuery({
    queryKey: ['admin-shop-items', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('shop_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const createItemMutation = useMutation({
    mutationFn: async (itemData: any) => {
      const { error } = await supabase
        .from('shop_items')
        .insert([{
          ...itemData,
          available_until: itemData.available_until || null
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shop-items'] });
      toast.success("Article créé avec succès");
      setShowCreateDialog(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating item:', error);
      toast.error("Erreur lors de la création");
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, ...itemData }: any) => {
      const { error } = await supabase
        .from('shop_items')
        .update({
          ...itemData,
          available_until: itemData.available_until || null
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shop-items'] });
      toast.success("Article mis à jour avec succès");
      setShowEditDialog(false);
      setSelectedItem(null);
      resetForm();
    },
    onError: (error) => {
      console.error('Error updating item:', error);
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shop-items'] });
      toast.success("Article supprimé avec succès");
    },
    onError: (error) => {
      console.error('Error deleting item:', error);
      toast.error("Erreur lors de la suppression");
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      image_url: "",
      is_vip_only: false,
      available_until: ""
    });
  };

  const handleEdit = (item: ShopItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image_url: item.image_url || "",
      is_vip_only: item.is_vip_only,
      available_until: item.available_until ? new Date(item.available_until).toISOString().slice(0, 16) : ""
    });
    setShowEditDialog(true);
  };

  const handleSubmit = () => {
    if (selectedItem) {
      updateItemMutation.mutate({ id: selectedItem.id, ...formData });
    } else {
      createItemMutation.mutate(formData);
    }
  };

  const ShopItemForm = () => (
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
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="price">Prix (BradCoins)</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
          placeholder="Prix en BradCoins"
        />
      </div>
      <div>
        <Label htmlFor="category">Catégorie</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="Catégorie"
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
        <Label htmlFor="available_until">Disponible jusqu'à (optionnel)</Label>
        <Input
          id="available_until"
          type="datetime-local"
          value={formData.available_until}
          onChange={(e) => setFormData({ ...formData, available_until: e.target.value })}
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
          setSelectedItem(null);
        }}>
          Annuler
        </Button>
        <Button onClick={handleSubmit}>
          {selectedItem ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-3 sm:space-y-6">
      <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-base sm:text-xl">Gestion de la Boutique</span>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un article..."
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
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvel Article
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Créer un nouvel article</DialogTitle>
                  </DialogHeader>
                  <ShopItemForm />
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
                {shopItems?.map((item) => (
                  <Card key={item.id} className="p-3 dark:bg-slate-700/20 border border-slate-200 dark:border-slate-600/30">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-12 w-12 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm mb-1 line-clamp-1">{item.name}</div>
                          <div className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</div>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              <Coins className="h-3 w-3 mr-1" />
                              {item.price} BradCoins
                            </Badge>
                            {item.category && (
                              <Badge variant="secondary" className="text-xs">
                                <Package className="h-3 w-3 mr-1" />
                                {item.category}
                              </Badge>
                            )}
                            {item.is_vip_only && (
                              <Badge variant="outline" className="text-xs text-purple-600">VIP</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0 ml-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteItemMutation.mutate(item.id)}
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
                              <div className="text-sm text-gray-500 max-w-xs truncate">{item.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            <Coins className="h-3 w-3 mr-1" />
                            {item.price} BradCoins
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono">{item.category}</span>
                        </TableCell>
                        <TableCell>
                          {item.is_vip_only ? (
                            <Badge variant="secondary" className="text-xs text-purple-600">VIP</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-green-600">Public</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteItemMutation.mutate(item.id)}
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
                    <DialogTitle>Modifier l'article</DialogTitle>
                  </DialogHeader>
                  <ShopItemForm />
                </DialogContent>
              </Dialog>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminShop;
