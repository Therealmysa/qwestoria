
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Shield, Star, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminOperations } from "@/hooks/useAdminOperations";

interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  is_admin: boolean;
  is_vip: boolean;
  is_owner: boolean;
  created_at: string;
}

interface AdminUsersProps {
  isOwner: boolean;
}

const AdminUsers = ({ isOwner }: AdminUsersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { updateUserStatus, isUpdatingUserStatus } = useAdminOperations();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm],
    queryFn: async (): Promise<UserProfile[]> => {
      console.log('Fetching users for admin panel...');
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('username', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      console.log('Successfully fetched users:', data?.length || 0);
      return data || [];
    }
  });

  const handleToggleAdmin = (userId: string, currentStatus: boolean) => {
    if (confirm(`${currentStatus ? 'Retirer' : 'Accorder'} les droits administrateur à cet utilisateur ?`)) {
      console.log('Toggling admin status for user:', userId, 'new status:', !currentStatus);
      updateUserStatus({ userId, isAdmin: !currentStatus });
    }
  };

  const handleToggleVip = (userId: string, currentStatus: boolean) => {
    if (confirm(`${currentStatus ? 'Retirer' : 'Accorder'} le statut VIP à cet utilisateur ?`)) {
      console.log('Toggling VIP status for user:', userId, 'new status:', !currentStatus);
      updateUserStatus({ userId, isVip: !currentStatus });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <span>Gestion des Utilisateurs</span>
            <div className="relative flex-1 sm:w-64">
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
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.username}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {user.is_owner && (
                            <Badge variant="destructive" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Propriétaire
                            </Badge>
                          )}
                          {user.is_admin && (
                            <Badge variant="secondary" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                          {user.is_vip && (
                            <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600">
                              <Star className="h-3 w-3 mr-1" />
                              VIP
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(user.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!user.is_owner && (
                            <>
                              {isOwner && (
                                <Button
                                  variant={user.is_admin ? "destructive" : "outline"}
                                  size="sm"
                                  onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                                  disabled={isUpdatingUserStatus}
                                >
                                  {user.is_admin ? "Retirer Admin" : "Faire Admin"}
                                </Button>
                              )}
                              <Button
                                variant={user.is_vip ? "destructive" : "outline"}
                                size="sm"
                                onClick={() => handleToggleVip(user.id, user.is_vip)}
                                disabled={isUpdatingUserStatus}
                              >
                                {user.is_vip ? "Retirer VIP" : "Faire VIP"}
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
