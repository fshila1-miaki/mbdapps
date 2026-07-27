import React, { useState, useEffect } from "react";

// Helper
const T = (lang, en, bn) => (lang === "Bengali" ? bn : en);

// ----- PHONE FRAME -----
export const PhoneFrame = ({ children, size = 220, label }) => (
  <div className="flex flex-col items-center gap-2">
    <div
      className="relative bg-gray-900 rounded-[2rem] border-4 border-gray-700 shadow-xl overflow-hidden"
      style={{ width: size, height: size * 2 }}
    >
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-900 rounded-full z-10"></div>
      <div className="absolute left-[-6px] top-20 w-1.5 h-8 bg-gray-600 rounded-l"></div>
      <div className="absolute left-[-6px] top-32 w-1.5 h-8 bg-gray-600 rounded-l"></div>
      <div className="absolute right-[-6px] top-24 w-1.5 h-12 bg-gray-600 rounded-r"></div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-500 rounded-full z-10"></div>
      <div className="bg-white w-full h-full overflow-hidden pt-6 flex flex-col">
        {children}
      </div>
    </div>
    {label && <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{label}</div>}
  </div>
);

const StatusBar = ({ color, light = true }) => (
  <div className="h-6 flex items-center justify-between px-4 text-[10px]" style={{ background: color, color: light ? "white" : "#09090B" }}>
    <span className="font-semibold">9:41</span>
    <div className="flex items-center gap-1.5">
      <span>📶</span><span>📡</span><span className="font-semibold">98%</span>
    </div>
  </div>
);

// ----- AUTO-ADVANCE SPLASH HOOK -----
const useAutoAdvance = (active, onDone, ms = 2000) => {
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(onDone, ms);
    return () => clearTimeout(t);
  }, [active, onDone, ms]);
};

// ============= 1. SMS ALERT APP (and-alert) =============
const AlertAppPreview = ({ appName, tagline, primary, icon, language }) => {
  const [splashDone, setSplashDone] = useState(false);
  useAutoAdvance(true, () => setSplashDone(true), 2000);
  const [tab, setTab] = useState("home");
  const [expanded, setExpanded] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [phone, setPhone] = useState("");

  const alerts = [
    { id: 1, t: "08:00", title: T(language, "Weather Alert", "আবহাওয়া সতর্কতা"), msg: T(language, "Dhaka 31°C, light rain expected from 4 PM.", "ঢাকা ৩১°C, বিকেল ৪টা থেকে হালকা বৃষ্টি।"), full: T(language, "A low pressure over the Bay of Bengal will bring scattered showers across Dhaka and Chittagong from 4 PM today. Carry an umbrella.", "বঙ্গোপসাগরে নিম্নচাপের কারণে আজ বিকেলে ঢাকায় বৃষ্টিপাত হবে।") },
    { id: 2, t: "07:30", title: T(language, "Traffic Update", "ট্রাফিক আপডেট"), msg: T(language, "Mirpur Rd heavy congestion 30 min delay.", "মিরপুর রোড — ৩০ মিনিট দেরি।"), full: T(language, "Mirpur Road heavy congestion near 10. Use Kazipara bypass for faster transit.", "মিরপুর ১০ এ যানজট। কাজীপাড়া বাইপাস ব্যবহার করুন।") },
    { id: 3, t: "07:00", title: T(language, "Cricket Live", "লাইভ ক্রিকেট"), msg: T(language, "BAN 245/4 (40 ov) vs IND. Mahmudullah 67*.", "BAN ২৪৫/৪ (৪০ ওভার) — মাহমুদুল্লাহ ৬৭*"), full: T(language, "Bangladesh on top of the chase. Mahmudullah's calm 67 anchors the innings.", "মাহমুদুল্লাহ চমৎকার ব্যাটিং করছেন।") },
    { id: 4, t: "06:30", title: T(language, "Stock Brief", "স্টক ব্রিফ"), msg: T(language, "DSEX +0.42% closing 6,210.", "DSEX +০.৪২% — ৬,২১০"), full: T(language, "Index closed up, BEXIMCO topped gainers at +5.1%.", "BEXIMCO শীর্ষ লাভকারী।") },
    { id: 5, t: "06:00", title: T(language, "Health Tip", "হেলথ টিপ"), msg: T(language, "Drink 8 glasses of water today.", "আজ ৮ গ্লাস পানি পান করুন।"), full: T(language, "Daily hydration improves skin and concentration.", "দৈনিক পানি পান শরীর সুস্থ রাখে।") },
  ];

  return (
    <>
      <PhoneFrame label={T(language, "Splash", "স্প্ল্যাশ")}>
        <div className="flex-1 flex flex-col items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${primary} 0%, #09090B 100%)` }}>
          <div className="text-5xl mb-3 animate-pulse">{icon}</div>
          <div className="font-bold text-lg">{appName}</div>
          <div className="text-[10px] opacity-70 mt-1">{tagline}</div>
          {splashDone ? (
            <div className="text-[10px] mt-4 opacity-60">{T(language, "Loading complete →", "লোডিং সম্পন্ন →")}</div>
          ) : (
            <div className="flex gap-1 mt-4">{[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></span>)}</div>
          )}
        </div>
      </PhoneFrame>

      <PhoneFrame label={T(language, "Home", "হোম")}>
        <StatusBar color={primary} />
        <div className="px-4 py-3 flex items-center justify-between text-white" style={{ background: primary }}>
          <div>
            <div className="font-bold text-sm leading-none">{appName}</div>
            <div className="text-[9px] opacity-70 mt-0.5">{T(language, `${alerts.length} alerts today`, `আজ ${alerts.length}টি অ্যালার্ট`)}</div>
          </div>
          <span className="text-base">🔔</span>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2 bg-slate-50">
          {alerts.map((a) => (
            <button key={a.id} data-testid={`and-alert-card-${a.id}`} onClick={() => setExpanded(expanded === a.id ? null : a.id)} className="w-full text-left bg-white border border-slate-200 rounded-lg p-2.5 mb-1.5 hover:border-slate-300">
              <div className="flex justify-between items-center text-[10px] text-slate-500"><span>{a.t}</span><span>{expanded === a.id ? "▴" : "▾"}</span></div>
              <div className="font-bold text-xs mt-0.5">{a.title}</div>
              <div className="text-[11px] text-slate-600">{a.msg}</div>
              {expanded === a.id && <div className="text-[10px] mt-2 pt-2 border-t border-slate-100 text-slate-600">{a.full}</div>}
            </button>
          ))}
        </div>
        <div className="bg-white border-t border-slate-100 flex justify-around py-2 text-[10px]">
          {[{ id: "home", e: "🏠", l: T(language, "Home", "হোম") }, { id: "history", e: "📜", l: T(language, "History", "ইতিহাস") }, { id: "subscribe", e: "➕", l: T(language, "Subscribe", "সাবস্ক্রাইব") }, { id: "profile", e: "👤", l: T(language, "Profile", "প্রোফাইল") }].map((b) => (
            <button key={b.id} data-testid={`and-alert-tab-${b.id}`} onClick={() => setTab(b.id)} className="flex flex-col items-center" style={{ color: tab === b.id ? primary : "#94a3b8" }}>
              <span className="text-sm">{b.e}</span>
              <span>{b.l}</span>
            </button>
          ))}
        </div>
      </PhoneFrame>

      <PhoneFrame label={T(language, "Subscribe", "সাবস্ক্রাইব")}>
        <StatusBar color={primary} />
        <div className="px-4 py-3 text-white" style={{ background: primary }}>
          <div className="font-bold text-sm">{T(language, "Subscribe to", "সাবস্ক্রাইব")} {appName}</div>
          <div className="text-[9px] opacity-70 mt-0.5">{T(language, "Daily alerts + SMS", "দৈনিক সতর্কতা + SMS")}</div>
        </div>
        <div className="flex-1 px-4 py-4 bg-slate-50 flex flex-col">
          {!subscribed ? (
            <>
              <div className="text-[11px] text-slate-500 mb-2">{T(language, "Robi mobile number", "রবি মোবাইল")}</div>
              <input data-testid="and-alert-sub-phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="018XXXXXXXX" className="border border-slate-200 rounded-md px-3 py-2 text-xs font-mono" />
              <button data-testid="and-alert-sub-btn" onClick={() => phone.length >= 4 && setSubscribed(true)} className="mt-3 text-white font-semibold text-xs py-2.5 rounded-md" style={{ background: primary }}>
                {T(language, "Subscribe", "সাবস্ক্রাইব")}
              </button>
              <div className="text-[10px] text-slate-400 mt-2">{T(language, "৳ 2/day · cancel anytime", "৳ ২/দিন · যেকোনো সময় বাতিল")}</div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-2xl text-emerald-600 mb-3">✓</div>
              <div className="font-bold text-sm" style={{ color: primary }}>{T(language, "Subscribed!", "সাবস্ক্রাইব সম্পন্ন!")}</div>
              <div className="text-[11px] text-slate-500 mt-1">{phone}</div>
              <div className="text-[10px] text-slate-400 mt-3">{T(language, "First alert arrives within minutes.", "প্রথম অ্যালার্ট কিছুক্ষণের মধ্যেই।")}</div>
            </div>
          )}
        </div>
      </PhoneFrame>
    </>
  );
};

// ============= 2. DAILY CONTENT APP (and-content) =============
const ContentAppPreview = ({ appName, tagline, primary, icon, language }) => {
  const [idx, setIdx] = useState(0);
  const [bookmarked, setBookmarked] = useState([]);
  const [cat, setCat] = useState("Hadith");
  const items = {
    Hadith: [
      { t: T(language, "On family", "পরিবার সম্পর্কে"), b: T(language, "The best of you are those who are best to their families.", "তোমাদের সেরা ঐ ব্যক্তি যে পরিবারের প্রতি সেরা।") },
      { t: T(language, "On honesty", "সততা সম্পর্কে"), b: T(language, "Truthfulness leads to righteousness.", "সততা ভালো কাজের দিকে নিয়ে যায়।") },
      { t: T(language, "On charity", "দান সম্পর্কে"), b: T(language, "Even a smile is charity.", "এমনকি হাসিও সদকা।") },
    ],
    Health: [
      { t: T(language, "Water first", "প্রথম পানি"), b: T(language, "Drink a glass of water before breakfast.", "নাস্তার আগে এক গ্লাস পানি পান করুন।") },
      { t: T(language, "Daily walk", "দৈনিক হাঁটা"), b: T(language, "20-minute walk lowers BP risk by 25%.", "২০ মিনিট হাঁটা রক্তচাপ ২৫% কমায়।") },
      { t: T(language, "Seasonal fruit", "মৌসুমি ফল"), b: T(language, "Add seasonal fruits for vitamin C.", "মৌসুমি ফল ভিটামিন C যোগ করে।") },
    ],
    Motivation: [{ t: "Start now", b: "Don't wait for the perfect moment. Start today and adjust." }, { t: "Small steps", b: "Tiny consistent actions beat occasional bursts of effort." }, { t: "Mindset", b: "Belief precedes ability. Stay optimistic." }],
    News: [{ t: "BAN beats IND", b: "Bangladesh secured a 7-wicket win in style." }, { t: "Stocks +0.42%", b: "DSEX closed at 6,210, top gainer BEXIMCO." }, { t: "Weather", b: "Light rain expected in Dhaka from 4 PM." }],
    Tech: [{ t: "5G in BD", b: "Robi launches 5G pilot in 3 cities." }, { t: "AI tools", b: "AI assistants now in Bengali." }, { t: "Payments", b: "Mobile financial services hit new high." }],
    Finance: [{ t: "Budget tip", b: "Save 20% of monthly income before spending." }, { t: "Inflation", b: "Lock in fixed deposit rates this quarter." }, { t: "Investing", b: "Diversify across DSE blue-chips." }],
  };
  const list = items[cat] || items.Hadith;
  const cur = list[idx % list.length];
  const isBookmarked = bookmarked.includes(`${cat}-${idx}`);
  const toggleBM = () => setBookmarked((p) => p.includes(`${cat}-${idx}`) ? p.filter((x) => x !== `${cat}-${idx}`) : [...p, `${cat}-${idx}`]);

  return (
    <>
      <PhoneFrame label={T(language, "Splash", "স্প্ল্যাশ")}>
        <div className="flex-1 flex flex-col items-center justify-center text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${primary} 0%, #064e3b 100%)` }}>
          <div className="text-5xl mb-3">{icon}</div>
          <div className="font-bold text-lg">{appName}</div>
          <div className="text-[10px] opacity-70 mt-1">{tagline}</div>
        </div>
      </PhoneFrame>

      <PhoneFrame label={T(language, "Today", "আজ")}>
        <StatusBar color={primary} />
        <div className="px-4 py-2.5 flex items-center justify-between text-white" style={{ background: primary }}>
          <span className="font-bold text-sm">{appName}</span>
          <span className="text-[9px] opacity-80">{cat}</span>
        </div>
        <div className="flex-1 p-3 flex flex-col bg-slate-50">
          <div className="flex-1 rounded-2xl p-4 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${primary} 0%, ${primary}aa 100%)` }}>
            <div className="text-[9px] uppercase tracking-widest opacity-80 mb-2">{cat}</div>
            <div className="font-bold text-base">{cur.t}</div>
            <div className="text-xs mt-2 leading-relaxed">{cur.b}</div>
            <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-1">
              {list.map((_, i) => <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === idx % list.length ? "bg-white" : "bg-white/30"}`}></span>)}
            </div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <button data-testid="and-content-prev" onClick={() => setIdx((p) => (p - 1 + list.length) % list.length)} className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm">‹</button>
            <div className="flex gap-2">
              <button data-testid="and-content-bookmark" onClick={toggleBM} className={`w-9 h-9 rounded-full shadow-sm flex items-center justify-center ${isBookmarked ? "text-white" : "bg-white border border-slate-200"}`} style={isBookmarked ? { background: primary } : {}}>{isBookmarked ? "♥" : "♡"}</button>
              <button data-testid="and-content-share" className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm">📤</button>
            </div>
            <button data-testid="and-content-next" onClick={() => setIdx((p) => (p + 1) % list.length)} className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm">›</button>
          </div>
        </div>
      </PhoneFrame>

      <PhoneFrame label={T(language, "Categories", "ক্যাটাগরি")}>
        <StatusBar color={primary} />
        <div className="px-4 py-2.5 text-white" style={{ background: primary }}>
          <div className="font-bold text-sm">{T(language, "Categories", "ক্যাটাগরি")}</div>
        </div>
        <div className="flex-1 p-3 grid grid-cols-2 gap-2 bg-slate-50">
          {Object.keys(items).map((c) => (
            <button key={c} data-testid={`and-content-cat-${c.toLowerCase()}`} onClick={() => { setCat(c); setIdx(0); }} className={`rounded-lg p-3 text-xs font-bold border ${cat === c ? "text-white border-transparent" : "bg-white border-slate-200 text-slate-700"}`} style={cat === c ? { background: primary } : {}}>
              {c}
            </button>
          ))}
        </div>
      </PhoneFrame>
    </>
  );
};

// ============= 3. USSD WALLET (and-wallet) =============
const WalletAppPreview = ({ appName, primary, icon, language }) => {
  const [flipped, setFlipped] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const tx = [
    { t: "Mobile data 1GB", a: -99, when: "Today, 9:14am" },
    { t: "Recharge bKash", a: 200, when: "Yesterday" },
    { t: "Bundle 60min+1GB", a: -149, when: "2 days ago" },
    { t: "Recharge", a: 500, when: "5 days ago" },
    { t: "Internet pack 5GB", a: -299, when: "Last week" },
  ];
  const shown = showAll ? tx : tx.slice(0, 3);
  return (
    <>
      <PhoneFrame label={T(language, "Splash", "স্প্ল্যাশ")}>
        <div className="flex-1 flex flex-col items-center justify-center" style={{ background: `linear-gradient(135deg, ${primary} 0%, #082f49 100%)` }}>
          <div className="text-5xl text-white mb-3">{icon}</div>
          <div className="font-bold text-white">{appName}</div>
        </div>
      </PhoneFrame>
      <PhoneFrame label={T(language, "Dashboard", "ড্যাশবোর্ড")}>
        <StatusBar color={primary} />
        <div className="px-4 py-2.5 text-white" style={{ background: primary }}>
          <div className="text-xs opacity-80">{T(language, "Welcome back", "স্বাগতম")}</div>
          <div className="font-bold text-sm">+880 17XX-345671</div>
        </div>
        <div className="p-3 bg-slate-50 flex-1">
          <button data-testid="and-wallet-flip" onClick={() => setFlipped(!flipped)} className="w-full text-left text-white rounded-xl p-4 shadow-md transition-transform" style={{ background: `linear-gradient(135deg, ${primary} 0%, #0c4a6e 100%)`, transform: flipped ? "rotateY(2deg)" : "rotateY(0)" }}>
            <div className="text-[9px] uppercase tracking-widest opacity-70">{flipped ? T(language, "USSD Code", "USSD কোড") : T(language, "Main Balance", "মূল ব্যালেন্স")}</div>
            <div className="text-2xl font-bold mt-1 font-mono">{flipped ? "*222#" : "৳ 142.30"}</div>
            <div className="text-[10px] opacity-80 mt-1">{flipped ? T(language, "Dial to check on phone", "ফোনে চেক করুন") : T(language, "Tap card to flip", "ফ্লিপ করতে ট্যাপ")}</div>
          </button>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { l: T(language, "Recharge", "রিচার্জ"), e: "💸" },
              { l: T(language, "Internet", "ইন্টারনেট"), e: "📶" },
              { l: T(language, "Bundle", "বান্ডেল"), e: "📦" },
            ].map((b) => (
              <button key={b.l} className="bg-white border border-slate-200 rounded-lg p-2 text-center">
                <div className="text-lg">{b.e}</div>
                <div className="text-[9px] font-semibold mt-0.5">{b.l}</div>
              </button>
            ))}
          </div>
        </div>
      </PhoneFrame>
      <PhoneFrame label={T(language, "History", "ইতিহাস")}>
        <StatusBar color={primary} />
        <div className="px-4 py-2.5 text-white" style={{ background: primary }}>
          <div className="font-bold text-sm">{T(language, "Transactions", "লেনদেন")}</div>
        </div>
        <div className="flex-1 p-2 overflow-y-auto bg-white">
          {shown.map((t, i) => (
            <div key={i} className="border-b border-slate-100 px-2 py-2 flex justify-between items-center">
              <div>
                <div className="text-[11px] font-semibold">{t.t}</div>
                <div className="text-[9px] text-slate-500">{t.when}</div>
              </div>
              <div className={`text-xs font-bold ${t.a > 0 ? "text-emerald-600" : "text-rose-600"}`}>{t.a > 0 ? "+" : ""}৳ {t.a}</div>
            </div>
          ))}
          <button data-testid="and-wallet-toggle-all" onClick={() => setShowAll(!showAll)} className="w-full text-xs font-semibold py-2 mt-2" style={{ color: primary }}>
            {showAll ? T(language, "Show less", "কম দেখুন") : T(language, "Show all", "সব দেখুন")}
          </button>
        </div>
      </PhoneFrame>
    </>
  );
};

// ============= 4. OTP AUTH (and-otp) =============
const OtpAppPreview = ({ appName, primary, icon, language }) => {
  const [phone, setPhone] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (verified || seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, verified]);

  const onDigit = (i, v) => {
    const next = [...digits];
    next[i] = v.replace(/\D/g, "").slice(-1);
    setDigits(next);
    if (next.every((d) => d.length > 0)) setVerified(true);
  };

  return (
    <>
      <PhoneFrame label={T(language, "Splash", "স্প্ল্যাশ")}>
        <div className="flex-1 flex flex-col items-center justify-center bg-white">
          <div className="w-16 h-16 rounded-2xl text-white text-3xl flex items-center justify-center" style={{ background: primary }}>{icon}</div>
          <div className="font-bold mt-3" style={{ color: primary }}>{appName}</div>
          <div className="text-[10px] text-slate-400 mt-1">{T(language, "Secure OTP authentication", "নিরাপদ OTP")}</div>
        </div>
      </PhoneFrame>
      <PhoneFrame label={T(language, "Phone Entry", "নম্বর")}>
        <StatusBar color="white" light={false} />
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="font-bold text-sm">{T(language, "Sign in", "সাইন ইন")}</div>
        </div>
        <div className="flex-1 p-4 flex flex-col">
          <label className="text-[11px] text-slate-500">{T(language, "Mobile number", "মোবাইল নম্বর")}</label>
          <div className="flex items-center gap-1 mt-1">
            <span className="font-mono bg-slate-100 px-2 py-2 rounded-md text-xs">+880</span>
            <input data-testid="and-otp-phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="01XXXXXXXXX" className="flex-1 border border-slate-200 rounded-md px-3 py-2 text-xs font-mono" />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{T(language, "Format: 01XXXXXXXXX", "ফরম্যাট: 01XXXXXXXXX")}</div>
          <button data-testid="and-otp-send" disabled={phone.length < 10} className="mt-auto text-white font-semibold text-xs py-2.5 rounded-md disabled:opacity-40" style={{ background: primary }}>
            {T(language, "Send OTP", "OTP পাঠান")}
          </button>
        </div>
      </PhoneFrame>
      <PhoneFrame label={T(language, "Verify OTP", "যাচাই")}>
        <StatusBar color="white" light={false} />
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="font-bold text-sm">{T(language, "Verify OTP", "OTP যাচাই")}</div>
          <div className="text-[10px] text-slate-500">{T(language, "Sent to +880", "প্রেরিত +৮৮০")} {phone || "01XXXXXXXXX"}</div>
        </div>
        <div className="flex-1 p-4">
          {verified ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-2xl text-emerald-600 mb-3">✓</div>
              <div className="font-bold text-sm" style={{ color: primary }}>{T(language, "Verified!", "যাচাই সম্পন্ন!")}</div>
              <div className="text-[10px] text-slate-500 mt-1">{T(language, "Welcome back to", "ফিরে আসায় স্বাগতম")} {appName}</div>
            </div>
          ) : (
            <>
              <div className="flex gap-1.5 justify-center mt-2">
                {digits.map((d, i) => (
                  <input key={i} data-testid={`and-otp-digit-${i}`} value={d} onChange={(e) => onDigit(i, e.target.value)} maxLength={1} className="w-8 h-10 border-2 border-slate-200 rounded-md text-center text-base font-bold font-mono" style={{ borderColor: d ? primary : undefined }} />
                ))}
              </div>
              <div className="text-center mt-3 text-[10px] text-slate-500">
                {seconds > 0 ? T(language, `Resend in ${seconds}s`, `${seconds} সেকেন্ডে আবার`) : <button onClick={() => setSeconds(30)} className="font-semibold" style={{ color: primary }}>{T(language, "Resend", "আবার পাঠান")}</button>}
              </div>
            </>
          )}
        </div>
      </PhoneFrame>
    </>
  );
};

// ============= 5. SUBSCRIPTION STORE (and-store) =============
const StoreAppPreview = ({ appName, primary, icon, language }) => {
  const [tab, setTab] = useState("Featured");
  const [sub, setSub] = useState([]);
  const [openSheet, setOpenSheet] = useState(null);
  const cats = ["Featured", "New", "Popular"];
  const apps = {
    Featured: [
      { id: "wa", n: T(language, "Weather Alerts", "আবহাওয়া"), e: "🌦️", p: "৳ 2/d" },
      { id: "dh", n: T(language, "Daily Hadith", "দৈনিক হাদিস"), e: "📖", p: "৳ 1/d" },
    ],
    New: [
      { id: "fb", n: T(language, "Football Alerts", "ফুটবল"), e: "⚽", p: "৳ 2/d" },
      { id: "mt", n: T(language, "Market Brief", "মার্কেট"), e: "📈", p: "৳ 2/d" },
    ],
    Popular: [
      { id: "cs", n: T(language, "Cricket Live", "ক্রিকেট"), e: "🏏", p: "৳ 3/d" },
      { id: "hp", n: T(language, "Health Plus", "হেলথ"), e: "💚", p: "৳ 2/d" },
    ],
  };
  return (
    <>
      <PhoneFrame label={T(language, "Splash", "স্প্ল্যাশ")}>
        <div className="flex-1 flex flex-col items-center justify-center" style={{ background: `linear-gradient(135deg, ${primary} 0%, #1c1917 100%)` }}>
          <div className="text-5xl text-white mb-3">{icon}</div>
          <div className="font-bold text-white">{appName}</div>
        </div>
      </PhoneFrame>
      <PhoneFrame label={T(language, "Home", "হোম")}>
        <StatusBar color={primary} />
        <div className="px-4 py-2.5 text-white flex justify-between items-center" style={{ background: primary }}>
          <div className="font-bold text-sm">{appName}</div>
          <div className="text-[9px] opacity-80">{sub.length} sub</div>
        </div>
        <div className="px-3 py-2 flex gap-1.5 overflow-x-auto bg-white border-b border-slate-100">
          {cats.map((c) => <button key={c} data-testid={`and-store-tab-${c.toLowerCase()}`} onClick={() => setTab(c)} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${tab === c ? "text-white" : "bg-slate-100 text-slate-600"}`} style={tab === c ? { background: primary } : {}}>{c}</button>)}
        </div>
        <div className="flex-1 overflow-y-auto p-3 bg-slate-50">
          {apps[tab].map((a) => (
            <button key={a.id} data-testid={`and-store-app-${a.id}`} onClick={() => setOpenSheet(a)} className="w-full text-left bg-white border border-slate-200 rounded-xl p-3 mb-2 flex items-center gap-3">
              <div className="text-2xl">{a.e}</div>
              <div className="flex-1">
                <div className="text-xs font-bold">{a.n}</div>
                <div className="text-[10px] text-slate-500">{a.p}</div>
              </div>
              <span className="text-[10px] font-semibold" style={{ color: primary }}>{sub.includes(a.id) ? "✓" : "→"}</span>
            </button>
          ))}
        </div>
      </PhoneFrame>
      <PhoneFrame label={T(language, "Subscribe", "সাবস্ক্রাইব")}>
        <StatusBar color={primary} />
        <div className="px-4 py-2.5 text-white" style={{ background: primary }}>
          <div className="font-bold text-sm">{T(language, "App detail", "অ্যাপ বিস্তারিত")}</div>
        </div>
        <div className="flex-1 bg-slate-50 relative">
          {openSheet ? (
            <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl p-4 shadow-2xl">
              <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-3"></div>
              <div className="text-3xl mb-2">{openSheet.e}</div>
              <div className="font-bold">{openSheet.n}</div>
              <div className="text-[11px] text-slate-500 mb-2">{T(language, "Daily SMS + push alerts.", "দৈনিক SMS + পুশ অ্যালার্ট।")}</div>
              <div className="text-xs font-bold mb-3" style={{ color: primary }}>{openSheet.p}</div>
              {sub.includes(openSheet.id) ? (
                <button data-testid="and-store-unsub" onClick={() => setSub(sub.filter((x) => x !== openSheet.id))} className="w-full text-xs font-semibold py-2 rounded-md bg-emerald-100 text-emerald-700">Subscribed ✓ — Tap to cancel</button>
              ) : (
                <button data-testid="and-store-confirm-sub" onClick={() => { setSub([...sub, openSheet.id]); setOpenSheet({ ...openSheet, _done: true }); }} className="w-full text-white text-xs font-semibold py-2 rounded-md" style={{ background: primary }}>
                  {T(language, "Confirm Subscribe", "সাবস্ক্রিপশন নিশ্চিত")}
                </button>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center px-4">
              <div className="text-[11px] text-slate-500">{T(language, "Tap any app on Home to open detail bottom sheet.", "হোম স্ক্রিনে অ্যাপ ট্যাপ করুন।")}</div>
            </div>
          )}
        </div>
      </PhoneFrame>
    </>
  );
};

// ============= 6. PREMIUM APP (and-premium) =============
const PremiumAppPreview = ({ appName, primary, icon, language }) => {
  const [balance, setBalance] = useState(150);
  const [unlocked, setUnlocked] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const accent = "#f59e0b";
  const items = [
    { id: 1, t: "Chess masterclass", p: 5, e: "♟️" },
    { id: 2, t: "Tafsir audio", p: 7, e: "🕌" },
    { id: 3, t: "Stock pick", p: 10, e: "📈" },
    { id: 4, t: "Pro recipes", p: 6, e: "🍲" },
  ];
  return (
    <>
      <PhoneFrame label={T(language, "Splash", "স্প্ল্যাশ")}>
        <div className="flex-1 flex flex-col items-center justify-center" style={{ background: `linear-gradient(135deg, ${primary} 0%, #18181b 100%)` }}>
          <div className="text-5xl mb-3" style={{ color: accent }}>{icon}</div>
          <div className="font-bold text-white">{appName}</div>
          <div className="text-[10px] mt-1" style={{ color: accent }}>{T(language, "Premium content", "প্রিমিয়াম কন্টেন্ট")}</div>
        </div>
      </PhoneFrame>
      <PhoneFrame label={T(language, "Home", "হোম")}>
        <StatusBar color={primary} />
        <div className="px-4 py-2.5 text-white flex justify-between items-center" style={{ background: primary }}>
          <div className="font-bold text-sm">{appName}</div>
          <div className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded">৳ {balance}</div>
        </div>
        <div className="flex-1 p-2 grid grid-cols-2 gap-2 bg-slate-50">
          {items.map((it) => {
            const ok = unlocked.includes(it.id);
            return (
              <div key={it.id} className="bg-white rounded-lg p-2 relative">
                {!ok && <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm rounded-lg flex items-center justify-center text-xl">🔒</div>}
                <div className="text-xl">{it.e}</div>
                <div className="text-[10px] font-bold mt-1">{it.t}</div>
                <div className="text-[9px] text-slate-500">৳ {it.p}</div>
                <button data-testid={`and-premium-buy-${it.id}`} onClick={() => !ok && setConfirm(it)} className="mt-1 w-full text-[10px] font-semibold py-1 rounded text-white relative z-10" style={{ background: ok ? "#16a34a" : accent }}>{ok ? "✓ Open" : "Unlock"}</button>
              </div>
            );
          })}
        </div>
      </PhoneFrame>
      <PhoneFrame label={T(language, "Wallet", "ওয়ালেট")}>
        <StatusBar color={primary} />
        <div className="px-4 py-2.5 text-white" style={{ background: primary }}>
          <div className="font-bold text-sm">{T(language, "Wallet", "ওয়ালেট")}</div>
        </div>
        <div className="flex-1 p-4 bg-slate-50">
          <div className="rounded-xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${primary} 0%, #44403c 100%)` }}>
            <div className="text-[9px] uppercase tracking-widest opacity-70">{T(language, "Robi balance", "রবি ব্যালেন্স")}</div>
            <div className="text-2xl font-bold mt-1" style={{ color: accent }}>৳ {balance}</div>
            <div className="text-[10px] opacity-80 mt-1">{T(language, "Unlocks", "আনলক")}: {unlocked.length}</div>
          </div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mt-3 mb-1.5">{T(language, "Transactions", "লেনদেন")}</div>
          {unlocked.length === 0 ? (
            <div className="text-[11px] text-slate-500 bg-white rounded-md p-3 text-center">{T(language, "No purchases yet.", "এখনো কোনো ক্রয় নেই।")}</div>
          ) : (
            unlocked.map((id) => {
              const it = items.find((x) => x.id === id);
              return <div key={id} className="bg-white rounded-md p-2 text-[11px] flex justify-between mb-1"><span>{it.t}</span><span className="font-bold text-rose-600">-৳ {it.p}</span></div>;
            })
          )}
        </div>
        {confirm && (
          <div className="absolute inset-0 bg-black/40 flex items-end z-10">
            <div className="bg-white w-full rounded-t-2xl p-4">
              <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-3"></div>
              <div className="font-bold">{T(language, "Confirm unlock", "আনলক নিশ্চিত")}</div>
              <div className="text-[11px] text-slate-500 mb-3">{confirm.t} — ৳ {confirm.p}</div>
              <button data-testid="and-premium-confirm" onClick={() => { setBalance(balance - confirm.p); setUnlocked([...unlocked, confirm.id]); setConfirm(null); }} disabled={balance < confirm.p} className="w-full font-semibold text-xs py-2 rounded-md text-white disabled:opacity-50" style={{ background: primary }}>
                {balance < confirm.p ? T(language, "Insufficient balance", "ব্যালেন্স অপ্রতুল") : T(language, "Pay via CaaS", "CaaS দিয়ে পরিশোধ")}
              </button>
            </div>
          </div>
        )}
      </PhoneFrame>
    </>
  );
};

// ============= 7. SPORTS (and-sports) =============
const SportsAppPreview = ({ appName, primary, icon, language }) => {
  const [openMatch, setOpenMatch] = useState(null);
  const [alerts, setAlerts] = useState({ Cricket: true, Football: true });
  const matches = [
    { id: "m1", sport: "Cricket", teams: ["🇧🇩 BAN", "🇮🇳 IND"], score: "245/4 (40)", live: true },
    { id: "m2", sport: "Football", teams: ["🔴 LIV", "🔵 MCI"], score: "3 - 1", live: true },
    { id: "m3", sport: "Cricket", teams: ["🇵🇰 PAK", "🇦🇫 AFG"], score: "Tomorrow 7pm", live: false },
  ];
  return (
    <>
      <PhoneFrame label={T(language, "Splash", "স্প্ল্যাশ")}>
        <div className="flex-1 flex flex-col items-center justify-center" style={{ background: `linear-gradient(135deg, ${primary} 0%, #052e16 100%)` }}>
          <div className="text-5xl mb-3">{icon}</div>
          <div className="font-bold text-white">{appName}</div>
        </div>
      </PhoneFrame>
      <PhoneFrame label={T(language, "Live", "লাইভ")}>
        <StatusBar color={primary} />
        <div className="px-4 py-2.5 text-white flex justify-between" style={{ background: primary }}>
          <div className="font-bold text-sm">{T(language, "Live Matches", "লাইভ ম্যাচ")}</div>
          <span className="text-[10px] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>LIVE</span>
        </div>
        <div className="flex-1 p-3 bg-slate-50">
          {matches.map((m) => (
            <button key={m.id} data-testid={`and-sports-match-${m.id}`} onClick={() => setOpenMatch(m)} className="w-full text-left bg-white border border-slate-200 rounded-xl p-3 mb-2">
              <div className="flex items-center justify-between text-[10px] text-slate-500"><span>{m.sport}</span>{m.live && <span className="text-rose-600 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-rose-600 animate-pulse"></span>LIVE</span>}</div>
              <div className="flex items-center justify-between mt-1">
                <div className="font-bold text-xs">{m.teams[0]}</div>
                <div className="font-bold text-xs">vs</div>
                <div className="font-bold text-xs">{m.teams[1]}</div>
              </div>
              <div className="text-center text-xs font-bold mt-1" style={{ color: primary }}>{m.score}</div>
            </button>
          ))}
        </div>
      </PhoneFrame>
      <PhoneFrame label={T(language, "Match detail", "ম্যাচ বিস্তারিত")}>
        <StatusBar color={primary} />
        <div className="px-4 py-2.5 text-white" style={{ background: primary }}>
          <div className="font-bold text-sm">{openMatch ? `${openMatch.teams[0]} vs ${openMatch.teams[1]}` : T(language, "Match detail", "ম্যাচ বিস্তারিত")}</div>
        </div>
        <div className="flex-1 p-3 bg-slate-50">
          {openMatch ? (
            <>
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="text-[10px] uppercase tracking-widest text-slate-500">{openMatch.sport}</div>
                <div className="text-2xl font-bold my-2" style={{ color: primary }}>{openMatch.score}</div>
                <div className="text-[11px] text-slate-500">{openMatch.live ? T(language, "In Progress", "চলমান") : T(language, "Scheduled", "নির্ধারিত")}</div>
              </div>
              <div className="bg-white rounded-xl p-3 mt-2">
                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">{T(language, "Alerts", "অ্যালার্ট")}</div>
                {Object.keys(alerts).map((sp) => (
                  <label key={sp} className="flex items-center justify-between py-1.5 text-xs">
                    <span>{sp}</span>
                    <button data-testid={`and-sports-alert-${sp.toLowerCase()}`} onClick={() => setAlerts({ ...alerts, [sp]: !alerts[sp] })} className={`w-9 h-5 rounded-full transition-colors ${alerts[sp] ? "" : "bg-slate-300"}`} style={alerts[sp] ? { background: primary } : {}}>
                      <span className="block w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: alerts[sp] ? "translateX(18px)" : "translateX(2px)", marginTop: 2 }}></span>
                    </button>
                  </label>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-[11px] text-slate-500 mt-6">{T(language, "Tap a match to see details.", "বিস্তারিত দেখতে ম্যাচ ট্যাপ করুন।")}</div>
          )}
        </div>
      </PhoneFrame>
    </>
  );
};

// ============= 8. ISLAMIC (and-islamic) =============
const IslamicAppPreview = ({ appName, primary, icon, language }) => {
  const accent = "#fbbf24";
  const [city, setCity] = useState("Dhaka");
  const [trk, setTrk] = useState({ Fajr: true, Dhuhr: false, Asr: false, Maghrib: false, Isha: false });
  const cities = ["Dhaka", "Chittagong", "Sylhet", "Khulna"];
  return (
    <>
      <PhoneFrame label={T(language, "Splash", "স্প্ল্যাশ")}>
        <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${primary} 0%, #064e3b 100%)` }}>
          <div className="text-5xl mb-3" style={{ color: accent }}>☪</div>
          <div className="font-bold text-white">{appName}</div>
          <div className="text-[10px] mt-1" style={{ color: accent }}>{T(language, "Daily companion", "দৈনিক সঙ্গী")}</div>
        </div>
      </PhoneFrame>
      <PhoneFrame label={T(language, "Home", "হোম")}>
        <StatusBar color={primary} />
        <div className="px-4 py-2.5 text-white flex items-center justify-between" style={{ background: primary }}>
          <div>
            <div className="font-bold text-sm">{appName}</div>
            <div className="text-[9px] opacity-80">{city}</div>
          </div>
          <div className="text-base">{icon}</div>
        </div>
        <div className="flex-1 p-3 overflow-y-auto bg-slate-50">
          <div className="rounded-xl p-3 text-white text-center" style={{ background: `linear-gradient(135deg, ${primary} 0%, #166534 100%)` }}>
            <div className="text-[10px] uppercase tracking-widest opacity-80">{T(language, "Next prayer", "পরবর্তী নামাজ")}</div>
            <div className="text-xl font-bold mt-1" style={{ color: accent }}>Maghrib</div>
            <div className="text-[10px] opacity-90">in 2h 14m · 18:12</div>
          </div>
          <div className="bg-white rounded-xl p-3 mt-3 border border-slate-200">
            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">{T(language, "Hadith of the day", "আজকের হাদিস")}</div>
            <div className="text-[11px] font-arabic text-right leading-relaxed mb-1">إنما الأعمال بالنيات</div>
            <div className="text-[10px] text-slate-700">"{T(language, "Actions are by intentions.", "কর্ম নিয়তের উপর নির্ভরশীল।")}"</div>
          </div>
        </div>
      </PhoneFrame>
      <PhoneFrame label={T(language, "Tracker + Settings", "ট্র্যাকার + সেটিংস")}>
        <StatusBar color={primary} />
        <div className="px-4 py-2.5 text-white" style={{ background: primary }}>
          <div className="font-bold text-sm">{T(language, "Prayer Tracker", "নামাজ ট্র্যাকার")}</div>
        </div>
        <div className="flex-1 p-3 bg-slate-50">
          <div className="bg-white rounded-xl p-3 border border-slate-200">
            {Object.keys(trk).map((p) => (
              <label key={p} className="flex items-center justify-between py-1.5 text-xs cursor-pointer">
                <span>{p}</span>
                <input type="checkbox" data-testid={`and-isl-prayer-${p.toLowerCase()}`} checked={trk[p]} onChange={() => setTrk({ ...trk, [p]: !trk[p] })} className="w-4 h-4 accent-emerald-600" />
              </label>
            ))}
          </div>
          <div className="mt-3 bg-white rounded-xl p-3 border border-slate-200">
            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">{T(language, "City", "শহর")}</div>
            <div className="flex gap-1.5 flex-wrap">
              {cities.map((c) => <button key={c} data-testid={`and-isl-city-${c.toLowerCase()}`} onClick={() => setCity(c)} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${city === c ? "text-white" : "bg-slate-100 text-slate-700"}`} style={city === c ? { background: primary } : {}}>{c}</button>)}
            </div>
          </div>
        </div>
      </PhoneFrame>
    </>
  );
};

// ============= ROUTER =============
const PREVIEWS = {
  "and-alert": AlertAppPreview,
  "and-content": ContentAppPreview,
  "and-wallet": WalletAppPreview,
  "and-otp": OtpAppPreview,
  "and-store": StoreAppPreview,
  "and-premium": PremiumAppPreview,
  "and-sports": SportsAppPreview,
  "and-islamic": IslamicAppPreview,
};

const OrbitAndroidPreview = ({ templateId, appName = "Orbit App", tagline = "Your tagline", primaryColor = "#2563EB", icon = "🚀", language = "English" }) => {
  const Comp = PREVIEWS[templateId] || AlertAppPreview;
  return (
    <div className="flex flex-wrap items-start justify-center gap-4 py-3">
      <Comp appName={appName} tagline={tagline} primary={primaryColor} icon={icon} language={language} />
    </div>
  );
};

export default OrbitAndroidPreview;
