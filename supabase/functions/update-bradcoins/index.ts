
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { user_id, amount } = await req.json()

    if (!user_id || amount === undefined) {
      return new Response(
        JSON.stringify({ error: 'user_id and amount are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Créer un compte BradCoins si l'utilisateur n'en a pas encore
    const { error: upsertError } = await supabaseClient
      .from('brad_coins')
      .upsert({ 
        user_id, 
        balance: 0 
      }, { 
        onConflict: 'user_id',
        ignoreDuplicates: true 
      })

    if (upsertError) {
      console.error('Error upserting brad_coins:', upsertError)
    }

    // Récupérer le solde actuel
    const { data: currentBalance, error: fetchError } = await supabaseClient
      .from('brad_coins')
      .select('balance')
      .eq('user_id', user_id)
      .single()

    if (fetchError) {
      console.error('Error fetching current balance:', fetchError)
      return new Response(
        JSON.stringify({ error: fetchError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const newBalance = (currentBalance?.balance || 0) + amount

    // Mettre à jour le solde
    const { error: updateError } = await supabaseClient
      .from('brad_coins')
      .update({ 
        balance: newBalance,
        last_updated: new Date().toISOString()
      })
      .eq('user_id', user_id)

    if (updateError) {
      console.error('Error updating balance:', updateError)
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, new_balance: newBalance }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
