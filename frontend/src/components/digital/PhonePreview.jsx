import React from "react";

// Reusable CSS-only phone mockup showing a static preview based on design style.
// Props: design ("modern-card" | "minimal-list" | "fullscreen"), color, appName, icon, size ("sm" | "md" | "lg")
const sizeMap = {
  sm: { w: "w-44", h: "h-[340px]", pad: "p-2", inner: "rounded-[1.5rem]" },
  md: { w: "w-56", h: "h-[420px]", pad: "p-2.5", inner: "rounded-[1.75rem]" },
  lg: { w: "w-72", h: "h-[560px]", pad: "p-3", inner: "rounded-[2rem]" },
};

const StatusBar = () => (
  <div className="flex justify-between items-center px-4 py-1.5 text-[10px] text-white/90 bg-black/20">
    <span className="font-semibold">9:41</span>
    <div className="flex items-center gap-1">
      <div className="w-3 h-1.5 bg-white/80 rounded-sm"></div>
      <div className="w-3 h-1.5 bg-white/80 rounded-sm"></div>
      <div className="w-4 h-1.5 bg-white/80 rounded-sm border border-white/40"></div>
    </div>
  </div>
);

const ModernCardScreen = ({ color, appName, icon }) => (
  <div className="flex flex-col h-full bg-slate-50">
    <div style={{ background: color }} className="text-white">
      <StatusBar />
      <div className="px-4 py-3 flex items-center gap-2">
        <div className="text-xl">{icon}</div>
        <div className="font-bold text-sm truncate">{appName}</div>
      </div>
      <div className="px-4 pb-3">
        <div className="bg-white/20 rounded-lg px-2 py-1.5 text-[10px] text-white/90">🔍 Search...</div>
      </div>
    </div>
    <div className="flex-1 p-3 space-y-2 overflow-hidden">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
          <div style={{ background: color }} className="h-1.5 opacity-90"></div>
          <div className="p-2.5 space-y-1">
            <div className="h-2 bg-slate-200 rounded w-3/4"></div>
            <div className="h-1.5 bg-slate-100 rounded w-full"></div>
            <div className="h-1.5 bg-slate-100 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
    <div className="bg-white border-t border-slate-200 flex justify-around py-2">
      {["⌂", "♡", "+", "⊙"].map((g, i) => (
        <div key={i} className={`text-xs ${i === 0 ? "" : "text-slate-400"}`} style={i === 0 ? { color } : {}}>
          {g}
        </div>
      ))}
    </div>
  </div>
);

const MinimalListScreen = ({ color, appName, icon }) => (
  <div className="flex flex-col h-full bg-white">
    <div className="bg-slate-900 text-white">
      <StatusBar />
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{icon}</span>
          <div className="font-bold text-xs truncate">{appName}</div>
        </div>
        <div className="text-xs">⋯</div>
      </div>
    </div>
    <div className="flex-1 overflow-hidden">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 border-b border-slate-100">
          <div style={{ background: color }} className="w-7 h-7 rounded-full flex-shrink-0 opacity-90"></div>
          <div className="flex-1 space-y-1">
            <div className="h-1.5 bg-slate-200 rounded w-2/3"></div>
            <div className="h-1.5 bg-slate-100 rounded w-1/2"></div>
          </div>
          <div className="text-[8px] text-slate-400">2h</div>
        </div>
      ))}
    </div>
  </div>
);

const FullScreenScreen = ({ color, appName, icon }) => (
  <div className="flex flex-col h-full relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${color} 0%, #1e293b 60%, #09090B 100%)` }}>
    <StatusBar />
    <div className="absolute top-12 -right-6 w-24 h-24 rounded-full bg-white/10 blur-2xl"></div>
    <div className="absolute bottom-20 -left-6 w-20 h-20 rounded-full bg-white/10 blur-2xl"></div>
    <div className="relative flex-1 p-3 flex flex-col">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-white font-bold text-sm leading-tight truncate">{appName}</div>
      <div className="text-white/60 text-[9px] mt-1">Welcome back</div>
      <div className="mt-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2.5">
        <div className="text-[9px] text-white/70 uppercase tracking-widest">Today</div>
        <div className="text-white text-lg font-bold">128</div>
        <div className="text-[9px] text-white/60">items today</div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/10">
          <div className="h-1.5 bg-white/40 rounded w-2/3 mb-1"></div>
          <div className="h-1 bg-white/20 rounded w-full"></div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/10">
          <div className="h-1.5 bg-white/40 rounded w-2/3 mb-1"></div>
          <div className="h-1 bg-white/20 rounded w-full"></div>
        </div>
      </div>
      <div className="mt-auto">
        <div style={{ background: color }} className="rounded-full text-white text-[10px] text-center font-semibold py-2 shadow-lg">
          Get Started →
        </div>
      </div>
    </div>
  </div>
);

const PhonePreview = ({ design = "modern-card", color = "#2563EB", appName = "My App", icon = "🚀", size = "md" }) => {
  const s = sizeMap[size] || sizeMap.md;
  const Screen = design === "minimal-list" ? MinimalListScreen : design === "fullscreen" ? FullScreenScreen : ModernCardScreen;
  return (
    <div className={`${s.w} ${s.h} bg-slate-900 rounded-[2.5rem] ${s.pad} shadow-2xl mx-auto relative`}>
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-900 rounded-b-xl z-10"></div>
      <div className={`bg-white h-full ${s.inner} overflow-hidden`}>
        <Screen color={color} appName={appName} icon={icon} />
      </div>
    </div>
  );
};

export default PhonePreview;
