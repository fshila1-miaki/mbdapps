import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { toast } from "sonner";
import { Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

const useCountUp = (target, run) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf, start, dur = 1500;
    const tick = (t) => { if (!start) start = t; const p = Math.min(1, (t - start) / dur); setVal(Math.round(target * p)); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run]);
  return val;
};

const StatCard = ({ label, target, suffix = "", prefix = "", trend, run }) => {
  const v = useCountUp(target, run);
  return (
    <div data-testid={`addon-stat-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{label}</div>
      <div className="text-2xl font-bold mt-1">{prefix}{v.toLocaleString()}{suffix}</div>
      {trend && <div className="text-[10px] font-bold text-emerald-600 mt-0.5">▲ {trend}</div>}
    </div>
  );
};

const CHANNELS = [
  { id: "push", icon: "🔔", name: "Push Notifications", pill: { l: "Most Popular", c: "bg-rose-100 text-rose-700" }, price: "From BDT 500/month", pitch: "Reach your app users instantly. 95% open rate vs 20% email.", stats: ["3x higher engagement than email", "Avg open rate: 94%"], features: ["Scheduled delivery", "Audience segments", "A/B testing", "Rich media", "Delivery analytics"] },
  { id: "whatsapp", icon: "💬", name: "WhatsApp Business Messaging", pill: { l: "High Engagement", c: "bg-emerald-100 text-emerald-700" }, price: "From BDT 1,200/month", pitch: "Send OTPs, alerts, and campaigns where your customers already are.", stats: ["98% read rate", "Response rate: 45%"], features: ["OTP via WhatsApp", "Template campaigns", "Chatbot builder", "Broadcast", "Two-way messaging"] },
  { id: "imo", icon: "📲", name: "Imo Messaging", pill: { l: "BD Exclusive", c: "bg-blue-100 text-blue-700" }, price: "From BDT 800/month", pitch: "Bangladesh's second largest messaging platform. Reach users others can't.", stats: ["40M+ Imo users in BD", "Lower competition"], features: ["Mass messaging", "Service alerts", "Promotional content", "Audio/video call ads"] },
  { id: "fb", icon: "📘", name: "Facebook & Instagram Ads", pill: { l: "Best for Reach", c: "bg-indigo-100 text-indigo-700" }, price: "From BDT 2,000/month + ad spend", pitch: "50M+ Bangladeshis on Facebook. Target by age, city, and interest.", stats: ["50M FB users in BD", "Avg CPM: BDT 45"], features: ["Carousel & video ads", "Lookalike targeting", "Retargeting pixel", "A/B creative", "Daily ROI reporting"] },
  { id: "uac", icon: "🎯", name: "Google UAC", pill: { l: "For App Growth", c: "bg-orange-100 text-orange-700" }, price: "From BDT 3,000/month + ad spend", pitch: "AI auto-places your app ads on Search, Play, YouTube, and Display.", stats: ["40% lower CPA vs manual", "5x faster install growth"], features: ["Play install campaigns", "YouTube video ads", "Search keyword ads", "Auto bid", "Attribution"] },
  { id: "search", icon: "🔍", name: "Google Search Ads", pill: { l: "High Intent", c: "bg-yellow-100 text-yellow-700" }, price: "From BDT 1,500/month + ad spend", pitch: "Be first when customers search for your service in Bangladesh.", stats: ["Avg CTR: 6.8%", "ROI: 320%"], features: ["Keyword bidding", "Dhaka/BD geo-targeting", "Ad copy support", "Smart bidding", "Landing page tips"] },
];

const BONUS_CHANNELS = [
  { id: "sms", l: "SMS Marketing", price: "BDT 0.25/SMS", desc: "Reach every phone, even feature phones" },
  { id: "influencer", l: "Influencer Connect", price: "Custom pricing", desc: "BD's top influencer network. 10M+ followers." },
  { id: "email", l: "Email Marketing", price: "BDT 600/month", desc: "Beautiful email campaigns with 99% delivery" },
];

const ANALYTICS_FEATURES = [
  { id: "rev", icon: "💰", title: "Revenue Intelligence", tier: "Core — Included", bg: "from-amber-50 to-yellow-50", desc: "Track every BDT. Revenue by app, day, operator, and payment method.", points: ["Real-time counter", "Monthly forecasting", "Payment method breakdown", "Operator-level revenue"] },
  { id: "sub", icon: "👥", title: "Subscriber Analytics", tier: "Core — Included", bg: "from-blue-50 to-cyan-50", desc: "Who are your subscribers? Where do they come from? Why do they leave?", points: ["Growth timeline", "Acquisition channels", "Cohort retention", "Churn prediction"] },
  { id: "msg", icon: "📬", title: "Message Delivery Intel", tier: "Core — Included", bg: "from-emerald-50 to-green-50", desc: "Full visibility into every SMS — delivery rates, failures, optimal send times.", points: ["Heatmap by hour", "Failure reasons", "Operator-level delivery"] },
  { id: "behavior", icon: "🔍", title: "User Behavior Tracking", tier: "Premium — BDT 1,500/mo", bg: "from-purple-50 to-pink-50", desc: "See exactly what users do — pages, funnels, drop-offs.", points: ["Page traffic", "Funnel visualization", "Click heatmaps", "A/B tests"] },
  { id: "roi", icon: "🎯", title: "Campaign ROI Dashboard", tier: "Premium — BDT 2,000/mo", bg: "from-rose-50 to-orange-50", desc: "Return on every campaign across all 6 channels in one view.", points: ["CPA by channel", "Revenue per campaign", "ROAS calculator", "Budget AI tips"] },
  { id: "bi", icon: "📋", title: "Business Intelligence Reports", tier: "Enterprise — BDT 5,000/mo", bg: "from-slate-50 to-gray-50", desc: "Auto-generated board-ready reports every week. Zero manual work.", points: ["Weekly/monthly PDFs", "Custom KPIs", "Portfolio view", "Benchmarking"] },
];

const CampaignBuilder = ({ open, onClose }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ goal: "", channels: [], age: 30, location: "Dhaka", budget: 25000, days: 30 });
  const next = () => setStep((s) => Math.min(4, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));
  const reach = Math.round((data.budget / 12) * (data.channels.length || 1));
  const installs = Math.round(reach / 68);
  const cpi = data.budget && installs ? (data.budget / installs).toFixed(2) : "—";
  const launch = () => { toast.success("🎉 Campaign live within 24 hours. Track in Analytics."); onClose(); setStep(0); };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent data-testid="campaign-modal" className="max-w-2xl">
        <DialogTitle>Build a Campaign — Step {step + 1} of 5</DialogTitle>
        <DialogDescription>Reach across multiple channels</DialogDescription>
        {step === 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[{ id: "installs", e: "📱", l: "Get App Installs" }, { id: "subs", e: "👥", l: "Grow Subscribers" }, { id: "sales", e: "💰", l: "Drive Sales" }, { id: "brand", e: "🌟", l: "Brand Awareness" }].map((g) => (
              <button key={g.id} data-testid={`camp-goal-${g.id}`} onClick={() => setData({ ...data, goal: g.id })} className={`p-4 border-2 rounded-xl text-left ${data.goal === g.id ? "border-[#2563EB] bg-rose-50" : "border-slate-200"}`}>
                <div className="text-3xl">{g.e}</div>
                <div className="font-bold mt-1">{g.l}</div>
              </button>
            ))}
          </div>
        )}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {CHANNELS.map((c) => (
              <button key={c.id} data-testid={`camp-ch-${c.id}`} onClick={() => setData({ ...data, channels: data.channels.includes(c.id) ? data.channels.filter((x) => x !== c.id) : [...data.channels, c.id] })} className={`p-3 border-2 rounded-xl text-left ${data.channels.includes(c.id) ? "border-[#2563EB] bg-rose-50" : "border-slate-200"}`}>
                <div className="text-2xl">{c.icon}</div>
                <div className="text-xs font-bold mt-1">{c.name}</div>
              </button>
            ))}
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3 mt-2">
            <div><label className="text-xs">Age: {data.age}</label><input type="range" min="18" max="65" value={data.age} onChange={(e) => setData({ ...data, age: +e.target.value })} className="w-full" /></div>
            <div><label className="text-xs">Location</label><select value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} className="w-full border border-slate-200 rounded p-2 text-sm">{["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "All BD"].map((c) => <option key={c}>{c}</option>)}</select></div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3 mt-2">
            <div><label className="text-xs">Budget: BDT {data.budget.toLocaleString()}</label><input type="range" min="5000" max="100000" step="1000" value={data.budget} onChange={(e) => setData({ ...data, budget: +e.target.value })} className="w-full" /></div>
            <div><label className="text-xs">Duration: {data.days} days</label><input type="range" min="7" max="90" value={data.days} onChange={(e) => setData({ ...data, days: +e.target.value })} className="w-full" /></div>
          </div>
        )}
        {step === 4 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-2">
            <div className="text-xs uppercase tracking-widest font-bold text-emerald-700">Estimated Results</div>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <div><div className="text-xs text-slate-500">Reach</div><div data-testid="camp-reach" className="text-xl font-bold">{reach.toLocaleString()}</div></div>
              <div><div className="text-xs text-slate-500">Installs</div><div className="text-xl font-bold">{installs.toLocaleString()}</div></div>
              <div><div className="text-xs text-slate-500">CPI</div><div className="text-xl font-bold">৳ {cpi}</div></div>
            </div>
          </div>
        )}
        <div className="flex justify-between mt-3">
          {step > 0 ? <Button variant="outline" size="sm" onClick={prev}>← Back</Button> : <span />}
          {step < 4 ? <Button data-testid="camp-next" size="sm" onClick={next} className="bg-[#2563EB]">Next →</Button> : <Button data-testid="camp-launch" size="sm" onClick={launch} className="bg-[#2563EB]">Launch Campaign</Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TrialModal = ({ open, onClose }) => {
  const [email, setEmail] = useState(""); const [phone, setPhone] = useState("");
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent data-testid="trial-modal" className="max-w-md">
        <DialogTitle>Start Free 14-Day Trial</DialogTitle>
        <DialogDescription>Full Analytics access for 14 days</DialogDescription>
        <Input data-testid="trial-email" placeholder="Contact email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
        <Input data-testid="trial-phone" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2" />
        <Button data-testid="trial-activate" disabled={!email} onClick={() => { toast.success("🎉 Analytics live! Check your Reports section."); onClose(); }} className="mt-3 w-full bg-[#2563EB]">Activate Free Trial</Button>
      </DialogContent>
    </Dialog>
  );
};

const AddOns = () => {
  const { t } = useTranslation();
  const [campOpen, setCampOpen] = useState(false);
  const [trialOpen, setTrialOpen] = useState(false);
  const [run, setRun] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setRun(true), { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const growth = Array.from({ length: 90 }, (_, i) => ({ d: i, v: 8000 + i * 53 + Math.sin(i / 5) * 200 }));
  const revenue = Array.from({ length: 30 }, (_, i) => ({ d: `D${i + 1}`, v: 7000 + Math.sin(i / 3) * 1500 + i * 80 }));
  const channels = [{ name: "SMS", value: 40, color: "#2563EB" }, { name: "Subscription", value: 35, color: "#09090B" }, { name: "CaaS", value: 15, color: "#f59e0b" }, { name: "Web", value: 10, color: "#06b6d4" }];

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl">
        {/* Hero */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-900 to-slate-900 text-white rounded-2xl px-6 py-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 30% 50%, #2563EB, transparent 60%)" }}></div>
          <div className="relative">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">⚡ {t("addonsPage.heroTitle")}</h1>
            <p className="text-sm opacity-80 mt-1 max-w-2xl">{t("addonsPage.heroSub")}</p>
            <div className="flex flex-wrap gap-6 mt-4 text-xs">
              <div><b className="text-2xl text-amber-400">500%</b><div className="opacity-70">{t("addonsPage.statGrowth")}</div></div>
              <div><b className="text-2xl text-emerald-400">BDT 2.8M</b><div className="opacity-70">{t("addonsPage.statRevenue")}</div></div>
              <div><b className="text-2xl text-rose-300">98%</b><div className="opacity-70">{t("addonsPage.statRetention")}</div></div>
            </div>
          </div>
        </div>

        {/* Section A — Promote */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">🚀 Promote Your App</h2>
            <p className="text-sm text-slate-500">Reach millions. Convert subscribers. Grow revenue.</p>
          </div>
          {/* Multi-channel CTA */}
          <div className="bg-gradient-to-br from-slate-900 to-rose-900 text-white rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-lg font-bold">Run one campaign. Reach across 6 channels simultaneously.</div>
              <div className="flex gap-2 mt-2">{CHANNELS.slice(0, 6).map((c) => <span key={c.id} className="text-xl">{c.icon}</span>)}</div>
            </div>
            <Button data-testid="open-campaign-builder" onClick={() => setCampOpen(true)} className="bg-[#2563EB] gap-1"><Sparkles size={14} /> Build a Campaign</Button>
          </div>

          {/* 6 channel cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHANNELS.map((c) => (
              <div key={c.id} data-testid={`channel-card-${c.id}`} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{c.icon}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${c.pill.c}`}>{c.pill.l}</span>
                </div>
                <h3 className="font-bold text-lg mt-2">{c.name}</h3>
                <div className="text-xs font-semibold text-emerald-700 mt-0.5">{c.price}</div>
                <p className="text-xs text-slate-600 mt-2">{c.pitch}</p>
                <div className="flex flex-wrap gap-1 mt-2">{c.stats.map((s) => <span key={s} className="text-[10px] bg-slate-50 px-1.5 py-0.5 rounded">{s}</span>)}</div>
                <ul className="text-xs text-slate-600 mt-2 space-y-0.5">{c.features.map((f) => <li key={f}>✓ {f}</li>)}</ul>
                <Button data-testid={`addon-add-${c.id}`} onClick={() => toast.success(`Added ${c.name} to plan`)} size="sm" className="mt-3 w-full bg-[#09090B] hover:bg-[#2563EB]">Add to Plan</Button>
              </div>
            ))}
          </div>

          {/* Bonus channels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {BONUS_CHANNELS.map((b) => (
              <div key={b.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <div><div className="font-bold text-sm">{b.l}</div><div className="text-[11px] text-slate-500">{b.desc}</div><div className="text-xs font-semibold text-emerald-700">{b.price}</div></div>
                <Button data-testid={`addon-bonus-${b.id}`} onClick={() => toast.success(`Added ${b.l}`)} variant="outline" size="sm">Add</Button>
              </div>
            ))}
          </div>
        </section>

        {/* Section B — Analytics */}
        <section className="space-y-4" ref={ref}>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">📊 Orbit Analytics</h2>
            <p className="text-sm text-slate-500">Know exactly what's working. Double down on growth.</p>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Revenue This Month" target={284500} prefix="BDT " trend="+23.4%" run={run} />
            <StatCard label="Active Subscribers" target={12840} trend="+8.1%" run={run} />
            <StatCard label="Messages Delivered" target={482910} trend="+15.2%" run={run} />
            <StatCard label="Churn Rate" target={21} suffix="%" trend="-0.4% improvement" run={run} />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Subscriber Growth — Last 90 Days</div>
              <div className="h-56 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <LineChart data={growth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="d" fontSize={10} /><YAxis fontSize={10} /><Tooltip />
                    <Line type="monotone" dataKey="v" stroke="#2563EB" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Revenue by Channel</div>
              <div className="h-56 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <PieChart>
                    <Pie data={channels} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={2}>
                      {channels.map((c, i) => <Cell key={i} fill={c.color} />)}
                    </Pie>
                    <Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bar chart + table */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Daily Revenue — Last 30 Days</div>
            <div className="h-40 w-full min-h-[160px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={revenue}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="d" fontSize={9} interval={3} /><YAxis fontSize={10} /><Tooltip /><Bar dataKey="v" fill="#2563EB" radius={[3, 3, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ANALYTICS_FEATURES.map((f) => (
              <div key={f.id} data-testid={`analytics-feature-${f.id}`} className={`rounded-xl p-4 bg-gradient-to-br ${f.bg} border border-slate-200`}>
                <div className="flex items-start justify-between">
                  <div className="text-3xl">{f.icon}</div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white">{f.tier}</span>
                </div>
                <h3 className="font-bold mt-2">{f.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{f.desc}</p>
                <ul className="text-xs mt-2 space-y-0.5">{f.points.map((p) => <li key={p}>✓ {p}</li>)}</ul>
              </div>
            ))}
          </div>

          {/* CTA strip */}
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-rose-900 text-white p-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-lg font-bold">Your next 10,000 subscribers are waiting.</div>
              <div className="text-xs opacity-80">Know where to find them.</div>
            </div>
            <div className="flex gap-2">
              <Button data-testid="open-trial" onClick={() => setTrialOpen(true)} className="bg-[#2563EB]"><TrendingUp size={14} className="mr-1" /> Start Free 14-Day Trial</Button>
              <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-slate-900">Book a Live Demo</Button>
            </div>
          </div>
        </section>
      </div>

      <CampaignBuilder open={campOpen} onClose={() => setCampOpen(false)} />
      <TrialModal open={trialOpen} onClose={() => setTrialOpen(false)} />
    </Layout>
  );
};

export default AddOns;
