import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { randomBytes } from "crypto";

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

  // 1. 获取申请信息
  const { data: rawReq, error: reqError } = await admin
    .from("registration_requests")
    .select("*")
    .eq("id", id)
    .single();

  const req = rawReq as { status: string; email: string; display_name: string } | null;

  if (reqError || !req || req.status !== "pending") {
    return NextResponse.json({ error: "申请不存在或已处理" }, { status: 404 });
  }

  // 2. 生成随机密码
  const tempPassword = randomBytes(12).toString("hex");

  // 3. 创建 Supabase 用户
  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email: req.email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { display_name: req.display_name },
  });

  if (createError) {
    console.error("创建用户失败:", createError);
    return NextResponse.json({ error: createError.message }, { status: 500 });
  }

  // 4. 更新申请状态
  const { error: updateError } = await admin
    .from("registration_requests")
    .update({ status: "approved", updated_at: new Date().toISOString() } as any)
    .eq("id", id);

  if (updateError) {
    console.error("更新申请状态失败:", updateError);
  }

  return NextResponse.json({
    success: true,
    email: req.email,
    temp_password: tempPassword,
    message: `用户已创建，初始密码: ${tempPassword}`,
  });
}
