import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import { Th, Td, SlidePanel, Field, Input, Textarea, Button } from "./_shared";
import { Search, MessageSquare, Download as DL } from "lucide-react";

const Customers = () => {
  const { app } = useOutletContext();
  const { cmsCollections } = useApp();
  const customers = (cmsCollections.customers || {})[app.id] || [];
  const [q, setQ] = useState("");
  const [view, setView] = useState(null);
  const [smsText, setSmsText] = useState("");

  const filtered = q ? customers.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.phone?.includes(q)) : customers;
  const label = app.kind === "health" ? "Patients" : "Customers";

  return (
    <div className="space-y-4" data-testid="cms-customers">
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">{label} ({customers.length})</h1>
          <p className="text-xs text-slate-500">View customer profiles, message them, and track engagement</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded px-2">
            <Search size={14} className="text-slate-400" />
            <Input data-testid="cust-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name or phone..." className="border-0 bg-transparent h-8 text-sm w-44" />
          </div>
          <Button variant="outline" data-testid="cust-export" onClick={() => toast.success("📤 Export CSV started")} className="gap-1 text-xs"><DL size={12} /> Export CSV</Button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="customers-table">
            <thead className="bg-slate-50">
              <tr><Th>Name</Th><Th>Phone</Th><Th>Email</Th><Th>Orders</Th><Th>Total Spent</Th><Th>Last Order</Th><Th></Th></tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} data-testid={`cust-row-${c.id}`} className="hover:bg-slate-50 cursor-pointer" onClick={() => setView(c)}>
                  <Td className="font-semibold">{c.name}</Td>
                  <Td className="font-mono text-xs">{c.phone}</Td>
                  <Td className="text-xs text-slate-600">{c.email}</Td>
                  <Td>{c.orders}</Td>
                  <Td className="font-bold">BDT {c.spent.toLocaleString()}</Td>
                  <Td className="text-xs text-slate-500">{c.lastOrder}</Td>
                  <Td><button onClick={(e) => { e.stopPropagation(); setView(c); }} className="text-xs font-bold text-rose-600 hover:underline">View</button></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={!!view} onClose={() => setView(null)} title={view?.name} description={view?.email}>
        {view && <>
          <div className="bg-slate-50 rounded p-3 text-sm space-y-1">
            <div><b>Phone:</b> {view.phone}</div>
            <div><b>Total Orders:</b> {view.orders}</div>
            <div><b>Total Spent:</b> BDT {view.spent.toLocaleString()}</div>
            <div><b>Last Order:</b> {view.lastOrder}</div>
          </div>
          <Field label="Send SMS via Orbit">
            <Textarea data-testid="cust-sms-text" value={smsText} onChange={(e) => setSmsText(e.target.value)} placeholder={`Hi ${view.name}, ...`} rows={3} />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Button data-testid="send-cust-sms" onClick={() => { toast.success(`📨 SMS sent to ${view.phone} via Orbit`); setSmsText(""); setView(null); }} className="bg-blue-600 gap-1"><MessageSquare size={12} /> Send SMS</Button>
            <Button variant="outline" data-testid="add-note" onClick={() => toast.success("Note added")} className="text-xs">Add Note</Button>
          </div>
        </>}
      </SlidePanel>
    </div>
  );
};

export default Customers;
