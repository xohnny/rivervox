

## Stripe Payment Integration

### Overview
Integrate Stripe into your store to enable online payments at checkout. This will allow customers to pay securely with credit/debit cards when they select the "Online Payment" option.

### How It Works

1. **Enable Stripe** -- Connect your Stripe account to this project by providing your Stripe secret key.

2. **Create a payment edge function** -- A backend function that creates a Stripe Checkout Session when a customer places an order with "Online Payment" selected.

3. **Update the checkout flow**:
   - When "Cash on Delivery" is selected, the current flow remains unchanged.
   - When "Online Payment" is selected, the customer is redirected to Stripe's hosted checkout page to complete payment.
   - After successful payment, they return to the order confirmation page.

4. **Order status tracking** -- Orders placed via Stripe will be marked as "paid" once payment is confirmed.

### What You Need
- A **Stripe account** (free to create at stripe.com)
- Your **Stripe Secret Key** (found in Stripe Dashboard under Developers > API Keys)
- You can use **test mode** keys first to try it out before going live

### Technical Details

**Step 1**: Enable the Stripe integration and provide your secret key.

**Step 2**: Create an edge function (`create-checkout-session`) that:
- Receives order details (items, shipping, totals)
- Creates line items in Stripe
- Returns a Stripe Checkout Session URL

**Step 3**: Update `Checkout.tsx`:
- When payment method is "online" and user clicks "Place Order", call the edge function
- Redirect the user to Stripe's payment page
- On success, redirect back to the order confirmation page
- Save the order to the database with payment status

**Step 4**: Add a webhook edge function (`stripe-webhook`) to:
- Listen for `checkout.session.completed` events
- Update the order's payment status in the database

### Flow Summary

```text
Customer selects "Online Payment"
  --> Clicks "Place Order"
  --> Order saved to database (status: pending_payment)
  --> Redirected to Stripe Checkout page
  --> Completes payment on Stripe
  --> Stripe webhook updates order to "paid"
  --> Customer redirected to Order Confirmation page
```

