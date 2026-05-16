import { NextResponse } from "next/server";
import { getUserTier } from "@/lib/auth";

export async function requireAuth(supabase: any) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { error: NextResponse.json({ error: "未登录" }, { status: 401 }), user: null };
  }
  return { error: null, user };
}

export async function requireAdmin(supabase: any) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { error: NextResponse.json({ error: "未登录" }, { status: 401 }), user: null };
  }
  const tier = await getUserTier(user.id);
  if (tier?.tier !== "admin") {
    return { error: NextResponse.json({ error: "需要管理员权限" }, { status: 403 }), user: null };
  }
  return { error: null, user };
}

// Legacy compat
export async function requirePro(supabase: any) {
  return requireAuth(supabase);
}
