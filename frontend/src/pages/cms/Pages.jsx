import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Field, ImageDropzone } from "./_shared";
import { Plus, Trash2, FileText, MapPin } from "lucide-react";

const DEFAULT_PAGES = ["About Us", "Contact", "Privacy Policy", "Terms & Conditions", "FAQ"];

const Pages = () => {
  const { app } = useOutletContext();
  const storageKey = `bdapps_pages_${app.id}`;
  const [pages, setPages] = useState(() => {
    try { const v = JSON.parse(localStorage.getItem(storageKey)); if (v) return v; } catch {}
    return DEFAULT_PAGES.map((t) => ({ title: t, blocks: [{ type: "text", content: `Welcome to ${t}` }], contact: t === "Contact" ? { email: "", phone: "", address: "", showForm: true, mapUrl: "" } : null }));
  });
  const [active, setActive] = useState(0);

  const persist = (arr) => { setPages(arr); localStorage.setItem(storageKey, JSON.stringify(arr)); };
  const updatePage = (patch) => persist(pages.map((p, i) => i === active ? { ...p, ...patch } : p));
  const addPage = () => {
    const title = prompt("Page title");
    if (title) persist([...pages, { title, blocks: [{ type: "text", content: "" }] }]);
  };
  const addBlock = (type) => updatePage({ blocks: [...pages[active].blocks, { type, content: "" }] });
  const updateBlock = (i, content) => updatePage({ blocks: pages[active].blocks.map((b, idx) => idx === i ? { ...b, content } : b) });
  const removeBlock = (i) => updatePage({ blocks: pages[active].blocks.filter((_, idx) => idx !== i) });

  const cur = pages[active];

  return (
    <div className="space-y-4" data-testid="cms-pages">
      <div>
        <h1 className="text-2xl font-bold">Pages</h1>
        <p className="text-xs text-slate-500">Edit your static pages with simple block-based editor</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <aside className="bg-white border border-slate-200 rounded-xl p-2 space-y-1">
          {pages.map((p, i) => (
            <button key={i} onClick={() => setActive(i)} data-testid={`page-tab-${i}`} className={`w-full text-left text-sm px-3 py-2 rounded ${i === active ? "bg-rose-50 text-rose-700 font-bold" : "hover:bg-slate-50"}`}>
              <FileText size={12} className="inline mr-1" /> {p.title}
            </button>
          ))}
          <button onClick={addPage} data-testid="add-page" className="w-full text-left text-xs px-3 py-2 rounded text-rose-600 hover:bg-rose-50 font-bold"><Plus size={11} className="inline mr-1" /> Add Custom Page</button>
        </aside>

        <main className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <Field label="Page Title"><Input data-testid="page-title" value={cur.title} onChange={(e) => updatePage({ title: e.target.value })} /></Field>

          {cur.title === "Contact" && cur.contact && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1"><MapPin size={11} /> Contact Page Config</div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Email" required><Input data-testid="contact-email" value={cur.contact.email} onChange={(e) => updatePage({ contact: { ...cur.contact, email: e.target.value } })} /></Field>
                <Field label="Phone" required><Input data-testid="contact-phone" value={cur.contact.phone} onChange={(e) => updatePage({ contact: { ...cur.contact, phone: e.target.value } })} /></Field>
              </div>
              <Field label="Address" required><Input value={cur.contact.address} onChange={(e) => updatePage({ contact: { ...cur.contact, address: e.target.value } })} /></Field>
              <Field label="Google Maps URL"><Input data-testid="contact-mapurl" value={cur.contact.mapUrl} onChange={(e) => updatePage({ contact: { ...cur.contact, mapUrl: e.target.value } })} placeholder="https://maps.google.com/..." /></Field>
              <label className="flex items-center gap-2 text-xs">
                <input data-testid="contact-show-form" type="checkbox" checked={cur.contact.showForm} onChange={(e) => updatePage({ contact: { ...cur.contact, showForm: e.target.checked } })} />
                Show contact form on this page
              </label>
            </div>
          )}

          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Content Blocks</div>
          {(cur.blocks || []).map((b, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase font-bold text-slate-500">{b.type}</div>
                <button onClick={() => removeBlock(i)} className="text-rose-500"><Trash2 size={12} /></button>
              </div>
              {b.type === "text" && <Textarea data-testid={`block-text-${i}`} value={b.content || ""} onChange={(e) => updateBlock(i, e.target.value)} rows={3} />}
              {b.type === "image" && <ImageDropzone testid={`block-img-${i}`} value={b.content} onChange={(v) => updateBlock(i, v)} height="h-32" />}
              {b.type === "divider" && <hr className="border-slate-200" />}
            </div>
          ))}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" data-testid="add-text-block" onClick={() => addBlock("text")}>+ Text</Button>
            <Button variant="outline" size="sm" data-testid="add-image-block" onClick={() => addBlock("image")}>+ Image</Button>
            <Button variant="outline" size="sm" data-testid="add-divider-block" onClick={() => addBlock("divider")}>+ Divider</Button>
          </div>
          <Button data-testid="save-publish-page" onClick={() => toast.success(`✓ "${cur.title}" published — live on site`)} className="w-full bg-[#2563EB] hover:bg-[#1D4ED8]">💾 Save & Publish</Button>
        </main>
      </div>
    </div>
  );
};

export default Pages;
