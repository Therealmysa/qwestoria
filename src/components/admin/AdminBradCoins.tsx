
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminBradCoins = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    bradcoins_amount: 0,
    price_cents: 0,
    is_active: true
  });
  const queryClient = useQueryClient();

  const { data: pricingPlans, isLoading } = useQuery({
    queryKey: ['admin-bradcoins-pricing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bradcoins_pricing')
        .select('*')
        .order('price_cents', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: purchases } = useQuery({
    queryKey: ['admin-bradcoins-purchases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bradcoins_purchases')
        .select(`
          *,
          bradcoins_pricing(name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  const createPricingMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('bradcoins_pricing')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bradcoins-pricing'] });
      toast.success("Pricing créé avec succès");
      setShowCreateDialog(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erreur lors de la création");
    }
  });

  const updatePricingMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { error } = await supabase
        .from('bradcoins_pricing')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bradcoins-pricing'] });
      toast.success("Pricing mis à jour");
      setEditingItem(null);
      resetForm();
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    }
  });

  const deletePricingMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bradcoins_pricing')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bradcoins-pricing'] });
      toast.success("Pricing supprimé");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      bradcoins_amount: 0,
      price_cents: 0,
      is_active: true
    });
  };

  const handleSubmit = () => {
    if (editingItem) {
      updatePricingMutation.mutate({ id: editingItem.id, ...formData });
    } else {
      createPricingMutation.mutate(formData);
    }
  };

  const openEditDialog = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      bradcoins_amount: item.bradcoins_amount,
      price_cents: item.price_cents,
      is_active: item.is_active
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Total Vendu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {purchases?.filter(p => p.status === 'completed').length || 0}
            </div>
            <p className="text-sm text-gray-500">Achats completés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenus BradCoins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{((purchases?.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.price_paid_cents, 0) || 0) / 100).toFixed(2)}
            </div>
            <p className="text-sm text-gray-500">Total des revenus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>BradCoins Distribués</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(purchases?.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.bradcoins_amount, 0) || 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">BradCoins vendus</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Gestion des Prix BradCoins
            <Dialog open={showCreateDialog || !!editingItem} onOpenChange={(open) => {
              if (!open) {
                setShowCreateDialog(false);
                setEditingItem(null);
                resetForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Pack
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Modifier le pack' : 'Créer un nouveau pack'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom du pack</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Pack Starter"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bradcoins_amount">Nombre de BradCoins</Label>
                    <Input
                      id="bradcoins_amount"
                      type="number"
                      value={formData.bradcoins_amount}
                      onChange={(e) => setFormData({ ...formData, bradcoins_amount: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price_cents">Prix (en centimes)</Label>
                    <Input
                      id="price_cents"
                      type="number"
                      value={formData.price_cents}
                      onChange={(e) => setFormData({ ...formData, price_cents: parseInt(e.target.value) || 0 })}
                      placeholder="100 (= 1€)"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Prix affiché: €{(formData.price_cents / 100).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Actif</Label>
                  </div>
                  <Button onClick={handleSubmit} className="w-full">
                    {editingItem ? 'Mettre à jour' : 'Créer'}
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
                  <TableHead>Pack</TableHead>
                  <TableHead>BradCoins</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Ratio</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingPlans?.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {plan.bradcoins_amount.toLocaleString()} BC
                      </Badge>
                    </TableCell>
                    <TableCell>€{(plan.price_cents / 100).toFixed(2)}</TableCell>
                    <TableCell>
                      {Math.round(plan.bradcoins_amount / (plan.price_cents / 100))} BC/€
                    </TableCell>
                    <TableCell>
                      <Badge variant={plan.is_active ? "default" : "secondary"}>
                        {plan.is_active ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(plan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePricingMutation.mutate(plan.id)}
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

export default AdminBradCoins;
