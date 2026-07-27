import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../components/ui/dialog";
import { Plus, Eye, BookOpen, Send, Bell, Wrench, Sparkles, FileText, FolderKanban, Settings, BarChart3, ArrowLeft, Download, Plug } from "lucide-react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Tile from "../components/Tile";
import { Req, Opt } from "../components/FieldLabel";
import { seedMessageHistory, seedReportData } from "../mocks/data";
import { AlertBroadcastDialog, ScheduledContentDialog } from "../components/lite/LiteAppActions";

// ============= LITE DASHBOARD =============
const LiteDashboard = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#e11d48] font-bold mb-1">{t("nav.bdappsLite")}</p>
          <h1 className="text-3xl sm:text-4xl tracking-tighter font-bold text-[#0f172a]" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{t("lite.console")}</h1>
          <p className="text-slate-500 mt-2">{t("lite.consoleSub")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Tile testid="lite-tile-create" to="/lite/create" title={t("lite.createApp")} description={t("lite.createAppSub")} icon={Plus} accent />
          <Tile testid="lite-tile-myapps" to="/lite/applications" title={t("lite.myApps")} description={t("lite.myAppsSub")} icon={FolderKanban} />
          <Tile testid="lite-tile-settings" to="/lite/settings" title={t("common.settings")} description={t("lite.settingsSub")} icon={Settings} />
          <Tile testid="lite-tile-reports" to="/lite/reports" title={t("lite.viewReports")} description={t("lite.viewReportsSub")} icon={BarChart3} />
        </div>
      </div>
    </Layout>
  );
};

// ============= CREATE LITE APP =============
const SHORTCODES = ["16222", "16333", "16444"];

const CreateLiteApp = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const { addLiteApp, pendingTemplate, setPendingTemplate } = useApp();
  const [step, setStep] = useState(1);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [data, setData] = useState({
    template: pendingTemplate?.category || (loc.state?.template?.category || ""),
    name: pendingTemplate?.name || (loc.state?.template?.name || ""),
    description: pendingTemplate?.description || (loc.state?.template?.description || ""),
    shortcode: "16222",
    keyword: pendingTemplate?.keyword || (loc.state?.template?.keyword || ""),
    enableExpiry: false,
    expiryDate: "",
    subSuccessMsg: "You have successfully subscribed.",
    unsubSuccessMsg: "You have successfully unsubscribed.",
    chargingMode: "perMessage",
    daily: false, dailyAmount: "2.00",
    weekly: false, weeklyAmount: "5.00",
    monthly: false, monthlyAmount: "15.00",
    scheduleType: "Immediate",
    customInterval: "",
    scheduledTime: "08:00",
    msgContent: "",
    dayOfWeek: "Monday",
    dayOfMonth: "1",
  });
  const [errors, setErrors] = useState({});

  React.useEffect(() => () => setPendingTemplate(null), [setPendingTemplate]);

  const update = (k, v) => setData((p) => ({ ...p, [k]: v }));
  const autoKeyword = () => {
    const random = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    update("keyword", random);
  };

  const next = () => {
    const e = {};
    if (step === 1 && !data.template) e.template = "Select a template";
    if (step === 2) {
      if (!data.name) e.name = "Required";
      if (!data.description) e.description = "Required";
      if (!data.shortcode) e.shortcode = "Required";
      if (!data.keyword) e.keyword = "Required";
      if (data.enableExpiry && !data.expiryDate) e.expiryDate = "Required";
      if (!data.subSuccessMsg) e.subSuccessMsg = "Required";
      if (!data.unsubSuccessMsg) e.unsubSuccessMsg = "Required";
      if (data.chargingMode === "subscription" && !data.daily && !data.weekly && !data.monthly) e.charging = "Pick at least one frequency";
      if (data.template === "Services") {
        if (!data.scheduleType) e.scheduleType = "Required";
        if (data.scheduleType === "Custom Interval" && !data.customInterval) e.customInterval = "Required";
        if (!data.scheduledTime) e.scheduledTime = "Required";
      }
    }
    setErrors(e);
    if (Object.keys(e).length) return;
    setStep(step + 1);
  };

  const submit = () => {
    const isService = data.template === "Services";
    addLiteApp({
      name: data.name,
      keyword: data.keyword,
      category: data.template,
      type: isService ? "Service" : data.template,
      subscribers: 0,
      ...(isService ? { schedule: { type: data.scheduleType, time: data.scheduledTime, customInterval: data.customInterval, dayOfWeek: data.dayOfWeek, dayOfMonth: data.dayOfMonth } } : {}),
    });
    setStep(4);
  };

  const SectionHdr = ({ children }) => <h3 className="text-xs font-bold uppercase tracking-widest text-[#e11d48] mt-6 mb-2 pb-2 border-b border-slate-100">{children}</h3>;

  return (
    <Layout>
      <div className="max-w-3xl space-y-6">
        <Link to="/lite" data-testid="back-lite" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#0f172a]"><ArrowLeft size={14} /> Back</Link>
        <h1 className="text-3xl tracking-tighter font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Create Lite Application</h1>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${step >= s ? "bg-[#e11d48]" : "bg-slate-200"}`}></div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Choose a template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: "Alert", icon: Bell, desc: "Send timely alerts to subscribers (weather, score, news)." },
                { id: "Services", icon: Wrench, desc: "Provide ongoing services (hadith, quotes, recipes)." },
              ].map((t) => (
                <button key={t.id} onClick={() => update("template", t.id)} data-testid={`template-${t.id}`}
                  className={`text-left border-2 rounded-md p-6 transition ${data.template === t.id ? "border-[#e11d48] bg-rose-50" : "border-slate-200 hover:border-[#0f172a]"}`}>
                  <t.icon size={28} className="text-[#e11d48] mb-3" />
                  <div className="font-semibold text-lg">{t.id}</div>
                  <div className="text-sm text-slate-500 mt-1">{t.desc}</div>
                </button>
              ))}
            </div>
            {errors.template && <p className="text-sm text-rose-600">{errors.template}</p>}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">{data.template} App Configuration</h2>

            <div><Label>Application Name<Req /></Label><Input data-testid="lite-name" value={data.name} onChange={(e) => update("name", e.target.value)} className={errors.name ? "border-rose-500" : ""} />{errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}</div>
            <div><Label>Description<Req /></Label><Textarea data-testid="lite-desc" value={data.description} onChange={(e) => update("description", e.target.value)} className={errors.description ? "border-rose-500" : ""} />{errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}</div>

            <SectionHdr>Keyword Details</SectionHdr>
            <div><Label>Choose Shortcode<Req /></Label>
              <Select value={data.shortcode} onValueChange={(v) => update("shortcode", v)}>
                <SelectTrigger data-testid="lite-shortcode" className={errors.shortcode ? "border-rose-500" : ""}><SelectValue /></SelectTrigger>
                <SelectContent>{SHORTCODES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Keyword Text<Req /></Label>
              <div className="flex gap-2">
                <Input data-testid="lite-keyword" value={data.keyword} onChange={(e) => update("keyword", e.target.value.toUpperCase())} className={errors.keyword ? "border-rose-500" : ""} />
                <Button type="button" variant="outline" onClick={autoKeyword} data-testid="auto-keyword">Auto Generate</Button>
              </div>
              {errors.keyword && <p className="text-xs text-rose-600 mt-1">{errors.keyword}</p>}
            </div>

            <SectionHdr>App Validity Duration</SectionHdr>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={data.enableExpiry} onCheckedChange={(v) => update("enableExpiry", !!v)} data-testid="enable-expiry" />
              Enable App Expiry Date
            </label>
            {data.enableExpiry && (
              <div><Label>Expiry Date<Req /></Label><Input type="date" value={data.expiryDate} onChange={(e) => update("expiryDate", e.target.value)} className={errors.expiryDate ? "border-rose-500" : ""} data-testid="expiry-date" />{errors.expiryDate && <p className="text-xs text-rose-600 mt-1">{errors.expiryDate}</p>}</div>
            )}

            <SectionHdr>Response Config</SectionHdr>
            <div><Label>Subscription Success Message<Req /></Label><Input value={data.subSuccessMsg} onChange={(e) => update("subSuccessMsg", e.target.value)} data-testid="sub-success" className={errors.subSuccessMsg ? "border-rose-500" : ""} /></div>
            <div><Label>Unsubscription Success Message<Req /></Label><Input value={data.unsubSuccessMsg} onChange={(e) => update("unsubSuccessMsg", e.target.value)} data-testid="unsub-success" className={errors.unsubSuccessMsg ? "border-rose-500" : ""} /></div>

            <SectionHdr>Charging</SectionHdr>
            <RadioGroup value={data.chargingMode} onValueChange={(v) => update("chargingMode", v)} className="space-y-2">
              <label className="flex items-start gap-2 border border-slate-200 rounded-md p-3 cursor-pointer">
                <RadioGroupItem value="perMessage" id="cm-pm" data-testid="charge-per-message" className="mt-0.5" />
                <div><div className="font-medium text-sm">Charging Per Message</div><div className="text-xs text-slate-500">Tk. 2.00 + VAT + SD + SC</div></div>
              </label>
              <label className="flex items-start gap-2 border border-slate-200 rounded-md p-3 cursor-pointer">
                <RadioGroupItem value="subscription" id="cm-sub" data-testid="charge-subscription" className="mt-0.5" />
                <div><div className="font-medium text-sm">Charging for Subscription</div><div className="text-xs text-slate-500">Recurring charges from subscribers</div></div>
              </label>
            </RadioGroup>
            {data.chargingMode === "subscription" && (
              <div className="border border-slate-200 rounded-md p-4 space-y-2 bg-slate-50">
                {[
                  { k: "daily", l: "Daily", ak: "dailyAmount" },
                  { k: "weekly", l: "Weekly", ak: "weeklyAmount" },
                  { k: "monthly", l: "Monthly", ak: "monthlyAmount" },
                ].map((it) => (
                  <div key={it.k} className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm w-28"><Checkbox checked={data[it.k]} onCheckedChange={(v) => update(it.k, !!v)} data-testid={`freq-${it.k}`} />{it.l}</label>
                    {data[it.k] && (
                      <div className="flex items-center gap-2 flex-1"><span className="text-xs text-slate-500">Amount (BDT)</span><Input className="max-w-[120px]" value={data[it.ak]} onChange={(e) => update(it.ak, e.target.value)} data-testid={`amt-${it.k}`} /></div>
                    )}
                  </div>
                ))}
                {errors.charging && <p className="text-xs text-rose-600">{errors.charging}</p>}
              </div>
            )}

            {data.template === "Services" && (
              <>
                <SectionHdr>Message Scheduling</SectionHdr>
                <div><Label>Schedule Type<Req /></Label>
                  <Select value={data.scheduleType} onValueChange={(v) => update("scheduleType", v)}>
                    <SelectTrigger data-testid="schedule-type" className={errors.scheduleType ? "border-rose-500" : ""}><SelectValue /></SelectTrigger>
                    <SelectContent>{["Immediate", "Daily", "Weekly", "Monthly", "Custom Interval"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {data.scheduleType === "Custom Interval" && (
                  <div><Label>Interval (hours)<Req /></Label><Input type="number" value={data.customInterval} onChange={(e) => update("customInterval", e.target.value)} data-testid="custom-interval" className={errors.customInterval ? "border-rose-500" : ""} /></div>
                )}
                <div><Label>Scheduled Time<Req /></Label><Input type="time" value={data.scheduledTime} onChange={(e) => update("scheduledTime", e.target.value)} data-testid="scheduled-time" className={errors.scheduledTime ? "border-rose-500" : ""} /></div>
                <div className="rounded-md bg-sky-50 border border-sky-200 p-3 text-xs text-sky-800">
                  <strong className="font-bold">Note:</strong> Service apps deliver scheduled content. You can add and manage the content queue from <span className="font-semibold">My Applications → Use</span> after this app is approved.
                </div>
                {data.scheduleType === "Weekly" && (
                  <div><Label>Day of Week<Req /></Label>
                    <Select value={data.dayOfWeek} onValueChange={(v) => update("dayOfWeek", v)}>
                      <SelectTrigger data-testid="day-of-week"><SelectValue /></SelectTrigger>
                      <SelectContent>{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
                {data.scheduleType === "Monthly" && (
                  <div><Label>Day of Month<Req /></Label><Input type="number" min="1" max="31" value={data.dayOfMonth} onChange={(e) => update("dayOfMonth", e.target.value)} data-testid="day-of-month" /></div>
                )}
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Review</h2>
            <div className="border border-slate-200 rounded-md divide-y">
              {[
                ["Template", data.template], ["Application Name", data.name], ["Description", data.description],
                ["Shortcode", data.shortcode], ["Keyword", data.keyword],
                ["Expiry", data.enableExpiry ? data.expiryDate : "—"],
                ["Subscription Success", data.subSuccessMsg], ["Unsubscription Success", data.unsubSuccessMsg],
                ["Charging", data.chargingMode === "perMessage" ? "Per Message · Tk 2.00" : `Subscription · ${[data.daily && "Daily", data.weekly && "Weekly", data.monthly && "Monthly"].filter(Boolean).join(", ") || "—"}`],
                ...(data.template === "Services" ? [
                  ["Schedule", `${data.scheduleType}${data.scheduleType === "Custom Interval" ? ` · ${data.customInterval}h` : ""}`],
                  ["Time", data.scheduledTime],
                ] : []),
              ].map(([k, v], i) => (
                <div key={i} className="flex justify-between p-3 text-sm gap-3"><span className="text-slate-500 uppercase tracking-wide font-semibold text-xs flex-shrink-0">{k}</span><span className="font-medium text-right max-w-[60%] break-words">{v || "—"}</span></div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-12 space-y-6 border border-emerald-200 bg-emerald-50 rounded-md">
            <Sparkles size={48} className="text-emerald-600 mx-auto" />
            <div>
              <h2 className="text-3xl font-bold tracking-tighter" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Application Created!</h2>
              <p className="text-slate-600 mt-2">Your Lite app <span className="font-semibold">{data.name}</span> is awaiting approval.</p>
            </div>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => setTutorialOpen(true)} data-testid="view-tutorial"><BookOpen size={14} className="mr-1" /> View Tutorial</Button>
              <Button data-testid="goto-myapps" onClick={() => navigate("/lite/applications")} className="bg-[#e11d48] hover:bg-[#be123c]">My Applications</Button>
            </div>
          </div>
        )}

        {step < 4 && (
          <div className="flex justify-between pt-4">
            <Button variant="outline" disabled={step === 1} onClick={() => setStep(step - 1)} data-testid="lite-back">Back</Button>
            {step === 3 ? <Button data-testid="lite-submit" className="bg-[#e11d48] hover:bg-[#be123c]" onClick={submit}>Submit</Button>
              : <Button data-testid="lite-next" className="bg-[#e11d48] hover:bg-[#be123c]" onClick={next}>Next</Button>}
          </div>
        )}

        <Dialog open={tutorialOpen} onOpenChange={setTutorialOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>How to use your Lite app</DialogTitle></DialogHeader>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Wait for admin approval (usually under 24 hours).</li>
              <li>Once approved, share your keyword (e.g., <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{data.keyword || "MYAPP"}</span>).</li>
              <li>Subscribers SMS your keyword to <span className="font-mono">21333</span>.</li>
              <li>Use the composer in My Applications to send updates.</li>
              <li>Track performance in View Reports.</li>
            </ol>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

// ============= MY APPLICATIONS =============
const MyApplications = () => {
  const { liteApps } = useApp();
  const navigate = useNavigate();
  const [alertUseApp, setAlertUseApp] = useState(null);
  const [serviceUseApp, setServiceUseApp] = useState(null);
  const [viewApp, setViewApp] = useState(null);
  const [helpApp, setHelpApp] = useState(null);
  const [publishApp, setPublishApp] = useState(null);
  const [pubForm, setPubForm] = useState({ name: "", category: "", description: "", short: "", instructions: "" });

  const onUse = (app) => {
    const t = app.type || app.category;
    if (t === "Service" || t === "Services") {
      setServiceUseApp(app);
    } else {
      setAlertUseApp(app);
    }
  };

  const badgeClass = (t) => {
    if (t === "Alert") return "bg-amber-100 text-amber-700";
    if (t === "Service" || t === "Services") return "bg-teal-100 text-teal-700";
    return "bg-sky-100 text-sky-700";
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <Link to="/lite" data-testid="back-lite-myapps" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#0f172a] mb-2"><ArrowLeft size={14} /> Back</Link>
            <h1 className="text-3xl tracking-tighter font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>My Applications</h1>
          </div>
          <Button onClick={() => navigate("/lite/create")} className="bg-[#e11d48] hover:bg-[#be123c]"><Plus size={14} className="mr-1" /> New</Button>
        </div>

        <div className="border border-slate-200 rounded-md overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Type</th><th className="text-left p-3">Keyword</th><th className="text-left p-3">Status</th><th className="text-left p-3">Actions</th></tr>
            </thead>
            <tbody>
              {liteApps.map((a) => {
                const t = a.type || a.category;
                return (
                  <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-medium">{a.name}</td>
                    <td className="p-3"><span data-testid={`type-${a.id}`} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${badgeClass(t)}`}>{t === "Services" ? "Service" : t}</span></td>
                    <td className="p-3 font-mono">{a.keyword}</td>
                    <td className="p-3"><span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${a.status === "Active" ? "bg-emerald-100 text-emerald-700" : a.status === "Rejected" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{a.status}</span></td>
                    <td className="p-3 space-x-1 space-y-1 whitespace-nowrap">
                      {a.status === "Active" && (<>
                        <Button size="sm" variant="outline" onClick={() => onUse(a)} data-testid={`use-${a.id}`}>Use</Button>
                        <Button size="sm" variant="outline" onClick={() => setViewApp(a)} data-testid={`view-${a.id}`}>View</Button>
                        <Button size="sm" variant="outline" onClick={() => setHelpApp(a)} data-testid={`help-${a.id}`}>Help</Button>
                        <Button size="sm" className="bg-[#e11d48] hover:bg-[#be123c]" onClick={() => setPublishApp(a)} data-testid={`publish-${a.id}`}>Publish</Button>
                      </>)}
                      {a.status === "Rejected" && <Button size="sm" variant="outline" onClick={() => setViewApp(a)}>View</Button>}
                      {a.status === "Pending" && <span className="text-xs text-slate-400">Awaiting approval</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert broadcast */}
      <AlertBroadcastDialog app={alertUseApp} open={!!alertUseApp} onClose={() => setAlertUseApp(null)} />

      {/* Service scheduled content */}
      <ScheduledContentDialog app={serviceUseApp} open={!!serviceUseApp} onClose={() => setServiceUseApp(null)} />

      {/* View */}
      <Dialog open={!!viewApp} onOpenChange={(o) => !o && setViewApp(null)}>
        <DialogContent><DialogHeader><DialogTitle>{viewApp?.name}</DialogTitle></DialogHeader>
          <div className="text-sm space-y-2"><div><span className="text-slate-500">ID: </span><span className="font-mono">{viewApp?.id}</span></div><div><span className="text-slate-500">Keyword: </span><span className="font-mono">{viewApp?.keyword}</span></div><div><span className="text-slate-500">Category: </span>{viewApp?.category}</div><div><span className="text-slate-500">Status: </span>{viewApp?.status}</div></div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!helpApp} onOpenChange={(o) => !o && setHelpApp(null)}>
        <DialogContent><DialogHeader><DialogTitle>Help · {helpApp?.name}</DialogTitle></DialogHeader>
          <div className="text-sm space-y-2"><p>Subscribers SMS <span className="font-mono bg-slate-100 px-1 rounded">{helpApp?.keyword}</span> to 21333 to subscribe.</p><p>To unsubscribe, send STOP to 21333.</p><p>Need more help? Contact support@orbit.com</p></div>
        </DialogContent>
      </Dialog>

      {/* Publish */}
      <Dialog open={!!publishApp} onOpenChange={(o) => !o && setPublishApp(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Publish to App Store</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input data-testid="pub-name" value={pubForm.name} onChange={(e) => setPubForm({ ...pubForm, name: e.target.value })} /></div>
            <div><Label>Category</Label>
              <Select value={pubForm.category} onValueChange={(v) => setPubForm({ ...pubForm, category: v })}>
                <SelectTrigger data-testid="pub-category"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Games">Games</SelectItem><SelectItem value="Entertainment">Entertainment</SelectItem><SelectItem value="Health">Health</SelectItem><SelectItem value="Finance">Finance</SelectItem><SelectItem value="Utilities">Utilities</SelectItem></SelectContent>
              </Select></div>
            <div><Label>Description</Label><Textarea value={pubForm.description} onChange={(e) => setPubForm({ ...pubForm, description: e.target.value })} /></div>
            <div><Label>Short Description</Label><Input value={pubForm.short} onChange={(e) => setPubForm({ ...pubForm, short: e.target.value })} /></div>
            <div><Label>Instructions</Label><Textarea value={pubForm.instructions} onChange={(e) => setPubForm({ ...pubForm, instructions: e.target.value })} /></div>
            <div><Label>Icon</Label><Input type="file" accept="image/*" /></div>
            <div><Label>Banner (optional)</Label><Input type="file" accept="image/*" /></div>
          </div>
          <DialogFooter><Button data-testid="pub-submit" onClick={() => { if (!pubForm.name || !pubForm.category) return toast.error("Name & Category required"); toast.success("Published to App Store!"); setPublishApp(null); setPubForm({ name: "", category: "", description: "", short: "", instructions: "" }); }} className="bg-[#e11d48] hover:bg-[#be123c]">Publish</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

// ============= LITE SETTINGS =============
const LiteSettings = () => {
  const { keywords } = useApp();
  const [profileEdit, setProfileEdit] = useState(false);
  const [pwdEdit, setPwdEdit] = useState(false);
  const [orgEdit, setOrgEdit] = useState(false);
  const [reconEdit, setReconEdit] = useState(false);
  const [view, setView] = useState("dashboard");

  if (view === "keywords") return (
    <Layout>
      <div className="space-y-4">
        <Button variant="outline" size="sm" onClick={() => setView("dashboard")} data-testid="back-settings"><ArrowLeft size={14} className="mr-1" /> Settings</Button>
        <h1 className="text-3xl tracking-tighter font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Keywords</h1>
        <div className="border border-slate-200 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="text-left p-3">Keyword</th><th className="text-left p-3">App</th><th className="text-left p-3">Shortcode</th><th className="text-left p-3">Status</th></tr></thead>
            <tbody>
              {keywords.map((k, i) => <tr key={i} className="border-t border-slate-100"><td className="p-3 font-mono">{k.keyword}</td><td className="p-3">{k.appName}</td><td className="p-3 font-mono">{k.shortcode}</td><td className="p-3">{k.status}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );

  if (view === "profile") return (
    <Layout>
      <div className="space-y-4 max-w-3xl">
        <Button variant="outline" size="sm" onClick={() => setView("dashboard")} data-testid="back-settings2"><ArrowLeft size={14} className="mr-1" /> Settings</Button>
        <h1 className="text-3xl tracking-tighter font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>My Profile</h1>
        <Tabs defaultValue="profile">
          <TabsList><TabsTrigger value="profile">My Profile</TabsTrigger><TabsTrigger value="security">Security</TabsTrigger></TabsList>
          <TabsContent value="profile" className="space-y-5 pt-4">
            <Card title="Basic Details" disabled>
              <Field label="Name" value="Rafiul Karim" disabled />
              <Field label="Username" value="developer" disabled />
              <Field label="Email" value="developer@orbit.com" disabled />
            </Card>
            <Card title="Organization Details" edit={orgEdit} onEdit={() => setOrgEdit(!orgEdit)} testid="edit-org">
              <Field label="Org Name" defaultValue="Orbit Demo" disabled={!orgEdit} />
              <Field label="Address" defaultValue="Gulshan, Dhaka" disabled={!orgEdit} />
              <Field label="Tax ID" defaultValue="TIN-12345" disabled={!orgEdit} />
            </Card>
            <Card title="Contact Person" disabled>
              <Field label="Name" value="Rafiul Karim" disabled />
              <Field label="Phone" value="+8801711000001" disabled />
            </Card>
            <Card title="Reconciliation Details" edit={reconEdit} onEdit={() => setReconEdit(!reconEdit)} testid="edit-recon">
              <Field label="Bank" defaultValue="DBBL" disabled={!reconEdit} />
              <Field label="Account No" defaultValue="1011XXXX" disabled={!reconEdit} />
            </Card>
            <Card title="Terms & Conditions">
              <p className="text-sm text-slate-600">Read the developer agreement.</p>
              <Button variant="outline" size="sm" onClick={() => toast.success("T&C downloaded (mock)")} data-testid="download-tc"><Download size={14} className="mr-1" /> Download</Button>
            </Card>
          </TabsContent>
          <TabsContent value="security" className="pt-4">
            <Card title="Change Password" edit={pwdEdit} onEdit={() => setPwdEdit(!pwdEdit)} testid="edit-pwd">
              <Field label="Current Password" type="password" disabled={!pwdEdit} />
              <Field label="New Password" type="password" disabled={!pwdEdit} />
              <Field label="Confirm Password" type="password" disabled={!pwdEdit} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="space-y-6 max-w-3xl">
        <Link to="/lite" data-testid="back-lite-set" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#0f172a]"><ArrowLeft size={14} /> Back</Link>
        <h1 className="text-3xl tracking-tighter font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => setView("keywords")} data-testid="open-keywords" className="text-left border border-slate-200 rounded-md p-6 hover:border-[#0f172a] transition">
            <FileText size={24} className="text-[#e11d48] mb-3" />
            <h3 className="font-semibold text-lg">Keywords</h3>
            <p className="text-sm text-slate-500 mt-1">View your registered keywords.</p>
          </button>
          <button onClick={() => setView("profile")} data-testid="open-profile" className="text-left border border-slate-200 rounded-md p-6 hover:border-[#0f172a] transition">
            <Settings size={24} className="text-[#e11d48] mb-3" />
            <h3 className="font-semibold text-lg">My Profile</h3>
            <p className="text-sm text-slate-500 mt-1">Personal, organization & security.</p>
          </button>
        </div>
      </div>
    </Layout>
  );
};

const Card = ({ title, children, edit, onEdit, disabled, testid }) => (
  <div className="border border-slate-200 rounded-md p-5 bg-white">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold tracking-tight">{title}</h3>
      {!disabled && onEdit && <Button size="sm" variant="outline" onClick={onEdit} data-testid={testid}>{edit ? "Save" : "Edit"}</Button>}
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);
const Field = ({ label, ...rest }) => (
  <div><Label>{label}</Label><Input {...rest} /></div>
);

// ============= LITE REPORTS =============
const LiteReports = () => {
  const [showAll, setShowAll] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [generated, setGenerated] = useState(false);

  return (
    <Layout>
      <div className="space-y-6">
        <Link to="/lite" data-testid="back-lite-rep" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#0f172a]"><ArrowLeft size={14} /> Back</Link>
        <h1 className="text-3xl tracking-tighter font-bold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>View Reports</h1>

        <section className="border border-slate-200 rounded-md p-6 bg-white">
          <h2 className="font-semibold text-lg tracking-tight mb-4">Message History</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div><Label>App</Label>
              <Select defaultValue="all"><SelectTrigger data-testid="msg-app"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Apps</SelectItem><SelectItem value="weather">Weather Today</SelectItem><SelectItem value="hadith">Daily Hadith</SelectItem></SelectContent>
              </Select></div>
            <label className="flex items-center gap-2 mt-7"><Checkbox checked={showAll} onCheckedChange={(v) => setShowAll(!!v)} data-testid="show-all" /><span className="text-sm">Show All</span></label>
            <div><Label>From</Label><Input type="date" disabled={showAll} value={from} onChange={(e) => setFrom(e.target.value)} data-testid="msg-from" /></div>
            <div><Label>To</Label><Input type="date" disabled={showAll} value={to} onChange={(e) => setTo(e.target.value)} data-testid="msg-to" /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => setGenerated(true)} className="bg-[#e11d48] hover:bg-[#be123c]" data-testid="msg-generate">Generate</Button>
            {generated && <>
              <Button variant="outline" onClick={() => toast.success("CSV downloaded")} data-testid="msg-csv"><Download size={14} className="mr-1" /> CSV</Button>
              <Button variant="outline" onClick={() => toast.success("PDF downloaded")} data-testid="msg-pdf"><Download size={14} className="mr-1" /> PDF</Button>
            </>}
          </div>
          {generated && (
            <div className="mt-4 border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="text-left p-3">Date</th><th className="text-left p-3">App</th><th className="text-left p-3">From</th><th className="text-left p-3">To</th><th className="text-left p-3">Message</th><th className="text-left p-3">Status</th></tr></thead>
                <tbody>{seedMessageHistory.map((m, i) => <tr key={i} className="border-t border-slate-100"><td className="p-3">{m.date}</td><td className="p-3">{m.app}</td><td className="p-3 font-mono text-xs">{m.from}</td><td className="p-3 font-mono text-xs">{m.to}</td><td className="p-3 max-w-[200px] truncate">{m.message}</td><td className="p-3"><span className={m.status === "Delivered" ? "text-emerald-600 font-semibold text-xs" : "text-rose-600 font-semibold text-xs"}>{m.status}</span></td></tr>)}</tbody>
              </table>
            </div>
          )}
        </section>

        <section className="border border-slate-200 rounded-md p-6 bg-white">
          <h2 className="font-semibold text-lg tracking-tight mb-2">Other Reports</h2>
          <p className="text-sm text-slate-500 mb-4">Open the full reporting console.</p>
          <Link to="/reports"><Button variant="outline" data-testid="open-other-reports"><BarChart3 size={14} className="mr-1" /> Open Reports Console</Button></Link>
        </section>
      </div>
    </Layout>
  );
};

// ============= ROUTER =============
const Lite = () => {
  const { sub } = useParams();
  if (sub === "create") return <CreateLiteApp />;
  if (sub === "applications") return <MyApplications />;
  if (sub === "settings") return <LiteSettings />;
  if (sub === "reports") return <LiteReports />;
  return <LiteDashboard />;
};

export default Lite;
