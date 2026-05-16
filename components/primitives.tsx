"use client";

import { useState, useEffect, useRef } from "react";

// ── Card ──
export function Card({
  children,
  style,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className}
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        padding: "14px 18px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardLabel({
  children,
  badge,
}: {
  children: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 0,
      }}
    >
      <span
        className="mono"
        style={{
          color: "var(--fg-mute)",
          fontSize: 10.5,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        {children}
      </span>
      {badge}
    </div>
  );
}

// ── Badge ──
export function Badge({
  children,
  tone = "neutral",
  style,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "amber" | "green" | "red" | "ghost";
  style?: React.CSSProperties;
}) {
  const tones: Record<
    string,
    { fg: string; bg: string; bd: string }
  > = {
    neutral: {
      fg: "var(--fg-dim)",
      bg: "transparent",
      bd: "var(--border-strong)",
    },
    amber: {
      fg: "var(--amber)",
      bg: "var(--amber-dim)",
      bd: "var(--amber-line)",
    },
    green: {
      fg: "var(--green)",
      bg: "var(--green-dim)",
      bd: "rgba(16,185,129,0.3)",
    },
    red: {
      fg: "var(--red)",
      bg: "var(--red-dim)",
      bd: "rgba(239,68,68,0.3)",
    },
    ghost: {
      fg: "var(--fg-mute)",
      bg: "transparent",
      bd: "transparent",
    },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      className="mono"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 8px",
        fontSize: 10.5,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontWeight: 500,
        color: t.fg,
        background: t.bg,
        border: `1px solid ${t.bd}`,
        borderRadius: 4,
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ── Animated number ──
export function AnimatedNumber({
  value,
  format = (v: number) => v.toFixed(2),
  duration = 900,
}: {
  value: number;
  format?: (v: number) => string;
  duration?: number;
}) {
  const [shown, setShown] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);

  useEffect(() => {
    fromRef.current = shown;
    startRef.current = null;
    let raf: number;
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min(1, (ts - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const cur = fromRef.current + (value - fromRef.current) * eased;
      setShown(cur);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{format(shown)}</>;
}

// ── Sparkline (SVG) ──
export function Sparkline({
  data,
  width = 96,
  height = 28,
  color = "var(--fg-dim)",
  strokeWidth = 1.25,
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const dx = width / (data.length - 1);
  const norm = (v: number) =>
    height - 2 - ((v - min) / (max - min || 1)) * (height - 4);
  const pts = data.map((v, i) => `${i * dx},${norm(v)}`).join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Progress bar (segmented) ──
export function SegmentedProgress({
  value,
  max,
  warn = 0.8,
  danger = 0.95,
  segments = 60,
}: {
  value: number;
  max: number;
  warn?: number;
  danger?: number;
  segments?: number;
}) {
  const ratio = Math.min(1, value / max);
  const filled = Math.round(segments * ratio);
  const colorMap: Record<string, string> = {
    green: "var(--green)",
    amber: "var(--amber)",
    red: "var(--red)",
  };
  return (
    <div style={{ display: "flex", gap: 2, width: "100%" }}>
      {Array.from({ length: segments }).map((_, i) => {
        const isFilled = i < filled;
        const segPos = i / segments;
        const segTone =
          segPos >= danger ? "red" : segPos >= warn ? "amber" : "green";
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: 14,
              background: isFilled ? colorMap[segTone] : "var(--bg-elev-1)",
              opacity: isFilled ? (i === filled - 1 ? 1 : 0.85) : 1,
              border: isFilled ? "none" : "1px solid var(--border)",
              borderRadius: 1,
              transition: "background .4s ease",
            }}
          />
        );
      })}
    </div>
  );
}

// ── Corner marks (decorative) ──
export function CornerMarks() {
  const c: React.CSSProperties = {
    position: "absolute",
    width: 8,
    height: 8,
    borderColor: "var(--border-strong)",
    borderStyle: "solid",
  };
  return (
    <>
      <div style={{ ...c, top: 8, left: 8, borderWidth: "1px 0 0 1px" }} />
      <div style={{ ...c, top: 8, right: 8, borderWidth: "1px 1px 0 0" }} />
      <div style={{ ...c, bottom: 8, left: 8, borderWidth: "0 0 1px 1px" }} />
      <div style={{ ...c, bottom: 8, right: 8, borderWidth: "0 1px 1px 0" }} />
    </>
  );
}
