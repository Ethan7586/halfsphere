-- Add 'owner' tier and promote ethan7586

-- 1. Drop old inline CHECK constraint safely
DO 
DECLARE
    constraint_name TEXT;
BEGIN
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.user_tiers'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%tier%';
    
    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.user_tiers DROP CONSTRAINT %I', constraint_name);
    END IF;
END ;

-- 2. Add new CHECK constraint with owner
ALTER TABLE public.user_tiers
  ADD CONSTRAINT user_tiers_tier_check
  CHECK (tier IN ('guest', 'user', 'admin', 'owner'));

-- 3. Promote ethan7586 to owner
UPDATE public.user_tiers
  SET tier = 'owner', upgraded_at = NOW()
  WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'ethan7586@gsyen.com'
  );

COMMENT ON COLUMN public.user_tiers.tier IS '角色：guest | user | admin | owner';
