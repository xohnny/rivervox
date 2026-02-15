import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order_id, items, shipping_cost, success_url, cancel_url } = await req.json();

    if (!order_id || !items?.length) {
      throw new Error("order_id and items are required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Build line items from order items (prices in BDT, Stripe expects paisa)
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: { product_name: string; unit_price: number; quantity: number }) => ({
        price_data: {
          currency: "bdt",
          product_data: { name: item.product_name },
          unit_amount: Math.round(item.unit_price * 100), // BDT to paisa
        },
        quantity: item.quantity,
      })
    );

    // Add shipping as a line item
    if (shipping_cost > 0) {
      lineItems.push({
        price_data: {
          currency: "bdt",
          product_data: { name: "Shipping" },
          unit_amount: Math.round(shipping_cost * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: success_url || `${req.headers.get("origin")}/order-confirmation?orderId=${order_id}`,
      cancel_url: cancel_url || `${req.headers.get("origin")}/checkout`,
      metadata: { order_id },
    });

    // Update order with stripe session id
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseAdmin
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("order_number", order_id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout session error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
