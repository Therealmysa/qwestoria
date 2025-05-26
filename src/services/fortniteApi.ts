
// src/services/fortniteApi.ts
import { supabase } from "@/integrations/supabase/client";

export interface RawFortniteItem {
  id: string;
  name: string;
  description: string;
  type: { value: string; displayValue: string; backendValue: string };
  rarity: { value: string; displayValue: string; backendValue: string };
  set?: { value: string; text: string; backendValue: string };
  introduction?: {
    chapter: string;
    season: string;
    text: string;
    backendValue: number;
  };
  banner?: { value: string; intensity: string; backendValue: string };
  images: {
    icon: string;
    featured?: string;
    background?: string;
    smallIcon?: string;
  };
  offerId: string;
  finalPrice?: number;
  regularPrice?: number;
  giftable: boolean;
  refundable: boolean;
  inDate: string;
  outDate: string;
  layout: Record<string, any>;
  colors: Record<string, string>;
  tileSize: string;
  brItems?: any[];
}

export interface FortniteShopPayload {
  status: number;
  data: {
    hash: string;
    date: string;
    vbuckIcon: string;
    entries: RawFortniteItem[];
  };
}

export const getFortniteShop = async (): Promise<FortniteShopPayload> => {
  console.log('Calling fortnite-shop edge function...');
  
  try {
    const { data, error } = await supabase.functions.invoke<FortniteShopPayload>(
      "fortnite-shop"
    );
    
    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }
    
    if (!data) {
      console.error('No data returned from edge function');
      throw new Error("No data returned from edge function");
    }
    
    console.log('Edge function returned data:', data);
    
    // Ensure the data structure is correct
    if (!data.data || !Array.isArray(data.data.entries)) {
      console.error('Invalid data structure:', data);
      throw new Error("Invalid data structure returned from edge function");
    }
    
    return data;
  } catch (error) {
    console.error('Error in getFortniteShop:', error);
    throw error;
  }
};
