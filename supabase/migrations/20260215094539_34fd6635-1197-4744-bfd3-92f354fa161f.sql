
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

INSERT INTO public.store_settings DEFAULT VALUES;

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read settings"
  ON public.store_settings FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings"
  ON public.store_settings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));
