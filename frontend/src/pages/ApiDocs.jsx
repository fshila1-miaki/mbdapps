import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../components/Layout";
import { Button } from "../components/ui/button";

const SECTIONS = [
  {
    key: "start", label: "Getting Started",
    body: (
      <>
        <p className="leading-relaxed">Welcome to the <strong>Orbit Developer API</strong>. This documentation explains how to authenticate and call our telecom services to build SMS, USSD, OTP and Subscription apps for 76M Robi subscribers.</p>
        <h3 className="font-bold tracking-tight mt-4">Authentication</h3>
        <p className="leading-relaxed">All API calls require an API key sent in the <code className="bg-slate-100 px-1 py-0.5 rounded">X-API-Key</code> header. Generate yours from the developer dashboard.</p>
      </>
    ),
    code: `curl https://api.orbit.app/v1/sms \\
  -H "X-API-Key: bd_live_xxxxxxxxxxxx" \\
  -H "Content-Type: application/json"`,
  },
  {
    key: "sms", label: "SMS API",
    body: <p className="leading-relaxed">Send (MT) and receive (MO) SMS messages through the Robi network. Supports keyword routing, delivery reports, and Bangla content.</p>,
    code: `POST /v1/sms/mt
{
  "to": "+8801711234567",
  "from": "Orbit",
  "message": "Welcome to Cricket Live Updates!",
  "deliveryReport": true
}

// Response
{
  "messageId": "msg_8f3a...",
  "status": "queued"
}`,
  },
  {
    key: "ussd", label: "USSD API",
    body: <p className="leading-relaxed">Build interactive USSD menu apps. The user dials your service code and your endpoint receives session callbacks.</p>,
    code: `POST {your_connection_url}
{
  "sessionId": "ussd_a1b2",
  "msisdn": "+8801711234567",
  "input": "1",
  "stage": 2
}

// Your response
{
  "text": "1. Check Balance\\n2. Buy Pack",
  "endSession": false
}`,
  },
  {
    key: "caas", label: "CaaS API",
    body: <p className="leading-relaxed">Charging-as-a-Service. Debit subscribers from mobile balance or wallet for premium content.</p>,
    code: `POST /v1/caas/debit
{
  "msisdn": "+8801711234567",
  "amount": 5.00,
  "currency": "BDT",
  "reference": "order_12345"
}`,
  },
  {
    key: "sub", label: "Subscription API",
    body: <p className="leading-relaxed">Manage recurring subscription billing with Daily/Weekly/Monthly frequencies and confirmation flow.</p>,
    code: `POST /v1/subscription/create
{
  "msisdn": "+8801711234567",
  "appId": "APP-1001",
  "frequency": "daily",
  "amount": 2.00
}`,
  },
  {
    key: "otp", label: "OTP API",
    body: <p className="leading-relaxed">Generate and verify one-time passwords for KYC, login, and transactions.</p>,
    code: `POST /v1/otp/send
{ "msisdn": "+8801711234567", "ttl": 300 }

POST /v1/otp/verify
{ "msisdn": "+8801711234567", "otp": "1234" }`,
  },
  {
    key: "down", label: "Downloadable API",
    body: <p className="leading-relaxed">Distribute APKs and resource bundles to subscribers through the Orbit Downloadable SDK.</p>,
    code: `// SDK init
OrbitSDK.init({
  apiKey: "bd_live_xxxxxxxxxxxx",
  appId: "APP-1001"
});`,
  },
];

const ApiDocs = () => {
  const [active, setActive] = useState("start");
  const sec = SECTIONS.find((s) => s.key === active);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Link to="/appstore"><Button variant="outline" size="sm" data-testid="docs-back-store">← App Store</Button></Link>
            <Link to="/register"><Button size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8]" data-testid="docs-signup">Sign up</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-[#09090B] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#09090B] via-[#1e293b] to-[#7f1d1d] opacity-90"></div>
        <div className="absolute -top-10 right-1/4 w-72 h-72 bg-[#2563EB]/20 rounded-full blur-3xl"></div>
        <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 py-14 md:py-20">
          <p className="text-xs uppercase tracking-widest text-[#2563EB] font-bold mb-3">API Reference · v1</p>
          <h1 className="text-4xl md:text-6xl tracking-tighter font-bold leading-[0.95] max-w-3xl" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Orbit Developer API Documentation
          </h1>
          <p className="text-slate-300 mt-4 max-w-2xl text-lg">
            Build powerful telecom apps with Robi's network. SMS, USSD, OTP, CaaS, and Subscription — all in one platform.
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row">
        <aside className="lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 lg:min-h-[calc(100vh-4rem)] p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 py-1">References</p>
          <nav className="space-y-1 mt-2">
            {SECTIONS.map((s) => (
              <button key={s.key} data-testid={`doc-nav-${s.key}`} onClick={() => setActive(s.key)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm min-h-[44px] transition ${active === s.key ? "bg-[#09090B] text-white" : "hover:bg-slate-100"}`}>
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 lg:p-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-widest font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Try It</span>
          </div>
          <h2 className="text-3xl md:text-4xl tracking-tighter font-bold text-[#09090B]" style={{ fontFamily: "'Outfit', sans-serif" }}>{sec.label}</h2>
          <div className="mt-4 text-slate-700 prose prose-slate max-w-none">{sec.body}</div>
          <div className="mt-6 bg-[#09090B] text-slate-100 rounded-md overflow-hidden">
            <div className="px-4 py-2 text-xs border-b border-white/10 flex items-center justify-between">
              <span className="font-mono uppercase tracking-widest text-slate-400">Example</span>
              <span className="font-mono text-[10px] text-slate-500">cURL · JSON</span>
            </div>
            <pre className="p-4 overflow-x-auto text-xs leading-relaxed font-mono whitespace-pre" data-testid={`doc-code-${sec.key}`}>{sec.code}</pre>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApiDocs;
