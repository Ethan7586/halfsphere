"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardLabel } from "@/components/primitives";
import { useAuth } from "@/hooks/use-auth";

interface Provider {
  id: string;
  name: string;
  display_name: string;
}

const PROVIDER_OPTIONS = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "gemini", label: "Google Gemini" },
  { value: "deepseek", label: "DeepSeek" },
  { value: "openrouter", label: "OpenRouter" },
];

export default function SettingsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [newProvider, setNewProvider] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newApiKey, setNewApiKey] = useState("");
  const queryClient = useQueryClient();
  const { tier } = useAuth();

  const { data, isLoading } = useQuery<{ data: Provider[] }>({
    queryKey: ["providers"],
    queryFn: async () => {
      const res = await fetch("/api/providers");
      if (!res.ok) throw new Error("获取 providers 失败");
      return res.json();
    },
  });

  const addMutation = useMutation({
    mutationFn: async (payload: { name: string; display_name: string; api_key: string }) => {
      const res = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "添加失败");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
      setIsOpen(false);
      setNewProvider("");
      setNewDisplayName("");
      setNewApiKey("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/providers?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("删除失败");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["providers"] }),
  });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newProvider || !newApiKey) return;
    addMutation.mutate({ name: newProvider, display_name: newDisplayName || newProvider, api_key: newApiKey });
  }

  const providers = data?.data ?? [];

  return (
    <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <div className="mono" style={{ fontSize: 10.5, color: "var(--fg-faint)", letterSpacing: "0.22em", marginBottom: 6 }}>
          CONTROLS · SETTINGS
        </div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em", color: "var(--fg)" }}>
          设置
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardLabel>Providers</CardLabel>
          <button
            onClick={() => setIsOpen(true)}
            style={{
              background: "var(--amber)",
              border: "1px solid var(--amber)",
              color: "#0A0A0B",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "6px 14px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            + 添加
          </button>
        </CardHeader>
        <div style={{ padding: "16px 18px" }}>
          {isLoading ? (
            <div className="mono" style={{ color: "var(--fg-mute)", fontSize: 12 }}>加载中...</div>
          ) : providers.length === 0 ? (
            <div className="mono" style={{ color: "var(--fg-mute)", fontSize: 12, textAlign: "center", padding: "20px 0" }}>
              暂无 Provider，点击右上角"添加"按钮配置
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {providers.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    background: "var(--bg-elev-1)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>{p.display_name}</span>
                    <span className="mono" style={{ fontSize: 10, color: "var(--fg-mute)" }}>{p.name}</span>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(p.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--fg-faint)",
                      fontSize: 11,
                      cursor: "pointer",
                      transition: "color .15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--red)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-faint)")}
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Add dialog */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          onClick={() => setIsOpen(false)}
        >
          <Card style={{ width: 420, maxWidth: "90vw" }} onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardLabel>添加 Provider</CardLabel>
            </CardHeader>
            <form onSubmit={handleAdd} style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label className="mono" style={{ fontSize: 9.5, color: "var(--fg-mute)", letterSpacing: "0.18em", textTransform: "uppercase" }}>Provider</label>
                <select
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  style={{ background: "var(--bg-elev-1)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 12px", color: "var(--fg)", fontSize: 14 }}
                >
                  <option value="">选择 provider</option>
                  {PROVIDER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label className="mono" style={{ fontSize: 9.5, color: "var(--fg-mute)", letterSpacing: "0.18em", textTransform: "uppercase" }}>显示名称（可选）</label>
                <input
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="例如：OpenAI 主账号"
                  style={{ background: "var(--bg-elev-1)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 12px", color: "var(--fg)", fontSize: 14 }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label className="mono" style={{ fontSize: 9.5, color: "var(--fg-mute)", letterSpacing: "0.18em", textTransform: "uppercase" }}>API Key</label>
                <input
                  type="password"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  placeholder="sk-..."
                  required
                  style={{ background: "var(--bg-elev-1)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 12px", color: "var(--fg)", fontSize: 14 }}
                />
                <span className="mono" style={{ fontSize: 9.5, color: "var(--fg-faint)" }}>密钥将使用 AES-256-GCM 加密存储</span>
              </div>
              {addMutation.isError && <p style={{ margin: 0, fontSize: 12, color: "var(--red)" }}>{addMutation.error instanceof Error ? addMutation.error.message : "添加失败"}</p>}
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setIsOpen(false)} style={{ flex: 1, background: "transparent", border: "1px solid var(--border)", color: "var(--fg-dim)", borderRadius: 6, padding: "10px 0", fontSize: 13, cursor: "pointer" }}>取消</button>
                <button type="submit" disabled={addMutation.isPending} style={{ flex: 1, background: "var(--amber)", border: "1px solid var(--amber)", color: "#0A0A0B", borderRadius: 6, padding: "10px 0", fontSize: 13, fontWeight: 600, cursor: addMutation.isPending ? "not-allowed" : "pointer" }}>
                  {addMutation.isPending ? "添加中..." : "添加"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Sync card */}
      <Card>
        <CardHeader>
          <CardLabel>数据同步</CardLabel>
        </CardHeader>
        <div style={{ padding: "16px 18px" }}>
          <SyncButton />
        </div>
      </Card>

      {/* Permissions — admin only */}
      {tier === "admin" && <PermissionsPanel />}
    </div>
  );
}

function SyncButton() {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState("");

  async function handleSync() {
    setSyncing(true);
    setSyncResult("");
    try {
      const res = await fetch("/api/usage/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        const success = data.results.filter((r: { status: string }) => r.status === "success").length;
        const failed = data.results.filter((r: { status: string }) => r.status === "error").length;
        setSyncResult(`同步完成：成功 ${success} 个，失败 ${failed} 个`);
      } else {
        setSyncResult(`同步失败：${data.error || "未知错误"}`);
      }
    } catch {
      setSyncResult("同步请求失败");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <button
        onClick={handleSync}
        disabled={syncing}
        style={{
          background: "transparent",
          border: "1px solid var(--border-strong)",
          color: "var(--fg-dim)",
          borderRadius: 4,
          padding: "8px 16px",
          fontSize: 12,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: syncing ? "not-allowed" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          width: "fit-content",
        }}
      >
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 3v3h-3" />
        </svg>
        {syncing ? "同步中..." : "手动触发同步"}
      </button>
      {syncResult && (
        <p style={{ margin: 0, fontSize: 12, color: syncResult.includes("失败") ? "var(--red)" : "var(--green)" }}>
          {syncResult}
        </p>
      )}
    </div>
  );
}

/* ── Permissions Panel (admin only) ── */
interface UserRow {
  id: string;
  email: string;
  display_name: string;
  tier: string;
  permissions: string[];
  last_sign_in_at: string | null;
}

const ALL_PERMS = [
  { key: "base", label: "基地监控" },
  { key: "fleet", label: "舰队管理" },
  { key: "budget", label: "预算设置" },
  { key: "provider", label: "添加 Provider" },
];

function PermissionsPanel() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<{ data: UserRow[] }>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("获取用户列表失败");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, tier, permissions }: { id: string; tier?: string; permissions?: string[] }) => {
      const res = await fetch(`/api/users/${id}/permissions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, permissions }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "更新失败");
      }
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const users = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardLabel>用户权限 / Permissions</CardLabel>
      </CardHeader>
      <div style={{ padding: "16px 18px" }}>
        {isLoading ? (
          <div className="mono" style={{ color: "var(--fg-mute)", fontSize: 12 }}>加载中...</div>
        ) : users.length === 0 ? (
          <div className="mono" style={{ color: "var(--fg-mute)", fontSize: 12 }}>暂无用户</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {users.map((u) => (
              <div
                key={u.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  background: "var(--bg-elev-1)",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>{u.display_name}</div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--fg-mute)" }}>{u.email}</div>
                </div>

                {/* Tier selector */}
                <select
                  value={u.tier}
                  onChange={(e) => updateMutation.mutate({ id: u.id, tier: e.target.value })}
                  style={{
                    background: "var(--bg-elev-1)",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    padding: "4px 8px",
                    color: "var(--fg)",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>

                {/* Permission toggles */}
                <div style={{ display: "flex", gap: 6 }}>
                  {ALL_PERMS.map((p) => {
                    const active = u.permissions.includes(p.key);
                    return (
                      <button
                        key={p.key}
                        onClick={() => {
                          const next = active
                            ? u.permissions.filter((x) => x !== p.key)
                            : [...u.permissions, p.key];
                          updateMutation.mutate({ id: u.id, permissions: next });
                        }}
                        title={p.label}
                        style={{
                          padding: "4px 8px",
                          borderRadius: 4,
                          border: `1px solid ${active ? "var(--green)" : "var(--border)"}`,
                          background: active ? "rgba(74,222,128,0.08)" : "transparent",
                          color: active ? "var(--green)" : "var(--fg-mute)",
                          fontSize: 10,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        {updateMutation.isError && (
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--red)" }}>
            {updateMutation.error instanceof Error ? updateMutation.error.message : "更新失败"}
          </p>
        )}
      </div>
    </Card>
  );
}
