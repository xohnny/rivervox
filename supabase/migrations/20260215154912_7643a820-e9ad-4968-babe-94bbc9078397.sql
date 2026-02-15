
-- Create site_content table
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  section text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid,
  UNIQUE(page, section)
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public can read all content
CREATE POLICY "Anyone can read site content"
ON public.site_content
FOR SELECT
USING (true);

-- Admins can update content
CREATE POLICY "Admins can update site content"
ON public.site_content
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert content
CREATE POLICY "Admins can insert site content"
ON public.site_content
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete content
CREATE POLICY "Admins can delete site content"
ON public.site_content
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Auto-update timestamp
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed homepage hero content
INSERT INTO public.site_content (page, section, content) VALUES
('home', 'hero', '{
  "badge_text": "New Collection 2026",
  "title_line1": "Elegance Meets",
  "title_line2": "Modesty",
  "description": "Discover our premium collection of Islamic-inspired fashion. Crafted with love, designed for the modern family.",
  "button1_text": "Shop Collection",
  "button1_link": "/shop",
  "button2_text": "Contact Us",
  "button2_link": "/contact",
  "background_image": ""
}'::jsonb),
('home', 'features', '{
  "items": [
    {"icon": "Truck", "title": "Free Shipping", "description": "On orders over $100"},
    {"icon": "Shield", "title": "Secure Payment", "description": "100% secure checkout"},
    {"icon": "RefreshCw", "title": "Easy Returns", "description": "30-day return policy"},
    {"icon": "Headphones", "title": "24/7 Support", "description": "Dedicated assistance"}
  ]
}'::jsonb),
('home', 'categories', '{
  "section_label": "Shop by Category",
  "section_title": "Explore Our Collections",
  "items": [
    {"name": "Men", "slug": "men", "description": "Elegant thobes & kurtas", "image": ""},
    {"name": "Women", "slug": "women", "description": "Graceful abayas & hijabs", "image": ""},
    {"name": "Children", "slug": "children", "description": "Adorable modest wear", "image": ""},
    {"name": "Accessories", "slug": "accessories", "description": "Complete your look", "image": ""}
  ]
}'::jsonb),
('home', 'testimonials', '{
  "section_label": "What Our Customers Say",
  "section_title": "Trusted by Thousands"
}'::jsonb);
