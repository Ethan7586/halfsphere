import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendRejectionEmail } from "@/lib/email";

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

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const admin = createAdminClient();

  const { data: req, error: reqError } = await admin
    .from("registration_requests")
    .select("status, email, display_name")
    .eq("id", id)
    .single();

  if (reqError || !req) {
    return NextResponse.json({ error: "申请不存在" }, { status: 404 });
  }

  if (req.status !== "pending") {
    return NextResponse.json({ error: "该申请已处理" }, { status: 409 });
  }

  const { error } = await admin
    .from("registration_requests")
    .update({ status: "rejected", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("拒绝申请失败:", error);
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }

  // 发送拒绝邮件（失败不阻断流程）
  try {
    const r = req as { email: string; display_name: string; status: string };
    await sendRejectionEmail(r.email, r.display_name);
  } catch (emailErr) {
    console.error("发送拒绝邮件失败:", emailErr);
  }

  return NextResponse.json({ success: true });
}
