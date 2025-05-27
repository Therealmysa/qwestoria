
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Star, Zap, Gift, Shield, Sparkles } from "lucide-react";
import PremiumBadge from "./PremiumBadge";

interface VipFeaturesProps {
  isPremium: boolean;
  isVip: boolean;
}

const VipFeatures = ({ isPremium, isVip }: VipFeaturesProps) => {
  const features = [
    {
      icon: Crown,
      title: "Badge Premium",
      description: "Affichez votre statut premium avec un badge exclusif",
      premium: true,
      vip: true
    },
    {
      icon: Star,
      title: "Articles Exclusifs",
      description: "Accès aux articles premium de la boutique",
      premium: true,
      vip: true
    },
    {
      icon: Zap,
      title: "Missions Premium",
      description: "Missions exclusives avec des récompenses plus élevées",
      premium: true,
      vip: true
    },
    {
      icon: Gift,
      title: "Bonus BradCoins",
      description: "Bonus mensuel de BradCoins pour les abonnés",
      premium: true,
      vip: true
    },
    {
      icon: Shield,
      title: "Support Prioritaire",
      description: "Support client prioritaire et assistance dédiée",
      premium: false,
      vip: true
    },
    {
      icon: Sparkles,
      title: "Fonctionnalités Beta",
      description: "Accès en avant-première aux nouvelles fonctionnalités",
      premium: false,
      vip: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Fonctionnalités Premium
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Découvrez tous les avantages de votre abonnement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => {
          const isAvailable = (isPremium && feature.premium) || (isVip && feature.vip);
          const Icon = feature.icon;
          
          return (
            <Card 
              key={index}
              className={`relative overflow-hidden transition-all duration-300 ${
                isAvailable 
                  ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 dark:border-purple-700' 
                  : 'border-gray-200 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 opacity-70'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${
                    isAvailable 
                      ? 'bg-purple-100 dark:bg-purple-800/30' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      isAvailable 
                        ? 'text-purple-600 dark:text-purple-400' 
                        : 'text-gray-500'
                    }`} />
                  </div>
                  
                  {isAvailable && (
                    <PremiumBadge 
                      isPremium={true} 
                      variant={feature.vip && !feature.premium ? 'vip' : 'premium'} 
                      size="sm" 
                      showText={false}
                    />
                  )}
                </div>
                <CardTitle className={`text-lg ${
                  isAvailable 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${
                  isAvailable 
                    ? 'text-gray-600 dark:text-gray-300' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {feature.description}
                </p>
              </CardContent>
              
              {!isAvailable && (
                <div className="absolute inset-0 bg-gray-900/10 dark:bg-gray-900/30 backdrop-blur-[1px]" />
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default VipFeatures;
