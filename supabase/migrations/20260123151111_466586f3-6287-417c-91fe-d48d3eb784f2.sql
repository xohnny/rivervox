-- Drop existing overly permissive insert policy
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Create a proper policy that allows both authenticated users and guests to create orders
-- For authenticated users: they can only create orders with their own user_id
-- For guests: they can create orders with null user_id
CREATE POLICY "Users and guests can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
  (auth.uid() IS NULL AND user_id IS NULL)
);

-- Also need to allow order_items to be inserted for guest orders
DROP POLICY IF EXISTS "Users can create their own order items" ON public.order_items;

CREATE POLICY "Anyone can create order items for valid orders" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_id
  )
);