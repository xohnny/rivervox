

## Stripe Payment Integration - Implementation Plan

### Step 1: Database Migration
Add payment tracking columns to the `orders` table:
- `payment_method` (text, default 'cod') -- tracks COD vs online
- `payment_status` (text, default 'unpaid') -- tracks unpaid/paid
- `stripe_session_id` (text, nullable) -- links to Stripe session

### Step 2: Create `create-checkout-session` Edge Function
A backend function that:
- Receives order details (items, shipping cost, URLs)
- Creates Stripe Checkout Session with BDT currency line items
- Updates the order with the Stripe session ID
- Returns the Stripe checkout URL for redirect

### Step 3: Create `stripe-webhook` Edge Function
A backend function that:
- Receives Stripe webhook events
- On `checkout.session.completed`, updates the order's `payment_status` to "paid"
- Supports optional webhook signature verification

### Step 4: Update `supabase/config.toml`
Add entries for both new edge functions with `verify_jwt = false` (webhooks and checkout sessions don't use JWT auth).

### Step 5: Update `Checkout.tsx`
- When "Cash on Delivery" is selected: current flow (unchanged)
- When "Online Payment" is selected:
  1. Save order to database with `payment_method: 'online'` and `payment_status: 'unpaid'`
  2. Call `create-checkout-session` edge function
  3. Redirect customer to Stripe's hosted checkout page
  4. On success, Stripe redirects to the order confirmation page
  5. Webhook updates `payment_status` to "paid" in the background

### Technical Details

**Edge Function: `create-checkout-session`**
- Converts order items to Stripe line items (BDT currency, amounts in paisa)
- Adds shipping as a separate line item
- Sets success/cancel redirect URLs
- Stores order metadata in the Stripe session

**Edge Function: `stripe-webhook`**
- Handles `checkout.session.completed` event
- Uses service role key to update order status
- Supports optional `STRIPE_WEBHOOK_SECRET` for signature verification

**Checkout.tsx Changes**
- Split `handleSubmit` to handle both payment methods
- For online: create order first, then redirect to Stripe
- For COD: existing flow unchanged
- Include `payment_method` and `payment_status` fields in order insert

