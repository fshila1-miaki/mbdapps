import React, { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import { Th, Td, SlidePanel, Field, Input, Textarea, Button } from "./_shared";
import { Star, Search, Flag, Trash2, Reply, Check, MessageSquare } from "lucide-react";

const Reviews = () => {
  const { app } = useOutletContext();
  const { cmsCollections, replyReview, removeReview, approveReview } = useApp();
  const reviews = (cmsCollections.reviews || {})[app.id] || [];
  const [filter, setFilter] = useState("All");
  const [replyTo, setReplyTo] = useState(null);
  const [reply, setReply] = useState("");

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;
  const counts = [5,4,3,2,1].map((s) => reviews.filter((r) => r.rating === s).length);

  const filtered = useMemo(() => {
    if (filter === "Pending") return reviews.filter((r) => r.status === "Pending");
    if (filter === "Flagged") return reviews.filter((r) => r.status === "Flagged");
    if (/^\d/.test(filter)) return reviews.filter((r) => r.rating === Number(filter[0]));
    return reviews;
  }, [reviews, filter]);

  return (
    <div className="space-y-4" data-testid="cms-reviews">
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">Reviews ({reviews.length})</h1>
          <p className="text-xs text-slate-500">Engage with your customers' feedback</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-6 items-center flex-wrap">
        <div className="text-center">
          <div className="text-4xl font-bold">{avg}</div>
          <div className="flex items-center justify-center gap-0.5 text-amber-500">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill={i < Math.round(avg) ? "currentColor" : "none"} />)}</div>
          <div className="text-[10px] text-slate-500 mt-1">{reviews.length} reviews</div>
        </div>
        <div className="flex-1 space-y-1 min-w-[200px]">
          {[5,4,3,2,1].map((s, i) => {
            const pct = reviews.length ? (counts[i] / reviews.length) * 100 : 0;
            return <div key={s} className="flex items-center gap-2 text-xs">
              <span className="w-6">{s}★</span>
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-amber-400" style={{ width: `${pct}%` }} /></div>
              <span className="w-8 text-right text-slate-500">{counts[i]}</span>
            </div>;
          })}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        {["All","5★","4★","3★","2★","1★","Pending","Flagged"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} data-testid={`review-filter-${f.replace("★","")}`} className={`text-xs px-3 py-1.5 rounded ${filter === f ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{f}</button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-sm text-slate-400">No reviews</div>}
        {filtered.map((r) => (
          <div key={r.id} data-testid={`review-${r.id}`} className="bg-white border border-slate-200 rounded-xl p-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 text-white flex items-center justify-center font-bold">{r.name?.[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-sm">{r.name}</span>
                    <span className="ml-2 text-[10px] text-slate-400">{r.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={11} fill={i < r.rating ? "currentColor" : "none"} />)}</div>
                </div>
                <div className="text-sm text-slate-700 mt-1">{r.text}</div>
                <div className="text-[10px] text-slate-500 mt-1">re: {r.target} · <span className="font-bold">{r.status}</span></div>
                {r.reply && (
                  <div className="mt-2 bg-rose-50 border-l-2 border-rose-300 p-2 text-xs rounded">
                    <div className="text-[10px] text-rose-700 font-bold">Your Reply</div>
                    {r.reply}
                  </div>
                )}
                <div className="mt-2 flex items-center gap-1">
                  {r.status === "Pending" && <button data-testid={`approve-review-${r.id}`} onClick={() => { approveReview(app.id, r.id); toast.success("Review approved"); }} className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold flex items-center gap-1"><Check size={10} /> Approve</button>}
                  <button data-testid={`reply-review-${r.id}`} onClick={() => { setReplyTo(r); setReply(r.reply || ""); }} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold flex items-center gap-1"><Reply size={10} /> Reply</button>
                  <button data-testid={`flag-review-${r.id}`} onClick={() => toast.success("Flagged for moderation")} className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold flex items-center gap-1"><Flag size={10} /> Flag</button>
                  <button data-testid={`del-review-${r.id}`} onClick={() => { if (window.confirm("Delete review?")) { removeReview(app.id, r.id); toast.success("Deleted"); } }} className="text-[10px] text-rose-600 px-2 py-1 hover:bg-rose-50 rounded font-bold flex items-center gap-1"><Trash2 size={10} /> Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SlidePanel open={!!replyTo} onClose={() => setReplyTo(null)} title="Reply to Review" description="Posted reply appears publicly under the review">
        <div className="bg-slate-50 rounded p-2 text-xs">"{replyTo?.text}" — {replyTo?.name}</div>
        <Field label="Your Response" required>
          <Textarea data-testid="reply-text" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Thank you for the feedback..." rows={4} />
        </Field>
        <Button data-testid="post-reply" onClick={() => { replyReview(app.id, replyTo.id, reply); toast.success("Reply posted on live site"); setReplyTo(null); setReply(""); }} className="w-full bg-[#2563EB]">Post Reply</Button>
      </SlidePanel>
    </div>
  );
};

export default Reviews;
