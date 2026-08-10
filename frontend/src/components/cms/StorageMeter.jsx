import React from "react";
import { Database } from "lucide-react";

const StorageMeter = ({ usedBytes = 0, capBytes = 500 * 1024 * 1024, compact = false }) => {
  const usedMb = (usedBytes / (1024 * 1024)).toFixed(1);
  const capMb = Math.round(capBytes / (1024 * 1024));
  const pct = Math.min(100, (usedBytes / capBytes) * 100);

  if (compact) {
    return (
      <div data-testid="storage-meter-compact" className="px-3 py-2 text-[11px] text-slate-300">
        <div className="flex items-center justify-between mb-1"><span>Storage</span><span>{usedMb} / {capMb} MB</span></div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400" style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div data-testid="storage-banner" className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl px-4 py-3 flex items-center gap-3">
      <Database size={20} />
      <div className="flex-1">
        <div className="text-sm font-bold flex items-center gap-2">Orbit Cloud Storage <span className="text-[10px] bg-emerald-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Connected</span></div>
        <div className="text-xs text-slate-300 mt-0.5">All content you add is stored in your Orbit database — your launched app reads from it in real-time.</div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-[10px] text-slate-300 whitespace-nowrap">{usedMb} / {capMb} MB · {pct.toFixed(0)}%</div>
        </div>
      </div>
      <button className="text-xs bg-amber-400 text-slate-900 px-3 py-1.5 rounded font-bold whitespace-nowrap">Upgrade to Pro · 10GB</button>
    </div>
  );
};

export default StorageMeter;
