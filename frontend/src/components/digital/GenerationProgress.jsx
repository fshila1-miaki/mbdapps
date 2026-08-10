import React, { useEffect, useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";

const STEPS = [
  "Reading your requirements",
  "Applying design system",
  "Generating components",
  "Wiring navigation & routing",
  "Connecting mock data",
  "Finalizing preview",
];

const GenerationProgress = ({ onDone, totalMs = 3000 }) => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const each = totalMs / STEPS.length;
    let cur = 0;
    const tick = setInterval(() => {
      cur += 1;
      setStep(cur);
      if (cur >= STEPS.length) {
        clearInterval(tick);
        setTimeout(() => onDone?.(), 300);
      }
    }, each);
    return () => clearInterval(tick);
  }, [onDone, totalMs]);

  return (
    <div data-testid="generation-progress" className="max-w-md mx-auto py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
          <Sparkles size={20} className="text-[#2563EB]" />
        </div>
        <div>
          <div className="font-bold tracking-tight text-lg">Generating your app...</div>
          <div className="text-xs text-slate-500">This usually takes just a moment.</div>
        </div>
      </div>
      <div className="space-y-3">
        {STEPS.map((s, i) => (
          <div key={s} data-testid={`gen-step-${i}`} className="flex items-center gap-3 text-sm">
            {i < step ? (
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center transition-all">
                <Check size={12} strokeWidth={3} />
              </div>
            ) : i === step ? (
              <div className="w-5 h-5 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                <Loader2 size={12} className="animate-spin text-[#2563EB]" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border border-slate-200"></div>
            )}
            <span className={i < step ? "text-slate-900" : i === step ? "text-slate-900 font-semibold" : "text-slate-400"}>
              {s}{i === step ? "..." : ""}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#2563EB] to-[#7c3aed] transition-all duration-500"
          style={{ width: `${(step / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default GenerationProgress;
