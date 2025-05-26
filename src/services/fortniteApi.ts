
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
      throw new Error(`Edge function error: ${error.message}`);
    }
    
    if (!data) {
      console.error('No data returned from edge function');
      throw new Error("No data returned from edge function");
    }
    
    console.log('Edge function returned data:', data);
    
    // Validation de la structure des données
    if (!data.data || !Array.isArray(data.data.entries)) {
      console.error('Invalid data structure:', data);
      throw new Error("Invalid data structure returned from edge function");
    }
    
    // Validation supplémentaire des entrées
    const validEntries = data.data.entries.filter(entry => {
      return entry && 
             entry.id && 
             entry.name && 
             entry.images && 
             entry.images.icon;
    });
    
    if (validEntries.length === 0) {
      console.warn('No valid entries found in shop data');
    }
    
    console.log(`Processed ${validEntries.length} valid shop entries`);
    
    return {
      ...data,
      data: {
        ...data.data,
        entries: validEntries
      }
    };
    
  } catch (error) {
    console.error('Error in getFortniteShop:', error);
    throw error;
  }
};
