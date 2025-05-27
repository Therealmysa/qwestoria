
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Search, Filter, Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import AdBanner from "@/components/advertisements/AdBanner";

const Shop = () => {
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: shopItems, isLoading } = useQuery({
    queryKey: ['shop-items', searchTerm, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('shop_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (selectedCategory !== "all") {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['shop-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shop_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  // Get brad coins balance separately
  const { data: bradCoinsBalance } = useQuery({
    queryKey: ['brad-coins', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { data, error } = await supabase
        .from('brad_coins')
        .select('balance')
        .eq('user_id', user.id)
        .single();
      if (error) return 0;
      return data?.balance || 0;
    },
    enabled: !!user?.id,
  });

  const handlePurchase = async (itemId: string, price: number) => {
    if (!user) {
      toast.error("Vous devez être connecté pour acheter des articles.");
      return;
    }

    if (!bradCoinsBalance || bradCoinsBalance < price) {
      toast.error("Vous n'avez pas assez de BradCoins.");
      return;
    }

    // Déclencher une fonction Edge pour effectuer l'achat
    const { data, error } = await supabase.functions.invoke('purchase-item', {
      body: {
        user_id: user.id,
        item_id: itemId,
        price: price
      }
    });

    if (error) {
      console.error("Erreur lors de l'achat:", error);
      toast.error("Erreur lors de l'achat. Veuillez réessayer.");
    } else {
      console.log("Achat réussi:", data);
      toast.success("Achat réussi !");
      // Revalider le profil utilisateur pour mettre à jour le solde de BradCoins
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900">
      {/* Banner Ad */}
      <div className="container mx-auto px-4 pt-6">
        <AdBanner position="banner" maxAds={1} />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="mb-8 dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border dark:border-slate-600/15 bg-white/90 backdrop-blur-md shadow-2xl dark:shadow-slate-500/20">
              <CardHeader className="flex flex-col space-y-3">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Boutique
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Découvrez nos articles exclusifs et améliorez votre expérience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Rechercher un article..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtrer
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>Tous</TabsTrigger>
                {categories?.map((category) => (
                  <TabsTrigger key={category.id} value={category.category} onClick={() => setSelectedCategory(category.category)}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  <div className="col-span-full text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-2"></div>
                    <p className="text-sm">Chargement des articles...</p>
                  </div>
                ) : (
                  shopItems?.map((item) => (
                    <Card key={item.id} className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border dark:border-slate-600/15 bg-white/90 backdrop-blur-md shadow-2xl dark:shadow-slate-500/20">
                      <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col space-y-4">
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold flex items-center gap-1">
                            <Coins className="h-4 w-4 text-yellow-500" />
                            {item.price}
                          </span>
                          <Button onClick={() => handlePurchase(item.id, item.price)}>Acheter</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sidebar Ads */}
            <AdBanner position="sidebar" maxAds={2} />
            
            <Card className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border dark:border-slate-600/15 bg-white/90 backdrop-blur-md shadow-2xl dark:shadow-slate-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  BradCoins
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Votre solde actuel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-1">
                  {bradCoinsBalance || 0}
                  <Coins className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Utilisez vos BradCoins pour acheter des articles exclusifs dans la boutique.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Popup Ads */}
      <AdBanner position="popup" maxAds={1} />
    </div>
  );
};

export default Shop;
