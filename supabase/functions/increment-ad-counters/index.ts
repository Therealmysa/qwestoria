
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, ad_id } = await req.json()

    if (action === 'increment_impressions') {
      const { error } = await supabaseClient
        .from('advertisements')
        .update({ 
          impression_count: supabaseClient.rpc('increment', { 
            table_name: 'advertisements',
            column_name: 'impression_count',
            id: ad_id 
          })
        })
        .eq('id', ad_id)

      if (error) throw error
    } else if (action === 'increment_clicks') {
      const { error } = await supabaseClient
        .from('advertisements')
        .update({ 
          click_count: supabaseClient.rpc('increment', { 
            table_name: 'advertisements',
            column_name: 'click_count',
            id: ad_id 
          })
        })
        .eq('id', ad_id)

      if (error) throw error
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
