

# Live Currency Conversion Using Gemini AI

## Overview
Replace the hardcoded exchange rates in `src/data/currencies.ts` with real-time rates fetched via a Gemini AI edge function. The function will ask Gemini for current USD-to-other-currency exchange rates and cache them to avoid excessive API calls.

## How It Will Work
1. A new edge function calls Gemini (via Lovable AI) asking for today's exchange rates from USD to all supported currencies
2. Rates are cached in a database table so we don't call Gemini on every page load
3. The frontend fetches cached rates on load and uses them for conversion
4. Rates refresh once per day (or on demand)
5. Hardcoded rates remain as fallback if the API call fails

## Important Note
AI-generated exchange rates are approximate and suitable for display purposes. For actual payment processing, a dedicated financial API would be recommended. This approach gives reasonably accurate "today's pricing" for browsing.

## Technical Details

### 1. Create Database Table for Cached Rates
A new `exchange_rates` table to store fetched rates:
- `id`, `base_currency` (USD), `rates` (JSONB with all currency rates), `fetched_at` (timestamp)
- Public SELECT policy so all visitors can read rates
- No RLS restriction needed since rates are public data

### 2. Create Edge Function (`supabase/functions/fetch-exchange-rates/index.ts`)
- Calls Lovable AI (Gemini) with a structured output request asking for current USD exchange rates for all ~37 supported currencies
- Uses tool calling to extract structured JSON (currency code to rate mapping)
- Stores/updates the result in the `exchange_rates` table
- Returns the rates to the caller
- Includes logic to skip fetching if rates were already fetched today (caching)

### 3. Update `src/data/currencies.ts`
- Keep hardcoded rates as fallback defaults
- Change the `rate` field meaning from "1 BDT = X" to "1 USD = X" since admin uses USD as base
- Add a helper to merge live rates into the currency list

### 4. Update `src/context/CurrencyContext.tsx`
- On mount, call the edge function to get today's rates
- Merge live rates into the currencies list
- Fall back to hardcoded rates if the fetch fails
- Product prices in the database are in USD, so conversion becomes: `priceInLocal = priceInUSD * rate`

### 5. Update Price Base Currency
Currently prices seem to be stored as USD values in the database. The conversion logic will be updated so:
- Base price = USD (as stored in DB and shown in admin)
- Storefront: `displayPrice = basePrice * exchangeRate[selectedCurrency]`

### Files to Create
- `supabase/functions/fetch-exchange-rates/index.ts` -- Gemini-powered rate fetcher

### Files to Modify
- `src/data/currencies.ts` -- update rate base from BDT to USD, add merge helper
- `src/context/CurrencyContext.tsx` -- fetch live rates on mount, update conversion logic
- `supabase/config.toml` -- register new edge function

### Database Changes
- New `exchange_rates` table with public read access

