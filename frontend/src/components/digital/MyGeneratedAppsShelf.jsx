import React, { useState } from "react";
import { Download, Github, Link2, Smartphone, Globe, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useGeneratedApps } from "../../hooks/useBuilderStorage";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";

const formatDate = (ts) => {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const yest = new Date(now);
  yest.setDate(now.getDate() - 1);
  const isYest = d.toDateString() === yest.toDateString();
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (sameDay) return `Today, ${time}`;
  if (isYest) return `Yesterday, ${time}`;
  return d.toLocaleDateString([], { month: "short", day: "numeric" }) + `, ${time}`;
};

const ShelfCard = ({ app }) => {
  const isWeb = app.type === "web";
  const [busy, setBusy] = useState(null);

  const triggerDownload = () => {
    setBusy("download");
    toast.loading("Preparing your code...", { id: `dl-${app.id}` });
    setTimeout(() => {
      toast.success(`Re-downloaded ${app.zipName}`, { id: `dl-${app.id}` });
      setBusy(null);
    }, 1200);
  };
  const triggerPush = () => {
    setBusy("push");
    toast.loading("Pushing to GitHub...", { id: `gh-${app.id}` });
    setTimeout(() => {
      toast.success(`Pushed to ${app.repoUrl || `github.com/dev/${app.slug}`}`, { id: `gh-${app.id}` });
      setBusy(null);
    }, 1400);
  };
  const triggerShare = () => {
    const url = app.previewUrl || `preview.orbit.com/app/${Math.random().toString(36).slice(2, 8)}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    toast.success(`Preview link copied! ${url}`);
  };

  return (
    <div data-testid={`shelf-card-${app.id}`} className="min-w-[260px] max-w-[280px] border border-slate-200 rounded-xl bg-white p-4 hover:shadow-md transition-all hover:-translate-y-0.5 hover:border-[#2563EB]/40 flex-shrink-0">
      <div className="flex items-start gap-3">
        <div className="text-3xl w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
          {app.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={`text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded inline-flex items-center gap-1 ${isWeb ? "bg-sky-100 text-sky-700" : "bg-emerald-100 text-emerald-700"}`}>
              {isWeb ? <Globe size={9} /> : <Smartphone size={9} />} {isWeb ? "Web" : "Android"}
            </span>
          </div>
          <div className="font-semibold text-sm truncate" title={app.appName}>{app.appName}</div>
          <div className="text-xs text-slate-500 truncate">{app.templateName}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{formatDate(app.generatedAt)}</div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-slate-100">
        <button data-testid={`shelf-redownload-${app.id}`} disabled={busy === "download"} onClick={triggerDownload} title="Re-download" className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 disabled:opacity-50">
          <Download size={14} />
        </button>
        <button data-testid={`shelf-repush-${app.id}`} disabled={busy === "push"} onClick={triggerPush} title="Re-push to GitHub" className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 disabled:opacity-50">
          <Github size={14} />
        </button>
        <button data-testid={`shelf-reshare-${app.id}`} onClick={triggerShare} title="Share Preview" className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600">
          <Link2 size={14} />
        </button>
      </div>
    </div>
  );
};

const ViewAllModal = ({ apps, open, onClose }) => (
  <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle>My Generated Apps</DialogTitle>
        <DialogDescription>All apps you have generated in this session. Stored locally in your browser.</DialogDescription>
      </DialogHeader>
      <div className="overflow-y-auto -mx-6 px-6 flex-1">
        {apps.length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-500">No apps generated yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {apps.map((a) => <ShelfCard key={a.id + "-all"} app={a} />)}
          </div>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} data-testid="shelf-viewall-close">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const MyGeneratedAppsShelf = () => {
  const { apps } = useGeneratedApps();
  const [viewAll, setViewAll] = useState(false);
  const recent = apps.slice(0, 3);

  return (
    <section data-testid="generated-apps-shelf" className="border border-slate-200 rounded-2xl bg-gradient-to-br from-slate-50 to-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#2563EB]" />
          <h2 className="font-bold tracking-tight text-base">My Generated Apps</h2>
          {apps.length > 0 && <span className="text-xs text-slate-500">({apps.length})</span>}
        </div>
        {apps.length > 3 && (
          <button data-testid="shelf-viewall" onClick={() => setViewAll(true)} className="text-xs font-semibold text-[#2563EB] hover:underline">
            View All →
          </button>
        )}
      </div>

      {recent.length === 0 ? (
        <div data-testid="shelf-empty" className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-2 border border-dashed border-slate-300">
            <Sparkles size={20} className="text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">No apps generated yet — explore templates below to get started</p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          {recent.map((a) => <ShelfCard key={a.id} app={a} />)}
        </div>
      )}

      <ViewAllModal apps={apps} open={viewAll} onClose={() => setViewAll(false)} />
    </section>
  );
};

export default MyGeneratedAppsShelf;
