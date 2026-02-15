
-- Add logo_url column to store_settings
ALTER TABLE public.store_settings ADD COLUMN logo_url TEXT;

-- Create storage bucket for store assets
INSERT INTO storage.buckets (id, name, public) VALUES ('store-assets', 'store-assets', true);

-- Anyone can view store assets
CREATE POLICY "Anyone can view store assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'store-assets');

-- Only admins can upload/update/delete store assets
CREATE POLICY "Admins can upload store assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'store-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update store assets"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'store-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete store assets"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'store-assets' AND public.has_role(auth.uid(), 'admin'));
