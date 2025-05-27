
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
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center relative">
          {/* Effet de particules décoratif */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-1/4 w-2 h-2 bg-blue-500 rounded-full animate-pulse opacity-40"></div>
            <div className="absolute top-8 right-1/3 w-1 h-1 bg-slate-400 rounded-full animate-pulse opacity-60 delay-300"></div>
            <div className="absolute top-12 left-2/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse opacity-50 delay-700"></div>
          </div>
          
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-blue-700 to-slate-700 dark:from-slate-300 dark:via-blue-400 dark:to-slate-400 mb-4 tracking-tight">
              <span className="inline-flex items-center gap-3">
                Boutique Qwestoria
              </span>
            </h1>
            
            {/* Effet de brillance sous le titre */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full opacity-50"></div>
          </div>
          
          <div className="mt-6 space-y-2">
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 font-medium">
              Découvrez nos services 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 font-bold"> Premium </span>
              et nos articles exclusifs
            </p>
            
            <div className="flex justify-center items-center gap-3 mt-6">
              {/* Mise en avant Premium */}
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/40 dark:to-orange-900/40 rounded-full border-2 border-amber-300 dark:border-amber-600/50 shadow-lg">
                <Crown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span className="text-base font-bold text-amber-700 dark:text-amber-300">Abonnement Premium</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-100 to-blue-100 dark:from-slate-800/30 dark:to-blue-900/30 rounded-full border border-slate-300 dark:border-slate-600/50">
                <ShoppingBag className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Articles Exclusifs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Séparation décorative */}
        <div className="relative mb-8">
          <Separator className="bg-gradient-to-r from-transparent via-slate-300/40 to-transparent dark:via-slate-500/40" />
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="bg-gray-50 dark:bg-slate-900 px-6 py-2 rounded-full border border-slate-200 dark:border-slate-700/50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Boutique Professionnelle</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/90 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700">
              <TabsTrigger 
                value="premium" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white font-semibold"
              >
                <Crown className="h-4 w-4" />
                Premium
              </TabsTrigger>
              <TabsTrigger 
                value="items"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <ShoppingBag className="h-4 w-4" />
                Articles
              </TabsTrigger>
              <TabsTrigger 
                value="bradcoins"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <Coins className="h-4 w-4" />
                BradCoins
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="premium" className="space-y-6">
            <VipUpgrade />
          </TabsContent>

          <TabsContent value="items" className="space-y-6">
            <ShopItems />
          </TabsContent>

          <TabsContent value="bradcoins" className="space-y-6">
            <BradCoinsShop />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Shop;
