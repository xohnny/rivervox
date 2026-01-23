-- Create products table for inventory management
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  original_price numeric,
  category text NOT NULL CHECK (category IN ('men', 'women', 'children', 'accessories')),
  sizes text[] NOT NULL DEFAULT '{}',
  colors jsonb NOT NULL DEFAULT '[]',
  images text[] NOT NULL DEFAULT '{}',
  stock integer NOT NULL DEFAULT 0,
  low_stock_threshold integer NOT NULL DEFAULT 10,
  featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can view active products
CREATE POLICY "Anyone can view active products"
ON public.products
FOR SELECT
USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage products"
ON public.products
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create stock_alerts table for low stock notifications
CREATE TABLE public.stock_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  alert_type text NOT NULL DEFAULT 'low_stock',
  current_stock integer NOT NULL,
  threshold integer NOT NULL,
  is_acknowledged boolean NOT NULL DEFAULT false,
  acknowledged_at timestamp with time zone,
  acknowledged_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on stock_alerts
ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;

-- Admins can view and manage stock alerts
CREATE POLICY "Admins can view stock alerts"
ON public.stock_alerts
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage stock alerts"
ON public.stock_alerts
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to check and create low stock alerts
CREATE OR REPLACE FUNCTION public.check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- If stock dropped below threshold and there's no unacknowledged alert
  IF NEW.stock <= NEW.low_stock_threshold AND NEW.stock < OLD.stock THEN
    -- Check if there's already an unacknowledged alert for this product
    IF NOT EXISTS (
      SELECT 1 FROM public.stock_alerts 
      WHERE product_id = NEW.id 
      AND is_acknowledged = false
    ) THEN
      INSERT INTO public.stock_alerts (product_id, current_stock, threshold)
      VALUES (NEW.id, NEW.stock, NEW.low_stock_threshold);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create low stock alerts
CREATE TRIGGER check_low_stock_trigger
AFTER UPDATE OF stock ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.check_low_stock();