
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Coins, Crown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AdBanner from "@/components/advertisements/AdBanner";
import BradCoinsShop from "@/components/shop/BradCoinsShop";
import VipUpgrade from "@/components/vip/VipUpgrade";
import ShopItems from "@/components/shop/ShopItems";
import { useBradCoins } from "@/hooks/useBradCoins";

const Shop = () => {
  const { user, profile } = useAuth();
  const { balance: bradCoinsBalance, refetch: refetchBalance } = useBradCoins();

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
            <Card className="mb-8 bg-gradient-to-br from-purple-500/20 to-purple-500/10 dark:from-purple-400/20 dark:to-purple-400/5 backdrop-blur-sm shadow-lg hover:shadow-xl border border-gray-200 dark:border-white/10 transition-all duration-300">
              <CardHeader className="flex flex-col space-y-3">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-amber-500 dark:from-white dark:via-[#f1c40f] dark:to-[#9b87f5]">
                  <ShoppingBag className="h-5 w-5 text-purple-600 dark:text-[#9b87f5]" />
                  Boutique
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Découvrez nos articles exclusifs, achetez des BradCoins et passez Premium/VIP.
                </CardDescription>
              </CardHeader>
            </Card>

            <Tabs defaultValue="items" className="w-full">
              <TabsList className="mb-4 bg-gradient-to-r from-teal-500/20 to-teal-500/10 dark:from-teal-400/20 dark:to-teal-400/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10">
                <TabsTrigger value="items" className="data-[state=active]:bg-white/90 dark:data-[state=active]:bg-slate-700/50">Articles</TabsTrigger>
                <TabsTrigger value="bradcoins" className="flex items-center gap-2 data-[state=active]:bg-white/90 dark:data-[state=active]:bg-slate-700/50">
                  <Coins className="h-4 w-4" />
                  BradCoins
                </TabsTrigger>
                <TabsTrigger value="premium" className="flex items-center gap-2 data-[state=active]:bg-white/90 dark:data-[state=active]:bg-slate-700/50">
                  <Crown className="h-4 w-4" />
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
            
            <Card className="bg-gradient-to-br from-amber-500/20 to-amber-500/10 dark:from-amber-400/20 dark:to-amber-400/5 backdrop-blur-sm shadow-lg hover:shadow-xl border border-gray-200 dark:border-white/10 transition-all duration-300 transform hover:scale-[1.02]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-amber-500 dark:from-white dark:via-[#f1c40f] dark:to-[#9b87f5]">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  BradCoins
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Votre solde actuel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-1 text-gray-900 dark:text-white">
                  {bradCoinsBalance}
                  <Coins className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Utilisez vos BradCoins pour acheter des articles exclusifs dans la boutique.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 bg-white/70 hover:bg-white/90 dark:bg-slate-700/50 dark:hover:bg-slate-700/70 backdrop-blur-sm border-gray-200 dark:border-slate-600/30"
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
