import React from "react";

// Rich SVG illustrations for App Store cards & details.
// Each art renders a full-bleed scene with characters, products and depth.
// Use as <AppArt id="ecom-shop" size="full" />

const wrap = (children, bg) => (
  <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
    <defs>
      <radialGradient id="glow" cx="50%" cy="0%" r="80%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="200" height="200" fill={bg} />
    <rect width="200" height="200" fill="url(#glow)" />
    {children}
  </svg>
);

// ─────────── E-COMMERCE / SHOPPING ───────────
export const EcomArt = () =>
  wrap(
    <>
      {/* shopping bag */}
      <g transform="translate(45 60)">
        <path d="M0 35 L8 110 L102 110 L110 35 Z" fill="#fff7ed" stroke="#7c2d12" strokeWidth="3" />
        <path d="M28 35 C28 12, 82 12, 82 35" fill="none" stroke="#7c2d12" strokeWidth="4" strokeLinecap="round" />
        <text x="55" y="78" fontSize="34" textAnchor="middle" fill="#ea580c" fontWeight="900" fontFamily="system-ui">৳</text>
      </g>
      {/* boxes scattered */}
      <rect x="20" y="150" width="34" height="28" fill="#fed7aa" stroke="#7c2d12" strokeWidth="2" />
      <line x1="20" y1="158" x2="54" y2="158" stroke="#7c2d12" strokeWidth="2" />
      <rect x="148" y="155" width="30" height="24" fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
      <line x1="148" y1="162" x2="178" y2="162" stroke="#92400e" strokeWidth="2" />
      {/* sale tag */}
      <g transform="translate(140 38) rotate(15)">
        <path d="M0 0 L26 0 L36 12 L26 24 L0 24 Z" fill="#dc2626" />
        <circle cx="6" cy="12" r="3" fill="#fff" />
        <text x="20" y="17" fontSize="10" fill="#fff" fontWeight="900" textAnchor="middle">SALE</text>
      </g>
      {/* coin */}
      <circle cx="38" cy="40" r="10" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
      <text x="38" y="45" textAnchor="middle" fontSize="11" fontWeight="900" fill="#7c2d12">৳</text>
    </>,
    "#fb923c"
  );

// ─────────── FOOD / RESTAURANT ───────────
export const FoodArt = () =>
  wrap(
    <>
      {/* plate */}
      <ellipse cx="100" cy="135" rx="78" ry="14" fill="#000" opacity="0.15" />
      <circle cx="100" cy="115" r="60" fill="#fff7ed" stroke="#7c2d12" strokeWidth="3" />
      <circle cx="100" cy="115" r="48" fill="#fde68a" />
      {/* biriyani rice mound */}
      <path d="M60 115 Q100 70, 140 115 Q140 130, 100 130 Q60 130, 60 115 Z" fill="#fef3c7" />
      {/* rice grains */}
      {[[80, 100], [100, 92], [120, 100], [90, 108], [110, 108]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="2.5" ry="1.2" fill="#fbbf24" />
      ))}
      {/* meat */}
      <ellipse cx="100" cy="118" rx="14" ry="7" fill="#9a3412" />
      <ellipse cx="100" cy="115" rx="11" ry="5" fill="#c2410c" />
      {/* steam */}
      <path d="M85 70 Q80 55, 88 45 Q92 35, 86 25" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <path d="M100 65 Q104 50, 98 38 Q96 28, 104 18" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <path d="M115 70 Q120 56, 114 44 Q110 32, 118 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      {/* chilli */}
      <path d="M150 130 Q160 125, 170 135" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M150 130 L148 125" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
    </>,
    "#dc2626"
  );

// ─────────── EDUCATION / LEARNING ───────────
export const EducationArt = () =>
  wrap(
    <>
      {/* graduation cap */}
      <g transform="translate(70 35)">
        <polygon points="30,0 75,18 30,36 -15,18" fill="#1e1b4b" stroke="#fff" strokeWidth="2" />
        <rect x="20" y="28" width="20" height="14" fill="#312e81" />
        <line x1="58" y1="22" x2="68" y2="55" stroke="#fbbf24" strokeWidth="2" />
        <circle cx="68" cy="58" r="5" fill="#fbbf24" />
        <path d="M68 60 Q66 65, 70 70 Q72 73, 68 76" stroke="#fbbf24" strokeWidth="2" fill="none" />
      </g>
      {/* student head */}
      <circle cx="100" cy="120" r="22" fill="#fde68a" />
      <path d="M82 112 Q100 95, 118 112" fill="#1e1b4b" />
      <circle cx="92" cy="120" r="2" fill="#1e1b4b" />
      <circle cx="108" cy="120" r="2" fill="#1e1b4b" />
      <path d="M94 130 Q100 135, 106 130" stroke="#1e1b4b" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* book stack */}
      <rect x="30" y="155" width="60" height="9" fill="#dc2626" />
      <rect x="34" y="146" width="54" height="9" fill="#2563eb" />
      <rect x="32" y="137" width="58" height="9" fill="#16a34a" />
      {/* notebook */}
      <rect x="120" y="140" width="50" height="36" rx="3" fill="#fff" stroke="#1e1b4b" strokeWidth="2" />
      <line x1="128" y1="150" x2="162" y2="150" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="128" y1="157" x2="162" y2="157" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="128" y1="164" x2="156" y2="164" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="128" y1="171" x2="160" y2="171" stroke="#94a3b8" strokeWidth="1.5" />
      <text x="170" y="148" fontSize="14" fontWeight="900" fill="#fbbf24">A+</text>
    </>,
    "#6366f1"
  );

// ─────────── HEALTH / MEDICAL ───────────
export const HealthArt = () =>
  wrap(
    <>
      {/* heart with pulse */}
      <path d="M100 165 C 60 130, 35 100, 50 70 C 60 55, 85 55, 100 78 C 115 55, 140 55, 150 70 C 165 100, 140 130, 100 165 Z" fill="#fff" />
      <path d="M40 105 L72 105 L82 88 L92 122 L108 80 L118 105 L160 105" stroke="#dc2626" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* doctor */}
      <circle cx="40" cy="40" r="14" fill="#fde68a" />
      <path d="M28 38 Q40 28, 52 38" fill="#1e293b" />
      <rect x="30" y="50" width="20" height="22" fill="#fff" stroke="#0d9488" strokeWidth="2" />
      <line x1="40" y1="50" x2="40" y2="60" stroke="#dc2626" strokeWidth="2" />
      <line x1="36" y1="56" x2="44" y2="56" stroke="#dc2626" strokeWidth="2" />
      {/* pill */}
      <g transform="translate(155 40) rotate(30)">
        <rect x="0" y="0" width="30" height="12" rx="6" fill="#3b82f6" />
        <rect x="0" y="0" width="15" height="12" rx="6" fill="#dc2626" />
      </g>
    </>,
    "#0d9488"
  );

// ─────────── FITNESS / SPORTS ───────────
export const FitnessArt = () =>
  wrap(
    <>
      {/* dumbbell */}
      <g transform="translate(40 90) rotate(-15)">
        <rect x="0" y="14" width="120" height="12" fill="#1e293b" />
        <rect x="-8" y="0" width="20" height="40" rx="3" fill="#09090B" />
        <rect x="108" y="0" width="20" height="40" rx="3" fill="#09090B" />
        <rect x="-12" y="5" width="6" height="30" rx="2" fill="#475569" />
        <rect x="126" y="5" width="6" height="30" rx="2" fill="#475569" />
      </g>
      {/* runner silhouette */}
      <g transform="translate(70 30)" fill="#fff">
        <circle cx="30" cy="15" r="9" />
        <path d="M30 25 L25 50 L18 70 L26 72 L32 55 L38 50 L42 65 L52 72 L48 50 L42 38 Z" />
      </g>
      {/* sparkle */}
      <g fill="#fde047">
        <path d="M160 50 L165 60 L175 65 L165 70 L160 80 L155 70 L145 65 L155 60 Z" />
      </g>
      <circle cx="35" cy="170" r="4" fill="#fff" />
      <circle cx="170" cy="155" r="3" fill="#fff" />
    </>,
    "#16a34a"
  );

// ─────────── WEATHER ───────────
export const WeatherArt = () =>
  wrap(
    <>
      {/* sun */}
      <circle cx="60" cy="60" r="24" fill="#fbbf24" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <line key={i} x1="60" y1="60" x2={60 + 36 * Math.cos((deg * Math.PI) / 180)} y2={60 + 36 * Math.sin((deg * Math.PI) / 180)} stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
      ))}
      {/* cloud */}
      <ellipse cx="120" cy="100" rx="38" ry="22" fill="#fff" />
      <ellipse cx="100" cy="105" rx="26" ry="18" fill="#fff" />
      <ellipse cx="142" cy="108" rx="22" ry="16" fill="#fff" />
      {/* rain drops */}
      {[100, 120, 140].map((x, i) => (
        <path key={i} d={`M${x} 130 Q${x - 2} 140, ${x} 150 Q${x + 2} 140, ${x} 130 Z`} fill="#60a5fa" />
      ))}
      {/* thermometer */}
      <g transform="translate(165 50)">
        <rect x="0" y="0" width="8" height="50" rx="4" fill="#fff" stroke="#1e293b" strokeWidth="1.5" />
        <circle cx="4" cy="55" r="8" fill="#dc2626" />
        <rect x="2" y="20" width="4" height="35" fill="#dc2626" />
      </g>
    </>,
    "#0284c7"
  );

// ─────────── ISLAMIC / PRAYER ───────────
export const IslamicArt = () =>
  wrap(
    <>
      {/* mosque silhouette */}
      <rect x="40" y="100" width="120" height="70" fill="#fff" />
      <path d="M40 100 L100 50 L160 100" fill="#fff" />
      {/* dome */}
      <ellipse cx="100" cy="80" rx="28" ry="32" fill="#fde68a" />
      <path d="M100 48 L100 38" stroke="#fde68a" strokeWidth="3" />
      <path d="M100 38 Q98 30, 104 28 L101 35 Q105 33, 100 28" fill="#fde68a" />
      {/* minarets */}
      <rect x="50" y="70" width="10" height="40" fill="#fff" />
      <circle cx="55" cy="65" r="7" fill="#fde68a" />
      <rect x="140" y="70" width="10" height="40" fill="#fff" />
      <circle cx="145" cy="65" r="7" fill="#fde68a" />
      {/* arch */}
      <path d="M85 170 L85 130 Q100 110, 115 130 L115 170 Z" fill="#09090B" />
      {/* moon */}
      <path d="M40 35 a16 16 0 1 0 8 28 a13 13 0 1 1 -8 -28 Z" fill="#fde047" />
      {/* stars */}
      <circle cx="160" cy="30" r="2" fill="#fde047" />
      <circle cx="175" cy="50" r="1.5" fill="#fde047" />
      <circle cx="150" cy="45" r="1.5" fill="#fde047" />
    </>,
    "#047857"
  );

// ─────────── CRICKET / SPORTS ───────────
export const CricketArt = () =>
  wrap(
    <>
      {/* field */}
      <ellipse cx="100" cy="160" rx="100" ry="22" fill="#16a34a" />
      <ellipse cx="100" cy="160" rx="80" ry="14" fill="#22c55e" />
      {/* stumps */}
      <rect x="92" y="100" width="3" height="50" fill="#fef3c7" />
      <rect x="98" y="100" width="3" height="50" fill="#fef3c7" />
      <rect x="104" y="100" width="3" height="50" fill="#fef3c7" />
      <rect x="91" y="98" width="16" height="3" fill="#fef3c7" />
      {/* batsman */}
      <circle cx="55" cy="80" r="11" fill="#fde68a" />
      <rect x="48" y="70" width="14" height="6" fill="#1e3a8a" />
      <rect x="46" y="91" width="18" height="36" fill="#fff" />
      {/* bat */}
      <rect x="32" y="78" width="18" height="6" fill="#a16207" transform="rotate(-30 41 81)" />
      <rect x="50" y="78" width="3" height="20" fill="#92400e" transform="rotate(-30 51 88)" />
      <rect x="46" y="125" width="22" height="22" fill="#1e3a8a" />
      {/* ball */}
      <circle cx="155" cy="110" r="8" fill="#dc2626" />
      <path d="M148 110 Q155 105, 162 110" stroke="#fff" strokeWidth="1" fill="none" />
      <path d="M148 110 Q155 115, 162 110" stroke="#fff" strokeWidth="1" fill="none" />
      {/* trajectory */}
      <path d="M165 105 Q120 85, 105 95" stroke="#fff" strokeWidth="2" strokeDasharray="3 3" fill="none" />
    </>,
    "#15803d"
  );

// ─────────── FINANCE / STOCK ───────────
export const FinanceArt = () =>
  wrap(
    <>
      {/* chart bg grid */}
      {[40, 80, 120, 160].map((y) => (
        <line key={y} x1="20" y1={y} x2="180" y2={y} stroke="#fff" strokeOpacity="0.15" strokeWidth="1" />
      ))}
      {/* chart line */}
      <polyline points="25,140 50,120 75,130 100,90 125,100 150,60 175,75" stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* fill area */}
      <polygon points="25,140 50,120 75,130 100,90 125,100 150,60 175,75 175,170 25,170" fill="#fbbf24" opacity="0.2" />
      {/* dots */}
      {[[50, 120], [75, 130], [100, 90], [125, 100], [150, 60]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke="#fbbf24" strokeWidth="2" />
      ))}
      {/* coin stack */}
      <ellipse cx="40" cy="50" rx="22" ry="6" fill="#fbbf24" />
      <ellipse cx="40" cy="45" rx="22" ry="6" fill="#facc15" />
      <ellipse cx="40" cy="40" rx="22" ry="6" fill="#fbbf24" />
      <ellipse cx="40" cy="35" rx="22" ry="6" fill="#facc15" />
      <text x="40" y="40" textAnchor="middle" fontSize="9" fontWeight="900" fill="#7c2d12">৳</text>
      {/* up arrow */}
      <g transform="translate(165 30)">
        <polygon points="0,15 10,0 20,15 14,15 14,28 6,28 6,15" fill="#22c55e" />
      </g>
    </>,
    "#09090B"
  );

// ─────────── TRAVEL ───────────
export const TravelArt = () =>
  wrap(
    <>
      {/* mountains */}
      <polygon points="0,170 50,90 90,170" fill="#475569" />
      <polygon points="60,170 110,70 160,170" fill="#334155" />
      <polygon points="130,170 175,110 200,170" fill="#475569" />
      {/* snow caps */}
      <polygon points="46,98 50,90 54,98 50,100" fill="#fff" />
      <polygon points="105,80 110,70 115,80 110,82" fill="#fff" />
      {/* sun */}
      <circle cx="155" cy="55" r="18" fill="#fbbf24" />
      {/* plane */}
      <g transform="translate(60 45) rotate(-15)">
        <path d="M0 12 L40 8 L48 14 L40 20 L0 16 Z" fill="#fff" />
        <path d="M14 0 L24 12 L20 14 L8 4 Z" fill="#fff" />
        <path d="M14 24 L24 14 L20 12 L8 22 Z" fill="#fff" />
        <circle cx="36" cy="14" r="3" fill="#dc2626" />
      </g>
      {/* trail */}
      <path d="M48 45 Q40 50, 28 50" stroke="#fff" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      {/* pin */}
      <g transform="translate(95 130)">
        <path d="M0 0 C0 -12, 18 -12, 18 0 C18 8, 9 22, 9 22 C9 22, 0 8, 0 0 Z" fill="#dc2626" />
        <circle cx="9" cy="2" r="4" fill="#fff" />
      </g>
    </>,
    "#0ea5e9"
  );

// ─────────── ENTERTAINMENT / MUSIC ───────────
export const MusicArt = () =>
  wrap(
    <>
      {/* vinyl */}
      <circle cx="100" cy="100" r="65" fill="#09090B" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="#334155" strokeWidth="1" />
      <circle cx="100" cy="100" r="50" fill="none" stroke="#334155" strokeWidth="1" />
      <circle cx="100" cy="100" r="40" fill="none" stroke="#334155" strokeWidth="1" />
      <circle cx="100" cy="100" r="20" fill="#dc2626" />
      <circle cx="100" cy="100" r="4" fill="#09090B" />
      {/* notes */}
      <g fill="#fff">
        <circle cx="40" cy="60" r="5" />
        <rect x="44" y="40" width="2" height="22" />
        <path d="M44 40 Q56 35, 52 50" fill="#fff" />
      </g>
      <g fill="#fff">
        <circle cx="165" cy="50" r="4" />
        <rect x="168" y="32" width="2" height="20" />
      </g>
      <g fill="#fff">
        <circle cx="170" cy="155" r="4" />
        <rect x="173" y="138" width="2" height="20" />
      </g>
    </>,
    "#7c3aed"
  );

// ─────────── NEWS ───────────
export const NewsArt = () =>
  wrap(
    <>
      {/* folded newspaper */}
      <g transform="translate(35 50)">
        <rect x="0" y="0" width="130" height="110" fill="#fafaf9" stroke="#1e293b" strokeWidth="2" />
        <rect x="6" y="8" width="118" height="14" fill="#1e293b" />
        <text x="65" y="19" fontSize="10" fontWeight="900" textAnchor="middle" fill="#fff" fontFamily="serif">BREAKING NEWS</text>
        {/* image block */}
        <rect x="8" y="28" width="50" height="38" fill="#94a3b8" />
        <circle cx="33" cy="42" r="5" fill="#cbd5e1" />
        <polygon points="14,66 24,52 36,60 50,46 58,66" fill="#cbd5e1" />
        {/* lines */}
        {[28, 36, 44, 52, 60].map((y, i) => (
          <rect key={i} x="64" y={y} width={i % 2 === 0 ? 56 : 48} height="3" fill="#475569" />
        ))}
        {[72, 80, 88, 96, 104].map((y, i) => (
          <rect key={i} x="8" y={y} width={[110, 102, 116, 96, 110][i]} height="3" fill="#475569" />
        ))}
      </g>
      {/* notification ping */}
      <circle cx="160" cy="35" r="12" fill="#dc2626" />
      <text x="160" y="40" fontSize="13" fontWeight="900" textAnchor="middle" fill="#fff">!</text>
    </>,
    "#1e293b"
  );

// ─────────── REAL ESTATE ───────────
export const RealEstateArt = () =>
  wrap(
    <>
      {/* house */}
      <polygon points="60,90 100,55 140,90" fill="#dc2626" />
      <rect x="65" y="90" width="70" height="60" fill="#fef3c7" stroke="#7c2d12" strokeWidth="2" />
      <rect x="92" y="115" width="18" height="35" fill="#92400e" />
      <circle cx="105" cy="135" r="1.5" fill="#fef3c7" />
      <rect x="72" y="100" width="14" height="14" fill="#60a5fa" stroke="#7c2d12" strokeWidth="1.5" />
      <rect x="114" y="100" width="14" height="14" fill="#60a5fa" stroke="#7c2d12" strokeWidth="1.5" />
      <rect x="79" y="100" width="0.5" height="14" fill="#7c2d12" />
      <rect x="72" y="107" width="14" height="0.5" fill="#7c2d12" />
      <rect x="121" y="100" width="0.5" height="14" fill="#7c2d12" />
      <rect x="114" y="107" width="14" height="0.5" fill="#7c2d12" />
      {/* chimney */}
      <rect x="120" y="65" width="10" height="20" fill="#7c2d12" />
      {/* for sale sign */}
      <g transform="translate(35 95)">
        <rect x="0" y="0" width="22" height="14" fill="#fff" stroke="#dc2626" strokeWidth="2" />
        <text x="11" y="10" fontSize="6" fontWeight="900" textAnchor="middle" fill="#dc2626">FOR SALE</text>
        <line x1="11" y1="14" x2="11" y2="35" stroke="#7c2d12" strokeWidth="2" />
      </g>
      {/* tree */}
      <rect x="165" y="115" width="6" height="20" fill="#7c2d12" />
      <circle cx="168" cy="108" r="14" fill="#16a34a" />
      <circle cx="174" cy="112" r="10" fill="#22c55e" />
      <circle cx="162" cy="112" r="10" fill="#22c55e" />
    </>,
    "#fcd34d"
  );

// ─────────── NGO / CHARITY ───────────
export const NgoArt = () =>
  wrap(
    <>
      {/* hands forming heart */}
      <path d="M100 165 C 60 130, 30 95, 55 75 C 70 65, 90 75, 100 90 C 110 75, 130 65, 145 75 C 170 95, 140 130, 100 165 Z" fill="#fff" stroke="#1D4ED8" strokeWidth="3" />
      <path d="M100 155 C 70 125, 45 95, 65 80 C 75 73, 88 80, 100 95 C 112 80, 125 73, 135 80 C 155 95, 130 125, 100 155 Z" fill="#fecaca" />
      {/* people circle */}
      <g fill="#fff">
        <circle cx="50" cy="40" r="6" /><rect x="44" y="46" width="12" height="14" rx="3" />
        <circle cx="100" cy="32" r="6" /><rect x="94" y="38" width="12" height="14" rx="3" />
        <circle cx="150" cy="40" r="6" /><rect x="144" y="46" width="12" height="14" rx="3" />
      </g>
      {/* lines connecting */}
      <path d="M50 50 Q100 60, 150 50" stroke="#fff" strokeWidth="2" strokeDasharray="3 3" fill="none" />
    </>,
    "#1D4ED8"
  );

// ─────────── PRODUCTIVITY / SAAS ───────────
export const SaasArt = () =>
  wrap(
    <>
      {/* dashboard frame */}
      <rect x="30" y="40" width="140" height="110" rx="6" fill="#fff" stroke="#1e293b" strokeWidth="2" />
      <rect x="30" y="40" width="140" height="14" rx="6" fill="#1e293b" />
      <circle cx="40" cy="47" r="2" fill="#ef4444" /><circle cx="48" cy="47" r="2" fill="#f59e0b" /><circle cx="56" cy="47" r="2" fill="#10b981" />
      {/* sidebar */}
      <rect x="32" y="56" width="32" height="93" fill="#f1f5f9" />
      <rect x="36" y="62" width="24" height="4" fill="#94a3b8" />
      <rect x="36" y="72" width="24" height="4" fill="#94a3b8" />
      <rect x="36" y="82" width="24" height="4" fill="#dc2626" />
      <rect x="36" y="92" width="24" height="4" fill="#94a3b8" />
      {/* bars */}
      <rect x="75" y="100" width="10" height="40" fill="#3b82f6" />
      <rect x="90" y="80" width="10" height="60" fill="#10b981" />
      <rect x="105" y="90" width="10" height="50" fill="#f59e0b" />
      <rect x="120" y="70" width="10" height="70" fill="#dc2626" />
      <rect x="135" y="105" width="10" height="35" fill="#8b5cf6" />
      {/* line on top */}
      <polyline points="75,90 85,75 100,82 115,60 130,68 145,55" stroke="#1e293b" strokeWidth="2" fill="none" />
    </>,
    "#3b82f6"
  );

// ─────────── ANALYTICS ───────────
export const AnalyticsArt = SaasArt;

// ─────────── DEFAULT / GENERIC APP ───────────
export const GenericArt = ({ initials = "A" }) =>
  wrap(
    <>
      <circle cx="100" cy="100" r="50" fill="#fff" />
      <text x="100" y="118" textAnchor="middle" fontSize="56" fontWeight="900" fill="#dc2626" fontFamily="system-ui">{initials}</text>
    </>,
    "#dc2626"
  );

const ART_MAP = {
  ecom: EcomArt,
  food: FoodArt,
  edu: EducationArt,
  health: HealthArt,
  fitness: FitnessArt,
  weather: WeatherArt,
  islamic: IslamicArt,
  cricket: CricketArt,
  finance: FinanceArt,
  travel: TravelArt,
  music: MusicArt,
  news: NewsArt,
  realestate: RealEstateArt,
  ngo: NgoArt,
  saas: SaasArt,
  analytics: AnalyticsArt,
};

const AppArt = ({ id, initials, className = "" }) => {
  const Comp = ART_MAP[id];
  return (
    <div className={`absolute inset-0 ${className}`} data-testid={`app-art-${id || "generic"}`}>
      {Comp ? <Comp /> : <GenericArt initials={initials} />}
    </div>
  );
};

export default AppArt;
