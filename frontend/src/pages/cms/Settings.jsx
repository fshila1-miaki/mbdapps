import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Field, ImageDropzone } from "./_shared";
import { Check, X as XIcon, AlertTriangle, ExternalLink } from "lucide-react";

const Settings = () => {
  const { app, triggerSave } = useOutletContext();
  const { appContent, updateAppContent, updateMyApp, removeMyApp } = useApp();
  const info = appContent[app.id]?.storeInfo || {};
  const [tab, setTab] = useState("info");
  const [notif, setNotif] = useState({ email: "developer@orbit.com", sms: "+880 1700-000000", whatsapp: false, lowStock: 5, smsConfirm: true, doctorSms: true, reviewEmail: true });
  const [seo, setSeo] = useState({ customDomain: "", title: app.name, desc: "", keywords: "" });
  const [integ, setIntegs] = useState({ ssl: true, robi: true, ga: false, fb: false, whatsapp: false, push: false });
  const [deleteText, setDeleteText] = useState("");
  const navigate = useNavigate();

  const saveInfo = () => triggerSave(() => toast.success("✓ Store info updated — live on site"));
  const saveNotif = () => triggerSave(() => toast.success("✓ Notifications saved"));

  const tabs = [
    { key: "info", label: "Store Info" },
    { key: "notif", label: "Notifications" },
    { key: "seo", label: "Domain & SEO" },
    { key: "integ", label: "Integrations" },
    { key: "danger", label: "Danger Zone" },
  ];

  return (
    <div className="space-y-4" data-testid="cms-settings">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="flex items-center gap-1 flex-wrap border-b border-slate-200">
        {tabs.map((t) => <button key={t.key} onClick={() => setTab(t.key)} data-testid={`settings-tab-${t.key}`} className={`text-xs px-3 py-2 ${tab === t.key ? "border-b-2 border-rose-500 text-rose-700 font-bold" : "text-slate-600 hover:text-slate-900"}`}>{t.label}</button>)}
      </div>

      {tab === "info" && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 max-w-2xl">
          <Field label="Business Name"><Input data-testid="info-name" defaultValue={info.name} onChange={(e) => updateAppContent(app.id, "storeInfo", { ...info, name: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Phone"><Input data-testid="info-phone" defaultValue={info.phone} onChange={(e) => updateAppContent(app.id, "storeInfo", { ...info, phone: e.target.value })} /></Field>
            <Field label="Email"><Input data-testid="info-email" defaultValue={info.email} onChange={(e) => updateAppContent(app.id, "storeInfo", { ...info, email: e.target.value })} /></Field>
          </div>
          <Field label="Address"><Input defaultValue={info.address} onChange={(e) => updateAppContent(app.id, "storeInfo", { ...info, address: e.target.value })} /></Field>
          <Button data-testid="save-info" onClick={saveInfo} className="bg-[#e11d48]">💾 Save Changes</Button>
        </div>
      )}

      {tab === "notif" && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 max-w-2xl">
          <div>
            <div className="text-sm font-bold mb-2">New Order Notifications</div>
            <div className="space-y-2">
              <Field label="Email notify"><Input data-testid="notif-email" value={notif.email} onChange={(e) => setNotif({ ...notif, email: e.target.value })} /></Field>
              <Field label="SMS notify (via Orbit)"><Input data-testid="notif-sms" value={notif.sms} onChange={(e) => setNotif({ ...notif, sms: e.target.value })} /></Field>
              <label className="flex items-center gap-2 text-sm"><input data-testid="notif-whatsapp" type="checkbox" checked={notif.whatsapp} onChange={(e) => setNotif({ ...notif, whatsapp: e.target.checked })} /> WhatsApp notification (Add-On required)</label>
            </div>
          </div>
          <div>
            <div className="text-sm font-bold mb-2">Low Stock Alert</div>
            <Field label="Alert when stock below"><Input data-testid="notif-stock" type="number" value={notif.lowStock} onChange={(e) => setNotif({ ...notif, lowStock: Number(e.target.value) })} /></Field>
          </div>
          {app.kind === "health" && (
            <div>
              <div className="text-sm font-bold mb-2">Appointment Notifications</div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={notif.smsConfirm} onChange={(e) => setNotif({ ...notif, smsConfirm: e.target.checked })} /> Auto-send SMS confirmation to patient</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={notif.doctorSms} onChange={(e) => setNotif({ ...notif, doctorSms: e.target.checked })} /> Notify doctor via SMS</label>
            </div>
          )}
          <Button data-testid="save-notif" onClick={saveNotif} className="bg-[#e11d48]">💾 Save Notification Settings</Button>
        </div>
      )}

      {tab === "seo" && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 max-w-2xl">
          <Field label="Current Domain (read-only)">
            <Input value={`${app.slug}.orbit.app`} disabled className="bg-slate-50" />
          </Field>
          <Field label="Custom Domain">
            <div className="flex gap-2">
              <Input data-testid="custom-domain" value={seo.customDomain} onChange={(e) => setSeo({ ...seo, customDomain: e.target.value })} placeholder="www.yourdomain.com" />
              <Button data-testid="verify-domain" onClick={() => toast.success("DNS verification: Add CNAME → orbit.app (point to ns1.orbit.app)")} variant="outline">Verify Domain</Button>
            </div>
          </Field>
          <Field label="SEO Title"><Input data-testid="seo-title" value={seo.title} onChange={(e) => setSeo({ ...seo, title: e.target.value })} /></Field>
          <Field label="SEO Description"><Textarea data-testid="seo-desc" value={seo.desc} onChange={(e) => setSeo({ ...seo, desc: e.target.value })} maxLength={160} /></Field>
          <Field label="SEO Keywords"><Input data-testid="seo-keywords" value={seo.keywords} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })} placeholder="bangladesh,shopping,electronics" /></Field>
          <Field label="Favicon (16×16)"><ImageDropzone testid="seo-favicon" value={null} onChange={() => toast.success("Favicon uploaded")} height="h-20" /></Field>
          <Field label="Open Graph Image (1200×630)"><ImageDropzone testid="seo-og" value={null} onChange={() => toast.success("OG image uploaded")} height="h-24" /></Field>
          <Button data-testid="save-seo" onClick={() => triggerSave(() => toast.success("SEO settings saved"))} className="bg-[#e11d48]">💾 Save SEO</Button>
        </div>
      )}

      {tab === "integ" && (
        <div className="space-y-2 max-w-2xl">
          {[
            { key: "ssl", name: "SSL Commerz Gateway", desc: "Last transaction: 2 hrs ago", connected: integ.ssl },
            { key: "robi", name: "Robi Operator Billing", desc: "Charge users' Robi balance via CaaS", connected: integ.robi },
            { key: "ga", name: "Google Analytics", desc: "Track visitor behavior", connected: integ.ga },
            { key: "fb", name: "Facebook Pixel", desc: "Track conversions for FB ads", connected: integ.fb },
            { key: "whatsapp", name: "WhatsApp Business", desc: "Send order updates via WhatsApp (Add-On)", connected: integ.whatsapp, addon: true },
            { key: "push", name: "Push Notifications", desc: "Native push to your app (Add-On)", connected: integ.push, addon: true },
          ].map((i) => (
            <div key={i.key} data-testid={`integ-${i.key}`} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-sm flex items-center gap-2">
                  {i.connected ? <Check className="text-emerald-600" size={14} /> : <XIcon className="text-slate-400" size={14} />}
                  {i.name}
                  {i.addon && <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Add-On</span>}
                </div>
                <div className="text-xs text-slate-500">{i.desc}</div>
              </div>
              {i.connected ? (
                <Button variant="outline" size="sm" onClick={() => setIntegs({ ...integ, [i.key]: false })}>Disconnect</Button>
              ) : i.addon ? (
                <Button size="sm" onClick={() => navigate("/add-ons")} className="bg-amber-500 hover:bg-amber-600 gap-1 text-xs">Upgrade <ExternalLink size={11} /></Button>
              ) : (
                <Button size="sm" onClick={() => { setIntegs({ ...integ, [i.key]: true }); toast.success(`${i.name} connected`); }} className="bg-[#e11d48] gap-1 text-xs">Connect</Button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "danger" && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-3 max-w-2xl">
          <div className="text-sm font-bold text-rose-700 flex items-center gap-1"><AlertTriangle size={14} /> Danger Zone</div>
          <div className="border border-rose-200 rounded p-3 bg-white">
            <div className="font-bold">Unpublish App</div>
            <div className="text-xs text-slate-600 mb-2">Take your app offline temporarily</div>
            <Button data-testid="unpublish-app" variant="outline" onClick={() => { if (window.confirm("Unpublish app?")) { updateMyApp(app.id, { status: "Draft" }); toast.success("App unpublished"); } }} className="text-rose-600 border-rose-300">Unpublish</Button>
          </div>
          <div className="border border-rose-200 rounded p-3 bg-white">
            <div className="font-bold">Export All Data</div>
            <div className="text-xs text-slate-600 mb-2">Download ZIP with all products, orders, customers as CSV/JSON</div>
            <Button data-testid="export-all-data" onClick={() => toast.success("📦 Export started — you'll receive an email when ready")} className="bg-slate-700">Export Data</Button>
          </div>
          <div className="border border-rose-300 rounded p-3 bg-white">
            <div className="font-bold text-rose-700">Delete App Permanently</div>
            <div className="text-xs text-slate-600 mb-2">Type <b>{app.name}</b> to confirm</div>
            <Input data-testid="delete-confirm" value={deleteText} onChange={(e) => setDeleteText(e.target.value)} placeholder={app.name} className="mb-2" />
            <Button data-testid="delete-app" disabled={deleteText !== app.name} onClick={() => { removeMyApp(app.id); toast.success("App deleted"); navigate("/my-apps"); }} className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50">Delete App</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
