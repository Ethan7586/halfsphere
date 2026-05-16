"use client";

import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/sidebar";
import { Loader2 } from "lucide-react";

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

  /* 游客模式：无 sidebar，全屏展示 preview */
  if (!user) {
    return (
      <div className="flex min-h-screen bg-[#0A0A0B]">
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
