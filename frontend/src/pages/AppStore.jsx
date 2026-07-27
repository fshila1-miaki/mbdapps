import React, { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../mocks/data";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Logo } from "../components/Layout";
import { OrbitMark } from "../components/OrbitMark";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../components/ui/dialog";
import { Search, Star, ChevronLeft, ChevronRight, Mail, Twitter, Facebook, Share2, Heart } from "lucide-react";
import { toast } from "sonner";
import AppArt from "../components/illustrations/AppArt";

const FEATURED_IMG = "https://images.unsplash.com/photo-1526498460520-4c246339dccb?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400";
const HEAD = { fontFamily: "'Outfit', sans-serif" };

const TypeBadge = ({ type }) => {
  if (type === "android") return <span className="absolute top-2 right-2 text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold shadow-md">ANDROID</span>;
  if (type === "web") return <span className="absolute top-2 right-2 text-[9px] bg-[#2563EB] text-white px-2 py-0.5 rounded-full font-bold shadow-md">WEB</span>;
  return null;
};

const AppCard = ({ app, onClick }) => (
  <button onClick={onClick} data-testid={`appstore-card-${app.id}`} className="group text-left w-full">
    <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1">
      <AppArt id={app.artId} initials={app.name?.[0]} />
      <TypeBadge type={app.type} />
    </div>
    <h4 className="font-semibold tracking-tight truncate text-sm mt-2 text-zinc-900" style={HEAD}>{app.name}</h4>
    <p className="text-xs text-zinc-500 truncate">{app.developer}</p>
    <div className="flex items-center gap-1 mt-0.5 text-xs text-zinc-600">
      <span className="font-medium text-zinc-800">{app.rating}</span>
      <Star size={11} className="fill-amber-400 text-amber-400" />
      <span className="text-zinc-400 truncate">· {app.category}</span>
    </div>
  </button>
);

const PlayRow = ({ title, apps, onOpen, onSeeAll, testid }) => (
  <section data-testid={testid}>
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900" style={HEAD}>{title}</h2>
      <button onClick={onSeeAll} data-testid={`${testid}-see-all`} className="text-sm text-[#2563EB] font-semibold hover:underline flex items-center gap-0.5">See all <ChevronRight size={15} /></button>
    </div>
    <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-4 px-4">
      {apps.map((a) => (
        <div key={a.id} className="w-[132px] sm:w-[150px] flex-shrink-0 snap-start">
          <AppCard app={a} onClick={() => onOpen(a)} />
        </div>
      ))}
    </div>
  </section>
);

export const AppStore = () => {
  const { storeApps, appStoreUser, setAppStoreUser } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [chip, setChip] = useState("For you");
  const [otpOpen, setOtpOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(1);

  const openApp = (a) => navigate(`/appstore/${a.id}`);
  const CHIPS = ["For you", "Top charts", "New", ...CATEGORIES];

  const byRating = [...storeApps].sort((a, b) => b.rating - a.rating);
  const byNew = [...storeApps].sort((a, b) => b.id.localeCompare(a.id));
  const byUsers = [...storeApps].sort((a, b) => (b.subscribers || 0) - (a.subscribers || 0));
  const featured = storeApps.find((a) => a.popular) || byUsers[0];

  const showRows = !search && chip === "For you";
  let gridApps = storeApps;
  if (search) gridApps = storeApps.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.developer.toLowerCase().includes(search.toLowerCase()));
  else if (chip === "Top charts") gridApps = byRating;
  else if (chip === "New") gridApps = byNew;
  else if (CATEGORIES.includes(chip)) gridApps = storeApps.filter((a) => a.category === chip);

  const gridCls = "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-4 gap-y-6";

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-16 flex items-center gap-3 sm:gap-6">
          <Link to="/appstore" data-testid="bdapps-logo" className="flex items-center gap-2 shrink-0">
            <OrbitMark size={28} className="text-[#2563EB]" />
            <span className="text-xl font-bold tracking-tight text-zinc-900 hidden sm:block" style={HEAD}>Orbit</span>
          </Link>
          <div className="relative flex-1 max-w-xl">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input data-testid="store-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for apps & games"
              className="w-full h-10 pl-11 pr-4 rounded-full bg-zinc-100 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:bg-white transition-all" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button onClick={() => navigate("/digital")} data-testid="create-app-btn" className="bg-[#2563EB] hover:bg-[#1D4ED8] rounded-full hidden sm:flex active:scale-95 transition-all"><span className="mr-1">+</span> Create App</Button>
            {appStoreUser
              ? <Button variant="outline" data-testid="store-user" className="rounded-full">{appStoreUser.phone}</Button>
              : <Button data-testid="store-signin" onClick={() => { setOtpOpen(true); setOtpStep(1); }} variant="outline" className="rounded-full">Sign In</Button>}
          </div>
        </div>
      </header>

      {/* Category chips */}
      <div className="bg-white/90 backdrop-blur-md border-b border-zinc-100 sticky top-16 z-30">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {CHIPS.map((c) => (
            <button key={c} onClick={() => { setChip(c); setSearch(""); }} data-testid={`chip-${c}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-all active:scale-95 ${chip === c && !search ? "bg-[#2563EB] text-white shadow-sm" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Featured banner (For you only) */}
      {showRows && featured && (
        <section className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-6">
          <div onClick={() => openApp(featured)} data-testid="featured-banner"
            className="relative rounded-3xl overflow-hidden h-[220px] sm:h-[290px] shadow-lg group cursor-pointer">
            <img src={FEATURED_IMG} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
            <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest font-bold text-white bg-white/15 backdrop-blur px-3 py-1 rounded-full border border-white/20">Editor's Choice</span>
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 flex items-end gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-white/20" style={{ width: 76, height: 76, flex: "0 0 76px" }}>
                <AppArt id={featured.artId} initials={featured.name?.[0]} />
              </div>
              <div className="flex-1 min-w-0 text-white">
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight truncate" style={HEAD}>{featured.name}</h2>
                <p className="text-sm text-white/80 truncate">{featured.developer} · {featured.category}</p>
                <div className="flex items-center gap-1 text-xs text-white/90 mt-1">
                  <Star size={12} className="fill-amber-400 text-amber-400" /><span className="font-bold">{featured.rating}</span>
                  <span className="text-white/60">· {(featured.subscribers / 1000).toFixed(0)}K+ users</span>
                </div>
              </div>
              <Button onClick={(e) => { e.stopPropagation(); openApp(featured); }} data-testid="featured-install"
                className="bg-white text-zinc-900 hover:bg-zinc-100 rounded-full font-bold px-6 sm:px-10 h-11 shrink-0 active:scale-95 transition-all">
                {featured.type === "android" ? "Install" : "Open"}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <main className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 space-y-11">
        {showRows ? (
          <>
            <PlayRow title="Recommended for you" apps={byUsers.slice(0, 8)} onOpen={openApp} onSeeAll={() => setChip("Top charts")} testid="row-recommended" />
            <PlayRow title="Top charts" apps={byRating.slice(0, 8)} onOpen={openApp} onSeeAll={() => setChip("Top charts")} testid="row-top" />
            <PlayRow title="New & updated" apps={byNew.slice(0, 8)} onOpen={openApp} onSeeAll={() => setChip("New")} testid="row-new" />
            <section>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 mb-4" style={HEAD}>Browse all apps</h2>
              <div className={gridCls}>{storeApps.map((a) => <AppCard key={a.id} app={a} onClick={() => openApp(a)} />)}</div>
            </section>
          </>
        ) : (
          <section>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 mb-5" style={HEAD}>{search ? `Results for "${search}"` : chip}</h2>
            <div className={gridCls}>{gridApps.map((a) => <AppCard key={a.id} app={a} onClick={() => openApp(a)} />)}</div>
            {gridApps.length === 0 && <p className="text-zinc-500 py-10 text-center">No apps found. Try a different search.</p>}
          </section>
        )}
      </main>

      <footer className="border-t border-zinc-200 bg-zinc-50 py-10">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between gap-4 items-center">
          <Logo />
          <div className="flex items-center gap-2 text-sm text-zinc-600"><Mail size={14} /> support@orbit.com</div>
          <div className="flex items-center gap-3 text-zinc-400"><Twitter size={16} className="hover:text-[#2563EB] cursor-pointer transition-colors" /><Facebook size={16} className="hover:text-[#2563EB] cursor-pointer transition-colors" /></div>
        </div>
      </footer>

      {/* OTP Dialog */}
      <Dialog open={otpOpen} onOpenChange={setOtpOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Sign in via OTP</DialogTitle><DialogDescription>{otpStep === 1 ? "Enter your Robi mobile number" : "Enter the 4-digit OTP sent to your phone"}</DialogDescription></DialogHeader>
          {otpStep === 1 ? (
            <div><Label>Mobile Number</Label><Input data-testid="otp-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+8801711000000" /></div>
          ) : (
            <div><Label>OTP</Label><Input data-testid="otp-code" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={4} placeholder="1234" /><p className="text-xs text-zinc-500 mt-1">Hint: any 4 digits will work in this demo.</p></div>
          )}
          <DialogFooter>
            {otpStep === 1
              ? <Button data-testid="otp-send" onClick={() => { if (!phone) return toast.error("Enter mobile"); toast.success("OTP sent (mock: 1234)"); setOtpStep(2); }} className="bg-[#2563EB] hover:bg-[#1D4ED8]">Send OTP</Button>
              : <Button data-testid="otp-verify" onClick={() => { if (otp.length !== 4) return toast.error("4 digits"); setAppStoreUser({ phone }); toast.success("Signed in!"); setOtpOpen(false); setOtpStep(1); setOtp(""); }} className="bg-[#2563EB] hover:bg-[#1D4ED8]">Verify</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const AppStoreDetail = () => {
  const { id } = useParams();
  const { storeApps, appStoreUser, setAppStoreUser } = useApp();
  const navigate = useNavigate();
  const app = storeApps.find((a) => a.id === id);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [readMore, setReadMore] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [otpStep, setOtpStep] = useState(1);
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");

  if (!app) return <div className="p-8">App not found. <Link to="/appstore" className="text-[#2563EB] underline">Back</Link></div>;
  const fromDev = storeApps.filter((a) => a.developer === app.developer && a.id !== app.id).slice(0, 6);

  const stats = { rating: app.rating, reviews: 1248, subscribers: app.subscribers || 34500, version: "2.4.1", lastUpdated: "Jan 28, 2026" };
  const reviews = [
    { name: "Sabbir A.", initial: "S", stars: 5, date: "5 days ago", text: "Reliable and beautifully built. Works flawlessly on my phone." },
    { name: "Fahmida R.", initial: "F", stars: 4, date: "2 weeks ago", text: "Really useful. Would love a dark mode option in a future update." },
    { name: "Mahin I.", initial: "M", stars: 5, date: "1 month ago", text: "Best in its category. Highly recommend to everyone!" },
    { name: "Rahim K.", initial: "R", stars: 3, date: "2 months ago", text: "Decent overall, occasionally a little slow to load." },
  ];
  const breakdown = [{ stars: 5, pct: 68 }, { stars: 4, pct: 21 }, { stars: 3, pct: 7 }, { stars: 2, pct: 2 }, { stars: 1, pct: 2 }];
  const screenshots = [0, 1, 2, 3, 4];

  const requireSignIn = (action) => {
    if (appStoreUser) return action();
    setPendingAction(() => action);
    setOtpStep(1);
    setSignInOpen(true);
  };
  const sendOtp = () => { if (!phoneInput) return toast.error("Enter mobile"); toast.success("OTP sent (demo: any 4 digits)"); setOtpStep(2); };
  const verifyOtp = () => {
    if (otpInput.length !== 4) return toast.error("Enter 4-digit OTP");
    setAppStoreUser({ phone: phoneInput });
    setSignInOpen(false); setOtpInput("");
    toast.success("Signed in!");
    if (pendingAction) { const fn = pendingAction; setPendingAction(null); setTimeout(() => fn(), 100); }
  };
  const onSubscribe = () => {
    if (app.slug) return navigate(`/apps/${app.slug}`);
    requireSignIn(() => toast.success(`Subscribed to ${app.name}`));
  };
  const onWriteReview = () => requireSignIn(() => document.getElementById("write-review")?.scrollIntoView({ behavior: "smooth" }));

  const ctaConfig = app.type === "android"
    ? { label: "Install", classes: "bg-emerald-600 hover:bg-emerald-700" }
    : { label: "Open", classes: "bg-[#2563EB] hover:bg-[#1D4ED8]" };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="bg-white/90 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <Button variant="outline" onClick={() => navigate("/appstore")} data-testid="back-store" size="sm" className="rounded-full"><ChevronLeft size={14} className="mr-1" /> Store</Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 lg:px-8 py-6 lg:py-10 space-y-10">
        {/* Hero */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-lg flex-shrink-0">
            <AppArt id={app.artId} initials={app.name?.[0]} />
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <h1 className="text-3xl md:text-4xl tracking-tight font-bold leading-tight text-zinc-900" style={HEAD}>{app.name}</h1>
              <p className="text-[#2563EB] font-semibold text-sm">{app.developer}</p>
              <p className="text-xs text-zinc-500 mt-1">Contains ads · In-app purchases</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-600">
              <span className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /><span className="font-bold text-zinc-900">{stats.rating}</span> ({(stats.reviews / 1000).toFixed(1)}K)</span>
              <span className="text-zinc-300">·</span>
              <span><span className="font-bold text-zinc-900">{(stats.subscribers / 1000).toFixed(0)}K+</span> users</span>
              <span className="text-zinc-300">·</span>
              <span className="bg-zinc-100 px-2 py-0.5 rounded-full font-medium">{app.category}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button data-testid="subscribe-btn" onClick={onSubscribe} className={`${ctaConfig.classes} text-white h-11 px-10 rounded-full font-bold active:scale-95 transition-all`}>{ctaConfig.label}</Button>
              <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }} data-testid="share-btn" className="h-11 rounded-full"><Share2 size={14} className="mr-1" /> Share</Button>
              <Button variant="outline" data-testid="wishlist-btn" onClick={() => toast.success("Added to wishlist")} className="h-11 rounded-full"><Heart size={14} /></Button>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 border-y border-zinc-200 py-4">
          <Stat label="Rating" value={`${stats.rating}★`} />
          <Stat label="Reviews" value={stats.reviews.toLocaleString()} />
          <Stat label="Users" value={`${(stats.subscribers / 1000).toFixed(1)}K+`} />
          <Stat label="Version" value={stats.version} />
          <Stat label="Updated" value={stats.lastUpdated} />
        </div>

        {/* Screenshots */}
        <section data-testid="screenshots-carousel">
          <h2 className="text-xl font-bold tracking-tight mb-3 text-zinc-900" style={HEAD}>Preview</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3 -mx-4 px-4 snap-x">
            {screenshots.map((i) => (
              app.type === "android" ? (
                <div key={i} className="shrink-0 snap-start" data-testid={`screenshot-${i}`}>
                  <div className="bg-zinc-950 rounded-[1.75rem] p-1.5 border-4 border-zinc-800 shadow-xl">
                    <div className="w-44 h-80 rounded-2xl relative overflow-hidden bg-white">
                      <AppArt id={app.artId} initials={app.name?.[0]} />
                      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-zinc-950 rounded-full z-20"></div>
                      <div className="absolute bottom-8 left-0 right-0 text-center text-[10px] text-white font-bold drop-shadow-lg z-10">Screen {i + 1}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={i} className="shrink-0 snap-start" data-testid={`screenshot-${i}`}>
                  <div className="bg-zinc-200 rounded-xl overflow-hidden shadow-xl w-80">
                    <div className="bg-zinc-100 px-3 py-1.5 flex items-center gap-1.5 border-b border-zinc-300">
                      <div className="w-2 h-2 rounded-full bg-rose-400"></div><div className="w-2 h-2 rounded-full bg-amber-400"></div><div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <div className="ml-2 bg-white text-[10px] text-zinc-500 px-2 py-0.5 rounded flex-1 truncate">https://{app.slug || "app"}.orbit.app</div>
                    </div>
                    <div className="h-56 relative overflow-hidden bg-white">
                      <AppArt id={app.artId} initials={app.name?.[0]} />
                      <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white font-bold drop-shadow-lg">Page {i + 1}</div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </section>

        {/* About */}
        <section>
          <h2 className="text-xl font-bold tracking-tight mb-3 text-zinc-900" style={HEAD}>About this app</h2>
          <p className={`text-zinc-700 leading-relaxed ${!readMore ? "line-clamp-3" : ""}`}>
            {app.description} Built for the Bangladeshi market and optimized for the Robi network — works on any handset. Reliable delivery via the Orbit engine. Join thousands of happy users today.
          </p>
          <button onClick={() => setReadMore(!readMore)} data-testid="read-more" className="text-[#2563EB] font-semibold text-sm mt-1 hover:underline">{readMore ? "Show less" : "Read more"}</button>
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm font-mono mt-4">{app.instructions}</div>
        </section>

        {/* Ratings & Reviews */}
        <section>
          <h2 className="text-xl font-bold tracking-tight mb-4 text-zinc-900" style={HEAD}>Ratings &amp; Reviews</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div className="text-center sm:border-r sm:border-zinc-200">
              <div className="text-6xl font-bold tracking-tight text-zinc-900" style={HEAD}>{stats.rating}</div>
              <div className="flex justify-center gap-0.5 my-1">{[1, 2, 3, 4, 5].map((n) => <Star key={n} size={16} className={n <= Math.round(stats.rating) ? "fill-amber-400 text-amber-400" : "text-zinc-300"} />)}</div>
              <div className="text-xs text-zinc-500">{stats.reviews.toLocaleString()} reviews</div>
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              {breakdown.map((b) => (
                <div key={b.stars} className="flex items-center gap-2 text-xs">
                  <span className="w-4 font-mono text-zinc-500">{b.stars}</span>
                  <Star size={10} className="fill-amber-400 text-amber-400" />
                  <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${b.pct}%` }}></div></div>
                  <span className="w-8 text-right text-zinc-500">{b.pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <div key={i} className="border-b border-zinc-100 pb-4 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">{r.initial}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{r.name}</span>
                      <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((n) => <Star key={n} size={11} className={n <= r.stars ? "fill-amber-400 text-amber-400" : "text-zinc-300"} />)}</div>
                      <span className="text-xs text-zinc-400">{r.date}</span>
                    </div>
                    <p className="text-sm text-zinc-700 leading-relaxed mt-1">{r.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={onWriteReview} variant="outline" className="mt-4 rounded-full" data-testid="write-review-btn">Write a Review</Button>
        </section>

        {appStoreUser && (
          <section id="write-review" className="border border-zinc-200 rounded-2xl p-6">
            <h3 className="font-semibold text-lg tracking-tight mb-3" style={HEAD}>Your review</h3>
            <div className="flex gap-1 mb-3">{[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => setRating(n)} data-testid={`star-${n}`}><Star size={28} className={n <= rating ? "fill-amber-400 text-amber-400" : "text-zinc-300"} /></button>)}</div>
            <textarea data-testid="review-text" placeholder="Share your experience..." value={review} onChange={(e) => setReview(e.target.value)} className="w-full border border-zinc-200 rounded-xl p-3 text-sm" rows={3}></textarea>
            <Button onClick={() => { if (!rating) return toast.error("Pick a rating"); toast.success("Review submitted!"); setReview(""); setRating(0); }} className="mt-2 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-full" data-testid="submit-review">Submit Review</Button>
          </section>
        )}

        {fromDev.length > 0 && (
          <section>
            <h3 className="text-xl font-bold tracking-tight mb-4 text-zinc-900" style={HEAD}>More from {app.developer}</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">{fromDev.map((a) => <AppCard key={a.id} app={a} onClick={() => navigate(`/appstore/${a.id}`)} />)}</div>
          </section>
        )}
      </main>

      <Dialog open={signInOpen} onOpenChange={(o) => { if (!o) { setSignInOpen(false); setPendingAction(null); setOtpStep(1); setOtpInput(""); } }}>
        <DialogContent data-testid="signin-modal" className="max-w-md">
          <DialogHeader><DialogTitle>Sign In Required</DialogTitle><DialogDescription>Please sign in to continue.</DialogDescription></DialogHeader>
          {otpStep === 1 ? (
            <div className="space-y-2"><Label>Phone Number</Label><Input data-testid="signin-phone" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} placeholder="01812345678" /></div>
          ) : (
            <div className="space-y-2"><Label>Enter OTP</Label><Input data-testid="signin-otp" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} maxLength={4} placeholder="1234" /><p className="text-xs text-zinc-500">Demo: any 4 digits will work</p></div>
          )}
          <DialogFooter className="!justify-between">
            <button data-testid="signin-cancel" onClick={() => { setSignInOpen(false); setPendingAction(null); }} className="text-sm text-zinc-500 hover:text-zinc-900">Cancel</button>
            {otpStep === 1
              ? <Button onClick={sendOtp} className="bg-[#2563EB] hover:bg-[#1D4ED8]" data-testid="signin-request">Request OTP</Button>
              : <Button onClick={verifyOtp} className="bg-[#2563EB] hover:bg-[#1D4ED8]" data-testid="signin-verify">Verify</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="text-center px-2">
    <div className="text-lg md:text-xl font-bold tracking-tight text-zinc-900" style={{ fontFamily: "'Outfit', sans-serif" }}>{value}</div>
    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{label}</div>
  </div>
);

export default AppStore;
