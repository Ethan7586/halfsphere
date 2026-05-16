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
        {/* top hemisphere gold */}
        <linearGradient id="hemiFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFC758" />
          <stop offset="55%" stopColor="#FFB020" />
          <stop offset="100%" stopColor="#C97F0E" />
        </linearGradient>
        <radialGradient id="hemiHi" cx="42%" cy="35%" r="40%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        {/* night sky gradient for bottom half */}
        <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1b3e" />
          <stop offset="50%" stopColor="#0a0e27" />
          <stop offset="100%" stopColor="#050714" />
        </linearGradient>
      </defs>

      {/* sphere outline */}
      <circle cx="18" cy="18" r="16" fill="none" stroke="var(--border-strong)" strokeWidth="1" />

      {/* ── top hemisphere (unchanged) ── */}
      <path d="M 2 18 A 16 16 0 0 1 34 18 Z" fill="url(#hemiFill)" />
      <path d="M 2 18 A 16 16 0 0 1 34 18 Z" fill="url(#hemiHi)" />

      {/* longitude arcs */}
      <path d="M 2 18 A 16 8 0 0 1 34 18" fill="none" stroke="#0A0A0B" strokeWidth="0.9" opacity="0.55" />
      <path d="M 18 2 A 8 16 0 0 1 18 34" fill="none" stroke="var(--bg)" strokeWidth="0.9" opacity="0.4" />
      <path d="M 18 2 A 8 16 0 0 0 18 34" fill="none" stroke="var(--bg)" strokeWidth="0.9" opacity="0.4" />

      {/* equator line */}
      <line x1="2" y1="18" x2="34" y2="18" stroke="var(--bg)" strokeWidth="1" />

      {/* ── bottom half: Hong Kong night skyline ── */}
      {/* night sky base */}
      <path d="M 2 18 A 16 16 0 0 0 34 18 Z" fill="url(#nightSky)" />

      {/* building silhouettes */}
      <g fill="#080c1f" stroke="none">
        {/* left low-rise */}
        <rect x="3" y="24" width="3" height="6" />
        {/* mid left tower */}
        <rect x="7" y="20" width="2.5" height="10" />
        <polygon points="7,20 8.25,17 9.5,20" />
        {/* bank of china style (triangular) */}
        <rect x="10.5" y="22" width="2" height="8" />
        <polygon points="10.5,22 11.5,18 12.5,22" />
        {/* central tower */}
        <rect x="13.5" y="19" width="3" height="11" />
        <rect x="14.25" y="16" width="1.5" height="3" />
        {/* right side cluster */}
        <rect x="17.5" y="21" width="2.5" height="9" />
        <polygon points="17.5,21 18.75,18 19,21" />
        <rect x="20.5" y="23" width="2" height="7" />
        <rect x="23" y="20" width="2.5" height="10" />
        <polygon points="23,20 24.25,17 25.5,20" />
        {/* far right */}
        <rect x="26" y="24" width="3" height="6" />
        <rect x="29.5" y="22" width="2.5" height="8" />
      </g>

      {/* window lights — warm amber dots */}
      <g fill="#FFB020" opacity="0.7">
        <circle cx="8" cy="22" r="0.5" />
        <circle cx="8.5" cy="25" r="0.4" />
        <circle cx="11.5" cy="24" r="0.5" />
        <circle cx="14.5" cy="21" r="0.5" />
        <circle cx="15" cy="23" r="0.4" />
        <circle cx="15.5" cy="26" r="0.5" />
        <circle cx="18.5" cy="24" r="0.5" />
        <circle cx="19" cy="27" r="0.4" />
        <circle cx="21.5" cy="25" r="0.5" />
        <circle cx="24" cy="23" r="0.5" />
        <circle cx="24.5" cy="26" r="0.4" />
        <circle cx="30" cy="24" r="0.5" />
      </g>

      {/* cardinal ticks */}
      <line x1="2" y1="18" x2="5" y2="18" stroke="var(--amber)" strokeWidth="1.4" />
      <line x1="31" y1="18" x2="34" y2="18" stroke="var(--amber)" strokeWidth="1.4" />

      {/* center bullseye */}
      <circle cx="18" cy="18" r="2.2" fill="var(--bg)" />
      <circle cx="18" cy="18" r="0.9" fill="var(--amber)" />
    </svg>
  );
}
