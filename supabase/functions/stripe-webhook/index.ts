
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  try {
    logStep("Webhook received");

    // Use test key in development, live key in production
    const isDevelopment = Deno.env.get("ENVIRONMENT") !== "production";
    const stripeKey = isDevelopment 
      ? Deno.env.get("STRIPE_TEST_SECRET_KEY") || Deno.env.get("STRIPE_SECRET_KEY")
      : Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified", { mode: isDevelopment ? "test" : "live" });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    // Use test webhook secret in development
    const webhookSecret = isDevelopment 
      ? Deno.env.get("STRIPE_TEST_WEBHOOK_SECRET") || Deno.env.get("STRIPE_WEBHOOK_SECRET")
      : Deno.env.get("STRIPE_WEBHOOK_SECRET");

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature!,
        webhookSecret || ""
      );
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    logStep("Event type", { type: event.type, mode: isDevelopment ? "test" : "live" });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        
        if (!userId) {
          logStep("No user_id in session metadata");
          break;
        }

        if (session.metadata?.type === "bradcoins") {
          // Traitement des achats de BradCoins
          const bradcoinsAmount = parseInt(session.metadata.bradcoins_amount || "0");
          const pricingId = session.metadata.pricing_id;

          // Enregistrer l'achat
          await supabaseClient.from('bradcoins_purchases').insert({
            user_id: userId,
            pricing_id: pricingId,
            bradcoins_amount: bradcoinsAmount,
            price_paid_cents: session.amount_total || 0,
            stripe_payment_intent_id: session.payment_intent as string,
            status: 'completed',
            completed_at: new Date().toISOString()
          });

          // Ajouter les BradCoins au compte utilisateur
          await supabaseClient.from('transactions').insert({
            user_id: userId,
            type: 'purchase',
            amount: bradcoinsAmount,
            description: `Achat de ${bradcoinsAmount} BradCoins`
          });

          logStep("BradCoins purchase completed", { userId, bradcoinsAmount });
        } else {
          // Traitement des abonnements
          const planType = session.metadata?.plan_type;
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

          await supabaseClient.from('stripe_subscribers').upsert({
            user_id: userId,
            email: session.customer_email!,
            stripe_customer_id: session.customer as string,
            subscription_status: planType,
            stripe_subscription_id: session.subscription as string,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });

          logStep("Subscription created", { userId, planType });
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Trouver l'utilisateur par customer_id
        const { data: subscriber } = await supabaseClient
          .from('stripe_subscribers')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (subscriber) {
          const status = subscription.status === 'active' ? 
            (subscription.items.data[0].price.unit_amount === 599 ? 'premium' : 'vip') : 
            'none';

          await supabaseClient.from('stripe_subscribers').update({
            subscription_status: status,
            current_period_end: subscription.status === 'active' ? 
              new Date(subscription.current_period_end * 1000).toISOString() : null,
            updated_at: new Date().toISOString()
          }).eq('user_id', subscriber.user_id);

          logStep("Subscription updated", { userId: subscriber.user_id, status });
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    logStep("Webhook error", { error: error.message });
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
});
