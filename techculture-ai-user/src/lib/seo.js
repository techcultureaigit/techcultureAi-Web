import { COMPANY } from "./company";

export const SITE_NAME = COMPANY.shortName;
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://techculture.ai";

const DEFAULT_KEYWORDS = [
  SITE_NAME,
  "software company",
  "web development",
  "mobile apps",
  "AI solutions",
  "India",
];

/**
 * Build Next.js App Router metadata for a page.
 */
export function buildPageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  noIndex = false,
  type = "website",
}) {
  const fullTitle =
    !title || title === SITE_NAME
      ? `${SITE_NAME} | Web Development & Digital Solutions`
      : title.includes(SITE_NAME)
        ? title
        : `${title} | ${SITE_NAME}`;

  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${SITE_URL}${canonicalPath === "/" ? "" : canonicalPath}`;

  return {
    title: {
      absolute: fullTitle,
    },
    description,
    keywords: [...new Set([...keywords, ...DEFAULT_KEYWORDS])],
    authors: [{ name: COMPANY.legalName }],
    creator: SITE_NAME,
    publisher: COMPANY.legalName,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/** Static page SEO map — used by route layouts */
export const PAGE_SEO = {
  home: {
    title: `${SITE_NAME} | Web Development & Digital Solutions`,
    description:
      "TechCulture AI builds intelligent, scalable websites, mobile apps and custom software for government and private organizations — from idea to production.",
    path: "/",
    keywords: ["custom software", "enterprise software", "digital transformation"],
  },
  about: {
    title: "About Us",
    description:
      "Learn about TechCulture AI — infrastructure and digital platforms for India's financial industry, spanning KYC, onboarding, and enterprise software.",
    path: "/about",
    keywords: ["about TechCulture", "fintech company", "software studio"],
  },
  team: {
    title: "Our Team",
    description:
      "Meet the TechCulture AI team of engineers, designers and product leaders building intelligent digital products.",
    path: "/team",
    keywords: ["TechCulture team", "engineering team", "leadership"],
  },
  contact: {
    title: "Contact Us",
    description:
      "Get in touch with TechCulture AI for demos, partnerships and custom software projects. Email info@techculture.ai or call +91 9810785215.",
    path: "/contact",
    keywords: ["contact", "book a demo", "support"],
  },
  careers: {
    title: "Careers",
    description:
      "Join TechCulture AI. Explore career opportunities in engineering, product, design and operations.",
    path: "/careers",
    keywords: ["careers", "jobs", "hiring"],
  },
  "careers-openings": {
    title: "Open Opportunities",
    description:
      "Browse all open roles at TechCulture AI, review job descriptions, and apply with your resume.",
    path: "/careers/openings",
    keywords: ["job openings", "apply", "vacancies"],
  },
  blog: {
    title: "Blog & Insights",
    description:
      "Guides and insights from TechCulture AI on KYC, fintech, digital onboarding, and modern software delivery.",
    path: "/blog",
    keywords: ["blog", "fintech insights", "KYC guides"],
  },
  products: {
    title: "Products",
    description:
      "Explore TechCulture AI products for identity, KYC, onboarding, digital signing, automation and enterprise platforms.",
    path: "/products",
    keywords: ["products", "KYC", "eSign", "onboarding"],
  },
  fintech: {
    title: "Fintech Products",
    description:
      "Fintech solutions from TechCulture AI — Aadhaar verification, digital KYC, re-KYC, IPO bidding, account closure and more.",
    path: "/fintech",
    keywords: ["fintech", "KYC", "Aadhaar", "IPO"],
  },
  middleware: {
    title: "Middleware",
    description:
      "Reliable middleware and integration layers that connect banking, fintech and enterprise systems securely.",
    path: "/middleware",
    keywords: ["middleware", "integrations", "APIs"],
  },
  "banking-fintech": {
    title: "Banking & Fintech",
    description:
      "Digital banking and fintech experiences — onboarding, KYC, customer journeys and enterprise-ready platforms.",
    path: "/banking-fintech",
    keywords: ["banking", "fintech", "digital banking"],
  },
  ecommerce: {
    title: "E-Commerce",
    description:
      "Online stores, marketplaces and shopping apps built for performance, conversion and scale.",
    path: "/ecommerce",
    keywords: ["ecommerce", "online store", "marketplace"],
  },
  "corporate-websites": {
    title: "Corporate Websites",
    description:
      "Brand websites, landing pages and business portals designed to convert and represent your company clearly.",
    path: "/corporate-websites",
    keywords: ["corporate website", "landing page", "brand site"],
  },
  "mobile-applications": {
    title: "Mobile Applications",
    description:
      "Native and cross-platform iOS and Android apps built for performance, usability and scale.",
    path: "/mobile-applications",
    keywords: ["mobile app", "iOS", "Android", "React Native"],
  },
  "custom-saas": {
    title: "Custom SaaS & Portals",
    description:
      "Custom SaaS dashboards, admin panels and multi-tenant web platforms tailored to your workflows.",
    path: "/custom-saas",
    keywords: ["SaaS", "portal", "dashboard"],
  },
  hrms: {
    title: "HRMS",
    description:
      "HRMS platforms for employee records, attendance, leave and self-service — hiring to exit in one place.",
    path: "/hrms",
    keywords: ["HRMS", "HR software", "payroll", "attendance"],
  },
  gis: {
    title: "GIS Application",
    description:
      "GIS and location intelligence applications for smarter mapping, tracking and operational decisions.",
    path: "/gis",
    keywords: ["GIS", "maps", "geospatial"],
  },
  lms: {
    title: "LMS",
    description:
      "Learning management systems for courses, assessments and learner progress tracking.",
    path: "/lms",
    keywords: ["LMS", "e-learning", "training platform"],
  },
  "mutual-fund": {
    title: "Mutual Fund",
    description:
      "Mutual fund platforms to invest, track and manage portfolios with clear digital experiences.",
    path: "/mutual-fund",
    keywords: ["mutual fund", "investment", "portfolio"],
  },
  "trading-applications": {
    title: "Trading Applications",
    description:
      "Trading applications with charts, quotes and dependable workflows for modern investors.",
    path: "/trading-applications",
    keywords: ["trading app", "stock trading", "brokerage"],
  },
  tracking: {
    title: "Tracking System",
    description:
      "Real-time tracking for logistics, assets, field teams and deliveries.",
    path: "/tracking",
    keywords: ["tracking", "logistics", "fleet", "assets"],
  },
  "our-workspace": {
    title: "Our Workspace",
    description:
      "Inside TechCulture AI — how we collaborate, build and deliver digital products.",
    path: "/our-workspace",
    keywords: ["workspace", "culture", "office"],
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description:
      "How TechCulture AI collects, uses, stores and protects personal information across our websites and services.",
    path: "/privacy-policy",
    keywords: ["privacy policy", "data protection", "personal data"],
  },
  "refund-policy": {
    title: "Refund Policy",
    description:
      "Refund, cancellation and billing guidelines for TechCulture AI products, licenses and professional services.",
    path: "/refund-policy",
    keywords: ["refund policy", "cancellation", "billing"],
  },
  "terms-of-service": {
    title: "Terms of Service",
    description:
      "Terms governing use of TechCulture AI websites, demos, software platforms and related services.",
    path: "/terms-of-service",
    keywords: ["terms of service", "terms and conditions", "legal"],
  },
  "cookie-policy": {
    title: "Cookie Policy",
    description:
      "How TechCulture AI uses cookies and similar technologies on our websites.",
    path: "/cookie-policy",
    keywords: ["cookie policy", "cookies", "tracking"],
  },
};

export function seoFromPageKey(key) {
  const page = PAGE_SEO[key];
  if (!page) {
    return buildPageMetadata({
      title: SITE_NAME,
      description: PAGE_SEO.home.description,
      path: "/",
    });
  }
  return buildPageMetadata(page);
}
