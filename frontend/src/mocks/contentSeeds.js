// Bangladeshi sample data for each template type — used for "Skip — Use Sample Data" and seeded apps.

const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

export const SAMPLE_CONTENT = {
  // ============ E-COMMERCE ============
  "web-ecom": () => ({
    storeInfo: { name: "RobiMart BD", phone: "+880 1700-123456", email: "hello@robimart.bd", address: "House 24, Gulshan Avenue, Dhaka 1212", currency: "BDT" },
    banners: [
      { id: uid("ban"), title: "Eid Sale 60% OFF", subtitle: "On all electronics this week", cta: "Shop Now", link: "Catalog", image: "", color: "#e11d48" },
      { id: uid("ban"), title: "New Electronics Arrived", subtitle: "Latest gadgets in stock", cta: "Browse", link: "Catalog", image: "", color: "#0ea5e9" },
      { id: uid("ban"), title: "Free Delivery Week", subtitle: "Orders above BDT 1,000", cta: "Order Now", link: "Homepage", image: "", color: "#f59e0b" },
    ],
    categories: [
      { id: uid("cat"), name: "Electronics", icon: "📱" },
      { id: uid("cat"), name: "Fashion", icon: "👕" },
      { id: uid("cat"), name: "Home Living", icon: "🏠" },
      { id: uid("cat"), name: "Sports", icon: "⚽" },
      { id: uid("cat"), name: "Beauty", icon: "💄" },
      { id: uid("cat"), name: "Books", icon: "📚" },
    ],
    products: [
      { id: uid("p"), name: "Wireless Headphones", category: "Electronics", price: 4500, salePrice: 2999, stock: 24, status: "Active", image: "", desc: "Premium noise-cancelling headphones" },
      { id: uid("p"), name: "Smart Watch Pro", category: "Electronics", price: 8900, salePrice: null, stock: 2, status: "Active", image: "", desc: "Fitness tracking & calls" },
      { id: uid("p"), name: "Cotton Panjabi", category: "Fashion", price: 850, salePrice: null, stock: 48, status: "Active", image: "", desc: "Premium cotton panjabi" },
      { id: uid("p"), name: "Leather Sneakers", category: "Fashion", price: 2200, salePrice: 1799, stock: 15, status: "Active", image: "", desc: "Genuine leather, all sizes" },
      { id: uid("p"), name: "Rice Cooker", category: "Home Living", price: 3500, salePrice: null, stock: 8, status: "Active", image: "", desc: "1.8L family rice cooker" },
      { id: uid("p"), name: "Yoga Mat", category: "Sports", price: 1200, salePrice: null, stock: 22, status: "Active", image: "", desc: "Non-slip 6mm yoga mat" },
      { id: uid("p"), name: "Moisturizer", category: "Beauty", price: 680, salePrice: null, stock: 0, status: "Active", image: "", desc: "Hydrating face moisturizer" },
      { id: uid("p"), name: "Grammar Book", category: "Books", price: 350, salePrice: null, stock: 60, status: "Active", image: "", desc: "Cambridge English Grammar" },
    ],
  }),
  // ============ RESTAURANT ============
  "web-food": () => ({
    storeInfo: { name: "Deshi Spice Kitchen", phone: "+880 1711-987654", email: "order@deshispice.bd", address: "Road 12, Banani, Dhaka 1213", hours: "11:00 AM - 11:00 PM", currency: "BDT" },
    banners: [
      { id: uid("ban"), title: "Combo Deals from BDT 250", subtitle: "Burger + Drink + Fries", cta: "Order Now", link: "Catalog", image: "", color: "#dc2626" },
      { id: uid("ban"), title: "Free Delivery in Dhaka", subtitle: "Orders above BDT 500", cta: "Browse Menu", link: "Catalog", image: "", color: "#f59e0b" },
    ],
    categories: [
      { id: uid("cat"), name: "Burger", icon: "🍔" },
      { id: uid("cat"), name: "Pizza", icon: "🍕" },
      { id: uid("cat"), name: "Biryani", icon: "🍛" },
      { id: uid("cat"), name: "Drinks", icon: "🥤" },
      { id: uid("cat"), name: "Desserts", icon: "🍰" },
    ],
    menuItems: [
      { id: uid("m"), name: "Beef Burger", category: "Burger", price: 320, desc: "Juicy beef patty, cheese, lettuce", veg: false, spice: "Medium", available: true, image: "" },
      { id: uid("m"), name: "Margherita Pizza", category: "Pizza", price: 580, desc: "Fresh mozzarella, basil, tomato", veg: true, spice: "Mild", available: true, image: "" },
      { id: uid("m"), name: "Chicken Biryani", category: "Biryani", price: 280, desc: "Aromatic basmati rice with chicken", veg: false, spice: "Hot", available: true, image: "" },
      { id: uid("m"), name: "Mango Lassi", category: "Drinks", price: 150, desc: "Fresh mango with yogurt", veg: true, spice: "Mild", available: true, image: "" },
      { id: uid("m"), name: "Gulab Jamun", category: "Desserts", price: 120, desc: "Sweet syrup-soaked dumplings", veg: true, spice: "Mild", available: true, image: "" },
      { id: uid("m"), name: "Veg Pizza", category: "Pizza", price: 520, desc: "Bell pepper, olives, onion", veg: true, spice: "Mild", available: false, image: "" },
    ],
  }),
  // ============ HEALTHCARE ============
  "web-health": () => ({
    storeInfo: { name: "Medilife Clinic", phone: "+880 1722-456789", email: "info@medilife.bd", address: "House 8, Road 4, Dhanmondi, Dhaka 1205", hours: "Mon-Sat 9 AM - 9 PM", currency: "BDT" },
    banners: [
      { id: uid("ban"), title: "Free Health Checkup", subtitle: "Book before Feb 28", cta: "Book Now", link: "Catalog", image: "", color: "#0d9488" },
    ],
    doctors: [
      { id: uid("d"), name: "Dr. Md. Rafiqul Islam", specialty: "Cardiology", qualification: "MBBS, FCPS", experience: 12, fee: 800, days: ["Mon","Wed","Fri"], from: "10:00", to: "14:00", slot: 30, bio: "Senior cardiologist with 12+ years experience", status: "Active", image: "" },
      { id: uid("d"), name: "Dr. Sadia Rahman", specialty: "Pediatrics", qualification: "MBBS, MD", experience: 8, fee: 600, days: ["Tue","Thu","Sat"], from: "16:00", to: "20:00", slot: 20, bio: "Caring pediatrician for newborns and kids", status: "Active", image: "" },
      { id: uid("d"), name: "Dr. Karim Ahmed", specialty: "Neurology", qualification: "MBBS, FRCP", experience: 18, fee: 1200, days: ["Mon","Tue","Thu"], from: "09:00", to: "13:00", slot: 30, bio: "Neurologist specializing in stroke care", status: "Active", image: "" },
      { id: uid("d"), name: "Dr. Nusrat Jahan", specialty: "Gynecology", qualification: "MBBS, FCPS", experience: 10, fee: 700, days: ["Wed","Fri","Sat"], from: "15:00", to: "19:00", slot: 25, bio: "Women's health specialist", status: "Active", image: "" },
    ],
    services: [
      { id: uid("s"), name: "General Checkup", price: 500 },
      { id: uid("s"), name: "ECG", price: 800 },
      { id: uid("s"), name: "Blood Test", price: 350 },
    ],
  }),
  // ============ EDUCATION ============
  "web-edu": () => ({
    storeInfo: { name: "BD Learning Hub", phone: "+880 1733-555000", email: "learn@bdlearn.bd", address: "Mohakhali DOHS, Dhaka", currency: "BDT" },
    banners: [{ id: uid("ban"), title: "New Courses · 50% OFF", subtitle: "Limited time enrollment", cta: "Browse Courses", link: "Catalog", image: "", color: "#7c3aed" }],
    instructors: [
      { id: uid("i"), name: "Prof. Anwar Hussain", title: "English Literature", image: "" },
      { id: uid("i"), name: "Sumaiya Khan", title: "Web Development", image: "" },
    ],
    courses: [
      { id: uid("c"), title: "Complete Web Development", category: "Tech", instructor: "Sumaiya Khan", desc: "From HTML to React & Node.js", price: 2999, originalPrice: 5999, duration: "24 hours (48 lectures)", level: "Beginner", thumb: "", status: "Active", learn: ["HTML/CSS","JavaScript","React","Node.js"] },
      { id: uid("c"), title: "IELTS Preparation", category: "Language", instructor: "Prof. Anwar Hussain", desc: "Score 7+ in IELTS", price: 1500, originalPrice: 3000, duration: "16 hours", level: "Intermediate", thumb: "", status: "Active", learn: ["Reading","Writing","Speaking","Listening"] },
    ],
  }),
  // ============ REAL ESTATE ============
  "web-realestate": () => ({
    storeInfo: { name: "Dhaka Properties", phone: "+880 1744-101010", email: "info@dhakaprops.bd", address: "Gulshan-2, Dhaka", currency: "BDT" },
    banners: [{ id: uid("ban"), title: "Premium Apartments in Gulshan", subtitle: "Move-in ready", cta: "View Listings", link: "Catalog", image: "", color: "#475569" }],
    areas: [{ id: uid("a"), name: "Gulshan" },{ id: uid("a"), name: "Banani" },{ id: uid("a"), name: "Dhanmondi" },{ id: uid("a"), name: "Uttara" }],
    agents: [{ id: uid("ag"), name: "Tahmid Hossain", phone: "+880 1755-222333", image: "" }],
    properties: [
      { id: uid("pr"), title: "3 BHK Apartment in Gulshan", type: "Apartment", listingType: "For Sale", price: 18500000, area: 2200, bedrooms: 3, bathrooms: 3, location: "Gulshan", address: "Road 41", desc: "Premium 3BHK with rooftop access", features: ["Parking","Elevator","Generator","Gas"], agent: "Tahmid Hossain", status: "Active", image: "" },
      { id: uid("pr"), title: "2 BHK Flat in Banani", type: "Apartment", listingType: "For Rent", price: 45000, area: 1400, bedrooms: 2, bathrooms: 2, location: "Banani", address: "Road 11", desc: "Modern flat with city view", features: ["Parking","Elevator","Gas"], agent: "Tahmid Hossain", status: "Active", image: "" },
    ],
  }),
  // ============ TRAVEL ============
  "web-travel": () => ({
    storeInfo: { name: "Wander Bangladesh Tours", phone: "+880 1766-303030", email: "book@wanderbd.bd", address: "Banani, Dhaka", currency: "BDT" },
    banners: [{ id: uid("ban"), title: "Sundarbans Tour Package", subtitle: "3D/2N from BDT 8,500", cta: "Book Now", link: "Catalog", image: "", color: "#0ea5e9" }],
    destinations: [{ id: uid("dest"), name: "Cox's Bazar" },{ id: uid("dest"), name: "Sundarbans" },{ id: uid("dest"), name: "Sajek Valley" },{ id: uid("dest"), name: "Bandarban" }],
    packages: [
      { id: uid("tk"), name: "Cox's Bazar Beach Holiday", destination: "Cox's Bazar", days: 3, nights: 2, price: 7500, min: 2, max: 20, category: "Beach", status: "Active", image: "", highlights: ["Beach resort stay","Inani beach trip","Seafood dinner"], inclusions: ["Hotel","Meals","Transport"], exclusions: ["Personal expenses"] },
      { id: uid("tk"), name: "Sajek Valley Adventure", destination: "Sajek Valley", days: 3, nights: 2, price: 6900, min: 4, max: 15, category: "Hill", status: "Active", image: "", highlights: ["Cloud-top resort","Tribal village","Sunrise point"], inclusions: ["Cottages","Meals","Jeep"], exclusions: ["Drinks"] },
    ],
  }),
  // ============ NGO ============
  "web-ngo": () => ({
    storeInfo: { name: "Hope Foundation BD", phone: "+880 1777-404040", email: "give@hopebd.org", address: "Mirpur DOHS, Dhaka", currency: "BDT" },
    banners: [{ id: uid("ban"), title: "Help Feed 1000 Families", subtitle: "Eid Food Drive 2026", cta: "Donate", link: "Catalog", image: "", color: "#22c55e" }],
    team: [{ id: uid("t"), name: "Reza Karim", role: "Founder", image: "" }],
    impact: { mealsServed: 12400, familiesHelped: 832, volunteers: 156 },
    campaigns: [
      { id: uid("cmp"), title: "Eid Food Drive 2026", desc: "Provide Iftar packages to 1000 families", goal: 500000, raised: 184000, urgent: true, status: "Active", image: "" },
      { id: uid("cmp"), title: "School Supplies for Slum Kids", desc: "Bags, books, uniforms for 300 children", goal: 250000, raised: 89000, urgent: false, status: "Active", image: "" },
    ],
  }),
  // ============ SAAS ============
  "web-saas": () => ({
    storeInfo: { name: "TaskFlow BD", phone: "+880 1788-505050", email: "hello@taskflow.bd", address: "Bashundhara R/A, Dhaka", currency: "BDT" },
    banners: [{ id: uid("ban"), title: "Run Your Team On Autopilot", subtitle: "Start free trial today", cta: "Try Free", link: "Homepage", image: "", color: "#0f172a" }],
    pricing: [
      { id: uid("pr"), name: "Starter", price: 0, period: "month", features: ["Up to 5 users","Basic features","Email support"] },
      { id: uid("pr"), name: "Pro", price: 1500, period: "month", features: ["Up to 25 users","All features","Priority support","API access"] },
      { id: uid("pr"), name: "Enterprise", price: 5000, period: "month", features: ["Unlimited users","SLA","Dedicated manager","Custom integrations"] },
    ],
    testimonials: [{ id: uid("ts"), name: "Faria Sultana", company: "GrowthLab BD", quote: "Increased team productivity by 40%", image: "" }],
  }),
  // ============ NEWS (NewsNow BD) ============
  "web-newsnow": () => ({
    storeInfo: { name: "NewsNow BD", phone: "+880 1700-400400", email: "newsroom@newsnow.bd", address: "Karwan Bazar, Dhaka 1215", hours: "24/7 Newsroom", currency: "BDT" },
    newsBanner: { headline: "Bangladesh Economy Grows 6.5% in Q4 — GDP Report 2026", subhead: "Finance Minister credits digital service economy as a 'major contributor' to growth.", featuredImage: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1200&q=80", breakingBadge: true },
    newsCategories: [
      { id: uid("nc"), name: "Politics", slug: "politics", color: "#dc2626" },
      { id: uid("nc"), name: "Sports", slug: "sports", color: "#16a34a" },
      { id: uid("nc"), name: "Business", slug: "business", color: "#d97706" },
      { id: uid("nc"), name: "Technology", slug: "technology", color: "#2563eb" },
      { id: uid("nc"), name: "Entertainment", slug: "entertainment", color: "#9333ea" },
      { id: uid("nc"), name: "International", slug: "international", color: "#0891b2" },
      { id: uid("nc"), name: "Lifestyle", slug: "lifestyle", color: "#db2777" },
    ],
    articles: [
      { id: uid("art"), title: "Bangladesh Economy Grows 6.5% in Q4 — GDP Report 2026", subtitle: "Strong garment exports, remittance inflows lead growth", summary: "Bangladesh's economy expanded by 6.5% in the fourth quarter, exceeding analyst expectations driven by strong garment exports and remittance inflows.", content: "Bangladesh's economy expanded by 6.5% in the fourth quarter of 2025-26, exceeding analyst expectations of 5.8%. The growth was driven by a 12% jump in garment exports, an 18% increase in remittance inflows from the Middle East, and a notable rise in domestic consumption fueled by easing inflation.\n\nFinance Minister highlighted the Robi-backed digital service economy as a 'major contributor' to the growth, citing the 2 billion BDT generated through telecom-native apps in 2025.\n\nThe BB governor also confirmed inflation has eased to 6.1%, well within the target band. Analysts now expect another rate cut at the next monetary policy committee meeting in March.", author: "Mehedi Hassan", publishDate: "2026-02-14", featuredImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1000&q=80", category: "Business", tags: ["GDP","Economy","Bangladesh"], readTime: 5, featured: true, trending: true, status: "Published" },
      { id: uid("art"), title: "Metro Rail Extension to Gazipur Inaugurated", subtitle: "Cuts commute times by half for 4M daily commuters", summary: "The PM inaugurated the metro rail extension from Uttara to Gazipur.", content: "The Prime Minister has officially inaugurated the metro rail extension from Uttara to Gazipur, cutting commute times by half for the 4 million daily commuters. The new 22km stretch features 8 stations and will run every 4 minutes during peak hours.", author: "Bangladesh Sangbad Sangstha", publishDate: "2026-02-14", featuredImage: "https://images.unsplash.com/photo-1581262208435-41726149a759?w=1000&q=80", category: "Politics", tags: ["Metro","Infrastructure"], readTime: 3, featured: true, trending: true, status: "Published" },
      { id: uid("art"), title: "Bangladesh Wins Asia Cup Series Against Pakistan", subtitle: "Shakib named Player of the Series in 2-1 victory", summary: "Bangladesh clinched a thrilling 2-1 series victory against Pakistan.", content: "Bangladesh clinched a thrilling 2-1 series victory against Pakistan in the Asia Cup ODI series. Shakib Al Hasan was named player of the series. The decider in Mirpur drew over 25,000 fans.", author: "T Sports", publishDate: "2026-02-13", featuredImage: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1000&q=80", category: "Sports", tags: ["Cricket","Asia Cup"], readTime: 2, featured: false, trending: true, status: "Published" },
      { id: uid("art"), title: "Orbit Reaches 10 Million Developer Downloads", subtitle: "Platform now hosts 5,000+ active developer apps", summary: "Robi's Orbit platform crossed 10 million downloads.", content: "Robi's Orbit platform crossed 10 million downloads across its developer-built apps. The platform now hosts over 5,000 active apps from 1,200+ Bangladeshi developers.", author: "Tech Desk", publishDate: "2026-02-14", featuredImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1000&q=80", category: "Technology", tags: ["Orbit","Robi"], readTime: 3, featured: true, trending: false, status: "Published" },
      { id: uid("art"), title: "DSE Index Rises 2.4% on Banking Sector Strength", subtitle: "Main index closes at 6,310 led by banks and pharma", summary: "The DSE main index closed at 6,310, up 2.4%.", content: "The DSE main index closed at 6,310, up 2.4% led by banking and pharma stocks. Daily turnover crossed BDT 12 billion for the first time in eight months.", author: "Business Desk", publishDate: "2026-02-14", featuredImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1000&q=80", category: "Business", tags: ["Stocks","DSE"], readTime: 3, featured: false, trending: false, status: "Published" },
      { id: uid("art"), title: "Shakib Al Hasan Retires from T20 Internationals", subtitle: "End of an era after 17 years in international cricket", summary: "Shakib Al Hasan announced his retirement from T20I cricket.", content: "Shakib Al Hasan announced his retirement from T20I cricket after 17 years. He thanked fans at a press conference held at the BCB head office. He will continue playing ODIs and Tests.", author: "Sports Desk", publishDate: "2026-02-14", featuredImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1000&q=80", category: "Sports", tags: ["Cricket","Shakib"], readTime: 2, featured: true, trending: true, status: "Published" },
      { id: uid("art"), title: "UN Climate Summit: Bangladesh Secures $500M Fund", subtitle: "Climate adaptation funding announced at COP", summary: "Bangladesh secured USD 500 million in climate adaptation funding.", content: "Bangladesh secured USD 500 million in climate adaptation funding at the UN COP summit. The fund will support coastal embankment projects and salinity-resistant crop research.", author: "International Desk", publishDate: "2026-02-13", featuredImage: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=1000&q=80", category: "International", tags: ["Climate","UN"], readTime: 4, featured: false, trending: false, status: "Published" },
      { id: uid("art"), title: "Robi Launches 5G Pilot in Gulshan", subtitle: "Speeds exceed 1Gbps in initial trials", summary: "Robi has begun 5G trials in select areas of Dhaka.", content: "Robi has begun 5G trials in select areas of Dhaka, with speeds exceeding 1Gbps in initial tests. Commercial rollout is expected by Q3 2026.", author: "Robi Newsroom", publishDate: "2026-02-12", featuredImage: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1000&q=80", category: "Technology", tags: ["5G","Robi"], readTime: 3, featured: false, trending: true, status: "Published" },
    ],
    trending: [
      { id: uid("tr"), headline: "Shakib Al Hasan retires from T20Is", priority: 1 },
      { id: uid("tr"), headline: "GDP grows 6.5% in Q4", priority: 2 },
      { id: uid("tr"), headline: "Gazipur metro line opens", priority: 3 },
      { id: uid("tr"), headline: "Robi 5G pilot in Gulshan", priority: 4 },
      { id: uid("tr"), headline: "Asia Cup: Bangladesh beats Pakistan", priority: 5 },
    ],
    editorsPicks: [
      { id: uid("ep"), articleTitle: "Bangladesh Economy Grows 6.5% in Q4 — GDP Report 2026", note: "Most important read of the week" },
      { id: uid("ep"), articleTitle: "Shakib Al Hasan Retires from T20 Internationals", note: "End of an era" },
      { id: uid("ep"), articleTitle: "Orbit Reaches 10 Million Developer Downloads", note: "Bangladesh tech milestone" },
    ],
    ads: [
      { id: uid("ad"), name: "Sidebar Sponsor — Robi", image: "", targetUrl: "https://robi.com.bd", placement: "Sidebar" },
      { id: uid("ad"), name: "Top Banner — Orbit", image: "", targetUrl: "https://orbit.com", placement: "Header" },
    ],
    liveFeed: [
      { id: uid("lf"), source: "Prothom Alo", endpoint: "https://api.prothomalo.com/rss", category: "All" },
      { id: uid("lf"), source: "Daily Star BD", endpoint: "https://api.thedailystar.net/rss", category: "All" },
      { id: uid("lf"), source: "BBC Bangla", endpoint: "https://feeds.bbci.co.uk/bengali/rss.xml", category: "International" },
    ],
  }),
  // ============ QUIZ (QuizBD) ============
  "web-quizbd": () => ({
    storeInfo: { name: "QuizBD", phone: "+880 1700-500500", email: "play@quizbd.com", address: "Banani, Dhaka", hours: "Always Open", currency: "BDT" },
    quizDetails: { title: "Bangladesh Knowledge Master", description: "Test your knowledge of Bangladesh — history, sports, culture, and current affairs. Climb the leaderboard, earn certificates, and win prizes!", coverImage: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1200&q=80", category: "General Knowledge" },
    quizCategories: [
      { id: uid("qc"), name: "Bangladesh GK", icon: "🇧🇩", color: "#16a34a" },
      { id: uid("qc"), name: "Islam & Religion", icon: "🕌", color: "#0891b2" },
      { id: uid("qc"), name: "Science & Tech", icon: "🔬", color: "#2563eb" },
      { id: uid("qc"), name: "Sports", icon: "⚽", color: "#d97706" },
      { id: uid("qc"), name: "Entertainment", icon: "🎬", color: "#9333ea" },
    ],
    questions: [
      { id: uid("q"), text: "What is the national flower of Bangladesh?", type: "multiple-choice", options: ["Water Lily (Shapla)", "Rose", "Lotus", "Orchid"], correct: 0, explanation: "Shapla (Water Lily) is the national flower of Bangladesh.", difficulty: "Easy", category: "Bangladesh GK", points: 10 },
      { id: uid("q"), text: "How many districts are in Bangladesh?", type: "multiple-choice", options: ["48", "64", "72", "56"], correct: 1, explanation: "Bangladesh has 64 administrative districts across 8 divisions.", difficulty: "Easy", category: "Bangladesh GK", points: 10 },
      { id: uid("q"), text: "In which year did Bangladesh gain independence?", type: "multiple-choice", options: ["1947", "1970", "1971", "1975"], correct: 2, explanation: "Bangladesh declared independence on March 26, 1971.", difficulty: "Easy", category: "Bangladesh GK", points: 10 },
      { id: uid("q"), text: "What is the longest river in Bangladesh?", type: "multiple-choice", options: ["Buriganga", "Karnaphuli", "Meghna", "Jamuna"], correct: 3, explanation: "Jamuna is the longest river in Bangladesh.", difficulty: "Medium", category: "Bangladesh GK", points: 15 },
      { id: uid("q"), text: "How many pillars of Islam are there?", type: "multiple-choice", options: ["3", "4", "5", "6"], correct: 2, explanation: "There are 5 pillars of Islam.", difficulty: "Easy", category: "Islam & Religion", points: 10 },
      { id: uid("q"), text: "What does CPU stand for?", type: "multiple-choice", options: ["Central Power Unit", "Computer Processing Unit", "Central Processing Unit", "Core Power Unit"], correct: 2, explanation: "CPU stands for Central Processing Unit.", difficulty: "Easy", category: "Science & Tech", points: 10 },
      { id: uid("q"), text: "Bangladesh's most capped Test cricketer?", type: "multiple-choice", options: ["Mashrafe Mortaza", "Shakib Al Hasan", "Tamim Iqbal", "Mushfiqur Rahim"], correct: 1, explanation: "Shakib Al Hasan holds the record for most Test caps.", difficulty: "Medium", category: "Sports", points: 15 },
      { id: uid("q"), text: "Who wrote 'Amar Sonar Bangla'?", type: "multiple-choice", options: ["Rabindranath Tagore", "Kazi Nazrul Islam", "Lalon Shah", "Shyamal Mitra"], correct: 0, explanation: "Rabindranath Tagore wrote the Bangladesh national anthem.", difficulty: "Easy", category: "Entertainment", points: 10 },
    ],
    quizSettings: { timeLimit: 10, passingScore: 60, attemptsAllowed: 3, randomize: true, showExplanations: true },
    leaderboardSettings: { enabled: true, rankingRule: "Points + Streak", showWeekly: true, showAllTime: true },
    certificates: [
      { id: uid("cert"), name: "Bronze Achiever", template: "minimal-bronze", passingRequirement: 60, color: "#a16207" },
      { id: uid("cert"), name: "Silver Scholar", template: "modern-silver", passingRequirement: 75, color: "#94a3b8" },
      { id: uid("cert"), name: "Gold Master", template: "elegant-gold", passingRequirement: 90, color: "#eab308" },
    ],
  }),
  // ============ MATRIMONY (SathiBD) ============
  "web-sathibd": () => ({
    storeInfo: { name: "SathiBD Matrimony", phone: "+880 1700-000000", email: "hello@sathibd.com", address: "Banani Road 11, Dhaka 1213", hours: "24/7 Online Support", currency: "BDT" },
    profiles: [
      { id: uid("pf"), name: "Rahima Akter", age: 26, gender: "Female", district: "Dhaka", religion: "Islam", education: "Masters", profession: "Software Engineer", height: "155cm", maritalStatus: "Never Married", about: "Family-oriented engineer who loves reading and travel.", status: "Active", featured: true, image: "" },
      { id: uid("pf"), name: "Nafisa Elizabeth", age: 24, gender: "Female", district: "Chittagong", religion: "Islam", education: "MBBS", profession: "Doctor", height: "160cm", maritalStatus: "Never Married", about: "Pediatrician passionate about child welfare.", status: "Active", featured: true, image: "" },
      { id: uid("pf"), name: "Nusrat Jahan", age: 27, gender: "Female", district: "Sylhet", religion: "Islam", education: "Honors", profession: "Banker", height: "158cm", maritalStatus: "Never Married", about: "Loves classical music and cooking.", status: "Active", featured: false, image: "" },
      { id: uid("pf"), name: "Karim Ahmed", age: 30, gender: "Male", district: "Dhaka", religion: "Islam", education: "Engineering", profession: "Civil Engineer", height: "175cm", maritalStatus: "Never Married", about: "Designs sustainable homes for Bangladesh.", status: "Active", featured: true, image: "" },
      { id: uid("pf"), name: "Tanvir Hossain", age: 29, gender: "Male", district: "Khulna", religion: "Islam", education: "MBBS", profession: "Doctor", height: "170cm", maritalStatus: "Never Married", about: "Family man who enjoys cricket and travelling.", status: "Active", featured: false, image: "" },
      { id: uid("pf"), name: "Rafiqul Karim", age: 31, gender: "Male", district: "Rajshahi", religion: "Islam", education: "PhD", profession: "University Professor", height: "178cm", maritalStatus: "Never Married", about: "Practising professor at Rajshahi University.", status: "Active", featured: false, image: "" },
    ],
    stories: [
      { id: uid("st"), couple: "Imran & Tahmina", year: "2025", district: "Dhaka", quote: "Met on SathiBD in October, married in December. The OTP-verified profiles made us feel safe from day one.", image: "" },
      { id: uid("st"), couple: "Sabbir & Mehjabin", year: "2024", district: "Chittagong", quote: "Our families connected through SathiBD's SMS interest alerts. Alhamdulillah, we're now a family of three!", image: "" },
      { id: uid("st"), couple: "Rafi & Anika", year: "2024", district: "Sylhet", quote: "OTP-verified contact unlock was worth every taka — saved us months of intermediaries.", image: "" },
    ],
    plans: [
      { id: uid("pl"), name: "Free", price: 0, period: "lifetime", features: ["View 5 premium profiles/month","Browse free profiles","Send interest"], badge: "", status: "Active" },
      { id: uid("pl"), name: "Gold", price: 349, period: "month", features: ["20 premium profiles/month","Full profile view","View contact info","Send + accept interest","Start chat"], badge: "Most Popular", status: "Active" },
      { id: uid("pl"), name: "Platinum", price: 549, period: "month", features: ["50 premium profiles/month","All Gold features","Profile boost 2×/month","Priority support","Special matchmaking"], badge: "Best Value", status: "Active" },
    ],
  }),
};

// Map android template IDs to web equivalents
SAMPLE_CONTENT["and-ecom"] = SAMPLE_CONTENT["web-ecom"];
SAMPLE_CONTENT["and-food"] = SAMPLE_CONTENT["web-food"];
SAMPLE_CONTENT["and-doctor"] = SAMPLE_CONTENT["web-health"];
SAMPLE_CONTENT["and-edu"] = SAMPLE_CONTENT["web-edu"];
SAMPLE_CONTENT["and-travel"] = SAMPLE_CONTENT["web-travel"];
// Matrimony — Pro + Android share the same seed
SAMPLE_CONTENT["pro-sathibd"] = SAMPLE_CONTENT["web-sathibd"];
SAMPLE_CONTENT["and-sathibd"] = SAMPLE_CONTENT["web-sathibd"];
// News (NewsNow BD) — Pro + Android share the same seed
SAMPLE_CONTENT["pro-newsnow"] = SAMPLE_CONTENT["web-newsnow"];
SAMPLE_CONTENT["and-newsnow"] = SAMPLE_CONTENT["web-newsnow"];
SAMPLE_CONTENT["and-news"] = SAMPLE_CONTENT["web-newsnow"];
// Quiz (QuizBD) — Pro + Android share the same seed
SAMPLE_CONTENT["pro-quizbd"] = SAMPLE_CONTENT["web-quizbd"];
SAMPLE_CONTENT["and-quizbd"] = SAMPLE_CONTENT["web-quizbd"];

// Default empty content per template type — used at start of Step 4
export const EMPTY_CONTENT = {
  ecommerce: { storeInfo: {}, banners: [], categories: [], products: [] },
  restaurant: { storeInfo: {}, banners: [], categories: [], menuItems: [] },
  health: { storeInfo: {}, banners: [], doctors: [], services: [] },
  education: { storeInfo: {}, banners: [], instructors: [], courses: [] },
  realestate: { storeInfo: {}, banners: [], areas: [], agents: [], properties: [] },
  travel: { storeInfo: {}, banners: [], destinations: [], packages: [] },
  ngo: { storeInfo: {}, banners: [], team: [], impact: {}, campaigns: [] },
  saas: { storeInfo: {}, banners: [], pricing: [], testimonials: [] },
  matrimony: { storeInfo: {}, profiles: [], stories: [], plans: [] },
  news: { storeInfo: {}, newsBanner: {}, newsCategories: [], articles: [], trending: [], editorsPicks: [], ads: [], liveFeed: [] },
  quiz: { storeInfo: {}, quizDetails: {}, quizCategories: [], questions: [], quizSettings: {}, leaderboardSettings: {}, certificates: [] },
};

export const TEMPLATE_KIND = {
  "web-ecom": "ecommerce", "and-ecom": "ecommerce",
  "web-food": "restaurant", "and-food": "restaurant",
  "web-health": "health", "and-doctor": "health",
  "web-edu": "education", "and-edu": "education",
  "web-realestate": "realestate",
  "web-travel": "travel", "and-travel": "travel",
  "web-ngo": "ngo",
  "web-saas": "saas",
  // Matrimony (SathiBD) — Web / Pro / Android all isolated
  "web-sathibd": "matrimony",
  "pro-sathibd": "matrimony",
  "and-sathibd": "matrimony",
  // News (NewsNow BD) — Web / Pro / Android isolated
  "web-newsnow": "news",
  "pro-newsnow": "news",
  "and-newsnow": "news",
  "and-news": "news",
  // Quiz (QuizBD) — Web / Pro / Android isolated
  "web-quizbd": "quiz",
  "pro-quizbd": "quiz",
  "and-quizbd": "quiz",
};

export const getKindFor = (templateId) => TEMPLATE_KIND[templateId] || "ecommerce";

// Sample orders (e-commerce / restaurant / travel)
export const sampleOrders = (kind) => {
  const customers = ["Karim Ahmed","Sadia Rahman","Tahmid Hossain","Rafiqul Islam","Nusrat Jahan","Faria Sultana","Anwar Hussain","Sumaiya Khan"];
  const methods = ["bKash","Nagad","Card","COD","Rocket"];
  const statuses = ["New","Processing","Shipped","Delivered","Cancelled"];
  return Array.from({ length: 12 }).map((_, i) => ({
    id: `BD-${String(249 - i).padStart(5, "0")}`,
    customer: customers[i % customers.length],
    phone: `+880 17${10 + i}-${String(100000 + i * 137).slice(-6)}`,
    address: ["Gulshan","Banani","Dhanmondi","Uttara","Mirpur"][i % 5] + ", Dhaka",
    items: [{ name: kind === "restaurant" ? "Chicken Biryani" : "Wireless Headphones", qty: 1 + (i % 3), price: 280 * (1 + (i % 3)) }],
    total: (280 + i * 213) % 5000 + 200,
    method: methods[i % methods.length],
    status: i < 3 ? "New" : statuses[i % statuses.length],
    date: new Date(Date.now() - i * 3600 * 1000 * (i + 1)).toISOString().slice(0, 10),
  }));
};

// Sample appointments (health)
export const sampleAppointments = () => {
  const patients = ["Sajib Hossain","Mim Akter","Rashed Khan","Tania Rahman","Ashik Mahmud","Sumon Ali","Nadia Islam","Imran Hossain"];
  const docs = ["Dr. Md. Rafiqul Islam","Dr. Sadia Rahman","Dr. Karim Ahmed","Dr. Nusrat Jahan"];
  const specs = ["Cardiology","Pediatrics","Neurology","Gynecology"];
  return Array.from({ length: 18 }).map((_, i) => ({
    id: `APT-${String(i + 1).padStart(4, "0")}`,
    patient: patients[i % patients.length],
    phone: `+880 17${10 + (i % 6)}-${String(200000 + i * 191).slice(-6)}`,
    doctor: docs[i % 4],
    specialty: specs[i % 4],
    fee: [600, 800, 1200, 700][i % 4],
    date: new Date(Date.now() + (i - 6) * 86400000).toISOString().slice(0, 10),
    time: ["10:00","11:00","12:00","15:00","16:00","17:00","18:00"][i % 7],
    status: i < 3 ? "Scheduled" : i < 6 ? "Confirmed" : i < 12 ? "Completed" : "Cancelled",
  }));
};

export const sampleReviews = () => {
  const names = ["Karim Ahmed","Sadia Rahman","Tahmid Hossain","Rafiqul Islam","Faria Sultana"];
  return Array.from({ length: 14 }).map((_, i) => ({
    id: `RV-${i + 1}`,
    name: names[i % names.length],
    rating: 5 - (i % 3),
    text: ["Excellent service!","Quality is amazing.","Fast delivery, satisfied.","Will buy again.","Affordable and great quality."][i % 5],
    target: "Product",
    date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
    status: i < 2 ? "Pending" : "Approved",
    reply: "",
  }));
};

export const sampleCustomers = () => {
  const names = ["Karim Ahmed","Sadia Rahman","Tahmid Hossain","Rafiqul Islam","Nusrat Jahan","Faria Sultana","Anwar Hussain","Sumaiya Khan","Imran Khan","Maria Begum"];
  return names.map((n, i) => ({
    id: `CUS-${String(i + 1).padStart(4, "0")}`,
    name: n,
    phone: `+880 17${10 + i}-${String(300000 + i * 271).slice(-6)}`,
    email: `${n.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
    orders: 1 + (i % 5),
    spent: 2500 + (i * 437) % 12000,
    lastOrder: new Date(Date.now() - i * 86400000 * 2).toISOString().slice(0, 10),
  }));
};

export const sampleActivity = (kind) => {
  const base = [
    { type: "order", text: "🛒 New order #BD-00249 — BDT 2,450", ago: "2 min ago" },
    { type: "customer", text: "👤 New customer registered — Karim Ahmed", ago: "15 min ago" },
    { type: "review", text: "⭐ New review — 5 stars for Wireless Headphones", ago: "1 hr ago" },
    { type: "stock", text: "📦 Product 'Smart Watch Pro' is low stock (2 left)", ago: "3 hrs ago" },
    { type: "payment", text: "💳 Payment received — BDT 4,500 via bKash", ago: "5 hrs ago" },
    { type: "order", text: "🛒 New order #BD-00248 — BDT 1,890", ago: "6 hrs ago" },
    { type: "review", text: "⭐ New review — 4 stars for Cotton Panjabi", ago: "8 hrs ago" },
    { type: "stock", text: "📦 Restocked 'Leather Sneakers' (+30 units)", ago: "yesterday" },
  ];
  if (kind === "health") {
    return [
      { type: "appointment", text: "📅 New appointment booked — Sajib Hossain with Dr. Rafiqul Islam", ago: "5 min ago" },
      { type: "patient", text: "👤 New patient registered — Mim Akter", ago: "20 min ago" },
      { type: "review", text: "⭐ 5-star review for Dr. Sadia Rahman", ago: "1 hr ago" },
      { type: "payment", text: "💳 Consultation fee received — BDT 800", ago: "2 hrs ago" },
      { type: "appointment", text: "📅 Appointment confirmed — Rashed Khan", ago: "3 hrs ago" },
    ];
  }
  if (kind === "restaurant") {
    return [
      { type: "order", text: "🍽 New order — Chicken Biryani x2 — BDT 560", ago: "3 min ago" },
      { type: "review", text: "⭐ 5-star review for Beef Burger", ago: "10 min ago" },
      { type: "stock", text: "📦 Menu item 'Veg Pizza' marked unavailable", ago: "20 min ago" },
      { type: "order", text: "🍽 New order — Margherita Pizza x1 — BDT 580", ago: "45 min ago" },
    ];
  }
  return base;
};
