
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
import { Search, Edit, Crown, Users, Calendar, Euro } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminSubscriptions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['admin-subscriptions', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('subscriptions')
        .select('*, profiles(username, avatar_url)')
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      let filteredData = data;
      if (searchTerm) {
        filteredData = data.filter((item) => 
          item.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return filteredData;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['subscriptions-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('status, amount');

      if (error) throw error;

      const activeSubscriptions = data.filter(sub => sub.status === 'active').length;
      const totalRevenue = data.reduce((sum, sub) => sum + (sub.amount || 0), 0);
      const totalSubscriptions = data.length;

      return {
        activeSubscriptions,
        totalRevenue,
        totalSubscriptions
      };
    }
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ subscriptionId, updates }: { subscriptionId: string, updates: any }) => {
      const { error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', subscriptionId);
      
      if (error) throw error;

      // Log admin action
      await supabase.from('admin_logs').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action: 'update_subscription',
        target_type: 'subscription',
        target_id: subscriptionId,
        details: updates
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions-stats'] });
      toast.success("Abonnement mis à jour avec succès");
      setSelectedSubscription(null);
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    }
  });

  const handleSubscriptionUpdate = (updates: any) => {
    if (selectedSubscription) {
      updateSubscriptionMutation.mutate({ subscriptionId: selectedSubscription.id, updates });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white text-xs">Actif</Badge>;
      case 'canceled':
        return <Badge variant="destructive" className="text-xs">Annulé</Badge>;
      case 'past_due':
        return <Badge variant="secondary" className="text-xs">En retard</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
        <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Abonnements actifs</p>
                <p className="text-lg sm:text-2xl font-bold">{stats?.activeSubscriptions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center space-x-2">
              <Euro className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Revenus totaux</p>
                <p className="text-lg sm:text-2xl font-bold">€{stats?.totalRevenue?.toFixed(2) || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Total abonnements</p>
                <p className="text-lg sm:text-2xl font-bold">{stats?.totalSubscriptions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-base sm:text-xl">Gestion des Abonnements</span>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
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
                {subscriptions?.map((subscription) => (
                  <Card key={subscription.id} className="p-3 dark:bg-slate-700/20 border border-slate-200 dark:border-slate-600/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {subscription.profiles?.avatar_url ? (
                          <img
                            src={subscription.profiles.avatar_url}
                            alt={subscription.profiles.username}
                            className="h-10 w-10 rounded-full flex-shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {subscription.profiles?.username?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">{subscription.profiles?.username}</div>
                          <div className="text-xs text-gray-500">{subscription.plan_type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getStatusBadge(subscription.status)}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedSubscription(subscription)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-md mx-auto">
                            <DialogHeader>
                              <DialogTitle className="text-lg">Gérer {subscription.profiles?.username}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="is_active" className="text-sm">Statut actif</Label>
                                <Switch
                                  id="is_active"
                                  checked={subscription.status === 'active'}
                                  onCheckedChange={(checked) =>
                                    handleSubscriptionUpdate({ status: checked ? 'active' : 'canceled' })
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-gray-50 dark:bg-slate-600/10 p-2 rounded">
                                  <div className="text-gray-500 dark:text-gray-400 mb-1">Montant</div>
                                  <div className="font-semibold">€{subscription.amount}</div>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-600/10 p-2 rounded">
                                  <div className="text-gray-500 dark:text-gray-400 mb-1">Début</div>
                                  <div className="font-semibold">{formatDate(subscription.start_date)}</div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 dark:bg-slate-600/10 p-2 rounded">
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Plan</div>
                        <div className="font-semibold">{subscription.plan_type}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-600/10 p-2 rounded">
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Expiration</div>
                        <div className="font-semibold">
                          {subscription.end_date ? formatDate(subscription.end_date) : 'Illimité'}
                        </div>
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
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions?.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {subscription.profiles?.avatar_url ? (
                              <img
                                src={subscription.profiles.avatar_url}
                                alt={subscription.profiles.username}
                                className="h-8 w-8 rounded-full"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                                {subscription.profiles?.username?.[0]?.toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{subscription.profiles?.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            <Crown className="h-3 w-3 mr-1" />
                            {subscription.plan_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(subscription.status)}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono">€{subscription.amount}</span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(subscription.start_date)}
                            {subscription.end_date && (
                              <div className="text-xs text-gray-500">
                                → {formatDate(subscription.end_date)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedSubscription(subscription)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Gérer
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Gérer {subscription.profiles?.username}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id="is_active"
                                    checked={subscription.status === 'active'}
                                    onCheckedChange={(checked) =>
                                      handleSubscriptionUpdate({ status: checked ? 'active' : 'canceled' })
                                    }
                                  />
                                  <Label htmlFor="is_active">Statut actif</Label>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm">Montant</Label>
                                    <p className="font-mono">€{subscription.amount}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm">Plan</Label>
                                    <p>{subscription.plan_type}</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubscriptions;
