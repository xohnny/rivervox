const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  selected_size: string;
  selected_color_name: string;
}

interface OrderNotification {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  shipping_city: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  items: OrderItem[];
  notes?: string;
}

function formatTelegramMessage(order: OrderNotification): string {
  const itemLines = order.items.map(
    (item, i) =>
      `  ${i + 1}. ${item.product_name}\n     Size: ${item.selected_size} | Color: ${item.selected_color_name}\n     Qty: ${item.quantity} × $${item.unit_price.toFixed(2)} = $${(item.quantity * item.unit_price).toFixed(2)}`
  ).join('\n');

  const now = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' });

  return `🛒 *New Order Received!*

📦 *Order:* \`${order.order_number}\`
📅 *Date:* ${now}

👤 *Customer:* ${order.customer_name}
📞 *Phone:* ${order.customer_phone}${order.customer_email ? `\n📧 *Email:* ${order.customer_email}` : ''}

📍 *Address:* ${order.shipping_address}
🏙 *District:* ${order.shipping_city}

🧾 *Items:*
${itemLines}

💰 *Subtotal:* $${order.subtotal.toFixed(2)}
🚚 *Shipping:* $${order.shipping_cost.toFixed(2)}
✅ *Total:* $${order.total.toFixed(2)}${order.notes ? `\n\n📝 *Notes:* ${order.notes}` : ''}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const order: OrderNotification = await req.json();

    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!botToken || !chatId) {
      console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
      return new Response(JSON.stringify({ error: 'Telegram not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const message = formatTelegramMessage(order);

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    const telegramData = await telegramRes.json();

    if (!telegramRes.ok) {
      console.error('Telegram API error:', telegramData);
      return new Response(JSON.stringify({ error: 'Failed to send Telegram notification', details: telegramData }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('notify-order error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
