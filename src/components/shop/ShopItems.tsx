
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Package, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useShopPurchase } from "@/hooks/useShopPurchase";
import { useUserStatus } from "@/hooks/useUserStatus";
import { useBradCoins } from "@/hooks/useBradCoins";
import PremiumBadge from "@/components/vip/PremiumBadge";
import { sanitizeText } from "@/utils/inputSanitization";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  is_vip_only: boolean;
  available_until?: string;
  created_at: string;
}

const ShopItems = () => {
  const { purchaseItem, isPurchasing } = useShopPurchase();
  const { isVip, isPremium } = useUserStatus();
  const { balance: userCoins } = useBradCoins();

  const { data: shopItems, isLoading, error } = useQuery<ShopItem[]>({
    queryKey: ['shop-items'],
    queryFn: async (): Promise<ShopItem[]> => {
      console.log('Fetching shop items...');
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching shop items:', error);
        throw error;
      }
      
      // Sanitize data on the client side for extra security
      return (data || []).map(item => ({
        ...item,
        name: sanitizeText(item.name || ''),
        description: sanitizeText(item.description || ''),
        category: sanitizeText(item.category || '')
      }));
    }
  });

  const { data: userPurchases = [] } = useQuery({
    queryKey: ['shop-purchases'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('shop_purchases')
        .select('item_id')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching user purchases:', error);
        return [];
      }
      return data?.map(p => p.item_id) || [];
    }
  });

  const handlePurchaseItem = (item: ShopItem) => {
    // Client-side validation before making the purchase
    if (!canPurchase(item)) {
      console.log('Purchase not allowed for item:', item.id);
      return;
    }
    console.log('Purchasing item:', item.id);
    purchaseItem({ itemId: item.id });
  };

  const isAvailable = (item: ShopItem): boolean => {
    if (item.available_until) {
      return new Date(item.available_until) > new Date();
    }
    return true;
  };

  const canPurchase = (item: ShopItem): boolean => {
    // Vérifier si l'article est disponible
    if (!isAvailable(item)) return false;
    
    // Vérifier si l'utilisateur a déjà acheté cet article
    if (userPurchases.includes(item.id)) return false;
    
    // Vérifier si l'article est VIP seulement et si l'utilisateur est VIP/Premium
    if (item.is_vip_only && !isVip && !isPremium) return false;
    
    // Vérifier si l'utilisateur a assez de BradCoins
    if (userCoins < item.price) return false;
    
    return true;
  };

  const getButtonText = (item: ShopItem): string => {
    if (!isAvailable(item)) return "Indisponible";
    if (userPurchases.includes(item.id)) return "Déjà acheté";
    if (item.is_vip_only && !isVip && !isPremium) return "VIP requis";
    if (userCoins < item.price) return "Solde insuffisant";
    return "Acheter";
  };

  if (error) {
    console.error('Shop items error:', error);
    return (
      <div className="text-center py-12 px-4">
        <Package className="h-12 sm:h-16 w-12 sm:w-16 mx-auto text-red-400 mb-4" />
        <h3 className="text-base sm:text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
          Erreur de chargement
        </h3>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Impossible de charger les articles de la boutique
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2">
          <Package className="h-6 w-6 animate-spin" />
          <span>Chargement des articles...</span>
        </div>
      </div>
    );
  }

  if (!shopItems || shopItems.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <Package className="h-12 sm:h-16 w-12 sm:w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
          Aucun article disponible
        </h3>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Les articles de la boutique arrivent bientôt !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center mb-6 sm:mb-8 px-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Articles de la Boutique
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
          Découvrez nos articles exclusifs et personnalisations
        </p>
        <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-3 sm:px-4 py-2 rounded-full">
          <Coins className="h-4 sm:h-5 w-4 sm:w-5 text-amber-500" />
          <span className="font-semibold text-amber-600 dark:text-amber-400 text-sm sm:text-base">
            {userCoins.toLocaleString()} BradCoins
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
        {shopItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:scale-105 transition-transform border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 h-full flex flex-col">
              <div className="relative">
                {item.image_url ? (
                  <div className="w-full h-40 sm:h-48 overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image failed to load:', item.image_url);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 sm:h-48 bg-slate-100 dark:bg-slate-800/30 flex items-center justify-center">
                    <Package className="h-12 sm:h-16 w-12 sm:w-16 text-slate-600 dark:text-slate-400" />
                  </div>
                )}
                
                <Badge 
                  variant="outline" 
                  className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-slate-600/90 hover:bg-slate-600/90 text-white border-0 text-xs"
                >
                  {item.category}
                </Badge>
                
                {item.is_vip_only && (
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                    <PremiumBadge isPremium={true} variant="vip" size="sm" />
                  </div>
                )}

                {userPurchases.includes(item.id) && (
                  <div className="absolute bottom-2 right-2">
                    <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full" />
                  </div>
                )}
              </div>
              
              <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">{item.name}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mb-4 flex-1">{item.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center">
                    <Coins className="h-4 sm:h-5 w-4 sm:w-5 text-amber-400 mr-1" />
                    <span className="font-bold text-amber-500 dark:text-amber-400 text-base sm:text-lg">
                      {item.price}
                    </span>
                  </div>
                  
                  {!isAvailable(item) && (
                    <Badge variant="destructive" className="text-xs">Expiré</Badge>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="px-4 sm:px-6 pb-4 sm:pb-6">
                <Button 
                  className="w-full bg-slate-700 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-sm"
                  onClick={() => handlePurchaseItem(item)}
                  disabled={!canPurchase(item) || isPurchasing}
                >
                  {isPurchasing ? "Achat en cours..." : getButtonText(item)}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ShopItems;
