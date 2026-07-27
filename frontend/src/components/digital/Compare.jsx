import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";

// Derive complexity from bullets length (simple heuristic)
const getComplexity = (tpl) => {
  if (!tpl) return "Simple";
  const n = (tpl.bullets || []).length;
  if (n <= 2) return "Simple";
  if (n === 3) return "Medium";
  return "Advanced";
};

const COMPLEXITY_COLOR = {
  Simple: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  Advanced: "bg-rose-100 text-rose-700",
};

// Best For per category (Orbit ecosystem)
const BEST_FOR = {
  "Subscription Service": "Subscription apps with OTP onboarding",
  "USSD Companion": "USSD service operators",
  "Content Service": "Daily content subscribers (Hadith, news)",
  "Analytics": "Developers tracking subscriber growth",
  "OTP Service": "Businesses needing OTP auth",
  "App Store": "Multi-service developers",
  "Premium Content": "Paid CaaS-backed content",
  "Admin Dashboard": "Service provider operators",
  "Alert Service": "SMS alert subscriber apps",
  "USSD / CaaS": "Wallet + USSD companion users",
  "CaaS Content": "Pay-per-unlock content apps",
  "Sports Alert": "Sports fans + scores",
  "Religious Service": "Islamic daily companion apps",
};

const CompareFloatingBar = ({ selected, onClear, onCompare }) => {
  if (!selected.length) return null;
  return (
    <div data-testid="compare-floating-bar" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white rounded-full shadow-2xl px-4 py-2.5 flex items-center gap-3 border border-slate-700">
      <span className="text-xs font-semibold">{selected.length} selected</span>
      <Button
        data-testid="compare-now"
        size="sm"
        disabled={selected.length < 2}
        onClick={onCompare}
        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-8 text-xs"
      >
        Compare Selected ({selected.length}) →
      </Button>
      <button data-testid="compare-clear" onClick={onClear} className="text-xs text-slate-400 hover:text-white">
        Clear
      </button>
    </div>
  );
};

const CompareModal = ({ open, onClose, templates, onChoose }) => (
  <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
    <DialogContent data-testid="compare-modal" className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle>Compare Templates</DialogTitle>
        <DialogDescription>Side-by-side comparison of your selected templates.</DialogDescription>
      </DialogHeader>
      <div className="overflow-auto -mx-6 px-6">
        <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${templates.length}, minmax(0, 1fr))` }}>
          {templates.map((t) => (
            <div key={t.id} className="border border-slate-200 rounded-xl p-4 flex flex-col">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.iconGradient || "from-slate-500 to-slate-700"} flex items-center justify-center text-2xl mb-3`}>{t.icon}</div>
              <h3 className="font-bold tracking-tight">{t.name}</h3>
              <div className="flex flex-wrap gap-1 mt-1 self-start">
                <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{t.category}</span>
                {(t.apis || []).map((a) => <span key={a} className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-rose-50 text-rose-700">{a}</span>)}
              </div>
              <div className="mt-3">
                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Features</div>
                <ul className="space-y-1">
                  {t.bullets.map((b) => (
                    <li key={b} className="text-xs flex items-start gap-1.5">
                      <Check size={12} className="text-emerald-600 mt-0.5 flex-shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-3">
                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Complexity</div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${COMPLEXITY_COLOR[getComplexity(t)]}`}>{getComplexity(t)}</span>
              </div>
              <div className="mt-3">
                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Best For</div>
                <p className="text-xs text-slate-600">{BEST_FOR[t.category] || "General use"}</p>
              </div>
              <div className="mt-auto pt-4">
                <Button
                  data-testid={`compare-choose-${t.id}`}
                  size="sm"
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8]"
                  onClick={() => onChoose(t)}
                >
                  Choose This
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export { CompareFloatingBar, CompareModal };
