import React, { useState, useEffect } from "react";
import { Monitor, Tablet, Smartphone, Maximize2, X, Share2, Eye, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const DEVICES = {
  desktop: { id: "desktop", label: "Desktop", icon: Monitor, width: "100%", maxWidth: 1200, scale: 1 },
  tablet: { id: "tablet", label: "Tablet", icon: Tablet, width: 768, scale: 0.85 },
  mobile: { id: "mobile", label: "Mobile", icon: Smartphone, width: 375, scale: 0.95 },
};

const TabletFrame = ({ children }) => (
  <div className="mx-auto bg-gray-700 rounded-2xl border-4 border-gray-600 shadow-2xl p-4" style={{ width: 800 }}>
    <div className="flex justify-center mb-2"><div className="w-2 h-2 rounded-full bg-gray-500"></div></div>
    <div className="bg-white rounded-lg overflow-hidden">{children}</div>
    <div className="flex justify-center mt-2"><div className="w-8 h-8 rounded-full border-2 border-gray-500"></div></div>
  </div>
);

const MobileWebFrame = ({ url, children }) => (
  <div className="mx-auto bg-gray-900 rounded-[2rem] border-4 border-gray-700 shadow-2xl overflow-hidden" style={{ width: 407 }}>
    <div className="h-6 bg-gray-900 flex justify-center"><div className="w-16 h-3 bg-gray-900 rounded-b-md"></div></div>
    <div className="bg-white">
      <div className="h-7 bg-gray-200 flex items-center px-3 gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-400"></span>
        <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
        <span className="w-2 h-2 rounded-full bg-green-400"></span>
        <div className="flex-1 mx-2 bg-white rounded text-[9px] text-gray-400 px-2 h-5 flex items-center font-mono">🔒 {url}</div>
      </div>
      <div className="overflow-hidden">{children}</div>
    </div>
    <div className="h-1.5 bg-gray-900 flex justify-center"><div className="w-20 h-1 bg-gray-500 rounded-full mt-0.5"></div></div>
  </div>
);

const WebPreviewWrapper = ({ children, url, customerMode, onCustomerToggle, onRestart }) => {
  const [device, setDevice] = useState("desktop");
  const [fs, setFs] = useState(false);

  useEffect(() => {
    if (!fs) return;
    const onKey = (e) => { if (e.key === "Escape") setFs(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [fs]);

  const sharePreview = () => {
    const id = Math.random().toString(36).slice(2, 10);
    const link = `https://preview.orbit.app/demo/${id}`;
    navigator.clipboard?.writeText(link);
    toast.success("Preview link copied! Share with your client.");
  };

  const renderContent = () => {
    if (device === "tablet") return <TabletFrame>{children}</TabletFrame>;
    if (device === "mobile") return <MobileWebFrame url={url}>{children}</MobileWebFrame>;
    return children;
  };

  const toolbar = (
    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2 mb-3">
      <div className="flex items-center gap-1">
        {Object.values(DEVICES).map((d) => {
          const Icon = d.icon;
          return (
            <button key={d.id} data-testid={`device-${d.id}`} onClick={() => setDevice(d.id)} className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg ${device === d.id ? "bg-[#2563EB] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
              <Icon size={13} /> <span className="hidden sm:inline">{d.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-1">
        {onCustomerToggle && (
          <button data-testid="customer-mode-btn" onClick={onCustomerToggle} className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg ${customerMode ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            <Eye size={13} /> <span className="hidden sm:inline">{customerMode ? "Exit Customer View" : "Preview as Customer"}</span>
          </button>
        )}
        {onRestart && (
          <button data-testid="restart-preview-btn" onClick={onRestart} title="Restart Preview" className="text-xs px-2 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"><RotateCcw size={13} /></button>
        )}
        <button data-testid="share-preview-btn" onClick={sharePreview} className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-purple-700 hover:bg-purple-50"><Share2 size={13} /><span className="hidden sm:inline">Share</span></button>
        <button data-testid="fullscreen-btn" onClick={() => setFs(true)} className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"><Maximize2 size={13} /><span className="hidden sm:inline">Fullscreen</span></button>
      </div>
    </div>
  );

  return (
    <div className="space-y-0">
      {toolbar}
      <div className="bg-slate-100 rounded-xl p-2 sm:p-4 transition-all" style={{ animation: "fadeIn 200ms" }}>{renderContent()}</div>

      {fs && (
        <div data-testid="fullscreen-overlay" className="fixed inset-0 z-[9999] bg-black" style={{ animation: "fadeIn 200ms" }}>
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold">Fullscreen Preview</span>
              <div className="flex gap-1">
                {Object.values(DEVICES).map((d) => {
                  const Icon = d.icon;
                  return <button key={d.id} data-testid={`fs-device-${d.id}`} onClick={() => setDevice(d.id)} className={`flex items-center gap-1 text-xs px-3 py-1 rounded-lg ${device === d.id ? "bg-[#2563EB] text-white" : "text-slate-300 hover:bg-slate-800"}`}><Icon size={13} /></button>;
                })}
              </div>
            </div>
            <button data-testid="fs-exit-btn" onClick={() => setFs(false)} className="flex items-center gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] px-3 py-1.5 rounded-lg text-xs font-bold"><X size={13} /> Exit Fullscreen</button>
          </div>
          <div className="overflow-y-auto p-6" style={{ height: "calc(100vh - 50px)" }}>{renderContent()}</div>
        </div>
      )}
    </div>
  );
};

export default WebPreviewWrapper;
