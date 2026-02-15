

# Geo-Based Currency Detection and Multi-Currency Support

## Overview
Automatically detect the visitor's location using a free geolocation API and display prices in their local currency. Users can also manually switch currencies. All base prices are stored in BDT in the database, but the admin panel displays everything in USD as the business reporting currency.

## How It Will Work
1. When a user visits the site, their country is detected via a free IP geolocation API
2. The appropriate currency is selected automatically (e.g., EUR for Europe, GBP for UK, BDT for Bangladesh)
3. Prices throughout the site update to show the local currency
4. A small currency selector in the header lets users manually switch if needed
5. Admin panel displays all prices in USD only (business reporting currency)
6. Orders are stored in BDT in the database but shown in USD in admin views

## Supported Currencies
Around 30+ major world currencies including USD, EUR, GBP, INR, SAR, AED, MYR, IDR, PKR, CAD, AUD, SGD, JPY, KRW, TRY, EGP, BDT, and more. Exchange rates will be hardcoded with reasonable values.

## Technical Details

### 1. Create Currency Data File (`src/data/currencies.ts`)
- Define ~30+ currencies with: code, symbol, name, exchange rate from BDT
- Define a country-to-currency mapping (country code to currency code)
- Include a BDT-to-USD rate for admin panel conversion

### 2. Create Geolocation Edge Function (`supabase/functions/get-location/index.ts`)
- Use a free IP geolocation service to detect the user's country from their IP
- Returns the country code to the frontend
- Fallback to USD if detection fails

### 3. Upgrade `src/context/CurrencyContext.tsx`
- On mount, call the geolocation edge function to detect country
- Map country to currency using the currency data
- Store selected currency in localStorage for persistence
- Expose: `formatPrice()`, `currency`, `setCurrency()`, `currencies` list
- Convert prices: `priceInLocal = priceInBDT * exchangeRate`

### 4. Add Currency Selector to Header (`src/components/layout/Header.tsx`)
- Small dropdown showing current currency code/symbol
- Lets users manually override the auto-detected currency

### 5. Update All Storefront Price Components
Files already using `useCurrency` / `formatPrice` from the context will automatically work since the context handles conversion. These include:
- ProductCard, ProductQuickView, ProductDetail
- CartSlider, Checkout
- Wishlist, OrderConfirmation
- Shop page

### 6. Admin Pages -- USD Only
All admin pages will use a dedicated USD `formatPrice` helper (not the CurrencyContext). Files to update:
- `src/pages/admin/AdminDashboard.tsx`
- `src/pages/admin/AdminOrders.tsx`
- `src/pages/admin/AdminProducts.tsx`
- `src/pages/admin/AdminCustomers.tsx`
- `src/pages/admin/AdminSettings.tsx`
- `src/pages/admin/AdminInventory.tsx`

Each will use a helper like:
```text
const formatPrice = (bdtPrice: number) => {
  const usdPrice = bdtPrice / BDT_TO_USD_RATE;
  return `$${usdPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
};
```

### 7. Checkout Adjustments
- Show converted price in user's local currency for reference
- Note: "You will be charged the equivalent in your local currency"
- Store order total in BDT in the database

### Files to Create
- `src/data/currencies.ts` -- currency definitions, exchange rates, and country mapping
- `supabase/functions/get-location/index.ts` -- IP geolocation edge function

### Files to Modify
- `src/context/CurrencyContext.tsx` -- full rewrite with geo detection + conversion
- `src/components/layout/Header.tsx` -- add currency selector dropdown
- `src/pages/Checkout.tsx` -- show local currency equivalent + note
- `src/pages/admin/AdminDashboard.tsx` -- switch to USD formatting
- `src/pages/admin/AdminOrders.tsx` -- switch to USD formatting
- `src/pages/admin/AdminProducts.tsx` -- switch to USD formatting
- `src/pages/admin/AdminCustomers.tsx` -- switch to USD formatting
- `src/pages/admin/AdminSettings.tsx` -- switch to USD formatting
- `src/pages/admin/AdminInventory.tsx` -- switch to USD formatting

