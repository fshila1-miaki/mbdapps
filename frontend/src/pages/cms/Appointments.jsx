import React, { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import { Th, Td, SlidePanel, Field, Input, Button } from "./_shared";
import { Plus, Calendar as CalIcon, List } from "lucide-react";

const STATUS_COLORS = {
  "Scheduled": "bg-amber-100 text-amber-700",
  "Confirmed": "bg-blue-100 text-blue-700",
  "Completed": "bg-emerald-100 text-emerald-700",
  "Cancelled": "bg-rose-100 text-rose-700",
  "No-show": "bg-slate-200 text-slate-700",
};

const Appointments = () => {
  const { app } = useOutletContext();
  const { cmsCollections, appContent, updateAppointmentStatus, addAppointment } = useApp();
  const appointments = (cmsCollections.appointments || {})[app.id] || [];
  const doctors = appContent[app.id]?.doctors || [];
  const [view, setView] = useState("list");
  const [adding, setAdding] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const monthAppointments = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear(), month = now.getMonth();
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startWeekday = first.getDay();
    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, dateStr, count: appointments.filter((a) => a.date === dateStr).length });
    }
    return cells;
  }, [appointments]);

  const filtered = selectedDate ? appointments.filter((a) => a.date === selectedDate) : appointments;

  return (
    <div className="space-y-4" data-testid="cms-appointments">
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div><h1 className="text-2xl font-bold">Appointments ({appointments.length})</h1><p className="text-xs text-slate-500">Manage bookings across all doctors</p></div>
        <div className="flex gap-2">
          <div className="inline-flex bg-slate-100 rounded p-0.5">
            <button data-testid="view-calendar" onClick={() => setView("calendar")} className={`px-3 py-1 text-xs font-bold rounded ${view === "calendar" ? "bg-white shadow" : "text-slate-600"}`}><CalIcon size={12} className="inline mr-1" /> Calendar</button>
            <button data-testid="view-list" onClick={() => setView("list")} className={`px-3 py-1 text-xs font-bold rounded ${view === "list" ? "bg-white shadow" : "text-slate-600"}`}><List size={12} className="inline mr-1" /> List</button>
          </div>
          <Button data-testid="add-appointment" onClick={() => setAdding(true)} className="bg-[#e11d48] hover:bg-[#be123c] gap-1"><Plus size={14} /> Add Appointment</Button>
        </div>
      </div>

      {view === "calendar" ? (
        <div className="bg-white border border-slate-200 rounded-xl p-4" data-testid="appointments-calendar">
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {monthAppointments.map((cell, i) => (
              <button key={i} disabled={!cell} onClick={() => cell && setSelectedDate(cell.dateStr)}
                className={`aspect-square border rounded p-1 text-left text-xs ${!cell ? "invisible" : selectedDate === cell?.dateStr ? "bg-rose-50 border-rose-300" : "border-slate-200 hover:bg-slate-50"}`}>
                {cell && <>
                  <div className="font-bold">{cell.day}</div>
                  {cell.count > 0 && <div className="mt-1 inline-block bg-emerald-500 text-white text-[9px] px-1 rounded">{cell.count}</div>}
                </>}
              </button>
            ))}
          </div>
          {selectedDate && <div className="mt-3 text-xs text-slate-500">Showing {filtered.length} appointment(s) for {selectedDate} <button onClick={() => setSelectedDate("")} className="text-rose-600 ml-2 font-bold">Clear</button></div>}
        </div>
      ) : null}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="appointments-table">
            <thead className="bg-slate-50">
              <tr><Th>Date</Th><Th>Time</Th><Th>Patient</Th><Th>Doctor</Th><Th>Fee</Th><Th>Status</Th><Th>Actions</Th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><Td className="text-center text-slate-400" colSpan={7}>No appointments</Td></tr>}
              {filtered.slice(0, 20).map((a) => (
                <tr key={a.id} data-testid={`apt-row-${a.id}`}>
                  <Td className="font-mono text-xs">{a.date}</Td>
                  <Td>{a.time}</Td>
                  <Td><div>{a.patient}</div><div className="text-[10px] text-slate-500">{a.phone}</div></Td>
                  <Td><div>{a.doctor}</div><div className="text-[10px] text-slate-500">{a.specialty}</div></Td>
                  <Td className="font-bold">৳{a.fee}</Td>
                  <Td><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_COLORS[a.status]}`}>{a.status}</span></Td>
                  <Td>
                    <div className="flex items-center gap-1 flex-wrap">
                      {a.status === "Scheduled" && <button data-testid={`confirm-apt-${a.id}`} onClick={() => { updateAppointmentStatus(app.id, a.id, "Confirmed"); toast.success(`Appointment ${a.id} confirmed`); }} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">Confirm</button>}
                      {a.status !== "Completed" && a.status !== "Cancelled" && <button data-testid={`complete-apt-${a.id}`} onClick={() => { updateAppointmentStatus(app.id, a.id, "Completed"); toast.success("Marked complete"); }} className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold">Complete</button>}
                      <button data-testid={`remind-apt-${a.id}`} onClick={() => toast.success(`📨 SMS reminder sent to ${a.patient} via Orbit`)} className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold">Remind</button>
                      {a.status !== "Cancelled" && <button data-testid={`cancel-apt-${a.id}`} onClick={() => { if (window.confirm("Cancel this appointment?")) { updateAppointmentStatus(app.id, a.id, "Cancelled"); toast.success("Cancelled"); } }} className="text-[10px] text-rose-600 px-2 py-1 hover:bg-rose-50 rounded font-bold">Cancel</button>}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor Schedule Manager */}
      <div className="bg-white border border-slate-200 rounded-xl p-4" data-testid="doctor-schedule">
        <div className="text-sm font-bold mb-3">Doctor Schedule Manager</div>
        <div className="space-y-2">
          {doctors.map((d) => (
            <div key={d.id} className="border border-slate-200 rounded p-2.5">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">{d.name} <span className="text-xs text-slate-500 font-normal">· {d.specialty}</span></div>
                <button data-testid={`block-doc-${d.id}`} onClick={() => toast.success(`${d.name} blocked for selected date`)} className="text-[10px] bg-rose-50 text-rose-700 px-2 py-1 rounded font-bold">Block today</button>
              </div>
              <div className="grid grid-cols-7 gap-1 mt-2">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => {
                  const avail = (d.days || []).includes(day);
                  return <div key={day} className={`text-[10px] text-center rounded py-1 ${avail ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{day}</div>;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddAppointmentPanel open={adding} onClose={() => setAdding(false)} doctors={doctors} onAdd={(apt) => { addAppointment(app.id, apt); toast.success("✓ Appointment booked"); setAdding(false); }} />
    </div>
  );
};

const AddAppointmentPanel = ({ open, onClose, doctors, onAdd }) => {
  const [v, setV] = useState({});
  React.useEffect(() => { if (!open) setV({}); }, [open]);
  const selectedDoctor = doctors.find((d) => d.name === v.doctor);
  const slots = selectedDoctor ? ["10:00","11:00","12:00","15:00","16:00","17:00","18:00"] : [];

  const submit = () => {
    if (!v.patient || !v.phone || !v.doctor || !v.date || !v.time) {
      toast.error("Please fill all required fields"); return;
    }
    onAdd({ ...v, specialty: selectedDoctor?.specialty, fee: selectedDoctor?.fee });
  };

  return (
    <SlidePanel open={open} onClose={onClose} title="Book Appointment" description="For walk-in bookings"
      footer={<Button data-testid="book-apt" onClick={submit} className="w-full bg-[#e11d48]">Book Appointment</Button>}>
      <Field label="Patient Name" required><Input data-testid="apt-patient" value={v.patient || ""} onChange={(e) => setV({ ...v, patient: e.target.value })} /></Field>
      <Field label="Patient Phone" required><Input data-testid="apt-phone" value={v.phone || ""} onChange={(e) => setV({ ...v, phone: e.target.value })} placeholder="+880 17..." /></Field>
      <Field label="Doctor" required>
        <select data-testid="apt-doctor" value={v.doctor || ""} onChange={(e) => setV({ ...v, doctor: e.target.value })} className="w-full border border-slate-200 rounded h-9 text-sm px-2">
          <option value="">Select doctor</option>
          {doctors.map((d) => <option key={d.id}>{d.name}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Date" required><Input data-testid="apt-date" type="date" value={v.date || ""} onChange={(e) => setV({ ...v, date: e.target.value })} /></Field>
        <Field label="Time Slot" required>
          <select data-testid="apt-time" value={v.time || ""} onChange={(e) => setV({ ...v, time: e.target.value })} className="w-full border border-slate-200 rounded h-9 text-sm px-2">
            <option value="">Select</option>
            {slots.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
      </div>
    </SlidePanel>
  );
};

export default Appointments;
