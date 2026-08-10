import React, { useState, useEffect, useRef, useCallback } from "react";

// Single Pixel 7 Pro-style emulator with screen navigation
// Props: screens = [{ id, label, render: (ctx) => JSX }], primary, accent
// ctx = { goto(id), next(), back(), set(state), state, cartCount, addToCart }
const AndroidEmulator = ({ screens, primary = "#2563EB", accent = "#fff", appName = "App", icon = "🚀", initialState = {} }) => {
  const [idx, setIdx] = useState(0);
  const [now, setNow] = useState(new Date());
  const [state, setStateRaw] = useState(initialState);
  const [ripples, setRipples] = useState([]);
  const screenRef = useRef();

  useEffect(() => { const id = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(id); }, []);

  const goto = useCallback((target) => {
    if (typeof target === "string") {
      const i = screens.findIndex((s) => s.id === target);
      if (i >= 0) setIdx(i);
    } else {
      setIdx(Math.max(0, Math.min(screens.length - 1, target)));
    }
  }, [screens]);
  const next = useCallback(() => setIdx((i) => Math.min(screens.length - 1, i + 1)), [screens]);
  const back = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);
  const set = useCallback((p) => setStateRaw((s) => ({ ...s, ...(typeof p === "function" ? p(s) : p) })), []);
  const restart = () => { setIdx(0); setStateRaw(initialState); };

  // Ripple effect on screen tap
  const onScreenClick = (e) => {
    if (!screenRef.current) return;
    const r = screenRef.current.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples((p) => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRipples((p) => p.filter((x) => x.id !== id)), 600);
  };

  const ctx = { goto, next, back, set, state, primary, accent, appName, icon };
  const current = screens[idx];
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Control bar */}
      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-sm text-xs">
        <button data-testid="emu-back" onClick={back} disabled={idx === 0} className="px-2 py-1 hover:bg-slate-100 rounded disabled:opacity-30">← Back</button>
        <span className="font-bold text-slate-700">Screen <span className="text-rose-600">{idx + 1}</span>/{screens.length}</span>
        <button data-testid="emu-next" onClick={next} disabled={idx === screens.length - 1} className="px-2 py-1 hover:bg-slate-100 rounded disabled:opacity-30">Next →</button>
        <span className="text-slate-300">|</span>
        <button data-testid="emu-restart" onClick={restart} className="px-2 py-1 hover:bg-slate-100 rounded">↺ Restart</button>
      </div>

      {/* Pixel 7 frame */}
      <div className="relative bg-gray-800 rounded-[2.5rem] border-4 border-gray-700 shadow-2xl p-3" style={{ width: 320, boxShadow: `0 30px 60px rgba(0,0,0,0.4), 0 0 50px ${primary}33` }}>
        {/* Power & volume */}
        <div className="absolute left-[-6px] top-24 w-1.5 h-8 bg-gray-600 rounded-l"></div>
        <div className="absolute left-[-6px] top-36 w-1.5 h-14 bg-gray-600 rounded-l"></div>
        <div className="absolute right-[-6px] top-28 w-1.5 h-12 bg-gray-600 rounded-r"></div>

        <div ref={screenRef} onClick={onScreenClick} className="relative bg-white rounded-[1.5rem] overflow-hidden" style={{ width: 296, height: 592 }}>
          {/* Punch-hole camera */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rounded-full z-30"></div>
          {/* Status bar */}
          <div className="h-7 flex items-center justify-between px-5 text-[10px] z-20 relative" style={{ background: primary, color: accent }}>
            <span className="font-bold">{time}</span>
            <div className="flex items-center gap-1">
              <span>📶</span><span>📡</span><span className="font-semibold">98%</span>
            </div>
          </div>
          {/* Screen content */}
          <div key={current.id} className="absolute inset-x-0 top-7 bottom-9 overflow-y-auto" style={{ animation: "slideInRight 250ms ease-out" }}>
            {current.render(ctx)}
          </div>
          {/* Ripples */}
          {ripples.map((r) => (
            <span key={r.id} className="absolute pointer-events-none rounded-full" style={{ left: r.x - 20, top: r.y - 20, width: 40, height: 40, background: `${primary}55`, animation: "rippleExpand 600ms ease-out forwards" }}></span>
          ))}
          {/* System nav */}
          <div className="absolute bottom-0 inset-x-0 h-9 bg-white border-t border-slate-100 flex items-center justify-around text-slate-500 text-base z-20">
            <button data-testid="emu-sysback" onClick={back} className="px-3">◁</button>
            <button data-testid="emu-home" onClick={() => setIdx(0)}>○</button>
            <button className="px-3">□</button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div data-testid="emu-breadcrumb" className="flex items-center gap-1 flex-wrap justify-center max-w-md">
        {screens.map((s, i) => (
          <React.Fragment key={s.id}>
            <button data-testid={`emu-step-${s.id}`} onClick={() => setIdx(i)} className={`text-[10px] font-semibold px-2 py-1 rounded-full ${i === idx ? "text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`} style={i === idx ? { background: primary } : {}}>
              <span className="opacity-70 mr-1">{i + 1}</span>{s.label}
            </button>
            {i < screens.length - 1 && <span className="text-slate-300 text-[10px]">→</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AndroidEmulator;
