
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
    console.log('Fetching Fortnite shop data...');
    
    // Utiliser directement les données de fallback enrichies pour avoir une boutique fonctionnelle
    const mockData = {
      status: 200,
      data: {
        hash: "qwestoria-shop-" + Date.now(),
        date: new Date().toISOString(),
        vbuckIcon: "https://fortnite-api.com/images/vbuck.png",
        entries: [
          {
            id: "outfit-1",
            name: "Raven",
            description: "Une tenue sombre et mystérieuse pour les vrais guerriers",
            type: { value: "outfit", displayValue: "Tenue", backendValue: "AthenaCharacter" },
            rarity: { value: "legendary", displayValue: "Légendaire", backendValue: "EFortRarity::Legendary" },
            images: {
              icon: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/icon.png",
              featured: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/featured.png"
            },
            offerId: "offer-raven-1",
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
            id: "pickaxe-1",
            name: "Harvesting Tool",
            description: "Un outil de récolte efficace et stylé",
            type: { value: "pickaxe", displayValue: "Pioche", backendValue: "AthenaPickaxe" },
            rarity: { value: "rare", displayValue: "Rare", backendValue: "EFortRarity::Rare" },
            images: {
              icon: "https://fortnite-api.com/images/cosmetics/br/pickaxe_id_713_medieval1haxe/icon.png",
              featured: "https://fortnite-api.com/images/cosmetics/br/pickaxe_id_713_medieval1haxe/featured.png"
            },
            offerId: "offer-pickaxe-1",
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
          },
          {
            id: "emote-1",
            name: "Take The L",
            description: "Emote emblématique pour narguer vos adversaires",
            type: { value: "emote", displayValue: "Emote", backendValue: "AthenaDance" },
            rarity: { value: "rare", displayValue: "Rare", backendValue: "EFortRarity::Rare" },
            images: {
              icon: "https://fortnite-api.com/images/cosmetics/br/eid_takethelpromo/icon.png",
              featured: "https://fortnite-api.com/images/cosmetics/br/eid_takethelpromo/featured.png"
            },
            offerId: "offer-emote-1",
            finalPrice: 500,
            regularPrice: 500,
            giftable: true,
            refundable: false,
            inDate: new Date().toISOString(),
            outDate: new Date(Date.now() + 86400000).toISOString(),
            layout: {},
            colors: {},
            tileSize: "Normal",
            brItems: [
              {
                id: "eid_takethelpromo",
                name: "Take The L",
                description: "Emote emblématique",
                type: { value: "emote", displayValue: "Emote", backendValue: "AthenaDance" },
                rarity: { value: "rare", displayValue: "Rare", backendValue: "EFortRarity::Rare" },
                images: {
                  icon: "https://fortnite-api.com/images/cosmetics/br/eid_takethelpromo/icon.png",
                  featured: "https://fortnite-api.com/images/cosmetics/br/eid_takethelpromo/featured.png"
                }
              }
            ]
          },
          {
            id: "glider-1",
            name: "Victory Royale Umbrella",
            description: "Un parapluie exclusif pour les vainqueurs",
            type: { value: "glider", displayValue: "Planeur", backendValue: "AthenaGlider" },
            rarity: { value: "epic", displayValue: "Épique", backendValue: "EFortRarity::Epic" },
            images: {
              icon: "https://fortnite-api.com/images/cosmetics/br/glider_id_015_medievalumbrella/icon.png",
              featured: "https://fortnite-api.com/images/cosmetics/br/glider_id_015_medievalumbrella/featured.png"
            },
            offerId: "offer-glider-1",
            finalPrice: 1200,
            regularPrice: 1200,
            giftable: true,
            refundable: false,
            inDate: new Date().toISOString(),
            outDate: new Date(Date.now() + 86400000).toISOString(),
            layout: {},
            colors: {},
            tileSize: "Normal",
            brItems: [
              {
                id: "glider_id_015_medievalumbrella",
                name: "Victory Royale Umbrella",
                description: "Un parapluie exclusif",
                type: { value: "glider", displayValue: "Planeur", backendValue: "AthenaGlider" },
                rarity: { value: "epic", displayValue: "Épique", backendValue: "EFortRarity::Epic" },
                images: {
                  icon: "https://fortnite-api.com/images/cosmetics/br/glider_id_015_medievalumbrella/icon.png",
                  featured: "https://fortnite-api.com/images/cosmetics/br/glider_id_015_medievalumbrella/featured.png"
                }
              }
            ]
          },
          {
            id: "pack-bundle-1",
            name: "Pack Starter",
            description: "Pack complet pour débuter avec style",
            type: { value: "bundle", displayValue: "Pack", backendValue: "AthenaBundle" },
            rarity: { value: "legendary", displayValue: "Légendaire", backendValue: "EFortRarity::Legendary" },
            images: {
              icon: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/icon.png",
              featured: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/featured.png"
            },
            offerId: "offer-bundle-1",
            finalPrice: 2500,
            regularPrice: 3200,
            giftable: true,
            refundable: false,
            inDate: new Date().toISOString(),
            outDate: new Date(Date.now() + 86400000).toISOString(),
            layout: {},
            colors: {},
            tileSize: "Normal",
            brItems: [
              {
                id: "cid_starter_outfit",
                name: "Tenue Starter",
                description: "Tenue exclusive du pack",
                type: { value: "outfit", displayValue: "Tenue", backendValue: "AthenaCharacter" },
                rarity: { value: "epic", displayValue: "Épique", backendValue: "EFortRarity::Epic" },
                images: {
                  icon: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/icon.png",
                  featured: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/featured.png"
                }
              },
              {
                id: "pickaxe_starter",
                name: "Pioche Starter",
                description: "Pioche assortie",
                type: { value: "pickaxe", displayValue: "Pioche", backendValue: "AthenaPickaxe" },
                rarity: { value: "epic", displayValue: "Épique", backendValue: "EFortRarity::Epic" },
                images: {
                  icon: "https://fortnite-api.com/images/cosmetics/br/pickaxe_id_713_medieval1haxe/icon.png",
                  featured: "https://fortnite-api.com/images/cosmetics/br/pickaxe_id_713_medieval1haxe/featured.png"
                }
              },
              {
                id: "glider_starter",
                name: "Planeur Starter",
                description: "Planeur exclusif",
                type: { value: "glider", displayValue: "Planeur", backendValue: "AthenaGlider" },
                rarity: { value: "epic", displayValue: "Épique", backendValue: "EFortRarity::Epic" },
                images: {
                  icon: "https://fortnite-api.com/images/cosmetics/br/glider_id_015_medievalumbrella/icon.png",
                  featured: "https://fortnite-api.com/images/cosmetics/br/glider_id_015_medievalumbrella/featured.png"
                }
              }
            ]
          },
          {
            id: "wrap-1",
            name: "Camouflage Wrap",
            description: "Habillage camouflage pour vos armes",
            type: { value: "wrap", displayValue: "Habillage", backendValue: "AthenaItemWrap" },
            rarity: { value: "uncommon", displayValue: "Peu commun", backendValue: "EFortRarity::Uncommon" },
            images: {
              icon: "https://fortnite-api.com/images/cosmetics/br/wrap_093_camotriangle/icon.png",
              featured: "https://fortnite-api.com/images/cosmetics/br/wrap_093_camotriangle/featured.png"
            },
            offerId: "offer-wrap-1",
            finalPrice: 300,
            regularPrice: 300,
            giftable: true,
            refundable: false,
            inDate: new Date().toISOString(),
            outDate: new Date(Date.now() + 86400000).toISOString(),
            layout: {},
            colors: {},
            tileSize: "Normal",
            brItems: [
              {
                id: "wrap_093_camotriangle",
                name: "Camouflage Wrap",
                description: "Habillage camouflage",
                type: { value: "wrap", displayValue: "Habillage", backendValue: "AthenaItemWrap" },
                rarity: { value: "uncommon", displayValue: "Peu commun", backendValue: "EFortRarity::Uncommon" },
                images: {
                  icon: "https://fortnite-api.com/images/cosmetics/br/wrap_093_camotriangle/icon.png",
                  featured: "https://fortnite-api.com/images/cosmetics/br/wrap_093_camotriangle/featured.png"
                }
              }
            ]
          }
        ]
      }
    };
    
    console.log(`Returning enriched shop data with ${mockData.data.entries.length} entries`);

    return new Response(JSON.stringify(mockData), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      status: 200,
    });

  } catch (error) {
    console.error("Error in fortnite-shop function:", error);
    
    // Return minimal fallback data in case of any error
    const fallbackData = {
      status: 200,
      data: {
        hash: "fallback-hash-" + Date.now(),
        date: new Date().toISOString(),
        vbuckIcon: "https://fortnite-api.com/images/vbuck.png",
        entries: [
          {
            id: "fallback-1",
            name: "Article Temporaire",
            description: "Boutique en cours de mise à jour",
            type: { value: "outfit", displayValue: "Tenue", backendValue: "AthenaCharacter" },
            rarity: { value: "common", displayValue: "Commun", backendValue: "EFortRarity::Common" },
            images: {
              icon: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/icon.png",
              featured: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/featured.png"
            },
            offerId: "fallback-offer-1",
            finalPrice: 1000,
            regularPrice: 1000,
            giftable: true,
            refundable: false,
            inDate: new Date().toISOString(),
            outDate: new Date(Date.now() + 86400000).toISOString(),
            layout: {},
            colors: {},
            tileSize: "Normal",
            brItems: []
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
