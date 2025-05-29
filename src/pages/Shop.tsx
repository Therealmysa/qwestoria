
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
import BradCoinsDisplay from "@/components/shop/BradCoinsDisplay";

const Shop = () => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 dark:from-purple-900 dark:via-purple-800 dark:to-purple-900">
      {/* Banner Ad */}
      <div className="container mx-auto px-4 pt-6">
        <AdBanner position="banner" maxAds={1} />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="mb-8 dark:bg-purple-800/20 dark:backdrop-blur-xl dark:border dark:border-purple-500/20 bg-white/90 backdrop-blur-md shadow-xl dark:shadow-purple-500/20 transform hover:scale-[1.02] transition-all duration-300">
              <CardHeader className="flex flex-col space-y-3">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-500">
                  <ShoppingBag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Boutique
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Découvrez nos articles exclusifs, achetez des BradCoins et passez Premium/VIP.
                </CardDescription>
              </CardHeader>
            </Card>

            <Tabs defaultValue="items" className="w-full">
              <TabsList className="mb-4 dark:bg-purple-800/20 dark:backdrop-blur-xl dark:border dark:border-purple-500/20 bg-purple-50/70 backdrop-blur-md">
                <TabsTrigger value="items" className="data-[state=active]:bg-white/90 dark:data-[state=active]:bg-purple-700/50">Articles</TabsTrigger>
                <TabsTrigger value="bradcoins" className="flex items-center gap-2 data-[state=active]:bg-white/90 dark:data-[state=active]:bg-purple-700/50">
                  <Coins className="h-4 w-4" />
                  BradCoins
                </TabsTrigger>
                <TabsTrigger value="premium" className="flex items-center gap-2 data-[state=active]:bg-white/90 dark:data-[state=active]:bg-purple-700/50">
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
            
            <BradCoinsDisplay />
          </div>
        </div>
      </div>

      <AdBanner position="popup" maxAds={1} />
    </div>
  );
};

export default Shop;
