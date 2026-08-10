import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import { Th, Td, SlidePanel, Field, Input, Button, ImageDropzone } from "./_shared";
import { Plus, Trash2, Pencil } from "lucide-react";

const SPECIALTIES = ["Cardiology","Pediatrics","Dermatology","Neurology","Orthopedics","Gynecology","ENT","Psychiatry","General Medicine"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const Doctors = () => {
  const { app, triggerSave } = useOutletContext();
  const { appContent, updateAppContent, addCmsActivity } = useApp();
  const doctors = appContent[app.id]?.doctors || [];
  const [editing, setEditing] = useState(null);

  const save = (data) => {
    const updated = data.id ? doctors.map((d) => d.id === data.id ? data : d) : [...doctors, { ...data, id: `doc-${Math.random().toString(36).slice(2, 8)}` }];
    triggerSave(() => {
      updateAppContent(app.id, "doctors", updated);
      addCmsActivity(app.id, { type: "doctor", text: `👨‍⚕️ ${data.id ? "Updated" : "Added"} doctor: ${data.name}` });
      setEditing(null);
      toast.success(`✓ ${data.name} saved — live on site`);
    });
  };
  const del = (d) => { if (window.confirm(`Remove ${d.name}?`)) triggerSave(() => updateAppContent(app.id, "doctors", doctors.filter((x) => x.id !== d.id))); };

  return (
    <div className="space-y-4" data-testid="cms-doctors">
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div><h1 className="text-2xl font-bold">Doctors ({doctors.length})</h1><p className="text-xs text-slate-500">Manage your clinic's medical team</p></div>
        <Button data-testid="add-doctor" onClick={() => setEditing({ days: [], slot: 30, status: "Active" })} className="bg-[#2563EB] hover:bg-[#1D4ED8] gap-1"><Plus size={14} /> Add Doctor</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {doctors.map((d) => (
          <div key={d.id} data-testid={`doctor-card-${d.id}`} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0" style={{ background: d.image ? `url(${d.image}) center/cover` : `linear-gradient(135deg, ${app.color}, #f59e0b)` }}>
              {!d.image && <div className="w-full h-full flex items-center justify-center text-white font-bold">{d.name?.[0] || "D"}</div>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate">{d.name}</div>
              <div className="text-xs text-slate-500">{d.specialty}</div>
              <div className="text-[11px] text-slate-600 mt-1">{d.qualification} · {d.experience} yrs</div>
              <div className="text-xs font-bold mt-1" style={{ color: app.color }}>৳{d.fee}</div>
              <div className="flex items-center gap-1 mt-1 flex-wrap">{(d.days || []).map((day) => <span key={day} className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">{day}</span>)}</div>
            </div>
            <div className="flex flex-col gap-1">
              <button data-testid={`edit-doctor-${d.id}`} onClick={() => setEditing(d)} className="p-1.5 hover:bg-slate-100 rounded"><Pencil size={13} /></button>
              <button data-testid={`del-doctor-${d.id}`} onClick={() => del(d)} className="p-1.5 hover:bg-rose-50 rounded text-rose-600"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      <SlidePanel open={!!editing} onClose={() => setEditing(null)} title={`${editing?.id ? "Edit" : "Add"} Doctor`} description="Changes go live immediately"
        footer={<Button data-testid="save-doctor" onClick={() => save(editing)} className="w-full bg-[#2563EB]">💾 Save Doctor</Button>}>
        {editing && <>
          <Field label="Photo"><ImageDropzone testid="doc-image" value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} height="h-32" label="Drop profile photo" /></Field>
          <Field label="Full Name" required><Input data-testid="doc-name" value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
          <Field label="Specialty" required>
            <select data-testid="doc-specialty" value={editing.specialty || ""} onChange={(e) => setEditing({ ...editing, specialty: e.target.value })} className="w-full border border-slate-200 rounded h-9 text-sm px-2">
              <option value="">Select...</option>
              {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Qualification" required><Input data-testid="doc-qual" value={editing.qualification || ""} onChange={(e) => setEditing({ ...editing, qualification: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Years Experience" required><Input data-testid="doc-exp" type="number" value={editing.experience || ""} onChange={(e) => setEditing({ ...editing, experience: Number(e.target.value) })} /></Field>
            <Field label="Fee (BDT)" required><Input data-testid="doc-fee" type="number" value={editing.fee || ""} onChange={(e) => setEditing({ ...editing, fee: Number(e.target.value) })} /></Field>
          </div>
          <Field label="Available Days">
            <div className="flex gap-1 flex-wrap" data-testid="doc-days">
              {DAYS.map((d) => {
                const on = editing.days?.includes(d);
                return <button key={d} type="button" onClick={() => setEditing({ ...editing, days: on ? editing.days.filter((x) => x !== d) : [...(editing.days || []), d] })}
                  className={`text-xs px-2 py-1 rounded ${on ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-700"}`}>{d}</button>;
              })}
            </div>
          </Field>
          <div className="grid grid-cols-3 gap-2">
            <Field label="From"><Input data-testid="doc-from" type="time" value={editing.from || ""} onChange={(e) => setEditing({ ...editing, from: e.target.value })} /></Field>
            <Field label="To"><Input data-testid="doc-to" type="time" value={editing.to || ""} onChange={(e) => setEditing({ ...editing, to: e.target.value })} /></Field>
            <Field label="Slot (min)">
              <select data-testid="doc-slot" value={editing.slot || 30} onChange={(e) => setEditing({ ...editing, slot: Number(e.target.value) })} className="w-full border border-slate-200 rounded h-9 text-sm px-2">
                {[15,20,30,45,60].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Status">
            <select data-testid="doc-status" value={editing.status || "Active"} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="w-full border border-slate-200 rounded h-9 text-sm px-2">
              <option>Active</option><option>On Leave</option>
            </select>
          </Field>
        </>}
      </SlidePanel>
    </div>
  );
};

export default Doctors;
