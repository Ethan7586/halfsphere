-- 半球 halfsphere — 权限系统升级
-- 角色：guest(游客) → user(普通用户) → admin(管理员)

/* ── 1. 扩展 user_tiers ── */
ALTER TABLE user_tiers
  ADD COLUMN IF NOT EXISTS permissions  JSONB        DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS granted_by   UUID         REFERENCES auth.users(id) ON DELETE SET NULL;

/* 旧数据迁移：free → user，pro → user（后续由管理员手动赋权） */
UPDATE user_tiers SET tier = 'user' WHERE tier IN ('free', 'pro');

/* 硬编码管理员设为 admin */
UPDATE user_tiers SET tier = 'admin' WHERE user_id = '29964ebd-c191-4ddf-ad28-bed931cab458';

/* 给 user_tiers 加 comments */
COMMENT ON COLUMN user_tiers.tier         IS '角色：guest | user | admin';
COMMENT ON COLUMN user_tiers.permissions  IS 'JSONB 权限列表，如 ["base", "fleet", "burning-write"]';
COMMENT ON COLUMN user_tiers.granted_by   IS '授予该权限的管理员 user_id';

/* ── 2. 索引 ── */
CREATE INDEX IF NOT EXISTS idx_user_tiers_tier ON user_tiers(tier);
CREATE INDEX IF NOT EXISTS idx_user_tiers_permissions ON user_tiers USING GIN(permissions);

/* ── 3. 更新触发器：新注册用户默认 user ── */
CREATE OR REPLACE FUNCTION public.handle_new_user_tier()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_tiers (user_id, tier)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/* 确保触发器存在（idempotent） */
DROP TRIGGER IF EXISTS on_auth_user_created_tier ON auth.users;
CREATE TRIGGER on_auth_user_created_tier
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_tier();

/* ── 4. RLS：user_tiers 表策略调整 ── */
ALTER TABLE user_tiers ENABLE ROW LEVEL SECURITY;

/* 管理员可读写全部 */
DROP POLICY IF EXISTS user_tiers_admin_all ON user_tiers;
CREATE POLICY user_tiers_admin_all ON user_tiers
  FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM user_tiers WHERE tier = 'admin'));

/* 用户只能读写自己 */
DROP POLICY IF EXISTS user_tiers_self ON user_tiers;
CREATE POLICY user_tiers_self ON user_tiers
  FOR ALL
  USING (auth.uid() = user_id);
