
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Package } from "lucide-react";
import { motion } from "framer-motion";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  is_vip_only: boolean;
  is_active: boolean;
  available_until?: string;
  created_at: string;
}

const ShopItems = () => {
  const { data: shopItems, isLoading } = useQuery<ShopItem[]>({
    queryKey: ['shop-items'],
    queryFn: async (): Promise<ShopItem[]> => {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: userCoins = 0 } = useQuery<number>({
    queryKey: ['user-coins'],
    queryFn: async (): Promise<number> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { data, error } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;
    }
  });

  const handlePurchaseItem = async (item: ShopItem) => {
    console.log('Achat article:', item);
    // TODO: Implémenter la logique d'achat
  };

  const isAvailable = (item: ShopItem): boolean => {
    if (item.available_until) {
      return new Date(item.available_until) > new Date();
    }
    return true;
  };

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
      <div className="text-center py-12">
        <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
          Aucun article disponible
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Les articles de la boutique arrivent bientôt !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Articles de la Boutique
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Découvrez nos articles exclusifs et personnalisations
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-full">
          <Coins className="h-5 w-5 text-amber-500" />
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            {userCoins.toLocaleString()} BradCoins
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:scale-105 transition-transform border-[#9b87f5]/20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <div className="relative">
                {item.image_url ? (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-[#9b87f5]/10 flex items-center justify-center">
                    <Package className="h-16 w-16 text-[#9b87f5]" />
                  </div>
                )}
                
                <Badge 
                  variant="outline" 
                  className="absolute top-4 left-4 bg-[#9b87f5]/90 hover:bg-[#9b87f5]/90 text-white border-0"
                >
                  {item.category}
                </Badge>
                
                {item.is_vip_only && (
                  <Badge 
                    variant="outline" 
                    className="absolute top-4 right-4 bg-amber-500/90 hover:bg-amber-500/90 text-black border-0"
                  >
                    VIP
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-[#9b87f5] mb-2">{item.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Coins className="h-5 w-5 text-amber-400 mr-1" />
                    <span className="font-bold text-amber-500 dark:text-amber-400 text-lg">
                      {item.price}
                    </span>
                  </div>
                  
                  {!isAvailable(item) && (
                    <Badge variant="destructive">Expiré</Badge>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="px-6 pb-6">
                <Button 
                  className="w-full bg-[#9b87f5] hover:bg-[#8976e4]"
                  onClick={() => handlePurchaseItem(item)}
                  disabled={!isAvailable(item) || userCoins < item.price}
                >
                  {!isAvailable(item) 
                    ? "Indisponible" 
                    : userCoins < item.price 
                      ? "Solde insuffisant" 
                      : "Acheter"
                  }
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
