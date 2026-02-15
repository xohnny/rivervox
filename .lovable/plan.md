

## Fix Telegram Notification to Use USD Instead of BDT

**Problem**: The Telegram order notification currently displays all prices with the BDT symbol (৳), but your store's base currency is USD ($). The prices stored in the database (e.g., 189 for the Emerald Silk Thobe) are USD values, so the notification should reflect that.

**What will change**:

1. **Update the `notify-order` edge function** (`supabase/functions/notify-order/index.ts`):
   - Replace all `৳` symbols with `$` in the `formatTelegramMessage` function
   - Update the currency formatting to show 2 decimal places (e.g., `$189.00` instead of `৳189`)

2. **Update the checkout shipping cost comment** (`src/pages/Checkout.tsx`):
   - Change the comment from "60 Taka / 100 Taka" to reflect USD values for clarity

No database changes needed. The actual price values remain the same -- only the display symbol in the Telegram message changes.

### Technical Details

In `supabase/functions/notify-order/index.ts`, the `formatTelegramMessage` function will be updated:
- Line items: `৳${item.unit_price}` becomes `$${item.unit_price.toFixed(2)}`
- Subtotal, Shipping, Total: same symbol change with 2 decimal places

In `src/pages/Checkout.tsx`, the shipping cost comment on line 60 will be updated for accuracy.

