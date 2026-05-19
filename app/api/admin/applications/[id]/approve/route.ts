import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { randomBytes } from "crypto";
import { sendApprovalEmail } from "@/lib/email";

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

  // 2. 检查用户是否已存在
  const { data: existingUsers } = await admin.auth.admin.listUsers();
  const alreadyExists = existingUsers?.users.some(
    (u) => u.email?.toLowerCase() === req.email.toLowerCase()
  );

  let tempPassword: string | null = null;

  if (!alreadyExists) {
    // 3a. 用户不存在，正常创建
    tempPassword = randomBytes(12).toString("hex");
    const { error: createError } = await admin.auth.admin.createUser({
      email: req.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { display_name: req.display_name },
    });

    if (createError) {
      console.error("创建用户失败:", createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }
  }
  // 3b. 用户已存在，跳过创建，直接标记通过

  // 4. 更新申请状态
  const { error: updateError } = await admin
    .from("registration_requests")
    .update({ status: "approved", updated_at: new Date().toISOString() } as any)
    .eq("id", id);

  if (updateError) {
    console.error("更新申请状态失败:", updateError);
  }

  // 发送通过邮件（已存在用户不发密码）
  if (!alreadyExists && tempPassword) {
    try {
      await sendApprovalEmail(req.email, req.display_name, tempPassword);
    } catch (emailErr) {
      console.error("发送审核通过邮件失败:", emailErr);
    }
  }

  return NextResponse.json({
    success: true,
    email: req.email,
    already_existed: alreadyExists,
    temp_password: tempPassword,
    message: alreadyExists ? "用户已存在，申请已标记为通过" : `用户已创建，初始密码: ${tempPassword}`,
  });
}
