"use client";

import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/sidebar";
import { HemisphereMark } from "@/components/hemisphere-mark";
import { Loader2 } from "lucide-react";

function GuestBrand() {
  return (
    <aside
      style={{
        width: 232,
        flexShrink: 0,
        borderRight: "1px solid var(--border)",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* logo block — 与 Sidebar 保持一致，只有图标变暗 */}
      <div
        style={{
          position: "relative",
          padding: "20px 18px 18px",
          borderBottom: "1px solid var(--border)",
          background:
            "linear-gradient(180deg, rgba(255,176,32,0.04) 0%, rgba(255,176,32,0) 60%), var(--bg)",
          overflow: "hidden",
        }}
      >
        <span style={{ position: "absolute", top: 8, left: 8, width: 6, height: 6, borderTop: "1px solid var(--amber-line)", borderLeft: "1px solid var(--amber-line)" }} />
        <span style={{ position: "absolute", top: 8, right: 8, width: 6, height: 6, borderTop: "1px solid var(--amber-line)", borderRight: "1px solid var(--amber-line)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ filter: "grayscale(1) brightness(0.65)", flexShrink: 0 }}>
            <HemisphereMark size={38} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, minWidth: 0 }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 21,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "var(--fg)",
                textTransform: "lowercase",
                lineHeight: 1,
              }}
            >
              halfsphere
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <span className="mono" style={{ fontSize: 9.5, color: "var(--amber)", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500 }}>半球</span>
              <span style={{ width: 1, height: 8, background: "var(--border-strong)" }} />
              <span className="mono" style={{ fontSize: 9.5, color: "var(--fg-mute)", letterSpacing: "0.2em", textTransform: "uppercase" }}>burn ctrl</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 8px", border: "1px solid var(--border)", borderRadius: 4, background: "var(--bg-elev-1)" }}>
          <span className="mono" style={{ fontSize: 9.5, color: "var(--fg-faint)", letterSpacing: "0.18em", textTransform: "uppercase" }}>CALLSIGN</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--fg-dim)", letterSpacing: "0.12em" }}>HSP-01 · v0.1.0</span>
        </div>
      </div>
    </aside>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B]">
        <Loader2 className="h-8 w-8 animate-spin text-[#FFB020]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-[#0A0A0B]">
        <GuestBrand />
        <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0B]">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
