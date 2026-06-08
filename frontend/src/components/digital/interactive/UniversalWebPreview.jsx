import React, { useState, useEffect } from "react";
import { SathiBDWebPreview } from "./SathiBDPreview";
import { NewsWebPreview } from "./NewsPreview";
import { QuizWebPreview } from "./QuizPreview";

// Compact yet truly interactive web previews for universal templates.
// Each has 3-6 internal pages with working buttons and state.
// All accept (cfg) — derived from Configure sidebar: { appName, tagline, primary, secondary, accent, language, dark, radius, font, fontFamily, payment, etc. }

const T = (l, en, bn) => (l === "Bengali" ? bn : en);
const f = (cfg) => ({ fontFamily: cfg.fontFamily || "Inter, sans-serif" });

export const BrowserChrome = ({ url, dark, children, height = "h-[600px]" }) => (
  <div className={`w-full ${dark ? "bg-gray-900" : "bg-gray-100"} rounded-xl border border-gray-300 shadow-lg overflow-hidden`}>
    <div className={`${dark ? "bg-gray-800" : "bg-gray-200"} h-8 flex items-center px-3 gap-1.5`}>
      <span className="w-3 h-3 rounded-full bg-red-400"></span>
      <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
      <span className="w-3 h-3 rounded-full bg-green-400"></span>
      <div className={`flex-1 mx-3 ${dark ? "bg-gray-900 text-slate-500" : "bg-white text-gray-400"} rounded text-xs px-2 h-5 flex items-center font-mono truncate`}>🔒 {url}</div>
    </div>
    <div className={`${dark ? "bg-gray-900" : "bg-white"} ${height} overflow-y-auto relative`}>{children}</div>
  </div>
);

// Payment overlay used across templates
const PaymentOverlay = ({ open, onDone, cfg }) => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!open) { setPhase(0); return; }
    const steps = [600, 900, 1000];
    let t = 0; const ts = [];
    steps.forEach((s, i) => { t += s; ts.push(setTimeout(() => setPhase(i + 1), t)); });
    ts.push(setTimeout(onDone, t + 200));
    return () => ts.forEach(clearTimeout);
  }, [open, onDone]);
  if (!open) return null;
  const messages = [
    T(cfg.language, "Routing through BDApps Proxy...", "BDApps Proxy দিয়ে রাউটিং..."),
    T(cfg.language, "SSL Commerz secure gateway...", "SSL Commerz সিকিউর গেটওয়ে..."),
    T(cfg.language, "Confirming with bKash...", "bKash এ নিশ্চিতকরণ..."),
    T(cfg.language, "Payment successful ✓", "পেমেন্ট সম্পন্ন ✓"),
  ];
  return (
    <div className="absolute inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
        <div className="w-12 h-12 mx-auto rounded-full border-4 border-slate-200 border-t-[#e11d48] animate-spin"></div>
        <div className="font-bold mt-3" style={{ color: cfg.primary }}>{T(cfg.language, "Processing payment securely...", "নিরাপদে পেমেন্ট...")}</div>
        <div className="text-xs text-slate-500 mt-1 transition-all">{messages[phase] || messages[0]}</div>
      </div>
    </div>
  );
};

const Nav = ({ cfg, name, cartCount, dark, onLogo, right }) => (
  <div className={`flex items-center justify-between px-6 py-3 border-b ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-slate-200"}`} style={f(cfg)}>
    <button onClick={onLogo} className="flex items-center gap-2"><div className="w-8 h-8 rounded-md flex items-center justify-center text-white text-sm" style={{ background: cfg.primary }}>{name.charAt(0)}</div><span className={`font-bold tracking-tight ${dark ? "text-white" : ""}`}>{name}</span></button>
    <div className="flex items-center gap-3">
      {cartCount !== undefined && <span className="relative text-slate-500 cursor-pointer">🛒 {cartCount > 0 && <span data-testid="ecom-cart-badge" className="absolute -top-1 -right-2 text-[9px] text-white font-bold rounded-full px-1.5" style={{ background: cfg.primary }}>{cartCount}</span>}</span>}
      {right}
    </div>
  </div>
);

// ============== 1. E-COMMERCE STORE (6 pages) ==============
const EcomStore = ({ cfg }) => {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [openProduct, setOpenProduct] = useState(null);
  const [payOverlay, setPayOverlay] = useState(false);
  const [orderId, setOrderId] = useState("");
  const r = cfg.radius != null ? `${cfg.radius}px` : "8px";
  const dark = cfg.dark;
  const products = [
    { id: 1, name: "Wireless Headphones", price: 4500, rating: 4.7, color: "from-rose-500 to-orange-500" },
    { id: 2, name: "Smart Watch Pro", price: 8900, rating: 4.9, color: "from-blue-500 to-cyan-500" },
    { id: 3, name: "Coffee Maker", price: 6200, rating: 4.5, color: "from-amber-600 to-yellow-500" },
    { id: 4, name: "Bluetooth Speaker", price: 3100, rating: 4.6, color: "from-purple-500 to-pink-500" },
    { id: 5, name: "Yoga Mat Premium", price: 1800, rating: 4.8, color: "from-emerald-500 to-teal-500" },
    { id: 6, name: "Laptop Stand", price: 2400, rating: 4.4, color: "from-slate-600 to-slate-800" },
  ];
  const cartCount = cart.reduce((s, x) => s + x.qty, 0);
  const addToCart = (p) => setCart((c) => { const ex = c.find((x) => x.id === p.id); return ex ? c.map((x) => x.id === p.id ? { ...x, qty: x.qty + 1 } : x) : [...c, { ...p, qty: 1 }]; });
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const fee = cfg.payment?.platformFee ? Math.round(subtotal * (cfg.payment.platformFee / 100)) : 0;
  const delivery = 60;
  const total = subtotal + delivery + fee;

  return (
    <div className={dark ? "bg-gray-900 text-white" : "bg-white"} style={{ ...f(cfg), "--r": r }}>
      {page === "login" && (
        <div className="min-h-[500px] flex items-center justify-center p-6">
          <div className={`${dark ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-xl border border-slate-200 p-6 max-w-sm w-full`} style={{ borderRadius: r }}>
            <div className="flex items-center gap-2 mb-4"><div className="w-10 h-10 rounded-md flex items-center justify-center text-white" style={{ background: cfg.primary }}>{cfg.appName.charAt(0)}</div><div><div className="font-bold">{cfg.appName}</div><div className="text-xs text-slate-500">{T(cfg.language, "Sign up to start shopping", "সাইন আপ করুন")}</div></div></div>
            <input data-testid="ecom-reg-name" placeholder="Full name" className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm mt-1" style={{ borderRadius: r }} />
            <input data-testid="ecom-reg-email" placeholder="Email" className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm mt-2" style={{ borderRadius: r }} />
            <input data-testid="ecom-reg-password" type="password" placeholder="Password" className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm mt-2" style={{ borderRadius: r }} />
            <input data-testid="ecom-reg-phone" placeholder="018XXXXXXXX" className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm mt-2" style={{ borderRadius: r }} />
            <button data-testid="ecom-reg-submit" onClick={() => { setUser("New User"); setPage("home"); }} className="mt-3 w-full text-white font-semibold py-2.5 rounded-md" style={{ background: cfg.primary, borderRadius: r }}>{T(cfg.language, "Create Account", "অ্যাকাউন্ট তৈরি")}</button>
          </div>
        </div>
      )}
      {page === "home" && (
        <>
          <Nav cfg={cfg} name={cfg.appName} cartCount={cartCount} dark={dark} onLogo={() => setPage("home")} right={<span className="text-xs text-slate-500">👤 {user || "Guest"}</span>} />
          <div className="px-6 py-8 text-white" style={{ background: `linear-gradient(135deg, ${cfg.primary}, ${cfg.accent})` }}>
            <h1 className="text-2xl font-bold tracking-tight max-w-md">{cfg.tagline || T(cfg.language, "Shop the latest deals", "সেরা ডিলস")}</h1>
            <button onClick={() => document.getElementById("ecom-grid")?.scrollIntoView({ behavior: "smooth" })} className="mt-3 text-xs font-semibold px-4 py-2 rounded-md bg-white" style={{ color: cfg.primary, borderRadius: r }}>{T(cfg.language, "Shop Now", "এখনই কিনুন")}</button>
          </div>
          <div className="px-6 py-3 flex gap-2 overflow-x-auto">{["Electronics", "Fashion", "Home", "Sports", "Beauty"].map((c) => <span key={c} className="text-xs px-3 py-1 rounded-full bg-slate-100 whitespace-nowrap">{c}</span>)}</div>
          <div id="ecom-grid" className="px-6 py-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {products.map((p) => (
              <div key={p.id} data-testid={`ecom-product-${p.id}`} className={`${dark ? "bg-gray-800" : "bg-white"} rounded-xl border ${dark ? "border-gray-700" : "border-slate-200"} overflow-hidden hover:shadow-md`} style={{ borderRadius: r }}>
                <div className={`h-28 bg-gradient-to-br ${p.color} cursor-pointer`} onClick={() => { setOpenProduct(p); setPage("detail"); }}></div>
                <div className="p-3">
                  <div className="text-sm font-semibold line-clamp-1">{p.name}</div>
                  <div className="flex items-center justify-between mt-1"><span className="text-xs">⭐ {p.rating}</span><span className="text-sm font-bold" style={{ color: cfg.primary }}>৳ {p.price}</span></div>
                  <button data-testid={`ecom-add-${p.id}`} onClick={() => addToCart(p)} className="mt-2 w-full text-xs font-semibold py-1.5 rounded-md text-white" style={{ background: cfg.primary, borderRadius: r }}>{T(cfg.language, "Add to Cart", "কার্টে যোগ")}</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {page === "detail" && openProduct && (
        <>
          <Nav cfg={cfg} name={cfg.appName} cartCount={cartCount} dark={dark} onLogo={() => setPage("home")} />
          <div className="px-6 py-4">
            <button onClick={() => setPage("home")} className="text-xs text-slate-500 underline mb-3">← Back</button>
            <div className={`h-48 rounded-xl bg-gradient-to-br ${openProduct.color}`} style={{ borderRadius: r }}></div>
            <h1 className="text-2xl font-bold mt-3">{openProduct.name}</h1>
            <div className="flex items-center justify-between mt-1"><span className="text-sm">⭐ {openProduct.rating} (124 reviews)</span><span className="text-2xl font-bold" style={{ color: cfg.primary }}>৳ {openProduct.price}</span></div>
            <div className="text-xs text-slate-500 mt-3">{T(cfg.language, "Choose color", "রঙ নির্বাচন")}</div>
            <div className="flex gap-2 mt-1">{["#ef4444", "#3b82f6", "#10b981", "#f59e0b"].map((c, i) => <button key={c} className={`w-6 h-6 rounded-full border-2 ${i === 0 ? "border-slate-900" : "border-transparent"}`} style={{ background: c }}></button>)}</div>
            <button data-testid="ecom-detail-add" onClick={() => { addToCart(openProduct); setPage("cart"); }} className="mt-4 w-full text-white font-semibold py-2.5 rounded-md" style={{ background: cfg.primary, borderRadius: r }}>{T(cfg.language, "Add to Cart", "কার্টে যোগ")}</button>
          </div>
        </>
      )}
      {page === "cart" && (
        <>
          <Nav cfg={cfg} name={cfg.appName} cartCount={cartCount} dark={dark} onLogo={() => setPage("home")} />
          <div className="px-6 py-4">
            <h2 className="font-bold text-xl mb-3">{T(cfg.language, "Your Cart", "আপনার কার্ট")}</h2>
            {cart.length === 0 ? <div className="text-sm text-slate-500">{T(cfg.language, "Cart is empty", "কার্ট খালি")}</div> : (
              <>
                {cart.map((c) => (
                  <div key={c.id} className={`flex items-center gap-3 ${dark ? "bg-gray-800" : "bg-white"} border border-slate-200 rounded-md p-3 mb-2`} style={{ borderRadius: r }}>
                    <div className={`w-12 h-12 rounded bg-gradient-to-br ${c.color}`}></div>
                    <div className="flex-1"><div className="text-sm font-semibold">{c.name}</div><div className="text-xs" style={{ color: cfg.primary }}>৳ {c.price} × {c.qty}</div></div>
                    <button onClick={() => setCart((p) => p.filter((x) => x.id !== c.id))} className="text-rose-500">×</button>
                  </div>
                ))}
                <div className={`mt-3 ${dark ? "bg-gray-800" : "bg-slate-50"} rounded-md p-3 text-sm space-y-1`} style={{ borderRadius: r }}>
                  <div className="flex justify-between"><span>{T(cfg.language, "Subtotal", "সাবটোটাল")}</span><span>৳ {subtotal}</span></div>
                  <div className="flex justify-between"><span>{T(cfg.language, "Delivery", "ডেলিভারি")}</span><span>৳ {delivery}</span></div>
                  {fee > 0 && <div className="flex justify-between text-xs text-slate-500"><span>Platform Fee ({cfg.payment.platformFee}%)</span><span>৳ {fee}</span></div>}
                  <div className="flex justify-between font-bold pt-2 border-t border-slate-200"><span>Total</span><span style={{ color: cfg.primary }}>৳ {total}</span></div>
                </div>
                <button data-testid="ecom-checkout-btn" onClick={() => setPage("checkout")} className="mt-3 w-full text-white font-semibold py-2.5 rounded-md" style={{ background: cfg.primary, borderRadius: r }}>{T(cfg.language, "Proceed to Checkout", "চেকআউট করুন")} →</button>
              </>
            )}
          </div>
        </>
      )}
      {page === "checkout" && (
        <>
          <Nav cfg={cfg} name={cfg.appName} cartCount={cartCount} dark={dark} onLogo={() => setPage("home")} />
          <div className="px-6 py-4 max-w-lg">
            <h2 className="font-bold text-xl mb-3">{T(cfg.language, "Checkout", "চেকআউট")}</h2>
            <div className={`${dark ? "bg-gray-800" : "bg-white"} border border-slate-200 rounded-md p-3 text-sm`} style={{ borderRadius: r }}>
              <div className="font-semibold">{T(cfg.language, "Delivery Address", "ডেলিভারি ঠিকানা")}</div>
              <div className="text-xs text-slate-500 mt-1">{user || "Customer"}, Banani DOHS, Dhaka</div>
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-4 mb-2">{T(cfg.language, "Payment Method", "পেমেন্ট মাধ্যম")}</div>
            {(cfg.payment?.ssl ?? true) && <div className={`border-2 rounded-md p-3 mb-2 text-sm`} style={{ borderColor: cfg.primary, borderRadius: r }}>💳 SSL Commerz <div className="flex gap-1.5 mt-1 text-[10px]">{["bKash", "Nagad", "VISA", "Master"].map((p) => <span key={p} className="bg-slate-100 px-1.5 py-0.5 rounded font-bold">{p}</span>)}</div></div>}
            {cfg.payment?.robi && <div className="border border-slate-200 rounded-md p-3 mb-2 text-sm" style={{ borderRadius: r }}>📱 Robi Balance</div>}
            {cfg.payment?.cod && <div className="border border-slate-200 rounded-md p-3 mb-2 text-sm" style={{ borderRadius: r }}>🏠 Cash on Delivery</div>}
            <button data-testid="ecom-place-order" onClick={() => setPayOverlay(true)} className="mt-3 w-full text-white font-semibold py-2.5 rounded-md" style={{ background: cfg.primary, borderRadius: r }}>{T(cfg.language, "Place Order", "অর্ডার নিশ্চিত করুন")} — ৳ {total}</button>
          </div>
          <PaymentOverlay open={payOverlay} cfg={cfg} onDone={() => { setPayOverlay(false); setOrderId(`BD-${Math.floor(Math.random() * 900000 + 100000)}`); setPage("done"); setCart([]); }} />
        </>
      )}
      {page === "done" && (
        <div className="px-6 py-10 text-center max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-4xl text-emerald-600">✓</div>
          <h2 className="font-bold text-2xl mt-4">{T(cfg.language, "Order Placed Successfully! 🎉", "অর্ডার সফল! 🎉")}</h2>
          <div className="text-sm mt-1">Order ID: <span className="font-bold font-mono" style={{ color: cfg.primary }}>#{orderId}</span></div>
          <div className="text-xs text-slate-500 mt-1">{T(cfg.language, "Estimated Delivery: 2-4 days", "ডেলিভারি: ২-৪ দিন")}</div>
          <div className="mt-6 grid grid-cols-4 gap-2 text-xs">{["Placed ✓", "Confirmed", "Shipped", "Delivered"].map((s, i) => <div key={s} className={`p-2 rounded ${i === 0 ? "text-white" : "bg-slate-100"}`} style={i === 0 ? { background: cfg.primary } : {}}>{s}</div>)}</div>
          <button data-testid="ecom-continue" onClick={() => setPage("home")} className="mt-4 w-full text-white font-semibold py-2.5 rounded-md" style={{ background: cfg.primary, borderRadius: r }}>{T(cfg.language, "Continue Shopping", "আরও কেনাকাটা")}</button>
        </div>
      )}
    </div>
  );
};

// ============== 2. FOOD ORDERING ==============
const FoodOrder = ({ cfg }) => {
  const [page, setPage] = useState("home");
  const [items, setItems] = useState([]);
  const [trackStep, setTrackStep] = useState(0);
  const r = cfg.radius != null ? `${cfg.radius}px` : "10px";
  useEffect(() => {
    if (page !== "tracking") { setTrackStep(0); return; }
    const id = setInterval(() => setTrackStep((s) => s < 3 ? s + 1 : s), 2000);
    return () => clearInterval(id);
  }, [page]);
  const menu = [
    { id: 1, name: "Beef Burger", cat: "Burger", price: 320, e: "🍔" },
    { id: 2, name: "Margherita Pizza", cat: "Pizza", price: 580, e: "🍕" },
    { id: 3, name: "Chicken Biryani", cat: "Biryani", price: 280, e: "🍛" },
    { id: 4, name: "Fries Large", cat: "Sides", price: 120, e: "🍟" },
  ];
  const total = items.reduce((s, x) => s + x.price * x.qty, 0);
  const add = (m) => setItems((p) => { const ex = p.find((x) => x.id === m.id); return ex ? p.map((x) => x.id === m.id ? { ...x, qty: x.qty + 1 } : x) : [...p, { ...m, qty: 1 }]; });
  return (
    <div style={f(cfg)}>
      <div className="px-6 py-4 text-white" style={{ background: `linear-gradient(135deg, ${cfg.primary}, ${cfg.accent})` }}>
        <div className="font-bold text-xl">{cfg.appName}</div>
        <div className="text-xs opacity-80">{cfg.tagline}</div>
      </div>
      {page === "home" && (
        <div className="px-6 py-4">
          <div className="flex gap-2 mb-3 overflow-x-auto">{["All", "Burger", "Pizza", "Biryani", "Drinks"].map((c) => <span key={c} className="text-xs px-3 py-1 rounded-full bg-slate-100">{c}</span>)}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {menu.map((m) => (
              <div key={m.id} data-testid={`food-item-${m.id}`} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3" style={{ borderRadius: r }}>
                <div className="text-3xl">{m.e}</div>
                <div className="flex-1"><div className="font-semibold text-sm">{m.name}</div><div className="text-xs" style={{ color: cfg.primary }}>৳ {m.price}</div></div>
                <button data-testid={`food-add-${m.id}`} onClick={() => add(m)} className="w-8 h-8 rounded-full text-white text-xl flex items-center justify-center" style={{ background: cfg.primary }}>+</button>
              </div>
            ))}
          </div>
          {items.length > 0 && (
            <button data-testid="food-cart-btn" onClick={() => setPage("cart")} className="fixed-cart sticky bottom-2 mt-4 w-full text-white font-bold py-3 rounded-md" style={{ background: cfg.primary, borderRadius: r }}>{T(cfg.language, "View Cart", "কার্ট")} • ৳ {total}</button>
          )}
        </div>
      )}
      {page === "cart" && (
        <div className="px-6 py-4">
          <button onClick={() => setPage("home")} className="text-xs text-slate-500 underline mb-3">← Back</button>
          {items.map((i) => <div key={i.id} className="flex justify-between bg-white border border-slate-200 rounded-md p-2 mb-1.5 text-sm" style={{ borderRadius: r }}><span>{i.e} {i.name} × {i.qty}</span><span style={{ color: cfg.primary }}>৳ {i.price * i.qty}</span></div>)}
          <textarea placeholder={T(cfg.language, "Special instructions...", "বিশেষ নির্দেশনা...")} className="w-full border border-slate-200 rounded-md p-2 mt-2 text-sm h-16" />
          <button data-testid="food-place-order" onClick={() => setPage("tracking")} className="mt-3 w-full text-white font-semibold py-2.5 rounded-md" style={{ background: cfg.primary, borderRadius: r }}>{T(cfg.language, "Place Order", "অর্ডার করুন")} — ৳ {total}</button>
        </div>
      )}
      {page === "tracking" && (
        <div className="px-6 py-6">
          <h2 className="font-bold text-xl text-center mb-4">{T(cfg.language, "Order Tracking", "অর্ডার ট্র্যাকিং")}</h2>
          {["Order Received", "Preparing", "Out for Delivery", "Delivered"].map((s, i) => (
            <div key={s} className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${i === trackStep ? "animate-pulse" : ""}`} style={{ background: i <= trackStep ? cfg.primary : "#cbd5e1" }}>{i <= trackStep ? "✓" : i + 1}</div>
              <div className="text-sm font-semibold">{s}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============== Generic placeholder for remaining 6 universal templates ==============
// To keep this efficient, we render functional 3-page flows for each.
const SimpleFlow = ({ cfg, pages }) => {
  const [idx, setIdx] = useState(0);
  const p = pages[idx];
  return (
    <div style={f(cfg)}>
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200">
        <div className="font-bold tracking-tight" style={{ color: cfg.primary }}>{cfg.appName}</div>
        <div className="flex gap-2">
          <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} className="text-xs px-2 py-1 rounded border border-slate-200 disabled:opacity-30">←</button>
          <span className="text-xs text-slate-500 self-center">Step {idx + 1} / {pages.length}</span>
          <button onClick={() => setIdx(Math.min(pages.length - 1, idx + 1))} disabled={idx === pages.length - 1} className="text-xs px-2 py-1 rounded border border-slate-200 disabled:opacity-30">→</button>
        </div>
      </div>
      <div className="p-6">{p}</div>
    </div>
  );
};

// 3. Health Clinic
const HealthClinic = ({ cfg }) => {
  const [stage, setStage] = useState("doctors");
  const [doctor, setDoctor] = useState(null);
  const [slot, setSlot] = useState(null);
  const [otp, setOtp] = useState("");
  const r = cfg.radius != null ? `${cfg.radius}px` : "10px";
  const doctors = [
    { id: 1, name: "Dr. Anika Rahman", spec: "Cardiologist", fee: 1500, rating: 4.9 },
    { id: 2, name: "Dr. Tarif Hossain", spec: "Pediatrician", fee: 1000, rating: 4.8 },
    { id: 3, name: "Dr. Shamima Akter", spec: "Dermatologist", fee: 1200, rating: 4.7 },
    { id: 4, name: "Dr. Imran Ali", spec: "Orthopedic", fee: 1800, rating: 4.9 },
  ];
  return (
    <div style={f(cfg)}>
      <div className="px-6 py-4 text-white" style={{ background: `linear-gradient(135deg, ${cfg.primary}, ${cfg.accent})` }}><div className="font-bold text-xl">{cfg.appName}</div><div className="text-xs opacity-80">{cfg.tagline}</div></div>
      {stage === "doctors" && (
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {doctors.map((d) => (
              <div key={d.id} data-testid={`health-doc-${d.id}`} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3" style={{ borderRadius: r }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: cfg.primary }}>{d.name.split(" ")[1].charAt(0)}</div>
                <div className="flex-1"><div className="font-semibold text-sm">{d.name}</div><div className="text-xs text-slate-500">{d.spec} · ⭐ {d.rating}</div><div className="text-xs font-bold mt-1" style={{ color: cfg.primary }}>৳ {d.fee}</div></div>
                <button data-testid={`health-book-${d.id}`} onClick={() => { setDoctor(d); setStage("slot"); }} className="text-xs text-white px-2 py-1 rounded" style={{ background: cfg.primary }}>Book</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {stage === "slot" && (
        <div className="px-6 py-4">
          <button onClick={() => setStage("doctors")} className="text-xs underline">← Back</button>
          <div className="font-bold mt-2">{doctor.name}</div>
          <div className="text-xs text-slate-500 mb-3">{T(cfg.language, "Select a time slot", "সময় নির্বাচন")}</div>
          <div className="grid grid-cols-3 gap-2">{["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM", "6:30 PM"].map((s) => <button key={s} data-testid={`health-slot-${s.replace(/[^a-z0-9]+/gi, "-")}`} onClick={() => setSlot(s)} className={`text-xs py-2 rounded-md border ${slot === s ? "text-white" : "border-slate-200"}`} style={slot === s ? { background: cfg.primary, borderColor: cfg.primary } : {}}>{s}</button>)}</div>
          <button data-testid="health-continue" disabled={!slot} onClick={() => setStage("otp")} className="mt-4 w-full text-white font-semibold py-2.5 rounded-md disabled:opacity-40" style={{ background: cfg.primary, borderRadius: r }}>{T(cfg.language, "Continue with OTP", "OTP দিয়ে এগিয়ে যান")}</button>
        </div>
      )}
      {stage === "otp" && (
        <div className="px-6 py-4 max-w-sm">
          <div className="text-xs text-slate-500 mb-2">{T(cfg.language, "Enter 4-digit OTP (any code works)", "৪ অঙ্কের OTP")}</div>
          <input data-testid="health-otp" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="••••" className="w-full border border-slate-200 rounded-md px-3 py-2 text-center font-mono text-xl tracking-[0.5em]" />
          <button data-testid="health-verify" onClick={() => otp.length >= 4 && setStage("done")} className="mt-3 w-full text-white font-semibold py-2.5 rounded-md" style={{ background: cfg.primary, borderRadius: r }}>{T(cfg.language, "Verify & Book", "যাচাই করুন")}</button>
        </div>
      )}
      {stage === "done" && (
        <div className="px-6 py-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-3xl text-emerald-600">✓</div>
          <h2 className="font-bold text-xl mt-3">{T(cfg.language, "Appointment Confirmed!", "অ্যাপয়েন্টমেন্ট নিশ্চিত!")}</h2>
          <div className="bg-slate-50 rounded-md p-3 mt-3 text-sm">
            <div className="font-semibold">{doctor.name}</div>
            <div className="text-xs text-slate-500">Tomorrow, {slot}</div>
          </div>
          <button onClick={() => setStage("doctors")} className="mt-3 text-xs underline">{T(cfg.language, "Book another", "আরো বুক করুন")}</button>
        </div>
      )}
    </div>
  );
};

// 4. eLearning
const ELearning = ({ cfg }) => {
  const [stage, setStage] = useState("catalog");
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState([]);
  const [lesson, setLesson] = useState(0);
  const r = cfg.radius != null ? `${cfg.radius}px` : "10px";
  const courses = [
    { id: 1, t: "Bangla for Beginners", inst: "Sadia R.", price: 1200, color: "from-purple-500 to-pink-500" },
    { id: 2, t: "Modern JavaScript", inst: "Imran A.", price: 2500, color: "from-blue-500 to-cyan-500" },
    { id: 3, t: "UX Design Mastery", inst: "Tanjima H.", price: 3200, color: "from-amber-500 to-orange-500" },
  ];
  return (
    <div style={f(cfg)}>
      <div className="px-6 py-4 text-white" style={{ background: `linear-gradient(135deg, ${cfg.primary}, ${cfg.accent})` }}><div className="font-bold text-xl">{cfg.appName}</div><div className="text-xs opacity-80">{cfg.tagline}</div></div>
      {stage === "catalog" && (
        <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {courses.map((c) => (
            <div key={c.id} data-testid={`edu-course-${c.id}`} className="bg-white border border-slate-200 rounded-xl overflow-hidden" style={{ borderRadius: r }}>
              <div className={`h-24 bg-gradient-to-br ${c.color}`}></div>
              <div className="p-3">
                <div className="font-semibold">{c.t}</div>
                <div className="text-xs text-slate-500">by {c.inst}</div>
                <div className="text-sm font-bold mt-1" style={{ color: cfg.primary }}>৳ {c.price}</div>
                <button data-testid={`edu-enroll-${c.id}`} onClick={() => { setCourse(c); setStage("detail"); }} className="mt-2 w-full text-white text-xs font-semibold py-1.5 rounded-md" style={{ background: cfg.primary }}>{enrolled.includes(c.id) ? T(cfg.language, "Continue", "চালিয়ে যান") : T(cfg.language, "Enroll", "নথিভুক্ত")}</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {stage === "detail" && course && (
        <div className="px-6 py-4">
          <button onClick={() => setStage("catalog")} className="text-xs underline">← Back</button>
          <div className={`h-32 rounded-xl bg-gradient-to-br ${course.color} mt-2`}></div>
          <h2 className="font-bold text-xl mt-3">{course.t}</h2>
          <div className="text-xs text-slate-500">by {course.inst}</div>
          <div className="bg-slate-50 rounded-md p-3 mt-3 space-y-1">{["Intro", "Fundamentals", "Practice", "Advanced", "Project"].map((m, i) => <div key={m} className="text-sm">📚 Module {i + 1}: {m}</div>)}</div>
          <button data-testid="edu-pay" onClick={() => { setEnrolled([...enrolled, course.id]); setStage("lesson"); setLesson(0); }} className="mt-3 w-full text-white font-semibold py-2.5 rounded-md" style={{ background: cfg.primary, borderRadius: r }}>{enrolled.includes(course.id) ? T(cfg.language, "Open Course", "কোর্স খুলুন") : T(cfg.language, `Enroll — ৳ ${course.price}`, `নথিভুক্ত — ৳ ${course.price}`)}</button>
        </div>
      )}
      {stage === "lesson" && course && (
        <div>
          <div className="bg-slate-900 text-white h-48 flex items-center justify-center"><div className="text-5xl">▶</div></div>
          <div className="px-6 py-3 flex items-center justify-between"><div className="font-bold">Module {lesson + 1} — Lesson</div><div className="text-xs">{(lesson + 1) * 20}% complete</div></div>
          <div className="h-1 bg-slate-100"><div className="h-full" style={{ width: `${(lesson + 1) * 20}%`, background: cfg.primary }}></div></div>
          <div className="px-6 py-3 flex gap-2">
            <button data-testid="edu-prev-lesson" onClick={() => setLesson(Math.max(0, lesson - 1))} disabled={lesson === 0} className="text-xs px-3 py-1.5 border border-slate-200 rounded-md disabled:opacity-30">← Prev</button>
            <button data-testid="edu-next-lesson" onClick={() => setLesson(Math.min(4, lesson + 1))} disabled={lesson === 4} className="text-xs px-3 py-1.5 text-white rounded-md disabled:opacity-30" style={{ background: cfg.primary }}>Next →</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Remaining: Real Estate, Travel, NGO, SaaS — compact 3-stage flows
const RealEstate = ({ cfg }) => {
  const [open, setOpen] = useState(null);
  const [sent, setSent] = useState(false);
  const props = [
    { id: 1, t: "3BR Banani Penthouse", p: 18000000, b: 3, ba: 3, sqft: 2400, c: "from-slate-600 to-slate-900" },
    { id: 2, t: "2BR Gulshan Modern", p: 9200000, b: 2, ba: 2, sqft: 1450, c: "from-indigo-700 to-blue-900" },
    { id: 3, t: "Studio Dhanmondi", p: 4500000, b: 1, ba: 1, sqft: 720, c: "from-amber-700 to-red-800" },
  ];
  return (
    <div style={f(cfg)}>
      <div className="px-6 py-4 text-white" style={{ background: `linear-gradient(135deg, ${cfg.primary}, ${cfg.accent})` }}><div className="font-bold text-xl">{cfg.appName}</div><div className="text-xs opacity-80">{cfg.tagline}</div></div>
      {!open ? (
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {props.map((p) => (
            <button key={p.id} data-testid={`re-prop-${p.id}`} onClick={() => setOpen(p)} className="text-left bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className={`h-32 bg-gradient-to-br ${p.c} relative`}><span className="absolute top-2 right-2 text-xs font-bold text-white bg-black/50 px-2 py-0.5 rounded">৳ {(p.p / 100000).toFixed(0)}L</span></div>
              <div className="p-3"><div className="font-semibold">{p.t}</div><div className="text-xs text-slate-500">{p.b}BR · {p.ba} bath · {p.sqft} sqft</div></div>
            </button>
          ))}
        </div>
      ) : sent ? (
        <div className="px-6 py-8 text-center"><div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-2xl text-emerald-600">✓</div><div className="font-bold mt-3">{T(cfg.language, "Inquiry Sent", "ইনকোয়ারি পাঠানো হয়েছে")}</div><div className="text-xs text-slate-500">{T(cfg.language, "Agent will contact you within 2 hours.", "এজেন্ট ২ ঘণ্টার মধ্যে যোগাযোগ করবেন।")}</div><button onClick={() => { setOpen(null); setSent(false); }} className="mt-3 text-xs underline">Back to listings</button></div>
      ) : (
        <div className="px-6 py-4">
          <button onClick={() => setOpen(null)} className="text-xs underline">← Back</button>
          <div className={`h-48 bg-gradient-to-br ${open.c} rounded-xl mt-2`}></div>
          <h2 className="font-bold text-xl mt-3">{open.t}</h2>
          <div className="text-lg font-bold" style={{ color: cfg.primary }}>৳ {(open.p / 100000).toFixed(0)} Lakh</div>
          <div className="text-sm mt-3 font-semibold">{T(cfg.language, "Inquire", "তথ্য জানতে চান")}</div>
          <input data-testid="re-inq-name" placeholder="Name" className="w-full border border-slate-200 rounded-md p-2 text-sm mt-2" />
          <input data-testid="re-inq-phone" placeholder="Phone" className="w-full border border-slate-200 rounded-md p-2 text-sm mt-2" />
          <button data-testid="re-inq-submit" onClick={() => setSent(true)} className="mt-3 w-full text-white py-2 rounded-md font-semibold" style={{ background: cfg.primary }}>{T(cfg.language, "Send Inquiry", "ইনকোয়ারি পাঠান")}</button>
        </div>
      )}
    </div>
  );
};

const TravelBooking = ({ cfg }) => {
  const [open, setOpen] = useState(null);
  const [booked, setBooked] = useState(false);
  const tours = [
    { id: 1, t: "Cox's Bazar 3 Days", p: 12500, c: "from-sky-500 to-cyan-700" },
    { id: 2, t: "Sajek Valley Trek", p: 8800, c: "from-emerald-500 to-green-700" },
    { id: 3, t: "Sundarbans Adventure", p: 15200, c: "from-amber-500 to-orange-700" },
  ];
  return (
    <div style={f(cfg)}>
      <div className="px-6 py-4 text-white" style={{ background: `linear-gradient(135deg, ${cfg.primary}, ${cfg.accent})` }}><div className="font-bold text-xl">{cfg.appName}</div><div className="text-xs opacity-80">{cfg.tagline}</div></div>
      {booked ? (
        <div className="px-6 py-8 text-center"><div className="text-3xl">🎉</div><div className="font-bold mt-2">{T(cfg.language, "Trip Booked!", "ট্রিপ বুক হয়েছে!")}</div><div className="text-xs text-slate-500">Booking ID: BD-{Math.floor(Math.random() * 9000 + 1000)}</div><button onClick={() => { setOpen(null); setBooked(false); }} className="mt-3 text-xs underline">My Trips</button></div>
      ) : !open ? (
        <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tours.map((t) => (
            <button key={t.id} data-testid={`travel-tour-${t.id}`} onClick={() => setOpen(t)} className="text-left bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className={`h-28 bg-gradient-to-br ${t.c}`}></div>
              <div className="p-3"><div className="font-semibold text-sm">{t.t}</div><div className="text-xs font-bold mt-1" style={{ color: cfg.primary }}>৳ {t.p}</div></div>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-6 py-4">
          <button onClick={() => setOpen(null)} className="text-xs underline">← Back</button>
          <div className={`h-40 bg-gradient-to-br ${open.c} rounded-xl mt-2`}></div>
          <h2 className="font-bold text-xl mt-3">{open.t}</h2>
          <div className="text-xs text-slate-500 mt-1">Includes: stay, transport, meals</div>
          <button data-testid="travel-book" onClick={() => setBooked(true)} className="mt-3 w-full text-white py-2.5 rounded-md font-semibold" style={{ background: cfg.primary }}>{T(cfg.language, `Book Now — ৳ ${open.p}`, `বুক করুন — ৳ ${open.p}`)}</button>
        </div>
      )}
    </div>
  );
};

const NgoPlatform = ({ cfg }) => {
  const [stage, setStage] = useState("home");
  const [amt, setAmt] = useState(500);
  const camps = [
    { id: 1, t: "Flood Relief — Sylhet", goal: 500000, raised: 350000 },
    { id: 2, t: "School Books for 1000 Kids", goal: 200000, raised: 90000 },
    { id: 3, t: "Cancer Treatment for Imran", goal: 800000, raised: 700000 },
  ];
  return (
    <div style={f(cfg)}>
      <div className="px-6 py-4 text-white" style={{ background: `linear-gradient(135deg, ${cfg.primary}, ${cfg.accent})` }}><div className="font-bold text-xl">{cfg.appName}</div><div className="text-xs opacity-80">{cfg.tagline}</div></div>
      {stage === "home" && (
        <div className="px-6 py-4 space-y-3">
          {camps.map((c) => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="font-semibold">{c.t}</div>
              <div className="h-2 mt-2 bg-slate-100 rounded-full relative overflow-hidden"><div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(c.raised / c.goal) * 100}%`, background: `linear-gradient(90deg, ${cfg.primary}, ${cfg.accent})` }}></div></div>
              <div className="text-xs text-slate-500 mt-1">৳ {c.raised.toLocaleString()} / ৳ {c.goal.toLocaleString()}</div>
              <button data-testid={`ngo-donate-${c.id}`} onClick={() => setStage("donate")} className="mt-2 w-full text-white font-semibold py-2 rounded-md text-sm" style={{ background: cfg.primary }}>{T(cfg.language, "Donate", "অনুদান")}</button>
            </div>
          ))}
        </div>
      )}
      {stage === "donate" && (
        <div className="px-6 py-4">
          <button onClick={() => setStage("home")} className="text-xs underline">← Back</button>
          <div className="font-bold mt-2">{T(cfg.language, "Choose donation amount", "অনুদানের পরিমাণ নির্বাচন")}</div>
          <div className="grid grid-cols-4 gap-2 mt-2">{[100, 500, 1000, 5000].map((a) => <button key={a} data-testid={`ngo-amt-${a}`} onClick={() => setAmt(a)} className={`py-2 rounded-md text-sm font-semibold ${amt === a ? "text-white" : "bg-slate-100"}`} style={amt === a ? { background: cfg.primary } : {}}>৳ {a}</button>)}</div>
          <button data-testid="ngo-pay" onClick={() => setStage("thanks")} className="mt-3 w-full text-white font-semibold py-2.5 rounded-md" style={{ background: cfg.primary }}>{T(cfg.language, `Donate ৳ ${amt}`, `অনুদান ৳ ${amt}`)}</button>
        </div>
      )}
      {stage === "thanks" && (
        <div className="px-6 py-8 text-center">
          <div className="text-5xl">❤️</div><h2 className="font-bold text-xl mt-2">{T(cfg.language, "Thank you!", "ধন্যবাদ!")}</h2>
          <div className="text-xs text-slate-500">৳ {amt} donated. Certificate sent to your email.</div>
          <button onClick={() => setStage("home")} className="mt-3 text-xs underline">Back</button>
        </div>
      )}
    </div>
  );
};

const SaasDashboard = ({ cfg }) => {
  const [stage, setStage] = useState("landing");
  const [plan, setPlan] = useState("Pro");
  const plans = [
    { name: "Starter", p: "Free", f: ["1 project", "Email support"] },
    { name: "Pro", p: "BDT 2,500/mo", f: ["10 projects", "Priority support", "Analytics"], rec: true },
    { name: "Enterprise", p: "Custom", f: ["Unlimited", "24/7 phone", "SLA 99.99%"] },
  ];
  return (
    <div style={f(cfg)} className={cfg.dark ? "bg-gray-900 text-white" : "bg-white"}>
      <div className="px-6 py-4 flex items-center justify-between" style={{ background: cfg.primary, color: "white" }}>
        <div className="font-bold text-xl">{cfg.appName}</div>
        <div className="text-xs">SaaS · BD</div>
      </div>
      {stage === "landing" && (
        <div className="px-6 py-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{cfg.tagline}</h1>
          <button onClick={() => setStage("signup")} className="mt-4 text-sm font-semibold px-6 py-3 rounded-md text-white" style={{ background: cfg.accent }}>{T(cfg.language, "Start Free Trial", "ফ্রি ট্রায়াল")}</button>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
            {plans.map((pl) => (
              <button key={pl.name} data-testid={`saas-plan-${pl.name.toLowerCase()}`} onClick={() => { setPlan(pl.name); setStage("signup"); }} className={`text-left rounded-xl border-2 p-4 ${plan === pl.name ? "" : "border-slate-200"}`} style={plan === pl.name ? { borderColor: cfg.accent } : {}}>
                {pl.rec && <span className="text-[10px] uppercase tracking-widest font-bold text-white px-2 py-0.5 rounded" style={{ background: cfg.accent }}>Recommended</span>}
                <div className="font-bold mt-1">{pl.name}</div>
                <div className="text-xl font-bold" style={{ color: cfg.primary }}>{pl.p}</div>
                <ul className="text-xs mt-2 space-y-0.5">{pl.f.map((x) => <li key={x}>✓ {x}</li>)}</ul>
              </button>
            ))}
          </div>
        </div>
      )}
      {stage === "signup" && (
        <div className="px-6 py-6 max-w-sm mx-auto">
          <div className="text-xs uppercase tracking-widest font-bold text-slate-500">Signing up for {plan}</div>
          <input data-testid="saas-email" placeholder="Email" className="w-full border border-slate-200 rounded-md p-2 text-sm mt-2" />
          <input data-testid="saas-password" type="password" placeholder="Password" className="w-full border border-slate-200 rounded-md p-2 text-sm mt-2" />
          <button data-testid="saas-create" onClick={() => setStage("dashboard")} className="mt-3 w-full text-white font-semibold py-2.5 rounded-md" style={{ background: cfg.primary }}>{T(cfg.language, "Create Account", "অ্যাকাউন্ট")}</button>
        </div>
      )}
      {stage === "dashboard" && (
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[{ l: "Users", v: "12,438" }, { l: "Revenue", v: "৳ 4.8L" }, { l: "MRR", v: "৳ 92K" }, { l: "Churn", v: "1.2%" }].map((s) => <div key={s.l} className={`${cfg.dark ? "bg-gray-800" : "bg-white"} border border-slate-200 rounded-lg p-3`}><div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{s.l}</div><div className="text-lg font-bold mt-1" style={{ color: cfg.primary }}>{s.v}</div></div>)}
          </div>
          <div className={`mt-3 ${cfg.dark ? "bg-gray-800" : "bg-white"} border border-slate-200 rounded-lg p-4`}>
            <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Activity Trend</div>
            <div className="h-32 flex items-end gap-1">{[40, 70, 55, 90, 65, 80, 50].map((h, i) => <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: cfg.primary }}></div>)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

const PREVIEWS = {
  "web-ecom": EcomStore,
  "web-food": FoodOrder,
  "web-health": HealthClinic,
  "web-edu": ELearning,
  "web-realestate": RealEstate,
  "web-travel": TravelBooking,
  "web-ngo": NgoPlatform,
  "web-saas": SaasDashboard,
  "web-sathibd": SathiBDWebPreview,
  "web-newsnow": NewsWebPreview,
  "web-quizbd": QuizWebPreview,
};

const UniversalWebPreview = ({ templateId, cfg, url, height = "h-[600px]", content }) => {
  const Comp = PREVIEWS[templateId] || EcomStore;
  return (
    <BrowserChrome url={url || `${(cfg.appName || "app").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.bdapps.app`} dark={cfg.dark} height={height}>
      <Comp cfg={cfg} content={content} />
    </BrowserChrome>
  );
};

export default UniversalWebPreview;
