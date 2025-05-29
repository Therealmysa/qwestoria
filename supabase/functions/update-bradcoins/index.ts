
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

    // Vérifier si l'utilisateur a déjà un compte BradCoins
    const { data: existingAccount, error: fetchError } = await supabaseClient
      .from('brad_coins')
      .select('balance')
      .eq('user_id', user_id)
      .single()

    let newBalance = amount

    if (fetchError && fetchError.code !== 'PGRST116') {
      // Erreur autre que "pas de résultat trouvé"
      console.error('Error checking existing BradCoins account:', fetchError)
      return new Response(
        JSON.stringify({ error: fetchError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (existingAccount) {
      // L'utilisateur a déjà un compte, on met à jour le solde
      newBalance = existingAccount.balance + amount
      
      const { error: updateError } = await supabaseClient
        .from('brad_coins')
        .update({ 
          balance: newBalance,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', user_id)

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
    } else {
      // L'utilisateur n'a pas de compte, on en crée un
      const { error: insertError } = await supabaseClient
        .from('brad_coins')
        .insert({ 
          user_id, 
          balance: Math.max(0, amount), // S'assurer que le solde initial n'est pas négatif
          last_updated: new Date().toISOString()
        })

      if (insertError) {
        console.error('Error creating BradCoins account:', insertError)
        return new Response(
          JSON.stringify({ error: insertError.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      newBalance = Math.max(0, amount)
    }

    console.log('BradCoins update successful:', { user_id, new_balance: newBalance })

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
