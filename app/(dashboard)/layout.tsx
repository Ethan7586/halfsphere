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
      }}
    >
      <div
        style={{
          padding: "20px 18px 18px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ filter: "grayscale(1) brightness(0.4)" }}>
          <HemisphereMark size={38} />
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
