/**
 * POST /api/usage/ingest
 * Receives Claude Code local usage pushed by scripts/sync-claude-code.mjs
 * Auth: x-sync-secret header must match CRON_SECRET env var
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ANTHROPIC_PRICING } from "@/lib/providers/pricing";

interface IngestEntry {
  date: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
}

interface IngestPayload {
  user_email: string;
  entries: IngestEntry[];
}

function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-sync-secret");
  const expectedSecret = process.env.CRON_SECRET;
  if (!secret || !expectedSecret || !timingSafeCompare(secret, expectedSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: IngestPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { user_email, entries } = body;
  if (!user_email || !Array.isArray(entries) || entries.length === 0) {
    return NextResponse.json({ error: "Missing user_email or entries" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  // Find user by email
  const { data: { users }, error: userError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (userError) {
    return NextResponse.json({ error: "Failed to query users" }, { status: 500 });
  }
  const user = users.find((u) => u.email === user_email);
  if (!user) {
    return NextResponse.json({ error: `User not found: ${user_email}` }, { status: 404 });
  }

  // Find existing anthropic provider for this user (Claude Code = Anthropic model)
  const { data: existing, error: selectErr } = await supabase
    .from("providers")
    .select("id")
    .eq("user_id", user.id)
    .eq("name", "anthropic")
    .maybeSingle();

  if (selectErr) {
    return NextResponse.json({ error: "Provider query failed", detail: selectErr.message }, { status: 500 });
  }

  let providerId: string;
  if (existing) {
    providerId = existing.id;
  } else {
    const { data: created, error: createErr } = await supabase
      .from("providers")
      .insert({
        user_id: user.id,
        name: "anthropic",
        display_name: "Claude Code",
        api_key_encrypted: "",
        api_key_iv: "",
        api_key_tag: "",
      })
      .select("id")
      .single();
    if (createErr || !created) {
      return NextResponse.json({ error: "Failed to create provider", detail: createErr?.message }, { status: 500 });
    }
    providerId = created.id;
  }

  // Upsert daily aggregates
  let upserted = 0;
  for (const entry of entries) {
    const pricing = ANTHROPIC_PRICING[entry.model];
    const cost_usd = pricing
      ? (entry.input_tokens * pricing.input + entry.output_tokens * pricing.output) / 1_000_000
      : 0;

    const { error } = await supabase.from("usage_snapshots").upsert(
      {
        user_id: user.id,
        provider_id: providerId,
        date: entry.date,
        model: entry.model,
        input_tokens: entry.input_tokens,
        output_tokens: entry.output_tokens,
        cost_usd,
        raw_data: {
          cache_creation_input_tokens: entry.cache_creation_input_tokens ?? 0,
          cache_read_input_tokens: entry.cache_read_input_tokens ?? 0,
          source: "claude_code",
        },
        synced_at: new Date().toISOString(),
      },
      { onConflict: "user_id, provider_id, date, model" }
    );
    if (!error) upserted++;
  }

  return NextResponse.json({ success: true, upserted, total: entries.length });
}
