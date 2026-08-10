import React, { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

const WEB_LIST = (count = 4) => [
  "Full React + Vite project (ready to run)",
  "Tailwind CSS configured",
  "React Router for navigation",
  `${count} page components based on your selections`,
  "Mock data layer (easily replace with real API)",
  "Mobile responsive layout",
  "README with setup instructions",
  ".env.example for configuration",
];

const ANDROID_LIST = (count = 4) => [
  "Full Flutter project (Dart)",
  `${count} screens based on your template`,
  "State management (Provider)",
  "Navigation setup (GoRouter)",
  "Mock data layer",
  "Push notification setup (mock)",
  "Dark mode support",
  "README with build instructions",
];

const WhatsIncluded = ({ type = "web", sectionsCount = 4 }) => {
  const [open, setOpen] = useState(true);
  const list = type === "web" ? WEB_LIST(sectionsCount) : ANDROID_LIST(sectionsCount);

  return (
    <div data-testid="whats-included" className="border border-slate-200 rounded-xl bg-white">
      <button
        onClick={() => setOpen(!open)}
        data-testid="whats-included-toggle"
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 rounded-xl"
      >
        <div className="text-left">
          <div className="text-xs uppercase tracking-widest font-bold text-[#2563EB]">What's Included</div>
          <div className="text-xs text-slate-500 mt-0.5">Deliverables in your download</div>
        </div>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <ul className="px-4 pb-4 pt-1 space-y-1.5">
          {list.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
              <Check size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WhatsIncluded;
