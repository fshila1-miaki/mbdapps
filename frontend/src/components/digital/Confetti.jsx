import React, { useEffect, useState } from "react";

const colors = ["#2563EB", "#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#facc15"];

const Confetti = ({ onDone }) => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setShow(false); onDone?.(); }, 3500);
    return () => clearTimeout(t);
  }, [onDone]);
  if (!show) return null;
  const pieces = Array.from({ length: 80 }).map((_, i) => ({ left: Math.random() * 100, color: colors[i % colors.length], delay: Math.random() * 0.8, dur: 2 + Math.random() * 1.5, size: 6 + Math.random() * 6 }));
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p, i) => (
        <span key={i} style={{ left: `${p.left}%`, top: 0, width: p.size, height: p.size, background: p.color, animation: `confettiFall ${p.dur}s linear ${p.delay}s forwards`, position: "absolute", display: "block", borderRadius: 2 }}></span>
      ))}
    </div>
  );
};

export default Confetti;
