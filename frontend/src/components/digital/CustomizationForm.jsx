import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { TEMPLATE_PAGES, TEMPLATE_FEATURES } from "../../mocks/builderTemplates";

const Req = () => <span className="text-rose-500"> *</span>;

const Section = ({ title, children }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5">
    <div className="text-xs uppercase tracking-widest font-bold text-slate-700 mb-3">{title}</div>
    <div className="space-y-3">{children}</div>
  </div>
);

const CustomizationForm = ({ template, type, onSubmit, onBack }) => {
  const initialPages = TEMPLATE_PAGES[template.id] || ["Home"];
  const initialFeatures = TEMPLATE_FEATURES[template.id] || [];
  const [v, setV] = useState({
    name: template.name,
    tagline: template.description.slice(0, 80),
    category: template.category,
    audience: "",
    language: "English",
    pages: initialPages,
    features: initialFeatures.slice(0, 2),
    authMethods: ["Email & Password", "Phone OTP"],
  });
  const upd = (k, val) => setV((p) => ({ ...p, [k]: val }));
  const togglePage = (p) => setV((s) => ({ ...s, pages: s.pages.includes(p) ? s.pages.filter((x) => x !== p) : [...s.pages, p] }));
  const toggleFeature = (f) => setV((s) => ({ ...s, features: s.features.includes(f) ? s.features.filter((x) => x !== f) : [...s.features, f] }));
  const toggleAuth = (a) => setV((s) => ({ ...s, authMethods: s.authMethods.includes(a) ? s.authMethods.filter((x) => x !== a) : [...s.authMethods, a] }));
  const valid = v.name.trim() && v.category;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Section title="Identity">
        <div>
          <Label className="text-xs">App Name<Req /></Label>
          <Input data-testid="cust-name" value={v.name} onChange={(e) => upd("name", e.target.value)} className="mt-1 text-base font-semibold" />
        </div>
        <div>
          <Label className="text-xs">Tagline (Optional)</Label>
          <Input data-testid="cust-tagline" value={v.tagline} onChange={(e) => upd("tagline", e.target.value)} className="mt-1" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Category<Req /></Label>
            <Input value={v.category} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label className="text-xs">Target Audience (Optional)</Label>
            <Input data-testid="cust-audience" value={v.audience} onChange={(e) => upd("audience", e.target.value)} placeholder="e.g. Young professionals in Dhaka" className="mt-1" />
          </div>
        </div>
        <div>
          <Label className="text-xs">Language<Req /></Label>
          <Select value={v.language} onValueChange={(val) => upd("language", val)}>
            <SelectTrigger data-testid="cust-language"><SelectValue /></SelectTrigger>
            <SelectContent>{["English", "Bengali", "Both"].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </Section>

      {initialPages.length > 0 && (
        <Section title="Pages to Include">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {initialPages.map((p) => (
              <label key={p} data-testid={`cust-page-${p.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="flex items-center gap-2 bg-slate-50 rounded-md p-2 cursor-pointer">
                <input type="checkbox" checked={v.pages.includes(p)} onChange={() => togglePage(p)} className="accent-[#2563EB]" />
                <span className="text-sm">{p}</span>
              </label>
            ))}
          </div>
        </Section>
      )}

      {initialFeatures.length > 0 && (
        <Section title="Features">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {initialFeatures.map((f) => (
              <label key={f} data-testid={`cust-feature-${f.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="flex items-center gap-2 bg-slate-50 rounded-md p-2 cursor-pointer">
                <input type="checkbox" checked={v.features.includes(f)} onChange={() => toggleFeature(f)} className="accent-[#2563EB]" />
                <span className="text-sm">Enable {f}</span>
              </label>
            ))}
          </div>
        </Section>
      )}

      <Section title="User Authentication">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {["Email & Password", "Phone OTP", "Google Sign-In", "Facebook Login"].map((a) => (
            <label key={a} data-testid={`cust-auth-${a.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="flex items-center gap-2 bg-slate-50 rounded-md p-2 cursor-pointer">
              <input type="checkbox" checked={v.authMethods.includes(a)} onChange={() => toggleAuth(a)} className="accent-[#2563EB]" />
              <span className="text-sm">{a}</span>
            </label>
          ))}
        </div>
      </Section>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onBack} data-testid="cust-back">← Back</Button>
        <Button data-testid="cust-preview" disabled={!valid} onClick={() => onSubmit(v)} className="bg-[#2563EB] hover:bg-[#1D4ED8] font-bold px-8">Preview My App →</Button>
      </div>
    </div>
  );
};

export default CustomizationForm;
