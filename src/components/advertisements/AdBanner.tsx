
import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface AdBannerProps {
  position: 'sidebar' | 'banner' | 'popup';
  maxAds?: number;
}

const AdBanner = ({ position, maxAds = 1 }: AdBannerProps) => {
  const [dismissedAds, setDismissedAds] = useState<string[]>([]);

  const { data: ads } = useQuery({
    queryKey: ['advertisements', position],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .limit(maxAds);
      
      if (error) throw error;
      return data?.filter(ad => !dismissedAds.includes(ad.id)) || [];
    }
  });

  const incrementImpressionMutation = useMutation({
    mutationFn: async (adId: string) => {
      await supabase.rpc('increment_ad_impressions', { ad_id: adId });
    }
  });

  const incrementClickMutation = useMutation({
    mutationFn: async (adId: string) => {
      await supabase.rpc('increment_ad_clicks', { ad_id: adId });
    }
  });

  const handleAdClick = (ad: any) => {
    incrementClickMutation.mutate(ad.id);
    window.open(ad.link_url, '_blank');
  };

  const handleDismiss = (adId: string) => {
    setDismissedAds(prev => [...prev, adId]);
  };

  // Track impressions when ads are shown
  React.useEffect(() => {
    if (ads) {
      ads.forEach(ad => {
        incrementImpressionMutation.mutate(ad.id);
      });
    }
  }, [ads]);

  if (!ads || ads.length === 0) return null;

  const getPositionStyles = () => {
    switch (position) {
      case 'banner':
        return 'w-full max-w-4xl mx-auto mb-6';
      case 'sidebar':
        return 'w-full max-w-sm';
      case 'popup':
        return 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-md';
      default:
        return '';
    }
  };

  return (
    <AnimatePresence>
      <div className={getPositionStyles()}>
        {ads.map((ad, index) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, y: position === 'popup' ? -20 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === 'popup' ? -20 : 20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={position === 'banner' ? 'mb-4' : ''}
          >
            <Card className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
              position === 'popup' ? 'bg-white shadow-2xl' : 'bg-gradient-to-r from-purple-50 to-blue-50'
            }`}>
              {position === 'popup' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => handleDismiss(ad.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              
              <div 
                onClick={() => handleAdClick(ad)}
                className="p-4"
              >
                {ad.image_url && (
                  <div className={`mb-3 ${position === 'banner' ? 'h-20' : 'h-32'} overflow-hidden rounded-lg`}>
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {ad.title}
                  </h4>
                  {ad.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {ad.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Sponsorisé</span>
                    <div className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                      En savoir plus →
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default AdBanner;
