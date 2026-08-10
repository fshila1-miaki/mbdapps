import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Logo } from "../components/Layout";
import { Req } from "../components/FieldLabel";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../components/ui/select";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", username: "", gender: "", email: "", password: "", organization: "", phone: "" });
  const [errors, setErrors] = useState({});

  const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e?.target ? e.target.value : e }));

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name) errs.name = "Required";
    if (!form.username) errs.username = "Required";
    if (!form.gender) errs.gender = "Required";
    if (!form.email) errs.email = "Required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.password) errs.password = "Required";
    else if (form.password.length < 6) errs.password = "Min 6 chars";
    if (!form.organization) errs.organization = "Required";
    if (!form.phone) errs.phone = "Required";
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    navigate("/login", { state: { registered: true } });
  };

  return (
    <div className="orbit-app min-h-screen flex flex-col items-start px-4 sm:px-10 py-10 lg:py-16" style={{ fontFamily: "'Inter', sans-serif", background: "var(--bg)", color: "var(--text)" }}>
      <Logo />
      <div className="max-w-2xl w-full mx-auto mt-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight font-semibold mb-2" style={{ color: "var(--text)" }}>
          Create your Orbit account
        </h1>
        <p className="mb-8" style={{ color: "var(--text-muted)" }}>Join thousands of developers building on the Robi network.</p>

        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="register-form" autoComplete="on">
          <div>
            <Label htmlFor="name">Full Name<Req /></Label>
            <Input id="name" value={form.name} onChange={update("name")} placeholder="Rafiul Karim"
              className={errors.name ? "border-rose-500" : ""} data-testid="register-name" autoComplete="name" />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="username">Username<Req /></Label>
            <Input id="username" value={form.username} onChange={update("username")} placeholder="rafiul"
              className={errors.username ? "border-rose-500" : ""} data-testid="register-username" autoComplete="username" />
            {errors.username && <p className="text-xs text-rose-600 mt-1">{errors.username}</p>}
          </div>
          <div>
            <Label htmlFor="gender">Gender<Req /></Label>
            <Select value={form.gender} onValueChange={update("gender")}>
              <SelectTrigger id="gender" data-testid="register-gender" className={errors.gender ? "border-rose-500" : ""}><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-xs text-rose-600 mt-1">{errors.gender}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email<Req /></Label>
            <Input id="email" type="email" value={form.email} onChange={update("email")} placeholder="you@company.com"
              className={errors.email ? "border-rose-500" : ""} data-testid="register-email" autoComplete="email" />
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password<Req /></Label>
            <Input id="password" type="password" value={form.password} onChange={update("password")}
              className={errors.password ? "border-rose-500" : ""} data-testid="register-password" autoComplete="new-password" />
            {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
          </div>
          <div>
            <Label htmlFor="organization">Organization<Req /></Label>
            <Input id="organization" value={form.organization} onChange={update("organization")} placeholder="Orbit"
              className={errors.organization ? "border-rose-500" : ""} data-testid="register-organization" autoComplete="organization" />
            {errors.organization && <p className="text-xs text-rose-600 mt-1">{errors.organization}</p>}
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="phone">Phone<Req /></Label>
            <Input id="phone" value={form.phone} onChange={update("phone")} placeholder="+8801711000000"
              className={errors.phone ? "border-rose-500" : ""} data-testid="register-phone" autoComplete="tel" />
            {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
          </div>
          <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-3 pt-4">
            <Button data-testid="register-submit" type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-11 px-8">Create Account</Button>
            <Link to="/login" data-testid="goto-login" className="text-sm text-slate-500 hover:text-[#09090B]">Back to sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
