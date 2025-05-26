
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Zap } from "lucide-react";
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

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Acheter des BradCoins
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Obtenez des BradCoins pour acheter des objets exclusifs dans la boutique
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pricingPlans?.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 hover:scale-105 transition-transform">
              {index === 2 && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 text-xs font-semibold">
                  POPULAIRE
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                    <Coins className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  €{(plan.price_cents / 100).toFixed(2)}
                </div>
                <Badge variant="secondary" className="mt-2">
                  {plan.bradcoins_amount.toLocaleString()} BradCoins
                </Badge>
              </CardHeader>
              
              <CardContent>
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {(plan.bradcoins_amount / (plan.price_cents / 100)).toFixed(0)} BradCoins par €
                  </p>
                </div>
                
                <Button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-none"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {loading ? 'Traitement...' : 'Acheter'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BradCoinsShop;
