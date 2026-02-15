
-- Create exchange_rates table for caching AI-fetched rates
CREATE TABLE public.exchange_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  base_currency TEXT NOT NULL DEFAULT 'USD',
  rates JSONB NOT NULL DEFAULT '{}'::jsonb,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

-- Public read access (rates are public data)
CREATE POLICY "Anyone can view exchange rates"
ON public.exchange_rates
FOR SELECT
USING (true);

-- Only service role can insert/update (edge function uses service role)
