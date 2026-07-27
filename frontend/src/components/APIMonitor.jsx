import React, { useState, useEffect, useRef } from "react";
import { Activity, X, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { subscribeMonitor, getMonitorLogs, clearMonitorLogs } from "../services/OrbitAPI";

const CATEGORY_COLORS = {
  OTP: "bg-blue-500",
  SMS: "bg-emerald-500",
  Subscription: "bg-purple-500",
  CaaS: "bg-amber-500",
};

const CATEGORY_FILTERS = ["All", "OTP", "SMS", "Subscription", "CaaS"];

const APIMonitor = ({ autoOpen = false }) => {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState(() => getMonitorLogs());
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState({});
  const [pulse, setPulse] = useState(false);
  const autoOpenTriggered = useRef(false);

  useEffect(() => {
    const unsub = subscribeMonitor((log) => {
      if (!log) {
        setLogs([]);
        return;
      }
      setLogs((p) => [log, ...p].slice(0, 80));
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
      if (autoOpen && !autoOpenTriggered.current) {
        autoOpenTriggered.current = true;
        setOpen(true);
      }
    });
    return unsub;
  }, [autoOpen]);

  const filtered = filter === "All" ? logs : logs.filter((l) => l.category === filter);
  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  return (
    <>
      {/* Floating toggle button — positioned bottom-LEFT to avoid the
          Emergent / Made-with badge in the bottom-right corner which can
          intercept clicks and obscure the panel. */}
      <button
        data-testid="api-monitor-toggle"
        onClick={() => setOpen((p) => !p)}
        style={{ zIndex: 2147483646 }}
        className={`fixed bottom-6 left-6 w-14 h-14 rounded-full bg-slate-900 hover:bg-slate-700 text-white shadow-2xl flex items-center justify-center transition-all ${pulse ? "ring-4 ring-emerald-400 scale-110" : ""}`}
        title="Orbit API Monitor"
      >
        <Activity size={22} className={pulse ? "text-emerald-400" : "text-white"} />
        {logs.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {logs.length > 99 ? "99+" : logs.length}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          data-testid="api-monitor-panel"
          style={{ zIndex: 2147483647 }}
          className="fixed bottom-24 left-6 w-[360px] max-w-[calc(100vw-2rem)] h-[480px] bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-900">
            <div>
              <div className="text-sm font-bold flex items-center gap-1.5">
                <Activity size={14} className="text-emerald-400" /> Orbit API Monitor
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Real-time API activity log · {logs.length} calls</div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => clearMonitorLogs()} title="Clear logs" className="text-slate-400 hover:text-rose-400 p-1" data-testid="api-monitor-clear">
                <Trash2 size={14} />
              </button>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white p-1" data-testid="api-monitor-close">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="px-3 py-2 border-b border-slate-700 flex gap-1.5 overflow-x-auto">
            {CATEGORY_FILTERS.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                data-testid={`api-monitor-filter-${c.toLowerCase()}`}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${filter === c ? "bg-emerald-500 text-slate-900" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Demo banner */}
          <div className="px-3 py-2 bg-amber-500/10 border-b border-amber-500/20 text-[10px] text-amber-200">
            ℹ️ Demo Mode · Calls are simulated. Production endpoint: <code className="text-amber-300">developer.orbit.com</code>
          </div>

          {/* Logs */}
          <div className="flex-1 overflow-y-auto px-2 py-2 text-xs font-mono">
            {filtered.length === 0 ? (
              <div className="text-center text-slate-500 py-12 text-xs">
                <div className="text-2xl mb-2">📡</div>
                Waiting for API activity...
              </div>
            ) : (
              filtered.map((log) => {
                const isSuccess = log.statusCode === "S1000";
                const exp = expanded[log.id];
                return (
                  <div key={log.id} data-testid={`api-log-${log.id}`} className="mb-1.5 bg-slate-800/60 rounded-lg overflow-hidden">
                    <button onClick={() => toggle(log.id)} className="w-full px-2.5 py-2 flex items-start gap-2 hover:bg-slate-800 transition-colors text-left">
                      <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${isSuccess ? "bg-emerald-400" : "bg-rose-400"}`}></span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold text-white ${CATEGORY_COLORS[log.category] || "bg-slate-500"}`}>{log.method}</span>
                          <span className="text-slate-200 truncate flex-1">{log.endpoint}</span>
                          <span className="text-slate-400 text-[10px]">{log.elapsedMs}ms</span>
                        </div>
                        <div className={`text-[10px] mt-0.5 ${isSuccess ? "text-emerald-300" : "text-rose-300"}`}>
                          {isSuccess ? "✓" : "✗"} {log.statusCode} — {log.response?.statusDetail || log.response?.errorDescription || "—"}
                        </div>
                      </div>
                      {exp ? <ChevronDown size={12} className="text-slate-500 mt-1.5" /> : <ChevronRight size={12} className="text-slate-500 mt-1.5" />}
                    </button>
                    {exp && (
                      <div className="px-2.5 pb-2 space-y-2 text-[10px]">
                        <div>
                          <div className="text-slate-400 font-bold mb-0.5 uppercase tracking-wider">Request</div>
                          <pre className="bg-slate-950 rounded p-2 text-emerald-300 overflow-x-auto leading-relaxed">{JSON.stringify(log.request, null, 2)}</pre>
                        </div>
                        <div>
                          <div className="text-slate-400 font-bold mb-0.5 uppercase tracking-wider">Response</div>
                          <pre className="bg-slate-950 rounded p-2 text-sky-300 overflow-x-auto leading-relaxed">{JSON.stringify(log.response, null, 2)}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default APIMonitor;
