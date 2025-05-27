
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
import { Search, Crown, Shield, Star, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminUsersProps {
  isOwner: boolean;
}

const AdminUsers = ({ isOwner }: AdminUsersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*, brad_coins(balance)')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('username', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string, updates: any }) => {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      
      if (error) throw error;

      // Log admin action
      await supabase.from('admin_logs').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action: 'update_user',
        target_type: 'user',
        target_id: userId,
        details: updates
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success("Utilisateur mis à jour avec succès");
      setSelectedUser(null);
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    }
  });

  const handleUserUpdate = (updates: any) => {
    if (selectedUser) {
      updateUserMutation.mutate({ userId: selectedUser.id, updates });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <span className="text-lg sm:text-xl">Gestion des Utilisateurs</span>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-2"></div>
              <p>Chargement...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Mobile Cards View - Hidden on larger screens */}
              <div className="block sm:hidden space-y-3 p-4">
                {users?.map((user) => (
                  <Card key={user.id} className="p-4 dark:bg-slate-700/20">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.username}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                            {user.username[0]?.toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-sm">{user.username}</div>
                          <div className="text-xs text-gray-500">{user.fortnite_username}</div>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                            disabled={user.is_owner}
                            className="h-8 w-8 p-0"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-w-md">
                          <DialogHeader>
                            <DialogTitle>Gérer {user.username}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {isOwner && !user.is_owner && (
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="is_admin"
                                  checked={user.is_admin}
                                  onCheckedChange={(checked) =>
                                    handleUserUpdate({ is_admin: checked })
                                  }
                                />
                                <Label htmlFor="is_admin">Administrateur</Label>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="is_vip"
                                checked={user.is_vip}
                                onCheckedChange={(checked) =>
                                  handleUserUpdate({ is_vip: checked })
                                }
                              />
                              <Label htmlFor="is_vip">Statut VIP</Label>
                            </div>
                            {!isOwner && user.is_admin && (
                              <p className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded">
                                Seul le propriétaire peut modifier le statut administrateur.
                              </p>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">BradCoins:</span>
                        <span className="font-mono ml-1">{user.brad_coins?.[0]?.balance || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Inscription:</span>
                        <span className="ml-1">{new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {user.is_owner && (
                        <Badge variant="default" className="text-xs bg-yellow-500">
                          <Star className="h-3 w-3 mr-1" />
                          Propriétaire
                        </Badge>
                      )}
                      {user.is_admin && (
                        <Badge variant="destructive" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      {user.is_vip && (
                        <Badge variant="secondary" className="text-xs">
                          <Crown className="h-3 w-3 mr-1" />
                          VIP
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>BradCoins</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Inscription</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.username}
                                className="h-8 w-8 rounded-full"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                                {user.username[0]?.toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{user.username}</div>
                              <div className="text-sm text-gray-500">{user.fortnite_username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono">
                            {user.brad_coins?.[0]?.balance || 0}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {user.is_owner && (
                              <Badge variant="default" className="text-xs bg-yellow-500">
                                <Star className="h-3 w-3 mr-1" />
                                Propriétaire
                              </Badge>
                            )}
                            {user.is_admin && (
                              <Badge variant="destructive" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            )}
                            {user.is_vip && (
                              <Badge variant="secondary" className="text-xs">
                                <Crown className="h-3 w-3 mr-1" />
                                VIP
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                                disabled={user.is_owner}
                              >
                                Gérer
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Gérer {user.username}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                {isOwner && !user.is_owner && (
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="is_admin"
                                      checked={user.is_admin}
                                      onCheckedChange={(checked) =>
                                        handleUserUpdate({ is_admin: checked })
                                      }
                                    />
                                    <Label htmlFor="is_admin">Administrateur</Label>
                                  </div>
                                )}
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id="is_vip"
                                    checked={user.is_vip}
                                    onCheckedChange={(checked) =>
                                      handleUserUpdate({ is_vip: checked })
                                    }
                                  />
                                  <Label htmlFor="is_vip">Statut VIP</Label>
                                </div>
                                {!isOwner && user.is_admin && (
                                  <p className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded">
                                    Seul le propriétaire peut modifier le statut administrateur.
                                  </p>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
