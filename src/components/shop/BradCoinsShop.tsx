
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Zap, Star, Crown, Gem } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStripe } from "@/hooks/useStripe";
import { motion } from "framer-motion";

const BradCoinsShop = () => {
  const { createCheckout, loading } = useStripe();

  const { data: pricingPlans, isLoading } = useQuery({
    queryKey: ['bradcoins-pricing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bradcoins_pricing')
        .select('*')
        .eq('is_active', true)
        .order('price_cents', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const handlePurchase = (pricingId: string) => {
    createCheckout('bradcoins', undefined, pricingId);
  };

  const getPackIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Coins className="h-8 w-8 text-white" />;
      case 1:
        return <Star className="h-8 w-8 text-white" />;
      case 2:
        return <Crown className="h-8 w-8 text-white" />;
      default:
        return <Gem className="h-8 w-8 text-white" />;
    }
  };

  const getGradientColors = (index: number) => {
    const gradients = [
      "from-amber-400 via-yellow-500 to-orange-500",
      "from-blue-400 via-purple-500 to-indigo-600",
      "from-purple-500 via-pink-500 to-red-500",
      "from-emerald-400 via-cyan-500 to-blue-500"
    ];
    return gradients[index % gradients.length];
  };

  const getBorderGlow = (index: number) => {
    const glows = [
      "shadow-[0_0_30px_rgba(251,191,36,0.3)]",
      "shadow-[0_0_30px_rgba(139,92,246,0.3)]",
      "shadow-[0_0_30px_rgba(236,72,153,0.3)]",
      "shadow-[0_0_30px_rgba(6,182,212,0.3)]"
    ];
    return glows[index % glows.length];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex items-center gap-3">
          <Coins className="h-8 w-8 animate-spin text-amber-500" />
          <span className="text-lg text-gray-600 dark:text-gray-300">Chargement des packs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <div className="relative inline-block">
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 mb-3">
            Packs BradCoins
          </h2>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto">
          Obtenez des BradCoins pour débloquer des objets exclusifs et des fonctionnalités premium
        </p>
        
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 px-6 py-3 rounded-full border border-amber-200 dark:border-amber-700/50">
            <Coins className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">Paiement sécurisé via Stripe</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pricingPlans?.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 200
            }}
            whileHover={{ 
              y: -8,
              transition: { duration: 0.2 }
            }}
            className="relative group"
          >
            {/* Badge populaire pour le troisième pack - VERSION AMÉLIORÉE */}
            {index === 2 && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="relative">
                  <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-6 py-3 rounded-full text-sm font-black shadow-2xl animate-pulse border-2 border-white/20">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔥</span>
                      <span className="tracking-wide">POPULAIRE</span>
                      <span className="text-lg">🔥</span>
                    </div>
                  </div>
                  {/* Effet de glow autour du badge */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full blur-md opacity-40 -z-10 scale-110 animate-pulse"></div>
                </div>
              </div>
            )}

            <Card className={`relative overflow-hidden border-2 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl transition-all duration-300 group-hover:scale-[1.02] ${getBorderGlow(index)} group-hover:border-transparent`}>
              {/* Effet de brillance animé */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* En-tête avec icône et gradient */}
              <div className={`h-24 bg-gradient-to-r ${getGradientColors(index)} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative h-full flex items-center justify-center">
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    {getPackIcon(index)}
                  </div>
                </div>
                {/* Particules décoratives */}
                <div className="absolute top-2 right-4 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                <div className="absolute bottom-3 left-6 w-1 h-1 bg-white/60 rounded-full animate-pulse delay-300"></div>
                <div className="absolute top-6 left-8 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse delay-700"></div>
              </div>
              
              <CardHeader className="text-center pb-4 pt-6">
                <CardTitle className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {plan.name}
                </CardTitle>
                
                <div className="space-y-3">
                  <div className="text-3xl font-black text-gray-900 dark:text-white">
                    €{(plan.price_cents / 100).toFixed(2)}
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className={`text-sm font-bold px-4 py-1 bg-gradient-to-r ${getGradientColors(index)} text-white border-0 shadow-lg`}
                  >
                    <Coins className="h-4 w-4 mr-1" />
                    {plan.bradcoins_amount.toLocaleString()} BradCoins
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="px-6 pb-6">
                <div className="text-center mb-6">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Valeur par euro
                    </p>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      {(plan.bradcoins_amount / (plan.price_cents / 100)).toFixed(0)} BradCoins/€
                    </p>
                  </div>
                  
                  {/* Avantages du pack */}
                  <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-center gap-1">
                      <Zap className="h-3 w-3 text-green-500" />
                      <span>Livraison instantanée</span>
                    </div>
                    {index >= 1 && (
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 text-blue-500" />
                        <span>Bonus de {5 + index * 5}%</span>
                      </div>
                    )}
                    {index >= 2 && (
                      <div className="flex items-center justify-center gap-1">
                        <Crown className="h-3 w-3 text-purple-500" />
                        <span>Pack Premium</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={loading}
                  className={`w-full h-12 font-bold text-white border-0 shadow-xl transition-all duration-300 bg-gradient-to-r ${getGradientColors(index)} hover:shadow-2xl hover:scale-105 disabled:hover:scale-100 disabled:opacity-50`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Coins className="h-4 w-4 animate-spin" />
                        <span>Traitement...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        <span>Acheter maintenant</span>
                      </>
                    )}
                  </div>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Section informative */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-700/50">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Pourquoi choisir nos BradCoins ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-medium">Livraison instantanée</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium">Contenu exclusif</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="font-medium">Avantages premium</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BradCoinsShop;
