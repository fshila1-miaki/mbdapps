import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, Search, Heart, ChevronLeft, ChevronRight, Star, Check, Truck, RotateCcw, Lock, Phone, Plus, Minus, X } from "lucide-react";

// Products & banners — mirrors Step 4 content
const PRODUCTS = [
  { id: "p1", name: "Sony WH-1000XM5 Headphones", brand: "Sony", category: "Electronics", price: 18500, sale: 12999, rating: 4.9, reviews: 184, emoji: "🎧", grad: "from-slate-700 to-slate-900", colors: ["#09090B","#64748b","#fee2e2"], stock: 24, desc: "Industry-leading noise cancellation, 30-hour battery, multipoint connection." },
  { id: "p2", name: "Samsung Smart Watch S8", brand: "Samsung", category: "Electronics", price: 24000, rating: 4.8, reviews: 92, emoji: "⌚", grad: "from-blue-600 to-indigo-800", colors: ["#09090B","#94a3b8"], stock: 12, desc: "Advanced fitness tracking, AMOLED display, 5-day battery." },
  { id: "p3", name: "Eid Special Panjabi Set", brand: "Aarong", category: "Fashion", price: 2400, rating: 4.7, reviews: 53, emoji: "👔", grad: "from-amber-500 to-orange-700", colors: ["#92400e","#075985","#1e293b"], stock: 35, desc: "Premium cotton Panjabi with matching pajama. Perfect for Eid." },
  { id: "p4", name: "Nike Air Zoom Running Shoes", brand: "Nike", category: "Sports", price: 8900, rating: 4.6, reviews: 76, emoji: "👟", grad: "from-red-500 to-rose-700", colors: ["#1e293b","#dc2626","#f8fafc"], stock: 18, desc: "Lightweight, responsive cushioning for daily runs." },
  { id: "p5", name: "Philips Air Fryer 4.5L", brand: "Philips", category: "Home Living", price: 7500, sale: 5999, rating: 4.8, reviews: 128, emoji: "🍳", grad: "from-zinc-500 to-zinc-800", colors: ["#1e293b","#f8fafc"], stock: 8, desc: "Healthy frying with 90% less oil. Rapid air technology." },
  { id: "p6", name: "Gym Resistance Bands Set", brand: "Decathlon", category: "Sports", price: 1200, rating: 4.5, reviews: 41, emoji: "🏋", grad: "from-emerald-500 to-green-700", colors: ["#dc2626","#eab308","#16a34a"], stock: 60, desc: "5 resistance levels, door anchor, carry bag included." },
  { id: "p7", name: "SK-II Facial Treatment Essence", brand: "SK-II", category: "Beauty", price: 4800, rating: 4.9, reviews: 215, emoji: "🧴", grad: "from-pink-400 to-rose-600", colors: ["#fbcfe8"], stock: 30, desc: "Iconic Pitera essence for radiant skin. 75ml bottle." },
  { id: "p8", name: "Complete React Development", brand: "Tech Press", category: "Books", price: 850, rating: 4.7, reviews: 67, emoji: "📘", grad: "from-blue-500 to-cyan-700", colors: ["#09090B"], stock: 80, desc: "Master React from fundamentals to production deployment." },
];
const CATS = [{ name: "Electronics", icon: "💻" }, { name: "Fashion", icon: "👗" }, { name: "Home Living", icon: "🏠" }, { name: "Sports", icon: "⚽" }, { name: "Beauty", icon: "💄" }, { name: "Books", icon: "📚" }];
const BANNERS = [
  { title: "Eid Special Sale — Up to 60% OFF", subtitle: "On all electronics this week", cta: "Shop Now", grad: "from-rose-600 via-red-600 to-amber-500", emoji: "🎉" },
  { title: "New Electronics Just Arrived", subtitle: "Latest gadgets from top brands", cta: "Browse", grad: "from-slate-800 via-blue-800 to-indigo-700", emoji: "📦" },
  { title: "Free Delivery on Orders Above BDT 500", subtitle: "Across Dhaka, Chittagong & Sylhet", cta: "Order Now", grad: "from-orange-500 via-amber-500 to-yellow-500", emoji: "🚚" },
];

const RobiMart = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState("home"); // home|catalog|detail|cart|checkout|confirm|account
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [catFilter, setCatFilter] = useState("All");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paying, setPaying] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [payMethod, setPayMethod] = useState("bkash");
  const [accOpen, setAccOpen] = useState(false);

  // Banner auto rotate
  useEffect(() => { const t = setInterval(() => setBannerIdx((i) => (i + 1) % BANNERS.length), 5000); return () => clearInterval(t); }, []);

  // Flash deal countdown
  const [endTime] = useState(() => Date.now() + 4 * 3600 * 1000 + 23 * 60 * 1000);
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick((x) => x + 1), 1000); return () => clearInterval(t); }, []);
  const cd = useMemo(() => {
    const diff = Math.max(0, endTime - Date.now());
    const h = Math.floor(diff / 3600000); const m = Math.floor((diff % 3600000) / 60000); const s = Math.floor((diff % 60000) / 1000);
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  }, [tick, endTime]);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const subtotal = cart.reduce((s, c) => s + (c.sale || c.price) * c.qty, 0);
  const delivery = subtotal >= 500 ? 0 : 60;
  const platformFee = Math.round(subtotal * 0.025);
  const total = subtotal + delivery + platformFee - discount;

  const addToCart = (p) => {
    setCart((c) => {
      const ex = c.find((x) => x.id === p.id);
      if (ex) return c.map((x) => x.id === p.id ? { ...x, qty: x.qty + 1 } : x);
      return [...c, { ...p, qty: 1 }];
    });
  };
  const updateQty = (id, delta) => setCart((c) => c.map((x) => x.id === id ? { ...x, qty: Math.max(0, x.qty + delta) } : x).filter((x) => x.qty > 0));
  const remove = (id) => setCart((c) => c.filter((x) => x.id !== id));
  const applyCoupon = () => {
    if (coupon.toUpperCase() === "EIDSPECIAL") { setDiscount(Math.round(subtotal * 0.1)); }
    else { setDiscount(0); alert("Invalid coupon"); }
  };
  const placeOrder = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setOrderId(`BD-${Math.floor(249000 + Math.random() * 1000)}`);
      setCheckoutStep(3);
      setCart([]);
    }, 2500);
  };

  const filtered = catFilter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === catFilter);

  return (
    <div className="min-h-screen bg-slate-50" data-testid="robimart-app" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <button data-testid="back-to-bdapps" onClick={() => navigate("/my-apps")} className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"><ChevronLeft size={14} /> Back to Orbit</button>
          <button onClick={() => setPage("home")} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-xl">🛒</div>
            <span className="font-bold text-lg tracking-tight">RobiMart <span className="text-orange-600">BD</span></span>
          </button>
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input data-testid="store-search" placeholder="Search products..." className="w-full pl-9 pr-3 py-2 bg-slate-100 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="flex items-center gap-3">
            <button data-testid="cart-btn" onClick={() => setPage("cart")} className="relative p-2 hover:bg-slate-100 rounded-lg">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            <button onClick={() => setAccOpen(!accOpen)} data-testid="account-btn" className="relative flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg">
              <div className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">R</div>
              <span className="hidden md:inline text-sm font-medium">Rafiul Karim</span>
            </button>
            {accOpen && (
              <div className="absolute right-4 top-14 bg-white border border-slate-200 rounded-lg shadow-lg w-56 py-2 z-40">
                <div className="px-3 py-2 border-b border-slate-100"><div className="text-sm font-bold">Rafiul Karim</div><div className="text-[10px] text-slate-500">rafiul@orbit.com</div></div>
                <button data-testid="goto-account" onClick={() => { setPage("account"); setAccOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50">My Account</button>
                <button onClick={() => { setPage("home"); setAccOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50">Order History</button>
                <button onClick={() => setAccOpen(false)} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 text-rose-600">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HOME */}
      {page === "home" && (
        <main className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Hero carousel */}
          <div data-testid="hero-carousel" className={`relative h-56 rounded-2xl overflow-hidden bg-gradient-to-r ${BANNERS[bannerIdx].grad} text-white`}>
            <div className="absolute inset-0 flex items-center justify-between p-8">
              <div className="max-w-md">
                <div className="text-3xl font-bold leading-tight">{BANNERS[bannerIdx].title}</div>
                <div className="text-sm opacity-90 mt-2">{BANNERS[bannerIdx].subtitle}</div>
                <button onClick={() => setPage("catalog")} className="mt-4 bg-white text-slate-900 px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-100">{BANNERS[bannerIdx].cta} →</button>
              </div>
              <div className="text-8xl">{BANNERS[bannerIdx].emoji}</div>
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">{BANNERS.map((_, i) => <button key={i} onClick={() => setBannerIdx(i)} className={`w-2 h-2 rounded-full ${i === bannerIdx ? "bg-white" : "bg-white/40"}`} />)}</div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3" data-testid="categories">
            {CATS.map((c) => (
              <button key={c.name} onClick={() => { setCatFilter(c.name); setPage("catalog"); }} className="bg-white border border-slate-200 rounded-xl p-3 text-center hover:border-orange-300 hover:shadow-md transition-all">
                <div className="text-3xl">{c.icon}</div>
                <div className="text-xs font-bold mt-1">{c.name}</div>
              </button>
            ))}
          </div>

          {/* Flash Deals */}
          <div className="bg-slate-900 text-white rounded-2xl p-5" data-testid="flash-deals">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-3"><span className="text-2xl">⚡</span><div><div className="font-bold text-lg">Flash Deals</div><div className="text-xs text-slate-300">Limited time only</div></div></div>
              <div className="bg-rose-600 px-3 py-1.5 rounded font-mono font-bold text-sm" data-testid="countdown">⏱ {cd}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRODUCTS.filter((p) => p.sale).slice(0, 3).map((p) => (
                <button key={p.id} data-testid={`flash-${p.id}`} onClick={() => { setSelected(p); setPage("detail"); }} className="bg-slate-800 hover:bg-slate-700 rounded-xl p-3 text-left">
                  <div className={`h-24 rounded-lg bg-gradient-to-br ${p.grad} flex items-center justify-center text-5xl`}>{p.emoji}</div>
                  <div className="text-sm font-bold mt-2 truncate">{p.name}</div>
                  <div className="flex items-center gap-2 mt-1"><span className="text-rose-400 font-bold">৳{p.sale}</span><span className="line-through text-xs text-slate-400">৳{p.price}</span></div>
                  <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-rose-500" style={{ width: "87%" }} /></div>
                  <div className="text-[10px] text-slate-300 mt-1">87% sold</div>
                </button>
              ))}
            </div>
          </div>

          {/* Featured */}
          <div>
            <div className="flex items-center justify-between mb-3"><h2 className="text-xl font-bold">Featured Products</h2><button onClick={() => setPage("catalog")} className="text-sm text-orange-600 font-bold">View All →</button></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-testid="featured-grid">
              {PRODUCTS.slice(0, 8).map((p) => <ProductCard key={p.id} p={p} onClick={() => { setSelected(p); setPage("detail"); }} onAdd={() => addToCart(p)} />)}
            </div>
          </div>

          {/* Why */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            {[{ icon: <Truck size={20} />, label: "Free Delivery" },{ icon: <RotateCcw size={20} />, label: "Easy Returns" },{ icon: <Lock size={20} />, label: "Secure Payment" },{ icon: <Phone size={20} />, label: "24/7 Support" }].map((w, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5"><div className="text-orange-600">{w.icon}</div><div className="text-xs font-bold">{w.label}</div></div>
            ))}
          </div>
        </main>
      )}

      {/* CATALOG */}
      {page === "catalog" && (
        <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
          <aside className="md:col-span-3 bg-white border border-slate-200 rounded-xl p-4 space-y-3 h-fit">
            <div className="text-xs uppercase tracking-widest font-bold text-slate-500">Categories</div>
            {["All", ...CATS.map((c) => c.name)].map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" checked={catFilter === c} onChange={() => setCatFilter(c)} />{c}
              </label>
            ))}
            <div className="text-xs uppercase tracking-widest font-bold text-slate-500 pt-2 border-t">Price Range</div>
            <input type="range" min="0" max="50000" defaultValue="50000" className="w-full" />
            <div className="text-xs text-slate-500">BDT 0 – 50,000</div>
          </aside>
          <div className="md:col-span-9">
            <div className="flex items-center justify-between mb-3"><div className="text-sm text-slate-500">Showing {filtered.length} of {PRODUCTS.length} products</div>
              <select className="border border-slate-200 rounded text-xs h-8 px-2"><option>Newest</option><option>Price Low → High</option><option>Top Rated</option></select>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3" data-testid="catalog-grid">
              {filtered.map((p) => <ProductCard key={p.id} p={p} onClick={() => { setSelected(p); setPage("detail"); }} onAdd={() => addToCart(p)} />)}
            </div>
          </div>
        </main>
      )}

      {/* DETAIL */}
      {page === "detail" && selected && <ProductDetail p={selected} onAdd={() => addToCart(selected)} onBuy={() => { addToCart(selected); setPage("checkout"); setCheckoutStep(1); }} onBack={() => setPage("catalog")} />}

      {/* CART */}
      {page === "cart" && (
        <main className="max-w-5xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2" data-testid="cart-items">
            <h1 className="text-2xl font-bold">Shopping Cart ({cartCount} items)</h1>
            {cart.length === 0 && <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-400">Your cart is empty. <button onClick={() => setPage("catalog")} className="text-orange-600 font-bold">Continue shopping →</button></div>}
            {cart.map((c) => (
              <div key={c.id} data-testid={`cart-item-${c.id}`} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${c.grad} flex items-center justify-center text-3xl shrink-0`}>{c.emoji}</div>
                <div className="flex-1 min-w-0"><div className="font-bold truncate">{c.name}</div><div className="text-xs text-slate-500">{c.category}</div></div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(c.id, -1)} className="w-7 h-7 border border-slate-200 rounded hover:bg-slate-50"><Minus size={12} className="mx-auto" /></button>
                  <span className="w-6 text-center font-bold">{c.qty}</span>
                  <button onClick={() => updateQty(c.id, 1)} className="w-7 h-7 border border-slate-200 rounded hover:bg-slate-50"><Plus size={12} className="mx-auto" /></button>
                </div>
                <div className="font-bold w-24 text-right">৳{((c.sale || c.price) * c.qty).toLocaleString()}</div>
                <button onClick={() => remove(c.id)} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded"><X size={14} /></button>
              </div>
            ))}
          </div>
          {cart.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 h-fit space-y-2 sticky top-20" data-testid="order-summary">
              <div className="font-bold">Order Summary</div>
              <Row label="Subtotal" v={`৳${subtotal.toLocaleString()}`} />
              <Row label="Delivery" v={delivery === 0 ? "FREE 🎉" : `৳${delivery}`} green={delivery === 0} />
              <Row label="Platform fee (2.5%)" v={`৳${platformFee}`} />
              {discount > 0 && <Row label="Discount" v={`-৳${discount}`} green />}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-200"><span>Total</span><span>৳{total.toLocaleString()}</span></div>
              <div className="flex gap-2 mt-2">
                <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" data-testid="coupon-input" className="flex-1 border border-slate-200 rounded text-xs h-8 px-2" />
                <button onClick={applyCoupon} data-testid="apply-coupon" className="bg-slate-900 text-white px-3 rounded text-xs font-bold">Apply</button>
              </div>
              {coupon.toUpperCase() === "EIDSPECIAL" && discount > 0 && <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded">✓ You save ৳{discount}!</div>}
              <button data-testid="checkout-btn" onClick={() => { setPage("checkout"); setCheckoutStep(1); }} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-bold mt-2">Proceed to Checkout →</button>
            </div>
          )}
        </main>
      )}

      {/* CHECKOUT */}
      {page === "checkout" && (
        <main className="max-w-3xl mx-auto p-4 space-y-4" data-testid="checkout-flow">
          <div className="flex items-center justify-between">
            {["Delivery","Payment","Confirmation"].map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-1.5 text-xs ${i + 1 === checkoutStep ? "font-bold text-orange-600" : checkoutStep > i + 1 ? "text-emerald-600" : "text-slate-400"}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i + 1 === checkoutStep ? "bg-orange-600 text-white" : checkoutStep > i + 1 ? "bg-emerald-500 text-white" : "bg-slate-200"}`}>{checkoutStep > i + 1 ? <Check size={11} /> : i + 1}</span>
                  {s}
                </div>
                {i < 2 && <div className="flex-1 h-px bg-slate-200 mx-2" />}
              </React.Fragment>
            ))}
          </div>

          {checkoutStep === 1 && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3" data-testid="step-delivery">
              <div className="font-bold">Delivery Address</div>
              <div className="bg-slate-50 rounded p-3 text-sm border border-slate-200">📍 123, Gulshan-1, Dhaka 1212 <span className="text-orange-600 text-xs font-bold ml-2">(Default)</span></div>
              <div className="text-xs text-slate-500">+ Add New Address</div>
              <div className="font-bold pt-2">Delivery Time</div>
              <div className="grid grid-cols-3 gap-2">
                {["Today 2-6pm","Tomorrow 10am-2pm","Specific date"].map((s) => <button key={s} className="border border-slate-200 hover:border-orange-300 rounded p-2 text-xs">{s}</button>)}
              </div>
              <button data-testid="step-1-next" onClick={() => setCheckoutStep(2)} className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold">Continue to Payment →</button>
            </div>
          )}

          {checkoutStep === 2 && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3" data-testid="step-payment">
              <div className="font-bold">Payment Method</div>
              <div className="space-y-2">
                {[{id:"bkash",name:"bKash",emoji:"💗",desc:"Mobile financial service"},{id:"nagad",name:"Nagad",emoji:"🟠",desc:"Send money instantly"},{id:"card",name:"Card (SSL Commerz)",emoji:"💳",desc:"VISA, Mastercard, Amex"},{id:"robi",name:"Robi Balance",emoji:"🔴",desc:"BDT 450 available"},{id:"cod",name:"Cash on Delivery",emoji:"💵",desc:"Pay when you receive"}].map((p) => (
                  <label key={p.id} data-testid={`pay-${p.id}`} className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer ${payMethod === p.id ? "border-orange-500 bg-orange-50" : "border-slate-200"}`}>
                    <input type="radio" checked={payMethod === p.id} onChange={() => setPayMethod(p.id)} />
                    <span className="text-2xl">{p.emoji}</span>
                    <div className="flex-1"><div className="font-bold text-sm">{p.name}</div><div className="text-xs text-slate-500">{p.desc}</div></div>
                  </label>
                ))}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-2 text-[11px] text-blue-700 flex items-center gap-1"><Lock size={11} /> All transactions secured by Orbit Proxy Gateway</div>
              <button data-testid="place-order" onClick={placeOrder} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-bold">Place Order — ৳{total.toLocaleString()}</button>
            </div>
          )}

          {checkoutStep === 3 && (
            <div className="bg-white border border-emerald-300 rounded-2xl p-6 text-center" data-testid="step-confirm">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-4xl text-emerald-600 animate-bounce">✓</div>
              <h1 className="text-3xl font-bold mt-3">Order Placed Successfully! 🎉</h1>
              <div className="text-sm text-slate-500 mt-1">Thank you, Rafiul Karim!</div>
              <div className="mt-3 inline-block bg-slate-100 px-4 py-2 rounded font-mono text-sm">Order #{orderId}</div>
              <div className="mt-4 text-xs text-slate-500">Estimated delivery: {new Date(Date.now() + 3 * 86400000).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}</div>
              <div className="mt-2 text-xs text-emerald-700">📨 Confirmation SMS sent to your Robi number</div>
              <div className="flex gap-2 mt-4 justify-center">
                <button onClick={() => setPage("home")} className="px-5 py-2.5 border border-slate-200 rounded-lg font-bold text-sm">Track Order</button>
                <button onClick={() => setPage("home")} className="px-5 py-2.5 bg-orange-600 text-white rounded-lg font-bold text-sm">Continue Shopping</button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ACCOUNT */}
      {page === "account" && (
        <main className="max-w-3xl mx-auto p-4 space-y-4">
          <h1 className="text-2xl font-bold">My Account</h1>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-xs uppercase font-bold text-slate-500 mb-2">Profile</div>
            <div className="space-y-1 text-sm"><div><b>Name:</b> Rafiul Karim</div><div><b>Email:</b> rafiul@orbit.com</div><div><b>Phone:</b> +880 1700-123456</div><div><b>Address:</b> 123, Gulshan-1, Dhaka 1212</div></div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-xs uppercase font-bold text-slate-500 mb-2">Order History</div>
            {[{id:"BD-00248",date:"2 days ago",total:4500,status:"Delivered"},{id:"BD-00210",date:"1 week ago",total:1899,status:"Delivered"},{id:"BD-00187",date:"3 weeks ago",total:7250,status:"Delivered"}].map((o) => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-sm">
                <div className="font-mono">{o.id}</div><div className="text-slate-500">{o.date}</div><div className="font-bold">৳{o.total.toLocaleString()}</div><div className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded font-bold">{o.status}</div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Payment overlay */}
      {paying && (
        <div className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center" data-testid="payment-overlay">
          <div className="bg-white rounded-2xl p-6 max-w-sm text-center">
            <div className="w-12 h-12 mx-auto border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
            <div className="font-bold mt-3">Processing your payment securely...</div>
            <div className="text-xs text-slate-500 mt-1">Orbit Proxy → SSL Commerz → bKash</div>
            <div className="mt-3 h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-orange-600 animate-pulse" style={{ width: "80%" }}></div></div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 mt-12 p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div><div className="font-bold text-white mb-2">🛒 RobiMart BD</div><div className="text-xs">Bangladesh's #1 online marketplace</div></div>
          <div><div className="font-bold text-white mb-2">Shop</div><div className="text-xs space-y-1"><div>Electronics</div><div>Fashion</div><div>Home</div></div></div>
          <div><div className="font-bold text-white mb-2">Help</div><div className="text-xs space-y-1"><div>Returns</div><div>Shipping</div><div>FAQ</div></div></div>
          <div><div className="font-bold text-white mb-2">Payment</div><div className="text-xs flex gap-1 flex-wrap"><span className="bg-pink-600 px-2 py-1 rounded text-white">bKash</span><span className="bg-orange-500 px-2 py-1 rounded text-white">Nagad</span><span className="bg-blue-700 px-2 py-1 rounded text-white">VISA</span></div></div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 mt-6 border-t border-slate-700 text-xs text-center">© 2026 RobiMart BD. Powered by Orbit.</div>
      </footer>
    </div>
  );
};

const Row = ({ label, v, green }) => <div className="flex justify-between text-sm"><span className="text-slate-600">{label}</span><span className={`font-bold ${green ? "text-emerald-600" : ""}`}>{v}</span></div>;

const ProductCard = ({ p, onClick, onAdd }) => (
  <div data-testid={`product-${p.id}`} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
    <button onClick={onClick} className={`block w-full h-36 bg-gradient-to-br ${p.grad} flex items-center justify-center text-6xl relative`}>
      <span className="select-none">{p.emoji}</span>
      {p.sale && <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">SALE</span>}
    </button>
    <div className="p-3">
      <div className="text-xs text-slate-500">{p.brand}</div>
      <button onClick={onClick} className="font-bold text-sm line-clamp-1 text-left">{p.name}</button>
      <div className="flex items-center gap-1 mt-1 text-xs"><Star size={10} className="fill-amber-400 text-amber-400" /><span className="font-bold">{p.rating}</span><span className="text-slate-400">({p.reviews})</span></div>
      <div className="flex items-center justify-between mt-2">
        <div>
          {p.sale ? <><span className="text-rose-600 font-bold">৳{p.sale}</span> <span className="line-through text-[10px] text-slate-400">৳{p.price}</span></> : <span className="font-bold">৳{p.price}</span>}
        </div>
        <button data-testid={`add-${p.id}`} onClick={(e) => { e.stopPropagation(); onAdd(); }} className="bg-orange-600 hover:bg-orange-700 text-white p-1.5 rounded-md"><Plus size={14} /></button>
      </div>
    </div>
  </div>
);

const ProductDetail = ({ p, onAdd, onBuy, onBack }) => {
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(p.colors?.[0]);
  return (
    <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="product-detail">
      <div className="space-y-2">
        <div className={`h-80 bg-gradient-to-br ${p.grad} rounded-2xl flex items-center justify-center text-9xl`}>{p.emoji}</div>
        <div className="grid grid-cols-4 gap-2">{[0,1,2,3].map((i) => <div key={i} className={`h-20 bg-gradient-to-br ${p.grad} opacity-${60 + i * 10} rounded-lg flex items-center justify-center text-3xl border-2 ${i === 0 ? "border-orange-500" : "border-transparent"}`}>{p.emoji}</div>)}</div>
      </div>
      <div className="space-y-3">
        <button onClick={onBack} className="text-xs text-slate-500 flex items-center gap-1"><ChevronLeft size={12} /> Back to catalog</button>
        <div className="text-xs text-slate-500">{p.brand} · SKU: {p.id.toUpperCase()}</div>
        <h1 className="text-2xl font-bold">{p.name}</h1>
        <div className="flex items-center gap-2 text-sm"><div className="flex items-center gap-0.5 text-amber-500">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={i < Math.round(p.rating) ? "currentColor" : "none"} />)}</div><span className="font-bold">{p.rating}</span><span className="text-slate-500">({p.reviews} reviews)</span></div>
        {p.sale ? (
          <div><span className="text-3xl font-bold text-rose-600">৳{p.sale.toLocaleString()}</span> <span className="line-through text-sm text-slate-400 ml-2">৳{p.price.toLocaleString()}</span><span className="ml-2 bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs font-bold">SAVE ৳{(p.price - p.sale).toLocaleString()}</span></div>
        ) : <div className="text-3xl font-bold">৳{p.price.toLocaleString()}</div>}
        <div className="text-xs text-emerald-700 font-bold">In Stock ✓ ({p.stock} units left)</div>
        {p.colors && (
          <div><div className="text-xs font-bold mb-1">Color</div><div className="flex gap-2">{p.colors.map((c) => <button key={c} onClick={() => setColor(c)} className={`w-7 h-7 rounded-full border-2 ${color === c ? "ring-2 ring-orange-500 ring-offset-1" : "border-slate-200"}`} style={{ background: c }} />)}</div></div>
        )}
        <div className="flex items-center gap-2"><div className="text-xs font-bold">Qty:</div><div className="flex items-center gap-2"><button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 border rounded">−</button><span className="w-6 text-center">{qty}</span><button onClick={() => setQty(qty + 1)} className="w-8 h-8 border rounded">+</button></div></div>
        <div className="grid grid-cols-2 gap-2">
          <button data-testid="add-to-cart" onClick={onAdd} className="bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-bold">Add to Cart</button>
          <button data-testid="buy-now" onClick={onBuy} className="bg-slate-900 text-white py-3 rounded-lg font-bold">Buy Now</button>
        </div>
        <div className="text-xs text-slate-500 border-t border-slate-200 pt-3"><Truck size={12} className="inline mr-1" /> Delivered by <b>{new Date(Date.now() + 3 * 86400000).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</b>, Dhaka</div>
        <div className="bg-white border border-slate-200 rounded-xl p-3">
          <div className="font-bold text-sm mb-1">About this product</div>
          <p className="text-sm text-slate-600">{p.desc}</p>
        </div>
      </div>
    </main>
  );
};

export default RobiMart;
