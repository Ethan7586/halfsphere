#!/usr/bin/env node
/**
 * sync-claude-code.mjs
 * Scans ~/.claude/projects/**\/*.jsonl, aggregates token usage by day+model,
 * and pushes to halfsphere /api/usage/ingest.
 *
 * Setup: add to .env.local
 *   HALFSPHERE_USER_EMAIL=your@email.com
 *   CRON_SECRET=same-value-as-on-vercel
 *
 * Run:
 *   node scripts/sync-claude-code.mjs
 */

import fs from "fs";
import path from "path";
import os from "os";

// ── Load .env.local ──────────────────────────────────────────────────────────
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

const HALFSPHERE_URL = process.env.HALFSPHERE_URL ?? "https://www.halfsphere.com";
const SYNC_SECRET = process.env.CRON_SECRET;
const USER_EMAIL = process.env.HALFSPHERE_USER_EMAIL;

if (!SYNC_SECRET || !USER_EMAIL) {
  console.error("Missing CRON_SECRET or HALFSPHERE_USER_EMAIL in .env.local");
  process.exit(1);
}

// ── Parse JSONL ──────────────────────────────────────────────────────────────
function parseFile(filePath, acc) {
  let content;
  try { content = fs.readFileSync(filePath, "utf-8"); } catch { return; }

  for (const line of content.split("\n")) {
    if (!line.trim()) continue;
    try {
      const rec = JSON.parse(line);
      if (rec.type !== "assistant") continue;
      const usage = rec.message?.usage;
      const model = rec.message?.model;
      const ts = rec.timestamp;
      if (!usage || !model || !ts) continue;

      const date = ts.slice(0, 10);
      const key = `${date}::${model}`;
      const e = acc.get(key) ?? {
        date, model,
        input_tokens: 0, output_tokens: 0,
        cache_creation_input_tokens: 0, cache_read_input_tokens: 0,
      };
      e.input_tokens += usage.input_tokens ?? 0;
      e.output_tokens += usage.output_tokens ?? 0;
      e.cache_creation_input_tokens += usage.cache_creation_input_tokens ?? 0;
      e.cache_read_input_tokens += usage.cache_read_input_tokens ?? 0;
      acc.set(key, e);
    } catch { /* skip malformed */ }
  }
}

function scanProjects() {
  const dir = path.join(os.homedir(), ".claude", "projects");
  const acc = new Map();
  if (!fs.existsSync(dir)) { console.log("~/.claude/projects not found"); return []; }

  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".jsonl")) parseFile(full, acc);
    }
  }
  walk(dir);
  return Array.from(acc.values());
}

// ── Push ─────────────────────────────────────────────────────────────────────
async function push(entries) {
  const res = await fetch(`${HALFSPHERE_URL}/api/usage/ingest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-sync-secret": SYNC_SECRET,
    },
    body: JSON.stringify({ user_email: USER_EMAIL, entries }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(body)}`);
  return body;
}

// ── Main ─────────────────────────────────────────────────────────────────────
console.log("Scanning ~/.claude/projects...");
const entries = scanProjects();
console.log(`Found ${entries.length} day+model combinations`);
if (entries.length === 0) process.exit(0);

console.log(`Pushing to ${HALFSPHERE_URL}...`);
push(entries)
  .then((r) => console.log(`Done. Upserted ${r.upserted}/${r.total}`))
  .catch((e) => { console.error("Failed:", e.message); process.exit(1); });
