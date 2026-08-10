import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft, Play, Pause, Lock, Flame, Footprints, Droplet, Timer } from "lucide-react";
import APIMonitor from "../../components/APIMonitor";
import { requestOTP, verifyOTP, userSubscription, sendSMS, queryBalance, directDebit } from "../../services/OrbitAPI";

const PLANS = [
  { id: "beginner", name: "Beginner Full Body", duration: "4 weeks · 3x/week", exercises: 5, time: 30, free: true, exerciseList: [
    { name: "Push-ups", reps: "3 × 12", icon: "💪" },
    { name: "Squats", reps: "3 × 15", icon: "🦵" },
    { name: "Lunges", reps: "3 × 10/leg", icon: "🚶" },
    { name: "Plank", reps: "3 × 30s", icon: "🧘" },
    { name: "Jumping Jacks", reps: "3 × 20", icon: "🤸" },
  ] },
  { id: "hiit", name: "Intermediate HIIT", duration: "6 weeks · 4x/week", exercises: 8, time: 45, price: 29 },
  { id: "advanced", name: "Advanced Strength", duration: "8 weeks · 5x/week", exercises: 10, time: 60, price: 49 },
];

const FOODS = [
  { name: "Khichuri (1 bowl)", kcal: 340, p: 12, c: 58, f: 8 },
  { name: "Rice (1 cup)", kcal: 210, p: 4, c: 44, f: 0.5 },
  { name: "Dal (1 bowl)", kcal: 180, p: 9, c: 30, f: 3 },
  { name: "Chicken Curry (1 pc)", kcal: 280, p: 28, c: 5, f: 16 },
  { name: "Fish Fry (1 pc)", kcal: 160, p: 18, c: 8, f: 6 },
  { name: "Roti (1 pc)", kcal: 80, p: 3, c: 16, f: 1 },
  { name: "Egg (boiled)", kcal: 78, p: 6, c: 0.6, f: 5 },
  { name: "Banana (1)", kcal: 89, p: 1.1, c: 23, f: 0.3 },
  { name: "Mango (1 cup)", kcal: 100, p: 1.4, c: 25, f: 0.6 },
  { name: "Dahi/Yogurt (1 cup)", kcal: 150, p: 8, c: 12, f: 8 },
];

const FitBD = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState("splash"); // splash, login, home, workout, active, complete, nutrition, progress
  const [phone, setPhone] = useState("");
  const [otpRef, setOtpRef] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [subscriberId, setSubscriberId] = useState("");
  const [busy, setBusy] = useState(false);
  const [unlocked, setUnlocked] = useState(["beginner"]);
  const [activePlan, setActivePlan] = useState(null);
  const [exIdx, setExIdx] = useState(0);
  const [setNum, setSetNum] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [resting, setResting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [meals, setMeals] = useState({ Breakfast: [], Lunch: [], Dinner: [], Snacks: [] });
  const [foodSearch, setFoodSearch] = useState("");
  const [activeMeal, setActiveMeal] = useState("Breakfast");
  const [water, setWater] = useState(6);
  const restRef = useRef(null);
  const [showSubModal, setShowSubModal] = useState(null);
  const [balance, setBalance] = useState(null);

  // Splash auto-advance
  useEffect(() => {
    if (page === "splash") {
      const t = setTimeout(() => setPage("login"), 1800);
      return () => clearTimeout(t);
    }
  }, [page]);

  // Rest timer
  useEffect(() => {
    if (resting && restTime > 0 && !paused) {
      restRef.current = setTimeout(() => setRestTime((t) => t - 1), 1000);
      return () => clearTimeout(restRef.current);
    } else if (resting && restTime === 0) {
      setResting(false);
    }
  }, [resting, restTime, paused]);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) return toast.error("Enter mobile number");
    setBusy(true);
    const r = await requestOTP(phone);
    setBusy(false);
    if (r.statusCode === "S1000") { setOtpRef(r.referenceNo); setDemoOtp(r._demo_otp); setOtpSent(true); toast.success("OTP sent"); }
  };
  const handleVerify = async () => {
    if (otpInput.length !== 6) return toast.error("6-digit OTP");
    setBusy(true);
    const v = await verifyOTP(otpRef, otpInput);
    if (v.statusCode !== "S1000") { setBusy(false); return toast.error(v.statusDetail); }
    setSubscriberId(v.subscriberId);
    await userSubscription(v.subscriberId, "SUB");
    await sendSMS([`tel:88${phone}`], "Welcome to FitBD! Your fitness journey begins today. Daily tips at 7AM. Stay strong! 💪", "16222");
    setBusy(false);
    setPage("home");
    toast.success("Welcome to FitBD! 💪");
  };

  const startPlan = (planId) => {
    if (!unlocked.includes(planId)) {
      setShowSubModal(planId);
      return;
    }
    setActivePlan(PLANS.find((p) => p.id === planId));
    setExIdx(0);
    setSetNum(0);
    setPage("active");
  };

  const nextSet = () => {
    const plan = activePlan;
    if (!plan) return;
    const ex = plan.exerciseList[exIdx];
    const totalSets = 3;
    if (setNum + 1 < totalSets) {
      setSetNum((s) => s + 1);
      setRestTime(45);
      setResting(true);
      return;
    }
    // Next exercise
    if (exIdx + 1 < plan.exerciseList.length) {
      setExIdx((i) => i + 1);
      setSetNum(0);
      setRestTime(60);
      setResting(true);
    } else {
      finishWorkout();
    }
  };

  const finishWorkout = async () => {
    await sendSMS([`tel:88${phone || "1711234567"}`], `FitBD: Great workout! You burned ~180 kcal in 28 minutes. Keep it up! 💪 Streak: 7 days 🔥`, "16222");
    setPage("complete");
  };

  const unlockPremium = async (planId) => {
    const plan = PLANS.find((p) => p.id === planId);
    setBusy(true);
    const bal = await queryBalance(subscriberId || "tel:masked_711234");
    setBalance(bal.accountInfo.availableBalance);
    const dd = await directDebit(subscriberId || "tel:masked_711234", plan.price, `FitBD ${plan.name}`);
    if (dd.statusCode !== "S1000") { setBusy(false); return toast.error(dd.statusDetail); }
    await sendSMS([`tel:88${phone || "1711234567"}`], `FitBD Premium activated! Your ${plan.name} plan is ready. BDT ${plan.price} deducted from Robi. 💪`, "16222");
    setBusy(false);
    setUnlocked((p) => [...p, planId]);
    setShowSubModal(null);
    toast.success(`✅ ${plan.name} unlocked!`);
  };

  const addFood = (food) => {
    setMeals((p) => ({ ...p, [activeMeal]: [...p[activeMeal], food] }));
    toast.success(`${food.name} added to ${activeMeal}`);
  };

  const totalKcal = Object.values(meals).flat().reduce((sum, f) => sum + f.kcal, 0);

  // Phone frame container
  const Frame = ({ children, color = "from-lime-500 to-emerald-700" }) => (
    <div className="mx-auto bg-slate-950 rounded-[2.5rem] p-2 border-4 border-slate-800 shadow-2xl" style={{ width: 360, height: 720, maxHeight: "calc(100vh - 100px)" }}>
      <div className="w-full h-full rounded-[2rem] overflow-hidden bg-white relative flex flex-col">
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-slate-950 rounded-full z-20"></div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-300 rounded-full z-20"></div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8" data-testid="fitbd-app">
      <div className="max-w-md mx-auto mb-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-xs text-slate-600 flex items-center gap-1"><ChevronLeft size={14} /> Back to Orbit</button>
        <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-700">📱 Android Emulator</span>
      </div>

      <Frame>
        {page === "splash" && (
          <div className="absolute inset-0 bg-gradient-to-br from-lime-500 via-emerald-600 to-emerald-800 text-white flex flex-col items-center justify-center" data-testid="fitbd-splash">
            <div className="text-7xl mb-3 animate-pulse">💪</div>
            <h1 className="text-4xl font-black tracking-tight">FitBD</h1>
            <p className="text-sm opacity-90 mt-2">Your Personal Fitness Companion</p>
            <div className="absolute bottom-12 text-[10px] opacity-60">v1.0.0 · Powered by Orbit</div>
          </div>
        )}

        {page === "login" && (
          <div className="flex-1 bg-gradient-to-br from-lime-400 to-emerald-600 p-6 flex flex-col justify-end">
            <div className="bg-white rounded-2xl p-5 shadow-2xl">
              <div className="text-3xl mb-2">💪</div>
              <h2 className="font-bold text-xl">Welcome to FitBD</h2>
              <p className="text-xs text-slate-500 mt-1">Sign in with your Robi number</p>
              {!otpSent ? (
                <>
                  <input data-testid="fitbd-phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="1711234567" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-3 text-sm" maxLength={11} />
                  <button onClick={handleSendOtp} disabled={busy} data-testid="fitbd-send-otp" className="w-full mt-3 bg-gradient-to-r from-lime-500 to-emerald-600 text-white rounded-lg py-2.5 font-bold disabled:opacity-50">{busy ? "Sending..." : "Send OTP"}</button>
                </>
              ) : (
                <>
                  <input data-testid="fitbd-otp" value={otpInput} onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))} placeholder="6-digit OTP" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-3 text-center font-mono tracking-widest" maxLength={6} />
                  <p className="text-[10px] mt-1">Demo: <button className="text-emerald-700 font-mono underline" onClick={() => setOtpInput(demoOtp)}>{demoOtp}</button></p>
                  <button onClick={handleVerify} disabled={busy} data-testid="fitbd-verify" className="w-full mt-2 bg-gradient-to-r from-lime-500 to-emerald-600 text-white rounded-lg py-2.5 font-bold disabled:opacity-50">{busy ? "..." : "Verify & Continue"}</button>
                </>
              )}
            </div>
          </div>
        )}

        {page === "home" && (
          <div className="flex-1 overflow-y-auto pb-16">
            <div className="bg-gradient-to-br from-lime-500 to-emerald-700 text-white px-5 pt-8 pb-5">
              <div className="text-xs opacity-80">Good morning</div>
              <div className="font-bold text-2xl">Rafiul Karim 💪</div>
              <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                <Stat icon={<Flame size={16} />} val="890" label="kcal" />
                <Stat icon={<Footprints size={16} />} val="7,432" label="steps" />
                <Stat icon={<Droplet size={16} />} val={water} label="glasses" />
                <Stat icon={<Timer size={16} />} val="42m" label="active" />
              </div>
            </div>
            <div className="p-4 space-y-4">
              <button onClick={() => setPage("workout")} data-testid="fitbd-start-workout" className="w-full bg-white border-2 border-emerald-200 rounded-2xl p-4 text-left hover:shadow-md transition-shadow">
                <div className="text-xs text-emerald-600 font-bold">TODAY'S WORKOUT</div>
                <div className="font-bold text-lg mt-1">Beginner Full Body · Day 3</div>
                <div className="text-xs text-slate-500 mt-1">Next: Push-ups × 3 sets</div>
                <div className="mt-3 bg-gradient-to-r from-lime-500 to-emerald-600 text-white rounded-lg py-2 text-center font-bold text-sm">Start Workout</div>
              </button>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs">
                <div className="font-bold mb-1">💡 Daily Health Tip</div>
                <p className="text-slate-700">Drink 8 glasses of water daily to boost metabolism and improve skin.</p>
              </div>
              <button onClick={() => setPage("nutrition")} data-testid="fitbd-nutrition" className="w-full bg-white rounded-2xl p-3 text-left border border-slate-200">
                <div className="font-bold text-sm">🥗 Nutrition Log</div>
                <div className="text-xs text-slate-500">{totalKcal} / 2,000 kcal today</div>
              </button>
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4">
                <div className="text-xs uppercase tracking-wider opacity-80">Premium</div>
                <div className="font-bold mt-1">Unlock HIIT & Advanced plans</div>
                <div className="text-xs opacity-80 mt-0.5">From BDT 29/month via Robi Balance</div>
                <button onClick={() => setPage("workout")} className="mt-2 bg-white text-amber-700 rounded-full px-3 py-1 text-xs font-bold">View Plans →</button>
              </div>
            </div>
          </div>
        )}

        {page === "workout" && (
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setPage("home")} className="text-xs flex items-center gap-1 text-slate-600"><ChevronLeft size={12} /> Home</button>
              <div className="font-bold">Workout Plans</div>
              <span></span>
            </div>
            {PLANS.map((p) => {
              const isLocked = !unlocked.includes(p.id);
              return (
                <div key={p.id} data-testid={`fitbd-plan-${p.id}`} className={`relative rounded-2xl border-2 ${p.id === "beginner" ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"} p-4`}>
                  <div className="flex items-start gap-2">
                    <div className="text-2xl">{p.id === "beginner" ? "🌱" : p.id === "hiit" ? "🔥" : "🏋️"}</div>
                    <div className="flex-1">
                      <div className="font-bold">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.duration}</div>
                      <div className="text-[11px] text-slate-600 mt-1">{p.exercises} exercises · {p.time} min</div>
                    </div>
                    {p.free && <span className="text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded font-bold">FREE</span>}
                  </div>
                  {isLocked && (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/95 to-orange-600/95 rounded-2xl flex flex-col items-center justify-center text-white p-3">
                      <Lock size={20} className="mb-1" />
                      <div className="font-bold">BDT {p.price}/month</div>
                      <div className="text-[10px] opacity-90">Via Robi Balance</div>
                      <button onClick={() => setShowSubModal(p.id)} data-testid={`fitbd-unlock-${p.id}`} className="mt-2 bg-white text-orange-600 rounded-full px-4 py-1 text-xs font-bold">Subscribe</button>
                    </div>
                  )}
                  {!isLocked && (
                    <button onClick={() => startPlan(p.id)} data-testid={`fitbd-start-${p.id}`} className="mt-3 w-full bg-gradient-to-r from-lime-500 to-emerald-600 text-white rounded-lg py-2 text-sm font-bold">Start Plan</button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {page === "active" && activePlan && (
          <div className="flex-1 bg-gradient-to-br from-emerald-700 to-slate-900 text-white p-5 flex flex-col">
            <button onClick={() => setPage("workout")} className="text-xs opacity-70 flex items-center gap-1 mb-3"><ChevronLeft size={12} /> Exit</button>
            <div className="text-xs opacity-80">Exercise {exIdx + 1} of {activePlan.exerciseList.length}</div>
            <div className="text-5xl mt-4 text-center">{activePlan.exerciseList[exIdx].icon}</div>
            <h2 className="font-bold text-2xl text-center mt-3">{activePlan.exerciseList[exIdx].name}</h2>
            <div className="text-center text-sm opacity-80 mt-1">{activePlan.exerciseList[exIdx].reps}</div>
            <div className="mt-6 flex justify-center gap-2">
              {[0, 1, 2].map((i) => <div key={i} className={`w-8 h-8 rounded-full border-2 ${i < setNum ? "bg-lime-400 border-lime-400" : "border-white/40"}`}></div>)}
            </div>
            {resting && (
              <div className="mt-6 text-center" data-testid="fitbd-resting">
                <div className="text-xs uppercase opacity-80">Rest</div>
                <div className="text-5xl font-bold tabular-nums">{restTime}s</div>
              </div>
            )}
            <div className="flex-1"></div>
            <button onClick={nextSet} data-testid="fitbd-next-set" disabled={resting} className="w-full bg-lime-500 text-emerald-900 rounded-full py-3 font-bold disabled:opacity-40">{resting ? "Resting..." : setNum + 1 < 3 ? `Complete Set ${setNum + 1}` : exIdx + 1 < activePlan.exerciseList.length ? "Next Exercise →" : "Finish Workout"}</button>
          </div>
        )}

        {page === "complete" && (
          <div className="flex-1 bg-gradient-to-br from-lime-400 via-emerald-500 to-emerald-700 text-white flex flex-col items-center justify-center p-6" data-testid="fitbd-complete">
            <div className="text-6xl mb-3 animate-bounce">🎉</div>
            <h1 className="text-3xl font-bold">Workout Complete!</h1>
            <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-xs">
              <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">28 min</div>
                <div className="text-[10px] uppercase">Duration</div>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">180 kcal</div>
                <div className="text-[10px] uppercase">Burned</div>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{activePlan?.exerciseList.length || 5}</div>
                <div className="text-[10px] uppercase">Exercises</div>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">15</div>
                <div className="text-[10px] uppercase">Sets Done</div>
              </div>
            </div>
            <div className="mt-6 text-xs opacity-90">🔥 Streak: 7 days</div>
            <button onClick={() => setPage("home")} data-testid="fitbd-back-home" className="mt-6 bg-white text-emerald-700 rounded-full px-6 py-2 font-bold">Back to Home</button>
          </div>
        )}

        {page === "nutrition" && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setPage("home")} className="text-xs flex items-center gap-1 text-slate-600"><ChevronLeft size={12} /> Home</button>
              <div className="font-bold">🥗 Nutrition</div>
              <span></span>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-3 mb-3">
              <div className="text-xs text-slate-600">Today's calories</div>
              <div className="text-2xl font-bold">{totalKcal} <span className="text-sm text-slate-500">/ 2,000 kcal</span></div>
              <div className="h-2 bg-slate-200 rounded-full mt-2 overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (totalKcal / 2000) * 100)}%` }}></div></div>
            </div>
            <div className="flex gap-1 mb-3 overflow-x-auto">
              {["Breakfast", "Lunch", "Dinner", "Snacks"].map((m) => (
                <button key={m} onClick={() => setActiveMeal(m)} className={`px-3 py-1 rounded-full text-xs font-bold ${activeMeal === m ? "bg-emerald-600 text-white" : "bg-slate-100"}`}>{m}</button>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 mb-3">
              <div className="font-bold text-sm">{activeMeal}</div>
              {meals[activeMeal].length === 0 ? <div className="text-[11px] text-slate-400 mt-1">No items yet</div> : meals[activeMeal].map((f, i) => (
                <div key={i} className="flex justify-between text-xs py-1 border-b last:border-b-0">
                  <span>{f.name}</span>
                  <span className="font-bold">{f.kcal} kcal</span>
                </div>
              ))}
            </div>
            <input value={foodSearch} onChange={(e) => setFoodSearch(e.target.value)} placeholder="Search food..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-2" data-testid="fitbd-food-search" />
            <div className="space-y-1">
              {FOODS.filter((f) => f.name.toLowerCase().includes(foodSearch.toLowerCase())).map((f, i) => (
                <button key={i} onClick={() => addFood(f)} data-testid={`fitbd-food-${i}`} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-left text-xs flex justify-between items-center hover:border-emerald-300">
                  <div>
                    <div className="font-bold">{f.name}</div>
                    <div className="text-[10px] text-slate-500">P: {f.p}g · C: {f.c}g · F: {f.f}g</div>
                  </div>
                  <div className="font-bold text-emerald-700">{f.kcal} kcal</div>
                </button>
              ))}
            </div>
            <div className="mt-4 bg-blue-50 rounded-xl p-3">
              <div className="text-xs font-bold mb-2">💧 Water Tracker</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <button key={i} onClick={() => setWater(i)} className="text-2xl">{i <= water ? "💧" : "🥃"}</button>
                ))}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">{water}/8 glasses</div>
            </div>
          </div>
        )}

        {/* Bottom nav */}
        {(["home", "workout", "nutrition"].includes(page)) && (
          <div className="border-t border-slate-200 bg-white flex justify-around py-2">
            <NavBtn active={page === "home"} onClick={() => setPage("home")} icon="🏠" label="Home" testid="fitbd-nav-home" />
            <NavBtn active={page === "workout"} onClick={() => setPage("workout")} icon="💪" label="Workout" testid="fitbd-nav-workout" />
            <NavBtn active={page === "nutrition"} onClick={() => setPage("nutrition")} icon="🥗" label="Food" testid="fitbd-nav-nutrition" />
          </div>
        )}

        {/* Subscribe modal */}
        {showSubModal && (
          <div className="absolute inset-0 bg-black/60 z-40 flex items-end">
            <div className="bg-white w-full rounded-t-3xl p-5" data-testid="fitbd-sub-modal">
              <div className="w-10 h-1 bg-slate-300 mx-auto mb-3 rounded"></div>
              {(() => {
                const plan = PLANS.find((p) => p.id === showSubModal);
                return (
                  <>
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <div className="text-xs text-slate-500">{plan.duration}</div>
                    <div className="mt-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3">
                      <div className="text-2xl font-bold">BDT {plan.price}/month</div>
                      <div className="text-xs">Charged from your Robi balance</div>
                    </div>
                    {balance !== null && <div className="text-xs mt-2">Balance: <b>BDT {balance}</b></div>}
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => setShowSubModal(null)} className="flex-1 border border-slate-200 rounded-lg py-2 text-sm">Cancel</button>
                      <button onClick={() => unlockPremium(showSubModal)} disabled={busy} data-testid="fitbd-confirm-sub" className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg py-2 text-sm font-bold disabled:opacity-50">{busy ? "..." : `Subscribe BDT ${plan.price}`}</button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </Frame>

      <APIMonitor />
    </div>
  );
};

const Stat = ({ icon, val, label }) => (
  <div>
    <div className="bg-white/15 backdrop-blur rounded-lg py-2">
      <div className="flex justify-center">{icon}</div>
      <div className="font-bold text-sm mt-0.5">{val}</div>
      <div className="text-[9px] uppercase opacity-80">{label}</div>
    </div>
  </div>
);

const NavBtn = ({ active, onClick, icon, label, testid }) => (
  <button onClick={onClick} data-testid={testid} className={`flex flex-col items-center text-[10px] ${active ? "text-emerald-600 font-bold" : "text-slate-500"}`}>
    <div className="text-lg">{icon}</div>
    {label}
  </button>
);

export default FitBD;
