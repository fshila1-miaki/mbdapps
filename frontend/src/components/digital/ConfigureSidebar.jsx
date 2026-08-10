import React, { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, Save, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { COLOR_PRESETS, FONT_PRESETS, APP_STORE_CATEGORIES } from "../../mocks/builderTemplates";

const Section = ({ title, children, defaultOpen = false, testid }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button data-testid={testid} onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50">
        <span className="text-xs uppercase tracking-widest font-bold text-slate-700">{title}</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
};

const ColorPick = ({ value, onChange, testid }) => (
  <div className="flex items-center gap-2 flex-wrap">
    {COLOR_PRESETS.map((c) => <button key={c.hex} type="button" data-testid={`${testid}-${c.name.toLowerCase()}`} onClick={() => onChange(c.hex)} className={`w-6 h-6 rounded-full ${value === c.hex ? "ring-2 ring-offset-2 ring-slate-900 scale-110" : "ring-1 ring-slate-200"}`} style={{ background: c.hex }}></button>)}
    <input type="color" data-testid={`${testid}-picker`} value={value} onChange={(e) => onChange(e.target.value)} className="w-7 h-7 rounded border border-slate-200 cursor-pointer" />
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="ml-1 w-20 h-7 text-[11px] font-mono border border-slate-200 rounded px-2" data-testid={`${testid}-hex`} />
  </div>
);

const ConfigureSidebar = ({ cfg, onChange, type, onGenerate, onSaveDraft, onBack, celebration }) => {
  const set = (k, v) => onChange({ ...cfg, [k]: v });
  const setPayment = (k, v) => onChange({ ...cfg, payment: { ...cfg.payment, [k]: v } });
  const setStore = (k, v) => onChange({ ...cfg, store: { ...cfg.store, [k]: v } });
  const setDomain = (k, v) => onChange({ ...cfg, domain: { ...cfg.domain, [k]: v } });

  return (
    <div data-testid="configure-sidebar" className="bg-white border border-slate-200 rounded-2xl overflow-hidden h-fit sticky top-4">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
        <div className="text-xs uppercase tracking-widest font-bold text-slate-700">Configure</div>
        <div className="text-[10px] text-slate-500">Real-time preview updates</div>
      </div>

      <Section title="🎨 Brand" defaultOpen testid="cfg-section-brand">
        <div>
          <Label className="text-[11px]">App Name</Label>
          <Input data-testid="cfg-app-name" value={cfg.appName} onChange={(e) => set("appName", e.target.value)} className="mt-1 text-sm" />
        </div>
        <div>
          <Label className="text-[11px]">Tagline</Label>
          <Input data-testid="cfg-tagline" value={cfg.tagline} onChange={(e) => set("tagline", e.target.value)} className="mt-1 text-sm" />
        </div>
        <div>
          <Label className="text-[11px]">Primary Color</Label>
          <ColorPick value={cfg.primary} onChange={(v) => set("primary", v)} testid="cfg-primary" />
        </div>
        <div>
          <Label className="text-[11px]">Secondary Color</Label>
          <ColorPick value={cfg.secondary} onChange={(v) => set("secondary", v)} testid="cfg-secondary" />
        </div>
        <div>
          <Label className="text-[11px]">Accent Color</Label>
          <ColorPick value={cfg.accent} onChange={(v) => set("accent", v)} testid="cfg-accent" />
        </div>
        <div>
          <Label className="text-[11px]">Font Style</Label>
          <Select value={cfg.font} onValueChange={(v) => set("font", v)}>
            <SelectTrigger data-testid="cfg-font"><SelectValue /></SelectTrigger>
            <SelectContent>{FONT_PRESETS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </Section>

      <Section title="📐 Layout" defaultOpen testid="cfg-section-layout">
        <div>
          <Label className="text-[11px]">Corner Radius: {cfg.radius}px</Label>
          <input data-testid="cfg-radius" type="range" min="0" max="20" value={cfg.radius} onChange={(e) => set("radius", parseInt(e.target.value, 10))} className="w-full" />
        </div>
        <div className="flex items-center justify-between"><Label className="text-[11px] cursor-pointer">Dark Mode</Label><Switch data-testid="cfg-dark" checked={!!cfg.dark} onCheckedChange={(c) => set("dark", c)} /></div>
        <div>
          <Label className="text-[11px]">Navbar Style</Label>
          <Select value={cfg.navStyle || "Sticky"} onValueChange={(v) => set("navStyle", v)}>
            <SelectTrigger data-testid="cfg-nav"><SelectValue /></SelectTrigger>
            <SelectContent>{["Sticky", "Fixed", "Static"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </Section>

      <Section title="💳 Payments" testid="cfg-section-pay" defaultOpen>
        <div className="flex items-center justify-between"><Label className="text-[11px]">SSL Commerz Gateway</Label><Switch data-testid="cfg-pay-ssl" checked={!!cfg.payment?.ssl} onCheckedChange={(c) => setPayment("ssl", c)} /></div>
        <div className="flex items-center justify-between"><Label className="text-[11px]">Robi Operator Billing</Label><Switch data-testid="cfg-pay-robi" checked={!!cfg.payment?.robi} onCheckedChange={(c) => setPayment("robi", c)} /></div>
        <div className="flex items-center justify-between"><Label className="text-[11px]">Cash on Delivery</Label><Switch data-testid="cfg-pay-cod" checked={!!cfg.payment?.cod} onCheckedChange={(c) => setPayment("cod", c)} /></div>

        {cfg.payment?.ssl && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
            <div className="text-[10px] uppercase tracking-widest font-bold text-amber-700">Integration Model</div>
            <label className={`block border-2 rounded-md p-2 cursor-pointer ${cfg.payment?.model === "proxy" ? "border-amber-500 bg-amber-50" : "border-slate-200"}`}>
              <input type="radio" name="model" data-testid="cfg-model-proxy" checked={cfg.payment?.model === "proxy"} onChange={() => setPayment("model", "proxy")} className="hidden" />
              <div className="text-xs font-bold">◉ Proxy Model <span className="text-[9px] text-emerald-700 bg-emerald-100 px-1.5 rounded">Recommended</span></div>
              <div className="text-[10px] text-slate-500 mt-0.5">Payments route through YOUR backend. Earn a platform fee on every transaction.</div>
            </label>
            <label className={`block border-2 rounded-md p-2 cursor-pointer ${cfg.payment?.model === "direct" ? "border-amber-500 bg-amber-50" : "border-slate-200"}`}>
              <input type="radio" name="model" data-testid="cfg-model-direct" checked={cfg.payment?.model === "direct"} onChange={() => setPayment("model", "direct")} className="hidden" />
              <div className="text-xs font-bold">◯ Direct Model</div>
              <div className="text-[10px] text-slate-500 mt-0.5">User → SSL Commerz directly. Simpler, no platform fee.</div>
            </label>
            {cfg.payment?.model === "proxy" && (
              <>
                <div><Label className="text-[10px]">SSL Store ID</Label><Input data-testid="cfg-ssl-id" value={cfg.payment?.storeId || ""} onChange={(e) => setPayment("storeId", e.target.value)} placeholder="bdapps_test" className="h-7 text-xs" /></div>
                <div><Label className="text-[10px]">Platform Fee %</Label><Input data-testid="cfg-platform-fee" type="number" min="0" max="15" value={cfg.payment?.platformFee || 2.5} onChange={(e) => setPayment("platformFee", parseFloat(e.target.value) || 0)} className="h-7 text-xs" /></div>
                <div className="text-[10px] bg-amber-50 border border-amber-200 rounded p-2 text-amber-800">💰 You earn BDT {Math.round(1000 * ((cfg.payment?.platformFee || 2.5) / 100))} per BDT 1,000 transaction</div>
                <div className="text-[10px] font-bold text-slate-700">Supported Methods</div>
                <div className="grid grid-cols-2 gap-1 text-[10px]">{["VISA/MC", "bKash", "Nagad", "Rocket", "DBBL MFS", "Robi Cash"].map((m) => <label key={m} className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="w-3 h-3" /> {m}</label>)}</div>
                <div className="bg-white rounded-md border border-slate-200 p-2">
                  <div className="text-[10px] font-bold mb-1.5">Payment Flow</div>
                  <div className="flex items-center justify-between gap-1 text-[9px] text-center">
                    <div className="flex-1 bg-slate-100 rounded p-1">User<br/>৳1,000</div>
                    <span>→</span>
                    <div className="flex-1 bg-amber-100 rounded p-1">Platform<br/>{cfg.payment?.platformFee || 2.5}% fee</div>
                    <span>→</span>
                    <div className="flex-1 bg-blue-100 rounded p-1">SSL<br/>Commerz</div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {cfg.payment?.robi && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 space-y-2">
            <div className="text-[10px] uppercase tracking-widest font-bold text-rose-700">Robi Billing</div>
            <div>
              <Label className="text-[10px]">Charging Amount (BDT)</Label>
              <Input data-testid="cfg-caas-amt" type="number" value={cfg.payment?.caasAmount || 2} onChange={(e) => setPayment("caasAmount", parseFloat(e.target.value))} className="h-7 text-xs" />
            </div>
          </div>
        )}
      </Section>

      {type === "android" && (
        <Section title="📱 Orbit App Store" defaultOpen testid="cfg-section-store">
          <div className="flex items-center justify-between"><Label className="text-[11px]">Publish to Orbit Store</Label><Switch data-testid="cfg-publish" checked={cfg.store?.publish ?? true} onCheckedChange={(c) => setStore("publish", c)} /></div>
          {(cfg.store?.publish ?? true) && (
            <>
              <div><Label className="text-[10px]">Store Category</Label>
                <Select value={cfg.store?.category || APP_STORE_CATEGORIES[0]} onValueChange={(v) => setStore("category", v)}>
                  <SelectTrigger data-testid="cfg-store-cat"><SelectValue /></SelectTrigger>
                  <SelectContent>{APP_STORE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-[10px]">Short Description (80 chars)</Label><Textarea data-testid="cfg-store-short" maxLength={80} value={cfg.store?.shortDesc || ""} onChange={(e) => setStore("shortDesc", e.target.value)} className="text-xs h-12" /></div>
              <div><Label className="text-[10px]">Full Description (500 chars)</Label><Textarea data-testid="cfg-store-long" maxLength={500} value={cfg.store?.longDesc || ""} onChange={(e) => setStore("longDesc", e.target.value)} className="text-xs h-16" /></div>
              <div className="flex items-center justify-between"><Label className="text-[10px]">APK Auto-submit</Label><Switch data-testid="cfg-auto-submit" checked={cfg.store?.autoSubmit ?? true} onCheckedChange={(c) => setStore("autoSubmit", c)} /></div>
              <div className="text-[10px] bg-slate-50 border border-slate-200 rounded p-2 text-slate-600">After generation, your APK appears in <b>Admin Provisioning → Build Files</b> with <b>Pending Approval</b> status.</div>
            </>
          )}
        </Section>
      )}

      {type === "web" && (
        <Section title="🌐 Domain & Hosting" testid="cfg-section-domain" defaultOpen>
          <div>
            <Label className="text-[10px]">Subdomain</Label>
            <div className="flex items-center gap-1">
              <Input data-testid="cfg-subdomain" value={cfg.domain?.subdomain || ""} onChange={(e) => setDomain("subdomain", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="my-store" className="h-7 text-xs" />
              <span className="text-[10px] text-slate-500">.orbit.app</span>
            </div>
            <div className="text-[10px] text-emerald-700 mt-1">Preview: <b>{cfg.domain?.subdomain || "my-app"}.orbit.app</b></div>
          </div>
          <div><Label className="text-[10px]">Custom Domain (Optional)</Label><Input data-testid="cfg-custom-domain" value={cfg.domain?.custom || ""} onChange={(e) => setDomain("custom", e.target.value)} placeholder="www.mystore.com.bd" className="h-7 text-xs" /></div>
          <div className="text-[10px] text-emerald-700">✓ SSL Certificate included free</div>
        </Section>
      )}

      <div className="p-4 space-y-2 bg-slate-50">
        <Button data-testid="cfg-generate" onClick={onGenerate} className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] font-bold gap-2"><Sparkles size={14} /> Generate & Launch</Button>
        <Button data-testid="cfg-save-draft" variant="outline" onClick={onSaveDraft} className="w-full gap-2"><Save size={13} /> Save Draft</Button>
        {onBack && <button data-testid="cfg-back" onClick={onBack} className="w-full text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 justify-center pt-1"><ArrowLeft size={12} /> Back to Customize</button>}
      </div>
    </div>
  );
};

export default ConfigureSidebar;
