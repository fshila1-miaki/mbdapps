import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const Tile = ({ title, description, icon: Icon, to, accent = false, badge, testid }) => {
  const inner = (
    <div className={`group relative overflow-hidden border ${accent ? "border-[#2563EB]" : "border-slate-200"} rounded-md bg-white hover:border-[#09090B] transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 p-6 lg:p-8 flex flex-col gap-4 h-full`}>
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-md flex items-center justify-center ${accent ? "bg-[#2563EB] text-white" : "bg-slate-100 text-[#09090B]"}`}>
          {Icon && <Icon size={22} strokeWidth={2} />}
        </div>
        <ArrowUpRight size={18} className="text-slate-400 group-hover:text-[#2563EB] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>{title}</h3>
          {badge && <span className="text-[10px] uppercase font-bold tracking-widest bg-[#2563EB] text-white px-1.5 py-0.5 rounded">{badge}</span>}
        </div>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );

  return <Link data-testid={testid} to={to} className="block h-full">{inner}</Link>;
};

export default Tile;
