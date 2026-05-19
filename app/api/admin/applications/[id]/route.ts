import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const admin = createAdminClient();

  const { error } = await admin
    .from("registration_requests")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("删除申请失败:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
