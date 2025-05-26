
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useStripe = () => {
  const [loading, setLoading] = useState(false);

  const createCheckout = async (type: 'subscription' | 'bradcoins', planType?: string, pricingId?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: { type, planType, pricingId }
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast.error('Erreur lors de la création du paiement: ' + error.message);
      console.error('Stripe checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckout,
    loading
  };
};
