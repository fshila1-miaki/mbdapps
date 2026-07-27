import React, { useEffect } from "react";
import AndroidEmulator from "../AndroidEmulator";
import { sathibdAndroidScreens } from "./SathiBDPreview";

const T = (l, en, bn) => (l === "Bengali" ? bn : en);

const Btn = ({ children, onClick, color, full = true, "data-testid": tid, ghost }) => (
  <button data-testid={tid} onClick={onClick} className={`${full ? "w-full" : ""} text-xs font-semibold py-2.5 rounded-lg ${ghost ? "border border-slate-200 text-slate-700" : "text-white"}`} style={!ghost ? { background: color } : {}}>{children}</button>
);

// Auto-advance hook used inside screen render functions (via ctx state)
const useSplash = (ctx, ms = 1800) => {
  useEffect(() => { const t = setTimeout(() => ctx.next(), ms); return () => clearTimeout(t); }, [ctx]);
};

// ============== E-COMMERCE 5-screen flow ==============
const ecomScreens = (lang) => {
  const products = [
    { id: 1, n: T(lang, "Wireless Headphones", "ওয়্যারলেস হেডফোন"), p: 4500, c: "from-rose-500 to-orange-500", e: "🎧" },
    { id: 2, n: T(lang, "Smart Watch Pro", "স্মার্ট ওয়াচ"), p: 8900, c: "from-blue-500 to-cyan-500", e: "⌚" },
    { id: 3, n: T(lang, "Bluetooth Speaker", "স্পিকার"), p: 3100, c: "from-purple-500 to-pink-500", e: "🔊" },
    { id: 4, n: T(lang, "Coffee Maker", "কফি মেকার"), p: 6200, c: "from-amber-600 to-yellow-500", e: "☕" },
  ];
  return [
    {
      id: "signin",
      label: T(lang, "Sign In", "সাইন ইন"),
      render: (ctx) => (
        <div className="flex flex-col h-full px-5 py-6">
          <div className="w-14 h-14 mx-auto rounded-2xl text-white flex items-center justify-center text-3xl font-bold mb-3" style={{ background: `linear-gradient(135deg, ${ctx.primary}, ${ctx.primary}aa)` }}>{ctx.appName.charAt(0)}</div>
          <div className="text-center font-bold" style={{ color: ctx.primary }}>{ctx.appName}</div>
          <div className="text-center text-[10px] text-slate-500">{T(lang, "Sign in to start shopping", "শপিং শুরু করতে সাইন ইন")}</div>
          <input data-testid="emu-ecom-email" defaultValue="user@email.com" className="w-full border border-slate-200 rounded-lg p-2.5 text-xs mt-4" />
          <input data-testid="emu-ecom-pwd" type="password" defaultValue="••••••" className="w-full border border-slate-200 rounded-lg p-2.5 text-xs mt-2" />
          <Btn data-testid="emu-ecom-signin" onClick={() => ctx.next()} color={ctx.primary}>{T(lang, "Sign In", "সাইন ইন")}</Btn>
          <div className="text-[10px] text-center text-slate-400 mt-3">{T(lang, "Or continue with", "অথবা")}</div>
          <div className="flex gap-2 mt-2">
            <button className="flex-1 text-xs py-2 border border-slate-200 rounded-lg">G</button>
            <button className="flex-1 text-xs py-2 border border-slate-200 rounded-lg">f</button>
          </div>
        </div>
      ),
    },
    {
      id: "home",
      label: T(lang, "Home", "হোম"),
      render: (ctx) => (
        <div className="h-full flex flex-col">
          <div className="px-4 py-2 flex items-center gap-2" style={{ background: ctx.primary, color: "white" }}>
            <input placeholder={T(lang, "Search products...", "অনুসন্ধান")} className="flex-1 bg-white text-slate-700 text-[10px] px-2 py-1 rounded" />
            <span className="relative" onClick={(e) => { e.stopPropagation(); ctx.goto("cart"); }}>🛒{(ctx.state.cart?.length || 0) > 0 && <sup className="absolute -top-1 -right-2 text-[8px] bg-white text-rose-600 rounded-full px-1 font-bold">{ctx.state.cart.reduce((s, x) => s + x.qty, 0)}</sup>}</span>
          </div>
          <div className="px-2 py-1.5 flex gap-1.5 overflow-x-auto bg-white border-b border-slate-100">{["All", "Tech", "Fashion", "Home", "Sports"].map((c, i) => <span key={c} className={`text-[9px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${i === 0 ? "text-white" : "bg-slate-100 text-slate-700"}`} style={i === 0 ? { background: ctx.primary } : {}}>{c}</span>)}</div>
          <div className="flex-1 p-2 grid grid-cols-2 gap-2 bg-slate-50">
            {products.map((p) => (
              <button key={p.id} data-testid={`emu-ecom-prod-${p.id}`} onClick={(e) => { e.stopPropagation(); ctx.set({ openProduct: p }); ctx.goto("detail"); }} className="bg-white rounded-lg overflow-hidden text-left">
                <div className={`h-14 bg-gradient-to-br ${p.c} flex items-center justify-center text-2xl`}>{p.e}</div>
                <div className="p-1.5">
                  <div className="text-[10px] font-bold line-clamp-1">{p.n}</div>
                  <div className="text-[9px]">⭐ 4.7</div>
                  <div className="text-[10px] font-bold" style={{ color: ctx.primary }}>৳ {p.p}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "detail",
      label: T(lang, "Product", "পণ্য"),
      render: (ctx) => {
        const p = ctx.state.openProduct || products[0];
        return (
          <div className="h-full flex flex-col bg-white">
            <div className={`h-40 bg-gradient-to-br ${p.c} flex items-center justify-center text-7xl`}>{p.e}</div>
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="text-base font-bold">{p.n}</div>
              <div className="text-[10px] text-slate-500">⭐ 4.7 · 284 reviews</div>
              <div className="text-xl font-bold mt-1" style={{ color: ctx.primary }}>৳ {p.p}</div>
              <div className="text-[10px] mt-3">{T(lang, "Color", "রঙ")}</div>
              <div className="flex gap-1.5 mt-1">{["#ef4444", "#3b82f6", "#10b981", "#09090B"].map((c, i) => <span key={c} className={`w-5 h-5 rounded-full ${i === 0 ? "ring-2 ring-offset-1 ring-slate-900" : ""}`} style={{ background: c }}></span>)}</div>
              <div className="text-[10px] mt-3">{T(lang, "Size", "সাইজ")}</div>
              <div className="flex gap-1 mt-1">{["S", "M", "L", "XL"].map((s, i) => <span key={s} className={`text-[10px] px-2 py-0.5 rounded ${i === 1 ? "text-white" : "bg-slate-100"}`} style={i === 1 ? { background: ctx.primary } : {}}>{s}</span>)}</div>
            </div>
            <div className="p-3 border-t border-slate-100">
              <Btn data-testid="emu-ecom-addcart" onClick={() => { ctx.set((s) => ({ cart: [...(s.cart || []), { ...p, qty: 1 }] })); ctx.goto("cart"); }} color={ctx.primary}>{T(lang, "Add to Cart", "কার্টে যোগ")}</Btn>
            </div>
          </div>
        );
      },
    },
    {
      id: "cart",
      label: T(lang, "Cart", "কার্ট"),
      render: (ctx) => {
        const cart = ctx.state.cart || [];
        const total = cart.reduce((s, x) => s + x.p * x.qty, 0);
        return (
          <div className="h-full flex flex-col">
            <div className="px-4 py-3 text-white" style={{ background: ctx.primary }}><div className="font-bold text-sm">{T(lang, `My Cart (${cart.length})`, `আমার কার্ট (${cart.length})`)}</div></div>
            <div className="flex-1 p-3 overflow-y-auto bg-slate-50">
              {cart.length === 0 ? <div className="text-xs text-slate-500 text-center py-8">{T(lang, "Cart is empty. Go back and add items.", "কার্ট খালি।")}</div> : cart.map((c, i) => (
                <div key={i} className="bg-white rounded-lg p-2 mb-2 flex items-center gap-2">
                  <div className={`w-10 h-10 rounded bg-gradient-to-br ${c.c} flex items-center justify-center text-lg`}>{c.e}</div>
                  <div className="flex-1 text-[11px]"><div className="font-semibold">{c.n}</div><div style={{ color: ctx.primary }} className="font-bold">৳ {c.p}</div></div>
                  <div className="text-[10px]">× {c.qty}</div>
                </div>
              ))}
              {cart.length > 0 && (
                <div className="bg-white rounded-lg p-3 mt-2 space-y-1 text-[11px]">
                  <div className="flex justify-between"><span>{T(lang, "Subtotal", "সাবটোটাল")}</span><span>৳ {total}</span></div>
                  <div className="flex justify-between"><span>{T(lang, "Delivery", "ডেলিভারি")}</span><span>৳ 60</span></div>
                  <div className="flex justify-between font-bold pt-1 border-t border-slate-200"><span>Total</span><span style={{ color: ctx.primary }}>৳ {total + 60}</span></div>
                </div>
              )}
            </div>
            {cart.length > 0 && <div className="p-3"><Btn data-testid="emu-ecom-checkout" onClick={() => ctx.next()} color={ctx.primary}>{T(lang, "Proceed to Checkout", "চেকআউট")}</Btn></div>}
          </div>
        );
      },
    },
    {
      id: "payment",
      label: T(lang, "Payment & Done", "পেমেন্ট ও সম্পন্ন"),
      render: (ctx) => <PaymentScreen ctx={ctx} lang={lang} />,
    },
  ];
};

// Extracted hook-using screens (capitalised so React rules-of-hooks accepts them)
const PaymentScreen = ({ ctx, lang }) => {
  const [payState, setPayState] = React.useReducer((s, a) => ({ ...s, ...a }), { phase: "select", method: "bkash" });
  const cart = ctx.state.cart || [];
  const total = cart.reduce((s, x) => s + x.p * x.qty, 0) + 60;
  React.useEffect(() => {
    if (payState.phase === "processing") {
      const t = setTimeout(() => setPayState({ phase: "done" }), 1500);
      return () => clearTimeout(t);
    }
  }, [payState.phase]);
  if (payState.phase === "processing") {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white p-6">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-current animate-spin" style={{ color: ctx.primary }}></div>
        <div className="text-xs font-bold mt-3" style={{ color: ctx.primary }}>{T(lang, "Processing payment...", "পেমেন্ট প্রসেসিং...")}</div>
        <div className="text-[10px] text-slate-500 mt-1 text-center">{T(lang, "Routing through Orbit Proxy → SSL Commerz → bKash", "Orbit Proxy → SSL Commerz → bKash")}</div>
      </div>
    );
  }
  if (payState.phase === "done") {
    const orderId = `BD-${Math.floor(Math.random() * 900000 + 100000)}`;
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white p-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-4xl text-emerald-600" style={{ animation: "pulseGlow 1.5s infinite" }}>✓</div>
        <div className="font-bold text-base mt-3">{T(lang, "Order Placed! 🎉", "অর্ডার সম্পন্ন! 🎉")}</div>
        <div className="text-[10px] mt-1">Order <span className="font-mono font-bold" style={{ color: ctx.primary }}>#{orderId}</span></div>
        <div className="text-[10px] text-slate-500 mt-1">{T(lang, "Estimated: 2-4 days", "ডেলিভারি: ২-৪ দিন")}</div>
        <div className="mt-3 w-full"><Btn data-testid="emu-ecom-continue" onClick={() => ctx.goto("home")} color={ctx.primary}>{T(lang, "Continue Shopping", "আরও কেনাকাটা")}</Btn></div>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 text-white" style={{ background: ctx.primary }}><div className="font-bold text-sm">{T(lang, "Checkout", "চেকআউট")}</div></div>
      <div className="flex-1 p-3 overflow-y-auto bg-slate-50">
        <div className="bg-white rounded-lg p-2.5 text-[11px]">
          <div className="font-semibold">{T(lang, "Delivery Address", "ঠিকানা")}</div>
          <div className="text-[10px] text-slate-500">123 Gulshan, Dhaka</div>
        </div>
        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mt-3 mb-2">{T(lang, "Payment Method", "পেমেন্ট")}</div>
        {[{ id: "bkash", l: "📱 bKash" }, { id: "nagad", l: "📱 Nagad" }, { id: "ssl", l: "💳 SSL Commerz" }, { id: "robi", l: "📡 Robi Balance" }].map((m) => (
          <label key={m.id} className={`flex items-center gap-2 rounded-lg p-2 mb-1 border-2 text-[11px] ${payState.method === m.id ? "" : "border-slate-200 bg-white"}`} style={payState.method === m.id ? { borderColor: ctx.primary, background: `${ctx.primary}0a` } : {}}>
            <input type="radio" data-testid={`emu-ecom-pm-${m.id}`} name="pm" checked={payState.method === m.id} onChange={() => setPayState({ method: m.id })} />{m.l}
          </label>
        ))}
      </div>
      <div className="p-3"><Btn data-testid="emu-ecom-pay" onClick={() => setPayState({ phase: "processing" })} color={ctx.primary}>{T(lang, `Pay ৳ ${total}`, `পেমেন্ট ৳ ${total}`)}</Btn></div>
    </div>
  );
};

const OtpScreen = ({ ctx, lang }) => {
  const [otp, setOtp] = React.useState("");
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 text-white" style={{ background: ctx.primary }}><div className="font-bold text-xs">{T(lang, "Verify OTP", "OTP")}</div></div>
      <div className="flex-1 p-4 bg-slate-50">
        <div className="text-[10px] text-slate-500 mb-2">{T(lang, "Enter any 4 digits", "যেকোনো ৪ অঙ্ক")}</div>
        <input data-testid="emu-doc-otp" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} className="w-full text-center font-mono tracking-[0.5em] text-lg border border-slate-200 rounded-lg p-2" />
        <Btn data-testid="emu-doc-verify" onClick={() => otp.length >= 4 && ctx.next()} color={ctx.primary}>{T(lang, "Verify", "যাচাই")}</Btn>
      </div>
    </div>
  );
};

const LessonScreen = ({ ctx, lang }) => {
  const [pct, setPct] = React.useState(30);
  return (
    <div className="h-full flex flex-col">
      <div className="bg-slate-900 h-32 flex items-center justify-center text-white text-3xl">▶</div>
      <div className="p-3 flex-1 bg-white">
        <div className="font-bold text-xs">Module 1 — Introduction</div>
        <div className="h-1.5 bg-slate-100 rounded mt-2"><div className="h-full rounded" style={{ width: `${pct}%`, background: ctx.primary }}></div></div>
        <div className="text-[10px] text-slate-500 mt-1">{pct}% complete</div>
        <Btn data-testid="emu-edu-next-lesson" onClick={() => { setPct(100); ctx.next(); }} color={ctx.primary}>{T(lang, "Mark Complete", "সম্পন্ন")}</Btn>
      </div>
    </div>
  );
};

const WorkoutScreen = ({ ctx, lang }) => {
  const [sec, setSec] = React.useState(0);
  const [run, setRun] = React.useState(false);
  React.useEffect(() => { if (!run) return; const id = setInterval(() => setSec((s) => s + 1), 1000); return () => clearInterval(id); }, [run]);
  return (
    <div className="h-full flex flex-col items-center justify-center bg-white p-4">
      <div className="text-xs uppercase tracking-widest font-bold text-slate-500">{T(lang, "Push-ups", "পুশ-আপ")}</div>
      <div className="text-5xl font-bold mt-3" style={{ color: ctx.primary }}>{Math.floor(sec / 60)}:{(sec % 60).toString().padStart(2, "0")}</div>
      <div className="text-[10px] text-slate-500">3 sets × 12 reps</div>
      <button data-testid="emu-fit-toggle-timer" onClick={() => setRun(!run)} className="mt-4 px-6 py-2.5 rounded-full text-white text-xs font-bold" style={{ background: ctx.primary }}>{run ? T(lang, "Pause", "পজ") : T(lang, "Start", "শুরু")}</button>
      <Btn data-testid="emu-fit-done" onClick={ctx.next} color="#16a34a">{T(lang, "Complete Workout", "সম্পন্ন")}</Btn>
    </div>
  );
};

const FareScreen = ({ ctx, lang }) => {
  const [type, setType] = React.useState("eco");
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 text-white" style={{ background: ctx.primary }}><div className="font-bold text-xs">{T(lang, "Fare Estimate", "ভাড়া")}</div></div>
      <div className="flex-1 p-3 bg-slate-50">{[{ id: "eco", l: "Economy", p: "120-180", e: "🚗" }, { id: "prem", l: "Premium", p: "180-250", e: "🚙" }, { id: "xl", l: "XL", p: "250-320", e: "🚐" }].map((c) => <button key={c.id} data-testid={`emu-ride-${c.id}`} onClick={(e) => { e.stopPropagation(); setType(c.id); }} className={`w-full rounded-lg p-3 mb-1.5 border-2 flex items-center gap-2 ${type === c.id ? "" : "border-slate-200 bg-white"}`} style={type === c.id ? { borderColor: ctx.primary, background: `${ctx.primary}0a` } : {}}><span className="text-2xl">{c.e}</span><div className="flex-1 text-left"><div className="text-[11px] font-bold">{c.l}</div><div className="text-[10px]" style={{ color: ctx.primary }}>৳ {c.p}</div></div></button>)}</div>
      <div className="p-3"><Btn data-testid="emu-ride-book" onClick={ctx.next} color={ctx.primary}>{T(lang, "Book Ride", "রাইড বুক")}</Btn></div>
    </div>
  );
};

// ============== FOOD DELIVERY 5-screen flow ==============
const FoodTracker = ({ ctx, lang }) => {
  const [step, setStep] = React.useState(0);
  React.useEffect(() => { const id = setInterval(() => setStep((s) => s < 3 ? s + 1 : s), 2200); return () => clearInterval(id); }, []);
  const steps = ["Placed", "Preparing", "On the way", "Delivered"];
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 text-white" style={{ background: ctx.primary }}><div className="font-bold text-sm">{T(lang, "Tracking", "ট্র্যাকিং")}</div></div>
      <div className="flex-1 p-4 bg-slate-50">
        <div className="text-center mb-3"><div className="text-[10px] uppercase tracking-widest text-slate-500">{T(lang, "Order #BD-83920", "অর্ডার")}</div><div className="font-bold text-base" style={{ color: ctx.primary }}>{steps[step]}</div></div>
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3 mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${i === step ? "animate-pulse" : ""}`} style={{ background: i <= step ? ctx.primary : "#cbd5e1" }}>{i <= step ? "✓" : i + 1}</div>
            <div className="text-xs">{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const foodScreens = (lang) => [
  { id: "signin", label: T(lang, "Sign In", "সাইন ইন"), render: (ctx) => (<div className="px-5 py-6 h-full flex flex-col"><div className="text-5xl text-center mt-4">🍔</div><div className="text-center font-bold mt-2" style={{ color: ctx.primary }}>{ctx.appName}</div><input defaultValue="user@email.com" className="border border-slate-200 rounded-lg p-2.5 text-xs mt-4" /><input type="password" defaultValue="••••••" className="border border-slate-200 rounded-lg p-2.5 text-xs mt-2" /><Btn data-testid="emu-food-signin" onClick={ctx.next} color={ctx.primary}>{T(lang, "Sign In", "সাইন ইন")}</Btn></div>) },
  { id: "restaurants", label: T(lang, "Restaurants", "রেস্টুরেন্ট"), render: (ctx) => (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 flex items-center justify-between text-white" style={{ background: ctx.primary }}><div className="font-bold text-xs">🍽 {ctx.appName}</div><div className="text-[10px] bg-white/20 px-2 py-0.5 rounded">📍 Dhaka</div></div>
      <div className="px-2 py-1.5 flex gap-1.5 overflow-x-auto">{["🍔 Burger", "🍕 Pizza", "🍜 Asian", "🌮 Mexican"].map((c) => <span key={c} className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 whitespace-nowrap">{c}</span>)}</div>
      <div className="flex-1 p-2 bg-slate-50 overflow-y-auto">{[{ id: 1, n: "Burger King BD", r: 4.5, t: "30 min · BDT 40", c: "from-red-500 to-amber-500" }, { id: 2, n: "Chillox", r: 4.3, t: "25 min · BDT 50", c: "from-orange-500 to-red-500" }, { id: 3, n: "Sultan's Dine", r: 4.7, t: "40 min · BDT 60", c: "from-amber-700 to-yellow-600" }].map((r) => (
        <button key={r.id} data-testid={`emu-food-rest-${r.id}`} onClick={(e) => { e.stopPropagation(); ctx.set({ rest: r }); ctx.next(); }} className="w-full bg-white rounded-lg overflow-hidden mb-2 text-left">
          <div className={`h-14 bg-gradient-to-br ${r.c} flex items-center justify-center text-2xl`}>🍴</div>
          <div className="p-2"><div className="text-[11px] font-bold">{r.n}</div><div className="text-[10px]">⭐ {r.r} · {r.t}</div></div>
        </button>
      ))}</div>
    </div>
  ) },
  { id: "menu", label: T(lang, "Menu", "মেনু"), render: (ctx) => {
    const items = [{ id: 1, n: "Whopper", p: 380, e: "🍔" }, { id: 2, n: "Fries L", p: 120, e: "🍟" }, { id: 3, n: "Pepsi", p: 60, e: "🥤" }];
    return (
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 text-white" style={{ background: ctx.primary }}><div className="font-bold text-xs">{ctx.state.rest?.n || "Menu"}</div></div>
        <div className="flex-1 p-2 bg-slate-50 overflow-y-auto">{items.map((m) => (
          <div key={m.id} className="bg-white rounded-lg p-2 mb-1.5 flex items-center gap-2">
            <span className="text-2xl">{m.e}</span><div className="flex-1"><div className="text-[11px] font-bold">{m.n}</div><div className="text-[10px]" style={{ color: ctx.primary }}>৳ {m.p}</div></div>
            <button data-testid={`emu-food-add-${m.id}`} onClick={(e) => { e.stopPropagation(); ctx.set((s) => ({ cart: [...(s.cart || []), m] })); }} className="w-7 h-7 rounded-full text-white text-base" style={{ background: ctx.primary }}>+</button>
          </div>
        ))}</div>
        {(ctx.state.cart?.length || 0) > 0 && <div className="p-2"><Btn data-testid="emu-food-checkout" onClick={ctx.next} color={ctx.primary}>{T(lang, `Checkout (${ctx.state.cart.length}) · ৳ ${ctx.state.cart.reduce((s, x) => s + x.p, 0)}`, `চেকআউট`)}</Btn></div>}
      </div>
    );
  } },
  { id: "pay", label: T(lang, "Payment", "পেমেন্ট"), render: (ctx) => (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 text-white" style={{ background: ctx.primary }}><div className="font-bold text-xs">{T(lang, "Payment", "পেমেন্ট")}</div></div>
      <div className="flex-1 p-3 bg-slate-50">
        <div className="bg-white rounded-lg p-3 text-[11px] mb-2"><div className="font-semibold">{T(lang, "Delivery", "ডেলিভারি")}</div><div className="text-[10px] text-slate-500">35 min · ৳ 50</div></div>
        {["📱 bKash", "💳 SSL Commerz", "🏠 Cash on Delivery"].map((m, i) => (
          <label key={m} className={`flex items-center gap-2 rounded-lg p-2 mb-1 border-2 text-[11px] ${i === 0 ? "" : "border-slate-200 bg-white"}`} style={i === 0 ? { borderColor: ctx.primary, background: `${ctx.primary}0a` } : {}}>
            <input type="radio" name="pm" defaultChecked={i === 0} />{m}
          </label>
        ))}
      </div>
      <div className="p-3"><Btn data-testid="emu-food-pay" onClick={ctx.next} color={ctx.primary}>{T(lang, "Place Order", "অর্ডার")}</Btn></div>
    </div>
  ) },
  { id: "tracker", label: T(lang, "Tracker", "ট্র্যাকার"), render: (ctx) => <FoodTracker ctx={ctx} lang={lang} /> },
];

// Generic 5-screen builder for remaining templates
const simpleScreens = (lang, conf) => {
  // conf = { signin, screens: [{label, content(ctx)}] }
  return conf.screens.map((s, i) => ({
    id: s.id || `s${i}`,
    label: s.label,
    render: (ctx) => s.content(ctx),
  }));
};

const doctorScreens = (lang) => simpleScreens(lang, { screens: [
  { id: "signin", label: T(lang, "Sign In", "সাইন ইন"), content: (ctx) => (<div className="px-5 py-6 h-full flex flex-col"><div className="text-5xl text-center mt-4">🩺</div><div className="text-center font-bold mt-2" style={{ color: ctx.primary }}>{ctx.appName}</div><input defaultValue="+880 18XX-345671" className="border border-slate-200 rounded-lg p-2.5 text-xs mt-4 font-mono" /><Btn data-testid="emu-doc-signin" onClick={ctx.next} color={ctx.primary}>{T(lang, "Continue", "চালিয়ে যান")}</Btn></div>) },
  { id: "doctors", label: T(lang, "Doctors", "ডাক্তার"), content: (ctx) => (<div className="h-full flex flex-col"><div className="px-4 py-3 text-white" style={{ background: ctx.primary }}><div className="font-bold text-xs">{T(lang, "Find Doctors", "ডাক্তার খুঁজুন")}</div></div><div className="flex-1 p-2 bg-slate-50 overflow-y-auto">{[{ id: 1, n: "Dr. Anika Rahman", s: "Cardio", f: 1500 }, { id: 2, n: "Dr. Tarif Hossain", s: "Pediatric", f: 1000 }, { id: 3, n: "Dr. Shamima Akter", s: "Dermatology", f: 1200 }].map((d) => (<button key={d.id} data-testid={`emu-doc-${d.id}`} onClick={(e) => { e.stopPropagation(); ctx.set({ doc: d }); ctx.next(); }} className="w-full bg-white rounded-lg p-2 mb-1.5 flex items-center gap-2 text-left"><div className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-xs" style={{ background: ctx.primary }}>{d.n.split(" ")[1].charAt(0)}</div><div className="flex-1"><div className="text-[11px] font-bold">{d.n}</div><div className="text-[10px] text-slate-500">{d.s} · ⭐ 4.8</div><div className="text-[10px] font-bold" style={{ color: ctx.primary }}>৳ {d.f}</div></div></button>))}</div></div>) },
  { id: "slot", label: T(lang, "Slot", "স্লট"), content: (ctx) => (<div className="h-full flex flex-col"><div className="px-4 py-3 text-white" style={{ background: ctx.primary }}><div className="font-bold text-xs">{ctx.state.doc?.n || "Doctor"}</div></div><div className="flex-1 p-3 bg-slate-50"><div className="text-[10px] text-slate-500 mb-2">{T(lang, "Available slots", "স্লট নির্বাচন")}</div><div className="grid grid-cols-2 gap-1.5">{["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM"].map((s) => <button key={s} data-testid={`emu-doc-slot-${s.replace(/[^a-z0-9]+/gi, "-")}`} onClick={(e) => { e.stopPropagation(); ctx.set({ slot: s }); ctx.next(); }} className="bg-white rounded-lg py-2 text-[11px] border border-slate-200 hover:border-rose-400">{s}</button>)}</div></div></div>) },
  { id: "otp", label: T(lang, "OTP", "OTP"), content: (ctx) => <OtpScreen ctx={ctx} lang={lang} /> },
  { id: "done", label: T(lang, "Confirmed", "নিশ্চিত"), content: (ctx) => (<div className="h-full flex flex-col items-center justify-center bg-white p-6"><div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl text-emerald-600">✓</div><div className="font-bold mt-2">{T(lang, "Appointment Confirmed!", "অ্যাপয়েন্টমেন্ট নিশ্চিত!")}</div><div className="bg-slate-50 rounded-lg p-3 mt-3 text-xs w-full text-center"><div className="font-bold">{ctx.state.doc?.n || "Doctor"}</div><div>{T(lang, "Tomorrow", "আগামীকাল")}, {ctx.state.slot || "10:00 AM"}</div></div></div>) },
] });

const eduScreens = (lang) => simpleScreens(lang, { screens: [
  { id: "signin", label: T(lang, "Sign In", "সাইন ইন"), content: (ctx) => (<div className="px-5 py-6 h-full flex flex-col"><div className="text-5xl text-center mt-4">🎓</div><div className="text-center font-bold mt-2" style={{ color: ctx.primary }}>{ctx.appName}</div><input defaultValue="student@email.com" className="border border-slate-200 rounded-lg p-2.5 text-xs mt-4" /><Btn data-testid="emu-edu-signin" onClick={ctx.next} color={ctx.primary}>{T(lang, "Sign In", "সাইন ইন")}</Btn></div>) },
  { id: "catalog", label: T(lang, "Catalog", "ক্যাটালগ"), content: (ctx) => (<div className="h-full flex flex-col"><div className="px-4 py-3 text-white" style={{ background: ctx.primary }}><div className="font-bold text-xs">{T(lang, "Courses", "কোর্স")}</div></div><div className="flex-1 p-2 bg-slate-50 overflow-y-auto">{[{ id: 1, n: "React Developer", p: 1200, i: "Ahmed K." }, { id: 2, n: "Modern JS", p: 2500, i: "Imran A." }].map((c) => (<button key={c.id} data-testid={`emu-edu-${c.id}`} onClick={(e) => { e.stopPropagation(); ctx.set({ course: c }); ctx.next(); }} className="w-full bg-white rounded-lg overflow-hidden mb-2 text-left"><div className="h-14 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl">📚</div><div className="p-2"><div className="text-[11px] font-bold">{c.n}</div><div className="text-[10px] text-slate-500">by {c.i}</div><div className="text-[10px] font-bold" style={{ color: ctx.primary }}>৳ {c.p}</div></div></button>))}</div></div>) },
  { id: "detail", label: T(lang, "Detail", "বিবরণ"), content: (ctx) => (<div className="h-full flex flex-col"><div className="h-24 bg-gradient-to-br from-purple-500 to-pink-500"></div><div className="flex-1 p-3 bg-white"><div className="text-base font-bold">{ctx.state.course?.n || "Course"}</div><div className="text-[10px] text-slate-500">5 modules · 12h video · Certificate included</div><ul className="text-[10px] mt-2 space-y-0.5">{["Intro", "Fundamentals", "Advanced", "Project"].map((m, i) => <li key={m}>📚 Module {i + 1}: {m}</li>)}</ul></div><div className="p-3"><Btn data-testid="emu-edu-enroll" onClick={ctx.next} color={ctx.primary}>{T(lang, `Enroll — ৳ ${ctx.state.course?.p || 0}`, `নথিভুক্ত`)}</Btn></div></div>) },
  { id: "lesson", label: T(lang, "Lesson", "পাঠ"), content: (ctx) => <LessonScreen ctx={ctx} lang={lang} /> },
  { id: "cert", label: T(lang, "Quiz + Certificate", "সনদ"), content: (ctx) => (<div className="h-full flex flex-col items-center justify-center bg-white p-4"><div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl">🏆</div><div className="font-bold mt-2 text-center">{T(lang, "Course Complete!", "কোর্স সম্পন্ন!")}</div><div className="border-2 border-amber-400 rounded-lg p-3 mt-3 text-center w-full"><div className="text-[9px] uppercase tracking-widest text-amber-700">{T(lang, "Certificate of Completion", "সনদ")}</div><div className="font-bold text-sm mt-1">{ctx.state.course?.n}</div><div className="text-[9px] text-slate-500 mt-1">Issued by {ctx.appName}</div></div></div>) },
] });

const fitnessScreens = (lang) => simpleScreens(lang, { screens: [
  { id: "signin", label: T(lang, "Sign In", "সাইন ইন"), content: (ctx) => (<div className="px-5 py-6 h-full flex flex-col"><div className="text-5xl text-center mt-4">💪</div><div className="text-center font-bold mt-2" style={{ color: ctx.primary }}>{ctx.appName}</div><input defaultValue="fit@email.com" className="border border-slate-200 rounded-lg p-2.5 text-xs mt-4" /><Btn data-testid="emu-fit-signin" onClick={ctx.next} color={ctx.primary}>{T(lang, "Sign In", "সাইন ইন")}</Btn></div>) },
  { id: "goal", label: T(lang, "Goal", "লক্ষ্য"), content: (ctx) => (<div className="px-4 py-4 h-full flex flex-col"><div className="text-xs font-semibold mb-2">{T(lang, "Choose your goal", "লক্ষ্য নির্বাচন")}</div>{["Lose Weight", "Build Muscle", "Stay Active"].map((g) => <button key={g} data-testid={`emu-fit-goal-${g.toLowerCase().replace(/\s+/g, "-")}`} onClick={(e) => { e.stopPropagation(); ctx.set({ goal: g }); ctx.next(); }} className="w-full p-3 rounded-lg border border-slate-200 text-left font-semibold text-xs mb-2 hover:border-rose-400">{g}</button>)}</div>) },
  { id: "dash", label: T(lang, "Dashboard", "ড্যাশবোর্ড"), content: (ctx) => (<div className="h-full flex flex-col items-center justify-center p-4 bg-slate-50"><div className="relative w-32 h-32"><svg viewBox="0 0 80 80" className="w-full h-full"><circle cx="40" cy="40" r="34" stroke="#e2e8f0" strokeWidth="8" fill="none" /><circle cx="40" cy="40" r="34" stroke={ctx.primary} strokeWidth="8" fill="none" strokeDasharray="213.6" strokeDashoffset="80" strokeLinecap="round" transform="rotate(-90 40 40)" /></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><div className="font-bold text-xl" style={{ color: ctx.primary }}>7,432</div><div className="text-[8px] text-slate-500">/ 10,000 steps</div></div></div><div className="text-[10px] uppercase tracking-widest text-slate-500 mt-3 font-bold">{ctx.state.goal || "Goal"}</div><Btn data-testid="emu-fit-start-workout" onClick={ctx.next} color={ctx.primary}>{T(lang, "Start Workout", "শুরু")}</Btn></div>) },
  { id: "workout", label: T(lang, "Workout", "ওয়ার্কআউট"), content: (ctx) => <WorkoutScreen ctx={ctx} lang={lang} /> },
  { id: "done", label: T(lang, "Complete", "সম্পন্ন"), content: (ctx) => (<div className="h-full flex flex-col items-center justify-center bg-white p-4"><div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-4xl">🏅</div><div className="font-bold mt-2">{T(lang, "Workout Complete!", "ওয়ার্কআউট সম্পন্ন!")}</div><div className="grid grid-cols-2 gap-2 mt-3 w-full"><div className="bg-slate-50 rounded-lg p-2 text-center"><div className="text-[9px] uppercase text-slate-500">🔥 Calories</div><div className="font-bold" style={{ color: ctx.primary }}>247</div></div><div className="bg-slate-50 rounded-lg p-2 text-center"><div className="text-[9px] uppercase text-slate-500">⏱ Time</div><div className="font-bold" style={{ color: ctx.primary }}>18:32</div></div></div></div>) },
] });

const travelScreens = (lang) => simpleScreens(lang, { screens: [
  { id: "signin", label: T(lang, "Sign In", "সাইন ইন"), content: (ctx) => (<div className="px-5 py-6 h-full flex flex-col"><div className="text-5xl text-center mt-4">✈️</div><div className="text-center font-bold mt-2" style={{ color: ctx.primary }}>{ctx.appName}</div><input defaultValue="user@email.com" className="border border-slate-200 rounded-lg p-2.5 text-xs mt-4" /><Btn data-testid="emu-trv-signin" onClick={ctx.next} color={ctx.primary}>{T(lang, "Sign In", "সাইন ইন")}</Btn></div>) },
  { id: "destinations", label: T(lang, "Destinations", "গন্তব্য"), content: (ctx) => (<div className="h-full flex flex-col"><div className="h-16 flex items-center justify-center text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${ctx.primary}, ${ctx.accent || ctx.primary})` }}>✈️ {ctx.appName}</div><div className="flex-1 p-2 bg-slate-50 overflow-y-auto">{[{ id: 1, n: "Cox's Bazar", p: 12500, c: "from-sky-500 to-cyan-700" }, { id: 2, n: "Sajek Valley", p: 8800, c: "from-emerald-500 to-green-700" }, { id: 3, n: "Sundarbans", p: 15200, c: "from-amber-600 to-orange-700" }].map((t) => (<button key={t.id} data-testid={`emu-trv-${t.id}`} onClick={(e) => { e.stopPropagation(); ctx.set({ tour: t }); ctx.next(); }} className="w-full bg-white rounded-lg overflow-hidden mb-2 text-left"><div className={`h-20 bg-gradient-to-br ${t.c}`}></div><div className="p-2"><div className="text-[11px] font-bold">{t.n}</div><div className="text-[10px]" style={{ color: ctx.primary }}>৳ {t.p}/person</div></div></button>))}</div></div>) },
  { id: "detail", label: T(lang, "Tour", "ট্যুর"), content: (ctx) => (<div className="h-full flex flex-col"><div className={`h-24 bg-gradient-to-br ${ctx.state.tour?.c || "from-sky-500 to-cyan-700"}`}></div><div className="flex-1 p-3 bg-white"><div className="font-bold">{ctx.state.tour?.n}</div><div className="text-[10px] text-slate-500">3 days · 2 nights · Hotel + Transport</div><ul className="text-[10px] mt-2 space-y-0.5">{["Stay at 4-star hotel", "All meals included", "Local guide", "Transport"].map((x) => <li key={x}>✓ {x}</li>)}</ul></div><div className="p-3"><Btn data-testid="emu-trv-book" onClick={ctx.next} color={ctx.primary}>{T(lang, `Book — ৳ ${ctx.state.tour?.p}`, `বুক`)}</Btn></div></div>) },
  { id: "booking", label: T(lang, "Booking", "বুকিং"), content: (ctx) => (<div className="h-full flex flex-col"><div className="px-4 py-3 text-white" style={{ background: ctx.primary }}><div className="font-bold text-xs">{T(lang, "Booking Details", "বুকিং তথ্য")}</div></div><div className="flex-1 p-3 bg-slate-50 space-y-2 text-[11px]"><div className="bg-white rounded-lg p-2"><div className="font-bold">{T(lang, "Date", "তারিখ")}</div><div className="text-slate-500">25 Feb 2026</div></div><div className="bg-white rounded-lg p-2"><div className="font-bold">{T(lang, "Travelers", "যাত্রী")}</div><div className="text-slate-500">2 adults</div></div><div className="bg-white rounded-lg p-2"><div className="font-bold">{T(lang, "Payment", "পেমেন্ট")}</div><div className="text-slate-500">📱 bKash</div></div></div><div className="p-3"><Btn data-testid="emu-trv-confirm" onClick={ctx.next} color={ctx.primary}>{T(lang, "Confirm Booking", "নিশ্চিত")}</Btn></div></div>) },
  { id: "done", label: T(lang, "Confirmed", "সম্পন্ন"), content: (ctx) => (<div className="h-full flex flex-col items-center justify-center bg-white p-4"><div className="text-5xl">🎉</div><div className="font-bold mt-2">{T(lang, "Trip Booked!", "ট্রিপ বুক!")}</div><div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mt-3 text-center w-full text-[10px]"><div className="font-mono font-bold text-emerald-700">BD-TRV-{Math.floor(Math.random() * 9000 + 1000)}</div><div className="text-slate-500 mt-1">{ctx.state.tour?.n} · 25 Feb 2026</div></div></div>) },
] });

const newsScreens = (lang) => simpleScreens(lang, { screens: [
  { id: "signin", label: T(lang, "Sign In", "সাইন ইন"), content: (ctx) => (<div className="px-5 py-6 h-full flex flex-col"><div className="text-5xl text-center mt-4">📰</div><div className="text-center font-bold mt-2" style={{ color: ctx.primary }}>{ctx.appName}</div><Btn data-testid="emu-news-signin" onClick={ctx.next} color={ctx.primary}>{T(lang, "Continue as Guest", "অতিথি")}</Btn></div>) },
  { id: "feed", label: T(lang, "Feed", "ফিড"), content: (ctx) => (<div className="h-full flex flex-col"><div className="px-3 py-2 text-white flex justify-between" style={{ background: ctx.primary }}><div className="font-bold text-xs">{ctx.appName}</div><div className="text-[9px] bg-rose-600 px-1.5 py-0.5 rounded">● LIVE</div></div><div className="px-3 py-2 bg-rose-50 text-rose-700 text-[10px] font-bold">🔴 BREAKING: Padma Bridge crossings up 23%</div><div className="flex-1 p-2 bg-slate-50 overflow-y-auto">{[{ id: 1, t: "Dhaka traffic plan announced", t2: "City updates · 2h" }, { id: 2, t: "BAN beats IND by 7 wickets", t2: "Sports · 4h" }, { id: 3, t: "5G launch in 3 cities", t2: "Tech · 6h" }].map((a) => <button key={a.id} data-testid={`emu-news-${a.id}`} onClick={(e) => { e.stopPropagation(); ctx.set({ article: a }); ctx.next(); }} className="w-full text-left bg-white rounded-lg p-2 mb-1.5 flex gap-2"><div className="w-10 h-10 rounded" style={{ background: ctx.primary }}></div><div className="flex-1"><div className="text-[11px] font-bold">{a.t}</div><div className="text-[9px] text-slate-500">{a.t2}</div></div></button>)}</div></div>) },
  { id: "article", label: T(lang, "Article", "আর্টিকেল"), content: (ctx) => (<div className="h-full flex flex-col"><div className="h-24 bg-gradient-to-br from-slate-700 to-slate-900"></div><div className="flex-1 p-3 overflow-y-auto bg-white"><div className="text-xs font-bold">{ctx.state.article?.t || "Article"}</div><div className="text-[9px] text-slate-500 mt-0.5">{ctx.state.article?.t2}</div><div className="text-[10px] mt-2 leading-relaxed text-slate-700">Lorem ipsum dolor sit amet consectetur adipiscing elit. Curabitur nec felis euismod, hendrerit nulla nec, dictum lectus. Phasellus a nunc tortor.</div></div><div className="p-3 flex gap-2"><button data-testid="emu-news-like" className="flex-1 text-[10px] py-2 rounded-lg bg-rose-50 text-rose-700 font-semibold">❤ Like</button><button data-testid="emu-news-bm" className="flex-1 text-[10px] py-2 rounded-lg bg-slate-100 font-semibold">🔖 Save</button></div></div>) },
  { id: "saved", label: T(lang, "Bookmarks", "সেভড"), content: (ctx) => (<div className="h-full p-3 bg-slate-50"><div className="text-xs font-bold mb-2">{T(lang, "Saved Articles", "সেভড আর্টিকেল")}</div><div className="bg-white rounded-lg p-2 text-[11px]">🔖 {ctx.state.article?.t || "—"}</div></div>) },
  { id: "profile", label: T(lang, "Profile", "প্রোফাইল"), content: (ctx) => (<div className="h-full p-4 bg-white"><div className="w-16 h-16 mx-auto rounded-full text-white text-2xl font-bold flex items-center justify-center" style={{ background: ctx.primary }}>{ctx.appName.charAt(0)}</div><div className="text-center font-bold mt-2">{T(lang, "Guest User", "অতিথি")}</div><div className="text-center text-[10px] text-slate-500">{T(lang, "Sign up to sync bookmarks", "সেভ সিঙ্ক করতে সাইন আপ")}</div></div>) },
] });

const rideScreens = (lang) => simpleScreens(lang, { screens: [
  { id: "signin", label: T(lang, "Sign In", "সাইন ইন"), content: (ctx) => (<div className="px-5 py-6 h-full flex flex-col"><div className="text-5xl text-center mt-4">🚗</div><div className="text-center font-bold mt-2" style={{ color: ctx.primary }}>{ctx.appName}</div><input defaultValue="+880 18XX-345671" className="border border-slate-200 rounded-lg p-2.5 text-xs mt-4 font-mono" /><Btn data-testid="emu-ride-signin" onClick={ctx.next} color={ctx.primary}>{T(lang, "Continue", "চালিয়ে যান")}</Btn></div>) },
  { id: "map", label: T(lang, "Map + Pickup", "মানচিত্র"), content: (ctx) => (<div className="h-full relative bg-slate-800">{[20, 40, 60, 80].map((y) => <div key={y} className="absolute h-px w-full bg-white/20" style={{ top: `${y}%` }}></div>)}{[20, 40, 60, 80].map((x) => <div key={x} className="absolute w-px h-full bg-white/20" style={{ left: `${x}%` }}></div>)}<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl">📍</div><div className="absolute top-3 left-3 right-3 bg-white rounded-lg p-2"><div className="text-[10px] font-bold">📍 {T(lang, "Pickup: Banani DOHS", "পিকআপ")}</div></div><div className="absolute bottom-3 left-3 right-3 bg-white rounded-lg p-2"><Btn data-testid="emu-ride-confirm-pickup" onClick={ctx.next} color={ctx.primary}>{T(lang, "Confirm Pickup", "পিকআপ নিশ্চিত")}</Btn></div></div>) },
  { id: "fare", label: T(lang, "Fare", "ভাড়া"), content: (ctx) => <FareScreen ctx={ctx} lang={lang} /> },
  { id: "driver", label: T(lang, "Driver", "ড্রাইভার"), content: (ctx) => (<div className="h-full flex flex-col"><div className="px-4 py-3 text-white" style={{ background: ctx.primary }}><div className="font-bold text-xs">{T(lang, "Driver Found", "ড্রাইভার পাওয়া গেছে")}</div></div><div className="flex-1 p-3 bg-slate-50"><div className="bg-white rounded-lg p-3 flex items-center gap-2"><div className="w-12 h-12 rounded-full text-white font-bold flex items-center justify-center" style={{ background: ctx.primary }}>R</div><div className="flex-1"><div className="text-xs font-bold">Rahim Khan</div><div className="text-[10px] text-slate-500">Toyota Corolla · DK-1234</div><div className="text-[10px]">⭐ 4.9 · ETA 3 min</div></div></div></div><div className="p-3"><Btn data-testid="emu-ride-complete" onClick={ctx.next} color={ctx.primary}>{T(lang, "Ride Complete", "রাইড সম্পন্ন")}</Btn></div></div>) },
  { id: "done", label: T(lang, "Complete", "সম্পন্ন"), content: (ctx) => (<div className="h-full flex flex-col items-center justify-center bg-white p-4"><div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl">✓</div><div className="font-bold mt-2">{T(lang, "Ride Complete", "রাইড সম্পন্ন")}</div><div className="text-3xl font-bold mt-2" style={{ color: ctx.primary }}>৳ 145</div><Btn data-testid="emu-ride-pay" onClick={() => ctx.goto(0)} color={ctx.primary}>{T(lang, "Pay", "পেমেন্ট")}</Btn></div>) },
] });

const SCREENS = {
  "and-ecom": ecomScreens, "and-food": foodScreens, "and-doctor": doctorScreens, "and-edu": eduScreens,
  "and-fitness": fitnessScreens, "and-travel": travelScreens, "and-news": newsScreens, "and-ride": rideScreens,
  "and-sathibd": sathibdAndroidScreens,
};

const UniversalAndroidPreview = ({ templateId, cfg }) => {
  const fn = SCREENS[templateId] || ecomScreens;
  const screens = fn(cfg.language);
  return (
    <div className="py-4">
      <AndroidEmulator key={templateId} screens={screens} primary={cfg.primary} accent={cfg.accent || "#fff"} appName={cfg.appName} icon={cfg.icon || "🚀"} />
    </div>
  );
};

export default UniversalAndroidPreview;
