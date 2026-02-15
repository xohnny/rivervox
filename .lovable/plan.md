

## Telegram Order Notifications

When a new order is placed, the admin will receive an instant Telegram message with order details (order number, customer name, phone, items, total amount).

### How It Works

1. **You create a Telegram Bot** (free, takes 2 minutes):
   - Open Telegram and search for `@BotFather`
   - Send `/newbot` and follow the prompts to name your bot
   - Copy the **Bot Token** you receive
   - Start a chat with your new bot, then get your **Chat ID** (I'll provide instructions)

2. **Backend function** receives order data and sends a formatted message to your Telegram

3. **Checkout flow** calls this function after an order is successfully created

### What the Notification Will Include
- Order number
- Customer name and phone
- Shipping address and city
- List of items with sizes, colors, quantities
- Total amount
- Order date/time

### Technical Details

**Step 1 - Store Telegram credentials as secrets**
- `TELEGRAM_BOT_TOKEN` - from BotFather
- `TELEGRAM_CHAT_ID` - your admin chat ID

**Step 2 - Create `notify-order` edge function**
- Accepts order details via POST
- Formats a clean Telegram message with order summary
- Sends via Telegram Bot API (`https://api.telegram.org/bot<token>/sendMessage`)
- CORS headers for browser calls
- JWT verification disabled (called from checkout with order data)

**Step 3 - Update `src/pages/Checkout.tsx`**
- After order and order items are successfully inserted, call the `notify-order` edge function with the order details
- Fire-and-forget (don't block checkout if notification fails)

**Step 4 - Add to `supabase/config.toml`**
- Register the new function with `verify_jwt = false`

**Future: WhatsApp support**
- The architecture will be designed so WhatsApp (via Twilio or WhatsApp Business API) can be added later by extending the same edge function

