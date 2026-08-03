import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Sparkles, Zap, Globe, Smartphone, PlayCircle, ArrowRight, Check } from "lucide-react";
import MyGeneratedAppsShelf from "../components/digital/MyGeneratedAppsShelf";
import TemplateGallery from "../components/digital/TemplateGallery";
import DesignChooserModal from "../components/digital/DesignChooserModal";
import AppBuilder from "../components/digital/AppBuilder";
import CustomizationForm from "../components/digital/CustomizationForm";
import ContentManager from "../components/digital/ContentManager";
import LivePreviewModal from "../components/digital/LivePreviewModal";
import DemoTour from "../components/digital/DemoTour";
import { PRO_TEMPLATES, WEB_TEMPLATES, ANDROID_TEMPLATES, ALL_CATEGORIES_PRO, ALL_CATEGORIES_WEB, ALL_CATEGORIES_ANDROID } from "../mocks/builderTemplates";

const AiComposeBar = () => {
  const [value, setValue] = useState("");
  return (
    <div className="ai-compose-bar flex items-center gap-3 px-5 py-3.5 rounded-xl mt-2"
      style={{ background: "var(--surface)", border: "1px solid var(--c-border)" }} data-testid="ai-compose-bar">
      <div className="ai-indicator w-7 h-7 rounded-full flex items-center justify-center shrink-0">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--on-primary)" }} />
      </div>
      <input
        data-testid="ai-compose-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Describe the app you want to build..."
        className="flex-1 bg-transparent border-0 outline-none text-sm"
        style={{ color: "var(--text)" }}
      />
      <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shrink-0"
        style={{ color: "var(--ai)", border: "1px solid var(--ai)" }}>Listening</span>
    </div>
  );
};

const Digital = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const TAB_META = {
    web:     { icon: "🌐", label: t("digital.webBuilder"),     tagline: t("digital.webHeader") },
    android: { icon: "📱", label: t("digital.androidBuilder"), tagline: t("digital.androidHeader") },
  };
  const STEP_LABELS = [t("digital.step1"), t("digital.step2"), t("digital.step3"), t("digital.step4"), t("digital.step5")];
  const [tab, setTab] = useState("web");
  // Flow state: null = gallery, otherwise { template, type, designId?, customization?, content? }
  const [chooser, setChooser] = useState(null);
  const [customizing, setCustomizing] = useState(null);
  const [contentStep, setContentStep] = useState(null);
  const [builderState, setBuilderState] = useState(null);
  const [livePreview, setLivePreview] = useState(null);
  const [tourOpen, setTourOpen] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(localStorage.getItem("bdapps-digital-welcomed") ? -1 : 0);

  // current creation step (0..4) — null means in gallery
  const currentStep = builderState ? 4 : contentStep ? 3 : customizing ? 2 : chooser ? 1 : null;
  const inFlow = currentStep !== null;

  const dismissWelcome = () => { localStorage.setItem("bdapps-digital-welcomed", "1"); setWelcomeStep(-1); };

  const pickTemplate = (t, type) => setChooser({ template: t, type });
  const onChooserContinue = ({ template, designId }) => {
    setCustomizing({ template, type: chooser.type, designId });
    setChooser(null);
  };
  const onCustomized = (customization) => {
    // Pro app builder: skip content step (telecom templates don't need it)
    if (customizing.type === "pro") {
      setBuilderState({ template: customizing.template, type: customizing.type, designId: customizing.designId, customization, content: null });
      setCustomizing(null);
      return;
    }
    setContentStep({ template: customizing.template, type: customizing.type, designId: customizing.designId, customization });
    setCustomizing(null);
  };
  const onContentDone = (content) => {
    setBuilderState({ ...contentStep, content });
    setContentStep(null);
  };
  const backFromBuilder = () => { setBuilderState(null); navigate("/digital"); };

  const templatesFor = tab === "pro" ? PRO_TEMPLATES : tab === "web" ? WEB_TEMPLATES : ANDROID_TEMPLATES;
  const categoriesFor = tab === "pro" ? ALL_CATEGORIES_PRO : tab === "web" ? ALL_CATEGORIES_WEB : ALL_CATEGORIES_ANDROID;

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{t("digital.title")}</h1>
            <p className="text-sm text-slate-600 mt-1">{t("digital.subtitle")}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button data-testid="demo-tour-btn" variant="outline" onClick={() => setTourOpen(true)} className="gap-1"><PlayCircle size={14} /> {t("digital.demoTour")}</Button>
            <Button data-testid="addons-btn" onClick={() => navigate("/add-ons")} className="bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-90 gap-1 text-white">
              <Sparkles size={14} /> {t("digital.browseAddOns")}
            </Button>
          </div>
        </div>

        {/* Sticky progress bar (only during creation flow) */}
        {inFlow && (
          <div data-testid="creation-progress" className="sticky top-0 z-20 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              {STEP_LABELS.map((label, i) => (
                <React.Fragment key={label}>
                  <div className={`flex items-center gap-1.5 text-xs ${i === currentStep ? "font-bold" : "text-slate-500"}`} style={i === currentStep ? { color: "#2563EB" } : {}}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i < currentStep ? "bg-emerald-500 text-white" : i === currentStep ? "text-white" : "bg-slate-200 text-slate-600"}`} style={i === currentStep ? { background: "#2563EB" } : {}}>
                      {i < currentStep ? <Check size={11} /> : i + 1}
                    </span>
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                  {i < 4 && <div className="flex-1 h-px bg-slate-200"></div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Generated apps shelf — visible only on gallery */}
        {!inFlow && <MyGeneratedAppsShelf />}

        {/* If in builder step 5, render AppBuilder full-width */}
        {builderState ? (
          <AppBuilder template={builderState.template} type={builderState.type} designId={builderState.designId} customization={builderState.customization} content={builderState.content} onBack={backFromBuilder} />
        ) : contentStep ? (
          /* Step 4 — Content Manager */
          <ContentManager
            template={contentStep.template}
            initial={null}
            onBack={() => { setCustomizing({ template: contentStep.template, type: contentStep.type, designId: contentStep.designId }); setContentStep(null); }}
            onContinue={onContentDone}
          />
        ) : customizing ? (
          /* Step 3 */
          <div>
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold">Tell Us About Your App</h2>
              <p className="text-xs text-slate-500">{customizing.template.name} · {customizing.template.category}</p>
            </div>
            <CustomizationForm template={customizing.template} type={customizing.type} onSubmit={onCustomized} onBack={() => { setChooser({ template: customizing.template, type: customizing.type }); setCustomizing(null); }} />
          </div>
        ) : (
          /* Step 1 — Gallery */
          <>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList data-testid="digital-tabs" className="grid grid-cols-2 w-full h-auto p-1.5 rounded-xl gap-1.5" style={{ background: "var(--surface-2)" }}>
              {Object.entries(TAB_META).map(([key, m]) => (
                <TabsTrigger key={key} value={key} data-testid={`tab-${key}`} className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:shadow-md py-2.5 sm:py-3 px-2 rounded-lg gap-1 sm:gap-1.5 font-bold text-[11px] sm:text-sm whitespace-nowrap overflow-hidden">
                  <span>{m.icon}</span>
                  <span className="truncate">{m.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(TAB_META).map(([key, m]) => (
              <TabsContent key={key} value={key} className="pt-5 space-y-5">
                <div className="rounded-xl px-4 sm:px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2" style={{ background: "linear-gradient(90deg, var(--surface), rgba(91,124,250,0.14), var(--surface))", border: "1px solid var(--c-border)", color: "var(--text)" }}>
                  <div className="min-w-0">
                    <div className="text-[10px] sm:text-xs uppercase tracking-widest font-bold" style={{ color: "var(--text-muted)" }}>{m.label}</div>
                    <div className="text-base sm:text-lg font-semibold mt-0.5 break-words">{m.tagline}</div>
                  </div>
                  <span className="text-2xl sm:text-3xl shrink-0">{m.icon}</span>
                </div>
                <TemplateGallery
                  templates={key === "pro" ? PRO_TEMPLATES : key === "web" ? WEB_TEMPLATES : ANDROID_TEMPLATES}
                  type={key}
                  categories={key === "pro" ? ALL_CATEGORIES_PRO : key === "web" ? ALL_CATEGORIES_WEB : ALL_CATEGORIES_ANDROID}
                  onSelect={(t) => pickTemplate(t, key)}
                  onLivePreview={(t) => setLivePreview({ template: t, type: key })}
                  testidPrefix={key}
                />
              </TabsContent>
            ))}
          </Tabs>
          <AiComposeBar />
          </>
        )}
      </div>

      {/* Step 2 — Design chooser modal */}
      <DesignChooserModal
        open={!!chooser}
        template={chooser?.template}
        type={chooser?.type}
        onClose={() => setChooser(null)}
        onContinue={onChooserContinue}
      />

      {/* Live preview modal */}
      <LivePreviewModal
        open={!!livePreview}
        onClose={() => setLivePreview(null)}
        template={livePreview?.template}
        type={livePreview?.type}
        onUse={(t) => pickTemplate(t, livePreview?.type)}
      />

      {/* Demo Tour */}
      <DemoTour open={tourOpen} onClose={() => setTourOpen(false)} />

      {/* First-visit welcome */}
      <Dialog open={welcomeStep >= 0} onOpenChange={() => welcomeStep >= 0 && dismissWelcome()}>
        <DialogContent data-testid="welcome-modal" className="max-w-md">
          <DialogTitle className="sr-only">Welcome</DialogTitle>
          <DialogDescription className="sr-only">First time setup</DialogDescription>
          {welcomeStep === 0 && (
            <div className="text-center py-3">
              <div className="text-5xl">👋</div>
              <h1 className="text-2xl font-bold mt-2">Welcome to Orbit Builder</h1>
              <p className="text-sm text-slate-500 mt-1">Build a complete app in minutes with zero code</p>
              <Button data-testid="welcome-next" onClick={() => setWelcomeStep(1)} className="mt-4 bg-[#2563EB]">Next →</Button>
            </div>
          )}
          {welcomeStep === 1 && (
            <div className="text-center py-3">
              <div className="flex justify-center gap-2 my-3">
                <div className="text-3xl">🎨</div><span className="text-xl self-center">→</span>
                <div className="text-3xl">✏️</div><span className="text-xl self-center">→</span>
                <div className="text-3xl">🚀</div>
              </div>
              <h1 className="text-xl font-bold">Choose template → Customize → Launch</h1>
              <p className="text-sm text-slate-500 mt-1">Three simple steps. Live preview at every stage.</p>
              <Button data-testid="welcome-next-2" onClick={() => setWelcomeStep(2)} className="mt-4 bg-[#2563EB]">Next →</Button>
            </div>
          )}
          {welcomeStep === 2 && (
            <div className="text-center py-3">
              <div className="text-5xl">🚀</div>
              <h1 className="text-2xl font-bold mt-2">Reach 12M+ Robi subscribers</h1>
              <div className="flex justify-center gap-3 my-3 text-xs">
                <div className="bg-emerald-50 border border-emerald-200 rounded p-2"><b className="text-emerald-700">12M+</b><br/>Robi users</div>
                <div className="bg-rose-50 border border-rose-200 rounded p-2"><b className="text-rose-700">~4 min</b><br/>Build time</div>
                <div className="bg-amber-50 border border-amber-200 rounded p-2"><b className="text-amber-700">0</b><br/>Lines of code</div>
              </div>
              <Button data-testid="welcome-start" onClick={dismissWelcome} className="mt-3 bg-[#2563EB] gap-2">Start Building <ArrowRight size={14} /></Button>
              <div><button data-testid="welcome-skip" onClick={dismissWelcome} className="text-xs text-slate-500 mt-2 underline">Skip</button></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Digital;
