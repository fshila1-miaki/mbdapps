import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import APIMonitor from "../../components/APIMonitor";
import { requestOTP, verifyOTP, userSubscription, sendSMS, notifySubscribers } from "../../services/OrbitAPI";
import { NewsWebPreview } from "../../components/digital/interactive/NewsPreview";

/**
 * Public NewsNow BD app.
 *
 * SINGLE SOURCE OF TRUTH: this page wraps the same NewsWebPreview component
 * that powers the /digital live preview. The /apps/newsnow live app is
 * therefore byte-identical to what users see when previewing the News
 * template in the App Builder. This page only adds:
 *   1. A thin outer toolbar (Back + Lang toggle)
 *   2. Real OrbitAPI calls (requestOTP / verifyOTP / userSubscription / sendSMS / notifySubscribers)
 *      bound to the preview's onPhoneSubmit / onOtpVerify hooks
 *   3. APIMonitor panel so visitors can see live telecom API traffic.
 */
const NewsNow = () => {
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
        toast.success(`OTP sent via Robi: ${otpRes._demo_otp}`, { description: "Charged via CaaS — Tk 0.50 SMS only", duration: 5000 });
      } else {
        toast.error("Failed to send OTP — please retry.");
      }
    } catch {
      toast.error("Failed to send OTP — please retry.");
    }
  };

  const handleOtpVerify = async (code) => {
    const enteredOtp = code || "123456";
    const subscriberMsisdn = `tel:88${authState.msisdn || "1711234567"}`;
    try {
      const verifyRes = await verifyOTP(authState.referenceNo || "DEMO_REF", enteredOtp);
      const subRes = await userSubscription(subscriberMsisdn, "SUB");
      await sendSMS([subscriberMsisdn], "You have subscribed to NewsNow BD breaking news alerts. Shortcode: 16222 | Unsub: Reply STOP", "16222");
      // Demo: also fire a sample broadcast so the activity feed lights up
      notifySubscribers("BREAKING: Bangladesh Economy Grows 6.5% — Read at newsnow.orbit.app", "APP_000375").catch(() => {});
      if (subRes.statusCode === "S1000") {
        toast.success("Subscribed to SMS alerts!", { description: verifyRes.statusCode === "S1000" ? "Verified via Robi OTP." : "Demo bypass — subscription confirmed." });
      }
    } catch {
      toast.error("Verification failed — please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfb]">
      {/* Thin outer toolbar — provides Back + Lang only. The masthead + nav
          come from the NewsWebPreview so the generated app exactly mirrors
          the live /digital preview. */}
      <div className="w-full bg-white/80 backdrop-blur sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <Link to="/appstore" data-testid="newsnow-back" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-900">
            <ChevronLeft size={16} /> {locale === "bn" ? "ফিরে" : "Back"}
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-500">{locale === "bn" ? "স্বাগতম, পাঠক" : "Welcome, Reader"}</span>
            <div className="inline-flex bg-slate-900/10 rounded-full border border-slate-900/20 p-0.5 text-[10px] font-bold">
              {["bn", "en"].map((l) => (
                <button key={l} data-testid={`lang-${l}`} onClick={() => setLocale(l)} className={`px-2.5 py-1 rounded-full transition-all ${locale === l ? "bg-slate-900 text-white" : "text-slate-700 opacity-70 hover:opacity-100"}`}>
                  {l === "bn" ? "বাংলা" : "EN"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Single source of truth — identical to the /digital Live Preview */}
      <div className="flex-1 flex flex-col" data-testid="newsnow-app">
        <NewsWebPreview
          cfg={{ appName: "NewsNow BD", tagline: "Bangladesh's Independent Daily", primary: "#111827", accent: "#dc2626", language }}
          onPhoneSubmit={handlePhoneSubmit}
          onOtpVerify={handleOtpVerify}
        />
      </div>

      <APIMonitor />
    </div>
  );
};

export default NewsNow;
