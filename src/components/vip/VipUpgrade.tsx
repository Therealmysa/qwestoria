
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Star, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useStripe } from "@/hooks/useStripe";

const VipUpgrade = () => {
  const { createCheckout, loading } = useStripe();

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

  const { data: subscription } = useQuery({
    queryKey: ['user-subscription'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('stripe_subscribers')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  const plans = [
    {
      id: 'premium',
      name: 'Premium',
      price: 5.99,
      description: 'Débloquez les avantages premium',
      features: [
        'Pas de publicités',
        '+10% de BradCoins sur les missions',
        'Accès aux missions bonus',
        'Badge premium sur le site et Discord',
        'Priorité dans la recherche de team mate',
        'Réduction de 10% sur l\'achat de BradCoins'
      ],
      current: subscription?.subscription_status === 'premium'
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 9.99,
      description: 'L\'expérience ultime avec tous les avantages',
      features: [
        'Tout ce qui est inclus dans Premium',
        'Accès aux tirages au sort (toutes les 2 semaines)',
        '+15% de BradCoins sur les missions',
        'Accès anticipé aux fonctionnalités beta',
        'Missions exclusives VIP',
        'Meilleure personnalisation du profil',
        'Avatar en or et animé dans le classement',
        'Accès aux avantages Discord'
      ],
      current: subscription?.subscription_status === 'vip'
    }
  ];

  const handleSubscribe = (planType: string) => {
    createCheckout('subscription', planType);
  };

  if (subscription?.subscription_status && ['premium', 'vip'].includes(subscription.subscription_status)) {
    const currentPlan = plans.find(p => p.id === subscription.subscription_status);
    
    return (
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 dark:from-yellow-900/20 dark:to-orange-900/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">
            Vous êtes {currentPlan?.name} ! 👑
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Profitez de tous vos avantages exclusifs !
          </p>
          <div className="grid grid-cols-2 gap-3">
            {currentPlan?.features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                {feature.split(':')[0]}
              </div>
            ))}
          </div>
          {subscription.current_period_end && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Expire le : {new Date(subscription.current_period_end).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Passez au niveau supérieur
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Débloquez des avantages exclusifs avec nos plans premium
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`relative overflow-hidden ${
              plan.name === 'VIP' 
                ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20' 
                : 'border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20'
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
                
                <CardTitle className="text-2xl dark:text-white">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  €{plan.price.toFixed(2)}
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/mois</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                  {plan.description}
                </p>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-3" />
                      <span className="dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading || plan.current}
                  className={`w-full ${
                    plan.name === 'VIP'
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                  } text-white border-none`}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {loading ? 'Traitement...' : plan.current ? 'Plan actuel' : `Devenir ${plan.name}`}
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
