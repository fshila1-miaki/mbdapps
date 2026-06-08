import React, { useEffect, useMemo, useRef, useState } from "react";

/* ============================================================================
 * SathiBD (সাথীBD) Matrimony Portal — Premium Preview
 * Design language mirrors the "Matrimo" theme (rn53themes.net):
 *   Gold (#f6af04) + dark (#222) + white, Playfair Display headings, Poppins body.
 * Single Source of Truth shared by:
 *   - UniversalWebPreview (web-sathibd)   → Step 5 builder live preview
 *   - WebPreviews / Pro builder (pro-sathibd)
 *   - /apps/sathibd public app (thin wrapper adds real BDAppsAPI hooks)
 * Full 6-page journey: Home → All Profiles → Profile Detail → Plans
 *                      → User Dashboard → Register/Login
 * ========================================================================= */

const GOLD = "#f6af04";
const GOLD_DK = "#d99400";
const DARK = "#222222";
const LIGHT = "#f8f8f8";
const BORDER = "#eeeeee";
const GREEN = "#28a745";
const RED = "#dc3545";

const SERIF = '"Playfair Display","Tiro Bangla",Georgia,serif';
const SANS = '"Poppins","Hind Siliguri","Inter",system-ui,sans-serif';

const T = (lang, en, bn) => (lang === "Bengali" ? bn : en);

/* ---------------- Real imagery sources ----------------
 * Faces: randomuser.me (real portraits, gender-matched).
 * Couples / weddings / gallery: curated Unsplash photos. All verified 200 OK.
 * Every <img> degrades gracefully to a warm gradient + silhouette on error. */
const RUF = (n) => `https://randomuser.me/api/portraits/women/${n}.jpg`;
const RUM = (n) => `https://randomuser.me/api/portraits/men/${n}.jpg`;
const UNS = (id, w = 700) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
const WED = {
  hero: "1606216794074-735e91aa2c92",
  register: "1595407753234-0882f1e77954",
  couples: ["1465495976277-4387d4b0b4c6", "1606216794074-735e91aa2c92", "1595407753234-0882f1e77954", "1583939003579-730e3918a45a", "1591604466107-ec97de577aff", "1597157639073-69284dc0fdaf", "1610890716171-6b1bb98ffd09", "1606800052052-a08af7148866"],
  gallery: ["1519225421980-715cb0215aed", "1519741497674-611481863552", "1604004555489-723a93d6ce74", "1460978812857-470ed1c77af0", "1511285560929-80b456fea0bc", "1604608672516-f1b9b1d37076", "1545241047-6083a3684587", "1606216794074-735e91aa2c92", "1595407753234-0882f1e77954", "1465495976277-4387d4b0b4c6"],
  blog: ["1597157639073-69284dc0fdaf", "1519741497674-611481863552", "1604608672516-f1b9b1d37076"],
};

/* ---------------- Default seed data ---------------- */
const PROFILES = [
  { id: "rahima", name: "মিস রাহিমা", nameEn: "Ms. Rahima Akter", gender: "Female", age: 26, height: "155cm", education: "Masters", edu: "Masters — Computer Science, DU", profession: "Software Engineer", city: "Dhaka", religion: "Islam", online: true, plan: "Gold", c1: "#f4c4c4", c2: "#f6af04", father: "Abdul Karim", income: "BDT 35,000", company: "BJIT Ltd", dob: "15 March 1998", weight: "52kg" },
  { id: "nafisa", name: "মিস নাফিসা", nameEn: "Ms. Nafisa Elizabeth", gender: "Female", age: 24, height: "160cm", education: "MBBS", edu: "MBBS — Dhaka Medical College", profession: "Doctor", city: "Chittagong", religion: "Islam", online: false, last: "10 mins", plan: "Platinum", c1: "#c4d7f4", c2: "#7e9cd8", father: "Md. Salim", income: "BDT 60,000", company: "CMCH", dob: "02 Jan 2000", weight: "54kg" },
  { id: "nusrat", name: "মিস নুসরাত", nameEn: "Ms. Nusrat Jahan", gender: "Female", age: 27, height: "158cm", education: "Honors", edu: "Honors — Economics, SUST", profession: "Banker", city: "Sylhet", religion: "Islam", online: true, plan: "Gold", c1: "#e6d3f4", c2: "#a87ed8", father: "Nazrul Islam", income: "BDT 45,000", company: "BRAC Bank", dob: "20 Aug 1997", weight: "53kg" },
  { id: "jannat", name: "মিস জান্নাত", nameEn: "Ms. Jannatul Ferdous", gender: "Female", age: 25, height: "162cm", education: "MBA", edu: "MBA — IBA, DU", profession: "Business Executive", city: "Rajshahi", religion: "Islam", online: false, last: "5 mins", plan: "Free", c1: "#f4dcc4", c2: "#e0a25c", father: "Aminul Haque", income: "BDT 50,000", company: "Unilever BD", dob: "11 Dec 1998", weight: "55kg" },
  { id: "karim", name: "মোঃ করিম", nameEn: "Md. Karim Ahmed", gender: "Male", age: 30, height: "175cm", education: "Engineering", edu: "BSc — Civil Engineering, BUET", profession: "Civil Engineer", city: "Dhaka", religion: "Islam", online: true, plan: "Platinum", c1: "#c4e4f4", c2: "#5ca0d8", father: "Rafiqul Islam", income: "BDT 70,000", company: "ABC Builders", dob: "08 May 1994", weight: "72kg" },
  { id: "tanvir", name: "মোঃ তানভীর", nameEn: "Md. Tanvir Hossain", gender: "Male", age: 29, height: "170cm", education: "MBBS", edu: "MBBS — Khulna Medical College", profession: "Doctor", city: "Khulna", religion: "Islam", online: false, last: "15 mins", plan: "Gold", c1: "#c4f4d9", c2: "#5cc88a", father: "Jalal Uddin", income: "BDT 65,000", company: "Khulna Medical", dob: "19 Feb 1995", weight: "70kg" },
  { id: "rafiq", name: "মোঃ রফিক", nameEn: "Md. Rafiqul Karim", gender: "Male", age: 31, height: "178cm", education: "PhD", edu: "PhD — Physics, RU", profession: "University Professor", city: "Rajshahi", religion: "Islam", online: true, plan: "Free", c1: "#f4c4e4", c2: "#d85ca0", father: "Abdur Rahman", income: "BDT 80,000", company: "Rajshahi University", dob: "30 Sep 1993", weight: "74kg" },
  { id: "jamil", name: "মোঃ জামিল", nameEn: "Md. Jamil Hasan", gender: "Male", age: 33, height: "172cm", education: "MBA", edu: "MBA — North South University", profession: "Business Owner", city: "Dhaka", religion: "Islam", online: false, last: "2 hrs", plan: "Gold", c1: "#d9d3f4", c2: "#8a7ed8", father: "Mokbul Hossain", income: "BDT 1,20,000", company: "Hasan Trading", dob: "25 Jun 1991", weight: "76kg" },
];

const COUPLES = [
  { id: 1, couple: "করিম ও রাহিমা", city: "ঢাকা", c1: "#f6af04", c2: "#e0114a" },
  { id: 2, couple: "তানভীর ও সাদিয়া", city: "চট্টগ্রাম", c1: "#ff7e5f", c2: "#feb47b" },
  { id: 3, couple: "রফিক ও নুসরাত", city: "সিলেট", c1: "#f6af04", c2: "#c79100" },
  { id: 4, couple: "জামিল ও মুনিরা", city: "রাজশাহী", c1: "#a87ed8", c2: "#6a4ea8" },
  { id: 5, couple: "হাসান ও তাহমিনা", city: "খুলনা", c1: "#e0a25c", c2: "#f6af04" },
  { id: 6, couple: "আরিফ ও মারিয়া", city: "বরিশাল", c1: "#ffb88c", c2: "#de6262" },
  { id: 7, couple: "শফিক ও সুমাইয়া", city: "ময়মনসিংহ", c1: "#b39ddb", c2: "#7e57c2" },
  { id: 8, couple: "বাবুল ও রোকেয়া", city: "কুমিল্লা", c1: "#e0114a", c2: "#8e0d36" },
];

const TEAM = [
  { name: "মিসেস নুরজাহান", role: "Senior Matrimony Advisor", letter: "N", c1: "#f4c4c4", c2: "#e0114a" },
  { name: "মোঃ রহমান", role: "Profile Verification Head", letter: "R", c1: "#c4d7f4", c2: "#5ca0d8" },
  { name: "মিসেস পারভীন", role: "Client Relationship Manager", letter: "P", c1: "#e6d3f4", c2: "#a87ed8" },
  { name: "মোঃ করিম", role: "Technology Coordinator", letter: "K", c1: "#c4f4d9", c2: "#28a745" },
];

const TESTIMONIALS = [
  { letter: "S", quote: "SathiBD-তে আমার স্বামীকে পেয়েছি। অসাধারণ সেবা, সত্যিই বিশ্বাসযোগ্য।", name: "Sumaiya Rahman", loc: "Dhaka", c1: "#f6af04", c2: "#e0114a" },
  { letter: "M", quote: "প্রোফাইল যাচাই করা ছিল, তাই বিশ্বাস করতে পেরেছিলাম। ধন্যবাদ SathiBD।", name: "Md. Karim", loc: "Chittagong", c1: "#5ca0d8", c2: "#3a6ea5" },
  { letter: "T", quote: "খুব সহজে সাথী খুঁজে পেয়েছি। সেবা অতুলনীয়।", name: "Tanvir & Sadia", loc: "Sylhet", c1: "#a87ed8", c2: "#6a4ea8" },
  { letter: "R", quote: "OTP যাচাই করা প্রোফাইল দেখে বিশ্বাস বেড়েছে।", name: "Rashida Khanam", loc: "Rajshahi", c1: "#28a745", c2: "#198c38" },
];

const GALLERY = [
  { c1: "#f6af04", c2: "#e0114a" }, { c1: "#ff7e5f", c2: "#feb47b" }, { c1: "#a87ed8", c2: "#6a4ea8" },
  { c1: "#e0a25c", c2: "#f6af04" }, { c1: "#ffb88c", c2: "#de6262" }, { c1: "#b39ddb", c2: "#7e57c2" },
  { c1: "#f4c4c4", c2: "#e0114a" }, { c1: "#c4d7f4", c2: "#5ca0d8" }, { c1: "#c4f4d9", c2: "#28a745" },
  { c1: "#f6af04", c2: "#c79100" },
];

const BLOG = [
  { title: "বিয়ের জন্য সঠিক সাথী কীভাবে বেছে নেবেন?", cat: "Relationship Advice", c1: "#f6af04", c2: "#e0114a" },
  { title: "OTP যাচাই কেন গুরুত্বপূর্ণ? SathiBD কীভাবে কাজ করে?", cat: "Platform Guide", c1: "#5ca0d8", c2: "#3a6ea5" },
  { title: "বিয়ের আমন্ত্রণপত্র ডিজাইনের সেরা ধারণা", cat: "Wedding Planning", c1: "#a87ed8", c2: "#6a4ea8" },
];

const SERVICES = [
  { icon: "👤", title: "Browse Profiles", sub: "৩,২০০+ Verified profiles", to: "profiles" },
  { icon: "💒", title: "Wedding Gallery", sub: "সুন্দর মুহূর্তগুলি দেখুন", to: "home", anchor: "couples" },
  { icon: "🛎", title: "All Services", sub: "সম্পূর্ণ সেবা তালিকা", to: "home", anchor: "services" },
  { icon: "🚀", title: "Join Now", sub: "আজই শুরু করুন", to: "register" },
  { icon: "📸", title: "Photo Gallery", sub: "সেরা মুহূর্তের ছবি", to: "home", anchor: "gallery" },
  { icon: "📰", title: "Blog & Articles", sub: "পরামর্শ ও গল্প", to: "home", anchor: "blog" },
];

const DEFAULT_PLANS = [
  { id: "free", name: "Free", tag: "শুরু করুন বিনামূল্যে", price: "৳0", dark: false, popular: false, feats: [["৫টি প্রিমিয়াম প্রোফাইল দেখুন/মাস", true], ["ফ্রি প্রোফাইল দেখুন", true], ["আগ্রহ পাঠান", true], ["যোগাযোগ তথ্য দেখুন", false], ["চ্যাট শুরু করুন", false]], amount: 0 },
  { id: "gold", name: "Gold", tag: "সেরা মূল্যে সেরা সুবিধা", price: "৳৩৪৯", dark: false, popular: true, feats: [["২০টি প্রিমিয়াম প্রোফাইল/মাস", true], ["সম্পূর্ণ প্রোফাইল দেখুন", true], ["যোগাযোগ তথ্য দেখুন", true], ["আগ্রহ পাঠান + গ্রহণ করুন", true], ["চ্যাট শুরু করুন", true]], amount: 349 },
  { id: "platinum", name: "Platinum", tag: "সর্বোচ্চ সুবিধা", price: "৳৫৪৯", dark: true, popular: false, feats: [["৫০টি প্রিমিয়াম প্রোফাইল/মাস", true], ["সম্পূর্ণ সব সুবিধা", true], ["প্রোফাইল বুস্ট ২×/মাস", true], ["অগ্রাধিকার সাপোর্ট", true], ["বিশেষ ম্যাচমেকিং সেবা", true]], amount: 549 },
];

const INTEREST_REQUESTS = [
  { id: 1, name: "Md. Karim", plan: "Platinum", city: "Dhaka", age: 30, height: "5.7", job: "Civil Engineer", time: "10:30 AM, 18 August 2025", c1: "#c4e4f4", c2: "#5ca0d8" },
  { id: 2, name: "Md. Tanvir", plan: "Gold", city: "Khulna", age: 29, height: "5.6", job: "Doctor", time: "09:15 AM, 18 August 2025", c1: "#c4f4d9", c2: "#28a745" },
  { id: 3, name: "Md. Rafiq", plan: "Free", city: "Rajshahi", age: 31, height: "5.10", job: "Professor", time: "08:40 AM, 18 August 2025", c1: "#f4c4e4", c2: "#d85ca0" },
  { id: 4, name: "Md. Jamil", plan: "Gold", city: "Dhaka", age: 33, height: "5.8", job: "Business Owner", time: "Yesterday, 06:20 PM", c1: "#d9d3f4", c2: "#8a7ed8" },
];

/* Attach real imagery to the seed data (runs once at module load) */
(function attachImages() {
  const fF = [65, 68, 44, 90], fM = [32, 75, 51, 86]; let fi = 0, mi = 0;
  PROFILES.forEach((p) => { p.photo = p.gender === "Female" ? RUF(fF[fi++ % fF.length]) : RUM(fM[mi++ % fM.length]); });
  COUPLES.forEach((c, k) => { c.img = UNS(WED.couples[k % WED.couples.length]); });
  GALLERY.forEach((g, k) => { g.img = UNS(WED.gallery[k % WED.gallery.length]); });
  BLOG.forEach((b, k) => { b.img = UNS(WED.blog[k % WED.blog.length]); });
  const tImg = [RUF(12), RUM(41), RUF(33), RUF(52)]; TESTIMONIALS.forEach((t, k) => { t.photo = tImg[k]; });
  const teamImg = [RUF(26), RUM(45), RUF(63), RUM(55)]; TEAM.forEach((m, k) => { m.photo = teamImg[k]; });
  const reqImg = [RUM(32), RUM(75), RUM(51), RUM(86)]; INTEREST_REQUESTS.forEach((r, k) => { r.photo = reqImg[k]; });
})();


/* ---------------- Hooks & primitives ---------------- */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (seen) return;
    const el = ref.current;
    if (!el) return;
    const fallback = setTimeout(() => setSeen(true), 1400);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); clearTimeout(fallback); } }),
      { threshold }
    );
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, [seen, threshold]);
  return [ref, seen];
}

const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, seen] = useInView();
  return (
    <div ref={ref} className={className} style={{ opacity: seen ? 1 : 0, transform: seen ? "translateY(0)" : "translateY(28px)", transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms` }}>
      {children}
    </div>
  );
};

const Counter = ({ to, prefix = "", suffix = "", duration = 1400 }) => {
  const [ref, seen] = useInView();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!seen) return;
    let raf; const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setVal(Math.round(p * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString("en-IN")}{suffix}</span>;
};

const Avatar = ({ letter, c1, c2, size = 80, ring = true }) => (
  <div className="grid place-items-center font-bold text-white shrink-0" style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(140deg, ${c1}, ${c2})`, border: ring ? `3px solid ${GOLD}` : "none", fontSize: size * 0.4, fontFamily: SERIF }}>{letter}</div>
);

/* Real face portrait with graceful initial-gradient fallback */
const FaceAvatar = ({ src, letter, c1, c2, size = 80, ring = true }) => {
  const [err, setErr] = useState(false);
  if (err || !src) return <Avatar letter={letter} c1={c1} c2={c2} size={size} ring={ring} />;
  return <img src={src} alt={letter || ""} loading="lazy" onError={() => setErr(true)} className="object-cover shrink-0 sb-fadein" style={{ width: size, height: size, borderRadius: "50%", border: ring ? `3px solid ${GOLD}` : "none" }} />;
};

/* Framed photo (real image) with warm-gradient placeholder + silhouette fallback.
 * kenburns = slow zoom loop, zoom = scale on parent hover (group). */
const Photo = ({ src, alt = "", c1 = "#f4c4c4", c2 = "#e0114a", rounded = 16, kenburns = false, zoom = false, label, sub }) => {
  const [err, setErr] = useState(false);
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: rounded, background: `linear-gradient(150deg, ${c1}, ${c2})` }}>
      {!err && src && (
        <img src={src} alt={alt} loading="lazy" onError={() => setErr(true)}
          className={`w-full h-full object-cover sb-fadein ${kenburns ? "sb-kenburns" : ""} ${zoom ? "transition-transform duration-[1200ms] ease-out group-hover:scale-110" : ""}`} />
      )}
      {(err || !src) && (
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax meet" aria-hidden>
          <g opacity="0.9" fill="rgba(255,255,255,0.85)"><circle cx="78" cy="92" r="20" /><path d="M50 200 C50 150 60 128 78 128 C96 128 106 150 106 200 Z" /><circle cx="124" cy="96" r="18" /><path d="M100 200 C100 156 110 138 124 138 C140 138 150 156 150 200 Z" /></g>
        </svg>
      )}
      {label && (
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 text-white" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.62), transparent)" }}>
          <div className="font-bold text-sm" style={{ fontFamily: SERIF }}>{label}</div>
          {sub && <div className="text-[11px] opacity-90">{sub}</div>}
        </div>
      )}
    </div>
  );
};

const Label = ({ children }) => (
  <div className="text-[11px] font-semibold uppercase mb-2" style={{ color: GOLD_DK, letterSpacing: "0.18em" }}>{children}</div>
);
const H2 = ({ children, center }) => (
  <h2 className={`text-3xl md:text-4xl font-bold ${center ? "text-center" : ""}`} style={{ fontFamily: SERIF, color: DARK }}>{children}</h2>
);
const GoldBtn = ({ children, onClick, full, outline, testid, light }) => (
  <button data-testid={testid} onClick={onClick} className={`${full ? "w-full" : ""} inline-flex items-center justify-center gap-2 font-semibold rounded-full px-6 py-2.5 text-sm transition-transform hover:scale-[1.02]`}
    style={outline ? { border: `2px solid ${GOLD}`, color: GOLD_DK, background: light ? "#fff" : "transparent" } : { background: GOLD, color: DARK }}>{children}</button>
);

/* ---------------- Page Loader (3 gold rings) ---------------- */
const Loader = () => (
  <div className="absolute inset-0 z-[60] grid place-items-center bg-white" data-testid="sathibd-loader" style={{ animation: "sb-fadeout 0.5s ease 1.6s forwards" }}>
    <div className="relative" style={{ width: 90, height: 90 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="absolute inset-0 rounded-full" style={{ border: `3px solid ${GOLD}`, borderTopColor: "transparent", animation: `sb-ring 1.2s ease ${i * 0.3}s infinite`, transform: `scale(${1 - i * 0.22})` }} />
      ))}
      <span className="absolute inset-0 grid place-items-center text-2xl">💍</span>
    </div>
  </div>
);

/* ---------------- OTP / Subscription Modal ---------------- */
const SubscribeFlow = ({ plan, lang, onClose, onPhoneSubmit, onOtpVerify, onSubscribe, onDone }) => {
  const [step, setStep] = useState("phone"); // phone, otp, caas, done
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const refs = useRef([]);
  const sendPhone = () => { if (phone.replace(/\D/g, "").length < 10) return; onPhoneSubmit && onPhoneSubmit(phone); setStep("otp"); };
  const verify = () => { onOtpVerify && onOtpVerify(otp.join("")); setStep("caas"); setTimeout(() => { onSubscribe && onSubscribe(plan); setStep("done"); }, 1600); };
  return (
    <div className="absolute inset-0 z-[70] grid place-items-center p-4" style={{ background: "rgba(0,0,0,0.5)" }} data-testid="sathibd-sub-flow">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" style={{ fontFamily: SANS }}>
        <div className="flex items-center justify-between mb-3">
          <div className="font-bold" style={{ fontFamily: SERIF, color: DARK }}>{plan?.name} Plan · {plan?.price}/mo</div>
          <button onClick={onClose} className="text-slate-400 text-xl leading-none" data-testid="sathibd-sub-close">×</button>
        </div>
        {step === "phone" && (
          <div>
            <p className="text-xs text-slate-500 mb-3">{T(lang, "Enter your Robi number to verify via OTP", "OTP যাচাইয়ের জন্য আপনার রবি নম্বর দিন")}</p>
            <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: BORDER }}>
              <span className="px-3 py-2.5 text-sm bg-slate-50 text-slate-500">+880</span>
              <input data-testid="sathibd-sub-phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="1700-000000" className="flex-1 px-3 py-2.5 text-sm outline-none" />
            </div>
            <GoldBtn full testid="sathibd-sub-sendotp" onClick={sendPhone}><span className="mt-2.5 mb-0.5 block">{T(lang, "Send OTP", "OTP পাঠান")}</span></GoldBtn>
          </div>
        )}
        {step === "otp" && (
          <div>
            <p className="text-xs text-slate-500 mb-3">{T(lang, "Enter the 6-digit code (any code works in demo)", "৬-সংখ্যার কোড দিন (ডেমোতে যেকোনো কোড চলবে)")}</p>
            <div className="flex gap-2 justify-center mb-3">
              {otp.map((d, i) => (
                <input key={i} ref={(el) => (refs.current[i] = el)} data-testid={`sathibd-otp-${i}`} value={d} maxLength={1}
                  onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); const n = [...otp]; n[i] = v; setOtp(n); if (v && refs.current[i + 1]) refs.current[i + 1].focus(); }}
                  className="w-10 h-12 text-center text-lg font-bold rounded-lg outline-none" style={{ border: `2px solid ${BORDER}` }} />
              ))}
            </div>
            <div className="rounded-lg p-2.5 text-[11px] mb-3" style={{ background: "#fff8e8", color: GOLD_DK }}>⚡ BDApps OTP API · /otp/request · /otp/verify</div>
            <GoldBtn full testid="sathibd-otp-verify" onClick={verify}><span className="mt-2.5 mb-0.5 block">{T(lang, "Verify & Subscribe", "যাচাই ও সাবস্ক্রাইব")}</span></GoldBtn>
          </div>
        )}
        {step === "caas" && (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto rounded-full border-4 animate-spin" style={{ borderColor: BORDER, borderTopColor: GOLD }} />
            <div className="mt-3 text-sm font-semibold" style={{ color: DARK }}>{T(lang, "Charging via Robi CaaS…", "রবি CaaS দিয়ে চার্জ হচ্ছে…")}</div>
            <div className="text-[11px] text-slate-500 mt-1">queryBalance → directDebit ৳{plan?.amount}</div>
          </div>
        )}
        {step === "done" && (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto rounded-full grid place-items-center text-3xl text-white" style={{ background: GREEN }}>✓</div>
            <div className="mt-3 font-bold text-lg" style={{ fontFamily: SERIF, color: DARK }}>{T(lang, "Subscription Active!", "সাবস্ক্রিপশন সক্রিয়!")}</div>
            <div className="text-xs text-slate-500 mt-1">{T(lang, `${plan?.name} plan activated · ৳${plan?.amount} charged`, `${plan?.name} প্ল্যান চালু · ৳${plan?.amount} কাটা হয়েছে`)}</div>
            <GoldBtn full testid="sathibd-sub-dashboard" onClick={onDone}><span className="mt-2.5 mb-0.5 block">{T(lang, "Go to Dashboard", "ড্যাশবোর্ডে যান")}</span></GoldBtn>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- Send Interest Modal ---------------- */
const InterestModal = ({ profile, lang, onClose, onSend }) => {
  const PERMS = [["About section", true], ["Photo gallery", false], ["Contact info", false], ["Personal info", false], ["Hobbies", false], ["Social media", false]];
  const [perms, setPerms] = useState(PERMS.map((p) => p[1]));
  const [msg, setMsg] = useState("");
  return (
    <div className="absolute inset-0 z-[70] grid place-items-center p-4" style={{ background: "rgba(0,0,0,0.5)" }} data-testid="sathibd-interest-modal">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5" style={{ fontFamily: SANS }}>
        <div className="flex items-center gap-3 mb-3">
          <FaceAvatar src={profile.photo} letter={profile.nameEn.replace(/^(Ms\.|Md\.)\s*/, "")[0]} c1={profile.c1} c2={profile.c2} size={56} />
          <div>
            <div className="font-bold" style={{ color: DARK }}>{T(lang, "Send interest to", "আগ্রহ পাঠান")} {profile.nameEn}</div>
            <div className="text-[11px] text-slate-500">{T(lang, "They will be able to view:", "তারা দেখতে পারবেন:")}</div>
          </div>
        </div>
        <div className="space-y-1.5 mb-3">
          {PERMS.map((p, i) => (
            <label key={p[0]} className="flex items-center gap-2 text-xs cursor-pointer">
              <input type="checkbox" checked={perms[i]} onChange={() => setPerms((a) => a.map((x, j) => (j === i ? !x : x)))} data-testid={`sathibd-perm-${i}`} style={{ accentColor: GOLD }} />
              {p[0]}
            </label>
          ))}
        </div>
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={`${T(lang, "Write a message to", "একটি বার্তা লিখুন")} ${profile.nameEn}...`} className="w-full text-sm rounded-lg p-2.5 outline-none h-20 mb-3" style={{ border: `1px solid ${BORDER}` }} data-testid="sathibd-interest-msg" />
        <div className="flex gap-2">
          <GoldBtn testid="sathibd-interest-send" onClick={() => onSend(profile)}>💌 {T(lang, "Send interest", "আগ্রহ পাঠান")}</GoldBtn>
          <button onClick={onClose} className="text-sm text-slate-500 px-3" data-testid="sathibd-interest-cancel">{T(lang, "Cancel", "বাতিল")}</button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Chat Popup ---------------- */
const ChatPopup = ({ profile, lang, onClose }) => {
  const [msgs, setMsgs] = useState([{ me: false, t: T(lang, "Hi, thanks for your interest!", "হাই, আগ্রহের জন্য ধন্যবাদ!") }]);
  const [text, setText] = useState("");
  const send = () => { if (!text.trim()) return; setMsgs((m) => [...m, { me: true, t: text }]); setText(""); setTimeout(() => setMsgs((m) => [...m, { me: false, t: T(lang, "Nice to meet you 🙂", "আপনার সাথে পরিচিত হয়ে ভালো লাগলো 🙂") }]), 800); };
  return (
    <div className="absolute bottom-4 right-4 z-[65] w-[300px] rounded-2xl shadow-2xl overflow-hidden flex flex-col bg-white" style={{ height: 380, fontFamily: SANS, border: `1px solid ${BORDER}` }} data-testid="sathibd-chat-popup">
      <div className="flex items-center gap-2 px-3 py-2.5" style={{ background: GOLD }}>
        <FaceAvatar src={profile.photo} letter={profile.nameEn.replace(/^(Ms\.|Md\.)\s*/, "")[0]} c1={profile.c1} c2={profile.c2} size={36} ring={false} />
        <div className="flex-1"><div className="text-sm font-bold" style={{ color: DARK }}>{profile.nameEn}</div><div className="text-[10px]" style={{ color: "#5a3e00" }}>🟢 {T(lang, "Available online", "অনলাইন")}</div></div>
        <button onClick={onClose} className="text-xl leading-none" style={{ color: DARK }} data-testid="sathibd-chat-close">×</button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50">
        {msgs.map((m, i) => (
          <div key={i} className={`max-w-[80%] text-xs px-3 py-2 rounded-2xl ${m.me ? "ml-auto text-white" : "bg-white border"}`} style={m.me ? { background: GOLD, color: DARK } : { borderColor: BORDER }}>{m.t}</div>
        ))}
      </div>
      <div className="p-2 flex gap-1.5 border-t" style={{ borderColor: BORDER }}>
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={T(lang, "Type a message…", "বার্তা লিখুন…")} className="flex-1 text-xs px-2.5 py-2 rounded-full outline-none" style={{ border: `1px solid ${BORDER}` }} data-testid="sathibd-chat-input" />
        <button onClick={send} className="text-xs font-bold px-3 rounded-full" style={{ background: GOLD, color: DARK }} data-testid="sathibd-chat-send">{T(lang, "Send", "পাঠান")}</button>
      </div>
    </div>
  );
};

/* ==========================================================================
 * TOP BAR + NAV
 * ======================================================================= */
const TopBar = ({ lang, onSearch }) => (
  <div className="w-full text-[11px] md:text-xs text-white" style={{ background: GOLD }}>
    <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-between gap-2 flex-wrap" style={{ color: "#3a2a00" }}>
      <div className="flex items-center gap-3"><span>📞 +880 1700-000000</span><span className="hidden sm:inline">📧 hello@sathibd.com</span></div>
      <div className="flex items-center gap-3 font-semibold">
        <button onClick={onSearch} data-testid="sathibd-topbar-search" className="hover:underline">🔍 {T(lang, "Search", "খুঁজুন")}</button>
        <span>👥 {T(lang, "Join", "যোগ দিন")}</span>
      </div>
    </div>
  </div>
);

const Navbar = ({ lang, go, page }) => {
  const link = (k, label) => (
    <button key={k} onClick={() => go(k)} className="text-sm font-medium transition-colors" style={{ color: page === k ? GOLD_DK : DARK }} onMouseEnter={(e) => (e.currentTarget.style.color = GOLD_DK)} onMouseLeave={(e) => (e.currentTarget.style.color = page === k ? GOLD_DK : DARK)}>{label}</button>
  );
  return (
    <div className="w-full bg-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => go("home")} data-testid="sathibd-logo" className="flex items-baseline gap-1">
          <span className="text-2xl font-bold" style={{ fontFamily: SERIF, color: GOLD }}>Sathi</span>
          <span className="text-2xl font-bold" style={{ fontFamily: SERIF, color: DARK }}>BD</span>
        </button>
        <div className="hidden md:flex items-center gap-6">
          {link("home", T(lang, "Home", "হোম"))}
          {link("profiles", T(lang, "Profiles", "প্রোফাইল"))}
          {link("about", T(lang, "About", "সম্পর্কে"))}
          {link("faq", "FAQ")}
          {link("contact", T(lang, "Contact", "যোগাযোগ"))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => go("plans")} data-testid="sathibd-nav-plans" className="text-sm font-semibold px-3 py-1.5 rounded-full" style={{ border: `1.5px solid ${GOLD}`, color: GOLD_DK }}>{T(lang, "Plans", "প্ল্যান")}</button>
          <button onClick={() => go("register")} data-testid="sathibd-nav-register" className="text-sm font-semibold px-3 py-1.5 rounded-full" style={{ background: GOLD, color: DARK }}>{T(lang, "Register", "রেজিস্টার")}</button>
          <button onClick={() => go("dashboard")} data-testid="sathibd-nav-dashboard" className="hidden sm:inline text-sm font-semibold px-3 py-1.5 rounded-full" style={{ background: DARK, color: "#fff" }}>{T(lang, "Dashboard", "ড্যাশবোর্ড")} ▾</button>
        </div>
      </div>
    </div>
  );
};

const Footer = ({ lang, go }) => (
  <footer className="text-white" style={{ background: DARK }}>
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="col-span-2 md:col-span-1">
        <div className="text-2xl font-bold mb-2" style={{ fontFamily: SERIF }}><span style={{ color: GOLD }}>Sathi</span>BD</div>
        <p className="text-xs text-slate-400 leading-relaxed">{T(lang, "Trusted by thousands of couples across Bangladesh 💍", "বাংলাদেশের হাজারো দম্পতির বিশ্বস্ত পছন্দ 💍")}</p>
        <button onClick={() => go("register")} className="mt-3 text-sm font-semibold" style={{ color: GOLD }}>{T(lang, "Join us today! →", "আজই যোগ দিন! →")}</button>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase mb-3" style={{ color: GOLD, letterSpacing: "0.12em" }}>{T(lang, "Explore", "এক্সপ্লোর")}</div>
        {[["Browse Profiles", "profiles"], ["Wedding Gallery", "home"], ["Services", "home"], ["Join Now", "register"]].map((l) => <button key={l[0]} onClick={() => go(l[1])} className="block text-xs text-slate-300 hover:text-white mb-1.5">{l[0]}</button>)}
      </div>
      <div>
        <div className="text-xs font-semibold uppercase mb-3" style={{ color: GOLD, letterSpacing: "0.12em" }}>{T(lang, "Help & Support", "সহায়তা")}</div>
        {["About", "Contact", "Feedback", "FAQ"].map((l) => <span key={l} className="block text-xs text-slate-300 mb-1.5">{l}</span>)}
      </div>
      <div>
        <div className="text-xs font-semibold uppercase mb-3" style={{ color: GOLD, letterSpacing: "0.12em" }}>{T(lang, "Social Media", "সোশ্যাল")}</div>
        <div className="flex gap-2">{["FB", "TW", "IG", "LI"].map((s) => <span key={s} className="w-8 h-8 grid place-items-center rounded-full text-[10px] font-bold" style={{ background: "#333", color: GOLD }}>{s}</span>)}</div>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
        <span>{T(lang, "Free support", "ফ্রি সাপোর্ট")}: +880 1700-000000 | hello@sathibd.com</span>
        <span>© 2025 SathiBD.com {T(lang, "All rights reserved.", "সর্বস্বত্ব সংরক্ষিত।")}</span>
      </div>
    </div>
  </footer>
);

/* ==========================================================================
 * PAGE 1 — HOME
 * ======================================================================= */
const HomePage = ({ lang, go, cfg, profiles, onHeroSearch }) => {
  const [tIdx, setTIdx] = useState(0);
  useEffect(() => { const id = setInterval(() => setTIdx((i) => (i + 1) % TESTIMONIALS.length), 4000); return () => clearInterval(id); }, []);
  const [look, setLook] = useState("Women");
  const [city, setCity] = useState("Any");
  return (
    <div style={{ fontFamily: SANS }}>
      {/* HERO */}
      <section className="grid md:grid-cols-2 items-stretch" style={{ minHeight: 460 }}>
        <div className="flex flex-col justify-center px-6 md:px-12 py-12 bg-white">
          <span className="self-start text-[11px] font-bold uppercase px-3 py-1 rounded-full mb-4" style={{ background: "#fff3d6", color: GOLD_DK, letterSpacing: "0.15em" }}>💍 #1 {T(lang, "Matrimony", "ম্যাট্রিমনি")}</span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{ fontFamily: SERIF, color: DARK }}>{T(lang, "Find your ", "খুঁজে নিন আপনার ")}<span style={{ color: GOLD, fontStyle: "italic" }}>{T(lang, "Right Match", "সঠিক সাথী")}</span>{T(lang, " here", "")}</h1>
          <p className="text-slate-500 mt-3">{T(lang, "Most trusted Matrimony Brand in Bangladesh", "বাংলাদেশের সবচেয়ে বিশ্বস্ত বিবাহ পোর্টাল")}</p>
          <div className="mt-6 bg-white rounded-2xl p-5 shadow-xl" style={{ border: `1px solid ${BORDER}` }}>
            <div className="grid grid-cols-2 gap-3">
              <Select label={T(lang, "I'm looking for", "খুঁজছি")} value={look} onChange={setLook} options={["Women", "Men"]} testid="sathibd-hero-look" />
              <Select label={T(lang, "Age", "বয়স")} options={["18-30", "31-40", "41-50", "51-60"]} testid="sathibd-hero-age" />
              <Select label={T(lang, "Religion", "ধর্ম")} options={["Any", "Islam", "Hindu", "Christian", "Jain"]} testid="sathibd-hero-religion" />
              <Select label={T(lang, "City", "শহর")} value={city} onChange={setCity} options={["Any", "Dhaka", "Chittagong", "Sylhet", "Rajshahi"]} testid="sathibd-hero-city" />
            </div>
            <GoldBtn full testid="sathibd-hero-search" onClick={() => onHeroSearch({ gender: look === "Women" ? "Female" : "Male", city })}><span className="mt-2.5 mb-0.5 block">🔍 {T(lang, "Search Profiles", "প্রোফাইল খুঁজুন")}</span></GoldBtn>
          </div>
        </div>
        <div className="relative p-6 md:p-10 grid place-items-center" style={{ background: "#fff8f0" }}>
          <div className="relative w-full max-w-[300px]" style={{ aspectRatio: "3/4" }}>
            <div className="absolute inset-0" style={{ borderRadius: 24, padding: 8, background: `linear-gradient(135deg, ${GOLD}, #fff)` }}>
              <Photo src={UNS(WED.hero, 700)} alt="Happy couple" c1="#f6c1c1" c2="#e0114a" rounded={18} kenburns />
            </div>
            <div className="absolute -bottom-4 -left-3 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 sb-float">
              <div className="flex -space-x-2">{[RUF(65), RUM(32), RUF(44)].map((src, i) => <img key={i} src={src} alt="" loading="lazy" className="w-7 h-7 rounded-full border-2 border-white object-cover" />)}</div>
              <div className="text-[11px] font-semibold" style={{ color: DARK }}>2,840+ {T(lang, "active today", "সক্রিয় আজ")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="bg-white py-14 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Reveal><Label>{T(lang, "Quick Access", "দ্রুত প্রবেশ")}</Label><H2 center>{T(lang, "Our Services", "আমাদের সেবা")}</H2></Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 60}>
                <button onClick={() => go(s.to, s.anchor)} data-testid={`sathibd-service-${i}`} className="group w-full text-left bg-white rounded-2xl p-5 transition-all hover:-translate-y-1" style={{ border: `1px solid ${BORDER}`, borderBottom: `4px solid transparent` }} onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = GOLD)} onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = "transparent")}>
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="font-bold" style={{ color: DARK }}>{s.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.sub}</div>
                  <div className="text-xs font-semibold mt-2" style={{ color: GOLD_DK }}>{T(lang, "View more", "আরও দেখুন")} →</div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-14 px-6" style={{ background: LIGHT }}>
        <div className="max-w-2xl mx-auto text-center">
          <Label>{T(lang, "Trusted Brand", "বিশ্বস্ত ব্র্যান্ড")}</Label>
          <H2 center>{T(lang, "Trusted by ", "বিশ্বস্ত ")}<span style={{ color: GOLD }}>1500</span>+ {T(lang, "Couples", "দম্পতির কাছে")}</H2>
          <div className="mt-8 bg-white rounded-2xl shadow-md p-8 min-h-[200px]" style={{ border: `1px solid ${BORDER}` }} data-testid="sathibd-testimonial">
            {(() => { const t = TESTIMONIALS[tIdx]; return (
              <div key={tIdx} style={{ animation: "sb-fadeup .5s ease" }}>
                <FaceAvatar src={t.photo} letter={t.letter} c1={t.c1} c2={t.c2} size={70} />
                <p className="italic text-slate-600 mt-4">“{t.quote}”</p>
                <div className="font-bold mt-3" style={{ color: DARK }}>{t.name}</div>
                <div className="text-xs" style={{ color: GOLD_DK }}>{t.loc}</div>
              </div>
            ); })()}
          </div>
          <div className="flex justify-center gap-2 mt-4">{TESTIMONIALS.map((_, i) => <button key={i} onClick={() => setTIdx(i)} className="w-2.5 h-2.5 rounded-full transition-all" style={{ background: i === tIdx ? GOLD : "#ddd" }} />)}</div>
        </div>
      </section>

      {/* ABOUT / WHY US */}
      <section id="about" className="bg-white py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center"><Label>{T(lang, "#1 Wedding Website", "#১ বিবাহ ওয়েবসাইট")}</Label><H2 center>{T(lang, "Why choose ", "কেন আমাদের ")}<span style={{ color: GOLD }}>{T(lang, "us", "বেছে নেবেন")}</span></H2><p className="text-slate-500 mt-2">{T(lang, "Most Trusted and premium Matrimony Service in Bangladesh", "বাংলাদেশের সবচেয়ে বিশ্বস্ত ও প্রিমিয়াম বিবাহ সেবা")}</p></Reveal>
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {[["🏆", "Genuine profiles", "100% verified mobile via BDApps OTP"], ["🤝", "Most trusted", "The most trusted matrimony brand — Robi powered"], ["💍", "2000+ marriages", "Lakhs of people found their life partner on SathiBD"]].map((f, i) => (
              <Reveal key={f[1]} delay={i * 80}>
                <div className="bg-white rounded-2xl p-6 text-center h-full" style={{ border: `1px solid ${BORDER}` }}>
                  <div className="w-14 h-14 mx-auto rounded-full grid place-items-center text-2xl" style={{ background: "#fff3d6" }}>{f[0]}</div>
                  <div className="font-bold mt-3" style={{ fontFamily: SERIF, color: DARK }}>{f[1]}</div>
                  <p className="text-xs text-slate-500 mt-1.5">{f[2]}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden" style={{ height: 280 }}><Photo src={UNS(WED.couples[2])} alt="Married couple" c1="#f6af04" c2="#e0114a" rounded={20} kenburns /></div>
              <div className="absolute -bottom-4 -right-3 bg-white rounded-xl shadow-lg px-4 py-2.5"><div className="text-sm font-bold" style={{ color: DARK }}>💑 2K+ {T(lang, "Couples Matched", "দম্পতি মিলেছেন")}</div></div>
            </div>
            <div>
              <Label>{T(lang, "Welcome to", "স্বাগতম")}</Label>
              <H2>{T(lang, "Welcome to ", "স্বাগতম ")}<span style={{ color: GOLD, fontStyle: "italic" }}>SathiBD</span></H2>
              <p className="text-slate-500 mt-3">{T(lang, "Bangladesh's most trusted matrimony portal. OTP-verified profiles, Robi subscription billing, and SMS match alerts.", "বাংলাদেশের সবচেয়ে বিশ্বস্ত বিবাহ পোর্টাল। OTP যাচাইকৃত প্রোফাইল, রবি সাবস্ক্রিপশন, এবং SMS মিল সতর্কতা।")}</p>
              <div className="text-sm mt-3 space-y-1 text-slate-600"><div>📞 {T(lang, "Enquiry", "যোগাযোগ")}: +880 1700-000000</div><div>📧 hello@sathibd.com</div></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {[[2, "K+", T(lang, "Couples", "দম্পতি")], [4000, "+", T(lang, "Registered", "নিবন্ধিত")], [1800, "+", T(lang, "Men", "পুরুষ")], [2200, "+", T(lang, "Women", "মহিলা")]].map((s, i) => (
                  <div key={i}><div className="text-2xl font-bold" style={{ color: GOLD_DK, fontFamily: SERIF }}><Counter to={s[0]} suffix={s[1]} /></div><div className="text-[11px] text-slate-500">{s[2]}</div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-14 px-6" style={{ background: LIGHT }}>
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center"><Label>{T(lang, "Moments", "মুহূর্ত")}</Label><H2 center>{T(lang, "How it works", "কীভাবে কাজ করে")}</H2></Reveal>
          <div className="mt-10 space-y-4">
            {[["💍", "Register", "আপনার নম্বর দিয়ে OTP যাচাই করুন। বিনামূল্যে শুরু করুন।"], ["🔍", "Find your Match", "ধর্ম, বয়স, শহর এবং পেশা দিয়ে আদর্শ সাথী খুঁজুন।"], ["💌", "Send Interest", "পছন্দের প্রোফাইলে আগ্রহ পাঠান — SMS নোটিফিকেশন পাবেন।"], ["📋", "Get Profile Info", "গ্রহণ করলে সম্পূর্ণ যোগাযোগ ও ব্যক্তিগত তথ্য দেখুন।"], ["💬", "Start Meetups", "ইন-অ্যাপ চ্যাট বা WhatsApp-এ যোগাযোগ শুরু করুন।"], ["👰", "Getting Married", "পরিবারের সম্মতিতে বিয়ে সম্পন্ন করুন। শুভ বিবাহ! 🎉"]].map((s, i) => (
              <Reveal key={s[1]} delay={i * 50}>
                <div className={`flex items-center gap-4 ${i % 2 ? "md:flex-row-reverse md:text-right" : ""}`}>
                  <div className="w-14 h-14 shrink-0 rounded-full grid place-items-center text-2xl relative" style={{ background: "#fff", border: `2px solid ${GOLD}` }}>{s[0]}<span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold grid place-items-center text-white" style={{ background: GOLD_DK }}>{i + 1}</span></div>
                  <div className="flex-1 bg-white rounded-xl p-4" style={{ border: `1px solid ${BORDER}` }}><div className="font-bold" style={{ color: DARK }}>{s[1]}</div><div className="text-xs text-slate-500 mt-0.5">{s[2]}</div></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT COUPLES */}
      <section id="couples" className="bg-white py-14 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Reveal><Label>{T(lang, "Trusted Brand", "বিশ্বস্ত ব্র্যান্ড")}</Label><H2 center>{T(lang, "Recent Couples", "সাম্প্রতিক দম্পতি")}</H2></Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {COUPLES.map((c, i) => (
              <Reveal key={c.id} delay={i * 40}>
                <div className="group relative rounded-2xl overflow-hidden" style={{ aspectRatio: "1", border: `1px solid ${BORDER}` }} data-testid={`sathibd-couple-${c.id}`}>
                  <Photo src={c.img} alt={c.couple} c1={c.c1} c2={c.c2} label={c.couple} sub={c.city} rounded={16} zoom />
                  <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(34,34,34,0.55)" }}>
                    <span className="text-sm font-semibold px-4 py-2 rounded-full" style={{ background: GOLD, color: DARK }}>{T(lang, "View Story", "গল্প দেখুন")} ❤</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-14 px-6" style={{ background: LIGHT }}>
        <div className="max-w-6xl mx-auto text-center">
          <Reveal><Label>{T(lang, "Our Professionals", "আমাদের পেশাদার")}</Label><H2 center>{T(lang, "Meet Our Team", "আমাদের দল")}</H2></Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 60}>
                <div className="bg-white rounded-2xl p-5 group" style={{ border: `1px solid ${BORDER}` }} data-testid={`sathibd-team-${i}`}>
                  <div className="transition-transform group-hover:scale-105 inline-block"><FaceAvatar src={m.photo} letter={m.letter} c1={m.c1} c2={m.c2} size={96} /></div>
                  <div className="font-bold mt-3" style={{ color: DARK }}>{m.name}</div>
                  <div className="text-xs italic" style={{ color: GOLD_DK }}>{m.role}</div>
                  <div className="flex justify-center gap-1.5 mt-2">{["FB", "TW", "IG", "LI", "WA"].map((s) => <span key={s} className="w-6 h-6 grid place-items-center rounded-full text-[8px] font-bold" style={{ background: LIGHT, color: GOLD_DK }}>{s}</span>)}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="bg-white py-14 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Reveal><Label>{T(lang, "Collections", "সংগ্রহ")}</Label><H2 center>{T(lang, "Photo Gallery", "ফটো গ্যালারি")}</H2></Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8">
            {GALLERY.map((g, i) => (
              <Reveal key={i} delay={i * 30}>
                <div className="group relative rounded-xl overflow-hidden" style={{ aspectRatio: "1", border: `1px solid ${BORDER}` }} data-testid={`sathibd-gallery-${i}`}>
                  <Photo src={g.img} alt="Wedding moment" c1={g.c1} c2={g.c2} rounded={12} zoom />
                  <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform px-2 py-2 text-white text-xs" style={{ background: "rgba(34,34,34,0.7)" }}>🔍 {T(lang, "View", "দেখুন")} · Bride & Groom</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" className="py-14 px-6" style={{ background: LIGHT }}>
        <div className="max-w-6xl mx-auto text-center">
          <Reveal><Label>{T(lang, "Blog Posts", "ব্লগ")}</Label><H2 center>{T(lang, "Blog & Articles", "ব্লগ ও নিবন্ধ")}</H2></Reveal>
          <div className="grid md:grid-cols-3 gap-5 mt-8 text-left">
            {BLOG.map((b, i) => (
              <Reveal key={b.title} delay={i * 70}>
                <div className="bg-white rounded-2xl overflow-hidden h-full" style={{ border: `1px solid ${BORDER}` }} data-testid={`sathibd-blog-${i}`}>
                  <div className="h-32 grid place-items-center text-4xl" style={{ background: `linear-gradient(135deg, ${b.c1}, ${b.c2})` }}>📝</div>
                  <div className="p-4">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#fff3d6", color: GOLD_DK }}>{b.cat}</span>
                    <div className="font-bold mt-2 leading-snug" style={{ fontFamily: SERIF, color: DARK }}>{b.title}</div>
                    <div className="text-xs font-semibold mt-2" style={{ color: GOLD_DK }}>{T(lang, "Read more", "আরও পড়ুন")} →</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})` }}>
        <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: SERIF }}>{T(lang, "Find your perfect Match now", "এখনই খুঁজে নিন আপনার সাথী")}</h2>
        <p className="text-white/90 mt-2">{T(lang, "Registration is completely free. Start your journey today.", "রেজিস্ট্রেশন সম্পূর্ণ বিনামূল্যে। আজই যাত্রা শুরু করুন।")}</p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={() => go("register")} data-testid="sathibd-cta-register" className="font-semibold px-6 py-2.5 rounded-full bg-white" style={{ color: GOLD_DK }}>{T(lang, "Register Now", "রেজিস্টার করুন")}</button>
          <button onClick={() => go("contact")} className="font-semibold px-6 py-2.5 rounded-full" style={{ border: "2px solid #fff", color: "#fff" }}>{T(lang, "Help & Support", "সহায়তা")}</button>
        </div>
      </section>
    </div>
  );
};

const Select = ({ label, options, value, onChange, testid }) => (
  <label className="block text-left">
    <span className="text-[11px] font-semibold text-slate-500">{label}</span>
    <select data-testid={testid} value={value} onChange={(e) => onChange && onChange(e.target.value)} className="w-full mt-1 text-sm rounded-lg px-2.5 py-2 outline-none bg-white" style={{ border: `1px solid ${BORDER}` }}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </label>
);

/* ==========================================================================
 * PAGE 2 — ALL PROFILES
 * ======================================================================= */
const ProfilesPage = ({ lang, profiles, openProfile, onInterest, onChat, prefill }) => {
  const [gender, setGender] = useState(prefill?.gender || "All");
  const [city, setCity] = useState(prefill?.city && prefill.city !== "Any" ? prefill.city : "Any");
  const [avail, setAvail] = useState("All");
  const [type, setType] = useState("All");
  const filtered = useMemo(() => profiles.filter((p) =>
    (gender === "All" || p.gender === gender) &&
    (city === "Any" || p.city === city) &&
    (avail === "All" || (avail === "Available" ? p.online : !p.online)) &&
    (type === "All" || (type === "Premium" ? p.plan !== "Free" : p.plan === "Free"))
  ), [profiles, gender, city, avail, type]);

  return (
    <div style={{ fontFamily: SANS }}>
      <div className="py-12 px-6 text-center text-white" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})` }}>
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: SERIF }}>{T(lang, "Lakhs of Happy Marriages", "লক্ষ লক্ষ সুখী বিবাহ")}</h1>
        <button className="mt-4 font-semibold px-6 py-2 rounded-full bg-white" style={{ color: GOLD_DK }}>{T(lang, "Join now for Free", "বিনামূল্যে যোগ দিন")}</button>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="bg-white rounded-2xl p-5 self-start md:sticky md:top-20" style={{ border: `1px solid ${BORDER}` }} data-testid="sathibd-filters">
          <div className="font-bold mb-4" style={{ color: DARK }}>{T(lang, "Profile filters", "প্রোফাইল ফিল্টার")}</div>
          <FilterBlock title={T(lang, "I'm looking for", "খুঁজছি")}>
            <div className="flex gap-3">{["Male", "Female"].map((g) => (
              <label key={g} className="flex items-center gap-1.5 text-xs cursor-pointer"><input type="radio" name="gender" checked={gender === g} onChange={() => setGender(g)} style={{ accentColor: GOLD }} data-testid={`sathibd-filter-${g.toLowerCase()}`} />{g}</label>
            ))}</div>
          </FilterBlock>
          <FilterBlock title={T(lang, "Age", "বয়স")}><Select options={["Any", "18-30", "31-40", "41-50", "51-60"]} testid="sathibd-filter-age" /></FilterBlock>
          <FilterBlock title={T(lang, "Religion", "ধর্ম")}><Select options={["Any", "Islam", "Hindu", "Christian"]} testid="sathibd-filter-religion" /></FilterBlock>
          <FilterBlock title={T(lang, "Location", "অবস্থান")}>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full text-sm rounded-lg px-2.5 py-2 outline-none" style={{ border: `1px solid ${BORDER}` }} data-testid="sathibd-filter-city">
              {["Any", "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </FilterBlock>
          <FilterBlock title={T(lang, "Availability", "উপলব্ধতা")}><div className="flex gap-2">{["All", "Available", "Offline"].map((a) => <Pill key={a} active={avail === a} onClick={() => setAvail(a)} testid={`sathibd-avail-${a.toLowerCase()}`}>{a}</Pill>)}</div></FilterBlock>
          <FilterBlock title={T(lang, "Profile", "প্রোফাইল")}><div className="flex gap-2">{["All", "Premium", "Free"].map((tt) => <Pill key={tt} active={type === tt} onClick={() => setType(tt)} testid={`sathibd-type-${tt.toLowerCase()}`}>{tt === "Premium" ? "⭐ Premium" : tt}</Pill>)}</div></FilterBlock>
          <div className="rounded-xl p-3 mt-2 text-xs" style={{ background: "#fff8e8" }}>
            <div className="font-semibold" style={{ color: DARK }}>{T(lang, "What are you looking for?", "কী খুঁজছেন?")}</div>
            <p className="text-slate-500 mt-1">{T(lang, "We will help you arrange the best match.", "আমরা সেরা ম্যাচ খুঁজে দিতে সাহায্য করব।")}</p>
            <button className="font-semibold mt-1" style={{ color: GOLD_DK }}>{T(lang, "Send your queries →", "প্রশ্ন পাঠান →")}</button>
          </div>
        </aside>
        {/* List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm" style={{ color: DARK }} data-testid="sathibd-profile-count">{T(lang, "Showing ", "দেখাচ্ছে ")}<b>{filtered.length}</b> {T(lang, "profiles", "প্রোফাইল")}</div>
            <select className="text-xs rounded-lg px-2 py-1.5 outline-none" style={{ border: `1px solid ${BORDER}` }} data-testid="sathibd-sort"><option>Most relevant</option><option>Newest</option><option>Age</option></select>
          </div>
          <div className="space-y-4">
            {filtered.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row gap-4 transition-all hover:shadow-md" style={{ border: `1px solid ${BORDER}` }} data-testid={`sathibd-profile-card-${p.id}`}>
                <div className="relative shrink-0 mx-auto sm:mx-0 group" style={{ width: 150, height: 170 }}>
                  <Photo src={p.photo} alt={p.nameEn} c1={p.c1} c2={p.c2} rounded={14} zoom />
                  <span className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: p.online ? GREEN : "#888" }}>{p.online ? `🟢 ${T(lang, "Available", "অনলাইন")}` : `${T(lang, "Last seen", "শেষ দেখা")} ${p.last}`}</span>
                </div>
                <div className="flex-1">
                  <button onClick={() => openProfile(p)} className="font-bold text-lg hover:underline" style={{ fontFamily: SERIF, color: DARK }} data-testid={`sathibd-profile-name-${p.id}`}>{p.nameEn}</button>
                  <div className="text-sm text-slate-500 mt-1">{p.education} · {p.profession} | {p.age} {T(lang, "Years", "বছর")} | {T(lang, "Height", "উচ্চতা")}: {p.height}</div>
                  <div className="text-xs text-slate-400 mt-0.5">📍 {p.city} · {p.religion}</div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button onClick={() => onChat(p)} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ border: `1.5px solid ${GOLD}`, color: GOLD_DK }} data-testid={`sathibd-chat-${p.id}`}>💬 {T(lang, "Chat now", "চ্যাট")}</button>
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-full text-white" style={{ background: GREEN }} data-testid={`sathibd-wa-${p.id}`}>🟢 WhatsApp</button>
                    <button onClick={() => onInterest(p)} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: GOLD, color: DARK }} data-testid={`sathibd-interest-${p.id}`}>💌 {T(lang, "Send interest", "আগ্রহ পাঠান")}</button>
                    <button onClick={() => openProfile(p)} className="text-xs font-semibold px-2 py-1.5" style={{ color: GOLD_DK }} data-testid={`sathibd-more-${p.id}`}>{T(lang, "More details", "বিস্তারিত")} →</button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center text-slate-400 py-10 text-sm">{T(lang, "No profiles match your filters.", "কোনো প্রোফাইল মেলেনি।")}</div>}
          </div>
          <div className="flex justify-center gap-2 mt-6 text-sm">
            <button className="px-3 py-1 rounded" style={{ border: `1px solid ${BORDER}` }}>← Prev</button>
            {[1, 2, 3].map((n) => <button key={n} className="w-8 h-8 rounded font-semibold" style={n === 2 ? { background: GOLD, color: DARK } : { border: `1px solid ${BORDER}` }}>{n}</button>)}
            <button className="px-3 py-1 rounded" style={{ border: `1px solid ${BORDER}` }}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Pill = ({ active, children, onClick, testid }) => (
  <button onClick={onClick} data-testid={testid} className="text-xs px-3 py-1 rounded-full font-semibold transition-colors" style={active ? { background: GOLD, color: DARK } : { background: LIGHT, color: "#666" }}>{children}</button>
);

const FilterBlock = ({ title, children }) => (
  <div className="mb-4 pb-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
    <div className="text-xs font-semibold mb-2" style={{ color: DARK }}>{title}</div>
    {children}
  </div>
);

/* ==========================================================================
 * PAGE 3 — PROFILE DETAIL
 * ======================================================================= */
const DetailRow = ({ k, v }) => (
  <div className="flex justify-between text-sm py-1.5" style={{ borderBottom: `1px dashed ${BORDER}` }}><span className="text-slate-500">{k}</span><span className="font-medium" style={{ color: DARK }}>{v}</span></div>
);

const ProfileDetailPage = ({ lang, profile, profiles, openProfile, onInterest, onChat, go }) => {
  if (!profile) return null;
  const related = profiles.filter((p) => p.id !== profile.id && p.gender === profile.gender).slice(0, 4);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8" style={{ fontFamily: SANS }}>
      <button onClick={() => go("profiles")} className="text-sm mb-4" style={{ color: GOLD_DK }}>← {T(lang, "Back to profiles", "প্রোফাইলে ফিরুন")}</button>
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div>
          <div className="rounded-2xl overflow-hidden" style={{ height: 320, border: `1px solid ${BORDER}` }}><Photo src={profile.photo} alt={profile.nameEn} c1={profile.c1} c2={profile.c2} rounded={20} kenburns /></div>
          <div className="flex items-center justify-center gap-3 mt-3 text-xs">
            <span className="text-slate-500"><b style={{ color: DARK }}>100</b> {T(lang, "viewers", "দর্শক")}</span>
            <span className="px-2 py-0.5 rounded-full text-white" style={{ background: profile.online ? GREEN : "#888" }}>{profile.online ? `🟢 ${T(lang, "Available", "অনলাইন")}` : T(lang, "Offline", "অফলাইন")}</span>
          </div>
          <button onClick={() => onChat(profile)} className="w-full mt-4 font-semibold py-2.5 rounded-full" style={{ border: `2px solid ${GOLD}`, color: GOLD_DK }} data-testid="sathibd-detail-chat">💬 {T(lang, "Chat now", "চ্যাট")}</button>
          <button onClick={() => onInterest(profile)} className="w-full mt-2 font-semibold py-2.5 rounded-full" style={{ background: GOLD, color: DARK }} data-testid="sathibd-detail-interest">💌 {T(lang, "Send interest", "আগ্রহ পাঠান")}</button>
        </div>
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: SERIF, color: DARK }}>{profile.nameEn}</h1>
          <div className="flex flex-wrap gap-2 mt-3">
            {[["📍", profile.city], ["🎂", `${profile.age} yrs`], ["📏", profile.height], ["💼", profile.profession]].map((c, i) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-full" style={{ background: LIGHT, color: DARK }}>{c[0]} {c[1]}</span>
            ))}
          </div>
          <Section title={T(lang, "About", "সম্পর্কে")}>
            <p className="text-sm text-slate-600 leading-relaxed">আমি একজন পরিশ্রমী এবং পারিবারিক মানুষ। সৎ ও ধার্মিক জীবনসঙ্গী চাই। বাবা অবসরপ্রাপ্ত সরকারি কর্মকর্তা, মা গৃহিণী। আমি সবসময় পারিবারিক মূল্যবোধকে প্রাধান্য দিই।</p>
          </Section>
          <Section title={T(lang, "Photo Gallery", "ফটো গ্যালারি")}>
            <div className="flex gap-3">{[0, 1, 2].map((i) => <div key={i} className="group rounded-xl overflow-hidden" style={{ width: 100, height: 100 }}><Photo src={UNS(WED.gallery[i])} alt="Gallery" c1={profile.c1} c2={profile.c2} rounded={12} zoom /></div>)}</div>
          </Section>
          <Section title={T(lang, "Contact Info", "যোগাযোগ")}>
            <div className="rounded-xl p-4" style={{ background: LIGHT }}>
              <div className="space-y-1.5 text-sm" style={{ filter: "blur(4px)", userSelect: "none" }}><div>📞 +880 17XX-XXXXXX</div><div>📧 ****@gmail.com</div><div>📍 {profile.city}, Bangladesh</div></div>
              <button onClick={() => go("plans")} className="text-xs font-semibold mt-2" style={{ color: GOLD_DK }} data-testid="sathibd-detail-unlock">🔒 {T(lang, "Subscribe to view full contact info", "সম্পূর্ণ যোগাযোগ দেখতে সাবস্ক্রাইব করুন")}</button>
            </div>
          </Section>
          <Section title={T(lang, "Personal Information", "ব্যক্তিগত তথ্য")}>
            <div className="grid sm:grid-cols-2 gap-x-6">
              <DetailRow k="Name" v={profile.nameEn.replace(/^(Ms\.|Md\.)\s*/, "")} />
              <DetailRow k="Father's Name" v={profile.father} />
              <DetailRow k="Age" v={profile.age} />
              <DetailRow k="Date of Birth" v={profile.dob} />
              <DetailRow k="Height" v={profile.height} />
              <DetailRow k="Weight" v={profile.weight} />
              <DetailRow k="Education" v={profile.edu} />
              <DetailRow k="Religion" v={profile.religion} />
              <DetailRow k="Profession" v={profile.profession} />
              <DetailRow k="Company" v={profile.company} />
              <DetailRow k="Monthly Income" v={profile.income} />
              <DetailRow k="City" v={profile.city} />
            </div>
          </Section>
          <Section title={T(lang, "Hobbies", "শখ")}>
            <div className="flex flex-wrap gap-2">{["Reading 📚", "Cooking 🍳", "Travel ✈️", "Music 🎵", "Family time 👨‍👩‍👧", "Yoga 🧘", "Gardening 🌺"].map((h) => <span key={h} className="text-xs px-3 py-1 rounded-full" style={{ border: `1px solid ${GOLD}`, color: DARK }}>{h}</span>)}</div>
          </Section>
          <Section title={T(lang, "Social Media", "সোশ্যাল মিডিয়া")}>
            <div className="flex gap-2">{["FB", "IG", "LI", "TW", "WA"].map((s) => <span key={s} className="w-9 h-9 grid place-items-center rounded-full text-[10px] font-bold" style={{ background: LIGHT, color: GOLD_DK }}>{s}</span>)}</div>
          </Section>
        </div>
      </div>
      {/* Related */}
      <div className="mt-10">
        <Label>{T(lang, "You may also like", "আরও দেখতে পারেন")}</Label>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {related.map((p) => (
            <button key={p.id} onClick={() => openProfile(p)} className="shrink-0 w-32 text-center" data-testid={`sathibd-related-${p.id}`}>
              <div className="group rounded-xl overflow-hidden mb-2" style={{ height: 120 }}><Photo src={p.photo} alt={p.nameEn} c1={p.c1} c2={p.c2} rounded={12} zoom /></div>
              <div className="text-xs font-bold" style={{ color: DARK }}>{p.nameEn}</div>
              <div className="text-[10px] text-slate-500">{p.age} · {p.city}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="mt-6">
    <h3 className="font-bold mb-2 flex items-center gap-2" style={{ fontFamily: SERIF, color: DARK }}><span className="w-1.5 h-4 rounded" style={{ background: GOLD }} />{title}</h3>
    {children}
  </div>
);

/* ==========================================================================
 * PAGE 4 — PLANS
 * ======================================================================= */
const PlansPage = ({ lang, plans, onPick }) => (
  <div className="max-w-5xl mx-auto px-4 py-12 text-center" style={{ fontFamily: SANS }}>
    <Label>Pricing</Label>
    <H2 center>{T(lang, "Get Started — Pick your Plan", "শুরু করুন — আপনার প্ল্যান বেছে নিন")}</H2>
    <p className="text-slate-500 mt-2">{T(lang, "Registration is free. Change your plan anytime.", "রেজিস্ট্রেশন বিনামূল্যে। যেকোনো সময় পরিবর্তন করুন।")}</p>
    <div className="text-xs text-slate-400 mt-1">{T(lang, "No credit card required", "কোনো ক্রেডিট কার্ড প্রয়োজন নেই")}</div>
    <div className="grid md:grid-cols-3 gap-5 mt-10 items-stretch">
      {plans.map((p) => (
        <div key={p.id} className="rounded-2xl p-6 text-left relative flex flex-col" data-testid={`sathibd-plan-${p.id}`}
          style={{ background: p.dark ? DARK : "#fff", color: p.dark ? "#fff" : DARK, border: p.popular ? `2px solid ${GOLD}` : `1px solid ${BORDER}`, boxShadow: p.popular ? "0 20px 40px rgba(246,175,4,0.18)" : "none", transform: p.popular ? "scale(1.03)" : "none" }}>
          {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap" style={{ background: GOLD, color: DARK }}>🌟 Most popular plan</div>}
          <div className="font-bold text-lg" style={{ fontFamily: SERIF, color: p.dark ? "#fff" : (p.popular ? GOLD_DK : DARK) }}>{p.name}</div>
          <div className="text-xs opacity-70">{p.tag}</div>
          <div className="text-4xl font-bold mt-3" style={{ fontFamily: SERIF }}>{p.price}<span className="text-sm font-normal opacity-60">/mo</span></div>
          <button onClick={() => onPick(p)} data-testid={`sathibd-plan-cta-${p.id}`} className="w-full font-semibold py-2.5 rounded-full mt-4" style={p.dark ? { background: "#fff", color: DARK } : p.popular ? { background: GOLD, color: DARK } : { border: `2px solid ${GOLD}`, color: GOLD_DK }}>{T(lang, "Get Started", "শুরু করুন")}</button>
          <ul className="mt-4 space-y-2 text-sm flex-1">
            {p.feats.map((f, i) => <li key={i} className="flex items-center gap-2" style={{ opacity: f[1] ? 1 : 0.4 }}><span style={{ color: f[1] ? GREEN : RED }}>{f[1] ? "✓" : "✗"}</span>{f[0]}</li>)}
          </ul>
          {p.id === "gold" && <div className="text-[11px] mt-3 opacity-60">{T(lang, "Charged from Robi balance", "রবি ব্যালান্স থেকে কাটা হবে")}</div>}
        </div>
      ))}
    </div>
  </div>
);

/* ==========================================================================
 * PAGE 5 — USER DASHBOARD
 * ======================================================================= */
const DashboardPage = ({ lang, profiles, openProfile }) => {
  const [tab, setTab] = useState("new");
  const [reqStates, setReqStates] = useState({}); // id -> accepted/declined
  const matches = profiles.slice(0, 7);
  const newReqs = INTEREST_REQUESTS;
  const planBadge = (plan) => <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: plan === "Platinum" ? "#555" : plan === "Gold" ? GOLD_DK : "#999" }}>{plan} user</span>;
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-[240px_1fr] gap-6" style={{ fontFamily: SANS }}>
      <aside className="bg-white rounded-2xl p-5 self-start" style={{ border: `1px solid ${BORDER}` }}>
        <div className="text-center pb-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <FaceAvatar src={RUM(33)} letter="R" c1="#c4e4f4" c2="#5ca0d8" size={72} />
          <div className="font-bold mt-2" style={{ color: DARK }}>{T(lang, "Welcome, মোঃ রফিউল", "স্বাগতম, মোঃ রফিউল")}</div>
        </div>
        <nav className="mt-4 space-y-1 text-sm">
          {[["📊", "Dashboard", true], ["👤", "Profile"], ["💌", "Interests"], ["💬", "Chat list"], ["💳", "Plan"], ["⚙️", "Settings"], ["🚪", "Log out"]].map((n) => (
            <div key={n[1]} className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer" style={n[2] ? { background: "#fff3d6", color: GOLD_DK, fontWeight: 600 } : { color: "#555" }}>{n[0]} {n[1]}</div>
          ))}
        </nav>
      </aside>
      <div className="space-y-6">
        {/* Matches */}
        <div className="bg-white rounded-2xl p-5" style={{ border: `1px solid ${BORDER}` }}>
          <h2 className="font-bold mb-3" style={{ fontFamily: SERIF, color: DARK }}>{T(lang, "New Profile Matches", "নতুন প্রোফাইল ম্যাচ")}</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {matches.map((p) => (
              <button key={p.id} onClick={() => openProfile(p)} className="shrink-0 w-24 text-center" data-testid={`sathibd-dash-match-${p.id}`}>
                <FaceAvatar src={p.photo} letter={p.nameEn.replace(/^(Ms\.|Md\.)\s*/, "")[0]} c1={p.c1} c2={p.c2} size={64} />
                <div className="text-[11px] font-bold mt-1 truncate" style={{ color: DARK }}>{p.nameEn}</div>
                <div className="text-[10px] text-slate-500">{p.city} · {p.age}</div>
                <div className="text-[10px] font-semibold" style={{ color: GOLD_DK }}>View →</div>
              </button>
            ))}
          </div>
        </div>
        {/* Profile status */}
        <div className="bg-white rounded-2xl p-5" style={{ border: `1px solid ${BORDER}` }}>
          <div className="flex flex-wrap gap-3 text-xs mb-3" style={{ color: GOLD_DK }}>{["Edit profile", "View profile", "Visibility settings"].map((l) => <button key={l} className="font-semibold">{l}</button>)}</div>
          <div className="text-sm font-semibold mb-1" style={{ color: DARK }}>{T(lang, "Profile Completion", "প্রোফাইল সম্পূর্ণতা")}</div>
          <div className="flex items-center gap-3"><div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: BORDER }}><div className="h-full rounded-full" style={{ width: "90%", background: GOLD }} /></div><span className="text-sm font-bold" style={{ color: GOLD_DK }}>90%</span></div>
          <div className="grid grid-cols-4 gap-3 mt-4 text-center">
            {[["12", "Likes ❤️"], ["48", "Views 👁"], ["8", "Interests 💌"], ["124", "Clicks 🖱"]].map((s) => <div key={s[1]} className="rounded-xl py-2" style={{ background: LIGHT }}><div className="font-bold text-lg" style={{ color: DARK }}>{s[0]}</div><div className="text-[10px] text-slate-500">{s[1]}</div></div>)}
          </div>
        </div>
        {/* Plan details */}
        <div className="bg-white rounded-2xl p-5 flex items-center gap-4" style={{ border: `1px solid ${BORDER}` }}>
          <div className="text-4xl">💎</div>
          <div className="flex-1">
            <div className="font-bold" style={{ color: DARK }}>{T(lang, "Plan", "প্ল্যান")}: <span style={{ color: GOLD_DK }}>Gold</span></div>
            <div className="text-xs text-slate-500">{T(lang, "Validity", "মেয়াদ")}: 6 Months · {T(lang, "Valid till", "মেয়াদ শেষ")}: 24 June 2026</div>
          </div>
          <button className="text-xs font-semibold" style={{ color: GOLD_DK }}>{T(lang, "Upgrade to Platinum", "প্ল্যাটিনামে আপগ্রেড")} →</button>
        </div>
        {/* Recent chats */}
        <div className="bg-white rounded-2xl p-5" style={{ border: `1px solid ${BORDER}` }}>
          <h2 className="font-bold mb-3" style={{ fontFamily: SERIF, color: DARK }}>{T(lang, "Recent Chat List", "সাম্প্রতিক চ্যাট")}</h2>
          <div className="space-y-2">
            {profiles.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-3"><FaceAvatar src={p.photo} letter={p.nameEn.replace(/^(Ms\.|Md\.)\s*/, "")[0]} c1={p.c1} c2={p.c2} size={44} /><div className="flex-1 min-w-0"><div className="text-sm font-semibold" style={{ color: DARK }}>{p.nameEn}</div><div className="text-xs text-slate-400 truncate">{p.city} · {T(lang, "Hi, thanks for connecting…", "হাই, যোগাযোগের জন্য ধন্যবাদ…")}</div></div></div>
            ))}
          </div>
        </div>
        {/* Interest requests */}
        <div className="bg-white rounded-2xl p-5" style={{ border: `1px solid ${BORDER}` }} data-testid="sathibd-interest-requests">
          <h2 className="font-bold mb-3" style={{ fontFamily: SERIF, color: DARK }}>{T(lang, "Interest Requests", "আগ্রহের অনুরোধ")}</h2>
          <div className="flex gap-2 mb-4">
            {[["new", `New requests (${newReqs.length})`], ["accepted", "Accepted"], ["declined", "Declined"]].map((t) => (
              <button key={t[0]} onClick={() => setTab(t[0])} data-testid={`sathibd-reqtab-${t[0]}`} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={tab === t[0] ? { background: GOLD, color: DARK } : { background: LIGHT, color: "#666" }}>{t[1]}</button>
            ))}
          </div>
          <div className="space-y-3">
            {newReqs.filter((r) => (tab === "new" ? !reqStates[r.id] : reqStates[r.id] === tab)).map((r) => (
              <div key={r.id} className="rounded-xl p-4 flex flex-col sm:flex-row gap-3" style={{ border: `1px solid ${BORDER}` }} data-testid={`sathibd-req-${r.id}`}>
                <div className="shrink-0 text-center">
                  <div className="rounded-xl overflow-hidden mb-1" style={{ width: 72, height: 72 }}><Photo src={r.photo} alt={r.name} c1={r.c1} c2={r.c2} rounded={10} /></div>
                  {planBadge(r.plan)}
                </div>
                <div className="flex-1">
                  <div className="font-bold" style={{ color: DARK }}>{r.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">City: {r.city} | Age: {r.age} | Height: {r.height} | Job: {r.job}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{T(lang, "Request on", "অনুরোধ")}: {r.time}</div>
                  <div className="flex items-center gap-2 mt-2">
                    {!reqStates[r.id] && <>
                      <button onClick={() => setReqStates((s) => ({ ...s, [r.id]: "accepted" }))} data-testid={`sathibd-req-accept-${r.id}`} className="text-xs font-semibold px-3 py-1.5 rounded-full text-white" style={{ background: GREEN }}>✓ {T(lang, "Accept", "গ্রহণ")}</button>
                      <button onClick={() => setReqStates((s) => ({ ...s, [r.id]: "declined" }))} data-testid={`sathibd-req-decline-${r.id}`} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ border: `1.5px solid ${RED}`, color: RED }}>✗ {T(lang, "Decline", "প্রত্যাখ্যান")}</button>
                    </>}
                    {reqStates[r.id] === "accepted" && <span className="text-xs font-semibold" style={{ color: GREEN }}>✓ {T(lang, "Accepted", "গৃহীত")}</span>}
                    {reqStates[r.id] === "declined" && <button onClick={() => setReqStates((s) => ({ ...s, [r.id]: "accepted" }))} className="text-xs font-semibold px-3 py-1.5 rounded-full text-white" style={{ background: GREEN }}>↺ {T(lang, "Accept instead", "গ্রহণ করুন")}</button>}
                  </div>
                </div>
              </div>
            ))}
            {newReqs.filter((r) => (tab === "new" ? !reqStates[r.id] : reqStates[r.id] === tab)).length === 0 && <div className="text-center text-slate-400 text-sm py-6">{T(lang, "Nothing here yet.", "এখনো কিছু নেই।")}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
 * PAGE 6 — REGISTER
 * ======================================================================= */
const RegisterPage = ({ lang, go }) => {
  const [done, setDone] = useState(false);
  const [show, setShow] = useState(false);
  const DISTRICTS = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh", "Comilla", "Gazipur"];
  return (
    <div className="grid md:grid-cols-2 min-h-[480px]" style={{ fontFamily: SANS }}>
      <div className="flex items-center justify-center p-8" style={{ background: "#fff" }}>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6" style={{ border: `1px solid ${BORDER}` }}>
          {done ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-full grid place-items-center text-3xl text-white" style={{ background: GREEN }}>✓</div>
              <div className="font-bold text-lg mt-3" style={{ fontFamily: SERIF, color: DARK }}>{T(lang, "Account Created!", "অ্যাকাউন্ট তৈরি হয়েছে!")}</div>
              <p className="text-xs text-slate-500 mt-1">{T(lang, "OTP verified via BDApps. Welcome to SathiBD.", "BDApps দিয়ে OTP যাচাই হয়েছে। স্বাগতম।")}</p>
              <GoldBtn full testid="sathibd-reg-dashboard" onClick={() => go("dashboard")}><span className="mt-2.5 mb-0.5 block">{T(lang, "Go to Dashboard", "ড্যাশবোর্ডে যান")}</span></GoldBtn>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold" style={{ fontFamily: SERIF, color: GOLD_DK }}>{T(lang, "Register for Free", "বিনামূল্যে রেজিস্টার")}</h2>
              <div className="space-y-2.5 mt-4">
                <Field label={T(lang, "Full Name", "পূর্ণ নাম")} req testid="sathibd-reg-name" />
                <div><span className="text-[11px] font-semibold text-slate-500">{T(lang, "Gender", "লিঙ্গ")} *</span><div className="flex gap-4 mt-1">{["Male", "Female"].map((g) => <label key={g} className="flex items-center gap-1.5 text-sm"><input type="radio" name="rgender" style={{ accentColor: GOLD }} data-testid={`sathibd-reg-${g.toLowerCase()}`} />{g}</label>)}</div></div>
                <div className="grid grid-cols-2 gap-2.5">
                  <Field label={T(lang, "Date of Birth", "জন্ম তারিখ")} req type="date" testid="sathibd-reg-dob" />
                  <SelField label={T(lang, "Religion", "ধর্ম")} options={["Islam", "Hindu", "Christian", "Buddhist"]} testid="sathibd-reg-religion" />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <SelField label={T(lang, "District", "জেলা")} options={DISTRICTS} testid="sathibd-reg-district" />
                  <SelField label={T(lang, "Education", "শিক্ষা")} options={["SSC", "HSC", "Honors", "Masters", "PhD"]} testid="sathibd-reg-education" />
                </div>
                <Field label={T(lang, "Profession", "পেশা")} req testid="sathibd-reg-profession" />
                <div><span className="text-[11px] font-semibold text-slate-500">{T(lang, "Phone Number", "ফোন নম্বর")} *</span><div className="flex items-center border rounded-lg overflow-hidden mt-1" style={{ borderColor: BORDER }}><span className="px-2.5 py-2 text-sm bg-slate-50 text-slate-500">+880</span><input className="flex-1 px-2.5 py-2 text-sm outline-none" placeholder="01XXXXXXXXX" data-testid="sathibd-reg-phone" /></div></div>
                <div><span className="text-[11px] font-semibold text-slate-500">{T(lang, "Password", "পাসওয়ার্ড")} *</span><div className="flex items-center border rounded-lg overflow-hidden mt-1" style={{ borderColor: BORDER }}><input type={show ? "text" : "password"} className="flex-1 px-2.5 py-2 text-sm outline-none" data-testid="sathibd-reg-password" /><button onClick={() => setShow(!show)} className="px-2.5 text-xs text-slate-400">{show ? "🙈" : "👁"}</button></div></div>
              </div>
              <GoldBtn full testid="sathibd-reg-submit" onClick={() => setDone(true)}><span className="mt-2.5 mb-0.5 block">🚀 {T(lang, "Create Account", "অ্যাকাউন্ট তৈরি")}</span></GoldBtn>
              <div className="text-center text-xs text-slate-500 mt-3">{T(lang, "Already registered?", "আগে থেকে আছেন?")} <button onClick={() => go("home")} className="font-semibold" style={{ color: GOLD_DK }}>{T(lang, "Sign in", "সাইন ইন")} →</button></div>
            </>
          )}
        </div>
      </div>
      <div className="hidden md:grid place-items-center p-10" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})` }}>
        <div className="w-full max-w-[280px]" style={{ aspectRatio: "3/4" }}><Photo src={UNS(WED.register)} alt="Couple" c1="#f6c1c1" c2="#e0114a" rounded={20} kenburns /></div>
      </div>
    </div>
  );
};

const Field = ({ label, req, type = "text", testid }) => (
  <label className="block"><span className="text-[11px] font-semibold text-slate-500">{label}{req && " *"}</span><input type={type} data-testid={testid} className="w-full mt-1 text-sm rounded-lg px-2.5 py-2 outline-none" style={{ border: `1px solid ${BORDER}` }} /></label>
);
const SelField = ({ label, options, testid }) => (
  <label className="block"><span className="text-[11px] font-semibold text-slate-500">{label} *</span><select data-testid={testid} className="w-full mt-1 text-sm rounded-lg px-2 py-2 outline-none bg-white" style={{ border: `1px solid ${BORDER}` }}>{options.map((o) => <option key={o}>{o}</option>)}</select></label>
);

/* ==========================================================================
 * MAIN COMPONENT
 * ======================================================================= */
export const SathiBDWebPreview = ({ cfg = {}, content, onPhoneSubmit, onOtpVerify, onInterest, onSubscribe }) => {
  const lang = cfg.language === "Bengali" ? "Bengali" : "English";
  const [page, setPage] = useState("home");
  const [selected, setSelected] = useState(null);
  const [interestFor, setInterestFor] = useState(null);
  const [chatWith, setChatWith] = useState(null);
  const [subPlan, setSubPlan] = useState(null);
  const [prefill, setPrefill] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  // Build profile list from content (SOT) when available, else defaults
  const profiles = useMemo(() => {
    if (content?.profiles?.length) {
      const palette = [["#f4c4c4", "#e0114a"], ["#c4d7f4", "#5ca0d8"], ["#e6d3f4", "#a87ed8"], ["#c4f4d9", "#28a745"], ["#f4dcc4", "#e0a25c"], ["#d9d3f4", "#8a7ed8"]];
      return content.profiles.map((p, i) => {
        const base = PROFILES.find((x) => x.nameEn.includes(p.name)) || PROFILES[i % PROFILES.length];
        return { ...base, id: p.id || base.id, name: p.name, nameEn: p.name, gender: p.gender || base.gender, age: p.age || base.age, height: p.height || base.height, education: p.education || base.education, edu: p.education || base.edu, profession: p.profession || base.profession, city: p.district || base.city, religion: p.religion || base.religion, online: i % 2 === 0, c1: palette[i % palette.length][0], c2: palette[i % palette.length][1] };
      });
    }
    return PROFILES;
  }, [content]);

  const plans = useMemo(() => {
    if (content?.plans?.length) {
      return content.plans.map((p, i) => ({ ...(DEFAULT_PLANS[i] || DEFAULT_PLANS[0]), id: (p.name || "plan").toLowerCase().replace(/\s+/g, "-"), name: p.name, price: `৳${p.price}`, amount: p.price, tag: p.period || "", feats: (p.features || []).map((f) => [f, true]), popular: !!p.badge, dark: i === 2 }));
    }
    return DEFAULT_PLANS;
  }, [content]);

  const go = (p, anchor) => {
    setPage(p);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    if (anchor) setTimeout(() => { const el = document.getElementById(anchor); el && el.scrollIntoView({ behavior: "smooth" }); }, 60);
  };
  const openProfile = (p) => { setSelected(p); go("detail"); };
  const handleInterest = (p) => { setInterestFor(p); };
  const sendInterest = (p) => { onInterest && onInterest(p); setInterestFor(null); };
  const handleChat = (p) => { setChatWith(p); };
  const pickPlan = (p) => { if (p.amount === 0) { go("dashboard"); return; } setSubPlan(p); };

  return (
    <div ref={scrollRef} className="relative bg-white" style={{ fontFamily: SANS, color: DARK }} data-testid="sathibd-app">
      <style>{`
        @keyframes sb-ring { 0%{transform:scale(.4);opacity:0} 40%{opacity:1} 100%{transform:scale(1.1);opacity:0} }
        @keyframes sb-fadeout { to { opacity:0; visibility:hidden } }
        @keyframes sb-fadeup { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        @keyframes sb-kenburns { 0%{transform:scale(1)} 100%{transform:scale(1.14)} }
        @keyframes sb-fadein { from{opacity:0} to{opacity:1} }
        @keyframes sb-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        .sb-kenburns{ animation: sb-kenburns 16s ease-in-out infinite alternate; }
        .sb-fadein{ animation: sb-fadein .9s ease both; }
        .sb-float{ animation: sb-float 4.5s ease-in-out infinite; }
      `}</style>
      {loading && <Loader />}

      <TopBar lang={lang} onSearch={() => go("profiles")} />
      <Navbar lang={lang} go={go} page={page} />

      {page === "home" && <HomePage lang={lang} go={go} cfg={cfg} profiles={profiles} onHeroSearch={(f) => { setPrefill(f); go("profiles"); }} />}
      {page === "profiles" && <ProfilesPage lang={lang} profiles={profiles} openProfile={openProfile} onInterest={handleInterest} onChat={handleChat} prefill={prefill} />}
      {page === "detail" && <ProfileDetailPage lang={lang} profile={selected} profiles={profiles} openProfile={openProfile} onInterest={handleInterest} onChat={handleChat} go={go} />}
      {page === "plans" && <PlansPage lang={lang} plans={plans} onPick={pickPlan} />}
      {page === "dashboard" && <DashboardPage lang={lang} profiles={profiles} openProfile={openProfile} />}
      {page === "register" && <RegisterPage lang={lang} go={go} />}
      {(page === "about" || page === "faq" || page === "contact") && (
        <div className="max-w-3xl mx-auto px-6 py-16 text-center" style={{ fontFamily: SANS }}>
          <Label>SathiBD</Label>
          <H2 center>{page === "about" ? T(lang, "About SathiBD", "SathiBD সম্পর্কে") : page === "faq" ? "FAQ" : T(lang, "Contact Us", "যোগাযোগ")}</H2>
          <p className="text-slate-500 mt-3">{T(lang, "Bangladesh's most trusted matrimony portal — OTP-verified profiles, Robi subscription billing, and SMS match alerts.", "বাংলাদেশের সবচেয়ে বিশ্বস্ত বিবাহ পোর্টাল — OTP যাচাইকৃত প্রোফাইল, রবি বিলিং, এবং SMS মিল সতর্কতা।")}</p>
          <div className="mt-4 text-sm text-slate-600">📞 +880 1700-000000 · 📧 hello@sathibd.com</div>
          <GoldBtn testid="sathibd-misc-register" onClick={() => go("register")}>{T(lang, "Register for free", "বিনামূল্যে রেজিস্টার")}</GoldBtn>
        </div>
      )}

      <Footer lang={lang} go={go} />

      {interestFor && <InterestModal profile={interestFor} lang={lang} onClose={() => setInterestFor(null)} onSend={sendInterest} />}
      {chatWith && <ChatPopup profile={chatWith} lang={lang} onClose={() => setChatWith(null)} />}
      {subPlan && <SubscribeFlow plan={subPlan} lang={lang} onClose={() => setSubPlan(null)} onPhoneSubmit={onPhoneSubmit} onOtpVerify={onOtpVerify} onSubscribe={onSubscribe} onDone={() => { setSubPlan(null); go("dashboard"); }} />}
    </div>
  );
};

/* ---------------- Android screens (compact, for and-sathibd) ---------------- */
export const sathibdAndroidScreens = (lang) => ([
  { id: "splash", label: T(lang, "Splash", "স্প্ল্যাশ"), render: (ctx) => (
    <div className="h-full grid place-items-center text-center" style={{ background: `linear-gradient(140deg, ${GOLD}, ${GOLD_DK})` }}>
      <div><div className="text-5xl">💍</div><div className="text-2xl font-bold mt-2 text-white" style={{ fontFamily: SERIF }}>SathiBD</div><div className="text-[11px] text-white/80 mt-1">{T(lang, "Find your right match", "আপনার সাথী খুঁজুন")}</div><button onClick={ctx.next} className="mt-4 text-xs font-bold px-4 py-1.5 rounded-full bg-white" style={{ color: GOLD_DK }} data-testid="emu-sathibd-start">{T(lang, "Get Started", "শুরু করুন")}</button></div>
    </div>
  ) },
  { id: "otp", label: "OTP", render: (ctx) => (
    <div className="h-full p-5 flex flex-col"><div className="text-center text-3xl mt-3">📱</div><div className="text-center font-bold mt-1" style={{ color: DARK, fontFamily: SERIF }}>{T(lang, "Verify Number", "নম্বর যাচাই")}</div><input defaultValue="+880 1700-000000" className="border rounded-lg p-2.5 text-xs mt-4 font-mono" style={{ borderColor: BORDER }} /><button onClick={ctx.next} className="mt-3 font-bold text-sm py-2.5 rounded-lg" style={{ background: GOLD, color: DARK }} data-testid="emu-sathibd-otp">{T(lang, "Send OTP", "OTP পাঠান")}</button></div>
  ) },
  { id: "browse", label: T(lang, "Browse", "ব্রাউজ"), render: (ctx) => (
    <div className="h-full overflow-y-auto p-3" style={{ background: LIGHT }}>{PROFILES.slice(0, 4).map((p) => (
      <div key={p.id} className="bg-white rounded-xl p-2.5 mb-2 flex items-center gap-2" style={{ border: `1px solid ${BORDER}` }}><FaceAvatar src={p.photo} letter={p.nameEn.replace(/^(Ms\.|Md\.)\s*/, "")[0]} c1={p.c1} c2={p.c2} size={40} ring={false} /><div className="flex-1"><div className="text-xs font-bold" style={{ color: DARK }}>{p.nameEn}</div><div className="text-[10px] text-slate-500">{p.age} · {p.city} · {p.profession}</div></div><button onClick={ctx.next} className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: GOLD, color: DARK }} data-testid={`emu-sathibd-view-${p.id}`}>View</button></div>
    ))}</div>
  ) },
  { id: "detail", label: T(lang, "Profile", "প্রোফাইল"), render: (ctx) => (
    <div className="h-full flex flex-col"><div style={{ height: 150 }}><Photo src={UNS(WED.hero, 400)} alt="Couple" c1="#f6c1c1" c2="#e0114a" rounded={0} kenburns /></div><div className="p-3 flex-1"><div className="font-bold" style={{ fontFamily: SERIF, color: DARK }}>Ms. Rahima Akter</div><div className="text-[11px] text-slate-500">26 · Dhaka · Software Engineer</div><button onClick={ctx.next} className="w-full mt-3 font-bold text-sm py-2.5 rounded-lg" style={{ background: GOLD, color: DARK }} data-testid="emu-sathibd-interest">💌 {T(lang, "Send Interest", "আগ্রহ পাঠান")}</button></div></div>
  ) },
  { id: "done", label: T(lang, "Sent", "পাঠানো"), render: (ctx) => (
    <div className="h-full grid place-items-center text-center p-4"><div><div className="w-16 h-16 mx-auto rounded-full grid place-items-center text-3xl text-white" style={{ background: GREEN }}>✓</div><div className="font-bold mt-2" style={{ fontFamily: SERIF, color: DARK }}>{T(lang, "Interest Sent!", "আগ্রহ পাঠানো হয়েছে!")}</div><div className="text-[11px] text-slate-500 mt-1">{T(lang, "SMS notification delivered via Robi", "রবি দিয়ে SMS পাঠানো হয়েছে")}</div><button onClick={() => ctx.goto(0)} className="mt-3 text-xs font-bold px-4 py-1.5 rounded-full" style={{ background: GOLD, color: DARK }} data-testid="emu-sathibd-home">{T(lang, "Back Home", "হোমে ফিরুন")}</button></div></div>
  ) },
]);

export default SathiBDWebPreview;
