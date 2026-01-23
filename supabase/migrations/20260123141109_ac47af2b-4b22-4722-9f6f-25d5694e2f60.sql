-- Drop existing INSERT policy for reviews
DROP POLICY IF EXISTS "Users can create their own reviews" ON public.reviews;

-- Create new policy that allows anyone to insert reviews (guest reviews)
CREATE POLICY "Anyone can create reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (true);

-- Make user_id nullable to allow guest reviews
ALTER TABLE public.reviews ALTER COLUMN user_id DROP NOT NULL;