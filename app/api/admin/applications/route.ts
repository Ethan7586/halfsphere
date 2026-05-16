import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAIL = "ethan7586@gsyen.com";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { error: NextResponse.json({ error: "未登录" }, { status: 401 }), user: null };
  }
  if (user.email !== ADMIN_EMAIL) {
    return { error: NextResponse.json({ error: "无权限" }, { status: 403 }), user: null };
  }
  return { error: null, user };
}

export async function GET() {
  const { error, user } = await requireAdmin();
  if (error) return error;

  const admin = createAdminClient();
  const { data, error: dbError } = await admin
    .from("registration_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (dbError) {
    console.error("查询申请失败:", dbError);
    return NextResponse.json({ error: "查询失败" }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}
