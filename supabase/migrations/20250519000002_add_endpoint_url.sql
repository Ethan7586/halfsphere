-- Add endpoint_url to providers table
-- Needed by New-API / One-API provider support

ALTER TABLE public.providers
  ADD COLUMN IF NOT EXISTS endpoint_url TEXT;

COMMENT ON COLUMN public.providers.endpoint_url IS 'New-API / One-API instance base URL';
