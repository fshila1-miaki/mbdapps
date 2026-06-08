import React from "react";
import { CATEGORY_GRADIENTS } from "../../mocks/builderTemplates";

// CSS mini-mockup illustrations for each template's preview area.
// Each is a tiny representation of the actual app UI inside a browser/phone chrome.

// ---- Web mini browser frame mockups ----
const Frame = ({ tpl, kids }) => (
  <div className="w-full h-full overflow-hidden relative">
    <div className="absolute inset-0 bg-gradient-to-br opacity-90 z-0" style={{ background: `linear-gradient(135deg, ${tpl.palette.primary} 0%, ${tpl.palette.accent} 100%)` }}></div>
    <div className="relative z-10 p-2 h-full flex items-center justify-center">
      <div className="bg-gray-100 rounded-lg border border-gray-300 shadow-lg overflow-hidden w-full max-w-xs">
        <div className="bg-gray-200 h-3 flex items-center px-1.5 gap-0.5">
          <span className="w-1 h-1 rounded-full bg-red-400"></span>
          <span className="w-1 h-1 rounded-full bg-yellow-400"></span>
          <span className="w-1 h-1 rounded-full bg-green-400"></span>
        </div>
        <div className="bg-white h-28 overflow-hidden">{kids}</div>
      </div>
    </div>
  </div>
);

// Render-specific mini layouts per template id
const WEB_MINI = {
  "web-ecom": (tpl) => (
    <div className="h-full flex flex-col">
      <div className="h-3 flex items-center justify-between px-1.5" style={{ background: "#0f172a" }}>
        <div className="text-[5px] text-white font-bold">🛍 SHOP</div>
        <div className="flex gap-0.5"><span className="text-[5px] text-white">🔍</span><span className="text-[5px] text-white relative">🛒<sup className="text-[3px] bg-rose-500 text-white rounded-full px-0.5">2</sup></span></div>
      </div>
      <div className="h-8 flex items-center px-2 text-white text-[6px] font-bold" style={{ background: `linear-gradient(135deg, ${tpl.palette.primary}, ${tpl.palette.accent})` }}>
        <div>SHOP DEALS<br/><span className="text-[4px] opacity-80">Free delivery 500+</span></div>
        <div className="ml-auto text-[4px] bg-amber-400 text-slate-900 rounded px-1 py-0.5">🔥 50% OFF</div>
      </div>
      <div className="flex gap-0.5 px-1 py-0.5 bg-white">{["All", "Tech", "Fashion", "Home"].map((c, i) => <div key={c} className="text-[4px] px-1 rounded-full" style={i === 0 ? { background: tpl.palette.primary, color: "white" } : { background: "#f1f5f9" }}>{c}</div>)}</div>
      <div className="grid grid-cols-3 gap-0.5 px-1 pb-1 flex-1">
        {[{ e: "🎧", n: "Headph" }, { e: "⌚", n: "Watch" }, { e: "🔊", n: "Speaker" }].map((p, i) => (
          <div key={i} className="rounded p-0.5 bg-white border border-slate-100">
            <div className="h-4 rounded flex items-center justify-center text-[8px]" style={{ background: `linear-gradient(135deg, ${tpl.palette.primary}55, ${tpl.palette.accent}55)` }}>{p.e}</div>
            <div className="text-[3px] font-bold mt-0.5">{p.n}</div>
            <div className="text-[3px] flex items-center"><span className="text-amber-400">★</span>4.7</div>
            <div className="text-[4px] font-bold" style={{ color: tpl.palette.primary }}>৳4500</div>
            <div className="h-1 rounded mt-0.5" style={{ background: tpl.palette.primary }}></div>
          </div>
        ))}
      </div>
    </div>
  ),
  "web-food": (tpl) => (
    <div className="h-full flex flex-col">
      <div className="h-9 flex items-center justify-center text-[8px] text-white relative" style={{ background: `linear-gradient(135deg, ${tpl.palette.primary}, ${tpl.palette.accent})` }}>🍔 MENU</div>
      <div className="flex gap-1 px-1 py-0.5 bg-slate-50">
        {["Pizza", "Burger", "Drinks"].map((c) => <div key={c} className="text-[5px] px-1 rounded-full" style={{ background: tpl.palette.primary, color: "white" }}>{c}</div>)}
      </div>
      <div className="flex-1 p-1 space-y-0.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-slate-100 rounded flex items-center gap-1 p-0.5">
            <div className="w-3 h-3 rounded" style={{ background: `linear-gradient(135deg, ${tpl.palette.accent}, ${tpl.palette.primary})` }}></div>
            <div className="flex-1"><div className="h-0.5 rounded bg-slate-400 w-1/2"></div><div className="h-0.5 mt-0.5 rounded" style={{ background: tpl.palette.primary, width: "30%" }}></div></div>
          </div>
        ))}
      </div>
    </div>
  ),
  "web-health": (tpl) => (
    <div className="h-full flex flex-col">
      <div className="h-3 flex items-center px-1.5 bg-white border-b border-slate-200"><div className="text-[5px] font-bold" style={{ color: tpl.palette.primary }}>HEALTHCARE</div></div>
      <div className="flex-1 p-1 space-y-0.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded flex items-center gap-1 p-0.5">
            <div className="w-3 h-3 rounded-full flex items-center justify-center text-[5px] text-white" style={{ background: tpl.palette.primary }}>Dr</div>
            <div className="flex-1"><div className="h-0.5 rounded bg-slate-400 w-1/2"></div><div className="h-0.5 mt-0.5 rounded bg-slate-300 w-1/3"></div></div>
            <div className="text-[5px] px-0.5 rounded" style={{ background: tpl.palette.accent, color: "white" }}>Book</div>
          </div>
        ))}
        <div className="flex gap-0.5 mt-0.5">{[0, 1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="flex-1 h-1.5 rounded text-center" style={{ background: i === 2 ? tpl.palette.primary : "#e2e8f0" }}></div>)}</div>
      </div>
    </div>
  ),
  "web-edu": (tpl) => (
    <div className="h-full flex flex-col">
      <div className="h-3 flex items-center px-1.5 text-white" style={{ background: tpl.palette.primary }}><div className="text-[5px] font-bold">eLEARNING</div></div>
      <div className="grid grid-cols-2 gap-0.5 p-1 flex-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded p-0.5 bg-white border border-slate-200">
            <div className="h-3 rounded" style={{ background: `linear-gradient(135deg, ${tpl.palette.primary}, ${tpl.palette.accent})` }}></div>
            <div className="h-0.5 mt-0.5 rounded bg-slate-300"></div>
            <div className="h-0.5 mt-0.5 rounded" style={{ background: tpl.palette.primary, width: `${30 + i * 20}%` }}></div>
          </div>
        ))}
      </div>
    </div>
  ),
  "web-realestate": (tpl) => (
    <div className="h-full flex flex-col">
      <div className="h-3 flex items-center px-1.5 text-white" style={{ background: tpl.palette.primary }}><div className="text-[5px] font-bold">REALESTATE</div></div>
      <div className="grid grid-cols-2 gap-0.5 p-1 flex-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded p-0.5 bg-white border border-slate-200 relative">
            <div className="h-3.5 rounded" style={{ background: `linear-gradient(135deg, ${tpl.palette.primary}, ${tpl.palette.accent})` }}></div>
            <div className="absolute top-0.5 right-0.5 text-[4px] px-0.5 rounded text-white" style={{ background: tpl.palette.accent }}>৳XL</div>
            <div className="h-0.5 mt-0.5 rounded bg-slate-300"></div>
          </div>
        ))}
      </div>
    </div>
  ),
  "web-travel": (tpl) => (
    <div className="h-full flex flex-col">
      <div className="h-7 flex items-center justify-center text-[7px] text-white" style={{ background: `linear-gradient(135deg, ${tpl.palette.primary}, ${tpl.palette.accent})` }}>✈ DESTINATIONS</div>
      <div className="grid grid-cols-3 gap-0.5 p-1 flex-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded p-0.5">
            <div className="h-4 rounded" style={{ background: `linear-gradient(135deg, ${tpl.palette.accent}, ${tpl.palette.primary})` }}></div>
            <div className="h-0.5 mt-0.5 rounded bg-slate-300"></div>
          </div>
        ))}
      </div>
      <div className="flex gap-0.5 px-1 pb-0.5">{[0, 1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="flex-1 h-1 rounded" style={{ background: i === 3 ? tpl.palette.primary : "#e2e8f0" }}></div>)}</div>
    </div>
  ),
  "web-ngo": (tpl) => (
    <div className="h-full flex flex-col p-1 space-y-0.5">
      <div className="text-[5px] font-bold" style={{ color: tpl.palette.primary }}>❤️ CAMPAIGNS</div>
      {[{ p: 70 }, { p: 45 }, { p: 88 }].map((c, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded p-0.5">
          <div className="h-0.5 rounded bg-slate-300 w-2/3"></div>
          <div className="h-1 mt-0.5 rounded bg-slate-100 relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 rounded" style={{ width: `${c.p}%`, background: `linear-gradient(90deg, ${tpl.palette.primary}, ${tpl.palette.accent})` }}></div>
          </div>
          <div className="text-[4px] text-slate-500 mt-0.5">{c.p}% raised</div>
        </div>
      ))}
    </div>
  ),
  "web-saas": (tpl) => (
    <div className="h-full flex">
      <div className="w-4 flex-shrink-0 p-0.5 space-y-0.5" style={{ background: tpl.palette.primary }}>
        {[0, 1, 2, 3].map((i) => <div key={i} className="h-1 rounded" style={{ background: i === 0 ? tpl.palette.accent : "rgba(255,255,255,0.2)" }}></div>)}
      </div>
      <div className="flex-1 p-1">
        <div className="grid grid-cols-3 gap-0.5">{[0, 1, 2].map((i) => <div key={i} className="h-3 rounded bg-slate-100"><div className="text-[4px] text-center pt-0.5" style={{ color: tpl.palette.primary }}>STAT</div></div>)}</div>
        <div className="mt-0.5 h-9 bg-slate-50 rounded p-0.5 flex items-end gap-0.5">
          {[40, 70, 50, 90, 65, 80].map((h, i) => <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: tpl.palette.accent }}></div>)}
        </div>
      </div>
    </div>
  ),
  // ───── SathiBD Matrimony — Matrimo-style gold mini-mockup ─────
  "web-sathibd": (tpl) => (
    <div className="h-full flex flex-col bg-white">
      {/* gold info bar */}
      <div className="h-1.5" style={{ background: "#f6af04" }}></div>
      {/* navbar */}
      <div className="h-3 bg-white shadow-sm flex items-center justify-between px-1">
        <div className="text-[5px] font-black" style={{ fontFamily: "'Playfair Display', serif" }}><span style={{ color: "#f6af04" }}>Sathi</span><span style={{ color: "#222" }}>BD</span></div>
        <div className="flex items-center gap-0.5">
          <div className="text-[3px] px-1 rounded-full font-bold" style={{ border: "0.5px solid #f6af04", color: "#d99400" }}>Plans</div>
          <div className="text-[3px] px-1 rounded-full font-bold" style={{ background: "#f6af04", color: "#222" }}>Register</div>
        </div>
      </div>
      {/* hero */}
      <div className="flex-1 flex">
        <div className="flex-1 p-1">
          <div className="text-[3px] font-bold inline-block px-1 rounded-full" style={{ background: "#fff3d6", color: "#d99400" }}>💍 #1 MATRIMONY</div>
          <div className="text-[6px] font-black leading-tight mt-0.5" style={{ color: "#222", fontFamily: "'Playfair Display', serif" }}>Find your <span style={{ color: "#f6af04", fontStyle: "italic" }}>Right Match</span></div>
          <div className="mt-0.5 bg-white rounded shadow-sm border border-slate-100 p-0.5">
            {["Looking for", "Religion", "City"].map((t, i) => <div key={i} className="h-1.5 rounded mt-0.5 first:mt-0 bg-slate-50 border border-slate-100 text-[2.5px] flex items-center px-0.5 text-slate-400">{t} ▾</div>)}
            <div className="mt-0.5 h-2 rounded flex items-center justify-center text-[3px] font-bold" style={{ background: "#f6af04", color: "#222" }}>🔍 Search</div>
          </div>
        </div>
        <div className="w-2/5 p-0.5">
          <div className="h-full rounded relative overflow-hidden" style={{ background: "linear-gradient(150deg, #f6c1c1, #e0114a)" }}>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5 pb-0.5">
              <div className="w-1.5 h-2 rounded-t-full bg-white/80"></div>
              <div className="w-1.5 h-2.5 rounded-t-full bg-white/80"></div>
            </div>
          </div>
        </div>
      </div>
      {/* services strip */}
      <div className="h-3 flex items-center justify-around px-0.5">
        {["👤", "💒", "🛎", "🚀", "📸", "📰"].map((s, i) => <div key={i} className="text-[5px]">{s}</div>)}
      </div>
    </div>
  ),
  // ───── NewsNow BD — rich Bangla news portal mini-mockup ─────
  "web-newsnow": (tpl) => (
    <div className="h-full flex flex-col bg-orange-50/30">
      <div className="h-4 flex items-center justify-center gap-1" style={{ background: tpl.palette.primary }}>
        <div className="w-2 h-2 rounded-sm flex items-center justify-center text-[4px] font-bold" style={{ background: "#d97706", color: "white", fontFamily: "'Tiro Bangla', serif" }}>আ</div>
        <div className="text-[5px] text-white font-black" style={{ fontFamily: "'Tiro Bangla', serif" }}>আলোকবার্তা</div>
      </div>
      <div className="h-1.5 bg-rose-100 flex items-center px-1 text-[3px] text-rose-700 font-bold">● ৬৪ জেলার আপডেট</div>
      <div className="flex-1 flex gap-0.5 px-0.5 py-0.5">
        <div className="flex-1">
          <div className="text-[3.5px] font-bold mt-0.5" style={{ color: "#d97706", fontFamily: "'Tiro Bangla', serif" }}>স্বাগতম</div>
          <div className="text-[5px] font-black leading-tight" style={{ fontFamily: "'Tiro Bangla', serif" }}>দেশ-বিদেশের সকল খবর</div>
          <div className="text-[5px] font-black leading-tight" style={{ fontFamily: "'Tiro Bangla', serif" }}>এক জায়গায়</div>
          <div className="mt-1 space-y-0.5">
            {["প্রথম আলো, ডেইলি স্টার", "রাজনীতি, খেলাধুলা", "২৪ ঘণ্টা আপডেট"].map((t, i) => (
              <div key={i} className="flex items-center gap-0.5 text-[3px] text-slate-700"><div className="w-1 h-1 rounded-full" style={{ background: tpl.palette.primary }}></div>{t}</div>
            ))}
          </div>
        </div>
        <div className="w-1/2 rounded p-0.5" style={{ background: tpl.palette.primary }}>
          <div className="text-[3.5px] text-amber-300 font-bold" style={{ fontFamily: "'Tiro Bangla', serif" }}>● লাইভ প্রিভিউ</div>
          <div className="mt-0.5 space-y-0.5">
            {[{ tag: "রাজনীতি", color: "#fecaca" }, { tag: "অর্থনীতি", color: "#bbf7d0" }, { tag: "খেলাধুলা", color: "#fde68a" }].map((it, i) => (
              <div key={i} className="bg-white rounded p-0.5">
                <span className="text-[3px] px-0.5 rounded font-bold" style={{ background: it.color, color: "#0f172a" }}>{it.tag}</span>
                <div className="h-0.5 rounded mt-0.5 bg-slate-300"></div>
                <div className="h-0.5 rounded mt-0.5 bg-slate-200 w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
  // ───── QuizBD Web — rich quiz mini-mockup ─────
  "web-quizbd": (tpl) => (
    <div className="h-full flex flex-col" style={{ background: `linear-gradient(135deg, ${tpl.palette.primary}, ${tpl.palette.accent})` }}>
      <div className="h-3 flex items-center justify-between px-1.5">
        <div className="text-[5px] text-white font-bold">🧠 QuizBD</div>
        <div className="text-[4px] text-amber-300">⚡ 840 pts</div>
      </div>
      <div className="flex-1 p-1">
        <div className="bg-white rounded shadow p-1">
          <div className="flex items-center justify-between text-[3px] text-slate-400">
            <span>Q 3 / 10</span>
            <span className="font-mono">⏱ 9:42</span>
          </div>
          <div className="h-0.5 bg-slate-100 rounded mt-0.5"><div className="h-full rounded" style={{ width: "30%", background: tpl.palette.primary }}></div></div>
          <div className="text-[4px] font-bold mt-1" style={{ color: "#0f172a", fontFamily: "'Tiro Bangla', serif" }}>বাংলাদেশের জাতীয় ফুল?</div>
          <div className="mt-1 space-y-0.5">
            {[{ l: "A", t: "শাপলা", correct: true }, { l: "B", t: "গোলাপ" }, { l: "C", t: "পদ্ম" }, { l: "D", t: "অর্কিড" }].map((o) => (
              <div key={o.l} className={`flex items-center gap-0.5 rounded px-0.5 py-0.5 border ${o.correct ? "bg-emerald-50 border-emerald-400" : "bg-slate-50 border-slate-200"}`}>
                <div className={`w-1.5 h-1.5 rounded-full flex items-center justify-center text-[3px] font-bold ${o.correct ? "bg-emerald-500 text-white" : "bg-white border border-slate-300 text-slate-500"}`}>{o.l}</div>
                <div className="text-[3.5px]" style={{ fontFamily: "'Tiro Bangla', serif" }}>{o.t}</div>
                {o.correct && <div className="ml-auto text-[3.5px] text-emerald-600">✓ +10</div>}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-0.5 flex items-center justify-between text-[3px] text-white/90">
          <span>🥇 Karim · 4,280</span>
          <span>🔥 7-day streak</span>
        </div>
      </div>
    </div>
  ),
};

// Pro templates use a telecom-themed mini-mockup
const ProMini = ({ tpl }) => (
  <div className="h-full flex flex-col relative overflow-hidden">
    {/* Signal wave background */}
    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M0,50 Q25,20 50,50 T100,50" stroke="white" strokeWidth="1" fill="none"></path>
      <path d="M0,60 Q25,30 50,60 T100,60" stroke="white" strokeWidth="0.5" fill="none"></path>
    </svg>
    <div className="h-3 flex items-center justify-between px-1.5 z-10" style={{ background: tpl.palette.primary }}>
      <div className="text-[5px] text-white font-bold">{tpl.name.slice(0, 12)}</div>
      <div className="text-[5px] text-white">📶</div>
    </div>
    <div className="flex-1 p-1 grid grid-cols-2 gap-0.5 z-10">
      <div className="bg-white/90 rounded p-0.5 col-span-2">
        <div className="text-[5px] font-bold" style={{ color: tpl.palette.primary }}>{tpl.icon} {tpl.apis?.[0]}</div>
        <div className="flex gap-0.5 mt-0.5">{(tpl.apis || []).slice(0, 3).map((a) => <span key={a} className="text-[4px] px-0.5 rounded" style={{ background: tpl.palette.accent, color: "white" }}>{a}</span>)}</div>
      </div>
      <div className="bg-white/90 rounded p-0.5 flex items-center justify-center">
        <div className="text-[6px]" style={{ color: tpl.palette.primary }}>API</div>
      </div>
      <div className="bg-white/90 rounded p-0.5 flex items-center justify-center">
        <div className="text-[6px]">📡</div>
      </div>
    </div>
  </div>
);

// Android mini phone frame
const PhoneFrameMini = ({ tpl, kids }) => (
  <div className="w-full h-full overflow-hidden relative">
    <div className="absolute inset-0 opacity-90" style={{ background: `linear-gradient(135deg, ${tpl.palette.primary} 0%, ${tpl.palette.accent} 100%)` }}></div>
    <div className="relative z-10 p-2 h-full flex items-center justify-center">
      <div className="bg-gray-900 rounded-[0.6rem] border-2 border-gray-700 shadow-lg overflow-hidden" style={{ width: 70, height: 110 }}>
        <div className="bg-gray-900 h-2 flex justify-center"><div className="w-6 h-1 bg-gray-900 rounded-b-md"></div></div>
        <div className="bg-white h-full">{kids}</div>
      </div>
    </div>
  </div>
);

const ANDROID_MINI = {
  "and-ecom": (tpl) => (
    <div className="h-full flex flex-col">
      <div className="h-3 flex items-center justify-between px-1" style={{ background: tpl.palette.primary }}>
        <div className="text-[4px] text-white font-bold">SHOP</div><div className="text-[4px] text-white">🛒2</div>
      </div>
      <div className="flex-1 p-0.5 grid grid-cols-2 gap-0.5">
        {[0, 1, 2, 3].map((i) => <div key={i} className="rounded" style={{ background: `${tpl.palette.primary}22` }}><div className="h-3 rounded-t" style={{ background: `linear-gradient(135deg, ${tpl.palette.primary}, ${tpl.palette.accent})` }}></div></div>)}
      </div>
      <div className="h-3 flex justify-around items-center border-t border-slate-200">{[0, 1, 2, 3].map((i) => <div key={i} className="w-1 h-1 rounded-full" style={{ background: i === 0 ? tpl.palette.primary : "#94a3b8" }}></div>)}</div>
    </div>
  ),
  "and-food": (tpl) => (
    <div className="h-full flex flex-col">
      <div className="h-3 flex items-center px-1" style={{ background: tpl.palette.primary }}><div className="text-[4px] text-white font-bold">FOOD</div></div>
      <div className="flex-1 p-0.5 space-y-0.5">
        {[0, 1, 2].map((i) => <div key={i} className="bg-slate-100 rounded h-3 flex items-center px-0.5 gap-0.5"><div className="w-2 h-2 rounded" style={{ background: tpl.palette.primary }}></div><div className="flex-1 h-0.5 rounded bg-slate-300"></div></div>)}
      </div>
      <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full flex items-center justify-center text-[5px] text-white" style={{ background: tpl.palette.primary }}>+</div>
    </div>
  ),
  "and-doctor": (tpl) => (
    <div className="h-full flex flex-col">
      <div className="h-3 flex items-center px-1" style={{ background: tpl.palette.primary }}><div className="text-[4px] text-white font-bold">DOCTORS</div></div>
      <div className="flex-1 p-0.5 space-y-0.5">
        {[0, 1, 2].map((i) => <div key={i} className="bg-white border border-slate-200 rounded h-3 flex items-center px-0.5 gap-0.5"><div className="w-2 h-2 rounded-full" style={{ background: tpl.palette.primary }}></div><div className="flex-1"><div className="h-0.5 rounded bg-slate-400 w-2/3"></div></div></div>)}
      </div>
    </div>
  ),
  "and-edu": (tpl) => (
    <div className="h-full flex flex-col">
      <div className="h-3 flex items-center px-1" style={{ background: tpl.palette.primary }}><div className="text-[4px] text-white font-bold">LEARN</div></div>
      <div className="flex-1 p-0.5 grid grid-cols-2 gap-0.5">
        {[0, 1, 2, 3].map((i) => <div key={i} className="rounded bg-white border border-slate-200"><div className="h-2 rounded-t" style={{ background: `linear-gradient(135deg, ${tpl.palette.primary}, ${tpl.palette.accent})` }}></div></div>)}
      </div>
    </div>
  ),
  "and-fitness": (tpl) => (
    <div className="h-full flex flex-col items-center justify-center bg-white">
      <div className="w-10 h-10 rounded-full border-4" style={{ borderColor: tpl.palette.primary, borderRightColor: "#e2e8f0" }}></div>
      <div className="text-[5px] mt-0.5 font-bold" style={{ color: tpl.palette.primary }}>7,432</div>
    </div>
  ),
  "and-travel": (tpl) => (
    <div className="h-full flex flex-col">
      <div className="h-6 flex items-center justify-center text-[6px] text-white" style={{ background: `linear-gradient(135deg, ${tpl.palette.primary}, ${tpl.palette.accent})` }}>✈ TRAVEL</div>
      <div className="flex-1 p-0.5 space-y-0.5">
        {[0, 1, 2].map((i) => <div key={i} className="rounded h-3" style={{ background: `linear-gradient(135deg, ${tpl.palette.accent}, ${tpl.palette.primary})` }}></div>)}
      </div>
    </div>
  ),
  "and-news": (tpl) => (
    <div className="h-full flex flex-col">
      <div className="h-3 flex items-center px-1" style={{ background: tpl.palette.primary }}><div className="text-[4px] text-white font-bold">NEWS</div></div>
      <div className="flex gap-0.5 px-1 py-0.5">{["Local", "Sports", "Tech"].map((c, i) => <div key={c} className="text-[4px] px-0.5 rounded" style={i === 0 ? { background: tpl.palette.primary, color: "white" } : { background: "#e2e8f0" }}>{c}</div>)}</div>
      <div className="flex-1 p-0.5 space-y-0.5">
        {[0, 1, 2, 3].map((i) => <div key={i} className="bg-slate-100 rounded h-2 flex items-center px-0.5 gap-0.5"><div className="w-2 h-2 rounded-full" style={{ background: tpl.palette.accent }}></div><div className="flex-1 h-0.5 rounded bg-slate-400"></div></div>)}
      </div>
    </div>
  ),
  "and-ride": (tpl) => (
    <div className="h-full relative" style={{ background: "#1e293b" }}>
      <div className="absolute inset-0 opacity-30">
        {[0, 1, 2].map((i) => <div key={i} className="absolute h-px w-full" style={{ background: "white", top: `${30 + i * 20}%` }}></div>)}
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base">🚗</div>
      <div className="absolute bottom-1 left-1 right-1 bg-white rounded p-0.5"><div className="text-[5px] font-bold" style={{ color: tpl.palette.primary }}>৳ 145</div></div>
    </div>
  ),
};

const TemplateMockup = ({ tpl, type }) => {
  if (type === "pro") return <Frame tpl={tpl} kids={<ProMini tpl={tpl} />} />;
  if (type === "web") {
    const renderer = WEB_MINI[tpl.id];
    return <Frame tpl={tpl} kids={renderer ? renderer(tpl) : <div className="h-full bg-slate-50" />} />;
  }
  // android
  const renderer = ANDROID_MINI[tpl.id];
  return <PhoneFrameMini tpl={tpl} kids={renderer ? renderer(tpl) : <div className="h-full bg-slate-50" />} />;
};

export default TemplateMockup;
export { CATEGORY_GRADIENTS };
