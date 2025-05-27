
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
import { Search, Plus, Edit, Trash2, Eye, MousePointer, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminAdvertisements = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: advertisements, isLoading } = useQuery({
    queryKey: ['admin-advertisements', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['advertisements-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('advertisements')
        .select('click_count, impression_count, is_active');

      if (error) throw error;

      const activeAds = data.filter(ad => ad.is_active).length;
      const totalClicks = data.reduce((sum, ad) => sum + ad.click_count, 0);
      const totalImpressions = data.reduce((sum, ad) => sum + ad.impression_count, 0);
      const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;

      return {
        activeAds,
        totalClicks,
        totalImpressions,
        ctr
      };
    }
  });

  const deleteAdMutation = useMutation({
    mutationFn: async (adId: string) => {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', adId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-advertisements'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements-stats'] });
      toast.success("Publicité supprimée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    }
  });

  const updateAdMutation = useMutation({
    mutationFn: async ({ adId, updates }: { adId: string, updates: any }) => {
      const { error } = await supabase
        .from('advertisements')
        .update(updates)
        .eq('id', adId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-advertisements'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements-stats'] });
      toast.success("Publicité mise à jour avec succès");
      setSelectedAd(null);
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    }
  });

  const handleAdUpdate = (updates: any) => {
    if (selectedAd) {
      updateAdMutation.mutate({ adId: selectedAd.id, updates });
    }
  };

  const getCTR = (clicks: number, impressions: number) => {
    if (impressions === 0) return "0.00";
    return ((clicks / impressions) * 100).toFixed(2);
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 sm:h-8 w-6 sm:w-8 text-green-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Pubs actives</p>
                <p className="text-lg sm:text-2xl font-bold">{stats?.activeAds || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center space-x-2">
              <MousePointer className="h-6 sm:h-8 w-6 sm:w-8 text-blue-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Total clics</p>
                <p className="text-lg sm:text-2xl font-bold">{stats?.totalClicks?.toLocaleString() || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-6 sm:h-8 w-6 sm:w-8 text-purple-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Impressions</p>
                <p className="text-lg sm:text-2xl font-bold">{stats?.totalImpressions?.toLocaleString() || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 sm:h-8 w-6 sm:w-8 text-orange-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">CTR moyen</p>
                <p className="text-lg sm:text-2xl font-bold">{stats?.ctr}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-base sm:text-xl">Gestion des Publicités</span>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une publicité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Pub
              </Button>
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
                {advertisements?.map((ad) => (
                  <Card key={ad.id} className="p-3 dark:bg-slate-700/20 border border-slate-200 dark:border-slate-600/30">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        {ad.image_url && (
                          <img
                            src={ad.image_url}
                            alt={ad.title}
                            className="h-12 w-12 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm mb-1 line-clamp-1">{ad.title}</div>
                          <div className="text-xs text-gray-500 mb-2 line-clamp-2">{ad.description}</div>
                          <div className="flex flex-wrap gap-1">
                            {ad.is_active ? (
                              <Badge className="bg-green-500 text-white text-xs">Actif</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Inactif</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              CTR: {getCTR(ad.click_count, ad.impression_count)}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0 ml-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAd(ad)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-md mx-auto">
                            <DialogHeader>
                              <DialogTitle className="text-lg">Gérer {ad.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="is_active" className="text-sm">Actif</Label>
                                <Switch
                                  id="is_active"
                                  checked={ad.is_active}
                                  onCheckedChange={(checked) =>
                                    handleAdUpdate({ is_active: checked })
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-gray-50 dark:bg-slate-600/10 p-2 rounded">
                                  <div className="text-gray-500 dark:text-gray-400 mb-1">Clics</div>
                                  <div className="font-semibold">{ad.click_count}</div>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-600/10 p-2 rounded">
                                  <div className="text-gray-500 dark:text-gray-400 mb-1">Vues</div>
                                  <div className="font-semibold">{ad.impression_count}</div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteAdMutation.mutate(ad.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-gray-50 dark:bg-slate-600/10 p-2 rounded text-center">
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Clics</div>
                        <div className="font-semibold">{ad.click_count}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-600/10 p-2 rounded text-center">
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Vues</div>
                        <div className="font-semibold">{ad.impression_count}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-600/10 p-2 rounded text-center">
                        <div className="text-gray-500 dark:text-gray-400 mb-1">CTR</div>
                        <div className="font-semibold">{getCTR(ad.click_count, ad.impression_count)}%</div>
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
                      <TableHead>Publicité</TableHead>
                      <TableHead>Performances</TableHead>
                      <TableHead>CTR</TableHead>
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
                              <div className="text-sm text-gray-500 max-w-xs truncate">{ad.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-2">
                              <MousePointer className="h-3 w-3" />
                              <span>{ad.click_count} clics</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Eye className="h-3 w-3" />
                              <span>{ad.impression_count} vues</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {getCTR(ad.click_count, ad.impression_count)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {ad.is_active ? (
                            <Badge className="bg-green-500 text-white text-xs">Actif</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Inactif</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedAd(ad)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Gérer {ad.title}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="is_active"
                                      checked={ad.is_active}
                                      onCheckedChange={(checked) =>
                                        handleAdUpdate({ is_active: checked })
                                      }
                                    />
                                    <Label htmlFor="is_active">Actif</Label>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm">Clics</Label>
                                      <p className="font-mono">{ad.click_count}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm">Impressions</Label>
                                      <p className="font-mono">{ad.impression_count}</p>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
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
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAdvertisements;
