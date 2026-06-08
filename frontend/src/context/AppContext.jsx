import React, { createContext, useContext, useEffect, useState } from "react";
import {
  seedApps, seedLiteApps, seedKeywords, seedSystemUsers, seedAppCreators,
  seedAppstoreUsers, seedBuildFiles, seedAds, seedSubscriptions, seedAppStore,
} from "../mocks/data";
import { SAMPLE_CONTENT, sampleOrders, sampleAppointments, sampleReviews, sampleCustomers, sampleActivity, getKindFor } from "../mocks/contentSeeds";

const AppContext = createContext(null);

const USERS = {
  "developer@bdapps.com": { password: "dev123", role: "developer", name: "Rafiul Karim", username: "developer" },
  "admin@bdapps.com": { password: "admin123", role: "admin", name: "System Admin", username: "admin" },
};

const safeParse = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => safeParse("bdapps_user", null));
  const [apps, setApps] = useState(() => safeParse("bdapps_apps", seedApps));
  const [liteApps, setLiteApps] = useState(() => {
    const existing = safeParse("bdapps_liteapps", null);
    if (!existing) return seedLiteApps;
    // Migration: ensure Service-type sample apps are present (LITE-005, LITE-006)
    const ids = new Set(existing.map((a) => a.id));
    const missing = seedLiteApps.filter((s) => !ids.has(s.id));
    return missing.length ? [...existing, ...missing] : existing;
  });
  const [keywords] = useState(seedKeywords);
  const [systemUsers, setSystemUsers] = useState(seedSystemUsers);
  const [appCreators] = useState(seedAppCreators);
  const [appstoreUsers] = useState(seedAppstoreUsers);
  const [buildFiles, setBuildFiles] = useState(() => safeParse("bdapps_buildfiles", seedBuildFiles));
  const [ads, setAds] = useState(() => safeParse("bdapps_ads", seedAds));
  const [subscriptions] = useState(seedSubscriptions);
  const [storeApps, setStoreApps] = useState(() => {
    // Force-refresh seed if SathiBD apps missing (migration to v5)
    const existing = safeParse("bdapps_store_v5", null);
    if (!existing || !existing.find((a) => a.id === "AS-SATHIBD")) return seedAppStore;
    return existing;
  });
  const [storeLayout, setStoreLayout] = useState(() => safeParse("bdapps_layout", { hero: "Discover Apps Built for Bangladesh", sub: "Subscribe via SMS in 1 step" }));
  const [appStoreUser, setAppStoreUser] = useState(() => safeParse("bdapps_storeuser", null));
  const [pendingTemplate, setPendingTemplate] = useState(null);

  // ============ CONTENT MANAGEMENT LAYER ============
  // Seed 4 mock launched apps with realistic content + statuses showcasing approval flow
  const seedMyApps = () => {
    const now = Date.now();
    return [
      { id: "APP-ROBIMART", name: "RobiMart BD", templateId: "web-ecom", templateType: "web", kind: "ecommerce", slug: "robimart-bd", status: "Live", icon: "🛒", color: "#ea580c", iconGradient: "from-orange-500 to-red-600", templateName: "E-Commerce Store", stats: { orders: 248, revenue: 184500, customers: 189, products: 8 }, launchedAt: new Date(now - 21 * 86400000).toISOString(), lastUpdated: new Date(now - 2 * 3600 * 1000).toISOString(), submittedAt: new Date(now - 23 * 86400000).toISOString(), version: "2.1.0" },
      { id: "APP-MEDILIFE", name: "Medilife Clinic", templateId: "web-health", templateType: "web", kind: "health", slug: "medilife-clinic", status: "Live", icon: "⚕️", color: "#0d9488", iconGradient: "from-teal-500 to-emerald-700", templateName: "Health & Wellness Clinic", stats: { appointments: 84, patients: 284, doctors: 4, visitors: 3200, rating: 4.6 }, launchedAt: new Date(now - 12 * 86400000).toISOString(), lastUpdated: new Date(now - 1 * 3600 * 1000).toISOString(), submittedAt: new Date(now - 14 * 86400000).toISOString(), version: "1.2.0" },
      { id: "APP-EDUPATH", name: "EduPath BD", templateId: "web-edu", templateType: "web", kind: "education", slug: "edupath-bd", status: "Live", icon: "📚", color: "#6366f1", iconGradient: "from-indigo-500 to-purple-700", templateName: "Online Learning Platform", stats: { visitors: 8240, students: 1840, courses: 6, revenue: 92000 }, launchedAt: new Date(now - 9 * 86400000).toISOString(), lastUpdated: new Date(now - 1 * 86400000).toISOString(), submittedAt: new Date(now - 11 * 86400000).toISOString(), version: "1.0.0", rejectionReason: null },
      { id: "APP-DESHIFOOD", name: "DeshiFood", templateId: "and-food", templateType: "android", kind: "restaurant", slug: "deshifood", status: "Live", icon: "🍽", color: "#dc2626", iconGradient: "from-red-500 to-rose-600", templateName: "Food Delivery App", stats: { downloads: 8400, rating: 4.7, reviews: 284, orders: 1284 }, launchedAt: new Date(now - 28 * 86400000).toISOString(), lastUpdated: new Date(now - 2 * 3600 * 1000).toISOString(), submittedAt: new Date(now - 30 * 86400000).toISOString(), version: "1.4.2" },
      { id: "APP-FITBD", name: "FitBD", templateId: "and-fitness", templateType: "android", kind: "fitness", slug: "fitbd", status: "Live", icon: "💪", color: "#16a34a", iconGradient: "from-green-500 to-lime-600", templateName: "Fitness Tracker App", stats: { downloads: 3100, rating: 4.5, reviews: 98 }, launchedAt: new Date(now - 14 * 86400000).toISOString(), lastUpdated: new Date(now - 4 * 3600 * 1000).toISOString(), submittedAt: new Date(now - 16 * 86400000).toISOString(), version: "1.1.0", rejectionReason: null },
      { id: "APP-SHOPLOCAL", name: "ShopLocal BD", templateId: "and-marketplace", templateType: "android", kind: "ecommerce", slug: "shoplocal-bd", status: "Pending Review", icon: "🏪", color: "#f59e0b", iconGradient: "from-amber-500 to-orange-600", templateName: "Local Marketplace App", stats: { downloads: 0 }, launchedAt: new Date(now - 1 * 86400000).toISOString(), lastUpdated: new Date(now - 1 * 86400000).toISOString(), submittedAt: new Date(now - 1 * 86400000).toISOString(), version: "1.0.0", rejectionReason: null },
      { id: "APP-SATHIBD", name: "SathiBD", templateId: "web-sathibd", templateType: "web", kind: "matrimony", slug: "sathibd", status: "Live", icon: "💑", color: "#f6af04", iconGradient: "from-rose-500 to-amber-500", templateName: "SathiBD Matrimony Portal", stats: { subscribers: 1840, registered: 3200, interests: 648, sms: 18400, revenue: 642160 }, launchedAt: new Date(now - 7 * 86400000).toISOString(), lastUpdated: new Date(now - 1 * 3600 * 1000).toISOString(), submittedAt: new Date(now - 9 * 86400000).toISOString(), version: "3.0.0" },
      { id: "APP-QUIZBD", name: "QuizBD", templateId: "pro-quiz", templateType: "pro", kind: "entertainment", slug: "quizbd", status: "Live", icon: "🧠", color: "#7c3aed", iconGradient: "from-purple-600 to-indigo-800", templateName: "Entertainment Quiz", stats: { subscribers: 184000, revenue: 896000, questions: 2400000 }, launchedAt: new Date(now - 35 * 86400000).toISOString(), lastUpdated: new Date(now - 30 * 60 * 1000).toISOString(), submittedAt: new Date(now - 37 * 86400000).toISOString(), version: "2.0.1" },
      { id: "APP-NEWSNOW", name: "NewsNow BD", templateId: "web-news", templateType: "web", kind: "news", slug: "newsnow", status: "Live", icon: "📰", color: "#475569", iconGradient: "from-slate-700 to-gray-900", templateName: "News & Media", stats: { subscribers: 94200, revenue: 461580, articles: 15 }, launchedAt: new Date(now - 22 * 86400000).toISOString(), lastUpdated: new Date(now - 4 * 3600 * 1000).toISOString(), submittedAt: new Date(now - 24 * 86400000).toISOString(), version: "1.5.2" },
      { id: "APP-FITBDPRO", name: "FitBD Pro", templateId: "and-fitness-pro", templateType: "android", kind: "fitness", slug: "fitbd", status: "Pending Review", icon: "💪", color: "#10b981", iconGradient: "from-lime-500 to-emerald-700", templateName: "Fitness Tracker", stats: { downloads: 0 }, launchedAt: new Date(now - 3 * 86400000).toISOString(), lastUpdated: new Date(now - 3 * 86400000).toISOString(), submittedAt: new Date(now - 3 * 86400000).toISOString(), version: "1.0.0", rejectionReason: null },
    ];
  };

  const seedAppContent = () => {
    const out = {};
    [["APP-ROBIMART","web-ecom"],["APP-DESHIFOOD","web-food"],["APP-MEDILIFE","web-health"]].forEach(([id, tid]) => {
      const content = SAMPLE_CONTENT[tid]();
      out[id] = content;
    });
    return out;
  };

  const seedCmsCollections = () => ({
    orders: { "APP-ROBIMART": sampleOrders("ecommerce"), "APP-DESHIFOOD": sampleOrders("restaurant") },
    appointments: { "APP-MEDILIFE": sampleAppointments() },
    reviews: { "APP-ROBIMART": sampleReviews(), "APP-DESHIFOOD": sampleReviews(), "APP-MEDILIFE": sampleReviews() },
    customers: { "APP-ROBIMART": sampleCustomers(), "APP-DESHIFOOD": sampleCustomers(), "APP-MEDILIFE": sampleCustomers() },
    activity: {
      "APP-ROBIMART": sampleActivity("ecommerce"),
      "APP-DESHIFOOD": sampleActivity("restaurant"),
      "APP-MEDILIFE": sampleActivity("health"),
    },
  });

  const [myApps, setMyApps] = useState(() => {
    const existing = safeParse("bdapps_myapps_v5", null);
    if (!existing || !existing.find((a) => a.id === "APP-SATHIBD")) return seedMyApps();
    return existing;
  });
  const [appContent, setAppContent] = useState(() => safeParse("bdapps_appcontent_v2", seedAppContent()));
  const [mediaLibrary, setMediaLibrary] = useState(() => safeParse("bdapps_media", []));
  const [cmsCollections, setCmsCollections] = useState(() => safeParse("bdapps_cms_v2", seedCmsCollections()));

  useEffect(() => localStorage.setItem("bdapps_myapps_v5", JSON.stringify(myApps)), [myApps]);
  useEffect(() => localStorage.setItem("bdapps_appcontent_v2", JSON.stringify(appContent)), [appContent]);
  useEffect(() => localStorage.setItem("bdapps_media", JSON.stringify(mediaLibrary)), [mediaLibrary]);
  useEffect(() => localStorage.setItem("bdapps_cms_v2", JSON.stringify(cmsCollections)), [cmsCollections]);

  const touchApp = (appId) => setMyApps((p) => p.map((a) => a.id === appId ? { ...a, lastUpdated: new Date().toISOString() } : a));

  const addMyApp = (app, content) => {
    const id = `APP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const entry = {
      id,
      name: app.name,
      templateId: app.templateId,
      templateType: app.type,
      kind: getKindFor(app.templateId),
      slug: app.slug || app.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      status: app.type === "android" ? "In Review" : "Live",
      icon: app.icon || "📱",
      color: app.color || "#0f172a",
      stats: { orders: 0, revenue: 0, customers: 0 },
      launchedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    setMyApps((p) => [entry, ...p]);
    if (content) setAppContent((p) => ({ ...p, [id]: content }));
    setCmsCollections((p) => ({
      ...p,
      activity: { ...p.activity, [id]: [{ type: "launch", text: `🚀 ${entry.name} launched`, ago: "just now" }] },
    }));
    return entry;
  };

  const updateAppContent = (appId, section, items) => {
    setAppContent((p) => ({ ...p, [appId]: { ...(p[appId] || {}), [section]: items } }));
    touchApp(appId);
  };
  const replaceAppContent = (appId, content) => {
    setAppContent((p) => ({ ...p, [appId]: content }));
    touchApp(appId);
  };
  const addCmsActivity = (appId, item) => {
    setCmsCollections((p) => ({
      ...p,
      activity: { ...p.activity, [appId]: [{ ago: "just now", ...item }, ...((p.activity || {})[appId] || [])].slice(0, 30) },
    }));
  };
  const updateOrderStatus = (appId, orderId, status) => {
    setCmsCollections((p) => ({
      ...p,
      orders: {
        ...p.orders,
        [appId]: (p.orders[appId] || []).map((o) => o.id === orderId ? { ...o, status } : o),
      },
    }));
    addCmsActivity(appId, { type: "order", text: `📦 Order ${orderId} → ${status}` });
    touchApp(appId);
  };
  const updateAppointmentStatus = (appId, aptId, status) => {
    setCmsCollections((p) => ({
      ...p,
      appointments: {
        ...p.appointments,
        [appId]: (p.appointments[appId] || []).map((a) => a.id === aptId ? { ...a, status } : a),
      },
    }));
    addCmsActivity(appId, { type: "appointment", text: `📅 Appointment ${aptId} → ${status}` });
    touchApp(appId);
  };
  const addAppointment = (appId, apt) => {
    const id = `APT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setCmsCollections((p) => ({
      ...p,
      appointments: { ...p.appointments, [appId]: [{ id, status: "Scheduled", ...apt }, ...((p.appointments || {})[appId] || [])] },
    }));
    addCmsActivity(appId, { type: "appointment", text: `📅 New appointment booked — ${apt.patient}` });
    touchApp(appId);
  };
  const replyReview = (appId, reviewId, reply) => {
    setCmsCollections((p) => ({
      ...p,
      reviews: {
        ...p.reviews,
        [appId]: (p.reviews[appId] || []).map((r) => r.id === reviewId ? { ...r, reply, status: "Approved" } : r),
      },
    }));
    touchApp(appId);
  };
  const removeReview = (appId, reviewId) => {
    setCmsCollections((p) => ({
      ...p,
      reviews: {
        ...p.reviews,
        [appId]: (p.reviews[appId] || []).filter((r) => r.id !== reviewId),
      },
    }));
    touchApp(appId);
  };
  const approveReview = (appId, reviewId) => {
    setCmsCollections((p) => ({
      ...p,
      reviews: {
        ...p.reviews,
        [appId]: (p.reviews[appId] || []).map((r) => r.id === reviewId ? { ...r, status: "Approved" } : r),
      },
    }));
    touchApp(appId);
  };

  const addMediaFile = (file) => {
    const id = `MED-${Math.random().toString(36).slice(2, 8)}`;
    const entry = { id, ...file, uploadedAt: new Date().toISOString(), folder: file.folder || "Miscellaneous" };
    setMediaLibrary((p) => [entry, ...p]);
    return entry;
  };
  const removeMediaFile = (id) => setMediaLibrary((p) => p.filter((f) => f.id !== id));
  const renameMediaFile = (id, name) => setMediaLibrary((p) => p.map((f) => f.id === id ? { ...f, name } : f));

  const updateMyApp = (appId, patch) => {
    setMyApps((p) => p.map((a) => a.id === appId ? { ...a, ...patch, lastUpdated: new Date().toISOString() } : a));
  };
  const removeMyApp = (appId) => {
    setMyApps((p) => p.filter((a) => a.id !== appId));
    setAppContent((p) => { const c = { ...p }; delete c[appId]; return c; });
  };

  // ============ APP APPROVAL FLOW ============
  const [appNotifs, setAppNotifs] = useState(() => safeParse("bdapps_appnotifs", []));
  useEffect(() => localStorage.setItem("bdapps_appnotifs", JSON.stringify(appNotifs)), [appNotifs]);

  const pushNotif = (notif) => setAppNotifs((p) => [{ id: `N-${Date.now()}`, time: new Date().toISOString(), read: false, ...notif }, ...p].slice(0, 30));
  const markNotifsRead = () => setAppNotifs((p) => p.map((n) => ({ ...n, read: true })));

  const approveMyApp = (appId) => {
    const app = myApps.find((a) => a.id === appId);
    setMyApps((p) => p.map((a) => a.id === appId ? { ...a, status: "Live", rejectionReason: null, lastUpdated: new Date().toISOString() } : a));
    pushNotif({ type: "approval", title: "App Approved 🎉", body: `Your app ${app?.name} has been approved and is now live on BDApps App Store!`, appId });
  };
  const rejectMyApp = (appId, reason) => {
    const app = myApps.find((a) => a.id === appId);
    setMyApps((p) => p.map((a) => a.id === appId ? { ...a, status: "Rejected", rejectionReason: reason, lastUpdated: new Date().toISOString() } : a));
    pushNotif({ type: "rejection", title: "App Rejected ❌", body: `Your app ${app?.name} was rejected. Reason: ${reason}. Review and resubmit.`, appId });
  };
  const resubmitMyApp = (appId) => {
    setMyApps((p) => p.map((a) => a.id === appId ? { ...a, status: "Pending Review", rejectionReason: null, submittedAt: new Date().toISOString() } : a));
  };

  // Approximate storage usage from media library data URLs
  const computeStorageBytes = () => mediaLibrary.reduce((sum, m) => sum + (m.size || (m.dataUrl ? m.dataUrl.length * 0.75 : 0)), 0);

  useEffect(() => {
    user ? localStorage.setItem("bdapps_user", JSON.stringify(user)) : localStorage.removeItem("bdapps_user");
  }, [user]);
  useEffect(() => localStorage.setItem("bdapps_apps", JSON.stringify(apps)), [apps]);
  useEffect(() => localStorage.setItem("bdapps_liteapps", JSON.stringify(liteApps)), [liteApps]);
  useEffect(() => localStorage.setItem("bdapps_ads", JSON.stringify(ads)), [ads]);
  useEffect(() => localStorage.setItem("bdapps_store_v5", JSON.stringify(storeApps)), [storeApps]);
  useEffect(() => localStorage.setItem("bdapps_layout", JSON.stringify(storeLayout)), [storeLayout]);
  useEffect(() => localStorage.setItem("bdapps_buildfiles", JSON.stringify(buildFiles)), [buildFiles]);
  useEffect(() => {
    appStoreUser ? localStorage.setItem("bdapps_storeuser", JSON.stringify(appStoreUser)) : localStorage.removeItem("bdapps_storeuser");
  }, [appStoreUser]);

  const login = (email, password) => {
    const u = USERS[email?.toLowerCase()];
    if (!u || u.password !== password) return { ok: false, error: "Invalid email or password" };
    const session = { email, role: u.role, name: u.name, username: u.username };
    setUser(session);
    return { ok: true, role: u.role };
  };

  const logout = () => setUser(null);

  const addApp = (app) => {
    const id = `APP-${1000 + apps.length + 10}`;
    const newApp = {
      id,
      created: new Date().toISOString().slice(0, 10),
      status: "Pending Approval",
      username: user?.email || "developer@bdapps.com",
      revenueShare: { developer: 65, operator: 25, platform: 10 },
      activity: [{ actor: user?.email || "developer", date: new Date().toISOString().slice(0, 10), remark: "App submitted" }],
      ...app,
    };
    setApps((p) => [newApp, ...p]);
    return newApp;
  };

  const updateAppStatus = (id, newStatus, remark) => {
    setApps((p) => p.map((a) => a.id === id ? {
      ...a, status: newStatus,
      activity: [{ actor: user?.email || "admin", date: new Date().toISOString().slice(0, 10), remark: `${newStatus}${remark ? " - " + remark : ""}` }, ...(a.activity || [])],
    } : a));
  };

  const addLiteApp = (app) => {
    const id = `LITE-${String(liteApps.length + 1).padStart(3, "0")}`;
    setLiteApps((p) => [{ id, status: "Pending", ...app }, ...p]);
  };

  const updateBuildFileStatus = (idx, status) => {
    setBuildFiles((p) => p.map((b, i) => (i === idx ? { ...b, status } : b)));
  };

  const addBuildFile = (file) => {
    setBuildFiles((p) => [{
      appId: `APP-${1020 + p.length}`,
      appName: file.app || file.name || "New App",
      creator: user?.username || "developer",
      version: "1.0.0",
      date: new Date().toISOString().slice(0, 10),
      remarks: "Initial submission",
      status: "Pending Approval",
      uploaded: new Date().toISOString().slice(0, 10),
      ...file,
    }, ...p]);
  };

  const addAd = (ad) => setAds((p) => [...p, { id: `AD-${String(p.length + 1).padStart(2, "0")}`, ...ad }]);
  const updateAd = (id, patch) => setAds((p) => p.map((a) => a.id === id ? { ...a, ...patch } : a));
  const removeAd = (id) => setAds((p) => p.filter((a) => a.id !== id));

  const updateStoreApp = (id, patch) => setStoreApps((p) => p.map((a) => a.id === id ? { ...a, ...patch } : a));

  const value = {
    user, login, logout,
    apps, addApp, updateAppStatus,
    liteApps, addLiteApp,
    keywords, systemUsers, setSystemUsers, appCreators, appstoreUsers,
    buildFiles, updateBuildFileStatus, addBuildFile,
    ads, addAd, updateAd, removeAd,
    subscriptions, storeApps, updateStoreApp,
    storeLayout, setStoreLayout,
    appStoreUser, setAppStoreUser,
    pendingTemplate, setPendingTemplate,
    myApps, addMyApp, updateMyApp, removeMyApp,
    appContent, updateAppContent, replaceAppContent,
    cmsCollections, updateOrderStatus, updateAppointmentStatus, addAppointment,
    replyReview, removeReview, approveReview, addCmsActivity,
    mediaLibrary, addMediaFile, removeMediaFile, renameMediaFile, computeStorageBytes,
    appNotifs, pushNotif, markNotifsRead,
    approveMyApp, rejectMyApp, resubmitMyApp,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};
