
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, Target, Eye, MousePointer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdCreateForm from "./ads/AdCreateForm";
import AdEditForm from "./ads/AdEditForm";

const AdminAdvertisements = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
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
      const { data: ads, error } = await supabase
        .from('advertisements')
        .select('is_active, impression_count, click_count');

      if (error) throw error;

      const totalAds = ads.length;
      const activeAds = ads.filter(ad => ad.is_active).length;
      const totalImpressions = ads.reduce((sum, ad) => sum + (ad.impression_count || 0), 0);
      const totalClicks = ads.reduce((sum, ad) => sum + (ad.click_count || 0), 0);

      return {
        totalAds,
        activeAds,
        totalImpressions,
        totalClicks
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getPageLabel = (url: string) => {
    const pageMap: { [key: string]: string } = {
      "/": "Accueil",
      "/missions": "Missions",
      "/blog": "Blog",
      "/shop": "Boutique",
      "/teammates": "Coéquipiers",
      "/messages": "Messagerie",
      "/leaderboard": "Classement",
      "/fortnite-shop": "Boutique Fortnite",
      "/dashboard": "Dashboard",
      "/profile": "Profil"
    };
    return pageMap[url] || url;
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-6 sm:h-8 w-6 sm:w-8 text-blue-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Total publicités</p>
                <p className="text-lg sm:text-2xl font-bold">{stats?.totalAds || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border-slate-600/15">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-6 sm:h-8 w-6 sm:w-8 text-green-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Actives</p>
                <p className="text-lg sm:text-2xl font-bold">{stats?.activeAds || 0}</p>
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
              <MousePointer className="h-6 sm:h-8 w-6 sm:w-8 text-orange-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Clics</p>
                <p className="text-lg sm:text-2xl font-bold">{stats?.totalClicks?.toLocaleString() || 0}</p>
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
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Publicité
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Créer une nouvelle publicité</DialogTitle>
                  </DialogHeader>
                  <AdCreateForm onClose={() => setShowCreateDialog(false)} />
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
                          <div className="font-medium text-sm mb-1 line-clamp-2">{ad.title}</div>
                          <div className="text-xs text-gray-500 mb-2">Vers: {getPageLabel(ad.link_url)}</div>
                          <div className="flex flex-wrap gap-1">
                            {ad.is_active ? (
                              <Badge className="bg-green-500 text-white text-xs">Active</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Inactive</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">{ad.position}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0 ml-2">
                        <Dialog open={showEditDialog && selectedAd?.id === ad.id} onOpenChange={(open) => {
                          setShowEditDialog(open);
                          if (!open) setSelectedAd(null);
                        }}>
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
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Modifier la publicité</DialogTitle>
                            </DialogHeader>
                            <AdEditForm ad={selectedAd} onClose={() => setShowEditDialog(false)} />
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
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 dark:bg-slate-600/10 p-2 rounded">
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Impressions</div>
                        <div className="font-semibold">{ad.impression_count || 0}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-600/10 p-2 rounded">
                        <div className="text-gray-500 dark:text-gray-400 mb-1">Clics</div>
                        <div className="font-semibold">{ad.click_count || 0}</div>
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
                      <TableHead>Page</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Statistiques</TableHead>
                      <TableHead>Date</TableHead>
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
                              <div className="font-medium max-w-xs truncate">{ad.title}</div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">{ad.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{getPageLabel(ad.link_url)}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{ad.position}</Badge>
                        </TableCell>
                        <TableCell>
                          {ad.is_active ? (
                            <Badge className="bg-green-500 text-white text-xs">Active</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{ad.impression_count || 0} vues</div>
                            <div>{ad.click_count || 0} clics</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{formatDate(ad.created_at)}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog open={showEditDialog && selectedAd?.id === ad.id} onOpenChange={(open) => {
                              setShowEditDialog(open);
                              if (!open) setSelectedAd(null);
                            }}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedAd(ad)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Modifier la publicité</DialogTitle>
                                </DialogHeader>
                                <AdEditForm ad={selectedAd} onClose={() => setShowEditDialog(false)} />
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
