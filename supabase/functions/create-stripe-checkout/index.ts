
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { type, planType, pricingId } = await req.json();
    logStep("Request data", { type, planType, pricingId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Créer ou récupérer le client Stripe
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
      logStep("New customer created", { customerId });
    }

    let sessionData;
    const origin = req.headers.get("origin") || "http://localhost:3000";

    if (type === "subscription") {
      // Créer les produits et prix s'ils n'existent pas
      let priceId;
      if (planType === "premium") {
        const products = await stripe.products.list({ active: true });
        let premiumProduct = products.data.find(p => p.name === "Premium Plan");
        
        if (!premiumProduct) {
          premiumProduct = await stripe.products.create({
            name: "Premium Plan",
            description: "Pas de pub, +10% BradCoins, missions bonus, badge premium, priorité team mate, -10% achats BradCoins"
          });
        }

        const prices = await stripe.prices.list({ product: premiumProduct.id });
        let premiumPrice = prices.data.find(p => p.unit_amount === 599);
        
        if (!premiumPrice) {
          premiumPrice = await stripe.prices.create({
            product: premiumProduct.id,
            unit_amount: 599,
            currency: "eur",
            recurring: { interval: "month" }
          });
        }
        priceId = premiumPrice.id;
      } else if (planType === "vip") {
        const products = await stripe.products.list({ active: true });
        let vipProduct = products.data.find(p => p.name === "VIP Plan");
        
        if (!vipProduct) {
          vipProduct = await stripe.products.create({
            name: "VIP Plan",
            description: "Tout Premium + tirages, +15% BradCoins, accès beta, missions VIP, profil premium, avatar or animé, avantages Discord"
          });
        }

        const prices = await stripe.prices.list({ product: vipProduct.id });
        let vipPrice = prices.data.find(p => p.unit_amount === 999);
        
        if (!vipPrice) {
          vipPrice = await stripe.prices.create({
            product: vipProduct.id,
            unit_amount: 999,
            currency: "eur",
            recurring: { interval: "month" }
          });
        }
        priceId = vipPrice.id;
      }

      sessionData = {
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/dashboard`,
        metadata: { user_id: user.id, plan_type: planType }
      };
    } else if (type === "bradcoins") {
      // Récupérer les détails du pricing depuis la base de données
      const { data: pricing } = await supabaseClient
        .from('bradcoins_pricing')
        .select('*')
        .eq('id', pricingId)
        .eq('is_active', true)
        .single();

      if (!pricing) throw new Error("Pricing not found");

      sessionData = {
        customer: customerId,
        line_items: [{
          price_data: {
            currency: "eur",
            product_data: {
              name: pricing.name,
              description: `${pricing.bradcoins_amount} BradCoins`
            },
            unit_amount: pricing.price_cents
          },
          quantity: 1
        }],
        mode: "payment",
        success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/shop`,
        metadata: { 
          user_id: user.id, 
          pricing_id: pricingId,
          bradcoins_amount: pricing.bradcoins_amount.toString(),
          type: "bradcoins"
        }
      };
    }

    const session = await stripe.checkout.sessions.create(sessionData);
    logStep("Checkout session created", { sessionId: session.id, mode: isDevelopment ? "test" : "live" });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
