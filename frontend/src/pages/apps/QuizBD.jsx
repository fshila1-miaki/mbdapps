import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import APIMonitor from "../../components/APIMonitor";
import { requestOTP, verifyOTP, userSubscription, sendSMS, directDebit } from "../../services/OrbitAPI";
import { QuizWebPreview } from "../../components/digital/interactive/QuizPreview";

/**
 * Public QuizBD app.
 *
 * SINGLE SOURCE OF TRUTH: this page wraps the same QuizWebPreview component
 * that powers the /digital live preview. The /apps/quizbd live app is
 * therefore byte-identical to what users see when previewing the Quiz
 * template in the App Builder. This page only adds:
 *   1. A thin outer toolbar (Back + Lang toggle)
 *   2. Real OrbitAPI calls (requestOTP / verifyOTP / userSubscription / sendSMS / directDebit)
 *      bound to the preview's onPhoneSubmit / onOtpVerify / onFinish hooks
 *   3. APIMonitor panel so visitors can see live telecom API traffic.
 */
const QuizBD = () => {
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
      await sendSMS([subscriberMsisdn], "Welcome to QuizBD! Daily quiz starts at 9AM. Reply with A, B, C, or D. Good luck!", "16222");
      if (subRes.statusCode === "S1000") {
        toast.success("Welcome to QuizBD 🧠", { description: verifyRes.statusCode === "S1000" ? "Verified via Robi OTP." : "Demo bypass — registration confirmed." });
      }
    } catch {
      toast.error("Verification failed — please try again.");
    }
  };

  const handleFinish = async ({ score, total, category }) => {
    const subscriberMsisdn = `tel:88${authState.msisdn || "1711234567"}`;
    try {
      const earned = score * 10;
      await sendSMS([subscriberMsisdn], `QuizBD result: You scored ${score}/${total} in ${category || "General"}! +${earned} pts added.`, "16222");
      if (score >= total * 0.9) {
        // Champion bonus — directDebit credit (negative amount = credit)
        const dd = await directDebit(subscriberMsisdn, "-5", "QuizBD Prize Credit");
        toast.success("BDT 5 credited to your Robi balance!", { description: `Txn: ${dd.transactionId || "demo"}` });
      }
    } catch { /* APIMonitor will surface errors */ }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Thin outer toolbar — provides Back + Lang only. The TopBar + hero
          come from the QuizWebPreview so the generated app exactly mirrors
          the live /digital preview. */}
      <div className="w-full bg-white/80 backdrop-blur sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <Link to="/appstore" data-testid="quizbd-back" className="inline-flex items-center gap-1 text-sm font-semibold text-purple-800 hover:text-purple-900">
            <ChevronLeft size={16} /> {locale === "bn" ? "ফিরে" : "Back"}
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-500">{locale === "bn" ? "স্বাগতম, খেলোয়াড়" : "Welcome, Player"}</span>
            <div className="inline-flex bg-purple-900/10 rounded-full border border-purple-900/20 p-0.5 text-[10px] font-bold">
              {["bn", "en"].map((l) => (
                <button key={l} data-testid={`lang-${l}`} onClick={() => setLocale(l)} className={`px-2.5 py-1 rounded-full transition-all ${locale === l ? "bg-purple-700 text-white" : "text-purple-800 opacity-70 hover:opacity-100"}`}>
                  {l === "bn" ? "বাংলা" : "EN"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Single source of truth — identical to the /digital Live Preview */}
      <div className="flex-1 flex flex-col" data-testid="quizbd-app">
        <QuizWebPreview
          cfg={{ appName: "QuizBD", tagline: "Daily quiz · Live leaderboard", primary: "#7c3aed", accent: "#4338ca", language }}
          onPhoneSubmit={handlePhoneSubmit}
          onOtpVerify={handleOtpVerify}
          onFinish={handleFinish}
        />
      </div>

      <APIMonitor />
    </div>
  );
};

export default QuizBD;
