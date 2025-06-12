
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PESEPAY-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const webhookData = await req.json();
    logStep("Webhook data", webhookData);

    const { reference, status, amount, currency_code } = webhookData;

    // Update payment status in database
    const { data: payment, error: paymentError } = await supabaseClient
      .from("payments")
      .update({ 
        status: status.toLowerCase(),
        updated_at: new Date().toISOString()
      })
      .eq("payment_reference", reference)
      .select("user_id, plan")
      .single();

    if (paymentError || !payment) {
      throw new Error(`Payment not found: ${reference}`);
    }

    // If payment is successful, update user subscription
    if (status.toLowerCase() === "paid" || status.toLowerCase() === "successful") {
      logStep("Payment successful, updating subscription", { userId: payment.user_id, plan: payment.plan });
      
      const subscriptionEnd = new Date();
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1); // 1 month subscription

      await supabaseClient.from("subscribers").upsert({
        user_id: payment.user_id,
        subscribed: true,
        subscription_tier: payment.plan,
        subscription_end: subscriptionEnd.toISOString(),
        payment_provider: "pesepay",
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in pesepay-webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
