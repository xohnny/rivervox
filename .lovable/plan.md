
## Persist Admin Settings to Database

**Problem:** The Settings page uses hardcoded default values and the Save button only shows a toast without saving to the database. Changes are lost on every page reload.

**Solution:** Create a `store_settings` database table and update the Settings page to load/save settings from the database.

### Step 1: Create Database Table

Create a `store_settings` table with a single-row design (key-value or single JSON row):

```sql
CREATE TABLE public.store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT DEFAULT 'Rivervox',
  store_email TEXT DEFAULT 'hello@rivervox.com',
  phone_number TEXT DEFAULT '+971 50 123 4567',
  store_address TEXT DEFAULT '123 Fashion Avenue, Dubai Mall, Level 2, Dubai, UAE',
  standard_shipping_rate NUMERIC DEFAULT 100,
  free_shipping_threshold NUMERIC DEFAULT 2000,
  enable_free_shipping BOOLEAN DEFAULT true,
  international_shipping BOOLEAN DEFAULT true,
  new_order_notifications BOOLEAN DEFAULT true,
  low_stock_alerts BOOLEAN DEFAULT true,
  customer_messages_notifications BOOLEAN DEFAULT true,
  admin_email TEXT DEFAULT 'admin@rivervox.com',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default row
INSERT INTO store_settings DEFAULT VALUES;

-- RLS: only admins can read/update
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read settings"
  ON store_settings FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings"
  ON store_settings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));
```

### Step 2: Update AdminSettings.tsx

- Replace hardcoded `defaultValue` with React state loaded from the database on mount.
- Use `useState` for each field group (store info, shipping, notifications, security).
- On page load, fetch the single row from `store_settings`.
- On "Save Changes", update that row in the database.
- Show loading skeleton while fetching initial data.

### Technical Details

**Data flow:**
1. Page mounts -> fetch `store_settings` row -> populate form state
2. User edits fields -> updates local state
3. User clicks "Save" -> `supabase.from('store_settings').update({...}).eq('id', settingsId)` -> show success/error toast

**Fields mapped:**
- Store Name, Email, Phone, Address (text inputs)
- Shipping Rate, Free Shipping Threshold (number inputs)
- Free Shipping, International Shipping (switches)
- Notification toggles (switches)
- Admin Email (text input)
- Password change will remain as-is (handled via auth, not stored in this table)

**Files to modify:**
- `src/pages/admin/AdminSettings.tsx` -- main changes to add data fetching and saving
- One database migration for the new table
