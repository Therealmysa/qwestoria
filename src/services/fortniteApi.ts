
import { supabase } from "@/integrations/supabase/client";

export interface FortniteShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  priceIconLink: string;
  images: {
    icon: string;
    featured: string;
    background: string;
  };
  type: string;
  rarity: string;
}

/**
 * Get Fortnite shop items for the day
 * This calls a Supabase Edge Function that securely handles the API key
 */
export const getFortniteShop = async (): Promise<FortniteShopItem[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('fortnite-shop');
    
    if (error) {
      console.error('Error fetching Fortnite shop data:', error);
      throw new Error('Failed to fetch Fortnite shop');
    }
    
    return data as FortniteShopItem[];
  } catch (error) {
    console.error('Error in getFortniteShop:', error);
    throw error;
  }
};
