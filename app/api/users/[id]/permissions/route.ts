import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

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

  // 不能修改自己（避免把自己降级）
  if (id === adminUser.id) {
    return NextResponse.json({ error: "不能修改自己的权限" }, { status: 400 });
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
