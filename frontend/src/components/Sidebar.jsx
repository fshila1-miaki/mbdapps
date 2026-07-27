import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ServerCog, Sparkles, Store, BarChart3, Layers, Users, ShieldCheck, Settings2, LogOut, X, FolderOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";

const DEV_LINKS = [
  { to: "/dashboard", labelKey: "nav.dashboard", testid: "side-dashboard", icon: LayoutDashboard, exact: true },
  { to: "/appstore", labelKey: "nav.appStore", testid: "side-app-store", icon: Store },
  { to: "/reports", labelKey: "nav.reports", testid: "side-reports", icon: BarChart3 },
  { to: "/digital", labelKey: "nav.digital", testid: "side-digital", icon: Layers, accent: true },
  { to: "/my-apps", labelKey: "nav.myApps", testid: "side-my-apps", icon: FolderOpen, accent: true },
  { to: "/add-ons", labelKey: "nav.addOns", testid: "side-add-ons", icon: Sparkles, accent: true },
];

const ADMIN_LINKS = [
  { to: "/admin", labelKey: "nav.dashboard", testid: "side-dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", labelKey: "nav.userManagement", testid: "side-user-management", icon: Users },
  { to: "/admin/provisioning", labelKey: "nav.provisioning", testid: "side-provisioning", icon: ServerCog },
  { to: "/appstore", labelKey: "nav.appStore", testid: "side-app-store", icon: Store },
  { to: "/reports", labelKey: "nav.reporting", testid: "side-reporting", icon: BarChart3 },
  { to: "/admin/tap", labelKey: "nav.tapAdmin", testid: "side-tap-admin", icon: ShieldCheck },
  { to: "/admin/appstore", labelKey: "nav.appStoreAdmin", testid: "side-app-store-admin", icon: Settings2 },
];

export const useSidebarCollapsed = () => {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem("bdapps_sidebar_collapsed") === "true"; } catch { return false; }
  });
  useEffect(() => {
    localStorage.setItem("bdapps_sidebar_collapsed", String(collapsed));
    // Broadcast so Layout (which reads this same hook in a sibling tree) stays in sync.
    window.dispatchEvent(new CustomEvent("bdapps:sidebar", { detail: { collapsed } }));
  }, [collapsed]);
  // Listen so any other consumer of this hook updates when another instance toggles.
  useEffect(() => {
    const handler = (e) => { if (e.detail && typeof e.detail.collapsed === "boolean") setCollapsed(e.detail.collapsed); };
    window.addEventListener("bdapps:sidebar", handler);
    return () => window.removeEventListener("bdapps:sidebar", handler);
  }, []);
  return [collapsed, setCollapsed];
};

const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useApp();
  const { t } = useTranslation();
  const loc = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  if (!user) return null;

  const links = user.role === "admin" ? ADMIN_LINKS : DEV_LINKS;
  const isActive = (l) => l.exact ? loc.pathname === l.to : loc.pathname === l.to || loc.pathname.startsWith(l.to + "/");

  const onLogout = () => { logout(); navigate("/", { replace: true }); };

  const width = collapsed ? "w-16" : "w-64";

  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden" data-testid="sidebar-overlay" />}
      <aside data-testid="sidebar" data-collapsed={collapsed} className={`${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed left-0 top-0 z-50 ${width} h-screen bg-[#0f172a] text-white flex flex-col transition-[width,transform] duration-200 ease-in-out`}>
        {/* Collapse toggle */}
        <button data-testid="sidebar-collapse-toggle" onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white text-[#0f172a] border border-slate-200 rounded-full items-center justify-center shadow-sm hover:bg-slate-50 z-10">
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        <div className="h-16 px-3 flex items-center justify-between border-b border-white/10">
          <Link to={user.role === "admin" ? "/admin" : "/dashboard"} className="flex items-center gap-2" onClick={onClose}>
            <div className="w-8 h-8 bg-[#e11d48] rounded-md flex items-center justify-center font-bold shrink-0">B</div>
            {!collapsed && <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Orbit</span>}
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-white/10 rounded" data-testid="sidebar-close"><X size={18} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {!collapsed && <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-1">{user.role === "admin" ? t("nav.adminConsole") : t("nav.developerConsole")}</p>}
          {links.map((l) => {
            const label = t(l.labelKey);
            return (
              <Link key={l.to} to={l.to} onClick={onClose} title={collapsed ? label : ""}
                data-testid={l.testid}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors min-h-[44px] ${collapsed ? "justify-center" : ""} ${isActive(l) ? "bg-[#e11d48] text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"} relative`}>
                <l.icon size={16} className="shrink-0" />
                {!collapsed && <span className="flex-1 truncate">{label}</span>}
                {!collapsed && l.accent && !isActive(l) && <span className="text-[9px] uppercase font-bold bg-[#e11d48] text-white px-1.5 py-0.5 rounded">{t("common.new")}</span>}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">{label}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-white/10">
          {!collapsed && (
            <div className="px-2 py-1 mb-1 text-xs">
              <div className="font-semibold text-white truncate">{user.name}</div>
              <div className="text-slate-400 truncate text-[11px]">{user.email}</div>
            </div>
          )}
          <button onClick={onLogout} data-testid="sidebar-logout" title={collapsed ? t("common.logout") : ""}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-rose-300 hover:bg-white/5 min-h-[44px] ${collapsed ? "justify-center" : ""}`}>
            <LogOut size={16} className="shrink-0" />{!collapsed && <span>{t("common.logout")}</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
