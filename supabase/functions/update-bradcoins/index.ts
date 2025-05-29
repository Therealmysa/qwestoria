
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

    // Utiliser UPSERT pour éviter les doublons - soit mettre à jour, soit insérer
    const { data: updatedAccount, error: upsertError } = await supabaseClient
      .from('brad_coins')
      .upsert(
        { 
          user_id,
          balance: amount,
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
      
      // Si c'est un problème d'addition/soustraction, essayons de récupérer le solde actuel et faire l'opération
      const { data: currentAccount, error: fetchError } = await supabaseClient
        .from('brad_coins')
        .select('balance')
        .eq('user_id', user_id)
        .single()

      if (fetchError) {
        console.error('Error fetching current balance:', fetchError)
        return new Response(
          JSON.stringify({ error: 'Failed to update BradCoins balance' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Calculer le nouveau solde
      const newBalance = (currentAccount?.balance || 0) + amount

      // Mettre à jour avec le nouveau solde calculé
      const { data: finalAccount, error: updateError } = await supabaseClient
        .from('brad_coins')
        .update({ 
          balance: Math.max(0, newBalance), // S'assurer que le solde ne soit jamais négatif
          last_updated: new Date().toISOString()
        })
        .eq('user_id', user_id)
        .select('balance')
        .single()

      if (updateError) {
        console.error('Error updating BradCoins balance:', updateError)
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      console.log('BradCoins update successful (via update):', { user_id, new_balance: finalAccount.balance })
      return new Response(
        JSON.stringify({ success: true, new_balance: finalAccount.balance }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('BradCoins update successful (via upsert):', { user_id, new_balance: updatedAccount.balance })

    return new Response(
      JSON.stringify({ success: true, new_balance: updatedAccount.balance }),
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
