
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VipUpgrade from "@/components/vip/VipUpgrade";
import BradCoinsShop from "@/components/shop/BradCoinsShop";
import ShopItems from "@/components/shop/ShopItems";
import { Coins, Crown, ShoppingBag } from "lucide-react";

const Shop = () => {
  const [activeTab, setActiveTab] = useState("items");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-[#0a0a12] dark:via-[#1a1625] dark:to-[#2a1f40] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Boutique Qwestoria
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Découvrez nos articles exclusifs et devenez Premium ou VIP
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/90 dark:bg-black/20 backdrop-blur-md">
              <TabsTrigger 
                value="items" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#9b87f5] data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <ShoppingBag className="h-4 w-4" />
                Articles
              </TabsTrigger>
              <TabsTrigger 
                value="bradcoins"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#9b87f5] data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <Coins className="h-4 w-4" />
                BradCoins
              </TabsTrigger>
              <TabsTrigger 
                value="premium"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#9b87f5] data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <Crown className="h-4 w-4" />
                Premium
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="items" className="space-y-6">
            <ShopItems />
          </TabsContent>

          <TabsContent value="bradcoins" className="space-y-6">
            <BradCoinsShop />
          </TabsContent>

          <TabsContent value="premium" className="space-y-6">
            <VipUpgrade />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Shop;
