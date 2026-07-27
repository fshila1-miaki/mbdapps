import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Logo } from "../components/Layout";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Eye, EyeOff } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "../components/ui/dialog";

const Login = () => {
  const { user, login } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  useEffect(() => {
    if (user) navigate(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    if (loc.state?.registered) toast.success(t("auth.accountCreated"));
    // eslint-disable-next-line
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!email) errs.email = t("common.required");
    if (!password) errs.password = t("common.required");
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const r = login(email.trim(), password);
    if (!r.ok) {
      toast.error(r.error);
      setErrors({ password: r.error });
      return;
    }
    toast.success(t("auth.welcomeBack"));
    navigate(r.role === "admin" ? "/admin" : "/dashboard", { replace: true });
  };

  const sendForgot = () => {
    if (!forgotEmail) return toast.error(t("auth.enterEmail"));
    toast.success(t("auth.resetSent"));
    setForgotOpen(false);
    setForgotEmail("");
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left - branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#09090B] text-white p-16 flex-col justify-between">
        <Logo className="text-white [&>span]:text-white" />
        <div className="space-y-6">
          <h1 className="text-5xl xl:text-6xl tracking-tighter leading-[0.95]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {t("auth.heroTitle1")} <span className="text-[#2563EB]">{t("auth.heroMillion")}</span> {t("auth.heroTitle2")}
          </h1>
          <p className="text-slate-300 max-w-md leading-relaxed">
            {t("auth.heroSub")}
          </p>
        </div>
        <div className="flex items-center gap-8 text-xs uppercase tracking-widest text-slate-400">
          <span>v 4.2.1</span>
          <span>SLA 99.95%</span>
          <span>API Docs</span>
        </div>
      </div>

      {/* Right - form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 bg-white relative">
        <div className="absolute top-4 right-6"><LanguageSwitcher /></div>
        <div className="w-full max-w-sm mx-auto">
          <div className="lg:hidden mb-12"><Logo /></div>
          <h2 className="text-3xl font-bold tracking-tight text-[#09090B] mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>{t("auth.signInTitle")}</h2>
          <p className="text-sm text-slate-500 mb-8">{t("auth.signInSubtitle")}</p>

          <form onSubmit={submit} className="space-y-4" data-testid="login-form">
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input data-testid="login-email" id="email" type="email" placeholder="developer@orbit.com"
                value={email} onChange={(e) => setEmail(e.target.value)} className={errors.email ? "border-rose-500" : ""} />
              {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="pwd">{t("auth.password")}</Label>
                <button type="button" onClick={() => setForgotOpen(true)} data-testid="forgot-password-link"
                  className="text-xs text-[#2563EB] hover:underline">{t("auth.forgotPassword")}</button>
              </div>
              <div className="relative">
                <Input data-testid="login-password" id="pwd" type={showPwd ? "text" : "password"}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "border-rose-500 pr-10" : "pr-10"} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
            </div>

            <Button data-testid="login-submit" type="submit" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-11">
              {t("auth.signIn")}
            </Button>

            <div className="text-center text-sm text-slate-500">
              {t("auth.noAccount")} <Link to="/register" data-testid="goto-register" className="text-[#2563EB] font-medium hover:underline">{t("auth.createOne")}</Link>
            </div>
          </form>

          <div className="mt-10 p-4 bg-slate-50 border border-slate-200 rounded-md">
            <p className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-2">{t("auth.demoCredentials")}</p>
            <div className="space-y-1 text-xs font-mono text-slate-700">
              <div>developer@orbit.com / dev123</div>
              <div>admin@orbit.com / admin123</div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent data-testid="forgot-dialog">
          <DialogHeader>
            <DialogTitle>{t("auth.resetPassword")}</DialogTitle>
            <DialogDescription>{t("auth.resetSub")}</DialogDescription>
          </DialogHeader>
          <Input data-testid="forgot-email" placeholder="you@example.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setForgotOpen(false)}>{t("common.cancel")}</Button>
            <Button data-testid="forgot-submit" onClick={sendForgot} className="bg-[#2563EB] hover:bg-[#1D4ED8]">{t("auth.sendLink")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
