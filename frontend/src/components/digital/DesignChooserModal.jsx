import React, { useState, useEffect } from "react";
import { ArrowLeft, X, Check } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { DESIGN_OPTIONS, WEB_DESIGN_OPTIONS } from "../../mocks/builderTemplates";
import PhonePreview from "./PhonePreview";
import BrowserPreview from "./BrowserPreview";

const DesignChooserModal = ({ template, type = "android", open, onClose, onContinue }) => {
  const options = type === "web" ? WEB_DESIGN_OPTIONS : DESIGN_OPTIONS;
  const [selected, setSelected] = useState(options[0].id);

  useEffect(() => {
    if (open) setSelected(options[0].id);
  }, [open, template?.id, options]);

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        data-testid="design-chooser-modal"
        className="max-w-5xl p-0 max-h-[92vh] overflow-hidden flex flex-col gap-0"
      >
        <DialogTitle className="sr-only">Choose Design for {template.name}</DialogTitle>
        <DialogDescription className="sr-only">Select a UI design that fits your vision</DialogDescription>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
          <button data-testid="design-back" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-md">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 text-center px-4">
            <div className="font-bold text-lg tracking-tight">Choose Design for {template.name}</div>
            <div className="text-xs text-slate-500">Select a UI design that fits your vision</div>
          </div>
          <button data-testid="design-close" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-md">
            <X size={18} />
          </button>
        </div>

        <div data-tour="design-picker" className="overflow-y-auto px-6 py-5 flex-1 bg-slate-50">
          <div className="space-y-4">
            {options.map((d) => {
              const isActive = selected === d.id;
              return (
                <button
                  key={d.id}
                  data-testid={`design-option-${d.id}`}
                  onClick={() => setSelected(d.id)}
                  className={`w-full text-left rounded-2xl border-2 transition-all flex flex-col sm:flex-row gap-5 p-5 bg-white ${
                    isActive ? "border-[#7c3aed] shadow-lg" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex-shrink-0 mx-auto sm:mx-0 w-full sm:w-72">
                    {type !== "android" ? (
                      <BrowserPreview design={d.id} mode="wireframe" url={`preview.orbit.app/${template.slug}`} />
                    ) : (
                      <PhonePreview design={d.id} color="#7c3aed" appName={template.name} icon={template.icon} size="sm" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className={`font-bold text-lg tracking-tight ${isActive ? "text-[#7c3aed]" : "text-slate-900"}`}>
                        {d.name}
                      </h3>
                      {isActive && (
                        <div className="w-7 h-7 rounded-full bg-[#7c3aed] flex items-center justify-center text-white">
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{d.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Screens</div>
                        <ul className="space-y-0.5">
                          {d.screens.map((s) => (
                            <li key={s} className="text-xs text-slate-600 flex items-start gap-1">
                              <span className="text-[#7c3aed]">•</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Components</div>
                        <ul className="space-y-0.5">
                          {d.components.map((c) => (
                            <li key={c} className="text-xs text-slate-600 flex items-start gap-1">
                              <span className="text-[#7c3aed]">•</span> {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {d.tags.map((t, i) => (
                        <span
                          key={t}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            i === 0 ? "bg-purple-100 text-purple-700" : i === 1 ? "bg-pink-100 text-pink-700" : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-white">
          <Button
            data-testid="design-continue"
            onClick={() => onContinue({ template, designId: selected })}
            className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
            size="lg"
          >
            Continue →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DesignChooserModal;
