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
        <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1b3e" />
          <stop offset="50%" stopColor="#0a0e27" />
          <stop offset="100%" stopColor="#050714" />
        </linearGradient>
      </defs>

      {/* sphere outline */}
      <circle cx="18" cy="18" r="16" fill="none" stroke="var(--border-strong)" strokeWidth="1" />

      {/* ── bottom half drawn FIRST so top hemisphere covers any overflow ── */}
      <path d="M 2 18 A 16 16 0 0 0 34 18 Z" fill="url(#nightSky)" />

      {/* building silhouettes — shifted up 2 units, heights extended to keep base at y=28 */}
      <g fill="#080c1f" stroke="none">
        <rect x="3"    y="20" width="3"   height="8"  />
        <rect x="7"    y="16" width="2.5" height="12" />
        <rect x="10.5" y="18" width="2"   height="10" />
        <rect x="13.5" y="15" width="3"   height="13" />
        <rect x="17.5" y="17" width="2.5" height="11" />
        <rect x="20.5" y="19" width="2"   height="9"  />
        <rect x="23"   y="16" width="2.5" height="12" />
        <rect x="26"   y="20" width="3"   height="8"  />
        <rect x="29.5" y="18" width="2.5" height="10" />
      </g>

      {/* window lights — shifted up 2 units */}
      <g fill="#FFB020" opacity="0.7">
        <circle cx="8"    cy="18" r="0.5" />
        <circle cx="8.5"  cy="21" r="0.4" />
        <circle cx="11.5" cy="20" r="0.5" />
        <circle cx="14.5" cy="17" r="0.5" />
        <circle cx="15"   cy="19" r="0.4" />
        <circle cx="15.5" cy="22" r="0.5" />
        <circle cx="18.5" cy="20" r="0.5" />
        <circle cx="19"   cy="23" r="0.4" />
        <circle cx="21.5" cy="21" r="0.5" />
        <circle cx="24"   cy="19" r="0.5" />
        <circle cx="24.5" cy="22" r="0.4" />
        <circle cx="30"   cy="20" r="0.5" />
      </g>

      {/* ── top hemisphere drawn AFTER — naturally covers building overflow ── */}
      <path d="M 2 18 A 16 16 0 0 1 34 18 Z" fill="url(#hemiFill)" />
      <path d="M 2 18 A 16 16 0 0 1 34 18 Z" fill="url(#hemiHi)" />

      {/* longitude arcs */}
      <path d="M 2 18 A 16 8 0 0 1 34 18" fill="none" stroke="#0A0A0B" strokeWidth="0.9" opacity="0.55" />
      <path d="M 18 2 A 8 16 0 0 1 18 34" fill="none" stroke="var(--bg)" strokeWidth="0.9" opacity="0.4" />
      <path d="M 18 2 A 8 16 0 0 0 18 34" fill="none" stroke="var(--bg)" strokeWidth="0.9" opacity="0.4" />

      {/* equator line */}
      <line x1="2" y1="18" x2="34" y2="18" stroke="var(--bg)" strokeWidth="1" />

      {/* cardinal ticks */}
      <line x1="2"  y1="18" x2="5"  y2="18" stroke="var(--amber)" strokeWidth="1.4" />
      <line x1="31" y1="18" x2="34" y2="18" stroke="var(--amber)" strokeWidth="1.4" />

      {/* center bullseye */}
      <circle cx="18" cy="18" r="2.2" fill="var(--bg)" />
      <circle cx="18" cy="18" r="0.9" fill="var(--amber)" />
    </svg>
  );
}
