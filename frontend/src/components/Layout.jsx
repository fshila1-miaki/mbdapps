import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu, ChevronDown } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";
import Sidebar, { useSidebarCollapsed } from "./Sidebar";
import { OrbitMark } from "./OrbitMark";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { useTranslation } from "react-i18next";

export const Logo = ({ className = "" }) => (
  <Link to="/" data-testid="bdapps-logo" className={`flex items-center gap-2.5 ${className}`}>
    <OrbitMark size={28} className="shrink-0" />
    <span className="orbit-wordmark text-[22px]">orbit</span>
  </Link>
);

const NOTIFS = [
  { title: "App approved", body: "City Prayer Times moved to Limited Production.", time: "2h ago" },
  { title: "Build under review", body: "Recipe of the Day v1.0 awaiting admin.", time: "1d ago" },
  { title: "New subscriber milestone", body: "Cricket Live Updates crossed 10k.", time: "3d ago" },
];

const Layout = ({ children, subnav = null }) => {
  const { user, logout, appNotifs, markNotifsRead } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed] = useSidebarCollapsed();
  const unread = (appNotifs || []).filter((n) => !n.read).length;

  const onLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // Sidebar uses position:fixed at all viewports. We reserve space for it on
  // desktop (lg+) by pushing the main column with margin-left. Width tracks
  // the collapsed state so the column shrinks/grows when the user toggles it.
  const mainOffsetClass = user ? (collapsed ? "lg:ml-16" : "lg:ml-64") : "";

  return (
    <div className="orbit-app min-h-screen" style={{ fontFamily: "'Inter', sans-serif", background: "var(--bg)", color: "var(--text)" }}>
      {user && <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
      <div className={`flex flex-col min-h-screen ${mainOffsetClass} transition-[margin] duration-200 ease-in-out`}>
        <header className="sticky top-0 z-30" style={{ background: "var(--surface)", borderBottom: "1px solid var(--c-border)" }}>
          <div className="px-4 lg:px-8 h-[52px] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {user && (
                <button data-testid="sidebar-toggle" onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-white/5 rounded-md min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <Menu size={20} />
                </button>
              )}
              {!user && <Logo />}
            </div>

            <div className="flex items-center gap-1.5">
              <ThemeToggle />
              <LanguageSwitcher />
              {user && (
                <>
                  <DropdownMenu onOpenChange={(o) => o && unread > 0 && markNotifsRead()}>
                    <DropdownMenuTrigger asChild>
                      <button data-testid="notification-bell" className="relative p-2 hover:bg-slate-100 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                        <Bell size={18} />
                        {unread > 0 && <span data-testid="notification-badge" className="absolute top-0.5 right-0.5 bg-[#2563EB] text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">{unread}</span>}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <DropdownMenuLabel>{t("common.notifications")} {unread > 0 && <span className="text-[#2563EB]">({unread} {t("common.new").toLowerCase()})</span>}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {(appNotifs || []).slice(0, 5).map((n) => (
                        <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-2" onClick={() => n.appId && navigate(`/my-apps`)}>
                          <div className="font-medium text-sm">{n.title}</div>
                          <div className="text-xs text-slate-500">{n.body}</div>
                          <div className="text-xs text-slate-400">{new Date(n.time).toLocaleString()}</div>
                        </DropdownMenuItem>
                      ))}
                      {(!appNotifs || appNotifs.length === 0) && NOTIFS.map((n, i) => (
                        <DropdownMenuItem key={i} className="flex flex-col items-start gap-0.5 py-2">
                          <div className="font-medium text-sm">{n.title}</div>
                          <div className="text-xs text-slate-500">{n.body}</div>
                          <div className="text-xs text-slate-400">{n.time}</div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button data-testid="user-menu-trigger" className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 rounded-md transition-colors min-h-[44px]">
                        <div className="w-8 h-8 bg-[#09090B] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {user.name?.[0] || "U"}
                        </div>
                        <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                        <ChevronDown size={14} className="text-slate-500 hidden sm:block" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuLabel className="flex flex-col">
                        <span>{user.name}</span>
                        <span className="text-xs font-normal text-slate-500">{user.email}</span>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Badge className="ml-2 my-1 bg-slate-100 text-[#09090B] hover:bg-slate-100">{user.role}</Badge>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem data-testid="logout-button" onClick={onLogout} className="text-[#2563EB]">
                        <LogOut size={14} className="mr-2" /> {t("common.logout")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>
          {subnav && <div className="border-t border-slate-200 bg-slate-50 overflow-x-auto">{subnav}</div>}
        </header>
        <main className="flex-1 p-4 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
