
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Star, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { toast } from "sonner";

const VipUpgrade = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { data: plans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const handleSubscribe = async (planId: string) => {
    setIsLoading(true);
    try {
      // Ici, vous intégreriez avec Stripe ou un autre processeur de paiement
      // Pour l'instant, on simule un abonnement
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 mois

      const { error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: planId,
          status: 'active',
          expires_at: expiresAt.toISOString()
        });

      if (error) throw error;

      toast.success("Abonnement activé avec succès!");
    } catch (error) {
      toast.error("Erreur lors de l'activation de l'abonnement");
    } finally {
      setIsLoading(false);
    }
  };

  if (userProfile?.is_vip) {
    return (
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-gray-900">
            Vous êtes déjà VIP ! 👑
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            Profitez de tous vos avantages exclusifs !
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              Missions VIP
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              Badge exclusif
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              Support prioritaire
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              Pas de publicités
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Passez au niveau supérieur
        </h2>
        <p className="text-gray-600">
          Débloquez des avantages exclusifs avec nos plans premium
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans?.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`relative overflow-hidden ${
              plan.name === 'VIP' 
                ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50' 
                : 'border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50'
            }`}>
              {plan.name === 'VIP' && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 text-xs font-semibold">
                  POPULAIRE
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    plan.name === 'VIP' 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                      : 'bg-gradient-to-r from-purple-500 to-blue-500'
                  }`}>
                    {plan.name === 'VIP' ? (
                      <Crown className="h-6 w-6 text-white" />
                    ) : (
                      <Star className="h-6 w-6 text-white" />
                    )}
                  </div>
                </div>
                
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-gray-900">
                  €{(plan.price_monthly / 100).toFixed(2)}
                  <span className="text-sm font-normal text-gray-600">/mois</span>
                </div>
                {plan.price_yearly && (
                  <div className="text-sm text-green-600">
                    Économisez €{((plan.price_monthly * 12 - plan.price_yearly) / 100).toFixed(2)} par an
                  </div>
                )}
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 mb-6 text-center">
                  {plan.description}
                </p>
                
                <ul className="space-y-3 mb-6">
                  {(plan.features as string[]).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading}
                  className={`w-full ${
                    plan.name === 'VIP'
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                  } text-white border-none`}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {isLoading ? 'Activation...' : `Devenir ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VipUpgrade;
