import React from "react";
import { useNavigate } from "react-router-dom";
import { Check, Circle } from "lucide-react";

const ADD_ONS = [
  { id: "analytics", icon: "📊", name: "Analytics", pitch: "Know every visitor, order, and revenue in real-time.", cta: "FREE 14-day trial", anchor: "analytics" },
  { id: "push", icon: "🔔", name: "Push Notifications", pitch: "Re-engage users with targeted push alerts. 94% open rate.", cta: "From BDT 500/mo", anchor: "push" },
  { id: "whatsapp", icon: "💬", name: "WhatsApp Campaigns", pitch: "98% message read rate. Better than email by 10x.", cta: "From BDT 1,200/mo", anchor: "whatsapp" },
  { id: "fbads", icon: "🎯", name: "Facebook & Google Ads", pitch: "Reach 50M+ Bangladeshis. AI-optimized.", cta: "From BDT 2,000/mo", anchor: "fbads" },
  { id: "sms", icon: "📨", name: "SMS Marketing", pitch: "Orbit native. Reach every phone in Bangladesh.", cta: "BDT 0.25 / SMS", anchor: "sms" },
  { id: "influencer", icon: "🌟", name: "Influencer Connect", pitch: "BD's top influencers. 10M+ combined reach.", cta: "Custom pricing", anchor: "influencer" },
];

const LevelUp = ({ type, submittedToReview = true }) => {
  const navigate = useNavigate();
  const goAddOn = (anchor) => navigate(`/add-ons?focus=${anchor}`);

  return (
    <div data-testid="level-up-panel" className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-r from-amber-50 to-rose-50 border-b border-slate-200">
          <div className="text-lg font-bold tracking-tight">🚀 Level Up Your App</div>
          <div className="text-xs text-slate-600 mt-0.5">"Apps with marketing & analytics grow 5x faster"</div>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ADD_ONS.map((a) => (
            <button key={a.id} data-testid={`levelup-${a.id}`} onClick={() => goAddOn(a.anchor)}
              className="text-left border border-slate-200 hover:border-rose-300 hover:shadow-md rounded-xl p-3 bg-white transition-all">
              <div className="text-2xl">{a.icon}</div>
              <div className="font-bold text-sm mt-1">{a.name}</div>
              <div className="text-xs text-slate-600 mt-1 line-clamp-2">"{a.pitch}"</div>
              <div className="text-[11px] text-rose-600 font-bold mt-2">{a.cta} →</div>
            </button>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-slate-200 text-center">
          <button data-testid="see-all-addons" onClick={() => navigate("/add-ons")} className="text-sm font-bold text-rose-600 hover:underline">See all Add-Ons →</button>
        </div>
      </div>

      {/* Journey */}
      <div data-testid="app-journey" className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="text-sm font-bold mb-3">📋 Your App Journey</div>
        <ul className="space-y-2 text-sm">
          {[
            { done: true, label: "App generated" },
            { done: true, label: "Content added" },
            { done: submittedToReview, label: "Submitted for admin review" },
            { done: false, label: "Get approved (24–48 hrs) — you'll be notified" },
            { done: false, label: `Go live on ${type === "android" ? "Orbit App Store" : "the Web"}` },
            { done: false, label: "Add marketing to grow subscribers" },
          ].map((s, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center ${s.done ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 border border-slate-300"}`}>
                {s.done ? <Check size={11} /> : <Circle size={9} />}
              </span>
              <span className={s.done ? "text-slate-700" : "text-slate-500"}>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LevelUp;
