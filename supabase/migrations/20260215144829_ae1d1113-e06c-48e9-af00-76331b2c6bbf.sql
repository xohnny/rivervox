
ALTER TABLE public.orders
  ADD COLUMN payment_method text NOT NULL DEFAULT 'cod',
  ADD COLUMN payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN stripe_session_id text;
