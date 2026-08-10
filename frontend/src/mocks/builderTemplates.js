// Orbit Digital Builder — 3-tab template catalogs

export const DESIGN_OPTIONS = [
  { id: "modern-card", name: "Modern & Bold", description: "Strong typography, card-based layout, vibrant colors", tags: ["Material Design", "Bottom Tabs", "Card UI"], screens: ["Home", "Content List", "Detail", "Settings"], components: ["Tab Nav", "Card Grid", "FAB", "Search"], gradient: "from-rose-500 via-pink-500 to-orange-400" },
  { id: "minimal-list", name: "Clean & Minimal", description: "Lots of whitespace, subtle shadows, thin fonts", tags: ["Clean UI", "List View", "Minimal"], screens: ["List", "Detail", "Categories", "Profile"], components: ["Header", "List Rows", "Pull to Refresh", "Filter"], gradient: "from-slate-700 via-slate-600 to-slate-500" },
  { id: "fullscreen", name: "Dark & Premium", description: "Dark backgrounds, glass effects, gradient accents", tags: ["Premium", "Glassmorphism", "Animated"], screens: ["Splash", "Dashboard", "Viewer", "Onboarding"], components: ["Glass Cards", "Gradient Buttons", "Drawer", "Animations"], gradient: "from-indigo-700 via-purple-700 to-fuchsia-600" },
  { id: "playful", name: "Playful & Colorful", description: "Rounded everything, bright palette, friendly feel", tags: ["Friendly", "Colorful", "Rounded"], screens: ["Home", "Content", "Detail", "Profile"], components: ["Pill Buttons", "Bright Cards", "Emoji UI", "Soft shadows"], gradient: "from-amber-400 via-pink-400 to-rose-500" },
];
export const WEB_DESIGN_OPTIONS = DESIGN_OPTIONS;

// Category visual styles
export const CATEGORY_GRADIENTS = {
  "E-Commerce": "from-orange-500 to-pink-600",
  "Food & Dining": "from-red-600 to-amber-500",
  "Healthcare": "from-teal-500 to-emerald-500",
  "Education": "from-purple-600 to-indigo-700",
  "Real Estate": "from-slate-600 to-indigo-900",
  "Travel": "from-sky-500 to-teal-500",
  "Non-Profit": "from-green-500 to-lime-500",
  "Business / SaaS": "from-slate-900 to-blue-700",
  "Health & Fitness": "from-emerald-500 to-green-600",
  "Media": "from-slate-800 to-stone-700",
  "Transport": "from-blue-900 to-sky-500",
  // Pro App / Telecom categories
  "Subscription Service": "from-rose-600 to-red-900",
  "USSD Companion": "from-blue-700 to-blue-900",
  "Content Service": "from-purple-500 to-fuchsia-700",
  "Analytics": "from-cyan-700 to-slate-900",
  "OTP Service": "from-blue-600 to-indigo-700",
  "App Store": "from-orange-500 to-amber-600",
  "Premium Content": "from-amber-500 to-zinc-800",
  "Admin Dashboard": "from-slate-700 to-emerald-700",
};

// ============= PRO APP BUILDER TEMPLATES (8 Orbit telecom-native) =============
export const PRO_TEMPLATES = [
  { id: "pro-sub-portal", name: "SMS Alert Subscription Portal", slug: "alert-subscription", category: "Subscription Service", apis: ["SMS", "Subscription"], description: "Browse alert services, subscribe with OTP, and manage active subscriptions.", bullets: ["OTP-verified subscribe flow", "Service catalog browser", "My Subscriptions dashboard"], icon: "📨", palette: { primary: "#09090B", accent: "#2563EB" }, baseRating: 4.6, appsBuilt: 2140, buildTime: "4 min" },
  { id: "pro-ussd", name: "USSD Service Companion", slug: "ussd-companion", category: "USSD Companion", apis: ["USSD", "SMS"], description: "Web mirror of a USSD menu app — same actions, no need to dial codes.", bullets: ["USSD menu tree on web", "Transaction history", "Help & FAQ"], icon: "📞", palette: { primary: "#1e40af", accent: "#ffffff" }, baseRating: 4.3, appsBuilt: 1240, buildTime: "5 min" },
  { id: "pro-content-dash", name: "Content Subscription Dashboard", slug: "content-dashboard", category: "Content Service", apis: ["Subscription", "SMS"], description: "Daily content (Hadith, news, health tips) on web alongside SMS delivery.", bullets: ["OTP-based login", "Content feed + archive", "Subscription manager"], icon: "📰", palette: { primary: "#7c3aed", accent: "#ffffff" }, baseRating: 4.7, appsBuilt: 2560, buildTime: "4 min" },
  { id: "pro-analytics", name: "Developer Analytics Portal", slug: "analytics-portal", category: "Analytics", apis: ["Reporting", "CaaS"], description: "White-label analytics dashboard for subscriber growth and revenue.", bullets: ["Live charts (recharts)", "Date range filters", "CSV export"], icon: "📊", palette: { primary: "#09090B", accent: "#06b6d4" }, baseRating: 4.8, appsBuilt: 3180, buildTime: "5 min" },
  { id: "pro-otp", name: "OTP Verification Service", slug: "otp-landing", category: "OTP Service", apis: ["OTP", "SMS"], description: "Marketing + docs site for an OTP verification API service.", bullets: ["Pricing table", "Code snippets", "Integration guide"], icon: "🔐", palette: { primary: "#09090B", accent: "#ef4444" }, baseRating: 4.5, appsBuilt: 1420, buildTime: "3 min" },
  { id: "pro-store", name: "Mobile Subscription Store", slug: "subscription-store", category: "App Store", apis: ["Subscription", "CaaS", "SMS"], description: "A mini app store listing every Orbit service a developer publishes.", bullets: ["App card grid", "Subscribe flow", "My services"], icon: "🛍️", palette: { primary: "#ea580c", accent: "#ffffff" }, baseRating: 4.4, appsBuilt: 2110, buildTime: "4 min" },
  { id: "pro-premium", name: "Charged Content Platform", slug: "premium-content", category: "Premium Content", apis: ["CaaS", "Subscription", "SMS"], description: "Premium content paywall using CaaS to deduct Robi balance.", bullets: ["Locked content overlay", "Balance widget", "Transaction log"], icon: "💎", palette: { primary: "#1f2937", accent: "#f59e0b" }, baseRating: 4.6, appsBuilt: 1680, buildTime: "5 min" },
  { id: "pro-admin", name: "Service Provider Admin Panel", slug: "service-admin", category: "Admin Dashboard", apis: ["All APIs"], description: "Full control panel for developers to manage all their Orbit services.", bullets: ["Subscriber table", "Broadcast composer", "Keyword manager"], icon: "🛠️", palette: { primary: "#09090B", accent: "#16a34a" }, baseRating: 4.7, appsBuilt: 2450, buildTime: "4 min" },
  // ── New Orbit demo templates (Feb 2026) ──
  { id: "pro-sathibd", name: "SathiBD — Matrimony Portal", slug: "sathibd", category: "Subscription Service", apis: ["SMS", "OTP", "Subscription", "CaaS"], description: "Full-featured Bangladesh matrimony portal. OTP-verified registration, SMS interest alerts, CaaS-charged subscription plans, user dashboard.", bullets: ["OTP-verified profiles via Orbit", "SMS interest alerts", "CaaS subscription plans (Free/Gold/Platinum)", "User dashboard with interest management"], icon: "💑", palette: { primary: "#f6af04", accent: "#d99400" }, baseRating: 4.9, appsBuilt: 4200, buildTime: "5 min", routeSlug: "sathibd" },
  { id: "pro-quizbd", name: "QuizBD — Knowledge Quiz", slug: "quizbd", category: "Content Service", apis: ["SMS", "Subscription", "CaaS"], description: "Daily quiz delivered via SMS. Subscribers earn points, climb leaderboard, win prizes credited via CaaS.", bullets: ["Daily SMS quiz questions", "In-app quiz with scoring", "Leaderboard & streaks", "CaaS prize disbursement"], icon: "🧠", palette: { primary: "#7c3aed", accent: "#4338ca" }, baseRating: 4.7, appsBuilt: 2810, buildTime: "4 min", routeSlug: "quizbd" },
  { id: "pro-newsnow", name: "NewsNow BD — News Service", slug: "newsnow", category: "Content Service", apis: ["SMS", "Subscription", "OTP"], description: "News portal with breaking-news SMS alerts. Subscribers receive category-filtered notifications.", bullets: ["Breaking news SMS broadcasts", "OTP-based subscription", "Category-filtered feed", "Article bookmarks"], icon: "📰", palette: { primary: "#334155", accent: "#09090B" }, baseRating: 4.6, appsBuilt: 3120, buildTime: "5 min", routeSlug: "newsnow" },
];

// ============= WEB APP BUILDER (UNIVERSAL templates — Orbit demos first) =============
export const WEB_TEMPLATES = [
  // ── Orbit demo templates (sorted first) ──
  { id: "web-sathibd", name: "SathiBD — Matrimony Portal", slug: "sathibd", category: "Subscription Service", description: "Bangladesh's most trusted matrimony portal — OTP-verified profiles, advanced filters, interest alerts, photo gallery, user dashboard, and Robi subscription billing. Bengali + English ready.", bullets: ["Profile browser with advanced filters (gender, age, religion, city)", "User dashboard with interest management", "OTP-verified registration via Orbit", "Subscription plans (Free/Gold/Platinum) via Robi CaaS", "In-app chat and WhatsApp connect", "Photo gallery, blog, wedding stories"], tags: ["Matrimony", "OTP Verified", "Robi", "SMS", "Bangla"], icon: "💑", palette: { primary: "#f6af04", accent: "#d99400" }, baseRating: 4.9, appsBuilt: 4200, buildTime: "5 min", routeSlug: "sathibd", apis: ["SMS", "OTP", "Subscription", "CaaS"] },
  { id: "web-newsnow", name: "NewsNow BD — News Portal", slug: "newsnow", category: "Media", description: "Bangla news aggregator — Prothom Alo, Daily Star, BBC headlines unified. Breaking-news SMS alerts, OTP login, daily charging BDT 4.", bullets: ["Bangla + English UI", "Breaking news ticker", "Category-tagged feed", "SMS subscriptions", "Bookmark & share"], tags: ["News", "SMS", "Bangla"], icon: "📰", palette: { primary: "#1e3a8a", accent: "#d97706" }, baseRating: 4.8, appsBuilt: 3120, buildTime: "5 min", routeSlug: "newsnow", apis: ["SMS", "Subscription", "OTP"] },
  { id: "web-quizbd", name: "QuizBD — Knowledge Quiz", slug: "quizbd", category: "Content Service", description: "Daily quiz web portal with Bengali GK, Islam, Science, Sports & Entertainment. Points + leaderboard + CaaS-charged prize claim.", bullets: ["Bangla + English UI", "20 daily quiz questions", "Live leaderboard", "Streak & points system", "CaaS prize payout"], tags: ["Quiz", "Education", "Bangla"], icon: "🧠", palette: { primary: "#7c3aed", accent: "#4338ca" }, baseRating: 4.7, appsBuilt: 2810, buildTime: "4 min", routeSlug: "quizbd", apis: ["SMS", "Subscription", "CaaS"] },
  // ── Other universal templates ──
  { id: "web-ecom", name: "E-Commerce Store", slug: "ecommerce", category: "E-Commerce", description: "Full online store with product catalog, cart, checkout, and order tracking.", bullets: ["Product catalog & search", "Shopping cart & wishlist", "Secure payment gateway", "Order tracking dashboard", "Admin product manager"], tags: ["Retail", "Shopping", "Payments"], icon: "🛒", palette: { primary: "#ea580c", accent: "#db2777" }, baseRating: 4.9, appsBuilt: 5200, buildTime: "5 min" },
  { id: "web-food", name: "Restaurant & Food Ordering", slug: "restaurant", category: "Food & Dining", description: "Online menu, table reservations, and food delivery ordering system.", bullets: ["Digital menu builder", "Online ordering & cart", "Table booking system", "Real-time order tracking", "Kitchen dashboard"], tags: ["Restaurant", "Food", "Delivery"], icon: "🍔", palette: { primary: "#dc2626", accent: "#f59e0b" }, baseRating: 4.8, appsBuilt: 3800, buildTime: "5 min" },
  { id: "web-health", name: "Health & Wellness Clinic", slug: "clinic", category: "Healthcare", description: "Medical clinic portal with doctor profiles, appointment booking, and patient management.", bullets: ["Doctor directory & profiles", "Appointment booking & reminders", "Patient login portal", "Health blog/tips", "Video consult ready"], tags: ["Health", "Medical", "Booking"], icon: "🏥", palette: { primary: "#0d9488", accent: "#10b981" }, baseRating: 4.7, appsBuilt: 2100, buildTime: "4 min" },
  { id: "web-edu", name: "Education & eLearning", slug: "elearning", category: "Education", description: "Online learning platform with courses, video lessons, quizzes, and certificates.", bullets: ["Course catalog & enrollment", "Video lesson player", "Interactive quizzes", "Certificate generation", "Student progress tracker"], tags: ["Education", "Courses", "Learning"], icon: "🎓", palette: { primary: "#7c3aed", accent: "#4338ca" }, baseRating: 4.8, appsBuilt: 4100, buildTime: "6 min" },
  { id: "web-realestate", name: "Real Estate Portal", slug: "realestate", category: "Real Estate", description: "Property listing site with advanced search, map view, and lead capture.", bullets: ["Property listings & filters", "Image gallery carousel", "Map integration", "Agent profiles", "Lead inquiry forms"], tags: ["Real Estate", "Property", "Listings"], icon: "🏘️", palette: { primary: "#475569", accent: "#1e293b" }, baseRating: 4.6, appsBuilt: 1700, buildTime: "5 min" },
  { id: "web-travel", name: "Travel & Tour Booking", slug: "travel", category: "Travel", description: "Tour package marketplace with itineraries, availability, and online booking.", bullets: ["Tour catalog with pricing", "Itinerary builder", "Booking & payment", "My trips dashboard", "Review system"], tags: ["Travel", "Tourism", "Booking"], icon: "✈️", palette: { primary: "#0ea5e9", accent: "#14b8a6" }, baseRating: 4.7, appsBuilt: 2900, buildTime: "5 min" },
  { id: "web-ngo", name: "NGO & Charity Platform", slug: "ngo", category: "Non-Profit", description: "Charity website with donation campaigns, volunteer management, and impact reporting.", bullets: ["Campaign listings with goals", "Donation payment flow", "Volunteer signup", "Impact dashboard", "Donor recognition wall"], tags: ["NGO", "Charity", "Donations"], icon: "❤️", palette: { primary: "#22c55e", accent: "#84cc16" }, baseRating: 4.5, appsBuilt: 890, buildTime: "4 min" },
  { id: "web-saas", name: "SaaS Product & Dashboard", slug: "saas", category: "Business / SaaS", description: "SaaS landing page + full admin dashboard with analytics, settings, and team management.", bullets: ["Marketing landing page", "Pricing table (3 tiers)", "User authentication", "Analytics dashboard", "Team & settings panel"], tags: ["SaaS", "Dashboard", "Business"], icon: "💼", palette: { primary: "#09090B", accent: "#3b82f6" }, baseRating: 4.9, appsBuilt: 6300, buildTime: "6 min" },
];

// ============= ANDROID APP BUILDER (8 UNIVERSAL templates) =============
export const ANDROID_TEMPLATES = [
  { id: "and-ecom", name: "E-Commerce Shopping App", slug: "shopping-app", category: "E-Commerce", description: "Native Android shopping experience with cart, wishlist, push notifications, and payment.", bullets: ["Product browsing & search", "Cart & wishlist", "Push notification deals", "Order history", "Orbit App Store ready"], icon: "🛒", palette: { primary: "#ea580c", accent: "#fff" }, baseRating: 4.9, appsBuilt: 7100, buildTime: "5 min" },
  { id: "and-food", name: "Food Delivery App", slug: "food-delivery", category: "Food & Dining", description: "Food ordering app with restaurant discovery, live order tracking, and delivery management.", bullets: ["Restaurant & menu browser", "Live order tracking", "Push notifications", "Delivery address manager", "Orbit App Store ready"], icon: "🍔", palette: { primary: "#dc2626", accent: "#facc15" }, baseRating: 4.8, appsBuilt: 5400, buildTime: "5 min" },
  { id: "and-doctor", name: "Doctor Appointment App", slug: "doctor-app", category: "Healthcare", description: "Healthcare app with doctor discovery, slot booking, medical history, and telemedicine.", bullets: ["Doctor profiles & specialties", "Appointment booking", "OTP-based login", "Medical records", "Orbit App Store ready"], icon: "🩺", palette: { primary: "#0d9488", accent: "#a7f3d0" }, baseRating: 4.7, appsBuilt: 2800, buildTime: "4 min" },
  { id: "and-edu", name: "eLearning App", slug: "elearning-app", category: "Education", description: "Mobile learning app with courses, videos, quizzes, progress tracking, and offline access.", bullets: ["Course catalog", "Video lessons", "Offline mode", "Progress & certificates", "Orbit App Store ready"], icon: "🎓", palette: { primary: "#7c3aed", accent: "#a78bfa" }, baseRating: 4.8, appsBuilt: 4200, buildTime: "6 min" },
  { id: "and-fitness", name: "Fitness Tracker App", slug: "fitness", category: "Health & Fitness", description: "Personal fitness companion with workout plans, nutrition logging, and progress analytics.", bullets: ["Workout plans & timer", "Step & calorie tracker", "Nutrition log", "Progress charts", "Orbit App Store ready"], icon: "💪", palette: { primary: "#10b981", accent: "#a7f3d0" }, baseRating: 4.7, appsBuilt: 3300, buildTime: "5 min" },
  { id: "and-travel", name: "Travel Booking App", slug: "travel-app", category: "Travel", description: "Tour and travel app with destination discovery, package booking, and trip management.", bullets: ["Destination discovery", "Tour packages & booking", "Trip itinerary", "Offline maps", "Orbit App Store ready"], icon: "✈️", palette: { primary: "#0284c7", accent: "#7dd3fc" }, baseRating: 4.6, appsBuilt: 1900, buildTime: "5 min" },
  { id: "and-news", name: "News & Media App", slug: "news-app", category: "Media", description: "News aggregator with category filter, bookmarks, offline reading, and push alerts.", bullets: ["Category news feed", "Offline reading", "Bookmarks", "Breaking news alerts", "Orbit App Store ready"], icon: "📰", palette: { primary: "#334155", accent: "#cbd5e1" }, baseRating: 4.5, appsBuilt: 2100, buildTime: "4 min" },
  { id: "and-ride", name: "Ride Sharing App", slug: "ride-app", category: "Transport", description: "Ride booking app with map-based pickup, driver matching, fare estimate, and payment.", bullets: ["Pickup & destination input", "Fare estimate", "Driver assignment", "Live ride tracking", "Orbit App Store ready"], icon: "🚗", palette: { primary: "#1e3a8a", accent: "#38bdf8" }, baseRating: 4.8, appsBuilt: 3700, buildTime: "5 min" },
  // ── New Orbit demo templates (android variants) ──
  { id: "and-sathibd", name: "SathiBD — Matrimony Android", slug: "sathibd", category: "Healthcare", description: "Native matrimony Android app with OTP login, profile browser, SMS interest notifications and CaaS subscription.", bullets: ["OTP-based login", "Profile browser", "SMS interest alerts", "CaaS subscription plans", "Orbit App Store ready"], icon: "💑", palette: { primary: "#f6af04", accent: "#d99400" }, baseRating: 4.9, appsBuilt: 3100, buildTime: "5 min", routeSlug: "sathibd", apis: ["SMS", "OTP", "Subscription", "CaaS"] },
  { id: "and-quizbd", name: "QuizBD — Knowledge Quiz", slug: "quizbd", category: "Education", description: "Daily quiz app with SMS questions and CaaS-charged prize disbursement.", bullets: ["Daily SMS quiz", "In-app quiz with timer", "Leaderboard & streaks", "CaaS prize payout", "Orbit App Store ready"], icon: "🧠", palette: { primary: "#7c3aed", accent: "#4338ca" }, baseRating: 4.7, appsBuilt: 2810, buildTime: "4 min", routeSlug: "quizbd", apis: ["SMS", "Subscription", "CaaS"] },
  { id: "and-newsnow", name: "NewsNow BD — News Android", slug: "newsnow", category: "Media", description: "News reader with breaking news SMS notifications via Robi network.", bullets: ["Category filter", "Breaking news SMS", "Article bookmarks", "Offline reading", "Orbit App Store ready"], icon: "📰", palette: { primary: "#334155", accent: "#09090B" }, baseRating: 4.6, appsBuilt: 3120, buildTime: "5 min", routeSlug: "newsnow", apis: ["SMS", "Subscription", "OTP"] },
  { id: "and-fitbd", name: "FitBD — Fitness & Health Tracker", slug: "fitbd", category: "Health & Fitness", description: "Personal fitness companion with workout plans, nutrition tracking and SMS daily health tips.", bullets: ["Workout plans & timer", "Daily health tips via SMS", "Nutrition log (BD foods)", "Progress charts", "CaaS premium plan unlock"], icon: "💪", palette: { primary: "#10b981", accent: "#84cc16" }, baseRating: 4.8, appsBuilt: 2310, buildTime: "5 min", routeSlug: "fitbd", apis: ["SMS", "Subscription", "CaaS"] },
];

export const ALL_CATEGORIES_PRO = ["All", "Subscription Service", "USSD Companion", "Content Service", "Analytics", "OTP Service", "App Store", "Premium Content", "Admin Dashboard"];
export const ALL_CATEGORIES_WEB = ["All", "Subscription Service", "Media", "Content Service", "E-Commerce", "Food & Dining", "Healthcare", "Education", "Real Estate", "Travel", "Non-Profit", "Business / SaaS"];
export const ALL_CATEGORIES_ANDROID = ["All", "E-Commerce", "Food & Dining", "Healthcare", "Education", "Health & Fitness", "Travel", "Media", "Transport"];

export const ALL_CATEGORIES = ALL_CATEGORIES_WEB;

export const COLOR_PRESETS = [
  { name: "Red", hex: "#2563EB" }, { name: "Navy", hex: "#09090B" }, { name: "Green", hex: "#16a34a" },
  { name: "Blue", hex: "#2563eb" }, { name: "Purple", hex: "#7c3aed" }, { name: "Orange", hex: "#ea580c" },
];
export const FONT_PRESETS = ["Modern Sans", "Classic Serif", "Rounded Friendly", "Monospace Tech"];
export const EMOJI_PALETTE = ["🚀", "⚡", "🔥", "💎", "🌟", "🎨", "📱", "🛒", "💚", "📖", "🍔", "🩺"];
export const BDAPPS_SHORTCODES = ["16222", "16333", "16444"];
export const CONNECTED_BDAPPS_APPS = [
  { id: "weather-alert", name: "Weather Alert Service", keyword: "WTHR", type: "Lite" },
  { id: "daily-hadith", name: "Daily Hadith", keyword: "HADITH", type: "Lite" },
  { id: "cricket-live", name: "Cricket Live Updates", keyword: "SCORE", type: "Lite" },
];
export const ANDROID_CATEGORIES_BY_TEMPLATE = {};
export const APP_STORE_CATEGORIES = ["Games", "Entertainment", "Health", "Finance", "Utilities", "Education", "Shopping", "Travel", "Food & Dining"];

// Pages per template (used in Step 3 customization)
export const TEMPLATE_PAGES = {
  // Pro templates - mostly single-app, fewer pages
  "pro-sub-portal": ["Landing", "Service catalog", "Subscribe (OTP)", "My Subscriptions"],
  "pro-ussd": ["Home", "USSD menu", "Transaction history", "Help"],
  "pro-content-dash": ["OTP Login", "Content feed", "Categories", "Profile"],
  "pro-analytics": ["Dashboard", "Subscribers", "Revenue", "Reports"],
  "pro-otp": ["Landing", "Pricing", "API Docs", "Contact"],
  "pro-store": ["Home", "App detail", "Subscribe", "My Services"],
  "pro-premium": ["Catalog", "Content viewer", "Wallet", "History"],
  "pro-admin": ["Dashboard", "Subscribers", "Broadcast", "Keywords"],
  // Web universal
  "web-ecom": ["Register/Login", "Home", "Product detail", "Cart", "Checkout", "Order confirmed"],
  "web-food": ["Home", "Menu", "Cart", "Checkout", "Order tracking"],
  "web-health": ["Home", "Doctor list", "Doctor profile", "OTP Booking", "Confirmation"],
  "web-edu": ["Landing", "Course catalog", "Course detail", "Payment", "Lesson player"],
  "web-realestate": ["Home", "Property grid", "Property detail", "Inquiry", "Confirmation"],
  "web-travel": ["Landing", "Tour list", "Tour detail", "Booking & Payment", "Confirmed"],
  "web-ngo": ["Home", "Campaign detail", "Donate", "Thank you"],
  "web-saas": ["Landing", "Sign Up", "Onboarding", "Dashboard", "Settings"],
  // Android universal
  "and-ecom": ["Splash+Login", "Home+Browse", "Detail→Cart→Order"],
  "and-food": ["Splash+Home", "Menu+Cart", "Order tracker"],
  "and-doctor": ["Splash+Home", "Doctor profile", "OTP Booking"],
  "and-edu": ["Splash+Home", "Course detail", "Lesson player"],
  "and-fitness": ["Splash+Goals", "Dashboard", "Workout"],
  "and-travel": ["Splash+Home", "Tour detail", "Booking"],
  "and-news": ["Splash+Home", "Category+List", "Article detail"],
  "and-ride": ["Splash+Map", "Fare estimate", "Driver assigned"],
};

// Feature toggles per template
export const TEMPLATE_FEATURES = {
  "web-ecom": ["Wishlist", "Product Reviews", "Coupon Codes", "Multi-vendor"],
  "web-food": ["Table Booking", "Delivery Tracking", "Special Instructions"],
  "web-health": ["Video Consult", "Health Blog", "Reminders"],
  "web-edu": ["Quizzes", "Certificates", "Discussion Forum"],
  "web-realestate": ["Map View", "Mortgage Calculator", "Agent Chat"],
  "web-travel": ["Multi-city itinerary", "Reviews", "Travel insurance"],
  "web-ngo": ["Recurring donations", "Impact wall", "Volunteer portal"],
  "web-saas": ["Free trial", "Team accounts", "API access"],
  "and-ecom": ["Push deals", "Wishlist", "Loyalty points"],
  "and-food": ["Live tracking", "Favorites", "Schedule order"],
  "and-doctor": ["Video consult", "Prescription save", "Family accounts"],
  "and-edu": ["Offline mode", "Quizzes", "Discussion"],
  "and-fitness": ["Workout timer", "Nutrition", "Wearable sync"],
  "and-travel": ["Offline maps", "Reviews", "Group bookings"],
  "and-news": ["Offline reading", "Bookmarks", "Push alerts"],
  "and-ride": ["Fare splitting", "Schedule ride", "Driver chat"],
};
