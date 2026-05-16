import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, display_name, reason } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
    }
    if (!display_name || typeof display_name !== "string" || display_name.length > 50) {
      return NextResponse.json({ error: "称呼格式不正确" }, { status: 400 });
    }
    if (reason && typeof reason === "string" && reason.length > 500) {
      return NextResponse.json({ error: "理由过长（最多500字）" }, { status: 400 });
    }

    const supabase = await createClient();

    // Check if email already has a pending request
    const { data: existing } = await supabase
      .from("registration_requests")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .eq("status", "pending")
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "该邮箱已有待审核的申请" },
        { status: 409 }
      );
    }

    const { error } = await supabase.from("registration_requests").insert({
      email: email.trim().toLowerCase(),
      display_name: display_name.trim(),
      reason: reason?.trim(),
    });

    if (error) {
      console.error("Insert registration request failed:", error);
      return NextResponse.json({ error: "提交失败" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("POST /api/apply error:", err);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
