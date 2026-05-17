-- ============================================
-- EMERGENCY: 重建 user_tiers 表（保留数据）
-- 用于修复 RLS 递归导致的 500 错误
-- ============================================

-- 1. 先禁用 RLS 止血（superuser 不受 RLS 影响，此命令安全）
ALTER TABLE user_tiers DISABLE ROW LEVEL SECURITY;

-- 2. 备份数据
DROP TABLE IF EXISTS public.user_tiers_backup;
CREATE TABLE public.user_tiers_backup AS SELECT * FROM public.user_tiers;

-- 3. 删除 auth.users 上的触发器
DROP TRIGGER IF EXISTS on_auth_user_created_tier ON auth.users;

-- 4. 删除旧表
DROP TABLE IF EXISTS public.user_tiers CASCADE;

-- 5. 重建表（正确的结构）
CREATE TABLE public.user_tiers (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tier TEXT NOT NULL DEFAULT 'user' CHECK (tier IN ('guest', 'user', 'admin')),
    permissions JSONB DEFAULT '[]',
    granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. 恢复数据
INSERT INTO public.user_tiers (user_id, tier, permissions, granted_by, created_at, updated_at)
SELECT 
    user_id,
    CASE 
        WHEN tier IN ('free', 'pro') THEN 'user'
        WHEN tier IN ('guest', 'user', 'admin') THEN tier
        ELSE 'user'
    END,
    COALESCE(permissions, '[]'::jsonb),
    granted_by,
    COALESCE(created_at, NOW()),
    COALESCE(updated_at, NOW())
FROM public.user_tiers_backup
ON CONFLICT (user_id) DO NOTHING;

-- 7. 启用 RLS + 创建安全的 Policy（无递归）
ALTER TABLE public.user_tiers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_tiers_admin_all ON user_tiers;
DROP POLICY IF EXISTS user_tiers_self ON user_tiers;
DROP POLICY IF EXISTS "用户只能查看自己的等级" ON user_tiers;
DROP POLICY IF EXISTS "用户不能修改自己的等级" ON user_tiers;
DROP POLICY IF EXISTS user_tiers_self_select ON user_tiers;
DROP POLICY IF EXISTS user_tiers_self_update ON user_tiers;

CREATE POLICY user_tiers_self_select ON user_tiers
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY user_tiers_self_update ON user_tiers
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 8. 重新创建触发器（新用户注册自动插入 user 记录）
CREATE OR REPLACE FUNCTION public.handle_new_user_tier()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_tiers (user_id, tier)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_tier
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_tier();

-- 9. 授权
GRANT SELECT, UPDATE ON public.user_tiers TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 10. 清理备份（确认网站恢复正常后手动执行）
-- DROP TABLE public.user_tiers_backup;
