
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Format for external APIs that require API Keys
serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Make a request to the Fortnite API
    // We're using a free and public API for this example
    const response = await fetch("https://fortnite-api.com/v2/shop/br");
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the data to our expected format
    const items = data.data.featured.entries
      .concat(data.data.daily.entries)
      .flatMap(entry => entry.items || [])
      .map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        type: item.type.value,
        rarity: item.rarity.value,
        price: entry?.regularPrice || 0,
        priceIconLink: "https://fortnite-api.com/images/vbuck.png",
        images: {
          icon: item.images.icon,
          featured: item.images.featured || item.images.icon,
          background: item.images.background
        }
      }));

    return new Response(JSON.stringify(items), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching Fortnite shop:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }
});
