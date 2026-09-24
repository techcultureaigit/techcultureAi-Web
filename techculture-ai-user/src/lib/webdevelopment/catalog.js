import { mainSiteHref, slugify, webdevHref } from "./paths";

function productPage({
  title,
  summary,
  about,
  highlights = [],
  productPath = "/services",
  category = "products",
}) {
  const slug = slugify(title);
  return {
    slug,
    title,
    summary,
    about,
    highlights,
    category,
    href: webdevHref(`/products/${slug}`),
    productHref: mainSiteHref(productPath),
    ctaLabel: "Open this product",
  };
}

function industryPage({
  title,
  summary,
  about,
  highlights = [],
  productPath = "/services",
}) {
  const slug = slugify(title);
  return {
    slug,
    title,
    summary,
    about,
    highlights,
    category: "industries",
    href: webdevHref(`/industries/${slug}`),
    productHref: mainSiteHref(productPath),
    ctaLabel: "Explore related solutions",
  };
}

export const productPages = [
  productPage({
    title: "Aadhaar Verification",
    summary: "Instant, compliant Aadhaar-based identity checks for onboarding.",
    about:
      "Aadhaar Verification helps you confirm customer identity in real time with secure OTP/biometric flows, reducing fraud and speeding up account opening. Use it wherever regulated identity proof is required.",
    highlights: [
      "Real-time verification APIs",
      "OTP and biometric-ready flows",
      "Audit-friendly request logs",
      "Easy embed into onboarding journeys",
    ],
    productPath: "/services",
  }),
  productPage({
    title: "Digital KYC",
    summary: "End-to-end digital KYC for individuals with OCR and liveness.",
    about:
      "Digital KYC digitises paper-heavy verification. Capture documents, extract data with OCR, run liveness checks, and push straight-through approvals where rules allow — with full compliance trail.",
    highlights: [
      "Document OCR & validation",
      "Liveness / face match",
      "Rule-based auto-approval",
      "SEBI-friendly audit logs",
    ],
    productPath: "/services",
  }),

  productPage({
    title: "Re-KYC",
    summary: "Periodic re-KYC campaigns with automated reminders.",
    about:
      "Re-KYC keeps customer records current. Trigger campaigns by expiry windows, push WhatsApp/email nudges, and collect refreshed proofs without rebuilding your core KYC stack.",
    highlights: [
      "Expiry-based triggers",
      "Omnichannel reminders",
      "Diff-based document updates",
      "Campaign dashboards",
    ],
    productPath: "/services",
  }),
  productPage({
    title: "Account Closure",
    summary: "Compliant account closure with checklist and audit trail.",
    about:
      "Account Closure standardises the exit journey — collect reasons, clear dues, capture e-consent, and generate an auditable closure pack for back office.",
    highlights: [
      "Guided closure checklist",
      "eSign / consent capture",
      "Ops task queue",
      "Final status callbacks",
    ],
    productPath: "/services",
  }),

  productPage({
    title: "Online IPO Bidding",
    summary: "Digital IPO bidding experience for investors.",
    about:
      "Online IPO Bidding digitises application and bidding flows so brokers and platforms can offer a smooth, compliant IPO participation journey to investors.",
    highlights: [
      "Investor application flow",
      "Bid capture",
      "Status updates",
      "Ops reconciliation hooks",
    ],
    productPath: "/services",
  }),
];

export const industryPages = [
  industryPage({
    title: "Banking & FinTech",
    summary: "Secure automation for modern finance.",
    about:
      "For banks and fintechs we combine KYC, eSign, middleware routing and engagement tools so onboarding, compliance and customer service stay fast and audit-ready.",
    highlights: [
      "Digital KYC & Re-KYC",
      "Middleware to UCC / DP / KRA",
      "WhatsApp & CRM journeys",
      "Audit & logging",
    ],
  }),
  industryPage({
    title: "Healthcare",
    summary: "Smarter patient and ops workflows.",
    about:
      "Healthcare teams use our stack for patient onboarding, appointment scheduling, consent eSign and support desks — reducing admin load on clinical staff.",
    highlights: [
      "Patient onboarding",
      "Appointment scheduler",
      "Consent eSign",
      "Helpdesk for patients",
    ],
  }),
  industryPage({
    title: "Travel & Hospitality",
    summary: "Personalized journeys at scale.",
    about:
      "Travel brands personalise booking follow-ups, support and partner onboarding with automation — keeping guests informed across WhatsApp, email and chat.",
    highlights: [
      "Lead & booking nurture",
      "Live chat support",
      "Partner onboarding",
      "Campaign automation",
    ],
  }),
  industryPage({
    title: "Manufacturing",
    summary: "Predictive ops and quality AI.",
    about:
      "Manufacturers digitise supplier onboarding, field service and internal helpdesk so plants and vendors stay connected with fewer email threads.",
    highlights: [
      "Supplier onboarding",
      "Field service",
      "Internal helpdesk",
      "Vendor compliance",
    ],
  }),
  industryPage({
    title: "EdTech",
    summary: "Adaptive learning experiences.",
    about:
      "EdTech platforms use our engagement and onboarding tools for student/parent journeys, counsellor appointments and WhatsApp notifications.",
    highlights: [
      "Lead management",
      "Appointment scheduling",
      "WhatsApp automation",
      "Support helpdesk",
    ],
  }),
  industryPage({
    title: "E-Commerce",
    summary: "Conversion-focused commerce AI.",
    about:
      "E-commerce teams convert better with abandoned-cart messaging, live chat, and AI assistants that answer product questions around the clock.",
    highlights: [
      "AI virtual assistant",
      "WhatsApp campaigns",
      "Live chat",
      "Lead / order nurture",
    ],
  }),
  industryPage({
    title: "Logistics",
    summary: "Route, fleet and delivery intelligence.",
    about:
      "Logistics operators dispatch field jobs, update customers and onboard gig drivers digitally — reducing missed deliveries and paper forms.",
    highlights: [
      "Field service dispatch",
      "Gig onboarding",
      "Customer notifications",
      "Helpdesk for exceptions",
    ],
  }),
  industryPage({
    title: "Telecom",
    summary: "Customer care and network insights.",
    about:
      "Telecom brands scale care with contact center, helpdesk and automated KYC/re-KYC for SIM and service journeys.",
    highlights: [
      "Contact center",
      "Re-KYC campaigns",
      "WhatsApp support",
      "Ticketed helpdesk",
    ],
  }),
  industryPage({
    title: "Real Estate",
    summary: "Lead scoring and virtual tours.",
    about:
      "Real estate teams capture site-visit leads, schedule appointments and nurture buyers on WhatsApp until booking — with clear pipeline visibility.",
    highlights: [
      "Lead scoring",
      "Appointment scheduler",
      "Sales pipeline",
      "WhatsApp nurture",
    ],
  }),
  industryPage({
    title: "Insurance",
    summary: "Faster claims and risk scoring.",
    about:
      "Insurers accelerate onboarding and claims intake with digital KYC, eSign and guided document capture — cutting cycle time without losing control.",
    highlights: [
      "Digital KYC",
      "eSign for proposals",
      "Document workflows",
      "Helpdesk for claims",
    ],
  }),
];

export const hubPages = {
  "ai-automation": {
    slug: "ai-automation",
    title: "AI-Automation",
    summary: "Intelligent automation that streamlines ops and unlocks growth.",
    about:
      "AI-Automation brings together conversational AI, workflow automation and service orchestration. Read about each capability below, then open the live product experience we have already built on the main platform.",
    highlights: [
      "Service automation catalogue",
      "Chat & voice assistants",
      "Ops workflow accelerators",
      "Measurable ROI dashboards",
    ],
    productHref: mainSiteHref("/services"),
    ctaLabel: "Open AI services",
    related: "products",
  },
  products: {
    slug: "products",
    title: "Products",
    summary: "Identity, onboarding, engagement and IPO products in one suite.",
    about:
      "Our product suite covers identity & compliance, digital signatures, onboarding, AI communication, customer engagement and IPO services. Each product page explains what it does — then takes you to the live product.",
    highlights: [
      "Identity & KYC",
      "eSign & onboarding",
      "Engagement CRM tools",
      "IPO bidding",
    ],
    productHref: mainSiteHref("/services"),
    ctaLabel: "Browse all products",
    related: "products",
  },
  industries: {
    slug: "industries",
    title: "Industries",
    summary: "Industry-ready AI and automation for your sector.",
    about:
      "Every industry has different compliance, speed and customer-care needs. Explore how we apply KYC, middleware, engagement and automation to your vertical — then jump into the matching solutions.",
    highlights: [
      "FinTech to Insurance",
      "Sector playbooks",
      "Compliance-aware design",
      "Proven delivery patterns",
    ],
    productHref: mainSiteHref("/services"),
    ctaLabel: "View industry solutions",
    related: "industries",
  },
  portfolio: {
    slug: "portfolio",
    title: "Portfolio",
    summary: "Selected work across products, industries and platforms.",
    about:
      "Our portfolio shows real implementations — from KYC ecosystems to engagement platforms. Browse case studies on the main portfolio experience, then talk to us about a similar build.",
    highlights: [
      "Case studies",
      "Category filters",
      "Outcome-focused stories",
      "Tech stack highlights",
    ],
    productHref: mainSiteHref("/portfolio"),
    ctaLabel: "Open portfolio",
  },
  technologies: {
    slug: "technologies",
    title: "Technologies",
    summary: "Modern stacks we use to design and ship reliable software.",
    about:
      "We build with proven cloud, mobile and AI technologies chosen for security, scale and maintainability. Explore the full technology landscape on our technologies page.",
    highlights: [
      "Cloud & APIs",
      "Mobile & web",
      "AI / ML tooling",
      "Security practices",
    ],
    productHref: mainSiteHref("/technologies"),
    ctaLabel: "Open technologies",
  },
  "our-workspace": {
    slug: "our-workspace",
    title: "Our Workspace",
    summary: "How we collaborate, deliver and support your teams.",
    about:
      "Our Workspace gives a window into how TechCulture teams plan, build and support products — processes, culture and collaboration tools that keep delivery predictable.",
    highlights: [
      "Delivery rituals",
      "Collaboration tools",
      "Quality gates",
      "Support model",
    ],
    productHref: mainSiteHref("/our-workspace"),
    ctaLabel: "Visit Our Workspace",
  },
  about: {
    slug: "about",
    title: "About Us",
    summary: "Who we are, what we build, and how to partner with us.",
    about:
      "TechCulture AI builds intelligent, scalable digital products for regulated and high-growth industries. Learn our story, explore services, or reach out for a consultation.",
    highlights: [
      "Company story",
      "Service catalogue",
      "Partnership model",
      "Contact channels",
    ],
    productHref: mainSiteHref("/about-us"),
    ctaLabel: "Read About Us",
  },
  contact: {
    slug: "contact",
    title: "Contact Us",
    summary: "Tell us what you want to build — we will respond quickly.",
    about:
      "Whether you need KYC, middleware, automation or a full digital product, share your requirements. Our team typically responds within one business day.",
    highlights: [
      "Demo requests",
      "Product questions",
      "Partnership enquiries",
      "Support escalations",
    ],
    productHref: mainSiteHref("/contact-us"),
    ctaLabel: "Go to Contact page",
  },
  middleware: {
    slug: "middleware",
    title: "Middleware",
    summary: "Central engine for eSign, UCC, DP and KRA orchestration.",
    about:
      "Middleware is the routing and aggregation layer between customer eSign, verification and market systems — delivering one final status to back office.",
    highlights: [
      "Request routing",
      "Response aggregation",
      "UCC / DP / KRA",
      "Unified audit logs",
    ],
    productHref: webdevHref("/middleware"),
    ctaLabel: "Open Middleware page",
  },
};

export function getProductBySlug(slug) {
  return productPages.find((p) => p.slug === slug) || null;
}

export function getIndustryBySlug(slug) {
  return industryPages.find((p) => p.slug === slug) || null;
}

export function getHubBySlug(slug) {
  return hubPages[slug] || null;
}

export const navLinks = [
  { name: "Products", href: webdevHref("/products") },
  { name: "Middleware", href: webdevHref("/middleware") },
  { name: "Careers", href: webdevHref("/careers") },
  { name: "About Us", href: webdevHref("/about") },
];
