import React, { useState, useMemo } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "../ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Req } from "../FieldLabel";
import { Send, AlertCircle, Plus, Trash2, Pencil, Users, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";

// ============= ALERT BROADCAST DIALOG =============
export const AlertBroadcastDialog = ({ app, open, onClose }) => {
  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState(false);
  const subs = app?.subscribers ?? 1284;

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Message content is required");
      return;
    }
    setConfirm(true);
  };

  const doSend = () => {
    toast.success(`Message sent to ${subs.toLocaleString()} subscribers`);
    setMessage("");
    setConfirm(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent data-testid="alert-broadcast-dialog" className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send size={16} className="text-[#2563EB]" /> Broadcast to Subscribers
            </DialogTitle>
            <DialogDescription>
              Send a one-time SMS to all active subscribers of <span className="font-semibold">{app?.name}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="border border-slate-200 rounded-md bg-slate-50 p-3 flex items-center gap-2">
            <Users size={14} className="text-[#2563EB]" />
            <span data-testid="active-subs-line" className="text-sm">
              Active Subscribers: <span className="font-bold text-[#09090B]">{subs.toLocaleString()}</span>
            </span>
          </div>

          <div>
            <Label>Message Content<Req /></Label>
            <Textarea
              data-testid="broadcast-message"
              maxLength={300}
              rows={4}
              placeholder="Type your broadcast SMS (max 300 chars)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <p className="text-xs text-slate-500 text-right mt-1">{message.length} / 300</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              data-testid="send-to-all"
              onClick={handleSend}
              disabled={!message.trim()}
              className="bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              <Send size={14} className="mr-1.5" /> Send to All Subscribers
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation */}
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent data-testid="broadcast-confirm" className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600" /> Confirm Broadcast
            </DialogTitle>
            <DialogDescription>
              You are about to send this message to <span className="font-bold text-[#09090B]">{subs.toLocaleString()} subscribers</span>. Confirm?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-sm whitespace-pre-wrap">
            {message}
          </div>
          <DialogFooter>
            <Button variant="outline" data-testid="confirm-cancel" onClick={() => setConfirm(false)}>Cancel</Button>
            <Button data-testid="confirm-send" onClick={doSend} className="bg-[#2563EB] hover:bg-[#1D4ED8]">
              <Send size={14} className="mr-1.5" /> Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// ============= SCHEDULED CONTENT MANAGER =============

// Generate slot labels based on schedule
const generateSlots = (schedule, count = 30) => {
  const type = schedule?.type || "Daily";
  const time = schedule?.time || "09:00 AM";
  if (type === "Weekly") {
    return Array.from({ length: count }).map((_, i) => ({
      label: `Week ${Math.floor(i / 7) + 1} ${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7]}`,
      time,
    }));
  }
  if (type === "Monthly") {
    return Array.from({ length: count }).map((_, i) => ({
      label: `Month ${i + 1}`,
      time,
    }));
  }
  if (type === "Custom Interval") {
    const h = parseInt(schedule?.customInterval, 10) || 6;
    return Array.from({ length: count }).map((_, i) => ({
      label: `Slot ${i + 1} (Hour ${i * h})`,
      time,
    }));
  }
  // Daily default
  return Array.from({ length: count }).map((_, i) => ({
    label: `Day ${i + 1}`,
    time,
  }));
};

const PRESEED_QUEUE = [
  { id: "q1", slot: "Day 1", time: "9:00 AM", content: "Start your day with 8 glasses of water. Hydration is the foundation of energy, focus, and healthy skin.", status: "Sent" },
  { id: "q2", slot: "Day 2", time: "9:00 AM", content: "30 minutes of morning walk reduces heart disease risk by 35%. Step out before the sun gets harsh.", status: "Sent" },
  { id: "q3", slot: "Day 3", time: "9:00 AM", content: "Eat more greens: spinach, broccoli, and kale are packed with iron and antioxidants for daily energy.", status: "Sent" },
  { id: "q4", slot: "Day 4", time: "9:00 AM", content: "Sleep 7–8 hours daily. Poor sleep increases stress hormones and slows metabolism by up to 20%.", status: "Queued" },
  { id: "q5", slot: "Day 5", time: "9:00 AM", content: "Breathing exercises: 4-7-8 technique reduces anxiety instantly. Inhale 4s, hold 7s, exhale 8s.", status: "Draft" },
];

const PRESEED_HADITH = [
  { id: "h1", slot: "Day 1", time: "6:00 AM", content: "The best of you are those who are best to their families. (Tirmidhi)", status: "Sent" },
  { id: "h2", slot: "Day 2", time: "6:00 AM", content: "Smiling at your brother is charity. (Tirmidhi)", status: "Sent" },
  { id: "h3", slot: "Day 3", time: "6:00 AM", content: "Whoever believes in Allah and the Last Day, let him speak good or remain silent. (Bukhari)", status: "Queued" },
  { id: "h4", slot: "Day 4", time: "6:00 AM", content: "Allah does not look at your forms or your wealth but He looks at your hearts and deeds. (Muslim)", status: "Queued" },
  { id: "h5", slot: "Day 5", time: "6:00 AM", content: "The strong is not the one who overcomes by his strength, but the one who controls himself in anger.", status: "Draft" },
];

const StatusBadge = ({ status }) => {
  const map = {
    Sent: "bg-emerald-100 text-emerald-700",
    Queued: "bg-sky-100 text-sky-700",
    Draft: "bg-slate-100 text-slate-700",
  };
  return <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${map[status] || map.Draft}`}>{status}</span>;
};

export const ScheduledContentDialog = ({ app, open, onClose }) => {
  const [queue, setQueue] = useState(() => {
    if (app?.id === "LITE-006") return PRESEED_HADITH;
    return PRESEED_QUEUE;
  });
  const [editing, setEditing] = useState(null);
  const slots = useMemo(() => generateSlots(app?.schedule), [app]);

  // Single content form state
  const [single, setSingle] = useState({ slot: "", message: "", status: "Queue for Sending" });
  // Bulk form state
  const [mode, setMode] = useState("single"); // 'single' | 'bulk'
  const [bulkRows, setBulkRows] = useState([{ id: 1, message: "" }, { id: 2, message: "" }]);

  React.useEffect(() => {
    if (open && app) {
      setQueue(app.id === "LITE-006" ? PRESEED_HADITH : PRESEED_QUEUE);
      setSingle({ slot: "", message: "", status: "Queue for Sending" });
      setBulkRows([{ id: 1, message: "" }, { id: 2, message: "" }]);
      setMode("single");
    }
  }, [open, app]);

  if (!app) return null;

  const addSingle = () => {
    if (!single.slot || !single.message.trim()) {
      toast.error("Slot and message are required");
      return;
    }
    const slotMeta = slots.find((s) => s.label === single.slot);
    setQueue((p) => [...p, {
      id: `n${Date.now()}`,
      slot: single.slot,
      time: slotMeta?.time || app.schedule?.time || "09:00 AM",
      content: single.message,
      status: single.status === "Save as Draft" ? "Draft" : "Queued",
    }]);
    toast.success(`Content added to ${single.slot}`);
    setSingle({ slot: "", message: "", status: "Queue for Sending" });
  };

  const addBulkRow = () => setBulkRows((p) => [...p, { id: Date.now(), message: "" }]);
  const removeBulkRow = (id) => setBulkRows((p) => p.length > 1 ? p.filter((r) => r.id !== id) : p);
  const updateBulkRow = (id, value) => setBulkRows((p) => p.map((r) => r.id === id ? { ...r, message: value } : r));

  const saveBulk = (status) => {
    const valid = bulkRows.filter((r) => r.message.trim());
    if (!valid.length) {
      toast.error("Add at least one message");
      return;
    }
    // Use next unused slot numbers
    const existingSlots = new Set(queue.map((q) => q.slot));
    let idx = 0;
    const additions = valid.map((r) => {
      while (existingSlots.has(slots[idx]?.label)) idx += 1;
      const slot = slots[idx];
      idx += 1;
      return {
        id: `n${Date.now()}-${r.id}`,
        slot: slot?.label || `Slot ${idx}`,
        time: slot?.time || app.schedule?.time || "09:00 AM",
        content: r.message,
        status,
      };
    });
    setQueue((p) => [...p, ...additions]);
    toast.success(`${additions.length} item${additions.length > 1 ? "s" : ""} ${status === "Draft" ? "saved as draft" : "queued"}`);
    setBulkRows([{ id: 1, message: "" }]);
  };

  const removeItem = (id) => {
    setQueue((p) => p.filter((q) => q.id !== id));
    toast.success("Item removed");
  };

  // Available slots = slots not yet used
  const usedSlots = new Set(queue.map((q) => q.slot));
  const availableSlots = slots.filter((s) => !usedSlots.has(s.label));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        data-testid="scheduled-content-dialog"
        className="max-w-3xl max-h-[92vh] overflow-hidden flex flex-col"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar size={16} className="text-[#2563EB]" /> Manage Scheduled Content · {app.name}
          </DialogTitle>
          <DialogDescription>
            Schedule and manage content items for this Service app.
          </DialogDescription>
        </DialogHeader>

        {/* Top info strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="border border-slate-200 rounded-md p-2 bg-slate-50">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Type</div>
            <div data-testid="sc-type-badge" className="font-semibold mt-0.5 inline-block bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest">Service</div>
          </div>
          <div className="border border-slate-200 rounded-md p-2 bg-slate-50">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Frequency</div>
            <div className="font-semibold flex items-center gap-1 mt-0.5"><Clock size={11} /> {app.schedule?.type || "Daily"} at {app.schedule?.time || "9:00 AM"}</div>
          </div>
          <div className="border border-slate-200 rounded-md p-2 bg-slate-50">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Subscribers</div>
            <div className="font-semibold flex items-center gap-1 mt-0.5"><Users size={11} /> {(app.subscribers ?? 0).toLocaleString()}</div>
          </div>
          <div className="border border-slate-200 rounded-md p-2 bg-slate-50">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Keyword</div>
            <div className="font-mono text-sm font-semibold mt-0.5">{app.keyword}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          <Tabs defaultValue="queue">
            <TabsList>
              <TabsTrigger value="queue" data-testid="sc-tab-queue">Content Queue</TabsTrigger>
              <TabsTrigger value="add" data-testid="sc-tab-add">Add Content</TabsTrigger>
            </TabsList>

            {/* Content Queue */}
            <TabsContent value="queue" className="pt-4">
              {queue.length === 0 ? (
                <div className="text-center py-10 text-sm text-slate-500 border border-dashed border-slate-200 rounded-md">
                  No content scheduled yet. Switch to <span className="font-semibold">Add Content</span> to begin.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-md overflow-x-auto">
                  <table className="w-full text-sm min-w-[640px]">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="text-left p-3">Day / Slot</th>
                        <th className="text-left p-3">Send Time</th>
                        <th className="text-left p-3">Content Preview</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-right p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {queue.map((q) => (
                        <tr key={q.id} data-testid={`queue-row-${q.id}`} className="border-t border-slate-100 hover:bg-slate-50">
                          <td className="p-3 font-medium whitespace-nowrap">{q.slot}</td>
                          <td className="p-3 font-mono text-xs whitespace-nowrap">{q.time}</td>
                          <td className="p-3 text-slate-600 max-w-[300px]">
                            <div className="truncate" title={q.content}>{q.content.slice(0, 80)}{q.content.length > 80 ? "..." : ""}</div>
                          </td>
                          <td className="p-3"><StatusBadge status={q.status} /></td>
                          <td className="p-3 text-right space-x-1 whitespace-nowrap">
                            <button data-testid={`edit-${q.id}`} onClick={() => setEditing(q)} className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Edit">
                              <Pencil size={13} />
                            </button>
                            <button data-testid={`del-${q.id}`} onClick={() => removeItem(q.id)} className="p-1.5 hover:bg-rose-50 rounded text-rose-600" title="Delete">
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            {/* Add Content */}
            <TabsContent value="add" className="pt-4 space-y-4">
              <div className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Choose how to add content</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  data-testid="mode-single"
                  onClick={() => setMode("single")}
                  className={`text-left rounded-md border-2 p-4 transition ${mode === "single" ? "border-[#2563EB] bg-rose-50" : "border-slate-200 hover:border-slate-400"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-4 h-4 rounded-full border-2 ${mode === "single" ? "border-[#2563EB]" : "border-slate-400"} flex items-center justify-center`}>
                      {mode === "single" && <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>}
                    </span>
                    <span className="font-semibold text-sm">Add Single Content Item</span>
                  </div>
                  <p className="text-xs text-slate-500">Add one message for a specific day or slot.</p>
                </button>
                <button
                  data-testid="mode-bulk"
                  onClick={() => setMode("bulk")}
                  className={`text-left rounded-md border-2 p-4 transition ${mode === "bulk" ? "border-[#2563EB] bg-rose-50" : "border-slate-200 hover:border-slate-400"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-4 h-4 rounded-full border-2 ${mode === "bulk" ? "border-[#2563EB]" : "border-slate-400"} flex items-center justify-center`}>
                      {mode === "bulk" && <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>}
                    </span>
                    <span className="font-semibold text-sm">Bulk Add Content</span>
                  </div>
                  <p className="text-xs text-slate-500">Add multiple content items at once using a structured form.</p>
                </button>
              </div>

              <div className="rounded-md bg-sky-50 border border-sky-200 p-3 text-xs text-sky-800">
                <strong className="font-bold">Note:</strong> For Daily apps, Day 1 content sends on day 1 after subscription, Day 2 on day 2, and so on. Subscribers who join later start from Day 1 regardless of the current queue position.
              </div>

              {mode === "single" ? (
                <div className="border border-slate-200 rounded-md p-4 space-y-3">
                  <div>
                    <Label>Target Slot<Req /></Label>
                    <Select value={single.slot} onValueChange={(v) => setSingle({ ...single, slot: v })}>
                      <SelectTrigger data-testid="single-slot"><SelectValue placeholder="Pick a slot" /></SelectTrigger>
                      <SelectContent className="max-h-72">
                        {availableSlots.map((s) => <SelectItem key={s.label} value={s.label}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Send Time</Label>
                    <Input value={app.schedule?.time || "09:00 AM"} disabled className="bg-slate-50" data-testid="single-time" />
                    <p className="text-xs text-slate-500 mt-1">Configured at app creation</p>
                  </div>
                  <div>
                    <Label>Message Content<Req /></Label>
                    <Textarea
                      data-testid="single-message"
                      maxLength={300}
                      rows={3}
                      value={single.message}
                      onChange={(e) => setSingle({ ...single, message: e.target.value })}
                    />
                    <p className="text-xs text-slate-500 text-right mt-1">{single.message.length} / 300</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <RadioGroup value={single.status} onValueChange={(v) => setSingle({ ...single, status: v })} className="flex gap-4 mt-1">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <RadioGroupItem value="Save as Draft" data-testid="single-draft" /> Save as Draft
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <RadioGroupItem value="Queue for Sending" data-testid="single-queue" /> Queue for Sending
                      </label>
                    </RadioGroup>
                  </div>
                  <Button data-testid="single-add" onClick={addSingle} className="bg-[#2563EB] hover:bg-[#1D4ED8]">
                    <Plus size={14} className="mr-1.5" /> Add to Queue
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-md bg-slate-50 border border-slate-200 p-3 text-xs">
                    You are creating content for <span className="font-bold">{app.name}</span>. Each slot maps to one scheduled delivery based on your <span className="font-semibold">{app.schedule?.type || "Daily"}</span> configuration.
                  </div>
                  <div className="space-y-3">
                    {bulkRows.map((row, i) => {
                      const slotIdx = availableSlots[i];
                      return (
                        <div key={row.id} data-testid={`bulk-row-${row.id}`} className="border border-slate-200 rounded-md p-3 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-sm">
                              {slotIdx?.label || `Slot ${i + 1}`}
                              <span className="text-slate-400 font-normal ml-2 text-xs">— {slotIdx?.time || app.schedule?.time || "09:00 AM"}</span>
                            </div>
                            {bulkRows.length > 1 && (
                              <button
                                data-testid={`bulk-remove-${row.id}`}
                                onClick={() => removeBulkRow(row.id)}
                                className="text-xs text-rose-600 hover:underline"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <Textarea
                            data-testid={`bulk-msg-${row.id}`}
                            maxLength={300}
                            rows={2}
                            placeholder={`Content for ${slotIdx?.label || `slot ${i + 1}`}...`}
                            value={row.message}
                            onChange={(e) => updateBulkRow(row.id, e.target.value)}
                          />
                          <p className="text-xs text-slate-500 text-right mt-1">{row.message.length} / 300</p>
                        </div>
                      );
                    })}
                  </div>
                  <Button variant="outline" size="sm" data-testid="bulk-add-row" onClick={addBulkRow}>
                    <Plus size={14} className="mr-1" /> Add Row
                  </Button>
                  <div className="flex gap-2">
                    <Button data-testid="bulk-save-draft" variant="outline" onClick={() => saveBulk("Draft")}>Save All as Draft</Button>
                    <Button data-testid="bulk-queue" onClick={() => saveBulk("Queued")} className="bg-[#2563EB] hover:bg-[#1D4ED8]">Queue All</Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} data-testid="sc-close">Close</Button>
        </DialogFooter>

        {/* Edit dialog */}
        <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent data-testid="edit-content-dialog" className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Content · {editing?.slot}</DialogTitle>
              <DialogDescription>Update the scheduled content for this slot.</DialogDescription>
            </DialogHeader>
            {editing && (
              <div className="space-y-3">
                <Textarea
                  data-testid="edit-content-text"
                  maxLength={300}
                  rows={4}
                  value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                />
                <p className="text-xs text-slate-500 text-right">{editing.content.length} / 300</p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button
                data-testid="edit-save"
                onClick={() => {
                  setQueue((p) => p.map((q) => q.id === editing.id ? editing : q));
                  toast.success("Content updated");
                  setEditing(null);
                }}
                className="bg-[#2563EB] hover:bg-[#1D4ED8]"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};
