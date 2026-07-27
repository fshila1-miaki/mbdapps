import React, { useEffect, useMemo, useRef, useState } from "react";

/* ============================================================================
 * QuizBD — Premium Quiz Preview (Figma-inspired)
 * Single Source of Truth — used by:
 *   - UniversalWebPreview (web-quizbd)
 *   - Pro builder (pro-quizbd, via WebPreviews adapter)
 *   - /apps/quizbd live app (chromeless prop)
 *
 * Visual language: modern Figma-style — soft purple/indigo background, large
 * rounded cards, generous spacing, big readable type. Vibrant categories with
 * playful emojis but enterprise-grade typography (Inter/Plus Jakarta Sans).
 *
 * Journey: Landing → (Optional OTP) → Home → Quiz List → Question Screen
 *          → Results → Leaderboard → Certificate
 * ========================================================================= */

const SANS = '"Plus Jakarta Sans","Inter","Hind Siliguri",system-ui,sans-serif';
const T = (lang, en, bn) => (lang === "Bengali" ? bn : en);

/* ---------- Default seeds ---------- */
const FALLBACK_DETAILS = {
  title: "Bangladesh Knowledge Master",
  description: "Test your knowledge of Bangladesh — history, sports, culture, and current affairs.",
  coverImage: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1200&q=80",
  category: "General Knowledge",
};

const FALLBACK_CATS = [
  { id: "qc1", name: "Bangladesh GK", icon: "🇧🇩", color: "#16a34a" },
  { id: "qc2", name: "Islam & Religion", icon: "🕌", color: "#0891b2" },
  { id: "qc3", name: "Science & Tech", icon: "🔬", color: "#2563eb" },
  { id: "qc4", name: "Sports", icon: "⚽", color: "#d97706" },
  { id: "qc5", name: "Entertainment", icon: "🎬", color: "#9333ea" },
];

const FALLBACK_QUESTIONS = [
  { id: "q1", text: "What is the national flower of Bangladesh?", type: "multiple-choice", options: ["Water Lily (Shapla)", "Rose", "Lotus", "Orchid"], correct: 0, explanation: "Shapla (Water Lily) is the national flower of Bangladesh.", difficulty: "Easy", category: "Bangladesh GK", points: 10 },
  { id: "q2", text: "How many districts are in Bangladesh?", type: "multiple-choice", options: ["48", "64", "72", "56"], correct: 1, explanation: "Bangladesh has 64 administrative districts across 8 divisions.", difficulty: "Easy", category: "Bangladesh GK", points: 10 },
  { id: "q3", text: "In which year did Bangladesh gain independence?", type: "multiple-choice", options: ["1947", "1970", "1971", "1975"], correct: 2, explanation: "Bangladesh declared independence on March 26, 1971.", difficulty: "Easy", category: "Bangladesh GK", points: 10 },
  { id: "q4", text: "What is the longest river in Bangladesh?", type: "multiple-choice", options: ["Buriganga", "Karnaphuli", "Meghna", "Jamuna"], correct: 3, explanation: "Jamuna is the longest river in Bangladesh.", difficulty: "Medium", category: "Bangladesh GK", points: 15 },
  { id: "q5", text: "How many pillars of Islam are there?", type: "multiple-choice", options: ["3", "4", "5", "6"], correct: 2, explanation: "There are 5 pillars of Islam.", difficulty: "Easy", category: "Islam & Religion", points: 10 },
  { id: "q6", text: "What does CPU stand for?", type: "multiple-choice", options: ["Central Power Unit", "Computer Processing Unit", "Central Processing Unit", "Core Power Unit"], correct: 2, explanation: "CPU = Central Processing Unit.", difficulty: "Easy", category: "Science & Tech", points: 10 },
  { id: "q7", text: "Bangladesh's most capped Test cricketer?", type: "multiple-choice", options: ["Mashrafe Mortaza", "Shakib Al Hasan", "Tamim Iqbal", "Mushfiqur Rahim"], correct: 1, explanation: "Shakib Al Hasan holds the record.", difficulty: "Medium", category: "Sports", points: 15 },
  { id: "q8", text: "Who wrote 'Amar Sonar Bangla'?", type: "multiple-choice", options: ["Rabindranath Tagore", "Kazi Nazrul Islam", "Lalon Shah", "Shyamal Mitra"], correct: 0, explanation: "Rabindranath Tagore wrote the Bangladesh national anthem.", difficulty: "Easy", category: "Entertainment", points: 10 },
];

const FALLBACK_SETTINGS = { timeLimit: 10, passingScore: 60, attemptsAllowed: 3, randomize: true, showExplanations: true };
const FALLBACK_LB_SETTINGS = { enabled: true, rankingRule: "Points + Streak", showWeekly: true, showAllTime: true };
const FALLBACK_CERTS = [
  { id: "c1", name: "Bronze Achiever", template: "minimal-bronze", passingRequirement: 60, color: "#a16207" },
  { id: "c2", name: "Silver Scholar", template: "modern-silver", passingRequirement: 75, color: "#94a3b8" },
  { id: "c3", name: "Gold Master", template: "elegant-gold", passingRequirement: 90, color: "#eab308" },
];

const LEADERBOARD = [
  { rank: 1, name: "Karim Ahmed", district: "Dhaka", pts: 4280, streak: 22 },
  { rank: 2, name: "Nusrat Jahan", district: "Sylhet", pts: 3940, streak: 18 },
  { rank: 3, name: "You", district: "Dhaka", pts: 840, streak: 7, me: true },
  { rank: 4, name: "Sadia Islam", district: "Chittagong", pts: 720, streak: 12 },
  { rank: 5, name: "Md. Hossain", district: "Khulna", pts: 680, streak: 9 },
  { rank: 6, name: "Tania Begum", district: "Barisal", pts: 620, streak: 6 },
  { rank: 7, name: "Aminul Haque", district: "Rajshahi", pts: 580, streak: 5 },
];

/* ---------- Helpers ---------- */
const normalizeOptions = (q) => {
  if (Array.isArray(q.options)) return q.options;
  if (typeof q.options === "string") return q.options.split(/\n/).filter(Boolean);
  return [];
};

const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/* ---------- Pieces ---------- */
const TopBar = ({ appName, primary, points, streak, onLogo, onProfile, language, registered }) => (
  <header className="sticky top-0 z-20 backdrop-blur bg-white/85 border-b border-slate-200">
    <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
      <button onClick={onLogo} data-testid="quiz-logo" className="flex items-center gap-2">
        <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base shadow-sm" style={{ background: `linear-gradient(135deg, ${primary}, #4338ca)` }}>Q</span>
        <span className="font-black text-base tracking-tight text-slate-900">{appName}</span>
      </button>
      <div className="flex items-center gap-2">
        {registered && (
          <div className="hidden sm:flex items-center gap-3 text-xs font-bold">
            <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">{points} {T(language, "pts", "পয়েন্ট")}</span>
            <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">🔥 {streak}</span>
          </div>
        )}
        <button onClick={onProfile} data-testid="quiz-profile-btn" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold">R</button>
      </div>
    </div>
  </header>
);

const StatChip = ({ label, value, accent }) => (
  <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 flex-1 min-w-[120px] shadow-sm">
    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{label}</div>
    <div className="text-2xl font-black mt-0.5" style={{ color: accent }}>{value}</div>
  </div>
);

const CategoryCard = ({ cat, onStart, language, questionsCount }) => (
  <button data-testid={`quiz-cat-card-${(cat.name || "").toLowerCase().replace(/\s+/g, "-")}`} onClick={() => onStart(cat.name)} className="bg-white rounded-2xl border border-slate-200 p-5 text-left hover:-translate-y-0.5 hover:shadow-lg transition-all group">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${cat.color || "#7c3aed"}22` }}>{cat.icon || "📚"}</div>
    <div className="font-black text-base mt-3 text-slate-900">{cat.name}</div>
    <div className="text-xs text-slate-500 mt-1">{questionsCount} {T(language, "questions", "প্রশ্ন")}</div>
    <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider group-hover:underline" style={{ color: cat.color || "#7c3aed" }}>{T(language, "Play now", "খেলুন")} →</div>
  </button>
);

const LandingScreen = ({ details, primary, onStart, onLoginPhone, onLoginOtp, language }) => {
  const [stage, setStage] = useState("hero"); // hero | phone | otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const handlePhone = async () => {
    if ((phone || "").replace(/\D/g, "").length < 10) return;
    setBusy(true);
    try { if (onLoginPhone) await onLoginPhone(phone); } catch {}
    setBusy(false);
    setStage("otp");
  };
  const handleOtp = async () => {
    if (otp.length < 4) return;
    // Optimistically advance to home so the user never sees a stuck screen
    // while the OrbitAPI chain (verifyOTP + userSubscription + sendSMS) runs.
    onStart();
    try { if (onLoginOtp) await onLoginOtp(otp); } catch {}
  };
  return (
    <section className="relative overflow-hidden" data-testid="quiz-landing" style={{ background: `linear-gradient(135deg, ${primary}1f, #4338ca1f, #ffffff)` }}>
      <div className="max-w-6xl mx-auto px-5 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-[11px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {T(language, "Live now · 12,840 playing", "এখন লাইভ · ১২,৮৪০")}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] mt-4 tracking-tight text-slate-900">
            {details.title || T(language, "Outsmart your friends.", "বন্ধুদের হারান।")}
          </h1>
          <p className="mt-4 text-base text-slate-600 max-w-md leading-relaxed">{details.description || T(language, "Daily quizzes, real prizes, live leaderboards. Built for Bangladesh.", "প্রতিদিন কুইজ, সত্যিকারের পুরস্কার।")}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
            <div><div className="font-black text-xl text-slate-900">1,84,000+</div><div className="text-[11px] uppercase tracking-wider text-slate-500">{T(language, "Subscribers", "সাবস্ক্রাইবার")}</div></div>
            <div className="w-px h-8 bg-slate-200" />
            <div><div className="font-black text-xl text-slate-900">2M+</div><div className="text-[11px] uppercase tracking-wider text-slate-500">{T(language, "Answered", "উত্তর")}</div></div>
            <div className="w-px h-8 bg-slate-200" />
            <div><div className="font-black text-xl text-slate-900">৳50K</div><div className="text-[11px] uppercase tracking-wider text-slate-500">{T(language, "Monthly Prize", "মাসিক পুরস্কার")}</div></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6">
          {stage === "hero" && (
            <>
              <div className="text-[11px] uppercase tracking-widest font-bold text-slate-500">{T(language, "Start playing in 30 seconds", "৩০ সেকেন্ডে শুরু")}</div>
              <h3 className="font-black text-2xl mt-1 text-slate-900">{T(language, "Free forever.", "চিরদিন ফ্রি।")}</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {[
                  T(language, "100+ Bangla & English quizzes", "১০০+ বাংলা ও ইংরেজি কুইজ"),
                  T(language, "Live leaderboard & streaks", "লাইভ লিডারবোর্ড"),
                  T(language, "Earn certificates & SMS rewards", "সার্টিফিকেট ও পুরস্কার"),
                ].map((f) => <li key={f} className="flex gap-2"><span className="text-emerald-500 font-black">✓</span>{f}</li>)}
              </ul>
              <button data-testid="quiz-cta-start" onClick={() => setStage("phone")} className="w-full mt-5 rounded-2xl py-3.5 text-white font-bold text-sm shadow-md transition-all hover:shadow-lg" style={{ background: `linear-gradient(135deg, ${primary}, #4338ca)` }}>{T(language, "Start playing — Free", "এখনই শুরু — ফ্রি")} →</button>
              <button onClick={onStart} className="w-full mt-2 text-xs text-slate-500 hover:underline">{T(language, "Or browse without signing in", "সাইন-ইন ছাড়া দেখুন")}</button>
            </>
          )}
          {stage === "phone" && (
            <>
              <div className="text-[11px] uppercase tracking-widest font-bold text-slate-500">{T(language, "Quick login", "দ্রুত লগইন")}</div>
              <h3 className="font-black text-xl mt-1 text-slate-900">{T(language, "What's your mobile?", "মোবাইল নাম্বার?")}</h3>
              <div className="relative mt-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">+88</span>
                <input data-testid="quiz-phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} maxLength={11} placeholder="01XXXXXXXXX" className="w-full border-2 border-slate-200 rounded-xl pl-12 pr-3 py-3 text-sm font-mono focus:border-purple-500 outline-none" />
              </div>
              <button data-testid="quiz-send-otp" disabled={busy} onClick={handlePhone} className="w-full mt-3 rounded-2xl py-3 text-white font-bold text-sm disabled:opacity-60 inline-flex items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, ${primary}, #4338ca)` }}>
                {busy && <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />}
                {busy ? T(language, "Sending...", "পাঠানো হচ্ছে...") : T(language, "Send OTP", "OTP পাঠান")}
              </button>
            </>
          )}
          {stage === "otp" && (
            <>
              <div className="text-[11px] uppercase tracking-widest font-bold text-slate-500">{T(language, "Verify mobile", "যাচাই")}</div>
              <h3 className="font-black text-xl mt-1 text-slate-900">{T(language, "Enter the 6-digit OTP", "৬ ডিজিট OTP")}</h3>
              <input data-testid="quiz-otp" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} maxLength={6} placeholder="••••••" className="w-full mt-4 border-2 border-slate-200 rounded-xl px-3 py-3 text-center font-mono text-2xl tracking-[0.5em] focus:border-purple-500 outline-none" />
              <button data-testid="quiz-verify" onClick={handleOtp} className="w-full mt-3 rounded-2xl py-3 text-white font-bold text-sm inline-flex items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, ${primary}, #4338ca)` }}>
                {T(language, "Verify & Play", "যাচাই করে খেলুন")} →
              </button>
              <button onClick={() => setStage("phone")} className="w-full mt-2 text-xs text-slate-500 hover:underline">{T(language, "Resend / change number", "নাম্বার বদলান")}</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

const HomeScreen = ({ details, categories, questions, points, streak, primary, onStart, onLeaderboard, language }) => (
  <main className="max-w-6xl mx-auto px-5 py-8 space-y-8" data-testid="quiz-home">
    {/* Greeting + Stats */}
    <div>
      <div className="text-[11px] uppercase tracking-widest font-bold text-slate-500">{T(language, "Welcome back", "স্বাগতম")}</div>
      <h1 className="text-3xl sm:text-4xl font-black mt-1 tracking-tight">{details.title || "Bangladesh Knowledge Master"}</h1>
      <p className="text-slate-600 mt-1 max-w-2xl">{details.description}</p>
    </div>
    <div className="flex flex-wrap gap-3" data-testid="quiz-stats-strip">
      <StatChip label={T(language, "Points", "পয়েন্ট")} value={points} accent="#7c3aed" />
      <StatChip label={T(language, "Streak", "স্ট্রিক")} value={`🔥 ${streak}`} accent="#ea580c" />
      <StatChip label={T(language, "Rank", "র‍্যাঙ্ক")} value="#247" accent="#0891b2" />
      <StatChip label={T(language, "Quizzes", "কুইজ")} value={categories.length} accent="#16a34a" />
    </div>

    {/* Cover banner */}
    {details.coverImage && (
      <div className="rounded-3xl overflow-hidden h-44 sm:h-52 relative shadow-lg" style={{ background: `url(${details.coverImage}) center/cover` }} data-testid="quiz-cover-banner">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primary}cc, #1e1b4bcc)` }} />
        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
          <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">{details.category || "Featured Quiz"}</div>
          <div className="text-2xl sm:text-3xl font-black mt-1 leading-tight">{details.title}</div>
          <button onClick={() => onStart(categories[0]?.name || "Bangladesh GK")} data-testid="quiz-cover-cta" className="mt-3 self-start bg-white text-purple-700 font-bold rounded-full px-4 py-2 text-xs uppercase tracking-wider">{T(language, "Play now", "এখনই খেলুন")} →</button>
        </div>
      </div>
    )}

    {/* Categories */}
    <section>
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-xl font-black tracking-tight">{T(language, "Pick a category", "ক্যাটাগরি নির্বাচন")}</h2>
        <button onClick={onLeaderboard} data-testid="quiz-see-leaderboard" className="text-xs font-bold uppercase tracking-wider underline text-purple-700">{T(language, "See leaderboard", "লিডারবোর্ড দেখুন")} →</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" data-testid="quiz-cat-grid">
        {categories.map((c) => (
          <CategoryCard key={c.id || c.name} cat={c} onStart={onStart} language={language} questionsCount={questions.filter((q) => (q.category || "").toLowerCase() === c.name.toLowerCase()).length || Math.max(3, Math.floor(questions.length / Math.max(1, categories.length)))} />
        ))}
      </div>
    </section>
  </main>
);

const QuestionScreen = ({ questions, category, timeLimit, settings, onFinish, primary, language }) => {
  const list = useMemo(() => {
    const pool = questions.filter((q) => !category || (q.category || "").toLowerCase() === category.toLowerCase());
    return pool.length > 0 ? pool : questions;
  }, [questions, category]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState((timeLimit || 10) * 60);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timeLeft <= 0) return;
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) onFinish(score, list.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const q = list[idx];
  const opts = normalizeOptions(q);
  const correctIdx = Number(q.correct);

  const pick = (i) => {
    if (reveal) return;
    setSelected(i);
    setReveal(true);
    const isCorrect = i === correctIdx;
    if (isCorrect) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 >= list.length) onFinish(isCorrect ? score + 1 : score, list.length);
      else { setIdx((j) => j + 1); setSelected(null); setReveal(false); }
    }, settings?.showExplanations !== false && q.explanation ? 2200 : 1100);
  };

  return (
    <main className="max-w-2xl mx-auto px-5 py-8" data-testid="quiz-question-screen">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[11px] uppercase tracking-widest font-bold text-slate-500">{category} · {q.difficulty || "Easy"}</div>
        <div className={`text-sm font-mono font-bold ${timeLeft < 60 ? "text-rose-600" : "text-slate-700"}`} data-testid="quiz-timer">⏱ {fmtTime(timeLeft)}</div>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6">
        <div className="text-xs text-slate-500">{T(language, "Question", "প্রশ্ন")} {idx + 1} / {list.length}</div>
        <div className="h-1.5 bg-slate-100 rounded-full mt-1 mb-5 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${((idx + 1) / list.length) * 100}%`, background: `linear-gradient(90deg, ${primary}, #4338ca)` }} />
        </div>
        <h2 className="text-xl sm:text-2xl font-black leading-snug text-slate-900" data-testid="quiz-question-text">{q.text}</h2>
        <div className="mt-5 space-y-2.5">
          {opts.map((opt, i) => {
            const isCorrect = i === correctIdx;
            const isPicked = selected === i;
            let cls = "border-slate-200 hover:border-purple-300 hover:bg-purple-50/40";
            if (reveal && isCorrect) cls = "border-emerald-500 bg-emerald-50 text-emerald-900";
            else if (reveal && isPicked && !isCorrect) cls = "border-rose-500 bg-rose-50 text-rose-900";
            else if (isPicked) cls = "border-purple-500 bg-purple-50";
            return (
              <button key={i} data-testid={`quiz-opt-${i}`} disabled={reveal} onClick={() => pick(i)} className={`w-full text-left border-2 rounded-2xl p-4 flex items-center gap-3 transition-all ${cls}`}>
                <span className="w-8 h-8 rounded-xl border-2 border-current flex items-center justify-center font-black text-sm flex-shrink-0">{String.fromCharCode(65 + i)}</span>
                <span className="flex-1 font-semibold text-sm">{opt}</span>
                {reveal && isCorrect && <span className="text-emerald-600 font-black">✓</span>}
                {reveal && isPicked && !isCorrect && <span className="text-rose-600 font-black">✗</span>}
              </button>
            );
          })}
        </div>
        {reveal && q.explanation && settings?.showExplanations !== false && (
          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600" data-testid="quiz-explanation">
            <b className="text-slate-900">{T(language, "Explanation:", "ব্যাখ্যা:")}</b> {q.explanation}
          </div>
        )}
      </div>
    </main>
  );
};

const ResultsScreen = ({ score, total, points, certificates, settings, primary, onHome, onReplay, onShare, language }) => {
  const pct = total ? Math.round((score / total) * 100) : 0;
  const passed = pct >= (settings?.passingScore ?? 60);
  const earnedCert = certificates.slice().sort((a, b) => b.passingRequirement - a.passingRequirement).find((c) => pct >= c.passingRequirement) || null;
  return (
    <main className="max-w-md mx-auto px-5 py-12 text-center" data-testid="quiz-results">
      <div className="text-6xl mb-3">{passed ? "🎉" : "💪"}</div>
      <h1 className="text-3xl font-black tracking-tight text-slate-900">{passed ? T(language, "Brilliant!", "চমৎকার!") : T(language, "Good try!", "ভাল চেষ্টা!")}</h1>
      <p className="text-slate-600 mt-1">{passed ? T(language, "You crushed it.", "অসাধারণ!") : T(language, "Practice makes perfect.", "অনুশীলনে এগিয়ে যান।")}</p>

      <div className="mt-6 bg-white rounded-3xl border border-slate-200 shadow-xl p-6">
        <div className="text-5xl font-black tracking-tight" style={{ color: primary }}>{score}<span className="text-slate-300 text-2xl">/{total}</span></div>
        <div className="text-xs uppercase tracking-widest text-slate-500 mt-1">{T(language, "Correct answers", "সঠিক উত্তর")}</div>
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 rounded-full px-3 py-1">+{score * 10} {T(language, "points earned", "পয়েন্ট")}</div>
        <div className="text-xs text-slate-500 mt-1">{T(language, "Total", "মোট")}: {points + score * 10} {T(language, "pts", "পয়েন্ট")}</div>
        <div className="text-[11px] text-slate-400 mt-1">{T(language, "Pass mark", "পাশ নম্বর")}: {settings?.passingScore ?? 60}% · {T(language, "You", "তুমি")}: {pct}%</div>
      </div>

      {earnedCert && (
        <div className="mt-5 rounded-3xl p-6 text-left shadow-xl border-2 relative overflow-hidden" style={{ borderColor: earnedCert.color }} data-testid="quiz-certificate">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20" style={{ background: earnedCert.color }} />
          <div className="text-[11px] uppercase tracking-widest font-black" style={{ color: earnedCert.color }}>★ {T(language, "Certificate Earned", "সার্টিফিকেট অর্জিত")}</div>
          <div className="text-2xl font-black mt-1 text-slate-900">{earnedCert.name}</div>
          <div className="text-xs text-slate-500 mt-1">{T(language, "Awarded for scoring", "স্কোর")} {pct}% {T(language, "in", "তে")} Bangladesh Knowledge Master</div>
          <button data-testid="quiz-cert-download" className="mt-3 text-xs font-bold uppercase tracking-wider underline" style={{ color: earnedCert.color }}>{T(language, "Download Certificate", "ডাউনলোড")} ↓</button>
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button onClick={onHome} data-testid="quiz-results-home" className="border-2 border-slate-200 rounded-2xl py-2.5 font-bold text-sm hover:bg-slate-50">{T(language, "Home", "হোম")}</button>
        <button onClick={onReplay} data-testid="quiz-results-replay" className="rounded-2xl py-2.5 font-bold text-sm text-white shadow-md" style={{ background: `linear-gradient(135deg, ${primary}, #4338ca)` }}>{T(language, "Play again", "আবার খেলুন")}</button>
      </div>
      <button onClick={onShare} className="text-xs text-slate-500 hover:underline mt-3" data-testid="quiz-results-share">{T(language, "Share your score", "স্কোর শেয়ার")} ↗</button>
    </main>
  );
};

const LeaderboardScreen = ({ onBack, settings, language }) => (
  <main className="max-w-2xl mx-auto px-5 py-8" data-testid="quiz-leaderboard">
    <button onClick={onBack} className="text-xs text-slate-500 hover:underline mb-3 font-bold uppercase tracking-wider">← {T(language, "Back", "ফিরে")}</button>
    <h1 className="text-3xl font-black tracking-tight">{T(language, "Leaderboard", "লিডারবোর্ড")}</h1>
    <p className="text-slate-500 text-sm mt-1">{settings?.rankingRule || "Points + Streak"}</p>
    <div className="bg-white rounded-3xl border border-slate-200 mt-5 overflow-hidden shadow-sm">
      {LEADERBOARD.map((u) => (
        <div key={u.rank} data-testid={`quiz-leader-${u.rank}`} className={`px-4 py-3.5 flex items-center gap-3 border-b border-slate-100 last:border-b-0 ${u.me ? "bg-purple-50" : ""}`}>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${u.rank === 1 ? "bg-amber-400 text-white" : u.rank === 2 ? "bg-slate-300 text-white" : u.rank === 3 ? "bg-orange-400 text-white" : "bg-slate-100 text-slate-600"}`}>{u.rank}</div>
          <div className="flex-1">
            <div className={`font-bold text-sm ${u.me ? "text-purple-700" : "text-slate-900"}`}>{u.name}{u.me && <span className="ml-1 text-[10px] uppercase font-black tracking-widest text-purple-500">You</span>}</div>
            <div className="text-xs text-slate-500">{u.district}</div>
          </div>
          <div className="text-right">
            <div className="font-black text-sm text-slate-900">{u.pts} pts</div>
            <div className="text-[10px] text-orange-500">🔥 {u.streak}d</div>
          </div>
        </div>
      ))}
    </div>
  </main>
);

/* ---------- Main preview ---------- */
export const QuizWebPreview = ({ cfg, content, onPhoneSubmit, onOtpVerify, onFinish }) => {
  const appName = cfg?.appName || "QuizBD";
  const primary = cfg?.primary || "#7c3aed";
  const language = cfg?.language || "English";

  const details = content?.quizDetails?.title ? content.quizDetails : FALLBACK_DETAILS;
  const categories = content?.quizCategories?.length > 0 ? content.quizCategories : FALLBACK_CATS;
  const questions = content?.questions?.length > 0 ? content.questions : FALLBACK_QUESTIONS;
  const settings = content?.quizSettings?.timeLimit != null ? content.quizSettings : FALLBACK_SETTINGS;
  const lbSettings = content?.leaderboardSettings?.enabled != null ? content.leaderboardSettings : FALLBACK_LB_SETTINGS;
  const certificates = content?.certificates?.length > 0 ? content.certificates : FALLBACK_CERTS;

  const [view, setView] = useState("landing"); // landing | home | quiz | results | leaderboard
  const [registered, setRegistered] = useState(false);
  const [activeCat, setActiveCat] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(questions.length);
  const [points, setPoints] = useState(840);
  const [streak, setStreak] = useState(7);

  const handleStart = (cat) => { setActiveCat(cat); setView("quiz"); };
  const handleFinish = (s, t) => { setScore(s); setTotal(t); setPoints((p) => p + s * 10); setStreak((x) => x + 1); setView("results"); if (onFinish) onFinish({ score: s, total: t, category: activeCat }); };
  const handleLoginPhone = async (p) => { if (onPhoneSubmit) await onPhoneSubmit(p); };
  const handleLoginOtp = async (o) => { if (onOtpVerify) await onOtpVerify(o); setRegistered(true); };

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 to-white" style={{ fontFamily: SANS, color: "#09090B" }}>
      {view !== "landing" && (
        <TopBar appName={appName} primary={primary} points={points} streak={streak} registered={registered} onLogo={() => setView("home")} onProfile={() => setView("leaderboard")} language={language} />
      )}

      {view === "landing" && (
        <LandingScreen details={details} primary={primary} onStart={() => { setRegistered(true); setView("home"); }} onLoginPhone={handleLoginPhone} onLoginOtp={handleLoginOtp} language={language} />
      )}
      {view === "home" && (
        <HomeScreen details={details} categories={categories} questions={questions} points={points} streak={streak} primary={primary} onStart={handleStart} onLeaderboard={() => setView("leaderboard")} language={language} />
      )}
      {view === "quiz" && (
        <QuestionScreen questions={questions} category={activeCat} timeLimit={settings.timeLimit} settings={settings} onFinish={handleFinish} primary={primary} language={language} />
      )}
      {view === "results" && (
        <ResultsScreen score={score} total={total} points={points - score * 10} certificates={certificates} settings={settings} primary={primary} onHome={() => setView("home")} onReplay={() => handleStart(activeCat)} onShare={() => {}} language={language} />
      )}
      {view === "leaderboard" && lbSettings.enabled !== false && (
        <LeaderboardScreen onBack={() => setView("home")} settings={lbSettings} language={language} />
      )}

      <footer className="mt-12 border-t border-slate-200 py-6 text-center text-xs text-slate-500" style={{ fontFamily: SANS }}>
        © {new Date().getFullYear()} {appName} · Powered by Orbit
      </footer>
    </div>
  );
};

export default QuizWebPreview;
