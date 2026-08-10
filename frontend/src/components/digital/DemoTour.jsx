import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";

const STEPS = [
  { target: "tabs-bar", title: "Pick a Path", body: "Choose between Web app templates or Android app templates." },
  { target: "template-card", title: "Pick a Template", body: "Pick a pre-built template matching your app idea." },
  { target: "design-picker", title: "Choose a Design", body: "Choose the look and feel of your app." },
  { target: "cust-form", title: "Tell Us About Your App", body: "Tell us about your app — name, colors, features." },
  { target: "preview-pane", title: "See It Live", body: "See your app rendered live before downloading." },
  { target: "action-bar", title: "Ship It", body: "Download the code, push to GitHub, or deploy in one click." },
];

const useTargetRect = (id) => {
  const [rect, setRect] = useState(null);
  useEffect(() => {
    if (!id) return setRect(null);
    const find = () => {
      const el = document.querySelector(`[data-tour="${id}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top + window.scrollY, left: r.left, width: r.width, height: r.height });
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setRect(null);
      }
    };
    find();
    const t = setTimeout(find, 250);
    window.addEventListener("resize", find);
    return () => { clearTimeout(t); window.removeEventListener("resize", find); };
  }, [id]);
  return rect;
};

const DemoTour = ({ open, onClose }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { if (open) setIdx(0); }, [open]);
  const step = STEPS[idx];
  const rect = useTargetRect(open ? step?.target : null);

  if (!open || !step) return null;

  // Place tooltip below the target if there's room, otherwise above. Tooltip is fixed so we use viewport-relative coords (rect already is).
  const TT_W = 320;
  const TT_H = 180;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  // rect.top is viewport-relative because rect comes from getBoundingClientRect when first computed,
  // but we stored `top: r.top + scrollY` (document coords) in useTargetRect for the spotlight.
  // For the tooltip we need viewport coords, so subtract scrollY back.
  const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
  const vpTop = rect ? rect.top - scrollY : vh / 2;
  let ttTop = rect ? vpTop + rect.height + 12 : vh / 2 - TT_H / 2;
  if (ttTop + TT_H > vh - 16) {
    ttTop = rect ? vpTop - TT_H - 12 : 16;
  }
  ttTop = Math.max(16, Math.min(vh - TT_H - 16, ttTop));
  const ttLeft = rect ? Math.max(16, Math.min(vw - TT_W - 16, rect.left + rect.width / 2 - TT_W / 2)) : vw / 2 - TT_W / 2;

  const isLast = idx === STEPS.length - 1;

  return (
    <>
      {/* Overlay */}
      <div data-testid="tour-overlay" className="fixed inset-0 bg-slate-900/60 z-[60] pointer-events-auto" onClick={onClose} />
      {/* Spotlight */}
      {rect && (
        <div
          className="absolute z-[61] rounded-xl pointer-events-none ring-4 ring-[#2563EB] shadow-[0_0_0_9999px_rgba(15,23,42,0.55)] transition-all"
          style={{ top: rect.top - 6, left: rect.left - 6, width: rect.width + 12, height: rect.height + 12 }}
        />
      )}
      {/* Tooltip */}
      <div
        data-testid="tour-tooltip"
        className="fixed z-[62] w-80 bg-[#09090B] text-white rounded-xl shadow-2xl p-4 border border-slate-700"
        style={{ top: ttTop, left: ttLeft }}
      >
        <button onClick={onClose} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white" data-testid="tour-close">
          <X size={14} />
        </button>
        <div className="text-[10px] uppercase tracking-widest text-[#2563EB] font-bold mb-1">Step {idx + 1} of {STEPS.length}</div>
        <div className="font-bold tracking-tight text-base mb-1">{step.title}</div>
        <div className="text-xs text-slate-300 leading-relaxed">{step.body}</div>
        <div className="flex items-center justify-between mt-4 gap-2">
          <button data-testid="tour-skip" onClick={onClose} className="text-xs text-slate-400 hover:text-white">Skip Tour</button>
          <div className="flex items-center gap-2">
            {idx > 0 && (
              <Button data-testid="tour-prev" size="sm" variant="outline" onClick={() => setIdx(idx - 1)} className="bg-transparent text-white border-slate-600 hover:bg-slate-800 h-7 text-xs">
                ← Back
              </Button>
            )}
            <Button data-testid="tour-next" size="sm" onClick={() => isLast ? onClose() : setIdx(idx + 1)} className="bg-[#2563EB] hover:bg-[#1D4ED8] h-7 text-xs">
              {isLast ? "Finish" : "Next →"}
            </Button>
          </div>
        </div>
        {/* Arrow */}
        {rect && (
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#09090B] border-t border-l border-slate-700 rotate-45"></div>
        )}
      </div>
    </>
  );
};

export default DemoTour;
