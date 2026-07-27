import React, { useState, useMemo } from "react";
import { Search, Star, Eye, ArrowRight, Clock, Zap } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import TemplateMockup from "./TemplateMockup";
import { useTemplateRatings } from "../../hooks/useBuilderStorage";

const StarRow = ({ value }) => {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={10} className={s <= rounded ? "text-amber-400 fill-amber-400" : "text-slate-300 fill-slate-300"} />)}
      <span className="text-[11px] text-slate-700 font-semibold ml-1">{value.toFixed(1)}</span>
    </div>
  );
};

const TemplateCard = ({ tpl, type, onUse, onLivePreview, userRating, aggregate }) => (
  <div
    data-testid={`template-card-${tpl.id}`}
    className="group relative bg-white rounded-2xl border border-slate-200 hover:border-[#2563EB] hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col overflow-hidden"
  >
    {/* Robi Powered badge for Pro templates */}
    {type === "pro" && (
      <div className="absolute top-3 right-3 z-20 bg-[#2563EB] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded shadow-md">
        ⚡ Robi Powered
      </div>
    )}
    {userRating > 0 && (
      <div className="absolute top-3 left-3 z-20 bg-amber-400 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md">
        <Star size={11} className="fill-white" />
      </div>
    )}

    {/* Preview Image Area — 180px tall */}
    <div className="relative h-[180px] overflow-hidden">
      <TemplateMockup tpl={tpl} type={type} />
      {/* Shine sweep on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute -inset-x-full top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-[shineSweep_1.3s_ease-in-out_infinite]"></div>
      </div>
    </div>

    {/* Body */}
    <div className="p-4 flex flex-col flex-1">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-slate-100 text-slate-700">{tpl.category}</span>
        <StarRow value={aggregate} />
      </div>
      <h3 className="font-bold text-[17px] tracking-tight leading-tight">{tpl.name}</h3>
      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{tpl.description}</p>

      {/* API chips for pro templates */}
      {type === "pro" && (
        <div className="flex flex-wrap gap-1 mt-2">
          {(tpl.apis || []).map((a) => <span key={a} className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">{a}</span>)}
        </div>
      )}

      {/* Features */}
      <ul className="space-y-1 my-3 flex-1">
        {tpl.bullets.slice(0, 3).map((b, i) => (
          <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
            <span className="text-emerald-600 mt-0.5">✓</span>
            <span className="line-clamp-1">{b}</span>
          </li>
        ))}
      </ul>

      {/* Meta — apps built + time */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3 pb-3 border-b border-slate-100">
        <span className="flex items-center gap-1"><Zap size={11} className="text-amber-500" /><b className="text-slate-700">{(tpl.appsBuilt || 0).toLocaleString()}</b> apps built</span>
        <span className="flex items-center gap-1"><Clock size={11} /> Ready in ~{tpl.buildTime || "4 min"}</span>
      </div>

      {type === "pro" && (
        <div className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md mb-2 inline-block">⚡ No coding required</div>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        <Button size="sm" variant="outline" data-testid={`live-preview-${tpl.id}`} onClick={() => onLivePreview(tpl)} className="flex-1 gap-1.5">
          <Eye size={13} /> Live Preview
        </Button>
        <Button size="sm" data-testid={`use-template-${tpl.id}`} onClick={() => onUse(tpl)} className="flex-1 bg-[#09090B] hover:bg-[#2563EB] transition-colors gap-1.5">
          Use Template <ArrowRight size={12} />
        </Button>
      </div>
    </div>
  </div>
);

const TemplateGallery = ({ templates, type, categories, onSelect, onLivePreview, testidPrefix }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { getUserRating, getAggregateRating } = useTemplateRatings();

  const filtered = useMemo(() => templates.filter((t) => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || t.category === category;
    return matchSearch && matchCat;
  }), [templates, search, category]);

  return (
    <div className="space-y-5">
      <div className="relative w-full sm:max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input data-testid={`${testidPrefix}-search`} placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-full" />
      </div>
      <div className="flex md:flex-wrap gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1 md:overflow-x-visible md:mx-0 md:px-0">
        {categories.map((c) => (
          <button key={c} data-testid={`${testidPrefix}-cat-${c.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} onClick={() => setCategory(c)} className={`shrink-0 whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${category === c ? "bg-[#09090B] text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"}`}>{c}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div data-testid={`${testidPrefix}-empty`} className="text-center py-16 text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">No templates match your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t) => (
            <TemplateCard
              key={t.id}
              tpl={t}
              type={type}
              onUse={onSelect}
              onLivePreview={onLivePreview}
              userRating={getUserRating(t.id)}
              aggregate={getAggregateRating(t.id, t.baseRating)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
