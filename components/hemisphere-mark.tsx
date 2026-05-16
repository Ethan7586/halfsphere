"use client";

export function HemisphereMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="hemiFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFC758" />
          <stop offset="55%" stopColor="#FFB020" />
          <stop offset="100%" stopColor="#C97F0E" />
        </linearGradient>
        <radialGradient id="hemiHi" cx="42%" cy="35%" r="40%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* sphere outline */}
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth="1"
      />

      {/* top hemisphere */}
      <path d="M 2 18 A 16 16 0 0 1 34 18 Z" fill="url(#hemiFill)" />
      {/* highlight */}
      <path d="M 2 18 A 16 16 0 0 1 34 18 Z" fill="url(#hemiHi)" />

      {/* longitude arcs (give depth) */}
      <path
        d="M 2 18 A 16 8 0 0 1 34 18"
        fill="none"
        stroke="#0A0A0B"
        strokeWidth="0.9"
        opacity="0.55"
      />
      <path
        d="M 18 2 A 8 16 0 0 1 18 34"
        fill="none"
        stroke="var(--bg)"
        strokeWidth="0.9"
        opacity="0.4"
      />
      <path
        d="M 18 2 A 8 16 0 0 0 18 34"
        fill="none"
        stroke="var(--bg)"
        strokeWidth="0.9"
        opacity="0.4"
      />

      {/* equator line — bottom half */}
      <line x1="2" y1="18" x2="34" y2="18" stroke="var(--bg)" strokeWidth="1" />

      {/* bottom half hint */}
      <path
        d="M 2 18 A 16 16 0 0 0 34 18"
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth="1"
      />

      {/* cardinal ticks on equator */}
      <line x1="2" y1="18" x2="5" y2="18" stroke="var(--amber)" strokeWidth="1.4" />
      <line x1="31" y1="18" x2="34" y2="18" stroke="var(--amber)" strokeWidth="1.4" />

      {/* center bullseye */}
      <circle cx="18" cy="18" r="2.2" fill="var(--bg)" />
      <circle cx="18" cy="18" r="0.9" fill="var(--amber)" />
    </svg>
  );
}
