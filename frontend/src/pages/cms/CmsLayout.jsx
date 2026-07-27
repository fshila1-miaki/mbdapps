import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink, Outlet, Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { ExternalLink, ChevronLeft, Menu, X } from "lucide-react";
import SyncIndicator from "../../components/cms/SyncIndicator";
import StorageMeter from "../../components/cms/StorageMeter";
import { CMS_NAV_BY_KIND } from "../../components/cms/navConfig";

// CMS context for child sections — uses outlet context
const CmsLayout = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { myApps, computeStorageBytes } = useApp();
  const app = myApps.find((a) => a.id === appId);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastSync, setLastSync] = useState(app?.lastUpdated || Date.now());
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (app?.lastUpdated) setLastSync(app.lastUpdated); }, [app?.lastUpdated]);

  if (!app) return <Navigate to="/my-apps" replace />;
  const nav = CMS_NAV_BY_KIND[app.kind] || CMS_NAV_BY_KIND.ecommerce;
  const usedBytes = computeStorageBytes();

  const triggerSave = (cb) => {
    setSaving(true);
    setTimeout(() => {
      cb && cb();
      setSaving(false);
      setLastSync(new Date().toISOString());
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top app bar */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-3 sticky top-0 z-30">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-1 text-slate-600" data-testid="cms-mobile-toggle">{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button>
          <button onClick={() => navigate("/my-apps")} data-testid="cms-back" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"><ChevronLeft size={14} /> My Apps</button>
          <span className="hidden sm:block text-slate-300">|</span>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-sm text-white shrink-0" style={{ background: app.color }}>{app.icon}</div>
            <div className="min-w-0">
              <div className="text-sm font-bold truncate">{app.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{app.kind} · {app.templateType?.toUpperCase()}</div>
            </div>
            <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${app.status === "Live" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${app.status === "Live" ? "bg-emerald-500" : "bg-amber-500"}`} />{app.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SyncIndicator lastSync={lastSync} saving={saving} />
          <a href={`https://${app.slug}.orbit.app`} target="_blank" rel="noopener noreferrer" data-testid="view-live-site" className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 px-2 py-1 rounded">
            <ExternalLink size={12} /> View Live Site
          </a>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* CMS Sidebar */}
        <aside data-testid="cms-sidebar" className={`${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:sticky top-14 left-0 w-56 h-[calc(100vh-3.5rem)] bg-white border-r border-slate-200 flex flex-col z-20 transition-transform`}>
          <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {nav.map((item) => (
              <NavLink
                key={item.key}
                to={`/my-apps/${appId}/content/${item.key}`}
                data-testid={`cms-nav-${item.key}`}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md text-sm ${isActive ? "bg-rose-50 text-rose-700 font-bold" : "text-slate-700 hover:bg-slate-50"}`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="p-2 border-t border-slate-200 bg-slate-50">
            <StorageMeter usedBytes={usedBytes} compact />
            <div className="mt-2 bg-gradient-to-br from-blue-50 to-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-center" data-testid="manage-onthego">
              <div className="text-xs font-bold text-slate-700">📱 Manage on the go</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Download the Orbit Admin app</div>
              <button className="mt-1.5 w-full bg-slate-900 text-white rounded text-[10px] py-1.5 font-bold">Get on Play Store</button>
            </div>
          </div>
        </aside>
        {mobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-slate-900/60 z-10 lg:hidden" />}

        {/* Main area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 max-w-6xl">
          <Outlet context={{ app, triggerSave, lastSync, saving }} />
        </main>
      </div>
    </div>
  );
};

export default CmsLayout;
