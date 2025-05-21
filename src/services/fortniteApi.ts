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
  const { data, error } = await supabase.functions.invoke<FortniteShopPayload>(
    "fortnite-shop"
  );
  if (error) throw error;
  if (!data) throw new Error("No data returned from edge function");
  // `data` est déjà un objet conforme à FortniteShopPayload
  return data;
};
