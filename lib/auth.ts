/**
 * 半球 halfsphere - Auth 辅助函数
 */
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

export async function getUserTier(userId: string): Promise<"free" | "pro"> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_tiers")
    .select("tier")
    .eq("user_id", userId)
    .single();

  if (error || !data) return "free";
  return data.tier as "free" | "pro";
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requirePro() {
  const user = await requireAuth();
  const tier = await getUserTier(user.id);
  if (tier !== "pro") {
    throw new Error("Pro tier required");
  }
  return user;
}
