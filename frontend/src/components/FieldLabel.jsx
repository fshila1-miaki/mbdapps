import React from "react";
import { Label } from "./ui/label";

export const Req = () => <span className="text-[#2563EB] ml-0.5" aria-hidden>*</span>;
export const Opt = () => <span className="text-slate-400 text-xs font-normal ml-1">(Optional)</span>;

export const FieldLabel = ({ children, required, optional, htmlFor, className = "" }) => (
  <Label htmlFor={htmlFor} className={`flex items-center ${className}`}>
    {children}
    {required && <Req />}
    {optional && <Opt />}
  </Label>
);
