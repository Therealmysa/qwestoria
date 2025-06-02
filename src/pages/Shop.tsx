
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Coins, Crown, Star, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AdBanner from "@/components/advertisements/AdBanner";
import BradCoinsShop from "@/components/shop/BradCoinsShop";
import VipUpgrade from "@/components/vip/VipUpgrade";
import ShopItems from "@/components/shop/ShopItems";
import BradCoinsDisplay from "@/components/shop/BradCoinsDisplay";

const Shop = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("items");

  // Listen for custom events to switch tabs
  useEffect(() => {
    const handleSwitchToBradCoins = () => {
      setActiveTab("bradcoins");
    };

    window.addEventListener('switchToBradCoinsTab', handleSwitchToBradCoins);
    return () => {
      window.removeEventListener('switchToBradCoinsTab', handleSwitchToBradCoins);
    };
  }, []);

  return (
    <div 
      className="bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 dark:from-purple-900 dark:via-purple-800 dark:to-purple-900"
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'auto',
        touchAction: 'auto',
        overflow: 'auto'
      }}
    >
      {/* Banner Ad */}
      <div className="container mx-auto px-4 pt-6">
        <AdBanner position="banner" maxAds={1} />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header with enhanced CTA */}
            <Card className="mb-8 dark:bg-purple-800/20 dark:backdrop-blur-xl dark:border dark:border-purple-500/20 bg-white/90 backdrop-blur-md shadow-xl dark:shadow-purple-500/20 transform hover:scale-[1.02] transition-all duration-300">
              <CardHeader className="flex flex-col space-y-4">
                <CardTitle className="text-2xl font-bold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-500">
                  <ShoppingBag className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  Boutique Premium
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 text-lg">
                  Découvrez nos articles exclusifs, achetez des BradCoins et passez Premium/VIP.
                </CardDescription>
                
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button 
                    onClick={() => setActiveTab("bradcoins")}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    Acheter BradCoins
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("premium")}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Devenir Premium
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Enhanced Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 dark:bg-purple-800/20 dark:backdrop-blur-xl dark:border dark:border-purple-500/20 bg-purple-50/70 backdrop-blur-md p-1 h-auto">
                <TabsTrigger 
                  value="bradcoins" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white font-semibold px-6 py-3"
                >
                  <Coins className="h-4 w-4" />
                  <span className="hidden sm:inline">BradCoins</span>
                  <Star className="h-3 w-3 text-yellow-400" />
                </TabsTrigger>
                <TabsTrigger 
                  value="premium" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white font-semibold px-6 py-3"
                >
                  <Crown className="h-4 w-4" />
                  <span className="hidden sm:inline">Premium/VIP</span>
                  <Zap className="h-3 w-3 text-purple-400" />
                </TabsTrigger>
                <TabsTrigger 
                  value="items" 
                  className="flex items-center gap-2 data-[state=active]:bg-white/90 dark:data-[state=active]:bg-purple-700/50 font-semibold px-6 py-3"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span className="hidden sm:inline">Articles</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="bradcoins" className="space-y-6">
                <BradCoinsShop />
              </TabsContent>

              <TabsContent value="premium">
                <VipUpgrade />
              </TabsContent>
              
              <TabsContent value="items" className="space-y-6">
                <ShopItems />
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            <AdBanner position="sidebar" maxAds={2} />
            
            <BradCoinsDisplay />
            
            {/* Quick Premium Teaser */}
            {!profile?.is_vip && (
              <Card className="dark:bg-gradient-to-br dark:from-purple-800/30 dark:to-pink-800/30 dark:backdrop-blur-xl dark:border dark:border-purple-500/30 bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-md shadow-lg border border-purple-200">
                <CardHeader className="text-center pb-3">
                  <CardTitle className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    <Crown className="h-5 w-5 mx-auto mb-2 text-purple-500" />
                    Passez Premium !
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Débloquez des avantages exclusifs et des articles VIP.
                  </p>
                  <Button 
                    onClick={() => setActiveTab("premium")}
                    size="sm" 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                  >
                    <Crown className="h-4 w-4 mr-1" />
                    Découvrir
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <AdBanner position="popup" maxAds={1} />
    </div>
  );
};

export default Shop;
