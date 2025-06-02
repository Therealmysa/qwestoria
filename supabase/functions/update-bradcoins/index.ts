
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

    console.log('Processing BradCoins update:', { user_id, amount })

    if (!user_id || amount === undefined) {
      return new Response(
        JSON.stringify({ error: 'user_id and amount are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Vérifier d'abord si l'utilisateur existe dans la table profiles
    const { data: userProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('id', user_id)
      .single()

    if (profileError || !userProfile) {
      console.error('User profile not found:', profileError)
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Récupérer le solde actuel d'abord
    const { data: currentAccount, error: fetchError } = await supabaseClient
      .from('brad_coins')
      .select('balance')
      .eq('user_id', user_id)
      .single()

    let currentBalance = 0
    if (!fetchError && currentAccount) {
      currentBalance = currentAccount.balance || 0
    }

    // Calculer le nouveau solde en ajoutant le montant au solde actuel
    const newBalance = currentBalance + amount

    console.log('Current balance:', currentBalance, 'Amount to add:', amount, 'New balance:', newBalance)

    // Utiliser UPSERT avec le nouveau solde calculé
    const { data: updatedAccount, error: upsertError } = await supabaseClient
      .from('brad_coins')
      .upsert(
        { 
          user_id,
          balance: Math.max(0, newBalance), // S'assurer que le solde ne soit jamais négatif
          last_updated: new Date().toISOString()
        },
        { 
          onConflict: 'user_id',
          ignoreDuplicates: false
        }
      )
      .select('balance')
      .single()

    if (upsertError) {
      console.error('Error upserting BradCoins balance:', upsertError)
      return new Response(
        JSON.stringify({ error: upsertError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('BradCoins update successful:', { user_id, previous_balance: currentBalance, amount_added: amount, new_balance: updatedAccount.balance })

    return new Response(
      JSON.stringify({ 
        success: true, 
        new_balance: updatedAccount.balance,
        amount_added: amount,
        previous_balance: currentBalance
      }),
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
