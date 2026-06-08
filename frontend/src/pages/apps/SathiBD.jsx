import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import APIMonitor from "../../components/APIMonitor";
import { requestOTP, verifyOTP, userSubscription, sendSMS, directDebit } from "../../services/BDAppsAPI";
import { SathiBDWebPreview } from "../../components/digital/interactive/SathiBDPreview";

/**
 * Public SathiBD (সাথীBD) Matrimony app.
 *
 * SINGLE SOURCE OF TRUTH: reuses the exact SathiBDWebPreview component that
 * powers the /digital Step 5 Live Preview, so the generated app is identical
 * to the builder preview. This wrapper only adds:
 *   1. A thin outer toolbar (Back + Lang toggle)
 *   2. Real BDAppsAPI calls bound to the preview's onPhoneSubmit / onOtpVerify
 *      / onInterest / onSubscribe hooks
 *   3. APIMonitor panel showing live telecom API traffic.
 */
const SathiBD = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language === "bn" ? "bn" : "en";
  const setLocale = (l) => i18n.changeLanguage(l);
  const language = locale === "bn" ? "Bengali" : "English";

  const [authState, setAuthState] = useState({ msisdn: "", referenceNo: "" });

  const handlePhoneSubmit = async (phone) => {
    try {
      const clean = (phone || "").replace(/[^0-9]/g, "");
      const otpRes = await requestOTP(clean);
      if (otpRes.statusCode === "S1000") {
        setAuthState({ msisdn: clean, referenceNo: otpRes.referenceNo });
        toast.success(`OTP sent via Robi: ${otpRes._demo_otp}`, { description: "BDApps OTP API — Tk 0.50 SMS only", duration: 5000 });
      } else {
        toast.error("Failed to send OTP — please retry.");
      }
    } catch (_e) {
      toast.error("Failed to send OTP — please retry.");
    }
  };

  const handleOtpVerify = async (code) => {
    const enteredOtp = code || "123456";
    const subscriberMsisdn = `tel:88${authState.msisdn || "1700000000"}`;
    try {
      const verifyRes = await verifyOTP(authState.referenceNo || "DEMO_REF", enteredOtp);
      const subRes = await userSubscription(subscriberMsisdn, "SUB");
      await sendSMS([subscriberMsisdn], "Welcome to SathiBD! Browse verified profiles at sathibd.bdapps.app", "16222");
      if (subRes.statusCode === "S1000") {
        toast.success("Subscription activated", { description: verifyRes.statusCode === "S1000" ? "SathiBD plan is now live on your Robi number." : "Demo bypass — proceeding." });
      }
    } catch (_e) {
      toast.error("Verification failed — please try again.");
    }
  };

  const handleInterest = async (profile) => {
    if (!profile) return;
    try {
      await sendSMS([`tel:881700${String(Math.abs((profile.id || "x").charCodeAt(0) * 31) % 999999).padStart(6, "0")}`], `Md. Rafiul has expressed interest in your SathiBD profile. Log in to respond.`, "16222");
      toast.success("💌 Interest sent", { description: "SMS notification delivered via Robi." });
    } catch (_e) { /* APIMonitor shows error */ }
  };

  const handleSubscribe = async (plan) => {
    if (!plan) return;
    const subscriberMsisdn = `tel:88${authState.msisdn || "1700000000"}`;
    if (!plan.amount) {
      toast.success("✓ Free plan active", { description: "Browse profiles with limited contact unlocks." });
      return;
    }
    try {
      const dd = await directDebit(subscriberMsisdn, String(plan.amount), `SathiBD ${plan.name}`);
      await sendSMS([subscriberMsisdn], `SathiBD ${plan.name} activated! BDT ${plan.amount} deducted. Txn: ${dd.transactionId || "—"}`, "16222");
      // Feed the CMS "Revenue Today" live ticker (persist + broadcast)
      const total = (Number(localStorage.getItem("sathibd_revenue_today")) || 0) + plan.amount;
      localStorage.setItem("sathibd_revenue_today", String(total));
      window.dispatchEvent(new CustomEvent("sathibd:revenue", { detail: { amount: plan.amount, plan: plan.name, total } }));
      toast.success(`✓ Charged BDT ${plan.amount} via CaaS`, { description: `Plan: ${plan.name} · Txn: ${dd.transactionId || "demo-txn"}` });
    } catch (_e) {
      toast.error("Payment failed — please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="w-full bg-white/90 backdrop-blur sticky top-0 z-50" style={{ borderBottom: "1px solid #f6af0444" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <Link to="/appstore" data-testid="sathibd-back" className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "#d99400" }}>
            <ChevronLeft size={16} /> {locale === "bn" ? "ফিরে" : "Back"}
          </Link>
          <div className="inline-flex rounded-full border p-0.5 text-[10px] font-bold" style={{ borderColor: "#f6af0455" }}>
            {["bn", "en"].map((l) => (
              <button key={l} data-testid={`lang-${l}`} onClick={() => setLocale(l)} className="px-2.5 py-1 rounded-full transition-all" style={locale === l ? { background: "#f6af04", color: "#222" } : { color: "#999" }}>
                {l === "bn" ? "বাংলা" : "EN"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <SathiBDWebPreview
          cfg={{ appName: "SathiBD — Matrimony Portal", primary: "#f6af04", accent: "#d99400", language }}
          onPhoneSubmit={handlePhoneSubmit}
          onOtpVerify={handleOtpVerify}
          onInterest={handleInterest}
          onSubscribe={handleSubscribe}
        />
      </div>

      <APIMonitor />
    </div>
  );
};

export default SathiBD;
