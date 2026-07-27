import React, { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { SathiBDWebPreview } from "./SathiBDPreview";
import { NewsWebPreview } from "./NewsPreview";
import { QuizWebPreview } from "./QuizPreview";

// Pro builder adapter: OrbitWebPreview passes (appName, tagline, primary, accent, language).
// SathiBDWebPreview expects cfg.* — wrap so Pro+Web previews share one source of truth.
const ProSathiAdapter = ({ appName, tagline, primary, accent, language }) => (
  <SathiBDWebPreview cfg={{ appName, tagline, primary, accent, language, fontFamily: "Poppins, sans-serif" }} />
);
const ProNewsAdapter = ({ appName, tagline, primary, accent, language, content }) => (
  <NewsWebPreview cfg={{ appName, tagline, primary, accent, language, fontFamily: "Inter, sans-serif" }} content={content} />
);
const ProQuizAdapter = ({ appName, tagline, primary, accent, language, content }) => (
  <QuizWebPreview cfg={{ appName, tagline, primary, accent, language, fontFamily: "Inter, sans-serif" }} content={content} />
);

// Helper: language strings (English / Bengali)
const T = (lang, en, bn) => (lang === "Bengali" ? bn : en);

// ---------------- BROWSER CHROME ----------------
export const BrowserChrome = ({ url, children, height = "h-[560px]" }) => (
  <div className="w-full bg-gray-100 rounded-xl border border-gray-300 shadow-lg overflow-hidden">
    <div className="bg-gray-200 h-8 flex items-center px-3 gap-1.5">
      <span className="w-3 h-3 rounded-full bg-red-400"></span>
      <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
      <span className="w-3 h-3 rounded-full bg-green-400"></span>
      <div className="flex-1 mx-3 bg-white rounded text-xs text-gray-400 px-2 h-5 flex items-center font-mono truncate">
        🔒 {url}
      </div>
    </div>
    <div className={`bg-white ${height} overflow-y-auto`}>{children}</div>
  </div>
);

// ============= 1. SMS ALERT SUBSCRIPTION PORTAL =============
const SubPortalPreview = ({ appName, tagline, primary, accent, language }) => {
  const [subs, setSubs] = useState([]);
  const [otpFor, setOtpFor] = useState(null);
  const [stage, setStage] = useState("phone"); // 'phone' | 'otp'
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const SERVICES = [
    { id: "weather", icon: "🌦️", name: T(language, "Weather Alerts", "আবহাওয়ার সতর্কতা"), price: "BDT 2/day", desc: T(language, "Daily weather updates for your city.", "আপনার শহরের জন্য দৈনিক আবহাওয়া।") },
    { id: "sports", icon: "🏏", name: T(language, "Sports Scores", "ক্রীড়া স্কোর"), price: "BDT 3/day", desc: T(language, "Live cricket and football scores.", "লাইভ ক্রিকেট ও ফুটবল স্কোর।") },
    { id: "health", icon: "💚", name: T(language, "Health Tips", "স্বাস্থ্য টিপস"), price: "BDT 1/day", desc: T(language, "Wellness tips every morning.", "প্রতিদিন সকালের ওয়েলনেস টিপস।") },
    { id: "news", icon: "📰", name: T(language, "News Digest", "নিউজ ডাইজেস্ট"), price: "BDT 2/day", desc: T(language, "Top headlines summarized.", "শীর্ষ সংবাদের সারসংক্ষেপ।") },
  ];

  const openSub = (svc) => { setOtpFor(svc); setStage("phone"); setPhone(""); setOtp(""); };
  const confirmPhone = () => { if (phone.length >= 4) setStage("otp"); };
  const confirmOtp = () => {
    if (otp.length >= 4) {
      setSubs((p) => p.includes(otpFor.id) ? p : [...p, otpFor.id]);
      setOtpFor(null);
    }
  };
  const unsub = (id) => setSubs((p) => p.filter((x) => x !== id));

  return (
    <div className="flex flex-col">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200" style={{ background: "white" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md flex items-center justify-center text-white text-sm" style={{ background: primary }}>📨</div>
          <div className="font-bold tracking-tight" style={{ color: primary }} data-testid="sub-portal-appname">{appName}</div>
        </div>
        <div className="hidden md:flex gap-5 text-sm text-slate-600">
          <span>{T(language, "Services", "সেবা")}</span>
          <span>{T(language, "Pricing", "মূল্য")}</span>
          <span>{T(language, "Help", "সহায়তা")}</span>
        </div>
        <button className="text-xs font-semibold px-3 py-2 rounded-md text-white" style={{ background: accent || primary }}>{T(language, "Sign In", "সাইন ইন")}</button>
      </div>

      {/* Hero */}
      <div className="px-6 py-10 text-white" style={{ background: `linear-gradient(135deg, ${primary} 0%, ${accent || primary} 100%)` }}>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight max-w-xl">{tagline}</h1>
        <p className="opacity-80 mt-2 text-sm max-w-lg">{T(language, "Subscribe to alert services with a single OTP. No app install required.", "একটি OTP দিয়েই সাবস্ক্রাইব করুন। অ্যাপ ইনস্টল প্রয়োজন নেই।")}</p>
        <button className="mt-4 bg-white text-sm font-semibold px-4 py-2 rounded-md" style={{ color: primary }}>{T(language, "Browse Services", "সেবা ব্রাউজ")}</button>
      </div>

      {/* Catalog */}
      <div className="px-6 py-6">
        <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-3">{T(language, "Available Services", "উপলব্ধ সেবা")}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SERVICES.map((s) => {
            const subscribed = subs.includes(s.id);
            return (
              <div key={s.id} data-testid={`web-sub-card-${s.id}`} className="border border-slate-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{s.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.desc}</div>
                    <div className="text-xs font-bold mt-1" style={{ color: primary }}>{s.price}</div>
                  </div>
                </div>
                {subscribed ? (
                  <div className="mt-3 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                    <span className="text-xs font-semibold text-emerald-700">✓ {T(language, "Subscribed", "সাবস্ক্রাইব")}</span>
                    <button onClick={() => unsub(s.id)} className="text-xs text-rose-600 underline">{T(language, "Unsubscribe", "আনসাবস্ক্রাইব")}</button>
                  </div>
                ) : (
                  <button data-testid={`web-sub-btn-${s.id}`} onClick={() => openSub(s)} className="mt-3 w-full text-xs font-semibold py-2 rounded-md text-white" style={{ background: primary }}>
                    {T(language, "Subscribe", "সাবস্ক্রাইব")}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* My subs */}
      {subs.length > 0 && (
        <div className="px-6 pb-8" data-testid="web-my-subs">
          <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-3">{T(language, "My Subscriptions", "আমার সাবস্ক্রিপশন")}</div>
          <div className="space-y-2">
            {SERVICES.filter((s) => subs.includes(s.id)).map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-md px-3 py-2">
                <div className="flex items-center gap-2">
                  <span>{s.icon}</span>
                  <span className="font-semibold text-sm">{s.name}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Active</span>
                </div>
                <button onClick={() => unsub(s.id)} className="text-xs text-rose-600 underline">{T(language, "Unsubscribe", "আনসাবস্ক্রাইব")}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OTP Inline Modal */}
      {otpFor && (
        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center z-10 p-4" onClick={() => setOtpFor(null)}>
          <div className="bg-white rounded-xl p-5 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="font-bold mb-1">{otpFor.name}</div>
            {stage === "phone" ? (
              <>
                <div className="text-xs text-slate-500 mb-3">{T(language, "Enter your Robi number", "আপনার রবি নম্বর দিন")}</div>
                <input data-testid="web-sub-phone" autoFocus value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="018XXXXXXXX" className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm" />
                <button data-testid="web-sub-phone-next" onClick={confirmPhone} className="mt-3 w-full text-white font-semibold text-sm py-2 rounded-md" style={{ background: primary }}>{T(language, "Send OTP", "OTP পাঠান")}</button>
              </>
            ) : (
              <>
                <div className="text-xs text-slate-500 mb-3">{T(language, "Enter OTP (use any 4 digits)", "OTP দিন (যেকোনো ৪ অঙ্ক)")}</div>
                <input data-testid="web-sub-otp" autoFocus value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="••••" className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm tracking-[0.5em] text-center font-mono" />
                <button data-testid="web-sub-otp-confirm" onClick={confirmOtp} className="mt-3 w-full text-white font-semibold text-sm py-2 rounded-md" style={{ background: primary }}>{T(language, "Confirm", "নিশ্চিত করুন")}</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============= 2. USSD COMPANION =============
const UssdCompanionPreview = ({ appName, tagline, primary, accent, language }) => {
  const tree = {
    root: [
      { id: "balance", label: T(language, "Check Balance", "ব্যালেন্স দেখুন") },
      { id: "recharge", label: T(language, "Recharge", "রিচার্জ") },
      { id: "internet", label: T(language, "Internet Packs", "ইন্টারনেট প্যাক") },
      { id: "bundles", label: T(language, "Bundles", "বান্ডেল") },
    ],
    balance: [{ id: "balance-detail", label: T(language, "Main Balance: ৳ 142.30", "মূল ব্যালেন্স: ৳ ১৪২.৩০") }],
    recharge: [{ id: "recharge-action", label: T(language, "Enter amount on next step", "পরবর্তী ধাপে পরিমাণ") }],
    internet: [
      { id: "i1", label: "1 GB / 7 days — ৳ 99" },
      { id: "i2", label: "5 GB / 30 days — ৳ 299" },
    ],
    bundles: [
      { id: "b1", label: "Talk 100 min + 1GB — ৳ 149" },
      { id: "b2", label: "Talk 60 min — ৳ 79" },
    ],
  };
  const [stack, setStack] = useState(["root"]);
  const [history, setHistory] = useState([{ when: "2 min ago", action: "Balance check", result: "৳ 142.30" }]);

  const cur = stack[stack.length - 1];
  const items = tree[cur] || [];

  const onPick = (it) => {
    if (tree[it.id]) {
      setStack([...stack, it.id]);
    } else {
      setHistory([{ when: T(language, "now", "এখন"), action: it.label, result: "✓" }, ...history]);
      setStack(["root"]);
    }
  };
  const goBack = () => stack.length > 1 && setStack(stack.slice(0, -1));

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-3 text-white" style={{ background: primary }}>
        <div className="flex items-center gap-2"><span className="text-xl">📞</span><span className="font-bold tracking-tight">{appName}</span></div>
        <span className="text-xs opacity-80 font-mono">*123#</span>
      </div>
      <div className="px-6 py-4">
        <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">{tagline}</div>
        <div className="bg-slate-900 text-emerald-300 font-mono text-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <button data-testid="ussd-back" onClick={goBack} disabled={stack.length === 1} className="text-xs px-2 py-0.5 rounded bg-slate-800 disabled:opacity-30">← Back</button>
            <div className="text-[11px] text-slate-400">USSD · {stack.join(" › ")}</div>
          </div>
          <div className="space-y-1.5">
            {items.map((it, i) => (
              <button key={it.id} data-testid={`ussd-item-${it.id}`} onClick={() => onPick(it)} className="w-full text-left hover:bg-slate-800 px-2 py-1 rounded">
                {i + 1}. {it.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-6 pb-6">
        <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">{T(language, "Transaction History", "লেনদেন")}</div>
        <table className="w-full text-xs">
          <thead className="text-left text-slate-500">
            <tr><th className="py-1">When</th><th>Action</th><th className="text-right">Result</th></tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="py-1.5 text-slate-500">{h.when}</td>
                <td>{h.action}</td>
                <td className="text-right font-semibold" style={{ color: primary }}>{h.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============= 3. CONTENT SUBSCRIPTION DASHBOARD =============
const ContentDashPreview = ({ appName, tagline, primary, accent, language }) => {
  const [logged, setLogged] = useState(false);
  const [stage, setStage] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [filter, setFilter] = useState("All");
  const [openId, setOpenId] = useState(null);

  const FEED = [
    { id: 1, cat: "Health", title: T(language, "Drink water before breakfast", "নাস্তার আগে পানি পান"), excerpt: T(language, "Hydration boosts your metabolism.", "হাইড্রেশন মেটাবলিজম বাড়ায়।"), full: T(language, "Drink a glass of warm water before breakfast. It activates the digestive system and helps kickstart your metabolism for the day.", "নাস্তার আগে এক গ্লাস কুসুম পানি পান করুন। এটি হজমে সাহায্য করে।") },
    { id: 2, cat: "Sports", title: T(language, "BAN beat IND by 7 wickets", "BAN ৭ উইকেটে জয়ী"), excerpt: T(language, "Mahmudullah 67* not out led the chase.", "মাহমুদুল্লাহ ৬৭* অপরাজিত।"), full: T(language, "Bangladesh chased down a target of 245 with ease, finishing at 246/3 in 38 overs. Mahmudullah's unbeaten 67 was the standout.", "বাংলাদেশ ২৪৫ রানের লক্ষ্য সহজেই অতিক্রম করেছে।") },
    { id: 3, cat: "Islamic", title: T(language, "Hadith of the day", "আজকের হাদিস"), excerpt: T(language, "The best of you are those who are best to their families.", "তোমাদের মধ্যে সেরা ঐ ব্যক্তি যে পরিবারের প্রতি সেরা।"), full: T(language, "Sahih al-Tirmidhi 3895 — The best of you are those who are best to their families, and I am the best of you to my family.", "সহীহ আল-তিরমিযি ৩৮৯৫") },
    { id: 4, cat: "Health", title: T(language, "Walk 20 minutes", "২০ মিনিট হাঁটুন"), excerpt: T(language, "Daily walks lower blood pressure.", "দৈনিক হাঁটা রক্তচাপ কমায়।"), full: T(language, "A 20-minute brisk walk every day reduces hypertension risk by 25% and improves cardiovascular health.", "দৈনিক ২০ মিনিট হাঁটা রক্তচাপ ২৫% কমায়।") },
    { id: 5, cat: "Sports", title: T(language, "Liverpool 3 - 1 Man City", "লিভারপুল ৩ - ১ ম্যান সিটি"), excerpt: T(language, "Salah hat-trick at Anfield.", "অ্যানফিল্ডে সালাহর হ্যাটট্রিক।"), full: T(language, "Mohamed Salah scored three to send Liverpool top of the Premier League with a commanding home win.", "মোহাম্মদ সালাহ তিন গোল করেছেন।") },
  ];
  const cats = ["All", "Health", "Sports", "Islamic"];

  if (!logged) {
    return (
      <div className="min-h-full flex items-center justify-center p-6" style={{ background: `linear-gradient(135deg, ${primary}11, white)` }}>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-md text-white flex items-center justify-center text-lg" style={{ background: primary }}>📰</div>
            <div>
              <div className="font-bold">{appName}</div>
              <div className="text-xs text-slate-500">{tagline}</div>
            </div>
          </div>
          {stage === "phone" ? (
            <>
              <label className="text-xs text-slate-500">{T(language, "Robi mobile number", "রবি মোবাইল নম্বর")}</label>
              <input data-testid="cd-phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="018XXXXXXXX" className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm mt-1" />
              <button data-testid="cd-phone-next" onClick={() => phone.length >= 4 && setStage("otp")} className="mt-3 w-full text-white font-semibold text-sm py-2 rounded-md" style={{ background: primary }}>{T(language, "Send OTP", "OTP পাঠান")}</button>
            </>
          ) : (
            <>
              <label className="text-xs text-slate-500">{T(language, "Enter 4-digit OTP", "৪ অঙ্কের OTP")}</label>
              <input data-testid="cd-otp" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="••••" className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm tracking-[0.5em] text-center font-mono mt-1" />
              <button data-testid="cd-login" onClick={() => otp.length >= 4 && setLogged(true)} className="mt-3 w-full text-white font-semibold text-sm py-2 rounded-md" style={{ background: primary }}>{T(language, "Login", "লগইন")}</button>
            </>
          )}
        </div>
      </div>
    );
  }

  const filtered = FEED.filter((f) => filter === "All" || f.cat === filter);

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-3 text-white" style={{ background: primary }}>
        <div className="flex items-center gap-2"><span>📰</span><span className="font-bold tracking-tight">{appName}</span></div>
        <button onClick={() => { setLogged(false); setStage("phone"); setPhone(""); setOtp(""); }} className="text-[10px] uppercase tracking-widest font-semibold opacity-90">{T(language, "Logout", "লগআউট")}</button>
      </div>
      <div className="px-6 py-3 border-b border-slate-100 flex gap-2 flex-wrap">
        {cats.map((c) => (
          <button key={c} data-testid={`cd-cat-${c.toLowerCase()}`} onClick={() => setFilter(c)} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${filter === c ? "text-white" : "bg-slate-100 text-slate-700"}`} style={filter === c ? { background: primary } : {}}>{c}</button>
        ))}
      </div>
      <div className="px-6 py-4 space-y-3">
        {filtered.map((f) => (
          <div key={f.id} data-testid={`cd-card-${f.id}`} onClick={() => setOpenId(openId === f.id ? null : f.id)} className="border border-slate-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded" style={{ background: `${primary}15`, color: primary }}>{f.cat}</span>
                <div className="font-bold mt-1">{f.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{f.excerpt}</div>
              </div>
              <span className="text-slate-400">{openId === f.id ? "▴" : "▾"}</span>
            </div>
            {openId === f.id && (
              <div className="mt-3 text-sm text-slate-700 border-t border-slate-100 pt-3">{f.full}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============= 4. ANALYTICS PORTAL =============
const AnalyticsPreview = ({ appName, tagline, primary, accent, language }) => {
  const growth = [
    { day: "Mon", v: 11800 }, { day: "Tue", v: 12100 }, { day: "Wed", v: 12340 },
    { day: "Thu", v: 12520 }, { day: "Fri", v: 12700 }, { day: "Sat", v: 12790 }, { day: "Sun", v: 12840 },
  ];
  const revenue = [
    { day: "Mon", r: 10800 }, { day: "Tue", r: 11500 }, { day: "Wed", r: 12100 },
    { day: "Thu", r: 13000 }, { day: "Fri", r: 12200 }, { day: "Sat", r: 11900 }, { day: "Sun", r: 12700 },
  ];
  const stats = [
    { l: T(language, "Total Subscribers", "মোট সাবস্ক্রাইবার"), v: "12,840", delta: "+3.2%" },
    { l: T(language, "Active Today", "আজ সক্রিয়"), v: "3,241", delta: "+1.4%" },
    { l: T(language, "Revenue This Month", "চলতি মাসের আয়"), v: "৳ 84,200", delta: "+8.1%" },
    { l: T(language, "Messages Sent", "প্রেরিত মেসেজ"), v: "48,920", delta: "+2.5%" },
  ];
  const tx = [
    { num: "017XX-345671", app: "Weather Alerts", amt: 2, when: "2m ago" },
    { num: "018XX-198822", app: "Daily Hadith", amt: 1, when: "5m ago" },
    { num: "016XX-447120", app: "Sports Scores", amt: 3, when: "12m ago" },
    { num: "017XX-887211", app: "Health Tips", amt: 1, when: "20m ago" },
    { num: "018XX-552189", app: "News Digest", amt: 2, when: "30m ago" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-3 text-white" style={{ background: primary }}>
        <div className="flex items-center gap-2"><span className="text-base">📊</span><span className="font-bold tracking-tight">{appName}</span></div>
        <button className="text-xs font-semibold px-3 py-1.5 rounded-md" style={{ background: accent, color: primary }} data-testid="analytics-export">{T(language, "Export CSV", "CSV রপ্তানি")}</button>
      </div>
      <div className="px-6 py-4">
        <div className="text-xs text-slate-500 mb-1">{tagline}</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.l} data-testid={`stat-${s.l.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="bg-white rounded-lg p-3 border border-slate-200">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{s.l}</div>
              <div className="text-lg font-bold mt-1">{s.v}</div>
              <div className="text-[10px] font-semibold mt-0.5" style={{ color: accent }}>{s.delta}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <div className="bg-white border border-slate-200 rounded-lg p-3">
            <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">{T(language, "Subscriber Growth", "সাবস্ক্রাইবার বৃদ্ধি")}</div>
            <div className="h-40 min-h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart data={growth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Line type="monotone" dataKey="v" stroke={accent} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-3">
            <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">{T(language, "Daily Revenue (BDT)", "দৈনিক আয় (BDT)")}</div>
            <div className="h-40 min-h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="r" fill={primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg mt-3">
          <div className="px-3 py-2 text-xs uppercase tracking-widest font-bold text-slate-500 border-b border-slate-100">{T(language, "Recent Transactions", "সাম্প্রতিক লেনদেন")}</div>
          <table className="w-full text-xs">
            <thead className="text-left text-slate-500 bg-slate-50">
              <tr><th className="px-3 py-1.5">{T(language, "Number", "নম্বর")}</th><th>App</th><th>Amount</th><th>{T(language, "When", "সময়")}</th></tr>
            </thead>
            <tbody>
              {tx.map((t, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="px-3 py-1.5 font-mono">{t.num}</td>
                  <td>{t.app}</td>
                  <td className="font-semibold" style={{ color: primary }}>৳ {t.amt}</td>
                  <td className="text-slate-500">{t.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============= 5. OTP LANDING =============
const OtpLandingPreview = ({ appName, tagline, primary, accent, language }) => {
  const [plan, setPlan] = useState("Starter");
  const plans = [
    { name: "Starter", price: "৳ 0", features: ["1,000 OTPs/mo", "Email support", "Standard latency"] },
    { name: "Pro", price: "৳ 2,500", features: ["50,000 OTPs/mo", "Priority support", "Dedicated number"] },
    { name: "Enterprise", price: T(language, "Custom", "কাস্টম"), features: ["Unlimited OTPs", "24/7 phone support", "SLA 99.99%"] },
  ];
  return (
    <div className="text-white" style={{ background: primary }}>
      <div className="px-6 py-3 flex items-center justify-between border-b border-white/10">
        <div className="font-bold tracking-tight">{appName}</div>
        <div className="hidden md:flex gap-4 text-xs opacity-80"><span>Docs</span><span>Pricing</span><span>API</span></div>
        <button className="text-xs font-semibold px-3 py-1.5 rounded-md text-white" style={{ background: accent }}>{T(language, "Get API Key", "API কী নিন")}</button>
      </div>
      <div className="px-6 py-10 text-center relative">
        <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 50% 50%, ${accent}, transparent 60%)` }}></div>
        <div className="relative">
          <div className="inline-block text-[10px] uppercase tracking-[0.3em] bg-white/10 backdrop-blur px-2 py-1 rounded mb-3">{T(language, "OTP API for Bangladesh", "বাংলাদেশের জন্য OTP API")}</div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight max-w-xl mx-auto">{tagline}</h1>
          <div className="mt-5 inline-block bg-slate-900 rounded-lg p-3 text-left font-mono text-[11px]">
            <div className="text-slate-400">// Send OTP in one line</div>
            <div><span style={{ color: accent }}>fetch</span>(<span className="text-emerald-400">"/api/otp/send"</span>, {`{`} body: {`{`} phone {`}}`})</div>
          </div>
        </div>
      </div>
      <div className="bg-white text-slate-900 px-6 py-8">
        <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-3 text-center">{T(language, "Simple Pricing", "সহজ মূল্য")}</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {plans.map((p) => (
            <button key={p.name} data-testid={`otp-plan-${p.name.toLowerCase()}`} onClick={() => setPlan(p.name)} className={`text-left rounded-xl border-2 p-4 transition-all ${plan === p.name ? "shadow-lg" : "border-slate-200"}`} style={plan === p.name ? { borderColor: accent } : {}}>
              <div className="font-bold">{p.name}</div>
              <div className="text-2xl font-bold mt-1" style={{ color: primary }}>{p.price}</div>
              <ul className="mt-2 space-y-1">
                {p.features.map((f) => <li key={f} className="text-xs text-slate-600 flex gap-1.5"><span style={{ color: accent }}>✓</span>{f}</li>)}
              </ul>
              <div className="mt-3 text-xs font-semibold text-center py-1.5 rounded-md text-white" style={{ background: plan === p.name ? accent : primary }}>{plan === p.name ? T(language, "Selected", "নির্বাচিত") : T(language, "Choose Plan", "প্ল্যান নির্বাচন")}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-slate-50 text-slate-900 px-6 py-6">
        <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">{T(language, "Why developers love it", "ডেভেলপাররা কেন পছন্দ করেন")}</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[{ i: "⚡", t: T(language, "1.2s avg delivery", "১.২ সেঃ ডেলিভারি") }, { i: "🌍", t: T(language, "All Robi numbers", "সব রবি নম্বর") }, { i: "🔧", t: T(language, "REST + Webhook", "REST + Webhook") }].map((f) => (
            <div key={f.t} className="bg-white border border-slate-200 rounded-lg p-3 flex items-center gap-3">
              <div className="text-2xl">{f.i}</div><div className="text-sm font-semibold">{f.t}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============= 6. SUBSCRIPTION STORE =============
const StorePreview = ({ appName, tagline, primary, accent, language }) => {
  const [section, setSection] = useState("home"); // home | detail | myservices
  const [openApp, setOpenApp] = useState(null);
  const [services, setServices] = useState([]);
  const apps = [
    { id: "wa", icon: "🌦️", name: T(language, "Weather Alerts", "আবহাওয়া"), price: "৳ 2/d", desc: "Daily forecast for Dhaka & 7 cities." },
    { id: "dh", icon: "📖", name: T(language, "Daily Hadith", "দৈনিক হাদিস"), price: "৳ 1/d", desc: "Authentic Hadith with translation." },
    { id: "cs", icon: "🏏", name: T(language, "Cricket Live", "লাইভ ক্রিকেট"), price: "৳ 3/d", desc: "Live BD cricket scores." },
    { id: "hp", icon: "💚", name: T(language, "Health Plus", "হেলথ প্লাস"), price: "৳ 2/d", desc: "Daily wellness tips & reminders." },
    { id: "fb", icon: "⚽", name: T(language, "Football Alerts", "ফুটবল অ্যালার্ট"), price: "৳ 2/d", desc: "EPL + La Liga + UCL." },
    { id: "mt", icon: "📈", name: T(language, "Market Brief", "মার্কেট ব্রিফ"), price: "৳ 2/d", desc: "Daily DSE market summary." },
  ];
  const subscribe = (id) => setServices((p) => p.includes(id) ? p : [...p, id]);
  const unsub = (id) => setServices((p) => p.filter((x) => x !== id));

  return (
    <div className="font-sans">
      <div className="flex items-center justify-between px-6 py-3" style={{ background: primary, color: accent }}>
        <div className="font-bold tracking-tight">{appName}</div>
        <div className="flex gap-3 text-xs">
          <button data-testid="store-nav-home" onClick={() => setSection("home")} className={`underline-offset-2 ${section === "home" ? "underline font-bold" : ""}`}>{T(language, "Home", "হোম")}</button>
          <button data-testid="store-nav-my" onClick={() => setSection("myservices")} className={`underline-offset-2 ${section === "myservices" ? "underline font-bold" : ""}`}>{T(language, "My Services", "আমার সেবা")} ({services.length})</button>
        </div>
      </div>
      {section === "home" && (
        <div className="px-6 py-4">
          <div className="text-xs text-slate-500 mb-3">{tagline}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {apps.map((a) => (
              <div key={a.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">{a.icon}</div>
                <div className="font-bold">{a.name}</div>
                <div className="text-xs text-slate-500 mb-2">{a.desc}</div>
                <div className="text-xs font-bold mb-2" style={{ color: primary }}>{a.price}</div>
                <div className="flex gap-2">
                  <button data-testid={`store-detail-${a.id}`} onClick={() => { setOpenApp(a); setSection("detail"); }} className="text-xs px-2.5 py-1 rounded-md border border-slate-200">View</button>
                  {services.includes(a.id)
                    ? <button onClick={() => unsub(a.id)} className="text-xs px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700">Subscribed ✓</button>
                    : <button data-testid={`store-sub-${a.id}`} onClick={() => subscribe(a.id)} className="text-xs font-semibold px-2.5 py-1 rounded-md text-white" style={{ background: primary }}>Subscribe</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {section === "detail" && openApp && (
        <div className="px-6 py-5">
          <button onClick={() => setSection("home")} className="text-xs text-slate-500 underline mb-3">← Back</button>
          <div className="flex items-center gap-3">
            <div className="text-5xl">{openApp.icon}</div>
            <div>
              <div className="font-bold text-xl">{openApp.name}</div>
              <div className="text-sm text-slate-500">{openApp.desc}</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 rounded-lg p-3"><div className="text-[10px] uppercase tracking-widest text-slate-500">Price</div><div className="font-bold" style={{ color: primary }}>{openApp.price}</div></div>
            <div className="bg-slate-50 rounded-lg p-3"><div className="text-[10px] uppercase tracking-widest text-slate-500">Frequency</div><div className="font-bold">Daily</div></div>
            <div className="bg-slate-50 rounded-lg p-3"><div className="text-[10px] uppercase tracking-widest text-slate-500">Channel</div><div className="font-bold">SMS + Web</div></div>
          </div>
          {services.includes(openApp.id) ? (
            <button onClick={() => unsub(openApp.id)} className="mt-4 w-full font-semibold py-2.5 rounded-md bg-emerald-100 text-emerald-700">Subscribed — Unsubscribe</button>
          ) : (
            <button onClick={() => subscribe(openApp.id)} className="mt-4 w-full font-semibold py-2.5 rounded-md text-white" style={{ background: primary }}>{T(language, "Subscribe Now", "এখনই সাবস্ক্রাইব")}</button>
          )}
        </div>
      )}
      {section === "myservices" && (
        <div className="px-6 py-5">
          {services.length === 0 ? (
            <div className="text-center text-sm text-slate-500 py-8">{T(language, "No active services yet.", "এখনো কোনো সক্রিয় সেবা নেই।")}</div>
          ) : (
            <div className="space-y-2">
              {apps.filter((a) => services.includes(a.id)).map((a) => (
                <div key={a.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-md p-3">
                  <div className="flex items-center gap-2"><span className="text-xl">{a.icon}</span><span className="font-semibold">{a.name}</span></div>
                  <button onClick={() => unsub(a.id)} className="text-xs text-rose-600 underline">Unsubscribe</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============= 7. PREMIUM CONTENT =============
const PremiumPreview = ({ appName, tagline, primary, accent, language }) => {
  const [balance, setBalance] = useState(150);
  const [unlocked, setUnlocked] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const items = [
    { id: 1, title: T(language, "Pro tactics: chess openings", "প্রো চেস ওপেনিং"), price: 5, kind: "Article" },
    { id: 2, title: T(language, "Inside the Quran tafsir", "কুরআন তাফসির"), price: 7, kind: "Audio" },
    { id: 3, title: T(language, "Stock pick of the week", "এই সপ্তাহের স্টক"), price: 10, kind: "Report" },
    { id: 4, title: T(language, "Premium recipe pack", "প্রিমিয়াম রেসিপি"), price: 6, kind: "PDF" },
  ];
  const buy = () => {
    if (!confirm) return;
    if (balance < confirm.price) return;
    setBalance(balance - confirm.price);
    setUnlocked((p) => [...p, confirm.id]);
    setConfirm(null);
  };
  return (
    <div style={{ background: primary }} className="text-white">
      <div className="px-6 py-3 flex items-center justify-between border-b border-white/10">
        <div className="font-bold tracking-tight">{appName}</div>
        <div className="bg-white/10 backdrop-blur px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5" data-testid="premium-balance">
          <span style={{ color: accent }}>৳</span> {balance}
        </div>
      </div>
      <div className="px-6 py-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight max-w-md mx-auto">{tagline}</h1>
        <div className="text-xs opacity-70 mt-1">{T(language, "Pay with your Robi balance via CaaS.", "CaaS-এর মাধ্যমে রবি ব্যালেন্স দিয়ে পরিশোধ।")}</div>
      </div>
      <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((it) => {
          const isUnlocked = unlocked.includes(it.id);
          return (
            <div key={it.id} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 relative overflow-hidden">
              {!isUnlocked && <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center text-3xl">🔒</div>}
              <div className="text-[10px] uppercase tracking-widest opacity-70">{it.kind}</div>
              <div className="font-bold mt-1">{it.title}</div>
              <div className="text-xs opacity-70 mt-2">{isUnlocked ? T(language, "Unlocked ✓", "আনলক ✓") : `${T(language, "Unlock for", "আনলক")}  ৳ ${it.price}`}</div>
              <button data-testid={`premium-unlock-${it.id}`} onClick={() => !isUnlocked && setConfirm(it)} disabled={isUnlocked} className="mt-3 w-full font-semibold text-xs py-2 rounded-md relative z-10" style={{ background: accent, color: primary }}>
                {isUnlocked ? T(language, "Read", "পড়ুন") : T(language, "Unlock", "আনলক")}
              </button>
            </div>
          );
        })}
      </div>
      {confirm && (
        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center z-10 p-4" onClick={() => setConfirm(null)}>
          <div className="bg-white text-slate-900 rounded-xl p-5 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="font-bold mb-1">{T(language, "Confirm purchase", "ক্রয় নিশ্চিত করুন")}</div>
            <div className="text-sm text-slate-600">{confirm.title}</div>
            <div className="bg-slate-50 rounded-md p-3 mt-3 text-sm flex justify-between"><span>{T(language, "Amount", "পরিমাণ")}</span><span className="font-bold" style={{ color: primary }}>৳ {confirm.price}</span></div>
            <div className="bg-slate-50 rounded-md p-3 mt-1 text-sm flex justify-between"><span>{T(language, "After purchase", "ক্রয়ের পর")}</span><span className="font-bold">৳ {balance - confirm.price}</span></div>
            <button data-testid="premium-confirm-buy" onClick={buy} disabled={balance < confirm.price} className="mt-3 w-full text-white font-semibold py-2 rounded-md disabled:opacity-50" style={{ background: primary }}>
              {balance < confirm.price ? T(language, "Insufficient Balance", "ব্যালেন্স অপ্রতুল") : T(language, "Pay via CaaS", "CaaS দিয়ে পরিশোধ")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============= 8. SERVICE PROVIDER ADMIN =============
const AdminPreview = ({ appName, tagline, primary, accent, language }) => {
  const [tab, setTab] = useState("subscribers");
  const [keyword, setKeyword] = useState("");
  const [broadcast, setBroadcast] = useState("");
  const [keywords, setKeywords] = useState(["WTHR", "HADITH", "SCORE"]);
  const [sent, setSent] = useState(false);

  const subscribers = [
    { num: "017XX-345671", app: "Weather Alerts", since: "12 days", status: "Active" },
    { num: "018XX-198822", app: "Daily Hadith", since: "3 days", status: "Active" },
    { num: "016XX-447120", app: "Sports Scores", since: "2 mo", status: "Active" },
    { num: "017XX-887211", app: "Health Tips", since: "8 days", status: "Paused" },
  ];

  return (
    <div className="flex">
      <div className="w-44 flex-shrink-0 text-white p-3 hidden sm:block" style={{ background: primary }}>
        <div className="font-bold mb-3">{appName}</div>
        {[
          { id: "subscribers", l: T(language, "Subscribers", "সাবস্ক্রাইবার") },
          { id: "broadcast", l: T(language, "Broadcast", "ব্রডকাস্ট") },
          { id: "revenue", l: T(language, "Revenue", "আয়") },
          { id: "keywords", l: T(language, "Keywords", "কীওয়ার্ড") },
        ].map((s) => (
          <button key={s.id} data-testid={`admin-nav-${s.id}`} onClick={() => setTab(s.id)} className={`block w-full text-left px-2 py-2 rounded text-xs mb-0.5 ${tab === s.id ? "font-semibold" : "text-white/70 hover:text-white"}`} style={tab === s.id ? { background: accent, color: primary } : {}}>{s.l}</button>
        ))}
      </div>
      <div className="flex-1 p-5 bg-slate-50">
        <div className="text-xs text-slate-500 mb-3">{tagline}</div>
        {tab === "subscribers" && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-3 py-2 font-bold text-sm border-b border-slate-100">{T(language, "Active Subscribers", "সক্রিয় সাবস্ক্রাইবার")}</div>
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 text-left">
                <tr><th className="px-3 py-1.5">MSISDN</th><th>App</th><th>{T(language, "Since", "যখন থেকে")}</th><th>Status</th></tr>
              </thead>
              <tbody>
                {subscribers.map((s, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-mono">{s.num}</td>
                    <td>{s.app}</td>
                    <td className="text-slate-500">{s.since}</td>
                    <td><span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${s.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tab === "broadcast" && (
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="font-bold mb-2">{T(language, "Broadcast Message", "ব্রডকাস্ট মেসেজ")}</div>
            <textarea data-testid="admin-broadcast-msg" value={broadcast} maxLength={300} onChange={(e) => setBroadcast(e.target.value)} placeholder={T(language, "Type your message (max 300 chars)", "মেসেজ লিখুন (সর্বোচ্চ ৩০০ অক্ষর)")} className="w-full border border-slate-200 rounded-md p-2 text-sm h-24 resize-none"></textarea>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-slate-500">{broadcast.length}/300</span>
              <button data-testid="admin-broadcast-send" onClick={() => { setSent(true); setTimeout(() => setSent(false), 2000); }} disabled={!broadcast.trim()} className="font-semibold px-3 py-1.5 rounded-md text-white disabled:opacity-50" style={{ background: accent }}>
                {sent ? T(language, "Sent ✓", "প্রেরিত ✓") : T(language, "Send to all", "সবার কাছে পাঠান")}
              </button>
            </div>
          </div>
        )}
        {tab === "revenue" && (
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">{T(language, "Revenue (last 7 days)", "আয় (গত ৭ দিন)")}</div>
            <div className="h-40 min-h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={[{ d: "Mon", v: 9800 }, { d: "Tue", v: 11200 }, { d: "Wed", v: 10500 }, { d: "Thu", v: 13900 }, { d: "Fri", v: 12100 }, { d: "Sat", v: 11800 }, { d: "Sun", v: 12700 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="d" fontSize={10} /><YAxis fontSize={10} /><Tooltip />
                  <Bar dataKey="v" fill={accent} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {tab === "keywords" && (
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="font-bold mb-2">{T(language, "Keyword Manager", "কীওয়ার্ড ম্যানেজার")}</div>
            <div className="flex gap-2 mb-3">
              <input data-testid="admin-kw-input" value={keyword} onChange={(e) => setKeyword(e.target.value.toUpperCase())} placeholder="NEW_KEYWORD" className="flex-1 border border-slate-200 rounded-md px-3 py-1.5 text-sm font-mono" />
              <button data-testid="admin-kw-add" onClick={() => { if (keyword) { setKeywords([...keywords, keyword]); setKeyword(""); } }} className="text-xs font-semibold px-3 py-1.5 rounded-md text-white" style={{ background: primary }}>{T(language, "Add", "যোগ")}</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((k) => (
                <span key={k} className="bg-slate-100 px-2 py-1 rounded-md text-xs font-mono flex items-center gap-1.5">{k}<button onClick={() => setKeywords(keywords.filter((x) => x !== k))} className="text-slate-400 hover:text-rose-600">×</button></span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Map templateId → preview component
const PREVIEWS = {
  "web-sub-portal": SubPortalPreview,
  "web-ussd-companion": UssdCompanionPreview,
  "web-content-dash": ContentDashPreview,
  "web-analytics": AnalyticsPreview,
  "web-otp-landing": OtpLandingPreview,
  "web-app-store": StorePreview,
  "web-premium": PremiumPreview,
  "web-admin": AdminPreview,
  // Pro App Builder aliases
  "pro-sub-portal": SubPortalPreview,
  "pro-ussd": UssdCompanionPreview,
  "pro-content-dash": ContentDashPreview,
  "pro-analytics": AnalyticsPreview,
  "pro-otp": OtpLandingPreview,
  "pro-store": StorePreview,
  "pro-premium": PremiumPreview,
  "pro-admin": AdminPreview,
  // Matrimony (SathiBD) — isolated preview
  "pro-sathibd": ProSathiAdapter,
  // News (NewsNow BD) — isolated preview
  "pro-newsnow": ProNewsAdapter,
  // Quiz (QuizBD) — isolated preview
  "pro-quizbd": ProQuizAdapter,
};

const OrbitWebPreview = ({ templateId, appName = "Orbit App", tagline = "Your tagline", primaryColor = "#0f172a", secondaryColor = "#e11d48", language = "English", url, height }) => {
  const Comp = PREVIEWS[templateId] || SubPortalPreview;
  const fallbackUrl = useMemo(() => url || `${(appName || "app").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.orbit.app`, [url, appName]);
  return (
    <BrowserChrome url={fallbackUrl} height={height}>
      <div className="relative h-full">
        <Comp appName={appName} tagline={tagline} primary={primaryColor} accent={secondaryColor} language={language} />
      </div>
    </BrowserChrome>
  );
};

export default OrbitWebPreview;
