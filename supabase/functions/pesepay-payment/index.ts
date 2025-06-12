
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PESEPAY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const pesepayKey = Deno.env.get("PESEPAY_INTEGRATION_KEY");
    const pesepayUrl = Deno.env.get("PESEPAY_API_URL") || "https://api.pesepay.com";
    
    if (!pesepayKey) throw new Error("PESEPAY_INTEGRATION_KEY is not set");

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

    const { plan, amount } = await req.json();
    
    // Create payment request to Pesepay
    const paymentData = {
      integration_key: pesepayKey,
      amount: amount,
      currency_code: "USD", // or "ZWL" for Zimbabwe Dollar
      reason_for_payment: `AloraMed ${plan} Subscription`,
      result_url: `${req.headers.get("origin")}/subscription-success`,
      return_url: `${req.headers.get("origin")}/subscription-success`,
      cancel_url: `${req.headers.get("origin")}/subscription-canceled`,
      customer_email: user.email,
      customer_phone: "", // Optional
      customer_name: user.user_metadata?.full_name || "",
    };

    logStep("Creating Pesepay payment", { paymentData });

    const pesepayResponse = await fetch(`${pesepayUrl}/api/payments-engine/v1/payments/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${pesepayKey}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!pesepayResponse.ok) {
      throw new Error(`Pesepay API error: ${pesepayResponse.statusText}`);
    }

    const pesepayResult = await pesepayResponse.json();
    logStep("Pesepay payment created", { reference: pesepayResult.reference });

    // Store payment record in database
    await supabaseClient.from("payments").insert({
      user_id: user.id,
      payment_reference: pesepayResult.reference,
      amount: amount,
      currency: paymentData.currency_code,
      plan: plan,
      status: "pending",
      provider: "pesepay",
    });

    return new Response(JSON.stringify({ 
      payment_url: pesepayResult.redirect_url,
      reference: pesepayResult.reference 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in pesepay-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
