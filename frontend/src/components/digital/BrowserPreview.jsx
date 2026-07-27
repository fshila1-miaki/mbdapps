import React, { useEffect, useState } from "react";

// CSS browser frame + realistic web layouts based on the chosen design.
// Used in design chooser (small wireframe mode) AND builder (realistic mode).
// Props:
//   design: "modern-card" | "minimal-list" | "fullscreen" | "dashboard"
//   mode: "wireframe" | "realistic" (default realistic)
//   url, appName, tagline, primaryColor, secondaryColor

const Frame = ({ url, children, height = "h-[560px]" }) => (
  <div className="w-full max-w-3xl mx-auto bg-slate-100 rounded-xl border border-slate-200 shadow-md overflow-hidden">
    <div className="bg-slate-200 px-3 py-2 flex items-center gap-2 border-b border-slate-300">
      <div className="flex items-center gap-1">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
      </div>
      <div className="flex-1 bg-white rounded-full px-3 py-1 text-xs text-slate-500 font-mono">
        {url || "preview.orbit.app"}
      </div>
    </div>
    <div className={`bg-white ${height} overflow-y-auto`}>{children}</div>
  </div>
);

// ----------- WIREFRAME (used in design picker) -----------
const Wire = ({ children, label }) => (
  <div className="relative bg-slate-100 rounded">
    {children}
    {label && <div className="absolute top-0.5 left-1 text-[7px] uppercase tracking-widest text-slate-400 font-bold">{label}</div>}
  </div>
);

const WireModernCard = () => (
  <div className="p-2 space-y-1.5 h-full">
    <Wire label="NAV"><div className="h-3 bg-slate-200 rounded"></div></Wire>
    <Wire label="HERO"><div className="h-10 bg-sky-100 rounded"></div></Wire>
    <div className="grid grid-cols-3 gap-1">
      {[0, 1, 2].map((i) => <Wire key={i} label="CARD"><div className="h-10 bg-slate-200 rounded"></div></Wire>)}
    </div>
    <Wire label="FOOTER"><div className="h-3 bg-slate-200 rounded"></div></Wire>
  </div>
);
const WireMinimalList = () => (
  <div className="p-2 space-y-1 h-full flex flex-col">
    <Wire label="NAV"><div className="h-3 bg-slate-200 rounded"></div></Wire>
    <div className="flex gap-1 flex-1">
      <Wire label="SIDEBAR"><div className="w-8 h-full bg-slate-200 rounded"></div></Wire>
      <div className="flex-1 space-y-1">
        {[0, 1, 2, 3].map((i) => <Wire key={i} label="ROW"><div className="h-4 bg-slate-100 rounded"></div></Wire>)}
      </div>
    </div>
  </div>
);
const WireFullScreen = () => (
  <div className="p-1.5 space-y-1.5 h-full">
    <Wire label="HERO"><div className="h-12 bg-gradient-to-br from-indigo-300 to-purple-300 rounded"></div></Wire>
    <Wire label="SECTION"><div className="h-10 bg-gradient-to-br from-pink-200 to-orange-200 rounded"></div></Wire>
    <Wire label="CTA"><div className="h-8 bg-gradient-to-br from-cyan-200 to-emerald-200 rounded"></div></Wire>
  </div>
);
const WireDashboard = () => (
  <div className="p-2 flex gap-1 h-full">
    <Wire label="SIDEBAR"><div className="w-8 h-full bg-slate-200 rounded"></div></Wire>
    <div className="flex-1 space-y-1.5">
      <Wire label="HEADER"><div className="h-3 bg-slate-200 rounded"></div></Wire>
      <div className="grid grid-cols-2 gap-1">
        {[0, 1, 2, 3].map((i) => <Wire key={i} label="STAT"><div className="h-6 bg-sky-100 rounded"></div></Wire>)}
      </div>
      <Wire label="CHART"><div className="h-10 bg-emerald-100 rounded"></div></Wire>
    </div>
  </div>
);

const WIREFRAME = {
  "modern-card": WireModernCard,
  "minimal-list": WireMinimalList,
  "fullscreen": WireFullScreen,
  "dashboard": WireDashboard,
};

// ----------- REALISTIC layouts (used in builder preview) -----------
const RealisticModernCard = ({ appName, tagline, primaryColor, secondaryColor }) => (
  <div className="font-sans">
    {/* Nav */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
      <div className="font-bold text-lg" style={{ color: primaryColor }}>{appName}</div>
      <div className="hidden sm:flex items-center gap-5 text-sm text-slate-600">
        <span>Home</span><span>Features</span><span>Pricing</span><span>Contact</span>
      </div>
      <button className="text-xs font-semibold px-3 py-2 rounded-md text-white" style={{ background: primaryColor }}>Get Started</button>
    </div>
    {/* Hero */}
    <div className="px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight" style={{ color: secondaryColor || "#0f172a" }}>{tagline}</h1>
        <p className="text-sm text-slate-500 mt-2">Powered by Orbit Platform — built in minutes.</p>
        <div className="mt-4 flex gap-2">
          <button className="text-xs font-semibold px-4 py-2 rounded-md text-white" style={{ background: primaryColor }}>Start Now</button>
          <button className="text-xs font-semibold px-4 py-2 rounded-md border" style={{ borderColor: primaryColor, color: primaryColor }}>Learn More</button>
        </div>
      </div>
      <div className="h-32 rounded-xl relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor || "#1e293b"} 100%)` }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 left-2 w-10 h-10 rounded-full bg-white"></div>
          <div className="absolute bottom-2 right-2 w-16 h-16 rounded-full bg-white"></div>
        </div>
      </div>
    </div>
    {/* Features */}
    <div className="px-6 py-6 bg-slate-50">
      <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-3">Why Choose Us</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { i: "✓", t: "Fast & Reliable", d: "Built for speed with rock-solid uptime." },
          { i: "⚡", t: "Modern Stack", d: "React, Tailwind, and best practices baked in." },
          { i: "📱", t: "Mobile Ready", d: "Responsive across every device size." },
        ].map((f) => (
          <div key={f.t} className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="text-xl mb-2" style={{ color: primaryColor }}>{f.i}</div>
            <div className="font-semibold text-sm">{f.t}</div>
            <div className="text-xs text-slate-500 mt-1">{f.d}</div>
          </div>
        ))}
      </div>
    </div>
    {/* CTA */}
    <div className="text-white px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ background: primaryColor }}>
      <div>
        <div className="font-bold text-lg">Start Building Today</div>
        <div className="text-xs opacity-80">Generated by Orbit</div>
      </div>
      <button className="text-xs font-semibold px-4 py-2 rounded-md bg-white" style={{ color: primaryColor }}>Get Started</button>
    </div>
    {/* Footer */}
    <div className="px-6 py-6 bg-slate-900 text-slate-300 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
      <div>
        <div className="font-bold text-white text-sm">{appName}</div>
        <div className="text-slate-500 mt-1">{tagline}</div>
      </div>
      <div><div className="font-semibold text-white mb-1">Product</div><div>Features</div><div>Pricing</div><div>Docs</div></div>
      <div><div className="font-semibold text-white mb-1">Company</div><div>About</div><div>Blog</div><div>Contact</div></div>
      <div><div className="font-semibold text-white mb-1">Legal</div><div>Privacy</div><div>Terms</div></div>
    </div>
    <div className="px-6 py-3 bg-slate-950 text-slate-500 text-[10px]">© {new Date().getFullYear()} {appName}. All rights reserved.</div>
  </div>
);

const RealisticMinimalList = ({ appName, tagline, primaryColor }) => (
  <div className="font-sans">
    <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white">
      <div className="font-bold tracking-tight" style={{ color: primaryColor }}>{appName}</div>
      <div className="text-xs text-slate-500">{tagline}</div>
    </div>
    <div className="px-6 py-3 border-b border-slate-100 flex gap-2 text-xs">
      {["All", "Featured", "Recent", "Trending", "Categories"].map((c, i) => (
        <span key={c} className={`px-2.5 py-1 rounded-full ${i === 0 ? "text-white" : "bg-slate-100 text-slate-700"}`} style={i === 0 ? { background: primaryColor } : {}}>{c}</span>
      ))}
    </div>
    <div className="divide-y divide-slate-100">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="px-6 py-3 flex items-center gap-3 hover:bg-slate-50">
          <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ background: `${primaryColor}22` }}>
            <div className="w-full h-full rounded-full flex items-center justify-center text-xs font-bold" style={{ color: primaryColor }}>{String.fromCharCode(65 + i)}</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">Article #{i + 1} — Quick read</div>
            <div className="text-xs text-slate-500 truncate">A clean and minimal layout focusing on content first. Read more →</div>
          </div>
          <div className="text-xs text-slate-400">{i + 1}h ago</div>
        </div>
      ))}
    </div>
  </div>
);

const RealisticFullScreen = ({ appName, tagline, primaryColor, secondaryColor }) => (
  <div className="font-sans">
    <div className="text-white px-6 py-12 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor || "#0f172a"} 100%)` }}>
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl"></div>
      <div className="relative">
        <div className="text-xs uppercase tracking-[0.3em] opacity-70 mb-3">{appName}</div>
        <h1 className="text-3xl md:text-5xl font-bold leading-[0.95] tracking-tighter max-w-xl mx-auto">{tagline}</h1>
        <button className="mt-6 text-sm font-semibold px-6 py-3 rounded-full bg-white" style={{ color: primaryColor }}>Get Started →</button>
      </div>
    </div>
    <div className="px-6 py-12 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 30% 50%, ${primaryColor} 0%, transparent 50%)` }}></div>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Built for Bangladesh</h2>
          <p className="text-slate-300 text-sm">Reach 76 million subscribers with apps that ship today.</p>
        </div>
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <div className="text-3xl font-bold">76M+</div>
          <div className="text-xs text-slate-300 mt-1">Active subscribers</div>
        </div>
      </div>
    </div>
    <div className="px-6 py-12 text-white text-center" style={{ background: secondaryColor || "#0f172a" }}>
      <h2 className="text-2xl font-bold tracking-tight">Ready to start?</h2>
      <button className="mt-4 text-sm font-semibold px-6 py-3 rounded-md text-white" style={{ background: primaryColor }}>Begin Now</button>
    </div>
  </div>
);

const RealisticDashboard = ({ appName, primaryColor }) => {
  const stats = [
    { label: "Users", value: "12,438", delta: "+12%" },
    { label: "Revenue", value: "৳4.8L", delta: "+8%" },
    { label: "Active", value: "1,284", delta: "+3%" },
    { label: "Churn", value: "1.2%", delta: "-0.4%" },
  ];
  return (
    <div className="flex h-full">
      <div className="w-44 bg-slate-900 text-white p-3 flex-shrink-0 hidden sm:block">
        <div className="font-bold text-sm mb-4" style={{ color: primaryColor }}>{appName}</div>
        {["Dashboard", "Analytics", "Reports", "Users", "Settings"].map((l, i) => (
          <div key={l} className={`px-2 py-2 rounded text-xs mb-0.5 ${i === 0 ? "text-white" : "text-slate-400 hover:bg-white/5"}`} style={i === 0 ? { background: primaryColor } : {}}>{l}</div>
        ))}
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-bold text-lg">Dashboard</div>
            <div className="text-xs text-slate-500">Overview of your metrics today</div>
          </div>
          <button className="text-xs font-semibold px-3 py-1.5 rounded-md text-white" style={{ background: primaryColor }}>Export</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-lg p-3 border border-slate-200">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{s.label}</div>
              <div className="text-lg font-bold mt-1">{s.value}</div>
              <div className="text-[10px] font-semibold mt-0.5" style={{ color: s.delta.startsWith("-") ? "#dc2626" : primaryColor }}>{s.delta} vs last week</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Weekly Activity</div>
          <div className="flex items-end justify-between h-32 gap-2">
            {[40, 70, 55, 90, 65, 80, 50].map((h, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: primaryColor }}></div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-slate-400">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <span key={d}>{d}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
};

const REALISTIC = {
  "modern-card": RealisticModernCard,
  "minimal-list": RealisticMinimalList,
  "fullscreen": RealisticFullScreen,
  "dashboard": RealisticDashboard,
};

const BrowserPreview = ({
  design = "modern-card",
  mode = "realistic",
  url,
  appName = "Your App",
  tagline = "Your awesome tagline",
  primaryColor = "#e11d48",
  secondaryColor = "#0f172a",
  height = "h-[560px]",
}) => {
  if (mode === "wireframe") {
    const W = WIREFRAME[design] || WireModernCard;
    return (
      <Frame url={url} height="h-[200px]">
        <W />
      </Frame>
    );
  }
  const R = REALISTIC[design] || RealisticModernCard;
  return (
    <Frame url={url} height={height}>
      <R appName={appName} tagline={tagline} primaryColor={primaryColor} secondaryColor={secondaryColor} />
    </Frame>
  );
};

export default BrowserPreview;
