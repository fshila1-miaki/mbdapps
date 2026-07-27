import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Eye, GripVertical, BarChart3 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SlidePanel, Field, Input, Textarea, Button, ImageDropzone } from "./_shared";

const Banners = () => {
  const { app, triggerSave } = useOutletContext();
  const { appContent, updateAppContent, addCmsActivity } = useApp();
  const banners = appContent[app.id]?.banners || [];
  const [editing, setEditing] = useState(null);

  const save = (data) => {
    const updated = data.id ? banners.map((b) => b.id === data.id ? data : b) : [...banners, { ...data, id: `ban-${Math.random().toString(36).slice(2, 8)}` }];
    triggerSave(() => {
      updateAppContent(app.id, "banners", updated);
      addCmsActivity(app.id, { type: "banner", text: `🖼 ${data.id ? "Updated" : "Added"} banner: ${data.title}` });
      setEditing(null);
      toast.success("✓ Banner saved — live on site");
    });
  };

  const del = (b) => {
    if (!window.confirm(`Delete banner "${b.title}"?`)) return;
    triggerSave(() => {
      updateAppContent(app.id, "banners", banners.filter((x) => x.id !== b.id));
      toast.success(`Deleted "${b.title}"`);
    });
  };

  const move = (idx, dir) => {
    const arr = [...banners];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    triggerSave(() => {
      updateAppContent(app.id, "banners", arr);
      toast.success("Display order updated");
    });
  };

  return (
    <div className="space-y-4" data-testid="cms-banners">
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">Banners ({banners.length} active)</h1>
          <p className="text-xs text-slate-500">Drag to reorder — order reflects live on site immediately</p>
        </div>
        <Button data-testid="add-banner" onClick={() => setEditing({})} className="bg-[#2563EB] hover:bg-[#1D4ED8] gap-1"><Plus size={14} /> Add Banner</Button>
      </div>

      {banners.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-400">No banners yet — add one to feature on your homepage.</div>
      ) : (
        <div className="space-y-2">
          {banners.map((b, i) => {
            const views = 12840 - i * 1230;
            const clicks = 3241 - i * 392;
            const ctr = ((clicks / views) * 100).toFixed(1);
            return (
              <div key={b.id} data-testid={`banner-card-${b.id}`} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col sm:flex-row">
                <div className="flex flex-col items-center justify-center px-2 py-3 bg-slate-50 sm:w-10">
                  <button onClick={() => move(i, -1)} data-testid={`banner-move-up-${b.id}`} className="p-1 hover:bg-slate-200 rounded text-xs">▲</button>
                  <GripVertical size={14} className="text-slate-400 my-1" />
                  <button onClick={() => move(i, 1)} data-testid={`banner-move-down-${b.id}`} className="p-1 hover:bg-slate-200 rounded text-xs">▼</button>
                </div>
                <div className="w-full sm:w-40 h-24 sm:h-auto flex-shrink-0" style={{ background: b.image ? `url(${b.image}) center/cover` : `linear-gradient(135deg, ${app.color}, ${b.color || "#f59e0b"})` }} />
                <div className="flex-1 p-3 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-bold truncate">{b.title}</div>
                      <div className="text-xs text-slate-500 truncate">{b.subtitle}</div>
                      <div className="mt-1 flex items-center gap-1 text-[10px]">
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">Active</span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">CTA: {b.cta}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button data-testid={`edit-banner-${b.id}`} onClick={() => setEditing(b)} className="p-1.5 hover:bg-slate-100 rounded"><Pencil size={13} /></button>
                      <button data-testid={`del-banner-${b.id}`} onClick={() => del(b)} className="p-1.5 hover:bg-rose-50 rounded text-rose-600"><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-3" data-testid={`banner-analytics-${b.id}`}>
                    <BarChart3 size={11} /> Views: <b className="text-slate-800">{views.toLocaleString()}</b> · Clicks: <b className="text-slate-800">{clicks.toLocaleString()}</b> · CTR: <b className="text-emerald-700">{ctr}%</b>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <SlidePanel open={!!editing} onClose={() => setEditing(null)} title={`${editing?.id ? "Edit" : "Add"} Banner`} description="Live on your site after save"
        footer={<Button data-testid="save-banner" onClick={() => save(editing)} className="w-full bg-[#2563EB]">💾 Save Banner</Button>}>
        {editing && <>
          <Field label="Image"><ImageDropzone testid="ban-image" value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} height="h-36" /></Field>
          <Field label="Title" required><Input data-testid="ban-title" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
          <Field label="Subtitle" optional><Input data-testid="ban-subtitle" value={editing.subtitle || ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="CTA Text" required><Input data-testid="ban-cta" value={editing.cta || ""} onChange={(e) => setEditing({ ...editing, cta: e.target.value })} /></Field>
            <Field label="CTA Link">
              <select data-testid="ban-link" value={editing.link || "Homepage"} onChange={(e) => setEditing({ ...editing, link: e.target.value })} className="w-full border border-slate-200 rounded h-9 text-sm px-2">
                <option>Homepage</option><option>Catalog</option><option>Contact</option><option>Custom URL</option>
              </select>
            </Field>
          </div>
        </>}
      </SlidePanel>
    </div>
  );
};

export default Banners;
