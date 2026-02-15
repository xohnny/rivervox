import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SUPPORTED_CURRENCIES = [
  'BDT','EUR','GBP','INR','PKR','SAR','AED','MYR','IDR','SGD',
  'CAD','AUD','JPY','KRW','CNY','TRY','EGP','NGN','ZAR','BRL',
  'MXN','THB','VND','PHP','QAR','KWD','OMR','BHD','LKR','NPR',
  'MMK','CHF','SEK','NOK','DKK','NZD','RUB'
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if we have rates fetched today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: existing } = await supabase
      .from('exchange_rates')
      .select('*')
      .eq('base_currency', 'USD')
      .gte('fetched_at', today.toISOString())
      .order('fetched_at', { ascending: false })
      .limit(1)
      .single();

    if (existing) {
      return new Response(JSON.stringify({ rates: existing.rates, fetched_at: existing.fetched_at, cached: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call Gemini for today's rates
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const currencyList = SUPPORTED_CURRENCIES.join(', ');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a financial data assistant that provides current exchange rates. You MUST call the provide_exchange_rates function with ALL the requested currency rates filled in.'
          },
          {
            role: 'user',
            content: `What are today's exchange rates from 1 USD to each of these currencies? Fill in every single one: ${currencyList}. For example, 1 USD ≈ 110 BDT, 1 USD ≈ 0.92 EUR, etc. Provide all ${SUPPORTED_CURRENCIES.length} rates.`
          }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'provide_exchange_rates',
            description: `Provide exchange rates from 1 USD to each of these ${SUPPORTED_CURRENCIES.length} currencies: ${currencyList}. Every property must have a numeric value.`,
            parameters: {
              type: 'object',
              properties: Object.fromEntries(
                SUPPORTED_CURRENCIES.map(code => [
                  code, { type: 'number', description: `How much 1 USD is worth in ${code}` }
                ])
              ),
              required: SUPPORTED_CURRENCIES,
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'provide_exchange_rates' } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response:', JSON.stringify(aiData).substring(0, 2000));
    
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error('No tool call found. Full response:', JSON.stringify(aiData));
      throw new Error('No tool call in AI response');
    }

    const parsed = JSON.parse(toolCall.function.arguments);
    // Rates are at the top level (each currency code is a property)
    const rates: Record<string, number> = {};
    for (const code of SUPPORTED_CURRENCIES) {
      if (typeof parsed[code] === 'number') rates[code] = parsed[code];
    }
    // Also check if nested under 'rates' as fallback
    if (parsed.rates && typeof parsed.rates === 'object') {
      for (const code of SUPPORTED_CURRENCIES) {
        if (typeof parsed.rates[code] === 'number') rates[code] = parsed.rates[code];
      }
    }
    console.log('Parsed rates count:', Object.keys(rates).length);

    // Ensure USD=1
    rates['USD'] = 1;

    // Store in database
    await supabase.from('exchange_rates').insert({
      base_currency: 'USD',
      rates,
      fetched_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ rates, fetched_at: new Date().toISOString(), cached: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('fetch-exchange-rates error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
