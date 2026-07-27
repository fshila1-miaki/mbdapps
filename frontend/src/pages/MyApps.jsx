import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Plus, ExternalLink, Settings2, BarChart3, Pencil, Smartphone, Globe, Eye, RefreshCw, FileText } from "lucide-react";
import { useApp } from "../context/AppContext";

const StatusBadge = ({ status }) => {
  const map = {
    "Live":           { cls: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
    "Pending Review": { cls: "bg-amber-100 text-amber-700 border-amber-200",       dot: "bg-amber-500" },
    "Rejected":       { cls: "bg-rose-100 text-rose-700 border-rose-200",          dot: "bg-rose-500" },
    "Draft":          { cls: "bg-slate-100 text-slate-600 border-slate-200",       dot: "bg-slate-400" },
    "Featured":       { cls: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200", dot: "bg-fuchsia-500" },
  };
  const m = map[status] || map.Draft;
  return (
    <span data-testid={`status-${status.replace(/\s+/g, "-").toLowerCase()}`} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${m.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`}></span>
      {status}
    </span>
  );
};

const ago = (ts) => {
  if (!ts) return "—";
  const d = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)} min ago`;
  if (d < 86400) return `${Math.floor(d / 3600)} hr ago`;
  return `${Math.floor(d / 86400)} day(s) ago`;
};

const FILTERS = ["All", "Active", "Pending", "Rejected"];

const MyApps = () => {
  const navigate = useNavigate();
  const { myApps, resubmitMyApp } = useApp();
  const { t } = useTranslation();
  const FILTER_LABELS = {
    All: t("common.all"),
    Active: t("common.active"),
    Pending: t("common.pending"),
    Rejected: t("myapps.rejected"),
  };
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");

  const filtered = useMemo(() => {
    let f = myApps;
    if (filter === "Active") f = f.filter((a) => a.status === "Live");
    else if (filter === "Pending") f = f.filter((a) => a.status === "Pending Review");
    else if (filter === "Rejected") f = f.filter((a) => a.status === "Rejected");
    if (sort === "Oldest") f = [...f].sort((a, b) => new Date(a.launchedAt) - new Date(b.launchedAt));
    else if (sort === "Name") f = [...f].sort((a, b) => a.name.localeCompare(b.name));
    else f = [...f].sort((a, b) => new Date(b.launchedAt) - new Date(a.launchedAt));
    return f;
  }, [myApps, filter, sort]);

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{t("myapps.title")} <span className="text-slate-400 text-2xl font-medium">({myApps.length})</span></h1>
            <p className="text-sm text-slate-600 mt-1">{t("myapps.subtitle")}</p>
          </div>
          <Button data-testid="build-new-app-btn" onClick={() => navigate("/digital")} className="bg-[#2563EB] hover:bg-[#1D4ED8] gap-1 rounded-full px-5"><Plus size={14} /> 🚀 {t("myapps.buildNew")}</Button>
        </div>

        {/* Filters + Sort */}
        <div className="flex items-center justify-between flex-wrap gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
          <div className="flex items-center gap-1 flex-wrap">
            {FILTERS.map((f) => {
              const count = f === "All" ? myApps.length : myApps.filter((a) => (f === "Active" && a.status === "Live") || (f === "Pending" && a.status === "Pending Review") || (f === "Rejected" && a.status === "Rejected")).length;
              return <button key={f} onClick={() => setFilter(f)} data-testid={`myapps-filter-${f.toLowerCase()}`} className={`text-xs px-3 py-1.5 rounded-full font-bold ${filter === f ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>{FILTER_LABELS[f]} <span className="opacity-70">{count}</span></button>;
            })}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">{t("myapps.sort")}:</span>
            <select data-testid="myapps-sort" value={sort} onChange={(e) => setSort(e.target.value)} className="border border-slate-200 rounded h-7 text-xs px-2">
              <option value="Newest">{t("myapps.sortNewest")}</option><option value="Oldest">{t("myapps.sortOldest")}</option><option value="Name">{t("myapps.sortName")}</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div data-testid="myapps-empty" className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <div className="text-5xl mb-3">📱</div>
            <h2 className="text-xl font-bold">{t("myapps.noMatching", { filter: FILTER_LABELS[filter] })}</h2>
            <p className="text-sm text-slate-500 mt-1">{t("myapps.tryAnother")}</p>
            <Button onClick={() => navigate("/digital")} className="mt-4 bg-[#2563EB]">{t("myapps.buildFirst")}</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((app) => (
              <div key={app.id} data-testid={`my-app-${app.id}`} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-3" style={{ background: app.color }} />
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-white shrink-0 bg-gradient-to-br ${app.iconGradient || "from-slate-500 to-slate-700"} shadow`}>{app.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lg truncate">{app.name}</div>
                      <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        {app.templateType === "android" ? <Smartphone size={11} /> : <Globe size={11} />}
                        {app.templateType?.toUpperCase()} · {app.kind}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                        <StatusBadge status={app.status} />
                        <span className="text-[10px] text-slate-400">{app.status === "Pending Review" ? `Submitted ${ago(app.submittedAt || app.launchedAt)}` : `Built ${ago(app.launchedAt)}`}</span>
                      </div>
                    </div>
                  </div>

                  {app.status === "Pending Review" && (
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2 text-[11px] text-amber-800">
                      ⏳ Under admin review. Usually takes 24–48 hours.
                    </div>
                  )}
                  {app.status === "Rejected" && app.rejectionReason && (
                    <div className="mt-3 bg-rose-50 border border-rose-200 rounded-lg p-2 text-[11px] text-rose-800">
                      ❌ Rejected: {app.rejectionReason}
                      <button onClick={() => resubmitMyApp(app.id)} data-testid={`resubmit-${app.id}`} className="ml-2 font-bold underline">Resubmit</button>
                    </div>
                  )}

                  {/* Stats */}
                  {app.status === "Live" && (
                    <div className="mt-3 grid grid-cols-3 gap-2 bg-slate-50 rounded-lg p-2 text-center">
                      {app.kind === "health" ? (
                        <>
                          <Stat label="Appointments" value={app.stats?.appointments || 0} />
                          <Stat label="Patients" value={app.stats?.patients || 0} />
                          <Stat label="Doctors" value={app.stats?.doctors || 0} />
                        </>
                      ) : app.templateType === "android" ? (
                        <>
                          <Stat label="Downloads" value={(app.stats?.downloads || 0).toLocaleString()} />
                          <Stat label="Rating" value={`⭐ ${app.stats?.rating || 0}`} />
                          <Stat label="Reviews" value={app.stats?.reviews || 0} />
                        </>
                      ) : (
                        <>
                          <Stat label="Orders" value={app.stats?.orders || 0} />
                          <Stat label="Revenue" value={`৳${((app.stats?.revenue || 0) / 1000).toFixed(0)}k`} />
                          <Stat label="Customers" value={app.stats?.customers || 0} />
                        </>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link to={`/my-apps/${app.id}/content`} data-testid={`manage-content-${app.id}`} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-md px-3 py-2 text-xs font-bold inline-flex items-center justify-center gap-1">
                      <Pencil size={12} /> Manage Content
                    </Link>
                    {app.status === "Live" ? (
                      <>
                        <Link to={`/my-apps/${app.id}/content/overview`} data-testid={`dashboard-${app.id}`} className="border border-slate-200 hover:bg-slate-50 rounded-md px-3 py-2 text-xs font-bold inline-flex items-center justify-center gap-1">
                          <BarChart3 size={12} /> Dashboard
                        </Link>
                        <Link to={`/my-apps/${app.id}/content/settings`} data-testid={`settings-${app.id}`} className="border border-slate-200 hover:bg-slate-50 rounded-md px-3 py-2 text-xs font-bold inline-flex items-center justify-center gap-1">
                          <Settings2 size={12} /> Settings
                        </Link>
                        <Link to={`/apps/${app.slug}`} data-testid={`view-live-${app.id}`} className="border border-slate-200 hover:bg-slate-50 rounded-md px-3 py-2 text-xs font-bold inline-flex items-center justify-center gap-1">
                          {app.templateType === "android" ? <Smartphone size={12} /> : <ExternalLink size={12} />}
                          {app.templateType === "android" ? "View on Store" : "View Live Site"}
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to={`/apps/${app.slug}`} data-testid={`preview-${app.id}`} className="border border-slate-200 hover:bg-slate-50 rounded-md px-3 py-2 text-xs font-bold inline-flex items-center justify-center gap-1">
                          <Eye size={12} /> Preview
                        </Link>
                        <button data-testid={`submission-${app.id}`} onClick={() => navigate(`/my-apps/${app.id}/content/settings`)} className="border border-slate-200 hover:bg-slate-50 rounded-md px-3 py-2 text-xs font-bold inline-flex items-center justify-center gap-1">
                          <FileText size={12} /> View Submission
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <div className="text-base font-bold tabular-nums">{value}</div>
    <div className="text-[9px] uppercase tracking-wider text-slate-500">{label}</div>
  </div>
);

export default MyApps;
