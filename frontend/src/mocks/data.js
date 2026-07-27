// Centralized mock data for Orbit demo

export const STATUS_COLORS = {
  "Active Production": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Pending Approval": "bg-amber-100 text-amber-700 border-amber-200",
  "Suspended": "bg-rose-100 text-rose-700 border-rose-200",
  "Draft": "bg-slate-100 text-slate-700 border-slate-200",
  "Rejected": "bg-red-100 text-red-700 border-red-200",
  "Limited Production": "bg-sky-100 text-sky-700 border-sky-200",
  "Terminated": "bg-zinc-200 text-zinc-700 border-zinc-300",
  "Scheduled Active Production": "bg-indigo-100 text-indigo-700 border-indigo-200",
};

export const ALL_STATUSES = [
  "Active Production",
  "Pending Approval",
  "Suspended",
  "Draft",
  "Rejected",
  "Limited Production",
  "Scheduled Active Production",
  "Terminated",
];

const today = new Date();
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export const seedApps = [
  {
    id: "APP-1001",
    name: "Cricket Live Updates",
    type: "Pro",
    username: "developer@orbit.com",
    created: daysAgo(28),
    status: "Active Production",
    description: "Live ball-by-ball cricket score updates via SMS.",
    host: "https://cricket.orbit.dev",
    apis: ["SMS", "Subscription"],
    revenueShare: { developer: 70, operator: 25, platform: 5 },
    activity: [
      { actor: "admin@orbit.com", date: daysAgo(28), remark: "Approved - Active Production" },
      { actor: "developer@orbit.com", date: daysAgo(30), remark: "App submitted" },
    ],
  },
  {
    id: "APP-1002",
    name: "Daily Quiz Bangla",
    type: "Lite",
    username: "developer@orbit.com",
    created: daysAgo(15),
    status: "Pending Approval",
    description: "Bangla GK quiz delivered daily via SMS subscription.",
    host: "https://quiz.orbit.dev",
    apis: ["SMS"],
    revenueShare: { developer: 60, operator: 30, platform: 10 },
    activity: [{ actor: "developer@orbit.com", date: daysAgo(15), remark: "App submitted for review" }],
  },
  {
    id: "APP-1003",
    name: "Bus Ticket USSD",
    type: "Pro",
    username: "developer@orbit.com",
    created: daysAgo(45),
    status: "Suspended",
    description: "USSD-based interstate bus ticket booking.",
    host: "https://bus.orbit.dev",
    apis: ["USSD", "CaaS"],
    revenueShare: { developer: 65, operator: 25, platform: 10 },
    activity: [
      { actor: "admin@orbit.com", date: daysAgo(5), remark: "Suspended - compliance review" },
      { actor: "admin@orbit.com", date: daysAgo(40), remark: "Approved" },
    ],
  },
  {
    id: "APP-1004",
    name: "Recipe of the Day",
    type: "Lite",
    username: "developer@orbit.com",
    created: daysAgo(2),
    status: "Draft",
    description: "Daily Bangla recipe SMS.",
    host: "",
    apis: [],
    revenueShare: { developer: 60, operator: 30, platform: 10 },
    activity: [{ actor: "developer@orbit.com", date: daysAgo(2), remark: "Draft created" }],
  },
  {
    id: "APP-1005",
    name: "Stock Trade Alerts",
    type: "Pro",
    username: "developer@orbit.com",
    created: daysAgo(60),
    status: "Rejected",
    description: "Real-time DSE stock alerts.",
    host: "https://stocks.orbit.dev",
    apis: ["SMS", "Subscription"],
    revenueShare: { developer: 0, operator: 0, platform: 0 },
    activity: [
      { actor: "admin@orbit.com", date: daysAgo(55), remark: "Rejected - missing SEBL license" },
      { actor: "developer@orbit.com", date: daysAgo(60), remark: "Submitted" },
    ],
  },
  {
    id: "APP-1006",
    name: "City Prayer Times",
    type: "Lite",
    username: "developer@orbit.com",
    created: daysAgo(20),
    status: "Limited Production",
    description: "5x daily prayer time SMS for Dhaka, Chittagong, Sylhet.",
    host: "https://salah.orbit.dev",
    apis: ["SMS"],
    revenueShare: { developer: 65, operator: 25, platform: 10 },
    activity: [
      { actor: "admin@orbit.com", date: daysAgo(18), remark: "Limited Production granted" },
      { actor: "developer@orbit.com", date: daysAgo(20), remark: "Submitted" },
    ],
  },
];

export const seedLiteApps = [
  { id: "LITE-001", name: "Morning News Bangla", status: "Active", category: "Alert", keyword: "MNEWS", type: "Alert", subscribers: 1284 },
  { id: "LITE-002", name: "Weather Today", status: "Active", category: "Alert", keyword: "WTHR", type: "Alert", subscribers: 2156 },
  { id: "LITE-003", name: "Daily Hadith", status: "Pending", category: "Services", keyword: "HADITH", type: "Services" },
  { id: "LITE-004", name: "Stock Brief", status: "Rejected", category: "Services", keyword: "STKBR", type: "Services" },
  { id: "LITE-005", name: "Daily Health Tips", status: "Active", category: "Services", keyword: "HEALTH16222", type: "Service", subscribers: 942, schedule: { type: "Daily", time: "09:00 AM" } },
  { id: "LITE-006", name: "Daily Hadith", status: "Active", category: "Services", keyword: "HADITH16333", type: "Service", subscribers: 1830, schedule: { type: "Daily", time: "06:00 AM" } },
];

export const seedKeywords = [
  { keyword: "WTHR", appName: "Weather Today", shortcode: "21333", status: "Active" },
  { keyword: "MNEWS", appName: "Morning News Bangla", shortcode: "21333", status: "Active" },
  { keyword: "HADITH", appName: "Daily Hadith", shortcode: "21333", status: "Pending" },
  { keyword: "QUIZ", appName: "Daily Quiz", shortcode: "21333", status: "Active" },
  { keyword: "RECIPE", appName: "Recipe of the Day", shortcode: "21333", status: "Active" },
];

export const seedSystemUsers = [
  { username: "admin", firstName: "System", lastName: "Admin", status: "Active", group: "SuperAdmin", email: "admin@orbit.com" },
  { username: "amir.ops", firstName: "Amir", lastName: "Hossain", status: "Active", group: "Operator", email: "amir@robi.com.bd" },
  { username: "rina.qa", firstName: "Rina", lastName: "Akter", status: "Disabled", group: "Reviewer", email: "rina@orbit.com" },
  { username: "tanvir.fin", firstName: "Tanvir", lastName: "Khan", status: "Initial", group: "Finance", email: "tanvir@orbit.com" },
];

export const seedAppCreators = [
  { username: "developer", status: "Active", profileStatus: "Verified", email: "developer@orbit.com", mobile: "+8801711000001" },
  { username: "shahin.dev", status: "Active", profileStatus: "Verified", email: "shahin@dev.com", mobile: "+8801712000002" },
  { username: "nadia.dev", status: "Disabled", profileStatus: "Pending", email: "nadia@dev.com", mobile: "+8801713000003" },
];

export const seedAppstoreUsers = [
  { firstName: "Sabbir", lastName: "Ahmed", mobile: "+8801711234567" },
  { firstName: "Fahmida", lastName: "Rahman", mobile: "+8801712345678" },
  { firstName: "Mahin", lastName: "Islam", mobile: "+8801713456789" },
];

export const seedBuildFiles = [
  { creator: "developer", appId: "APP-1004", appName: "Recipe of the Day", version: "1.0.0", date: daysAgo(2), remarks: "Initial build", status: "Pending" },
  { creator: "shahin.dev", appId: "APP-1007", appName: "Skill Tutor", version: "2.1.0", date: daysAgo(10), remarks: "Bug fixes", status: "Approved" },
  { creator: "nadia.dev", appId: "APP-1008", appName: "Music Box", version: "0.9.0", date: daysAgo(20), remarks: "Beta", status: "Rejected" },
];

export const seedAds = [
  { id: "AD-01", name: "Robi Offer 1", content: "Get 1GB@9Tk!" },
  { id: "AD-02", name: "Summer Deal", content: "50% OFF Now" },
  { id: "AD-03", name: "Eid Bonus", content: "Free 100 SMS" },
  { id: "AD-04", name: "Cricket Pack", content: "Live scores 5Tk" },
];

export const seedAdAssignments = [
  { appId: "APP-1001", appName: "Cricket Live Updates", adId: "AD-04", adName: "Cricket Pack" },
  { appId: "APP-1002", appName: "Daily Quiz Bangla", adId: null, adName: null },
  { appId: "APP-1006", appName: "City Prayer Times", adId: "AD-02", adName: "Summer Deal" },
  { appId: "APP-1003", appName: "Bus Ticket USSD", adId: null, adName: null },
  { appId: "APP-1005", appName: "Stock Trade Alerts", adId: "AD-01", adName: "Robi Offer 1" },
];

export const VALID_USSD_APP_IDS = ["APP001", "APP002", "APP003"];

export const seedSubscriptions = [
  { mobile: "01812345678", appName: "Weather Alert", spName: "dev_user1", status: "Registered", channel: "DIRECT_USSD",
    charging: { instrument: "Robi Wallet", amount: "2.00 BDT", frequency: "Daily", lastCharged: daysAgo(0), startDate: daysAgo(30), endDate: "" } },
  { mobile: "01612345679", appName: "Daily Hadith", spName: "islamic_dev", status: "Registered", channel: "SMS",
    charging: { instrument: "Robi Wallet", amount: "1.00 BDT", frequency: "Daily", lastCharged: daysAgo(0), startDate: daysAgo(45), endDate: "" } },
  { mobile: "01912345680", appName: "Cricket Live Updates", spName: "bd_sports", status: "Reg_pending", channel: "DIRECT_HTTP",
    charging: { instrument: "Robi Wallet", amount: "2.00 BDT", frequency: "Daily", lastCharged: "—", startDate: daysAgo(1), endDate: "" } },
  { mobile: "01812345681", appName: "Stock Brief BD", spName: "finhub", status: "Temporary_blocked", channel: "SMS",
    charging: { instrument: "Robi Wallet", amount: "5.00 BDT", frequency: "Daily", lastCharged: daysAgo(5), startDate: daysAgo(60), endDate: "" } },
  { mobile: "01612345682", appName: "Bangla Quiz", spName: "eduplay", status: "Unregistered", channel: "USSD",
    charging: { instrument: "Robi Wallet", amount: "1.00 BDT", frequency: "Weekly", lastCharged: daysAgo(15), startDate: daysAgo(90), endDate: daysAgo(7) } },
  { mobile: "01912345683", appName: "Salah Times", spName: "islamic_dev", status: "Registered", channel: "DIRECT_USSD",
    charging: { instrument: "Robi Wallet", amount: "0.00 BDT", frequency: "Free", lastCharged: "—", startDate: daysAgo(120), endDate: "" } },
  { mobile: "01812345684", appName: "Movie Buff", spName: "cineplex", status: "Initial", channel: "SMS",
    charging: { instrument: "Robi Wallet", amount: "3.00 BDT", frequency: "Daily", lastCharged: "—", startDate: daysAgo(0), endDate: "" } },
  { mobile: "01612345685", appName: "Health Tips Pro", spName: "medbangla", status: "Registered", channel: "DIRECT_HTTP",
    charging: { instrument: "Robi Wallet", amount: "0.00 BDT", frequency: "Free", lastCharged: "—", startDate: daysAgo(15), endDate: "" } },
];

export const VALID_OPERATOR_PREFIXES = ["018", "016", "019"];

export const seedAppStore = [
  // ───── Web apps (Visit Site CTA) ─────
  { id: "AS-ROBIMART", name: "RobiMart BD", developer: "Rafiul Karim", rating: 4.8, subscribers: 12400, category: "E-Commerce", artId: "ecom", icon: "🛒", iconGradient: "from-orange-500 to-red-600", type: "web", cost: "Free", slug: "robimart-bd", description: "Full online store with electronics, fashion, home & living, sports, beauty, and books. Cash on delivery and bKash supported across Bangladesh.", instructions: "Visit robimart-bd.orbit.app" },
  { id: "AS-EDUPATH", name: "EduPath BD", developer: "EduTech BD", rating: 4.9, subscribers: 18200, category: "Education", artId: "edu", icon: "📚", iconGradient: "from-indigo-500 to-purple-700", type: "web", cost: "Free", slug: "edupath-bd", description: "SSC & HSC preparation with video lessons, mock tests, quizzes and a national leaderboard. Track progress across 8 subjects.", instructions: "Visit edupath-bd.orbit.app" },
  { id: "AS-MEDILIFE", name: "Medilife Clinic", developer: "Medilife Group", rating: 4.6, subscribers: 9400, category: "Health", artId: "health", icon: "⚕️", iconGradient: "from-teal-500 to-emerald-700", type: "web", cost: "Free", slug: "medilife-clinic", description: "Book doctor appointments, view reports, manage prescriptions. 24/7 telemedicine.", instructions: "Visit medilife-clinic.orbit.app" },
  // ───── Android apps (Download CTA) ─────
  { id: "AS-DESHIFOOD", name: "DeshiFood", developer: "Rafiul Karim", rating: 4.7, subscribers: 8400, category: "Food & Dining", artId: "food", icon: "🍽", iconGradient: "from-red-500 to-rose-600", type: "android", cost: "Free", slug: "deshifood", description: "Order from top Dhaka restaurants — Kacchi Bhai, Pizza Hut, Haji Biriyani and more. Live order tracking and bKash/Nagad payments.", instructions: "Install from Orbit Store" },
  { id: "AS-FITBD", name: "FitBD", developer: "FitBD Co.", rating: 4.5, subscribers: 3100, category: "Fitness", artId: "fitness", icon: "💪", iconGradient: "from-green-500 to-lime-600", type: "android", cost: "Free", slug: "fitbd", description: "Personalised workouts, calorie tracking, step counter and BMI calculator built for Bangladeshi lifestyles.", instructions: "Install from Orbit Store" },
  { id: "AS-SPORTSLIVE", name: "BPL Live", developer: "SportsBD", rating: 4.8, subscribers: 184000, category: "Sports", artId: "cricket", icon: "🏏", iconGradient: "from-green-700 to-teal-900", type: "android", cost: "Tk 2/day", description: "Live ball-by-ball cricket coverage for BPL, BAN matches and ICC tournaments with commentary in Bangla.", instructions: "Install from Orbit Store" },
  // ───── New Orbit demo apps (Feb 2026) ─────
  { id: "AS-SATHIBD", name: "SathiBD", developer: "Rafiul Karim", rating: 4.9, subscribers: 184000, category: "Matrimony", artId: "ngo", icon: "💑", iconGradient: "from-rose-500 to-amber-500", type: "web", cost: "Free", slug: "sathibd", popular: true, description: "Bangladesh's most trusted matrimony portal. OTP-verified profiles, advanced filters, interest alerts, photo gallery, user dashboard, and Robi subscription billing (Free/Gold/Platinum).", instructions: "Visit sathibd.orbit.app or Send SATHI to 16222" },
  { id: "AS-NEWSNOW", name: "NewsNow BD", developer: "Rafiul Karim", rating: 4.6, subscribers: 94200, category: "News", artId: "news", icon: "📰", iconGradient: "from-slate-700 to-gray-900", type: "web", cost: "Free", slug: "newsnow", description: "Daily news portal with breaking news SMS alerts. Web companion shows full articles. 15 articles across 5 categories.", instructions: "Visit newsnow.orbit.app or Send NEWS to 16222" },
  { id: "AS-FITBDPRO", name: "FitBD Pro", developer: "Rafiul Karim", rating: 4.8, subscribers: 62400, category: "Fitness", artId: "fitness", icon: "💪", iconGradient: "from-lime-500 to-emerald-700", type: "android", cost: "Free", slug: "fitbd", description: "Personal fitness companion with workout plans, nutrition tracking, daily SMS health tips. CaaS-charged premium HIIT plans.", instructions: "Install from Orbit Store" },
];

export const CATEGORIES = ["E-Commerce","Education","Health","Food & Dining","Fitness","Sports","Matrimony","News","Entertainment"];

export const HERO_SLIDES = [
  { id: "developer", title: "Build Apps for 10 Million+ Bangladeshis", subtitle: "Join Bangladesh's largest developer ecosystem — telecom services, web apps, Android apps. All from one platform.", overlay: "5,000+ Apps · 10M+ Users · BDT 2B+ Revenue", color: "from-rose-600 via-red-700 to-rose-900", scene: "developer" },
  { id: "subscribers", title: "Reach Every Corner of Bangladesh", subtitle: "From Dhaka to Cox's Bazar — your app travels with Robi's network. Even on feature phones.", overlay: "Active subscribers updated live", color: "from-violet-700 via-purple-700 to-fuchsia-700", scene: "subscribers" },
  { id: "builder", title: "Build Your App in Minutes — No Code", subtitle: "Web apps, Android apps, telecom services — drag, drop, launch. From idea to App Store in under 10 minutes.", overlay: "Start Building →", color: "from-slate-900 via-blue-900 to-red-900", scene: "builder" },
];

export const LITE_TEMPLATES = [
  { id: "lt1", name: "Weather Alert", category: "Alert", icon: "🌦️", description: "Daily weather SMS alerts to subscribers.", keyword: "WTHR", subscribers: 12400, sample: ["Dhaka 31°C, light rain expected.", "Chittagong 29°C, humid morning.", "Sylhet 27°C, cloudy."] },
  { id: "lt2", name: "Prayer Time Reminder", category: "Alert", icon: "🕌", description: "Five-times daily prayer alerts.", keyword: "SALAH", subscribers: 38000, sample: ["Fajr at 4:48 AM today.", "Dhuhr at 12:05 PM.", "Maghrib at 6:12 PM."] },
  { id: "lt3", name: "Sports Score Update", category: "Alert", icon: "🏏", description: "Live cricket/football scores.", keyword: "SCORE", subscribers: 22150, sample: ["BD 245/4 (40 ov) vs IND.", "Mahmudullah 67* not out.", "BAN won by 7 wickets!"] },
  { id: "lt4", name: "Daily Health Tips", category: "Services", icon: "💚", description: "Wellness tips delivered daily.", keyword: "HEALTH", subscribers: 8900, sample: ["Drink 8 glasses of water today.", "20-min walk lowers BP risk.", "Eat seasonal fruits for vitamin C."] },
  { id: "lt5", name: "Daily Hadith", category: "Services", icon: "📖", description: "Islamic daily reminder.", keyword: "HADITH", subscribers: 51000, sample: ["Hadith of the day: 'Smile at your brother...'", "Sahih Bukhari, Vol 1, #11", "Tafsir explanation tomorrow."] },
  { id: "lt6", name: "Stock Market Brief", category: "Services", icon: "📈", description: "Daily market summary.", keyword: "MARKET", subscribers: 4300, sample: ["DSEX +0.42% closing 6,210", "Top gainer: BEXIMCO +5.1%", "Top loser: GP -1.8%"] },
];

export const PROVISIONING_TEMPLATES = [
  { id: "pt1", name: "SMS Subscription Service", apis: ["SMS", "Subscription"], icon: "💬", description: "Full SMS MO+MT with subscription charging.",
    flow: ["User SMS to shortcode", "Orbit validates", "Charging engine debits", "MT confirmation"], useCase: "Daily news, quotes, recipes." },
  { id: "pt2", name: "USSD Menu App", apis: ["USSD", "CaaS"], icon: "📞", description: "Interactive USSD session handler.",
    flow: ["Dial *123#", "Menu shown", "User selects", "CaaS deducts charge", "Result returned"], useCase: "Bus ticket, account check." },
  { id: "pt3", name: "OTP Verification Service", apis: ["OTP", "SMS"], icon: "🔐", description: "OTP-based authentication system.",
    flow: ["User requests OTP", "Orbit generates", "SMS MT delivered", "Verify on callback"], useCase: "Login auth, KYC, txn approval." },
  { id: "pt4", name: "Charged Content Platform", apis: ["CaaS", "Subscription", "SMS"], icon: "💎", description: "Premium content with CaaS charging.",
    flow: ["Subscribe via keyword", "CaaS charging", "Premium content delivered", "Daily rebill"], useCase: "Music, video clips, exclusive content." },
];

export const CATEGORIES_LEGACY = ["Games", "Entertainment", "Health", "Finance", "Utilities"];

export const seedMessageHistory = [
  { date: daysAgo(0), app: "Cricket Live Updates", from: "21333", to: "+8801711234567", message: "BD 245/4 in 40 ov", status: "Delivered" },
  { date: daysAgo(0), app: "Daily Hadith", from: "21333", to: "+8801712345678", message: "Hadith #1234 of Sahih Bukhari", status: "Delivered" },
  { date: daysAgo(1), app: "Weather Today", from: "21333", to: "+8801713456789", message: "Dhaka 31C, light rain", status: "Failed" },
  { date: daysAgo(1), app: "Cricket Live Updates", from: "21333", to: "+8801714567890", message: "BAN won by 7 wickets", status: "Delivered" },
  { date: daysAgo(2), app: "Daily Hadith", from: "21333", to: "+8801715678901", message: "Daily reminder #1235", status: "Delivered" },
];

export const seedReportData = [
  { label: "Jan", value: 12400 },
  { label: "Feb", value: 14210 },
  { label: "Mar", value: 18900 },
  { label: "Apr", value: 21500 },
  { label: "May", value: 19800 },
  { label: "Jun", value: 24600 },
];
