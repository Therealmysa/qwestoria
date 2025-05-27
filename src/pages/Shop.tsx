
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Search, Filter, Coins, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import AdBanner from "@/components/advertisements/AdBanner";
import BradCoinsShop from "@/components/shop/BradCoinsShop";
import VipUpgrade from "@/components/vip/VipUpgrade";
import ShopItems from "@/components/shop/ShopItems";

const Shop = () => {
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: bradCoinsBalance, refetch: refetchBalance } = useQuery({
    queryKey: ['brad-coins', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      console.log('Fetching BradCoins balance for user:', user.id);
      const { data, error } = await supabase
        .from('brad_coins')
        .select('balance')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching BradCoins:', error);
        return 0;
      }
      console.log('BradCoins balance:', data?.balance || 0);
      return data?.balance || 0;
    },
    enabled: !!user?.id,
  });

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
                  Découvrez nos articles exclusifs, achetez des BradCoins et passez Premium/VIP.
                </CardDescription>
              </CardHeader>
            </Card>

            <Tabs defaultValue="items" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="items">Articles</TabsTrigger>
                <TabsTrigger value="bradcoins">
                  <Coins className="h-4 w-4 mr-2" />
                  BradCoins
                </TabsTrigger>
                <TabsTrigger value="premium">
                  <Crown className="h-4 w-4 mr-2" />
                  Premium/VIP
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="items" className="space-y-6">
                <ShopItems />
              </TabsContent>

              <TabsContent value="bradcoins">
                <BradCoinsShop />
              </TabsContent>

              <TabsContent value="premium">
                <VipUpgrade />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => refetchBalance()}
                >
                  Actualiser
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AdBanner position="popup" maxAds={1} />
    </div>
  );
};

export default Shop;
