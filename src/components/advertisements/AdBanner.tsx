
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

interface Advertisement {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  link_url: string;
  position: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  target_pages?: string[];
  impression_count: number;
  click_count: number;
  created_at: string;
  updated_at: string;
}

interface AdBannerProps {
  position: 'sidebar' | 'banner' | 'popup';
  maxAds?: number;
}

const AdBanner = ({ position, maxAds = 1 }: AdBannerProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [dismissedAds, setDismissedAds] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupShown, setPopupShown] = useState(false);

  const { data: ads } = useQuery({
    queryKey: ['advertisements', position, currentPath],
    queryFn: async (): Promise<Advertisement[]> => {
      console.log('Fetching ads for position:', position, 'on page:', currentPath);
      
      const now = new Date().toISOString();
      let query = supabase
        .from('advertisements')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .or(`start_date.is.null,start_date.lte.${now}`)
        .or(`end_date.is.null,end_date.gte.${now}`)
        .limit(maxAds);

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching ads:', error);
        throw error;
      }
      
      console.log('Fetched ads:', data);
      
      // Filtrer les publicités pour la page actuelle
      const pageFilteredAds = data?.filter((ad: Advertisement) => {
        // Si target_pages n'existe pas ou est vide, garder l'ancien comportement
        if (!ad.target_pages || ad.target_pages.length === 0) {
          return true;
        }
        // Vérifier si la page actuelle est dans les pages cibles
        return ad.target_pages.includes(currentPath);
      }) || [];
      
      console.log('Page filtered ads:', pageFilteredAds);
      
      const filteredAds = pageFilteredAds.filter(ad => !dismissedAds.includes(ad.id));
      console.log('Final filtered ads (after dismissal):', filteredAds);
      return filteredAds;
    }
  });

  const incrementImpressionMutation = useMutation({
    mutationFn: async (adId: string) => {
      console.log('Incrementing impression for ad:', adId);
      const { data, error } = await supabase
        .from('advertisements')
        .select('impression_count')
        .eq('id', adId)
        .single();
      
      if (error) {
        console.error('Error getting current impression count:', error);
        return;
      }

      const { error: updateError } = await supabase
        .from('advertisements')
        .update({ impression_count: (data.impression_count || 0) + 1 })
        .eq('id', adId);
      
      if (updateError) console.error('Error incrementing impression:', updateError);
    }
  });

  const incrementClickMutation = useMutation({
    mutationFn: async (adId: string) => {
      console.log('Incrementing click for ad:', adId);
      const { data, error } = await supabase
        .from('advertisements')
        .select('click_count')
        .eq('id', adId)
        .single();
      
      if (error) {
        console.error('Error getting current click count:', error);
        return;
      }

      const { error: updateError } = await supabase
        .from('advertisements')
        .update({ click_count: (data.click_count || 0) + 1 })
        .eq('id', adId);
      
      if (updateError) console.error('Error incrementing click:', updateError);
    }
  });

  const handleAdClick = (ad: Advertisement) => {
    console.log('Ad clicked:', ad);
    incrementClickMutation.mutate(ad.id);
    
    // Handle internal navigation vs external links
    if (ad.link_url.startsWith('http')) {
      window.open(ad.link_url, '_blank');
    } else {
      window.location.href = ad.link_url;
    }
  };

  const handleDismiss = (adId: string) => {
    console.log('Dismissing ad:', adId);
    setDismissedAds(prev => [...prev, adId]);
    if (position === 'popup') {
      setShowPopup(false);
    }
  };

  // Reset popup state when changing pages
  useEffect(() => {
    setPopupShown(false);
    setShowPopup(false);
  }, [currentPath]);

  // Track impressions when ads are shown
  useEffect(() => {
    if (ads && ads.length > 0) {
      console.log('Tracking impressions for ads:', ads);
      ads.forEach(ad => {
        incrementImpressionMutation.mutate(ad.id);
      });
      
      // Show popup after a delay for popup ads, but only once per page
      if (position === 'popup' && !popupShown) {
        const timer = setTimeout(() => {
          setShowPopup(true);
          setPopupShown(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [ads, position, popupShown]);

  if (!ads || ads.length === 0) {
    console.log('No ads to display for position:', position, 'on page:', currentPath);
    return null;
  }

  const getPositionStyles = () => {
    switch (position) {
      case 'banner':
        return 'w-full max-w-4xl mx-auto mb-6';
      case 'sidebar':
        return 'w-full max-w-sm';
      case 'popup':
        return 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm';
      default:
        return '';
    }
  };

  console.log('Rendering ads:', ads);

  if (position === 'popup' && !showPopup) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className={getPositionStyles()}>
        {ads.map((ad, index) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, y: position === 'popup' ? -20 : 20, scale: position === 'popup' ? 0.9 : 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === 'popup' ? -20 : 20, scale: position === 'popup' ? 0.9 : 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={position === 'banner' ? 'mb-4' : ''}
          >
            <Card className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
              position === 'popup' 
                ? 'bg-white shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto' 
                : 'bg-gradient-to-r from-purple-50 to-blue-50'
            }`}>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-20 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDismiss(ad.id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div 
                onClick={() => handleAdClick(ad)}
                className={position === 'popup' ? 'p-6' : 'p-4'}
              >
                {ad.image_url && (
                  <div className={`mb-3 ${
                    position === 'popup' ? 'h-48' : position === 'banner' ? 'h-20' : 'h-32'
                  } overflow-hidden rounded-lg`}>
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div>
                  <h4 className={`font-semibold text-gray-900 mb-1 ${position === 'popup' ? 'text-xl' : ''}`}>
                    {ad.title}
                  </h4>
                  {ad.description && (
                    <p className={`text-gray-600 mb-3 ${position === 'popup' ? 'text-base' : 'text-sm'}`}>
                      {ad.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Sponsorisé</span>
                    <div className={`text-purple-600 hover:text-purple-700 font-medium ${
                      position === 'popup' ? 'text-sm' : 'text-xs'
                    }`}>
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
