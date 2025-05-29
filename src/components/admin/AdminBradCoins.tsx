import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Edit, Coins, TrendingUp, TrendingDown, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminBradCoins = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [coinAmount, setCoinAmount] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: coinBalances, isLoading } = useQuery({
    queryKey: ['admin-bradcoins', searchTerm],
    queryFn: async () => {
      console.log('Fetching BradCoins balances for admin...');
      
      // Récupérer tous les utilisateurs avec leurs profils
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Récupérer les soldes BradCoins
      const { data: bradCoins, error: bradCoinsError } = await supabase
        .from('brad_coins')
        .select('user_id, balance');

      if (bradCoinsError) {
        console.error('Error fetching BradCoins:', bradCoinsError);
        throw bradCoinsError;
      }

      // Combiner les données
      const combinedData = profiles.map(profile => {
        const bradCoinAccount = bradCoins.find(bc => bc.user_id === profile.id);
        return {
          user_id: profile.id,
          balance: bradCoinAccount?.balance || 0,
          profiles: {
            username: profile.username,
            avatar_url: profile.avatar_url
          }
        };
      });

      // Filtrer par terme de recherche si nécessaire
      let filteredData = combinedData;
      if (searchTerm) {
        filteredData = combinedData.filter((item) => 
          item.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Trier par solde décroissant
      filteredData.sort((a, b) => b.balance - a.balance);

      console.log('BradCoins data fetched:', filteredData.length, 'users');
      return filteredData;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['bradcoins-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brad_coins')
        .select('balance');

      if (error) throw error;

      const totalCoins = data.reduce((sum, coin) => sum + coin.balance, 0);
      const totalUsers = data.length;
      const averageBalance = totalUsers > 0 ? Math.round(totalCoins / totalUsers) : 0;

      return {
        totalCoins,
        totalUsers,
        averageBalance
      };
    }
  });

  const updateCoinsMutation = useMutation({
    mutationFn: async ({ userId, amount, operation }: { userId: string, amount: number, operation: 'add' | 'subtract' | 'set' }) => {
      console.log('Updating BradCoins:', { userId, amount, operation });

      if (operation === 'add' || operation === 'subtract') {
        // Utiliser la fonction edge pour ajouter/soustraire
        const finalAmount = operation === 'subtract' ? -amount : amount;
        
        const { data, error } = await supabase.functions.invoke('update-bradcoins', {
          body: {
            user_id: userId,
            amount: finalAmount
          }
        });

        if (error) throw error;
        
        console.log('BradCoins updated via edge function:', data);
      } else if (operation === 'set') {
        // Pour "set", on fait une mise à jour directe
        // D'abord, s'assurer qu'un compte existe
        const { error: upsertError } = await supabase
          .from('brad_coins')
          .upsert({ 
            user_id: userId, 
            balance: amount,
            last_updated: new Date().toISOString()
          });

        if (upsertError) throw upsertError;
      }

      // Log admin action
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('admin_logs').insert({
        admin_id: user?.id,
        action: `${operation}_bradcoins`,
        target_type: 'user',
        target_id: userId,
        details: { amount, operation }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bradcoins'] });
      queryClient.invalidateQueries({ queryKey: ['bradcoins-stats'] });
      queryClient.invalidateQueries({ queryKey: ['brad-coins-balance'] });
      toast.success("BradCoins mis à jour avec succès");
      setSelectedUser(null);
      setCoinAmount("");
      setShowAddDialog(false);
    },
    onError: (error) => {
      console.error('Error updating BradCoins:', error);
      toast.error("Erreur lors de la mise à jour");
    }
  });

  const handleCoinsUpdate = (operation: 'add' | 'subtract' | 'set') => {
    const amount = parseInt(coinAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error("Montant invalide");
      return;
    }

    if (selectedUser) {
      updateCoinsMutation.mutate({ userId: selectedUser.user_id, amount, operation });
    }
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
        <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center space-x-2">
              <Coins className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Total BradCoins</p>
                <p className="text-lg sm:text-2xl font-bold">{stats?.totalCoins?.toLocaleString() || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Utilisateurs avec BradCoins</p>
                <p className="text-lg sm:text-2xl font-bold">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Moyenne par utilisateur</p>
                <p className="text-lg sm:text-2xl font-bold">{stats?.averageBalance || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-base sm:text-xl">Gestion des BradCoins</span>
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
                {coinBalances?.map((balance) => (
                  <Card key={balance.user_id} className="p-3 dark:bg-slate-700/20 border border-slate-200 dark:border-slate-600/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {balance.profiles?.avatar_url ? (
                          <img
                            src={balance.profiles.avatar_url}
                            alt={balance.profiles.username}
                            className="h-10 w-10 rounded-full flex-shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {balance.profiles?.username?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">{balance.profiles?.username}</div>
                          <div className="text-xs text-gray-500">BradCoins</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className="text-sm font-mono">
                          <Coins className="h-3 w-3 mr-1" />
                          {balance.balance}
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUser(balance)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-md mx-auto">
                            <DialogHeader>
                              <DialogTitle className="text-lg">Gérer BradCoins - {balance.profiles?.username}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <Label htmlFor="coin_amount" className="text-sm">Montant</Label>
                                <Input
                                  id="coin_amount"
                                  type="number"
                                  value={coinAmount}
                                  onChange={(e) => setCoinAmount(e.target.value)}
                                  placeholder="Entrez le montant"
                                  className="mt-1"
                                />
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                <Button 
                                  onClick={() => handleCoinsUpdate('add')}
                                  className="bg-green-600 hover:bg-green-700 text-white text-sm"
                                  size="sm"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Ajouter
                                </Button>
                                <Button 
                                  onClick={() => handleCoinsUpdate('subtract')}
                                  variant="destructive"
                                  size="sm"
                                  className="text-sm"
                                >
                                  <TrendingDown className="h-4 w-4 mr-1" />
                                  Retirer
                                </Button>
                                <Button 
                                  onClick={() => handleCoinsUpdate('set')}
                                  variant="outline"
                                  size="sm"
                                  className="text-sm"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Définir
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500">
                                Solde actuel: {balance.balance} BradCoins
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
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
                      <TableHead>Balance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coinBalances?.map((balance) => (
                      <TableRow key={balance.user_id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {balance.profiles?.avatar_url ? (
                              <img
                                src={balance.profiles.avatar_url}
                                alt={balance.profiles.username}
                                className="h-8 w-8 rounded-full"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                                {balance.profiles?.username?.[0]?.toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{balance.profiles?.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            <Coins className="h-3 w-3 mr-1" />
                            {balance.balance}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUser(balance)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Gérer
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Gérer BradCoins - {balance.profiles?.username}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="coin_amount">Montant</Label>
                                  <Input
                                    id="coin_amount"
                                    type="number"
                                    value={coinAmount}
                                    onChange={(e) => setCoinAmount(e.target.value)}
                                    placeholder="Entrez le montant"
                                  />
                                </div>
                                <div className="flex space-x-2">
                                  <Button 
                                    onClick={() => handleCoinsUpdate('add')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Ajouter
                                  </Button>
                                  <Button 
                                    onClick={() => handleCoinsUpdate('subtract')}
                                    variant="destructive"
                                  >
                                    <TrendingDown className="h-4 w-4 mr-2" />
                                    Retirer
                                  </Button>
                                  <Button 
                                    onClick={() => handleCoinsUpdate('set')}
                                    variant="outline"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Définir
                                  </Button>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Solde actuel: {balance.balance} BradCoins
                                </p>
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

export default AdminBradCoins;
