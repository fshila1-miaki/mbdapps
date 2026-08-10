// Generic CMS section for collections — reused for properties, courses, packages, campaigns, pricing, etc.
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { SlidePanel, Field, Input, Textarea, Button, ImageDropzone } from "./_shared";

const SCHEMAS = {
  courses: {
    sectionKey: "courses", label: "Course", titleField: "title", priceField: "price",
    fields: [
      { key: "thumb", type: "image", label: "Thumbnail (16:9)", height: "h-36" },
      { key: "title", label: "Course Title", required: true },
      { key: "category", label: "Category" },
      { key: "instructor", label: "Instructor", required: true },
      { key: "desc", type: "textarea", label: "Short Description", required: true, max: 150 },
      { key: "price", label: "Price (BDT)", type: "number", prefix: "৳", required: true },
      { key: "originalPrice", label: "Original Price (BDT)", type: "number", prefix: "৳", optional: true },
      { key: "duration", label: "Duration", required: true, placeholder: "24 hours (48 lectures)" },
      { key: "level", label: "Level", type: "select", options: ["Beginner","Intermediate","Advanced","All Levels"] },
      { key: "status", label: "Status", type: "select", options: ["Active","Draft","Coming Soon"] },
    ],
  },
  instructors: {
    sectionKey: "instructors", label: "Instructor", titleField: "name",
    fields: [
      { key: "image", type: "image", label: "Photo" },
      { key: "name", label: "Name", required: true },
      { key: "title", label: "Subject / Title" },
    ],
  },
  properties: {
    sectionKey: "properties", label: "Property", titleField: "title", priceField: "price",
    fields: [
      { key: "image", type: "image", label: "Primary Photo", height: "h-36" },
      { key: "title", label: "Title", required: true },
      { key: "type", label: "Type", type: "select", options: ["Apartment","House","Commercial","Land","Office","Shop"], required: true },
      { key: "listingType", label: "Listing Type", type: "select", options: ["For Sale","For Rent"] },
      { key: "price", label: "Price (BDT)", type: "number", prefix: "৳", required: true },
      { key: "area", label: "Area (sqft)", type: "number", required: true },
      { key: "bedrooms", label: "Bedrooms", type: "number" },
      { key: "bathrooms", label: "Bathrooms", type: "number" },
      { key: "location", label: "Location" },
      { key: "address", label: "Address", required: true },
      { key: "desc", type: "textarea", label: "Description", required: true, max: 200 },
      { key: "status", label: "Status", type: "select", options: ["Active","Sold","Rented","Draft"] },
    ],
  },
  agents: {
    sectionKey: "agents", label: "Agent", titleField: "name",
    fields: [
      { key: "image", type: "image", label: "Photo" },
      { key: "name", label: "Name", required: true },
      { key: "phone", label: "Phone" },
    ],
  },
  leads: {
    sectionKey: "leads", label: "Inquiry", titleField: "name", noEditor: true,
    columns: [{ key: "name", label: "Name" }, { key: "phone", label: "Phone" }, { key: "message", label: "Message" }, { key: "date", label: "Date" }],
  },
  packages: {
    sectionKey: "packages", label: "Tour Package", titleField: "name", priceField: "price",
    fields: [
      { key: "image", type: "image", label: "Cover Image", height: "h-36" },
      { key: "name", label: "Package Name", required: true },
      { key: "destination", label: "Destination", required: true },
      { key: "days", label: "Days", type: "number", required: true },
      { key: "nights", label: "Nights", type: "number", required: true },
      { key: "price", label: "Price Per Person (BDT)", type: "number", prefix: "৳", required: true },
      { key: "category", label: "Category", type: "select", options: ["Beach","Hill","Heritage","City","Adventure","Religious"] },
      { key: "status", label: "Status", type: "select", options: ["Active","Draft","Sold Out"] },
    ],
  },
  destinations: {
    sectionKey: "destinations", label: "Destination", titleField: "name",
    fields: [{ key: "name", label: "Destination Name", required: true }],
  },
  campaigns: {
    sectionKey: "campaigns", label: "Campaign", titleField: "title",
    fields: [
      { key: "image", type: "image", label: "Campaign Image", height: "h-36" },
      { key: "title", label: "Title", required: true },
      { key: "desc", type: "textarea", label: "Description", required: true, max: 200 },
      { key: "goal", label: "Goal Amount (BDT)", type: "number", prefix: "৳", required: true },
      { key: "raised", label: "Raised Amount (BDT)", type: "number", prefix: "৳" },
      { key: "urgent", label: "Mark as Urgent", type: "checkbox" },
      { key: "status", label: "Status", type: "select", options: ["Active","Completed","Paused"] },
    ],
  },
  team: {
    sectionKey: "team", label: "Team Member", titleField: "name",
    fields: [
      { key: "image", type: "image", label: "Photo" },
      { key: "name", label: "Name", required: true },
      { key: "role", label: "Role" },
    ],
  },
  pricing: {
    sectionKey: "pricing", label: "Pricing Plan", titleField: "name", priceField: "price",
    fields: [
      { key: "name", label: "Plan Name", required: true },
      { key: "price", label: "Price (BDT)", type: "number", prefix: "৳", required: true },
      { key: "period", label: "Period", type: "select", options: ["month","year","one-time"] },
    ],
  },
  students: {
    sectionKey: "students", label: "Student", titleField: "name", noEditor: true,
    columns: [{ key: "name", label: "Student" }, { key: "enrolled", label: "Enrolled" }, { key: "progress", label: "Progress" }],
  },
};

const GenericSection = ({ sectionParam }) => {
  const { app, triggerSave } = useOutletContext();
  const { appContent, updateAppContent, addCmsActivity } = useApp();
  const [editing, setEditing] = useState(null);
  const schema = SCHEMAS[sectionParam];
  if (!schema) return <div className="text-slate-400 text-sm">Unsupported section</div>;

  const items = (appContent[app.id]?.[schema.sectionKey] || []);

  if (schema.noEditor) {
    // Show table of sampled data
    const mockData = sectionParam === "leads" ? [
      { name: "Karim Ahmed", phone: "+880 1700-111", message: "Interested in property #1", date: "2026-02-12" },
      { name: "Sadia Khan", phone: "+880 1711-222", message: "Need site visit", date: "2026-02-13" },
    ] : sectionParam === "students" ? [
      { name: "Sajib Hossain", enrolled: "2026-01-10", progress: "60%" },
      { name: "Mim Akter", enrolled: "2026-01-15", progress: "85%" },
    ] : items;
    return (
      <div className="space-y-3" data-testid={`cms-${sectionParam}`}>
        <h1 className="text-2xl font-bold">{schema.label}s ({mockData.length})</h1>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50"><tr>{schema.columns.map((c) => <th key={c.key} className="text-left text-[10px] uppercase tracking-widest font-bold text-slate-500 px-3 py-2 border-b border-slate-200">{c.label}</th>)}</tr></thead>
            <tbody>{mockData.map((row, i) => <tr key={i}>{schema.columns.map((c) => <td key={c.key} className="px-3 py-2 text-sm border-b border-slate-100">{row[c.key]}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
    );
  }

  const save = (data) => {
    const updated = data.id ? items.map((i) => i.id === data.id ? data : i) : [...items, { ...data, id: `${schema.sectionKey}-${Math.random().toString(36).slice(2, 8)}` }];
    triggerSave(() => {
      updateAppContent(app.id, schema.sectionKey, updated);
      addCmsActivity(app.id, { type: schema.sectionKey, text: `✏ ${data.id ? "Updated" : "Added"} ${schema.label}: ${data[schema.titleField]}` });
      setEditing(null);
      toast.success(`✓ ${data[schema.titleField]} saved — live on site`);
    });
  };
  const del = (it) => { if (window.confirm(`Delete ${it[schema.titleField]}?`)) triggerSave(() => updateAppContent(app.id, schema.sectionKey, items.filter((x) => x.id !== it.id))); };

  return (
    <div className="space-y-4" data-testid={`cms-${sectionParam}`}>
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div><h1 className="text-2xl font-bold">{schema.label}s ({items.length})</h1></div>
        <Button data-testid={`add-${sectionParam}`} onClick={() => setEditing({})} className="bg-[#2563EB] hover:bg-[#1D4ED8] gap-1"><Plus size={14} /> Add {schema.label}</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.length === 0 && <div className="col-span-full bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-400">No {schema.label.toLowerCase()}s yet</div>}
        {items.map((it) => (
          <div key={it.id} data-testid={`${sectionParam}-card-${it.id}`} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {it.image && <div className="h-28" style={{ background: `url(${it.image}) center/cover` }} />}
            {it.thumb && <div className="h-28" style={{ background: `url(${it.thumb}) center/cover` }} />}
            <div className="p-3">
              <div className="font-bold truncate">{it[schema.titleField]}</div>
              {it.desc && <div className="text-xs text-slate-500 line-clamp-2 mt-1">{it.desc}</div>}
              {schema.priceField && it[schema.priceField] !== undefined && <div className="text-sm font-bold mt-1" style={{ color: app.color }}>৳{it[schema.priceField]}</div>}
              {it.goal !== undefined && (
                <div className="mt-2">
                  <div className="h-1 bg-slate-200 rounded-full overflow-hidden"><div className="h-full" style={{ width: `${Math.min(100, (it.raised || 0) / it.goal * 100)}%`, background: app.color }} /></div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1"><span style={{ color: app.color }}>৳{it.raised || 0}</span><span>of ৳{it.goal}</span></div>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between">
                {it.status && <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">{it.status}</span>}
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditing(it)} data-testid={`edit-${sectionParam}-${it.id}`} className="p-1.5 hover:bg-slate-100 rounded"><Pencil size={13} /></button>
                  <button onClick={() => del(it)} data-testid={`del-${sectionParam}-${it.id}`} className="p-1.5 hover:bg-rose-50 rounded text-rose-600"><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SlidePanel open={!!editing} onClose={() => setEditing(null)} title={`${editing?.id ? "Edit" : "Add"} ${schema.label}`} description="Changes go live immediately"
        footer={<Button data-testid={`save-${sectionParam}`} onClick={() => save(editing)} className="w-full bg-[#2563EB]">💾 Save Changes</Button>}>
        {editing && schema.fields.map((f) => {
          if (f.type === "image") return <Field key={f.key} label={f.label}><ImageDropzone testid={`${sectionParam}-${f.key}`} value={editing[f.key]} onChange={(v) => setEditing({ ...editing, [f.key]: v })} height={f.height || "h-28"} /></Field>;
          if (f.type === "textarea") return <Field key={f.key} label={f.label} required={f.required} optional={f.optional}><Textarea data-testid={`${sectionParam}-${f.key}`} value={editing[f.key] || ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} maxLength={f.max} rows={3} /></Field>;
          if (f.type === "select") return <Field key={f.key} label={f.label} required={f.required}><select data-testid={`${sectionParam}-${f.key}`} value={editing[f.key] || ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} className="w-full border border-slate-200 rounded h-9 text-sm px-2"><option value="">Select...</option>{f.options.map((o) => <option key={o}>{o}</option>)}</select></Field>;
          if (f.type === "checkbox") return <label key={f.key} className="flex items-center gap-2 text-sm"><input type="checkbox" data-testid={`${sectionParam}-${f.key}`} checked={editing[f.key] || false} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.checked })} /> {f.label}</label>;
          return <Field key={f.key} label={f.label} required={f.required} optional={f.optional}><Input data-testid={`${sectionParam}-${f.key}`} type={f.type || "text"} value={editing[f.key] ?? ""} onChange={(e) => setEditing({ ...editing, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })} placeholder={f.placeholder} /></Field>;
        })}
      </SlidePanel>
    </div>
  );
};

export default GenericSection;
