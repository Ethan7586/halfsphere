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
        <clipPath id="circleClip">
          <circle cx="18" cy="18" r="15.5" />
        </clipPath>
        <linearGradient id="hemiFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB020" />
          <stop offset="55%" stopColor="#E8900A" />
          <stop offset="100%" stopColor="#A05C00" />
        </linearGradient>
        <radialGradient id="hemiHi" cx="42%" cy="35%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      <g clipPath="url(#circleClip)">
        <circle cx="18" cy="18" r="16" fill="url(#hemiFill)" />
        <circle cx="18" cy="18" r="16" fill="url(#hemiHi)" />
        <ellipse cx="18" cy="18" rx="16" ry="5" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />
        <path d="M 18 2 A 8 16 0 0 1 18 34" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
        <path d="M 18 2 A 8 16 0 0 0 18 34" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
        {/* 背景密集矮房 20栋 */}
        <g fill="#0d1124" opacity="0.8">
          <rect x="2"  y="22" width="1.2" height="12" />
          <rect x="3.5" y="21" width="1.2" height="12" />
          <rect x="5"  y="22" width="1.2" height="12" />
          <rect x="6.5" y="21" width="1.2" height="12" />
          <rect x="8"  y="22" width="1.2" height="12" />
          <rect x="9.5" y="21" width="1.2" height="12" />
          <rect x="11" y="22" width="1.2" height="12" />
          <rect x="12.5" y="21" width="1.2" height="12" />
          <rect x="14" y="22" width="1.2" height="12" />
          <rect x="15.5" y="21" width="1.2" height="12" />
          <rect x="19" y="21" width="1.2" height="12" />
          <rect x="20.5" y="22" width="1.2" height="12" />
          <rect x="22" y="21" width="1.2" height="12" />
          <rect x="23.5" y="22" width="1.2" height="12" />
          <rect x="25" y="21" width="1.2" height="12" />
          <rect x="26.5" y="22" width="1.2" height="12" />
          <rect x="28" y="21" width="1.2" height="12" />
          <rect x="29.5" y="22" width="1.2" height="12" />
          <rect x="31" y="21" width="1.2" height="12" />
          <rect x="32.5" y="22" width="1.2" height="12" />
        </g>

        <g fill="#0d1124">
          {/* 左侧3栋 */}
          <rect x="3"  y="20" width="3" height="14" />
          <rect x="7"  y="19" width="3" height="14" />
          <rect x="11" y="21" width="3" height="14" />
          {/* 东方明珠 — 偏右 */}
          <rect x="20.5" y="11" width="1" height="6" />
          <circle cx="21" cy="17" r="2.2" />
          <circle cx="21" cy="22" r="1.4" />
          <polygon points="21,23 17,34 25,34" />
          {/* 右侧3栋 */}
          <rect x="15" y="21" width="3" height="14" />
          <rect x="26" y="19" width="3" height="14" />
          <rect x="30" y="20" width="3" height="14" />
        </g>
      </g>

      <circle cx="18" cy="18" r="16" fill="none" stroke="#555" strokeWidth="2" />
    </svg>
  );
}
