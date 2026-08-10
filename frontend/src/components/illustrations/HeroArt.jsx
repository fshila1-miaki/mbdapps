import React from "react";

// Rich SVG hero illustrations — characters, layered scenes (no AI-slop emoji)

const Shadow = ({ cx, cy, rx, ry, op = 0.18 }) => <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#000" opacity={op} />;

export const HeroDeveloperScene = () => (
  <svg viewBox="0 0 600 380" preserveAspectRatio="xMidYMid meet" className="w-full h-full block">
    {/* developer person at desk */}
    <defs>
      <linearGradient id="screen" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#09090B" />
      </linearGradient>
      <linearGradient id="dev-skin" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#fde68a" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
    </defs>
    {/* floor shadow */}
    <Shadow cx={300} cy={350} rx={220} ry={14} />
    {/* desk */}
    <rect x="80" y="270" width="440" height="14" fill="#7c2d12" />
    <rect x="100" y="284" width="6" height="60" fill="#7c2d12" />
    <rect x="494" y="284" width="6" height="60" fill="#7c2d12" />

    {/* laptop */}
    <g transform="translate(190 165)">
      <rect x="0" y="0" width="220" height="125" rx="6" fill="#1e293b" stroke="#09090B" strokeWidth="2" />
      <rect x="6" y="6" width="208" height="105" rx="3" fill="url(#screen)" />
      {/* code lines */}
      <rect x="14" y="14" width="6" height="6" rx="1" fill="#ef4444" />
      <rect x="24" y="14" width="6" height="6" rx="1" fill="#f59e0b" />
      <rect x="34" y="14" width="6" height="6" rx="1" fill="#10b981" />
      <rect x="14" y="30" width="60" height="3" rx="1" fill="#a78bfa" />
      <rect x="78" y="30" width="40" height="3" rx="1" fill="#f59e0b" />
      <rect x="22" y="38" width="80" height="3" rx="1" fill="#34d399" />
      <rect x="22" y="46" width="46" height="3" rx="1" fill="#60a5fa" />
      <rect x="72" y="46" width="28" height="3" rx="1" fill="#fbbf24" />
      <rect x="22" y="54" width="100" height="3" rx="1" fill="#94a3b8" />
      <rect x="14" y="62" width="50" height="3" rx="1" fill="#a78bfa" />
      <rect x="68" y="62" width="80" height="3" rx="1" fill="#f472b6" />
      <rect x="22" y="70" width="60" height="3" rx="1" fill="#34d399" />
      <rect x="14" y="78" width="40" height="3" rx="1" fill="#fbbf24" />
      <rect x="60" y="78" width="100" height="3" rx="1" fill="#94a3b8" />
      <rect x="14" y="86" width="30" height="3" rx="1" fill="#a78bfa" />
      {/* keyboard hint */}
      <rect x="-6" y="125" width="232" height="6" rx="2" fill="#475569" />
    </g>

    {/* person seated behind */}
    <g transform="translate(255 90)">
      {/* hair */}
      <path d="M0 28 Q45 -10, 90 28 L90 50 Q45 35, 0 50 Z" fill="#1e1b4b" />
      {/* head */}
      <ellipse cx="45" cy="45" rx="32" ry="36" fill="url(#dev-skin)" />
      {/* glasses */}
      <circle cx="32" cy="46" r="7" fill="none" stroke="#09090B" strokeWidth="2" />
      <circle cx="58" cy="46" r="7" fill="none" stroke="#09090B" strokeWidth="2" />
      <line x1="39" y1="46" x2="51" y2="46" stroke="#09090B" strokeWidth="2" />
      {/* eyes */}
      <circle cx="32" cy="46" r="2" fill="#09090B" />
      <circle cx="58" cy="46" r="2" fill="#09090B" />
      {/* smile */}
      <path d="M36 62 Q45 68, 54 62" stroke="#09090B" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* shirt */}
      <path d="M-15 85 L0 78 L20 75 L45 90 L70 75 L90 78 L105 85 L105 130 L-15 130 Z" fill="#2563EB" />
      <path d="M37 78 L45 95 L53 78 Z" fill="#fff" />
    </g>

    {/* phone leaning against laptop */}
    <g transform="translate(420 195)">
      <rect x="0" y="0" width="50" height="95" rx="8" fill="#09090B" />
      <rect x="3" y="8" width="44" height="80" rx="3" fill="#fb923c" />
      <rect x="22" y="2" width="6" height="2" rx="1" fill="#475569" />
      {/* app screen content */}
      <rect x="8" y="12" width="34" height="6" rx="1" fill="#fff" opacity="0.4" />
      <rect x="8" y="22" width="14" height="14" rx="2" fill="#fff" />
      <rect x="26" y="22" width="14" height="14" rx="2" fill="#fff" opacity="0.7" />
      <rect x="8" y="40" width="14" height="14" rx="2" fill="#fff" opacity="0.7" />
      <rect x="26" y="40" width="14" height="14" rx="2" fill="#fff" />
      <rect x="8" y="58" width="34" height="14" rx="2" fill="#fff" />
      <rect x="22" y="80" width="6" height="2" rx="1" fill="#475569" />
    </g>

    {/* mug */}
    <g transform="translate(120 245)">
      <rect x="0" y="0" width="32" height="30" rx="3" fill="#fff" stroke="#09090B" strokeWidth="2" />
      <path d="M32 8 Q42 8, 42 18 Q42 28, 32 28" fill="none" stroke="#09090B" strokeWidth="2" />
      <rect x="6" y="6" width="20" height="20" rx="2" fill="#2563EB" />
      <text x="16" y="20" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff">B</text>
      {/* steam */}
      <path d="M10 -4 Q6 -10, 12 -16" stroke="#fff" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M20 -4 Q24 -10, 18 -16" stroke="#fff" strokeWidth="2" fill="none" opacity="0.7" />
    </g>

    {/* floating UI badges */}
    <g transform="translate(40 90)">
      <rect x="0" y="0" width="68" height="22" rx="11" fill="#fff" />
      <circle cx="11" cy="11" r="4" fill="#10b981" />
      <text x="20" y="15" fontSize="9" fontWeight="700" fill="#09090B">+248 sales</text>
    </g>
    <g transform="translate(490 70)">
      <rect x="0" y="0" width="80" height="22" rx="11" fill="#fff" />
      <text x="40" y="15" fontSize="9" fontWeight="700" fill="#2563EB" textAnchor="middle">★ 4.9 rating</text>
    </g>
    <g transform="translate(30 200)">
      <rect x="0" y="0" width="58" height="22" rx="11" fill="#fff" />
      <text x="29" y="15" fontSize="9" fontWeight="700" fill="#1e293b" textAnchor="middle">৳1.2M</text>
    </g>
  </svg>
);

export const HeroSubscribersScene = () => (
  <svg viewBox="0 0 600 380" preserveAspectRatio="xMidYMid meet" className="w-full h-full block">
    {/* abstract globe */}
    <defs>
      <radialGradient id="globeGrad" cx="40%" cy="35%">
        <stop offset="0%" stopColor="#fda4af" />
        <stop offset="100%" stopColor="#9f1239" />
      </radialGradient>
    </defs>
    <circle cx="300" cy="200" r="120" fill="url(#globeGrad)" />
    {/* longitudes */}
    {[60, 90, 120, 150].map((rx, i) => (
      <ellipse key={i} cx="300" cy="200" rx={rx} ry="120" fill="none" stroke="#fff" strokeWidth="1" opacity="0.3" />
    ))}
    {/* equator */}
    {[40, 80, 120].map((ry, i) => (
      <ellipse key={i} cx="300" cy="200" rx="120" ry={ry} fill="none" stroke="#fff" strokeWidth="1" opacity="0.3" />
    ))}
    {/* BD outline simplified */}
    <path d="M280 165 L295 158 L308 162 L320 175 L322 190 L315 205 L300 215 L285 210 L275 195 L278 178 Z" fill="#fbbf24" stroke="#fff" strokeWidth="1.5" />
    {/* user pins */}
    {[[200, 130], [410, 140], [180, 250], [430, 240], [300, 80], [300, 320], [120, 200], [480, 200]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <circle r="12" fill="#fff" />
        <circle r="6" fill="#09090B" />
        <path d="M-4 -2 Q0 -8, 4 -2 Q3 2, 0 4 Q-3 2, -4 -2 Z" fill="#fff" />
      </g>
    ))}
    {/* signal arcs */}
    <circle cx="300" cy="200" r="160" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="6 6" />
    <circle cx="300" cy="200" r="180" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="3 6" />
    {/* counter */}
    <g transform="translate(40 50)">
      <rect x="0" y="0" width="200" height="56" rx="14" fill="#fff" />
      <text x="14" y="22" fontSize="10" fontWeight="700" fill="#94a3b8">ACTIVE SUBSCRIBERS</text>
      <text x="14" y="46" fontSize="22" fontWeight="900" fill="#09090B" fontFamily="system-ui">10,482,914</text>
    </g>
  </svg>
);

export const HeroBuilderScene = () => (
  <svg viewBox="0 0 600 380" preserveAspectRatio="xMidYMid meet" className="w-full h-full block">
    <defs>
      <linearGradient id="rocket" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#fff" />
        <stop offset="100%" stopColor="#fed7aa" />
      </linearGradient>
    </defs>
    {/* stars */}
    {Array.from({ length: 35 }).map((_, i) => {
      const x = (i * 73) % 600;
      const y = (i * 41) % 380;
      const r = (i % 3 === 0 ? 2.2 : 1.4);
      return <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={i % 2 ? 0.7 : 0.4} />;
    })}
    {/* planet */}
    <circle cx="120" cy="280" r="56" fill="#312e81" />
    <ellipse cx="120" cy="280" rx="80" ry="14" fill="none" stroke="#fbbf24" strokeWidth="3" transform="rotate(-18 120 280)" />
    {/* rocket */}
    <g transform="translate(290 70) rotate(15)">
      <path d="M40 0 C70 30, 70 100, 40 130 C10 100, 10 30, 40 0 Z" fill="url(#rocket)" stroke="#7c2d12" strokeWidth="2" />
      <circle cx="40" cy="60" r="12" fill="#1e293b" stroke="#7c2d12" strokeWidth="2" />
      <circle cx="40" cy="60" r="6" fill="#60a5fa" />
      <path d="M10 95 L0 130 L20 115 Z" fill="#dc2626" />
      <path d="M70 95 L80 130 L60 115 Z" fill="#dc2626" />
      {/* flame */}
      <path d="M28 130 L40 175 L52 130 Q40 142, 28 130 Z" fill="#fbbf24" />
      <path d="M32 130 L40 160 L48 130 Q40 138, 32 130 Z" fill="#fff" />
    </g>
    {/* code blocks floating */}
    <g transform="translate(420 80)">
      <rect x="0" y="0" width="100" height="60" rx="6" fill="#fff" opacity="0.95" />
      <rect x="8" y="10" width="46" height="4" rx="1" fill="#dc2626" />
      <rect x="8" y="20" width="64" height="4" rx="1" fill="#1e293b" />
      <rect x="8" y="30" width="36" height="4" rx="1" fill="#3b82f6" />
      <rect x="8" y="40" width="52" height="4" rx="1" fill="#10b981" />
      <rect x="8" y="50" width="28" height="4" rx="1" fill="#f59e0b" />
    </g>
    <g transform="translate(440 240)">
      <rect x="0" y="0" width="80" height="50" rx="6" fill="#fff" opacity="0.9" />
      <rect x="6" y="8" width="40" height="3" rx="1" fill="#dc2626" />
      <rect x="6" y="16" width="60" height="3" rx="1" fill="#1e293b" />
      <rect x="6" y="24" width="32" height="3" rx="1" fill="#3b82f6" />
      <rect x="6" y="32" width="48" height="3" rx="1" fill="#10b981" />
    </g>
    {/* clouds */}
    <g fill="#fff" opacity="0.85">
      <ellipse cx="40" cy="120" rx="40" ry="14" />
      <ellipse cx="60" cy="115" rx="26" ry="11" />
    </g>
  </svg>
);
