
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Zap, Star, Crown, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStripe } from "@/hooks/useStripe";

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
        return <Coins className="h-5 w-5" />;
      case 1:
        return <Star className="h-5 w-5" />;
      case 2:
        return <Crown className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex items-center gap-3">
          <Coins className="h-6 w-6 animate-spin text-amber-500" />
          <span className="text-lg text-gray-600 dark:text-gray-300">Chargement des packs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Packs BradCoins
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          Obtenez des BradCoins pour débloquer des objets exclusifs et des fonctionnalités premium
        </p>
        
        <div className="flex justify-center">
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-700/50">
            <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Paiement sécurisé via Stripe</span>
          </div>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {pricingPlans?.map((plan, index) => {
          const isPopular = index === 2; // Marquer le troisième pack comme populaire
          
          return (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
                isPopular 
                  ? 'border-purple-500 dark:border-purple-400 shadow-lg scale-105' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {/* Badge populaire */}
              {isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-purple-500 hover:bg-purple-500 text-white font-semibold px-3 py-1">
                    POPULAIRE
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  <div className={`p-3 rounded-full ${
                    isPopular 
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                  }`}>
                    {getPackIcon(index)}
                  </div>
                </div>
                
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </CardTitle>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    €{(plan.price_cents / 100).toFixed(2)}
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className="text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700"
                  >
                    <Coins className="h-3 w-3 mr-1" />
                    {plan.bradcoins_amount.toLocaleString()} BradCoins
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                      Valeur par euro
                    </p>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      {(plan.bradcoins_amount / (plan.price_cents / 100)).toFixed(0)} BradCoins/€
                    </p>
                  </div>
                  
                  {/* Avantages du pack */}
                  <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span>Livraison instantanée</span>
                    </div>
                    {index >= 1 && (
                      <div className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-blue-500 flex-shrink-0" />
                        <span>Bonus de {5 + index * 5}%</span>
                      </div>
                    )}
                    {index >= 2 && (
                      <div className="flex items-center gap-2">
                        <Crown className="h-3 w-3 text-purple-500 flex-shrink-0" />
                        <span>Pack Premium</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => handlePurchase(plan.id)}
                    disabled={loading}
                    className={`w-full font-semibold transition-all duration-200 ${
                      isPopular
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    } disabled:opacity-50`}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 animate-spin" />
                        <span>Traitement...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        <span>Acheter maintenant</span>
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Section informative */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700/50">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
            Pourquoi choisir nos BradCoins ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-medium">Livraison instantanée</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium">Contenu exclusif</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
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
