import React, { useState } from "react";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
import { useApp } from "../../context/AppContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { ALL_STATUSES } from "../../mocks/data";
import { toast } from "sonner";
import { Download, Check, X, Trash2, ExternalLink } from "lucide-react";

const WebAppApproval = () => {
  const { myApps, approveMyApp, rejectMyApp } = useApp();
  const [filterType, setFilterType] = useState("all");
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");

  const pending = myApps.filter((a) => (a.status === "Pending Review" || a.status === "Live" || a.status === "Rejected") && (filterType === "all" || a.templateType === filterType));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-xs">Filter:</Label>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40" data-testid="webapp-filter"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Apps</SelectItem><SelectItem value="web">Web Apps</SelectItem><SelectItem value="android">Android Apps</SelectItem></SelectContent>
        </Select>
        <span className="ml-auto text-xs text-slate-500">{pending.filter((a) => a.status === "Pending Review").length} pending review</span>
      </div>
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="text-left p-3">App</th><th className="text-left p-3">Developer</th><th className="text-left p-3">Template</th><th className="text-left p-3">Submitted</th><th className="text-left p-3">Status</th><th className="text-left p-3">Actions</th></tr></thead>
          <tbody>
            {pending.map((a) => (
              <tr key={a.id} className="border-t border-slate-100" data-testid={`webapp-row-${a.id}`}>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${a.iconGradient} flex items-center justify-center text-xl text-white`}>{a.icon}</div>
                    <div><div className="font-bold">{a.name}</div><div className="text-[10px] text-slate-500">{a.id} · v{a.version}</div></div>
                  </div>
                </td>
                <td className="p-3 text-xs">Rafiul Karim</td>
                <td className="p-3 text-xs"><span className="bg-slate-100 px-2 py-0.5 rounded font-bold">{a.templateType?.toUpperCase()}</span> {a.kind}</td>
                <td className="p-3 text-xs text-slate-500">{new Date(a.submittedAt || a.launchedAt).toLocaleDateString()}</td>
                <td className="p-3"><span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${a.status === "Live" ? "bg-emerald-100 text-emerald-700" : a.status === "Rejected" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{a.status}</span></td>
                <td className="p-3 space-x-1">
                  <Button size="sm" variant="outline" onClick={() => window.open(`/apps/${a.slug}`, "_blank")} data-testid={`webapp-view-${a.id}`}><ExternalLink size={12} /></Button>
                  {a.status === "Pending Review" && <>
                    <Button size="sm" variant="outline" className="text-emerald-600" onClick={() => { approveMyApp(a.id); toast.success(`✓ Approved · ${a.name} is now live!`); }} data-testid={`webapp-approve-${a.id}`}><Check size={12} /></Button>
                    <Button size="sm" variant="outline" className="text-rose-600" onClick={() => { setRejecting(a); setReason(""); }} data-testid={`webapp-reject-${a.id}`}><X size={12} /></Button>
                  </>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!rejecting} onOpenChange={(o) => !o && setRejecting(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject {rejecting?.name}?</DialogTitle></DialogHeader>
          <Label>Rejection Reason *</Label>
          <Textarea data-testid="reject-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Content quality below threshold..." />
          <DialogFooter>
            <Button data-testid="confirm-reject" onClick={() => { if (!reason) return toast.error("Reason required"); rejectMyApp(rejecting.id, reason); toast.success(`Rejected ${rejecting.name}`); setRejecting(null); }} className="bg-rose-600 hover:bg-rose-700">Reject App</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const TRANSITIONS = {
  "Pending Approval": ["Active Production", "Limited Production", "Scheduled Active Production", "Rejected"],
  "Active Production": ["Suspended"],
  "Suspended": ["Active Production", "Limited Production", "Scheduled Active Production", "Terminated"],
  "Rejected": ["Active Production", "Pending Approval", "Deleted"],
  "Limited Production": ["Active Production", "Suspended"],
  "Terminated": [],
  "Draft": [],
  "Scheduled Active Production": ["Active Production", "Suspended"],
};

const AdminProvisioning = () => {
  const { apps, updateAppStatus, buildFiles, updateBuildFileStatus } = useApp();
  const [filter, setFilter] = useState("any");
  const [stateApp, setStateApp] = useState(null);
  const [newState, setNewState] = useState("");
  const [remark, setRemark] = useState("");

  const filtered = apps.filter((a) => filter === "any" || a.status === filter);

  const submit = () => {
    if (!newState) return toast.error("Pick a state");
    if (!remark) return toast.error("Remark required");
    if (newState === "Deleted") {
      toast.success("App deleted (mock)");
    } else {
      updateAppStatus(stateApp.id, newState, remark);
      toast.success(`App ${newState}`);
    }
    setStateApp(null);
    setNewState("");
    setRemark("");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#2563EB] font-bold mb-1">Admin · Provisioning</p>
          <h1 className="text-3xl sm:text-4xl tracking-tighter font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>App Approvals</h1>
        </div>

        <Tabs defaultValue="apps">
          <TabsList><TabsTrigger value="apps">Apps</TabsTrigger><TabsTrigger value="webapps" data-testid="tab-webapps">Web Apps</TabsTrigger><TabsTrigger value="builds">Build Files</TabsTrigger></TabsList>

          <TabsContent value="webapps" className="pt-6 space-y-4">
            <p className="text-sm text-slate-600">Review web & android apps submitted via the Digital Builder.</p>
            <WebAppApproval />
          </TabsContent>

          <TabsContent value="apps" className="pt-6 space-y-4">
            <Select value={filter} onValueChange={setFilter}><SelectTrigger className="w-60" data-testid="admin-filter-status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="any">Any Status</SelectItem>{ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((app) => (
                <div key={app.id} className="border border-slate-200 rounded-md p-5 bg-white" data-testid={`admin-app-${app.id}`}>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-mono text-slate-500">{app.id}</span>
                    <StatusBadge status={app.status} />
                  </div>
                  <h3 className="font-semibold text-lg tracking-tight mb-1">{app.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">{app.username}</p>
                  <Button size="sm" disabled={!TRANSITIONS[app.status]?.length} onClick={() => { setStateApp(app); setNewState(""); setRemark(""); }} className="bg-[#09090B] hover:bg-slate-800 w-full" data-testid={`change-state-${app.id}`}>
                    {TRANSITIONS[app.status]?.length ? "Change State" : "No Actions"}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="builds" className="pt-6">
            <div className="border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="text-left p-3">Creator</th><th className="text-left p-3">App ID</th><th className="text-left p-3">App</th><th className="text-left p-3">Version</th><th className="text-left p-3">Date</th><th className="text-left p-3">Remarks</th><th className="text-left p-3">Status</th><th className="text-left p-3">Actions</th></tr></thead>
                <tbody>
                  {buildFiles.map((b, i) => (
                    <tr key={i} className="border-t border-slate-100" data-testid={`build-row-${i}`}>
                      <td className="p-3 font-mono text-xs">{b.creator}</td><td className="p-3 font-mono text-xs">{b.appId}</td><td className="p-3">{b.appName}</td><td className="p-3 font-mono">{b.version}</td><td className="p-3">{b.date}</td><td className="p-3 text-slate-500">{b.remarks}</td>
                      <td className="p-3"><span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${b.status === "Approved" ? "bg-emerald-100 text-emerald-700" : b.status === "Rejected" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{b.status}</span></td>
                      <td className="p-3 space-x-1">
                        <Button size="sm" variant="outline" onClick={() => toast.success("Downloaded")} data-testid={`build-dl-${i}`}><Download size={12} /></Button>
                        {b.status === "Pending" && <>
                          <Button size="sm" variant="outline" className="text-emerald-600" onClick={() => { updateBuildFileStatus(i, "Approved"); toast.success("Approved"); }} data-testid={`build-approve-${i}`}><Check size={12} /></Button>
                          <Button size="sm" variant="outline" className="text-rose-600" onClick={() => { updateBuildFileStatus(i, "Rejected"); toast.success("Rejected"); }} data-testid={`build-reject-${i}`}><X size={12} /></Button>
                        </>}
                        {b.status !== "Rejected" && <Button size="sm" variant="outline" className="text-rose-600" onClick={() => toast.success("Deleted (mock)")} data-testid={`build-del-${i}`}><Trash2 size={12} /></Button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!stateApp} onOpenChange={(o) => !o && setStateApp(null)}>
        <DialogContent data-testid="change-state-dialog">
          <DialogHeader><DialogTitle>Change State · {stateApp?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Current Status</Label><Input value={stateApp?.status || ""} disabled /></div>
            <div><Label>New Status *</Label>
              <Select value={newState} onValueChange={setNewState}>
                <SelectTrigger data-testid="new-state"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{TRANSITIONS[stateApp?.status]?.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Remarks *</Label><Textarea data-testid="state-remark" value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Reason for change" /></div>
          </div>
          <DialogFooter><Button data-testid="state-submit" onClick={submit} className="bg-[#2563EB] hover:bg-[#1D4ED8]">Submit</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminProvisioning;
