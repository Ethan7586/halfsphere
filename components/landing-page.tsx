"use client";

import { HemisphereMark } from "@/components/hemisphere-mark";

export function LandingPage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ background: "#0A0A0B" }}
    >
      {/* Logo */}
      <HemisphereMark size={80} />

      {/* Title */}
      <h1
        style={{
          marginTop: 32,
          fontSize: 42,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          color: "#E5E5E7",
          lineHeight: 1,
        }}
      >
        halfsphere
      </h1>

      {/* Slogan */}
      <p
        className="mono"
        style={{
          marginTop: 14,
          fontSize: 13,
          color: "#8E8E93",
          letterSpacing: "0.15em",
        }}
      >
        半球 · 个人 AI 与基础设施统一作战面板
      </p>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 14, marginTop: 40 }}>
        <a
          href="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 32px",
            background: "#FFB020",
            color: "#0A0A0B",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          登录 / Sign In
        </a>
        <a
          href="/apply"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 32px",
            background: "transparent",
            color: "#8E8E93",
            border: "1px solid #333",
            borderRadius: 6,
            fontSize: 13,
            letterSpacing: "0.08em",
            textDecoration: "none",
            transition: "all .15s ease",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.borderColor = "#FFB020";
            (e.target as HTMLElement).style.color = "#FFB020";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.borderColor = "#333";
            (e.target as HTMLElement).style.color = "#8E8E93";
          }}
        >
          申请访问 / Apply
        </a>
      </div>

      {/* Footer */}
      <div
        className="mono"
        style={{
          position: "absolute",
          bottom: 32,
          fontSize: 10,
          color: "#444",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        HALFSPHERE · BURN CTRL / 01 · v0.1.0-mvp
      </div>
    </div>
  );
}
