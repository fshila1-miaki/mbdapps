import React, { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import { Th, Td, SlidePanel, Field, Input, Button } from "./_shared";
import { Search, MessageSquare, Printer, RefreshCw } from "lucide-react";

const STATUS_COLORS = {
  "New": "bg-amber-100 text-amber-700",
  "Processing": "bg-blue-100 text-blue-700",
  "Shipped": "bg-orange-100 text-orange-700",
  "Delivered": "bg-emerald-100 text-emerald-700",
  "Cancelled": "bg-rose-100 text-rose-700",
  "Refunded": "bg-slate-200 text-slate-700",
};

const Orders = () => {
  const { app } = useOutletContext();
  const { cmsCollections, updateOrderStatus } = useApp();
  const orders = (cmsCollections.orders || {})[app.id] || [];
  const [tab, setTab] = useState("All");
  const [q, setQ] = useState("");
  const [viewing, setViewing] = useState(null);

  const filtered = useMemo(() => {
    let f = orders;
    if (tab !== "All") f = f.filter((o) => o.status === tab);
    if (q) f = f.filter((o) => o.id.toLowerCase().includes(q.toLowerCase()) || o.customer?.toLowerCase().includes(q.toLowerCase()));
    return f;
  }, [orders, tab, q]);

  const todayTotal = orders.filter((o) => o.date === new Date().toISOString().slice(0, 10)).reduce((s, o) => s + o.total, 0);
  const weekTotal = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-4" data-testid="cms-orders">
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-xs text-slate-500">Manage all customer orders — update status, contact customers, issue refunds</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded px-2">
          <Search size={14} className="text-slate-400" />
          <Input data-testid="orders-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order ID or customer..." className="border-0 bg-transparent h-8 text-sm w-44" />
        </div>
      </div>

      {/* Analytics strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 grid grid-cols-2 lg:grid-cols-4 gap-3" data-testid="orders-analytics">
        <div><div className="text-[10px] uppercase text-slate-500 font-bold">Today</div><div className="text-lg font-bold">{orders.filter((o) => o.date === new Date().toISOString().slice(0, 10)).length} orders</div><div className="text-xs text-slate-500">BDT {todayTotal.toLocaleString()}</div></div>
        <div><div className="text-[10px] uppercase text-slate-500 font-bold">This Week</div><div className="text-lg font-bold">{orders.length} orders</div><div className="text-xs text-slate-500">BDT {weekTotal.toLocaleString()}</div></div>
        <div><div className="text-[10px] uppercase text-slate-500 font-bold">Avg Order Value</div><div className="text-lg font-bold">BDT {orders.length ? Math.round(weekTotal / orders.length) : 0}</div></div>
        <div><div className="text-[10px] uppercase text-slate-500 font-bold">Pending</div><div className="text-lg font-bold text-amber-600">{orders.filter((o) => o.status === "New").length}</div></div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 flex-wrap" data-testid="orders-tabs">
        {["All","New","Processing","Shipped","Delivered","Cancelled"].map((t) => (
          <button key={t} onClick={() => setTab(t)} data-testid={`tab-${t.toLowerCase()}`} className={`text-xs px-3 py-1.5 rounded-full ${tab === t ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
            {t} {t !== "All" && <span className="ml-1 opacity-70">{orders.filter((o) => o.status === t).length}</span>}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="orders-table">
            <thead className="bg-slate-50">
              <tr><Th>Order ID</Th><Th>Customer</Th><Th>Items</Th><Th>Total</Th><Th>Payment</Th><Th>Status</Th><Th>Date</Th><Th>Actions</Th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><Td className="text-center text-slate-400" colSpan={8}>No orders found</Td></tr>}
              {filtered.map((o) => (
                <tr key={o.id} data-testid={`order-row-${o.id}`}>
                  <Td className="font-mono text-xs">{o.id}</Td>
                  <Td>{o.customer}</Td>
                  <Td>{o.items.length} item(s)</Td>
                  <Td className="font-bold">BDT {o.total.toLocaleString()}</Td>
                  <Td>{o.method}</Td>
                  <Td><span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_COLORS[o.status]}`}>{o.status}</span></Td>
                  <Td className="text-xs text-slate-500">{o.date}</Td>
                  <Td><button data-testid={`view-order-${o.id}`} onClick={() => setViewing(o)} className="text-xs font-bold text-rose-600 hover:underline">View</button></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <OrderDetailPanel order={viewing} onClose={() => setViewing(null)} appId={app.id} onUpdate={updateOrderStatus} />
    </div>
  );
};

const OrderDetailPanel = ({ order, onClose, appId, onUpdate }) => {
  const [status, setStatus] = useState(order?.status);
  const [smsOpen, setSmsOpen] = useState(false);
  const [smsText, setSmsText] = useState("");
  React.useEffect(() => setStatus(order?.status), [order]);
  if (!order) return null;

  const steps = ["New","Processing","Shipped","Delivered"];
  const currentStep = steps.indexOf(order.status);

  const saveStatus = () => {
    onUpdate(appId, order.id, status);
    toast.success(`✓ Order ${order.id} → ${status}`);
    onClose();
  };

  return (
    <SlidePanel open={!!order} onClose={onClose} title={`Order ${order.id}`} description={`${order.date} · ${order.method}`}>
      <div className="bg-slate-50 rounded-lg p-3 text-sm">
        <div className="font-bold">{order.customer}</div>
        <div className="text-xs text-slate-600">{order.phone}</div>
        <div className="text-xs text-slate-600">{order.address}</div>
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Items</div>
        <ul className="space-y-2">
          {order.items.map((it, i) => (
            <li key={i} className="flex items-center justify-between text-sm border border-slate-200 rounded p-2">
              <span>{it.name} × {it.qty}</span>
              <span className="font-bold">BDT {it.price.toLocaleString()}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-2 font-bold border-t border-slate-200 pt-2"><span>Total</span><span>BDT {order.total.toLocaleString()}</span></div>
      </div>

      {/* Status timeline */}
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Status Timeline</div>
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-col items-center text-center flex-1 relative">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i <= currentStep ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>{i + 1}</div>
              <div className="text-[10px] mt-1">{s}</div>
              {i < steps.length - 1 && <div className={`absolute top-2.5 left-1/2 w-full h-px ${i < currentStep ? "bg-emerald-500" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>
      </div>

      <Field label="Update Status">
        <select data-testid="update-status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-slate-200 rounded h-9 text-sm px-2">
          {["New","Processing","Shipped","Delivered","Cancelled","Refunded"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-2">
        <Button data-testid="save-order-status" onClick={saveStatus} className="bg-[#2563EB]"><RefreshCw size={12} className="mr-1" /> Save Status</Button>
        <Button variant="outline" data-testid="print-invoice" onClick={() => toast.success("📄 Invoice PDF ready — download started")}><Printer size={12} className="mr-1" /> Print Invoice</Button>
        <Button variant="outline" data-testid="contact-customer" onClick={() => setSmsOpen(true)}><MessageSquare size={12} className="mr-1" /> Contact Customer</Button>
        <Button variant="outline" data-testid="issue-refund" onClick={() => { if (window.confirm("Issue full refund?")) { toast.success("Refund initiated"); onClose(); } }} className="text-rose-600">Issue Refund</Button>
      </div>

      {smsOpen && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-2" data-testid="sms-compose">
          <div className="text-xs font-bold text-blue-800 mb-1">📨 Send SMS via Orbit</div>
          <textarea value={smsText} onChange={(e) => setSmsText(e.target.value)} placeholder={`Hi ${order.customer}, your order ${order.id} update...`} className="w-full border border-blue-200 rounded p-2 text-sm h-20" />
          <div className="flex gap-2 mt-2">
            <Button size="sm" data-testid="send-sms" onClick={() => { toast.success(`📨 SMS sent to ${order.phone} via Orbit`); setSmsOpen(false); setSmsText(""); }} className="bg-blue-600">Send SMS</Button>
            <Button size="sm" variant="outline" onClick={() => setSmsOpen(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </SlidePanel>
  );
};

export default Orders;
