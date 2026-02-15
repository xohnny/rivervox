
ALTER TABLE public.store_settings
  ADD COLUMN shipping_rate_us numeric DEFAULT 5.99,
  ADD COLUMN shipping_rate_uk numeric DEFAULT 7.99;
