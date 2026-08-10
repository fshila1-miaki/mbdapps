import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { X, ArrowRight } from "lucide-react";
import OrbitWebPreview from "./interactive/WebPreviews";
import UniversalWebPreview from "./interactive/UniversalWebPreview";
import UniversalAndroidPreview from "./interactive/UniversalAndroidPreview";

const LivePreviewModal = ({ open, onClose, template, type, onUse }) => {
  if (!template) return null;
  const primary = template.palette?.primary || "#09090B";
  const accent = template.palette?.accent || "#2563EB";
  const cfg = {
    appName: template.name, tagline: template.description,
    primary, secondary: accent, accent: "#f59e0b",
    font: "Modern Sans", fontFamily: "Inter, system-ui, sans-serif",
    radius: 10, dark: false, language: "English",
    payment: { ssl: true, robi: type === "pro", cod: true, model: "proxy", platformFee: 2.5, caasAmount: 2 },
    store: {}, domain: { subdomain: template.slug || "app" },
  };
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent data-testid="live-preview-modal" className="!max-w-[90vw] w-[90vw] !p-0 max-h-[85vh] overflow-hidden flex flex-col gap-0">
        <DialogTitle className="sr-only">Live preview of {template.name}</DialogTitle>
        <DialogDescription className="sr-only">Interactive preview</DialogDescription>
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-white">
          <div>
            <div className="font-bold tracking-tight">{template.name}</div>
            <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
              <span>{template.category}</span>
              {(template.apis || []).map((a) => <span key={a} className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-semibold">{a}</span>)}
            </div>
          </div>
          <div className="flex gap-2">
            <Button data-testid="live-preview-use" onClick={() => { onUse?.(template); onClose(); }} className="bg-[#2563EB] hover:bg-[#1D4ED8]" size="sm">
              Use This Template <ArrowRight size={14} className="ml-1" />
            </Button>
            <button data-testid="live-preview-close" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-md"><X size={16} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-slate-50 p-5">
          {type === "pro" ? (
            <OrbitWebPreview templateId={template.id} appName={cfg.appName} tagline={cfg.tagline} primaryColor={primary} secondaryColor={accent} language="English" height="h-[65vh]" />
          ) : type === "web" ? (
            <UniversalWebPreview templateId={template.id} cfg={cfg} height="h-[65vh]" />
          ) : (
            <UniversalAndroidPreview templateId={template.id} cfg={cfg} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LivePreviewModal;
