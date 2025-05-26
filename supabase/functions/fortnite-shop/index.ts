
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching Fortnite shop data from official API...');
    
    // Appel à la vraie API Fortnite
    const response = await fetch('https://fortnite-api.com/v2/shop?language=fr');
    
    if (!response.ok) {
      console.log('API call failed, using fallback data');
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const apiData = await response.json();
    
    if (!apiData || !apiData.data || !apiData.data.entries) {
      console.log('Invalid API response structure, using fallback data');
      throw new Error('Invalid API response structure');
    }
    
    console.log(`Successfully fetched ${apiData.data.entries.length} shop entries from API`);
    
    // Transformer les données pour correspondre à notre interface
    const transformedData = {
      status: 200,
      data: {
        hash: apiData.data.hash || "api-shop-" + Date.now(),
        date: apiData.data.date || new Date().toISOString(),
        vbuckIcon: apiData.data.vbuckIcon || "https://fortnite-api.com/images/vbuck.png",
        entries: apiData.data.entries.map((entry: any) => ({
          id: entry.offerId || entry.devName || Math.random().toString(),
          name: entry.bundle?.name || entry.brItems?.[0]?.name || "Article Fortnite",
          description: entry.bundle?.info || entry.brItems?.[0]?.description || "Article cosmétique Fortnite",
          type: entry.brItems?.[0]?.type || { value: "item", displayValue: "Article", backendValue: "AthenaItem" },
          rarity: entry.brItems?.[0]?.rarity || { value: "common", displayValue: "Commun", backendValue: "EFortRarity::Common" },
          images: {
            icon: entry.bundle?.image || entry.brItems?.[0]?.images?.icon || entry.brItems?.[0]?.images?.smallIcon || "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/icon.png",
            featured: entry.bundle?.image || entry.brItems?.[0]?.images?.featured || entry.brItems?.[0]?.images?.icon || "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/featured.png"
          },
          offerId: entry.offerId || entry.devName || Math.random().toString(),
          finalPrice: entry.finalPrice || 1000,
          regularPrice: entry.regularPrice || entry.finalPrice || 1000,
          giftable: entry.giftable || false,
          refundable: entry.refundable || false,
          inDate: entry.inDate || new Date().toISOString(),
          outDate: entry.outDate || new Date(Date.now() + 86400000).toISOString(),
          layout: entry.layout || {},
          colors: entry.colors || {},
          tileSize: entry.tileSize || "Normal",
          brItems: entry.brItems || []
        }))
      }
    };
    
    return new Response(JSON.stringify(transformedData), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      status: 200,
    });

  } catch (error) {
    console.error("Error fetching from Fortnite API:", error);
    
    // Données de fallback en cas d'erreur
    const fallbackData = {
      status: 200,
      data: {
        hash: "fallback-shop-" + Date.now(),
        date: new Date().toISOString(),
        vbuckIcon: "https://fortnite-api.com/images/vbuck.png",
        entries: [
          {
            id: "fallback-raven",
            name: "Raven",
            description: "Une tenue sombre et mystérieuse pour les vrais guerriers",
            type: { value: "outfit", displayValue: "Tenue", backendValue: "AthenaCharacter" },
            rarity: { value: "legendary", displayValue: "Légendaire", backendValue: "EFortRarity::Legendary" },
            images: {
              icon: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/icon.png",
              featured: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/featured.png"
            },
            offerId: "fallback-raven-offer",
            finalPrice: 2000,
            regularPrice: 2000,
            giftable: true,
            refundable: false,
            inDate: new Date().toISOString(),
            outDate: new Date(Date.now() + 86400000).toISOString(),
            layout: {},
            colors: {},
            tileSize: "Normal",
            brItems: [
              {
                id: "cid_a_272_athena_commando_f_prime",
                name: "Raven",
                description: "Une tenue sombre et mystérieuse",
                type: { value: "outfit", displayValue: "Tenue", backendValue: "AthenaCharacter" },
                rarity: { value: "legendary", displayValue: "Légendaire", backendValue: "EFortRarity::Legendary" },
                images: {
                  icon: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/icon.png",
                  featured: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/featured.png"
                }
              }
            ]
          },
          {
            id: "fallback-pickaxe",
            name: "Harvesting Tool",
            description: "Un outil de récolte efficace et stylé",
            type: { value: "pickaxe", displayValue: "Pioche", backendValue: "AthenaPickaxe" },
            rarity: { value: "rare", displayValue: "Rare", backendValue: "EFortRarity::Rare" },
            images: {
              icon: "https://fortnite-api.com/images/cosmetics/br/pickaxe_id_713_medieval1haxe/icon.png",
              featured: "https://fortnite-api.com/images/cosmetics/br/pickaxe_id_713_medieval1haxe/featured.png"
            },
            offerId: "fallback-pickaxe-offer",
            finalPrice: 800,
            regularPrice: 800,
            giftable: true,
            refundable: false,
            inDate: new Date().toISOString(),
            outDate: new Date(Date.now() + 86400000).toISOString(),
            layout: {},
            colors: {},
            tileSize: "Normal",
            brItems: [
              {
                id: "pickaxe_id_713_medieval1haxe",
                name: "Harvesting Tool",
                description: "Un outil de récolte efficace",
                type: { value: "pickaxe", displayValue: "Pioche", backendValue: "AthenaPickaxe" },
                rarity: { value: "rare", displayValue: "Rare", backendValue: "EFortRarity::Rare" },
                images: {
                  icon: "https://fortnite-api.com/images/cosmetics/br/pickaxe_id_713_medieval1haxe/icon.png",
                  featured: "https://fortnite-api.com/images/cosmetics/br/pickaxe_id_713_medieval1haxe/featured.png"
                }
              }
            ]
          }
        ]
      }
    };

    return new Response(JSON.stringify(fallbackData), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      status: 200,
    });
  }
});
