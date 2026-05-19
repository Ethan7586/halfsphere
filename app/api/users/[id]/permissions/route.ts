import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const OWNER_EMAIL = "ethan7586@gsyen.com";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user: adminUser, error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const { tier, permissions } = body;

  const admin = createAdminClient();

  // 不能修改自己
  if (id === adminUser.id) {
    return NextResponse.json({ error: "不能修改自己的权限" }, { status: 400 });
  }

  // 不能修改 owner
  const { data: targetUser } = await admin.auth.admin.getUserById(id);
  if (targetUser?.user?.email?.toLowerCase() === OWNER_EMAIL) {
    return NextResponse.json({ error: "不能修改 Owner 的权限" }, { status: 403 });
  }

  // 禁止通过 UI 把任何人提升为 owner
  if (tier === "owner") {
    return NextResponse.json({ error: "不能通过界面设置 owner 角色" }, { status: 403 });
  }

  const updates: Record<string, unknown> = {};
  if (tier !== undefined) updates.tier = tier;
  if (permissions !== undefined) updates.permissions = permissions;
  updates.granted_by = adminUser.id;
  updates.upgraded_at = new Date().toISOString();

  const { error: updateErr } = await admin
    .from("user_tiers")
    .update(updates as any)
    .eq("user_id", id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
