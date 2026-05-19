-- Add upgraded_at column to user_tiers
-- Fix: Could not find the 'upgraded_at' column of 'user_tiers' in the schema cache

ALTER TABLE public.user_tiers
  ADD COLUMN IF NOT EXISTS upgraded_at TIMESTAMPTZ;

COMMENT ON COLUMN public.user_tiers.upgraded_at IS 'Timestamp when tier/permissions were last changed by admin';
