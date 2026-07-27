import React, { useMemo, useState } from "react";

/* ============================================================================
 * NewsNow BD — Premium NYT-inspired News Preview
 * Single Source of Truth — used by:
 *   - UniversalWebPreview (web-newsnow)
 *   - Pro builder (pro-newsnow, via WebPreviews adapter)
 *   - /apps/newsnow live app (chromeless prop)
 *
 * Visual language: Newspaper serif headlines + clean sans body, charcoal/cream
 * palette with a single saturated accent (driven by cfg.primary). Multi-column
 * editorial grid, breaking ticker, trending sidebar, editor's picks, ads.
 *
 * Journey: Landing → (Optional) OTP Subscribe → Browse Home → Category → Article
 * ========================================================================= */

const SERIF = '"Playfair Display","DM Serif Display","Tiro Bangla",Georgia,serif';
const SANS = '"Inter","Hind Siliguri",system-ui,sans-serif';

const T = (lang, en, bn) => (lang === "Bengali" ? bn : en);

// Default seeds when CMS content is empty
const FALLBACK_ARTICLES = [
  { id: "fa1", title: "Bangladesh Economy Grows 6.5% in Q4 — GDP Report 2026", subtitle: "Strong garment exports, remittance inflows lead growth", summary: "Bangladesh's economy expanded by 6.5% in the fourth quarter, exceeding analyst expectations.", content: "Bangladesh's economy expanded by 6.5% in the fourth quarter of 2025-26, exceeding analyst expectations of 5.8%. The growth was driven by a 12% jump in garment exports and an 18% increase in remittance inflows.\n\nFinance Minister highlighted the Robi-backed digital service economy as a 'major contributor' to the growth.\n\nInflation has eased to 6.1%, well within the target band. Analysts now expect another rate cut at the next monetary policy committee meeting.", author: "Mehedi Hassan", publishDate: "2026-02-14", featuredImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1000&q=80", category: "Business", readTime: 5, featured: true, trending: true },
  { id: "fa2", title: "Metro Rail Extension to Gazipur Inaugurated", subtitle: "Cuts commute times by half for 4M daily commuters", summary: "The PM inaugurated the metro rail extension from Uttara to Gazipur.", content: "The Prime Minister has officially inaugurated the metro rail extension from Uttara to Gazipur, cutting commute times by half for the 4 million daily commuters. The new 22km stretch features 8 stations.", author: "BSS", publishDate: "2026-02-14", featuredImage: "https://images.unsplash.com/photo-1581262208435-41726149a759?w=1000&q=80", category: "Politics", readTime: 3, featured: true, trending: true },
  { id: "fa3", title: "Bangladesh Wins Asia Cup Series Against Pakistan", subtitle: "Shakib named Player of the Series in 2-1 victory", summary: "Bangladesh clinched a thrilling 2-1 series victory.", content: "Bangladesh clinched a thrilling 2-1 series victory against Pakistan in the Asia Cup ODI series. Shakib Al Hasan was named player of the series.", author: "T Sports", publishDate: "2026-02-13", featuredImage: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1000&q=80", category: "Sports", readTime: 2, featured: false, trending: true },
  { id: "fa4", title: "Orbit Reaches 10 Million Developer Downloads", subtitle: "Platform now hosts 5,000+ active developer apps", summary: "Robi's Orbit platform crossed 10 million downloads.", content: "Robi's Orbit platform crossed 10 million downloads across its developer-built apps. The platform now hosts over 5,000 active apps from 1,200+ Bangladeshi developers.", author: "Tech Desk", publishDate: "2026-02-14", featuredImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1000&q=80", category: "Technology", readTime: 3, featured: true, trending: false },
  { id: "fa5", title: "DSE Index Rises 2.4% on Banking Sector Strength", subtitle: "Main index closes at 6,310 led by banks and pharma", summary: "The DSE main index closed at 6,310, up 2.4%.", content: "The DSE main index closed at 6,310, up 2.4% led by banking and pharma stocks. Daily turnover crossed BDT 12 billion.", author: "Business Desk", publishDate: "2026-02-14", featuredImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1000&q=80", category: "Business", readTime: 3, featured: false, trending: false },
  { id: "fa6", title: "Shakib Al Hasan Retires from T20 Internationals", subtitle: "End of an era after 17 years", summary: "Shakib Al Hasan announced his retirement from T20I cricket.", content: "Shakib Al Hasan announced his retirement from T20I cricket after 17 years. He thanked fans at a press conference held at the BCB head office.", author: "Sports Desk", publishDate: "2026-02-14", featuredImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1000&q=80", category: "Sports", readTime: 2, featured: true, trending: true },
  { id: "fa7", title: "UN Climate Summit: Bangladesh Secures $500M Fund", subtitle: "Climate adaptation funding announced at COP", summary: "Bangladesh secured USD 500 million in climate adaptation funding.", content: "Bangladesh secured USD 500 million in climate adaptation funding at the UN COP summit. The fund will support coastal embankment projects.", author: "International Desk", publishDate: "2026-02-13", featuredImage: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=1000&q=80", category: "International", readTime: 4, featured: false, trending: false },
  { id: "fa8", title: "Robi Launches 5G Pilot in Gulshan", subtitle: "Speeds exceed 1Gbps in initial trials", summary: "Robi has begun 5G trials in select areas of Dhaka.", content: "Robi has begun 5G trials in select areas of Dhaka, with speeds exceeding 1Gbps in initial tests. Commercial rollout is expected by Q3 2026.", author: "Robi Newsroom", publishDate: "2026-02-12", featuredImage: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1000&q=80", category: "Technology", readTime: 3, featured: false, trending: true },
];

const FALLBACK_CATEGORIES = [
  { id: "fc1", name: "Politics", slug: "politics", color: "#dc2626" },
  { id: "fc2", name: "Sports", slug: "sports", color: "#16a34a" },
  { id: "fc3", name: "Business", slug: "business", color: "#d97706" },
  { id: "fc4", name: "Technology", slug: "technology", color: "#2563eb" },
  { id: "fc5", name: "Entertainment", slug: "entertainment", color: "#9333ea" },
  { id: "fc6", name: "International", slug: "international", color: "#0891b2" },
  { id: "fc7", name: "Lifestyle", slug: "lifestyle", color: "#db2777" },
];

const FALLBACK_BANNER = {
  headline: "Bangladesh Economy Grows 6.5% in Q4 — GDP Report 2026",
  subhead: "Finance Minister credits digital service economy as a 'major contributor' to growth.",
  featuredImage: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1200&q=80",
  breakingBadge: true,
};

const FALLBACK_TRENDING = [
  { id: "ft1", headline: "Shakib Al Hasan retires from T20Is", priority: 1 },
  { id: "ft2", headline: "GDP grows 6.5% in Q4", priority: 2 },
  { id: "ft3", headline: "Gazipur metro line opens", priority: 3 },
  { id: "ft4", headline: "Robi 5G pilot in Gulshan", priority: 4 },
  { id: "ft5", headline: "Asia Cup: Bangladesh beats Pakistan", priority: 5 },
];

const FALLBACK_PICKS = [
  { id: "fp1", articleTitle: "Bangladesh Economy Grows 6.5% in Q4 — GDP Report 2026", note: "Most important read of the week" },
  { id: "fp2", articleTitle: "Shakib Al Hasan Retires from T20 Internationals", note: "End of an era" },
];

/* ---------- Helpers ---------- */
const fmtDate = (d) => {
  try {
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return d; }
};

const colorFor = (cat, categories) => (categories.find((c) => c.name === cat)?.color) || "#dc2626";

/* ---------- Building blocks ---------- */
const CategoryPill = ({ cat, categories, onClick, active }) => (
  <button
    onClick={onClick}
    data-testid={`news-cat-pill-${(cat || "").toLowerCase()}`}
    className={`text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-sm transition-all ${active ? "text-white shadow-sm" : "hover:opacity-80"}`}
    style={active ? { background: colorFor(cat, categories), color: "white" } : { color: colorFor(cat, categories), background: `${colorFor(cat, categories)}14` }}
  >
    {cat}
  </button>
);

const BreakingTicker = ({ items, accent }) => (
  <div className="text-white text-[11px] py-1.5 overflow-hidden whitespace-nowrap relative" style={{ background: accent }}>
    <div className="inline-block animate-marquee font-semibold">
      <span className="font-black mr-2">🔴 LIVE</span>
      {items.map((t, i) => <span key={i} className="mx-4">{typeof t === "string" ? t : t.headline}</span>)}
      {items.map((t, i) => <span key={`d${i}`} className="mx-4">{typeof t === "string" ? t : t.headline}</span>)}
    </div>
    <style>{`@keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } } .animate-marquee { animation: marquee 50s linear infinite; }`}</style>
  </div>
);

const Masthead = ({ appName, primary, language, onCategoryClick, activeCat, categories, onLogin, isLoggedIn }) => (
  <header className="border-b-2" style={{ borderColor: "#111827", fontFamily: SANS }}>
    <div className="max-w-6xl mx-auto px-5 pt-3 pb-2 flex items-center justify-between text-[10px] uppercase tracking-widest">
      <span className="text-slate-500">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
      <span className="text-slate-500">{T(language, "Today's Paper", "আজকের পত্রিকা")}</span>
      <button onClick={onLogin} data-testid="news-login-btn" className="text-white px-3 py-1 rounded-sm font-bold" style={{ background: "#111827" }}>{isLoggedIn ? T(language, "Subscribed ✓", "সাবস্ক্রাইবড ✓") : T(language, "Subscribe", "সাবস্ক্রাইব")}</button>
    </div>
    <div className="max-w-6xl mx-auto px-5 py-2 text-center" data-testid="news-masthead">
      <h1 className="font-black tracking-tight" style={{ fontFamily: SERIF, fontSize: "clamp(28px, 4vw, 44px)", color: "#111827", letterSpacing: "-0.5px" }}>{appName}</h1>
      <div className="text-[10px] uppercase tracking-[0.28em] text-slate-500 mt-1">{T(language, "Bangladesh's Independent Daily", "বাংলাদেশের স্বাধীন দৈনিক")}</div>
    </div>
    <nav className="border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-5 py-1.5 flex items-center gap-1 overflow-x-auto">
        <button onClick={() => onCategoryClick(null)} className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm whitespace-nowrap ${activeCat === null ? "text-white" : "hover:bg-slate-100"}`} style={activeCat === null ? { background: primary } : {}}>{T(language, "Home", "প্রচ্ছদ")}</button>
        {categories.map((c) => (
          <button key={c.id} data-testid={`news-nav-${c.slug || c.name.toLowerCase()}`} onClick={() => onCategoryClick(c.name)} className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm whitespace-nowrap ${activeCat === c.name ? "text-white" : "hover:bg-slate-100"}`} style={activeCat === c.name ? { background: c.color || primary } : { color: "#111827" }}>{c.name}</button>
        ))}
      </div>
    </nav>
  </header>
);

const HeroArticle = ({ article, onOpen, language, categories }) => (
  <button onClick={() => onOpen(article)} data-testid="news-hero-article" className="block text-left w-full group">
    <div className="grid md:grid-cols-2 gap-5 items-start">
      <div className="rounded-sm overflow-hidden bg-slate-200 aspect-[16/10]" style={{ background: article.featuredImage ? `url(${article.featuredImage}) center/cover` : `linear-gradient(135deg,#0f172a,#475569)` }} />
      <div>
        <CategoryPill cat={article.category} categories={categories} active />
        <h2 className="mt-2 font-black leading-[1.1] group-hover:underline" style={{ fontFamily: SERIF, fontSize: "clamp(24px, 3.4vw, 38px)", color: "#111827" }}>{article.title}</h2>
        {article.subtitle && <p className="mt-2 text-slate-600 text-[15px] leading-snug" style={{ fontFamily: SERIF }}>{article.subtitle}</p>}
        <p className="mt-3 text-slate-500 text-sm line-clamp-3">{article.summary}</p>
        <div className="mt-3 text-[11px] text-slate-500 uppercase tracking-wider">
          <span className="font-bold text-slate-800">{article.author}</span> · {article.readTime || 3} {T(language, "min read", "মিনিট")}
        </div>
      </div>
    </div>
  </button>
);

const ArticleCard = ({ a, onOpen, categories, size = "md" }) => (
  <button onClick={() => onOpen(a)} data-testid={`news-article-card-${a.id}`} className="text-left group w-full">
    <div className={`rounded-sm overflow-hidden bg-slate-200 ${size === "sm" ? "aspect-[16/9]" : "aspect-[4/3]"}`} style={{ background: a.featuredImage ? `url(${a.featuredImage}) center/cover` : `linear-gradient(135deg,#475569,#94a3b8)` }} />
    <div className="pt-2">
      <CategoryPill cat={a.category} categories={categories} />
      <h3 className={`mt-1 font-bold leading-tight group-hover:underline ${size === "sm" ? "text-[14px]" : "text-[16px]"}`} style={{ fontFamily: SERIF, color: "#111827" }}>{a.title}</h3>
      <div className="mt-1 text-[11px] text-slate-500">{a.author} · {fmtDate(a.publishDate)}</div>
    </div>
  </button>
);

const SidebarTrending = ({ items, onSelect, articles, language }) => (
  <div className="border-t-4 border-slate-900 pt-3 pb-2" data-testid="news-trending-sidebar">
    <h3 className="font-black text-xs uppercase tracking-[0.18em] mb-3" style={{ fontFamily: SANS }}>{T(language, "Most Read", "সর্বাধিক পঠিত")}</h3>
    <ol className="space-y-3">
      {items.slice(0, 6).map((t, i) => {
        const match = articles.find((a) => a.title === t.headline) || null;
        return (
          <li key={t.id || i} className="grid grid-cols-[24px_1fr] gap-2 items-start cursor-pointer hover:opacity-80" onClick={() => match && onSelect(match)} data-testid={`news-trending-${i + 1}`}>
            <span className="text-2xl font-black text-slate-300" style={{ fontFamily: SERIF }}>{i + 1}</span>
            <span className="font-semibold leading-snug text-[13px]" style={{ fontFamily: SERIF, color: "#111827" }}>{t.headline}</span>
          </li>
        );
      })}
    </ol>
  </div>
);

const EditorsPicks = ({ picks, articles, onOpen, language }) => (
  <section className="border-t border-slate-200 pt-6 mt-8" data-testid="news-editors-picks">
    <div className="flex items-end justify-between mb-4">
      <h3 className="font-black text-xl" style={{ fontFamily: SERIF, color: "#111827" }}>★ {T(language, "Editor's Picks", "সম্পাদকের পছন্দ")}</h3>
      <span className="text-[10px] uppercase tracking-widest text-slate-400">{T(language, "Curated by our newsroom", "নিউজরুম কর্তৃক নির্বাচিত")}</span>
    </div>
    <div className="grid md:grid-cols-3 gap-5">
      {picks.slice(0, 3).map((p) => {
        const a = articles.find((x) => x.title === p.articleTitle) || articles[0];
        if (!a) return null;
        return (
          <div key={p.id} className="border-l-2 pl-3" style={{ borderColor: "#111827" }}>
            <ArticleCard a={a} onOpen={onOpen} categories={[]} size="sm" />
            {p.note && <div className="mt-2 text-[12px] italic text-slate-600" style={{ fontFamily: SERIF }}>"{p.note}"</div>}
          </div>
        );
      })}
    </div>
  </section>
);

const AdSlot = ({ ad }) => (
  <div className="border-2 border-dashed border-slate-300 bg-amber-50/40 p-3 text-center" data-testid={`news-ad-${(ad?.placement || "x").toLowerCase()}`}>
    <div className="text-[9px] uppercase tracking-widest text-amber-700 font-bold">Advertisement</div>
    <div className="text-sm font-bold mt-1 text-slate-700">{ad?.name || "Sponsor"}</div>
    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{ad?.targetUrl}</div>
  </div>
);

/* ---------- Article Detail Screen ---------- */
const ArticleDetail = ({ article, onBack, language, categories, related, onOpen, onBookmark, bookmarked }) => (
  <article className="max-w-3xl mx-auto px-5 py-8" data-testid="news-article-detail">
    <button onClick={onBack} className="text-xs text-slate-500 hover:underline mb-4 font-bold uppercase tracking-wider" data-testid="news-article-back">← {T(language, "Back to front page", "প্রচ্ছদে ফিরে")}</button>
    <CategoryPill cat={article.category} categories={categories} active />
    <h1 className="mt-3 font-black leading-[1.05]" style={{ fontFamily: SERIF, fontSize: "clamp(28px, 4.4vw, 48px)", color: "#111827" }}>{article.title}</h1>
    {article.subtitle && <p className="mt-3 text-slate-600 text-lg leading-snug" style={{ fontFamily: SERIF }}>{article.subtitle}</p>}
    <div className="flex items-center gap-4 mt-5 pb-4 border-b border-slate-200 text-sm text-slate-600">
      <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">{(article.author || "?").charAt(0)}</div>
      <div className="flex-1">
        <div className="font-bold text-slate-900">{article.author}</div>
        <div className="text-[11px] uppercase tracking-wider">{fmtDate(article.publishDate)} · {article.readTime || 4} {T(language, "min read", "মিনিট")}</div>
      </div>
      <button onClick={() => onBookmark(article.id)} data-testid="news-bookmark-toggle" className={`text-xs font-bold px-3 py-1.5 rounded-full border ${bookmarked ? "bg-amber-100 border-amber-400 text-amber-700" : "border-slate-300 hover:bg-slate-50"}`}>{bookmarked ? "★ Saved" : "☆ Save"}</button>
      <button data-testid="news-share-btn" className="text-xs font-bold px-3 py-1.5 rounded-full border border-slate-300 hover:bg-slate-50">Share</button>
    </div>
    {article.featuredImage && (
      <figure className="my-6">
        <img src={article.featuredImage} alt={article.title} className="w-full rounded-sm" style={{ maxHeight: 420, objectFit: "cover" }} />
        <figcaption className="text-[11px] text-slate-500 mt-1 italic">{T(language, "Photo: NewsNow BD archive", "ছবি: নিউজনাউ আর্কাইভ")}</figcaption>
      </figure>
    )}
    <div className="prose prose-lg max-w-none text-slate-800 leading-relaxed whitespace-pre-line" style={{ fontFamily: SERIF, fontSize: "18px", lineHeight: 1.65 }}>
      {article.content || article.summary}
    </div>
    {related?.length > 0 && (
      <section className="mt-10 border-t-2 pt-5" style={{ borderColor: "#111827" }} data-testid="news-related-section">
        <h3 className="font-black text-lg mb-4" style={{ fontFamily: SERIF }}>{T(language, "Related Stories", "সম্পর্কিত খবর")}</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {related.slice(0, 3).map((r) => <ArticleCard key={r.id} a={r} onOpen={onOpen} categories={categories} size="sm" />)}
        </div>
      </section>
    )}
  </article>
);

/* ---------- Subscribe Modal ---------- */
const SubscribeModal = ({ open, onClose, onPhoneSubmit, onOtpVerify, language, primary }) => {
  const [stage, setStage] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  if (!open) return null;
  const submitPhone = async () => {
    if ((phone || "").replace(/\D/g, "").length < 10) return;
    if (onPhoneSubmit) await onPhoneSubmit(phone);
    setStage("otp");
  };
  const submitOtp = async () => {
    if (otp.length < 4) return;
    if (onOtpVerify) await onOtpVerify(otp);
    onClose();
    setStage("phone"); setPhone(""); setOtp("");
  };
  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" data-testid="news-subscribe-modal">
      <div className="bg-white rounded-sm max-w-md w-full p-6 shadow-2xl border-t-4" style={{ borderColor: primary }}>
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">{T(language, "NewsNow Subscription", "নিউজনাউ সাবস্ক্রিপশন")}</div>
        <h3 className="text-2xl font-black mt-1" style={{ fontFamily: SERIF }}>{T(language, "Stay informed.", "তথ্য পান।")}</h3>
        <p className="text-sm text-slate-600 mt-1">{T(language, "Get breaking news SMS alerts on your Robi mobile. Cancel anytime.", "ব্রেকিং নিউজ SMS পান।")}</p>
        {stage === "phone" ? (
          <>
            <div className="relative mt-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">+88</span>
              <input data-testid="news-phone-input" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} maxLength={11} placeholder="01XXXXXXXXX" className="w-full border-2 border-slate-200 rounded-sm pl-12 pr-3 py-2.5 text-sm font-mono focus:border-slate-900 outline-none" />
            </div>
            <button data-testid="news-send-otp" onClick={submitPhone} className="w-full mt-3 text-white font-bold py-2.5 rounded-sm text-sm uppercase tracking-wider" style={{ background: primary }}>{T(language, "Send OTP", "OTP পাঠান")}</button>
            <button onClick={onClose} className="w-full mt-2 text-xs text-slate-500 hover:underline">{T(language, "Maybe later", "পরে")}</button>
          </>
        ) : (
          <>
            <input data-testid="news-otp-input" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} maxLength={6} placeholder={T(language, "Enter 6-digit OTP", "OTP দিন")} className="w-full mt-4 border-2 border-slate-200 rounded-sm px-3 py-2.5 text-center font-mono text-lg tracking-widest focus:border-slate-900 outline-none" />
            <button data-testid="news-verify-otp" onClick={submitOtp} className="w-full mt-3 text-white font-bold py-2.5 rounded-sm text-sm uppercase tracking-wider" style={{ background: primary }}>{T(language, "Verify & Subscribe", "যাচাই")}</button>
            <button onClick={() => setStage("phone")} className="w-full mt-2 text-xs text-slate-500 hover:underline">{T(language, "Change number", "নাম্বার বদলান")}</button>
          </>
        )}
      </div>
    </div>
  );
};

/* ---------- Main preview ---------- */
export const NewsWebPreview = ({ cfg, content, onPhoneSubmit, onOtpVerify }) => {
  const appName = cfg?.appName || "NewsNow BD";
  const primary = cfg?.primary || "#111827";
  const accent = cfg?.accent || cfg?.secondary || "#dc2626";
  const language = cfg?.language || "English";

  const articles = content?.articles?.length > 0 ? content.articles : FALLBACK_ARTICLES;
  const categories = content?.newsCategories?.length > 0 ? content.newsCategories : FALLBACK_CATEGORIES;
  const banner = content?.newsBanner?.headline ? content.newsBanner : FALLBACK_BANNER;
  const trending = content?.trending?.length > 0 ? content.trending : FALLBACK_TRENDING;
  const picks = content?.editorsPicks?.length > 0 ? content.editorsPicks : FALLBACK_PICKS;
  const ads = content?.ads || [];

  const [view, setView] = useState("home"); // home | article | category
  const [active, setActive] = useState(null);
  const [activeCat, setActiveCat] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [subOpen, setSubOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const heroArticle = useMemo(() => articles.find((a) => a.title === banner.headline) || articles.find((a) => a.featured) || articles[0], [articles, banner]);
  const subFeatured = useMemo(() => articles.filter((a) => a.id !== heroArticle?.id && a.featured).slice(0, 3), [articles, heroArticle]);
  const remaining = useMemo(() => articles.filter((a) => a.id !== heroArticle?.id && !subFeatured.includes(a)), [articles, heroArticle, subFeatured]);

  const openArticle = (a) => { setActive(a); setView("article"); window.scrollTo?.({ top: 0, behavior: "smooth" }); };
  const filteredByCat = (cat) => articles.filter((a) => a.category === cat);
  const toggleBookmark = (id) => setBookmarks((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const related = useMemo(() => active ? articles.filter((a) => a.category === active.category && a.id !== active.id).slice(0, 3) : [], [active, articles]);

  const handleSubscribe = () => setSubOpen(true);
  const onPhoneInternal = async (p) => { if (onPhoneSubmit) await onPhoneSubmit(p); };
  const onOtpInternal = async (o) => { if (onOtpVerify) await onOtpVerify(o); setSubscribed(true); };

  return (
    <div className="bg-[#fdfdfb] min-h-full" style={{ fontFamily: SANS, color: "#111827" }}>
      <BreakingTicker items={trending} accent={accent} />
      <Masthead appName={appName} primary={primary} language={language} onLogin={handleSubscribe} isLoggedIn={subscribed}
        onCategoryClick={(c) => { setActiveCat(c); setView(c ? "category" : "home"); }} activeCat={activeCat} categories={categories} />

      {view === "home" && (
        <div className="max-w-6xl mx-auto px-5 py-8">
          {/* Hero — featured article (driven by banner.headline match) */}
          {heroArticle && <HeroArticle article={heroArticle} onOpen={openArticle} language={language} categories={categories} />}

          {/* 3-column featured row */}
          {subFeatured.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6 mt-8 pt-6 border-t-2" style={{ borderColor: "#111827" }} data-testid="news-featured-row">
              {subFeatured.map((a) => <ArticleCard key={a.id} a={a} onOpen={openArticle} categories={categories} />)}
            </div>
          )}

          {/* Main editorial grid + Sidebar */}
          <div className="grid md:grid-cols-12 gap-6 mt-8">
            <div className="md:col-span-8">
              <h3 className="font-black uppercase tracking-[0.18em] text-xs mb-4 pb-2 border-b border-slate-300">{T(language, "Latest Stories", "সাম্প্রতিক")}</h3>
              <div className="grid sm:grid-cols-2 gap-5">
                {remaining.slice(0, 6).map((a) => <ArticleCard key={a.id} a={a} onOpen={openArticle} categories={categories} size="sm" />)}
              </div>
              {ads[0] && <div className="my-6"><AdSlot ad={ads[0]} /></div>}
            </div>
            <aside className="md:col-span-4 space-y-6">
              <SidebarTrending items={trending} onSelect={openArticle} articles={articles} language={language} />
              {ads[1] && <AdSlot ad={ads[1]} />}
              {!subscribed && (
                <div className="border-l-4 pl-4 py-2" style={{ borderColor: primary }} data-testid="news-side-subscribe">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{T(language, "SMS Alerts", "এসএমএস")}</div>
                  <h4 className="font-black mt-1 leading-tight" style={{ fontFamily: SERIF, fontSize: 20 }}>{T(language, "Never miss breaking news.", "ব্রেকিং নিউজ মিস হবে না।")}</h4>
                  <p className="text-xs text-slate-600 mt-1">{T(language, "Get instant SMS alerts on your Robi mobile.", "Robi-তে SMS পান।")}</p>
                  <button onClick={handleSubscribe} data-testid="news-side-subscribe-btn" className="mt-2 text-[11px] font-bold uppercase tracking-wider underline" style={{ color: primary }}>{T(language, "Subscribe Free →", "ফ্রি সাবস্ক্রাইব →")}</button>
                </div>
              )}
            </aside>
          </div>

          <EditorsPicks picks={picks} articles={articles} onOpen={openArticle} language={language} />
        </div>
      )}

      {view === "category" && activeCat && (
        <div className="max-w-6xl mx-auto px-5 py-8" data-testid={`news-category-page-${activeCat.toLowerCase()}`}>
          <div className="border-b-2 pb-3 mb-6" style={{ borderColor: colorFor(activeCat, categories) }}>
            <CategoryPill cat={activeCat} categories={categories} active />
            <h2 className="mt-2 font-black" style={{ fontFamily: SERIF, fontSize: 36, color: "#111827" }}>{activeCat}</h2>
            <div className="text-xs text-slate-500 uppercase tracking-wider">{filteredByCat(activeCat).length} {T(language, "stories", "খবর")}</div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {filteredByCat(activeCat).map((a) => <ArticleCard key={a.id} a={a} onOpen={openArticle} categories={categories} />)}
          </div>
        </div>
      )}

      {view === "article" && active && (
        <ArticleDetail article={active} onBack={() => setView("home")} language={language} categories={categories} related={related} onOpen={openArticle} onBookmark={toggleBookmark} bookmarked={bookmarks.includes(active.id)} />
      )}

      {/* Footer */}
      <footer className="border-t-2 mt-12 pt-6 pb-8 text-xs text-slate-500" style={{ borderColor: "#111827", fontFamily: SANS }}>
        <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-4 gap-6">
          <div>
            <div className="font-black text-slate-900" style={{ fontFamily: SERIF, fontSize: 18 }}>{appName}</div>
            <div className="mt-1">{T(language, "Bangladesh's Independent Daily.", "বাংলাদেশের স্বাধীন দৈনিক।")}</div>
          </div>
          {[T(language, "News", "সংবাদ"), T(language, "Sections", "বিভাগ"), T(language, "About", "সম্পর্কে")].map((h, i) => (
            <div key={i}>
              <div className="font-bold uppercase tracking-wider text-slate-700">{h}</div>
              <ul className="mt-1 space-y-1">
                {categories.slice(i * 2, i * 2 + 3).map((c) => <li key={c.id} className="hover:underline cursor-pointer">{c.name}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto px-5 mt-6 pt-4 border-t border-slate-200 text-[10px] uppercase tracking-widest">© {new Date().getFullYear()} {appName} · Powered by Orbit</div>
      </footer>

      <SubscribeModal open={subOpen} onClose={() => setSubOpen(false)} onPhoneSubmit={onPhoneInternal} onOtpVerify={onOtpInternal} language={language} primary={primary} />
    </div>
  );
};

export default NewsWebPreview;
