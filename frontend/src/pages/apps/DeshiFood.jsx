import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Home, Search, ClipboardList, User, Bell, MapPin, Plus, Minus, X, Phone, MessageCircle, Star } from "lucide-react";

const RESTAURANTS = [
  { id: "r1", name: "Kacchi Bhai", cuisine: "Biryani", area: "Gulshan", rating: 4.9, time: 30, fee: 60, emoji: "🍛", grad: "from-amber-600 to-red-700", badge: "FAST DELIVERY 🚀" },
  { id: "r2", name: "Pizza Hut BD", cuisine: "Pizza", area: "Banani", rating: 4.7, time: 25, fee: 0, emoji: "🍕", grad: "from-red-500 to-orange-600", badge: "FREE DELIVERY" },
  { id: "r3", name: "Haji Biriyani", cuisine: "Biryani", area: "Old Dhaka", rating: 4.8, time: 45, fee: 80, emoji: "🍛", grad: "from-orange-500 to-yellow-600" },
  { id: "r4", name: "Deshi Spice", cuisine: "Mixed", area: "Dhanmondi", rating: 4.6, time: 35, fee: 60, emoji: "🌶", grad: "from-red-700 to-rose-800" },
  { id: "r5", name: "Burger King BD", cuisine: "Burger", area: "Uttara", rating: 4.5, time: 40, fee: 0, emoji: "🍔", grad: "from-amber-500 to-orange-700", badge: "FREE DELIVERY" },
  { id: "r6", name: "Sushi Garden", cuisine: "Japanese", area: "Gulshan", rating: 4.3, time: 50, fee: 100, emoji: "🍣", grad: "from-pink-400 to-rose-600" },
];

const MENU = {
  r1: [
    { id: "i1", name: "Chicken Kacchi", desc: "Aromatic basmati with chicken", price: 320, emoji: "🍛" },
    { id: "i2", name: "Beef Kacchi", desc: "Slow-cooked beef biryani", price: 380, emoji: "🍛" },
    { id: "i3", name: "Mutton Kacchi", desc: "Premium mutton, full plate", price: 450, emoji: "🍛" },
    { id: "i4", name: "Borhani", desc: "Spiced yogurt drink", price: 80, emoji: "🥛" },
    { id: "i5", name: "Firni", desc: "Traditional rice pudding", price: 120, emoji: "🍮" },
  ],
};

const DeshiFood = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState("login"); // login | otp | home | restaurant | cart | tracking
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedR, setSelectedR] = useState(null);
  const [cart, setCart] = useState([]); // {id,name,price,qty,emoji}
  const [tab, setTab] = useState("home");
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [payMethod, setPayMethod] = useState("bkash");
  const [trackStage, setTrackStage] = useState(1);
  const [orderId, setOrderId] = useState("");
  const [rated, setRated] = useState(0);

  useEffect(() => {
    if (screen !== "tracking") return;
    const t = setInterval(() => setTrackStage((s) => Math.min(4, s + 1)), 3000);
    return () => clearInterval(t);
  }, [screen]);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const itemTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const deliveryFee = selectedR?.fee || 0;
  const platformFee = Math.round(itemTotal * 0.025);
  const total = itemTotal + deliveryFee + platformFee - discount;

  const addItem = (it) => {
    setCart((c) => {
      const ex = c.find((x) => x.id === it.id);
      if (ex) return c.map((x) => x.id === it.id ? { ...x, qty: x.qty + 1 } : x);
      return [...c, { ...it, qty: 1 }];
    });
  };
  const updateQty = (id, d) => setCart((c) => c.map((x) => x.id === id ? { ...x, qty: Math.max(0, x.qty + d) } : x).filter((x) => x.qty > 0));
  const applyPromo = () => { if (promo.toUpperCase() === "FIRSTORDER") setDiscount(50); else alert("Invalid code"); };
  const placeOrder = () => {
    setOrderId(`DF-${String(847 + Math.floor(Math.random() * 100)).padStart(5, "0")}`);
    setTrackStage(1);
    setScreen("tracking");
    setCart([]);
  };

  const menu = selectedR ? (MENU[selectedR.id] || MENU.r1) : [];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-2 sm:p-4" data-testid="deshifood-app" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <button onClick={() => navigate("/my-apps")} data-testid="back-from-deshifood" className="absolute top-3 left-3 text-xs text-white/60 hover:text-white flex items-center gap-1 z-10"><ChevronLeft size={14} /> Back to Orbit</button>

      {/* Phone frame */}
      <div className="relative bg-slate-950 rounded-[3rem] p-3 border-4 border-slate-800 shadow-2xl" style={{ width: "min(390px, 100vw)" }}>
        <div className="bg-white rounded-[2.5rem] overflow-hidden relative" style={{ height: "780px" }}>
          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 h-7 bg-white flex items-center justify-between px-6 text-[10px] font-bold z-30">
            <span>9:41</span>
            <span className="flex items-center gap-1">📶 📶 🔋 98%</span>
          </div>
          {/* Notch */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-950 rounded-full z-40"></div>

          <div className="absolute inset-0 pt-7 pb-16 overflow-y-auto">
            {/* LOGIN */}
            {screen === "login" && (
              <div className="p-6 h-full flex flex-col justify-center bg-gradient-to-br from-red-600 to-rose-800 text-white" data-testid="login-screen">
                <div className="text-center">
                  <div className="text-7xl">🍽</div>
                  <div className="text-3xl font-bold mt-2">DeshiFood</div>
                  <div className="text-sm opacity-90">Authentic Bangladeshi food, delivered</div>
                </div>
                <div className="mt-8 space-y-3">
                  <div>
                    <label className="text-xs opacity-80">Phone Number</label>
                    <input data-testid="phone-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01X XXXX XXXX" className="w-full mt-1 bg-white/10 border border-white/30 rounded-lg px-3 py-2.5 text-white placeholder-white/50 focus:outline-none" />
                  </div>
                  <button data-testid="send-otp" onClick={() => setScreen("otp")} className="w-full bg-white text-red-700 py-3 rounded-lg font-bold">Send OTP</button>
                </div>
                <div className="mt-auto text-center text-[10px] opacity-70">Powered by Orbit · Secure OTP via Robi</div>
              </div>
            )}

            {screen === "otp" && (
              <div className="p-6 h-full flex flex-col justify-center bg-gradient-to-br from-red-600 to-rose-800 text-white" data-testid="otp-screen">
                <div className="text-center">
                  <div className="text-5xl">🔐</div>
                  <div className="text-2xl font-bold mt-2">Verify OTP</div>
                  <div className="text-sm opacity-90 mt-1">Code sent to {phone || "your number"}</div>
                </div>
                <div className="mt-8 grid grid-cols-6 gap-1.5">
                  {[0,1,2,3,4,5].map((i) => <div key={i} className="aspect-square bg-white/20 border-2 border-white/30 rounded-lg flex items-center justify-center font-bold text-xl">{otp[i] || ""}</div>)}
                </div>
                <input data-testid="otp-input" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} className="opacity-0 absolute" autoFocus />
                <button data-testid="verify-otp" onClick={() => setScreen("home")} className="mt-6 w-full bg-white text-red-700 py-3 rounded-lg font-bold">Verify & Continue</button>
                <button onClick={() => setOtp("123456")} className="text-xs text-white/70 mt-2 underline">Tap to auto-fill</button>
              </div>
            )}

            {/* HOME */}
            {screen === "home" && tab === "home" && (
              <div data-testid="home-screen">
                <div className="bg-red-600 text-white p-4 sticky top-7 z-20">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1"><MapPin size={12} /> Gulshan, Dhaka ▾</div>
                    <Bell size={16} />
                  </div>
                  <div className="mt-3 bg-white text-slate-500 rounded-full flex items-center gap-2 px-3 py-2 text-sm"><Search size={14} /> What are you craving?</div>
                </div>
                <div className="p-3">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {[{e:"🍔",l:"Burger"},{e:"🍕",l:"Pizza"},{e:"🍛",l:"Biryani"},{e:"🐟",l:"Fish"},{e:"🥗",l:"Salad"},{e:"☕",l:"Drinks"}].map((c) => (
                      <button key={c.l} className="flex flex-col items-center bg-slate-100 rounded-lg p-2 min-w-[64px]"><span className="text-2xl">{c.e}</span><span className="text-[10px] mt-1">{c.l}</span></button>
                    ))}
                  </div>
                  <div className="bg-gradient-to-r from-rose-100 to-orange-100 rounded-xl p-3 mt-3">
                    <div className="text-xs font-bold text-red-700">🔥 Flash Deals — 30% OFF</div>
                    <div className="text-[10px] text-red-700/70">Ends in 2h 14m</div>
                  </div>
                  <div className="mt-4">
                    <div className="font-bold text-sm mb-2">Restaurants Near You</div>
                    <div className="space-y-2">
                      {RESTAURANTS.map((r) => (
                        <button key={r.id} data-testid={`restaurant-${r.id}`} onClick={() => { setSelectedR(r); setScreen("restaurant"); }} className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow text-left">
                          <div className={`h-20 bg-gradient-to-br ${r.grad} flex items-center justify-center text-5xl relative`}>{r.emoji}
                            {r.badge && <span className="absolute top-1 right-1 bg-white/90 text-red-700 text-[8px] font-bold px-1.5 py-0.5 rounded">{r.badge}</span>}
                          </div>
                          <div className="p-2">
                            <div className="font-bold text-sm">{r.name}</div>
                            <div className="text-[10px] text-slate-500">{r.cuisine} · {r.area}</div>
                            <div className="flex items-center gap-2 mt-1 text-[10px]">
                              <span className="flex items-center gap-0.5"><Star size={9} className="fill-amber-400 text-amber-400" /> {r.rating}</span>
                              <span>· {r.time} min</span>
                              <span>· {r.fee === 0 ? "Free delivery" : `৳${r.fee} delivery`}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {screen === "home" && tab === "orders" && (
              <div className="p-3" data-testid="orders-tab">
                <div className="font-bold text-lg">My Orders</div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 mt-3 text-sm">
                  <div className="font-bold">DF-00847 · Kacchi Bhai</div>
                  <div className="text-[11px] text-slate-500">Yesterday · ৳666</div>
                  <span className="inline-block bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded mt-1">Delivered</span>
                </div>
              </div>
            )}

            {screen === "home" && tab === "profile" && (
              <div className="p-4" data-testid="profile-tab">
                <div className="w-16 h-16 bg-red-600 text-white rounded-full mx-auto flex items-center justify-center text-2xl font-bold">R</div>
                <div className="text-center font-bold mt-2">Rafiul Karim</div>
                <div className="text-center text-xs text-slate-500">{phone || "+880 1700-123456"}</div>
                <div className="bg-white border border-slate-200 rounded-xl mt-4 divide-y divide-slate-100">
                  {["Saved Addresses","Payment Methods","Favorites","Help & Support","Logout"].map((s) => <div key={s} className="px-3 py-2.5 text-sm">{s}</div>)}
                </div>
              </div>
            )}

            {/* RESTAURANT */}
            {screen === "restaurant" && selectedR && (
              <div data-testid="restaurant-screen">
                <div className={`h-32 bg-gradient-to-br ${selectedR.grad} flex flex-col items-center justify-center text-white relative`}>
                  <button onClick={() => setScreen("home")} className="absolute top-2 left-2 bg-black/30 rounded-full p-1.5"><ChevronLeft size={16} /></button>
                  <div className="text-5xl">{selectedR.emoji}</div>
                  <div className="text-xl font-bold">{selectedR.name}</div>
                  <div className="text-[10px] opacity-90">⭐ {selectedR.rating} · {selectedR.time}-{selectedR.time + 10} min · {selectedR.cuisine}</div>
                </div>
                <div className="flex gap-2 px-3 py-2 overflow-x-auto bg-white border-b border-slate-200">
                  {["All","Biryani","Sides","Drinks","Desserts"].map((c, i) => <button key={c} className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${i === 0 ? "bg-red-600 text-white" : "bg-slate-100 text-slate-700"}`}>{c}</button>)}
                </div>
                <div className="p-3 space-y-2">
                  {menu.map((it) => {
                    const inCart = cart.find((c) => c.id === it.id);
                    return (
                      <div key={it.id} data-testid={`menu-item-${it.id}`} className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center gap-3">
                        <div className="text-3xl">{it.emoji}</div>
                        <div className="flex-1 min-w-0"><div className="font-bold text-sm">{it.name}</div><div className="text-[11px] text-slate-500 line-clamp-1">{it.desc}</div><div className="text-red-600 font-bold text-sm">৳{it.price}</div></div>
                        {inCart ? (
                          <div className="flex items-center gap-1 bg-red-600 text-white rounded-full px-1.5 py-0.5">
                            <button onClick={() => updateQty(it.id, -1)} className="p-1"><Minus size={12} /></button>
                            <span className="font-bold text-xs w-4 text-center">{inCart.qty}</span>
                            <button onClick={() => updateQty(it.id, 1)} className="p-1"><Plus size={12} /></button>
                          </div>
                        ) : (
                          <button data-testid={`add-${it.id}`} onClick={() => addItem(it)} className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold"><Plus size={16} /></button>
                        )}
                      </div>
                    );
                  })}
                </div>
                {cartCount > 0 && (
                  <button data-testid="view-cart-bar" onClick={() => setScreen("cart")} className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-red-600 text-white rounded-full shadow-lg px-5 py-2.5 text-sm font-bold flex items-center gap-3 z-30" style={{ width: "min(330px, 90vw)" }}>
                    <span>View Cart — {cartCount} items</span><span className="ml-auto">৳{itemTotal} →</span>
                  </button>
                )}
              </div>
            )}

            {/* CART */}
            {screen === "cart" && (
              <div className="p-3 space-y-2" data-testid="cart-screen">
                <button onClick={() => setScreen("restaurant")} className="text-xs flex items-center gap-1 text-slate-600"><ChevronLeft size={12} /> Back</button>
                <div className="flex justify-between"><div className="font-bold text-lg">My Cart ({cartCount} items)</div><button onClick={() => setCart([])} className="text-xs text-rose-600">Clear</button></div>
                <div className="bg-slate-100 px-2 py-1 rounded text-xs">📍 {selectedR?.name}</div>
                {cart.map((c) => (
                  <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-2 flex items-center gap-2 text-sm">
                    <span className="text-2xl">{c.emoji}</span>
                    <div className="flex-1"><div className="font-bold text-xs">{c.name}</div><div className="text-red-600 text-xs">৳{c.price * c.qty}</div></div>
                    <div className="flex items-center gap-1"><button onClick={() => updateQty(c.id, -1)} className="w-6 h-6 border rounded"><Minus size={10} className="mx-auto" /></button><span className="text-xs w-5 text-center">{c.qty}</span><button onClick={() => updateQty(c.id, 1)} className="w-6 h-6 border rounded"><Plus size={10} className="mx-auto" /></button></div>
                  </div>
                ))}
                <div className="flex gap-1.5">
                  <input data-testid="promo-input" value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Promo code" className="flex-1 border border-slate-200 rounded text-xs h-7 px-2" />
                  <button onClick={applyPromo} data-testid="apply-promo" className="bg-slate-900 text-white px-3 rounded text-xs font-bold">Apply</button>
                </div>
                {discount > 0 && <div className="text-xs text-emerald-700 bg-emerald-50 p-1.5 rounded">✓ -৳{discount} applied</div>}
                <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs space-y-0.5">
                  <div className="flex justify-between"><span>Item Total</span><b>৳{itemTotal}</b></div>
                  <div className="flex justify-between"><span>Delivery</span><b>৳{deliveryFee}</b></div>
                  {discount > 0 && <div className="flex justify-between text-emerald-700"><span>Discount</span><b>-৳{discount}</b></div>}
                  <div className="flex justify-between"><span>Platform fee</span><b>৳{platformFee}</b></div>
                  <div className="flex justify-between font-bold text-sm pt-1 border-t mt-1"><span>Total</span><span>৳{total}</span></div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs">📍 123, Gulshan-1, Dhaka <span className="text-red-600 ml-auto float-right">Change</span></div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[{id:"bkash",l:"bKash",e:"💗"},{id:"nagad",l:"Nagad",e:"🟠"},{id:"cod",l:"COD",e:"💵"}].map((p) => (
                    <button key={p.id} data-testid={`pay-${p.id}`} onClick={() => setPayMethod(p.id)} className={`p-2 rounded-lg border-2 ${payMethod === p.id ? "border-red-500 bg-red-50" : "border-slate-200"}`}>
                      <div className="text-2xl">{p.e}</div><div className="text-[10px] font-bold">{p.l}</div>
                    </button>
                  ))}
                </div>
                <button data-testid="place-order" onClick={placeOrder} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold">Place Order — ৳{total}</button>
              </div>
            )}

            {/* TRACKING */}
            {screen === "tracking" && (
              <div className="p-3 space-y-3" data-testid="tracking-screen">
                <div className="text-center">
                  <div className="text-3xl">🎉</div>
                  <div className="font-bold text-emerald-700">Order Confirmed!</div>
                  <div className="text-xs font-mono mt-1">#{orderId}</div>
                  <div className="text-xs text-slate-500">{selectedR?.name} · ETA {selectedR?.time + 5} min</div>
                </div>
                {/* Map */}
                <div className="h-32 bg-slate-200 rounded-xl relative overflow-hidden" data-testid="track-map">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 130" preserveAspectRatio="none">
                    <path d="M40 90 Q 100 30 150 70 T 260 50" stroke="#94a3b8" strokeWidth="3" strokeDasharray="6 4" fill="none" />
                  </svg>
                  <div className="absolute left-3 bottom-3 text-2xl">🏠</div>
                  <div className="absolute right-3 top-3 text-2xl">🔴</div>
                  <div className="absolute text-3xl bike-anim">🛵</div>
                  <style>{`.bike-anim{animation:bike 12s linear infinite;}@keyframes bike{0%{left:80%;top:14%;}50%{left:50%;top:50%;}100%{left:8%;top:65%;}}`}</style>
                </div>
                {/* Stages */}
                <div className="space-y-2">
                  {["Order Confirmed","Preparing Your Food","On The Way","Delivered"].map((s, i) => {
                    const idx = i + 1;
                    return (
                      <div key={s} className="flex items-center gap-3 text-sm">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${idx < trackStage ? "bg-emerald-500 text-white" : idx === trackStage ? "bg-red-600 text-white animate-pulse" : "bg-slate-200 text-slate-500"}`}>
                          {idx < trackStage ? "✓" : idx}
                        </div>
                        <span className={idx <= trackStage ? "font-bold" : "text-slate-500"}>{s}{idx === trackStage && " ..."}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                  <div className="text-3xl">🛵</div>
                  <div className="flex-1"><div className="font-bold text-sm">Karim (Rider)</div><div className="text-[10px] text-slate-500">⭐ 4.9</div></div>
                  <button className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center"><Phone size={14} /></button>
                  <button className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center"><MessageCircle size={14} /></button>
                </div>
                {trackStage === 4 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center" data-testid="rate-card">
                    <div className="font-bold text-sm">Rate your order</div>
                    <div className="flex justify-center gap-1 mt-2">
                      {[1,2,3,4,5].map((s) => <button key={s} onClick={() => setRated(s)}><Star size={28} className={s <= rated ? "fill-amber-400 text-amber-400" : "text-slate-300"} /></button>)}
                    </div>
                    {rated > 0 && <button onClick={() => { setScreen("home"); setTab("home"); }} className="mt-2 bg-amber-500 text-white px-4 py-1.5 rounded font-bold text-xs">Submit Rating</button>}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Nav */}
          {(screen === "home" || screen === "restaurant" || screen === "cart" || screen === "tracking") && (
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200 grid grid-cols-4 z-30">
              {[{id:"home",icon:Home,label:"Home"},{id:"search",icon:Search,label:"Search"},{id:"orders",icon:ClipboardList,label:"Orders"},{id:"profile",icon:User,label:"Profile"}].map((n) => (
                <button key={n.id} data-testid={`nav-${n.id}`} onClick={() => { setScreen("home"); setTab(n.id); }} className={`flex flex-col items-center justify-center text-[10px] ${tab === n.id ? "text-red-600 font-bold" : "text-slate-500"}`}>
                  <n.icon size={18} /> {n.label}
                </button>
              ))}
            </div>
          )}

          {/* Home indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-900 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default DeshiFood;
