
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import VipUpgrade from "@/components/vip/VipUpgrade";
import BradCoinsShop from "@/components/shop/BradCoinsShop";
import ShopItems from "@/components/shop/ShopItems";
import { Coins, Crown, ShoppingBag } from "lucide-react";

const Shop = () => {
  const [activeTab, setActiveTab] = useState("premium");
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-blue-700 to-slate-700 dark:from-slate-300 dark:via-blue-400 dark:to-slate-400 mb-6 tracking-tight px-2">
            Boutique Qwestoria
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 mb-6 px-2">
            Services Premium et Articles Exclusifs
          </p>
        </div>

        {/* Séparation décorative */}
        <div className="relative mb-6 sm:mb-8">
          <Separator className="bg-gradient-to-r from-transparent via-slate-300/40 to-transparent dark:via-slate-500/40" />
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="bg-gray-50 dark:bg-slate-900 px-4 sm:px-6 py-2 rounded-full border border-slate-200 dark:border-slate-700/50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 sm:h-5 w-4 sm:w-5 text-slate-600 dark:text-slate-400" />
                <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Boutique Qwestoria</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div className="flex justify-center px-2">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/90 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 h-auto">
              <TabsTrigger 
                value="premium" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white font-semibold text-xs sm:text-sm py-2 sm:py-1.5"
              >
                <Crown className="h-3 sm:h-4 w-3 sm:w-4" />
                <span className="hidden sm:inline">Premium</span>
                <span className="sm:hidden text-xs">VIP</span>
              </TabsTrigger>
              <TabsTrigger 
                value="items" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-xs sm:text-sm py-2 sm:py-1.5"
              >
                <ShoppingBag className="h-3 sm:h-4 w-3 sm:w-4" />
                <span className="hidden sm:inline">Articles</span>
                <span className="sm:hidden text-xs">Shop</span>
              </TabsTrigger>
              <TabsTrigger 
                value="bradcoins" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-xs sm:text-sm py-2 sm:py-1.5"
              >
                <Coins className="h-3 sm:h-4 w-3 sm:w-4" />
                <span className="hidden sm:inline">BradCoins</span>
                <span className="sm:hidden text-xs">Coins</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="premium" className="space-y-4 sm:space-y-6">
            <VipUpgrade />
          </TabsContent>

          <TabsContent value="items" className="space-y-4 sm:space-y-6">
            <ShopItems />
          </TabsContent>

          <TabsContent value="bradcoins" className="space-y-4 sm:space-y-6">
            <BradCoinsShop />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Shop;
