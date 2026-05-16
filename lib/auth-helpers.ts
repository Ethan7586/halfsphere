import { NextResponse } from "next/server";
import { getUserTier } from "@/lib/auth";

export async function requirePro(supabase: any) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { error: NextResponse.json({ error: "未登录" }, { status: 401 }), user: null };
  }
  const tier = await getUserTier(user.id);
  if (tier !== "pro") {
    return { error: NextResponse.json({ error: "Pro 权限 required" }, { status: 403 }), user: null };
  }
  return { error: null, user };
}
