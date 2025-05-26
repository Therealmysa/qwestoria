
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VipUpgrade from "@/components/vip/VipUpgrade";
import BradCoinsShop from "@/components/shop/BradCoinsShop";
import ShopItems from "@/components/shop/ShopItems";
import { Coins, Crown, ShoppingBag, Sparkles } from "lucide-react";

const Shop = () => {
  const [activeTab, setActiveTab] = useState("items");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-[#0a0a12] dark:via-[#1a1625] dark:to-[#2a1f40] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center relative">
          {/* Effet de particules décoratif */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute top-8 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-80 delay-300"></div>
            <div className="absolute top-12 left-2/3 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse opacity-70 delay-700"></div>
          </div>
          
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-purple-800 dark:from-purple-400 dark:via-blue-400 dark:to-purple-600 mb-4 tracking-tight">
              <span className="inline-flex items-center gap-3">
                <Sparkles className="h-12 w-12 md:h-16 md:w-16 text-purple-500 animate-pulse" />
                Boutique Qwestoria
                <Sparkles className="h-12 w-12 md:h-16 md:w-16 text-blue-500 animate-pulse delay-500" />
              </span>
            </h1>
            
            {/* Effet de brillance sous le titre */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full opacity-60"></div>
          </div>
          
          <div className="mt-6 space-y-2">
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 font-medium">
              Découvrez nos articles exclusifs et devenez 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 font-bold"> Premium </span>
              ou 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 font-bold"> VIP</span>
            </p>
            
            <div className="flex justify-center items-center gap-2 mt-4">
              <div className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full border border-purple-200 dark:border-purple-700/50">
                <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Expérience Premium</span>
              </div>
              
              <div className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full border border-amber-200 dark:border-amber-700/50">
                <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Contenu Exclusif</span>
              </div>
            </div>
          </div>
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
