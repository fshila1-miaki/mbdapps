import React from "react";

// Realistic Android phone preview that injects user inputs.
// Props: design, color (primary), appName, tagline, icon (emoji), categories[]

const PhoneFrame = ({ children }) => (
  <div className="w-72 h-[560px] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl mx-auto relative border-2 border-slate-800">
    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-slate-900 rounded-b-2xl z-10"></div>
    {/* Side buttons */}
    <div className="absolute -right-1 top-24 w-1 h-12 bg-slate-800 rounded-r"></div>
    <div className="absolute -left-1 top-20 w-1 h-8 bg-slate-800 rounded-l"></div>
    <div className="absolute -left-1 top-32 w-1 h-12 bg-slate-800 rounded-l"></div>
    <div className="bg-white h-full rounded-[2rem] overflow-hidden relative">
      {children}
      {/* Home indicator */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-900/30 rounded-full"></div>
    </div>
  </div>
);

const StatusBar = ({ dark = false }) => (
  <div className={`flex justify-between items-center px-4 py-1.5 text-[10px] ${dark ? "text-white/90" : "text-slate-700"}`}>
    <span className="font-semibold">9:41</span>
    <div className="flex items-center gap-1.5">
      <span>📶</span><span>📡</span><span className="font-semibold">98%</span>
    </div>
  </div>
);

const ModernCard = ({ color, appName, tagline, icon, categories }) => {
  const cats = (categories?.length ? categories : ["Hadith", "Prayer", "Quran", "Du'a"]).slice(0, 4);
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div style={{ background: color }} className="text-white">
        <StatusBar dark />
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">☰</span>
            <div>
              <div className="font-bold text-sm leading-none">{appName}</div>
              <div className="text-[9px] opacity-70 mt-0.5">{tagline}</div>
            </div>
          </div>
          <span className="text-lg">🔔</span>
        </div>
      </div>
      {/* Daily card */}
      <div className="p-3">
        <div className="rounded-2xl p-4 text-white relative overflow-hidden shadow-md" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}>
          <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-white/10"></div>
          <div className="text-[9px] uppercase tracking-widest opacity-80 mb-2">{cats[0] || "Daily Content"}</div>
          <div className="text-sm italic leading-snug">"The best of you are those who are best to their families."</div>
          <div className="text-[10px] opacity-70 mt-2">— {icon} {appName}</div>
          <button className="mt-3 text-[10px] font-semibold bg-white/20 backdrop-blur px-3 py-1.5 rounded-full">Share ↗</button>
        </div>
      </div>
      {/* Quick actions */}
      <div className="px-3 grid grid-cols-4 gap-2 mb-2">
        {cats.map((c, i) => (
          <div key={c} className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-1 shadow-sm" style={{ background: `${color}15`, color }}>
              <span className="text-base">{["📖", "🕌", "📿", "🤲", "📅", "❓"][i % 6]}</span>
            </div>
            <span className="text-[9px] font-medium text-slate-700 text-center leading-tight">{c}</span>
          </div>
        ))}
      </div>
      {/* List */}
      <div className="px-3 mt-1 flex-1 overflow-hidden">
        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">Recent</div>
        {[0, 1].map((i) => (
          <div key={i} className="bg-white rounded-lg p-2 mb-1.5 border border-slate-100 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full" style={{ background: `${color}22` }}></div>
            <div className="flex-1">
              <div className="text-[10px] font-semibold">Item {i + 1}</div>
              <div className="text-[9px] text-slate-500">Short description here</div>
            </div>
          </div>
        ))}
      </div>
      {/* Bottom nav */}
      <div className="bg-white border-t border-slate-100 flex justify-around py-2">
        {["⌂", "📋", "♡", "👤"].map((g, i) => (
          <div key={i} className="text-base" style={i === 0 ? { color } : { color: "#94a3b8" }}>{g}</div>
        ))}
      </div>
    </div>
  );
};

const MinimalList = ({ color, appName, tagline, categories }) => {
  const cats = (categories?.length ? categories : ["All", "Popular", "Recent"]).slice(0, 5);
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-white border-b border-slate-200">
        <StatusBar />
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <div className="font-bold text-sm" style={{ color }}>{appName}</div>
            <div className="text-[9px] text-slate-500">{tagline}</div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs">🔍</div>
        </div>
        <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto">
          {cats.map((c, i) => (
            <span key={c} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${i === 0 ? "text-white" : "bg-slate-100 text-slate-700"}`} style={i === 0 ? { background: color } : {}}>{c}</span>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-hidden divide-y divide-slate-100">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2.5 px-3 py-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0" style={{ background: `${color}20`, color }}>{String.fromCharCode(65 + i)}</div>
            <div className="flex-1">
              <div className="text-[11px] font-semibold">Article #{i + 1}</div>
              <div className="text-[9px] text-slate-500">Quick read · 2 min</div>
            </div>
            <span className="text-slate-300">›</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FullScreen = ({ color, appName, tagline, icon }) => (
  <div className="flex flex-col h-full relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${color} 0%, #09090B 60%, #000 100%)` }}>
    <StatusBar dark />
    <div className="absolute top-12 -right-6 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
    <div className="absolute bottom-16 -left-6 w-24 h-24 rounded-full bg-white/10 blur-2xl"></div>
    <div className="relative flex-1 p-4 flex flex-col">
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-white font-bold text-xl tracking-tight leading-tight">{appName}</div>
      <div className="text-white/60 text-xs mt-1">{tagline}</div>
      <div className="mt-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3">
        <div className="text-[10px] text-white/70 uppercase tracking-widest mb-1">Today</div>
        <div className="text-white text-2xl font-bold">1,284</div>
        <div className="text-[10px] text-white/60">items delivered</div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
          <div className="text-[10px] text-white/70">Subscribers</div>
          <div className="text-white text-base font-bold">9.2K</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
          <div className="text-[10px] text-white/70">Open Rate</div>
          <div className="text-white text-base font-bold">68%</div>
        </div>
      </div>
      <div className="mt-auto">
        <button className="w-full rounded-full text-white text-xs text-center font-semibold py-3 shadow-lg" style={{ background: color }}>Get Started →</button>
      </div>
    </div>
    <div className="relative bg-white/10 backdrop-blur-md border-t border-white/10 flex justify-around py-2">
      {["⌂", "♡", "+", "⊙"].map((g, i) => <div key={i} className={i === 0 ? "text-white" : "text-white/50"}>{g}</div>)}
    </div>
  </div>
);

const Dashboard = ({ color, appName }) => (
  <div className="flex flex-col h-full bg-slate-50">
    <div className="bg-slate-900 text-white">
      <StatusBar dark />
      <div className="px-3 py-2.5 flex items-center justify-between">
        <div className="font-bold text-sm">{appName}</div>
        <span className="text-base">⚙</span>
      </div>
    </div>
    <div className="p-3 grid grid-cols-3 gap-1.5">
      {[
        { l: "Subscribers", v: "1.2K", c: color },
        { l: "Sent", v: "847", c: "#16a34a" },
        { l: "Open", v: "68%", c: "#2563eb" },
      ].map((s) => (
        <div key={s.l} className="bg-white rounded-lg p-2 border border-slate-200">
          <div className="text-[8px] uppercase tracking-widest text-slate-500 font-bold">{s.l}</div>
          <div className="text-sm font-bold mt-0.5" style={{ color: s.c }}>{s.v}</div>
        </div>
      ))}
    </div>
    <div className="px-3 mb-2">
      <div className="bg-white rounded-lg p-2.5 border border-slate-200">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">7-Day Trend</div>
        <div className="flex items-end justify-between h-16 gap-1">
          {[40, 60, 45, 80, 65, 90, 55].map((h, i) => (
            <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: color }}></div>
          ))}
        </div>
      </div>
    </div>
    <div className="px-3 flex-1 overflow-hidden">
      <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">Recent Activity</div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-white rounded-lg p-2 mb-1.5 border border-slate-100 flex items-center gap-2 text-[10px]">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }}></div>
          <div className="flex-1">User #{1000 + i} subscribed</div>
          <div className="text-slate-400 text-[9px]">{i + 1}h</div>
        </div>
      ))}
    </div>
  </div>
);

const REALISTIC = { "modern-card": ModernCard, "minimal-list": MinimalList, "fullscreen": FullScreen, "dashboard": Dashboard };

const RealisticPhonePreview = ({ design = "modern-card", color = "#2563EB", appName = "My App", tagline = "Your tagline", icon = "🚀", categories = [] }) => {
  const Screen = REALISTIC[design] || ModernCard;
  return (
    <PhoneFrame>
      <Screen color={color} appName={appName} tagline={tagline} icon={icon} categories={categories} />
    </PhoneFrame>
  );
};

export default RealisticPhonePreview;
