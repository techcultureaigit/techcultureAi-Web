"use client";
import {
  ArrowRight,
  Bot,
  Brain,
  Building2,
  CandlestickChart,
  ChartLine,
  Cloud,
  Cpu,
  Factory,
  FileBarChart2,
  FileCheck2,
  Gavel,
  GraduationCap,
  HeartPulse,
  Info,
  Landmark,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  PenLine,
  Phone,
  Plane,
  Radio,
  RefreshCw,
  ScanFace,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Store,
  Truck,
  UserPlus,
  Users,
  Wrench,
  Workflow,
  Zap,
  Globe2,
  LayoutDashboard,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion, useReducedMotion } from "motion/react";
import {
  getProductBySlug,
} from "../lib/webdevelopment/catalog";
import { slugify, webdevHref } from "../lib/webdevelopment/paths";

function resolveProductHref(label, variant) {
  if (variant === "webdevelopment") {
    const slug = slugify(label);
    const page = getProductBySlug(slug);
    return page?.href || webdevHref(`/fintech/${slug}`);
  }
  return "/services";
}

function resolveIndustryHref(item, variant) {
  if (variant === "webdevelopment") {
    const title = (item?.title || "").toLowerCase();
    if (title.includes("banking") || title.includes("fintech")) {
      return webdevHref("/banking-fintech");
    }
    // Industries pages removed — send remaining category traffic to Fintech hub.
    return webdevHref("/fintech");
  }
  return item.href || "/services";
}

function resolveAutomationHref(service, variant) {
  if (variant === "webdevelopment") {
    return webdevHref("/products");
  }
  return `/services/${service.slug}`;
}

function resolveAboutHref(item, variant) {
  if (variant === "webdevelopment") {
    if (item.href === "/about-us") return webdevHref("/about");
    if (item.href === "/services") return webdevHref("/fintech");
    if (item.href === "/contact-us") return webdevHref("/contact");
  }
  return item.href;
}

export const productColumns = [
  [
    {
      title: "IDENTITY & COMPLIANCE",
      icon: ScanFace,
      links: [
        { label: "Aadhaar Verification" },
        { label: "Digital KYC" },
        { label: "Business KYC" },
        { label: "Re-KYC" },
        { label: "Account Closure" },
        { label: "Joint Account KYC" },
      ],
    },
    {
      title: "DIGITAL SIGNATURES",
      icon: PenLine,
      links: [
        { label: "Aadhaar eSign" },
        { label: "Secure eSignature" },
      ],
    },
  ],
  [
    {
      title: "DIGITAL ONBOARDING",
      icon: UserPlus,
      links: [
        { label: "Supplier Onboarding" },
        { label: "Gig Workforce Onboarding" },
      ],
    },
  ],
  [
    {
      title: "CUSTOMER ENGAGEMENT",
      icon: ChartLine,
      links: [
        { label: "Campaign Management", trailingIcon: Megaphone },
        { label: "Field Service", trailingIcon: Wrench },
        { label: "Contact Center", trailingIcon: Phone },
        { label: "SMS & WhatsApp Campaigns", trailingIcon: MessageSquare },
      ],
    },
    {
      title: "IPO SERVICES",
      icon: Gavel,
      links: [{ label: "Online IPO Bidding", trailingIcon: Landmark }],
    },
  ],
];

export const productCategories = productColumns.flat();

/** Showcase products for the Product mega menu (matches design). */
export const showcaseProducts = [
  {
    title: "Banking & Fintech",
    description: "End-to-end digital banking and fintech platforms.",
    tags: ["Web & Mobile"],
    icon: Landmark,
    iconTone: "bg-orange-50 text-[#FE602F]",
    href: webdevHref("/banking-fintech"),
  },
  {
    title: "Trading Applications",
    description: "Powerful trading solutions inspired by Zerodha & Groww.",
    tags: ["Web App", "Mobile App"],
    icon: CandlestickChart,
    iconTone: "bg-orange-50 text-[#FE602F]",
    href: webdevHref("/trading-applications"),
  },
  {
    title: "Mutual Fund",
    description: "Invest, track and manage mutual fund portfolios with ease.",
    tags: ["Web & Mobile"],
    icon: ChartLine,
    iconTone: "bg-amber-50 text-amber-600",
    href: webdevHref("/mutual-fund"),
  },
  {
    title: "HRMS",
    description: "Simplify HR operations and workforce management.",
    tags: ["Web Platform"],
    icon: Users,
    iconTone: "bg-emerald-50 text-emerald-600",
    href: webdevHref("/hrms"),
  },
  {
    title: "E-KYC (Digilocker)",
    description: "Secure & seamless identity verification.",
    tags: ["Web & Mobile"],
    icon: ShieldCheck,
    iconTone: "bg-sky-50 text-sky-600",
    href: resolveProductHref("Digital KYC", "webdevelopment"),
  },
  {
    title: "Re-KYC",
    description: "Stay compliant. Stay ahead.",
    tags: ["Web & Mobile"],
    icon: RefreshCw,
    iconTone: "bg-purple-50 text-purple-600",
    href: resolveProductHref("Re-KYC", "webdevelopment"),
  },
  {
    title: "Closer",
    description: "Simplifying account closure process.",
    tags: ["Web Platform"],
    icon: FileCheck2,
    iconTone: "bg-rose-50 text-rose-600",
    href: resolveProductHref("Account Closure", "webdevelopment"),
  },
  {
    title: "GIS Application",
    description: "Location intelligence for smarter decisions.",
    tags: ["Web Platform"],
    icon: MapPin,
    iconTone: "bg-teal-50 text-teal-600",
    href: webdevHref("/gis"),
  },

  {
    title: "IPO",
    description: "Track, analyze and never miss an opportunity.",
    tags: ["Web Platform"],
    icon: FileBarChart2,
    iconTone: "bg-violet-50 text-violet-600",
    href: resolveProductHref("Online IPO Bidding", "webdevelopment"),
  },
  {
    title: "E-Commerce",
    description: "Online stores, marketplaces and shopping apps for any business.",
    tags: ["Web & Mobile"],
    icon: Store,
    iconTone: "bg-orange-50 text-[#FE602F]",
    href: webdevHref("/ecommerce"),
  },
  {
    title: "Corporate Websites",
    description: "Brand sites, landing pages and business portals that convert.",
    tags: ["Web"],
    icon: Globe2,
    iconTone: "bg-slate-50 text-[#2E3545]",
    href: webdevHref("/corporate-websites"),
  },
  {
    title: "Mobile Applications",
    description: "Native & cross-platform iOS and Android apps built for scale.",
    tags: ["Mobile"],
    icon: Smartphone,
    iconTone: "bg-orange-50 text-[#FE602F]",
    href: webdevHref("/mobile-applications"),
  },
  {
    title: "Custom SaaS & Portals",
    description: "Dashboards, admin panels and multi-tenant web platforms.",
    tags: ["Web Platform"],
    icon: LayoutDashboard,
    iconTone: "bg-sky-50 text-sky-600",
    href: webdevHref("/custom-saas"),
  },
  {
    title: "LMS",
    description: "Learning platforms for courses, assessments and progress tracking.",
    tags: ["Web & Mobile"],
    icon: GraduationCap,
    iconTone: "bg-orange-50 text-[#FE602F]",
    href: webdevHref("/lms"),
  },
  {
    title: "Tracking System",
    description: "Real-time tracking for logistics, assets, field teams and deliveries.",
    tags: ["Web & Mobile"],
    icon: MapPin,
    iconTone: "bg-slate-50 text-[#2E3545]",
    href: webdevHref("/tracking"),
  },
];

/** Categories derived from Our Technology Partner work on the homepage. */
export const partnerWorkCategories = [
  {
    title: "Fintech",
    subtitle: "KYC, identity & compliance platforms",
    icon: Landmark,
    partners: ["IPO Master"],
    href: webdevHref("/products"),
    links: [
      { label: "All Fintech Products", type: "hub" },
      { label: "Banking & FinTech", type: "industry" },
      { label: "Aadhaar Verification", type: "product" },
      { label: "Digital KYC", type: "product" },
      { label: "Business KYC", type: "product" },
      { label: "Online IPO Bidding", type: "product" },
    ],
  },
  {
    title: "E-Commerce",
    subtitle: "Retail, marketplace & QSR journeys",
    icon: ShoppingCart,
    partners: ["Lakshmi Stores", "Shoppin", "Burger King"],
    href: webdevHref("/fintech"),
    links: [
      { label: "E-Commerce", type: "industry" },
      { label: "Campaign Management", type: "product" },
    ],
  },
  {
    title: "Healthcare",
    subtitle: "Dental, clinical & patient workflows",
    icon: HeartPulse,
    partners: ["GoTu", "Abra Dental", "Aspen Dental", "Dental365"],
    href: webdevHref("/fintech"),
    links: [
      { label: "Healthcare", type: "industry" },
    ],
  },
  {
    title: "Travel & Hospitality",
    subtitle: "Guest journeys and booking support",
    icon: Plane,
    partners: ["Airbnb"],
    href: webdevHref("/fintech"),
    links: [
      { label: "Travel & Hospitality", type: "industry" },
    ],
  },
  {
    title: "Manufacturing",
    subtitle: "Supplier, ops and field workflows",
    icon: Factory,
    partners: ["ChemScience"],
    href: webdevHref("/fintech"),
    links: [
      { label: "Manufacturing", type: "industry" },
      { label: "Supplier Onboarding", type: "product" },
      { label: "Field Service", type: "product" },
    ],
  },
];

function resolvePartnerWorkHref(link, category) {
  if (link.type === "hub") return webdevHref("/products");
  if (link.type === "industry") {
    return resolveIndustryHref({ title: link.label }, "webdevelopment");
  }
  if (link.type === "product") {
    return resolveProductHref(link.label, "webdevelopment");
  }
  return category.href || webdevHref("/products");
}

export const industryItems = [
  {
    title: "Banking & FinTech",
    subtitle: "Secure automation for modern finance",
    href: webdevHref("/banking-fintech"),
    icon: Landmark,
  },
  {
    title: "Healthcare",
    subtitle: "Smarter patient and ops workflows",
    href: "/services",
    icon: HeartPulse,
  },
  {
    title: "Travel & Hospitality",
    subtitle: "Personalized journeys at scale",
    href: "/services",
    icon: Plane,
  },
  {
    title: "Manufacturing",
    subtitle: "Predictive ops and quality AI",
    href: "/services",
    icon: Factory,
  },
  {
    title: "EdTech",
    subtitle: "Adaptive learning experiences",
    href: "/services",
    icon: GraduationCap,
  },
  {
    title: "E-Commerce",
    subtitle: "Conversion-focused commerce AI",
    href: "/services",
    icon: ShoppingCart,
  },
  {
    title: "Logistics",
    subtitle: "Route, fleet and delivery intelligence",
    href: "/services",
    icon: Truck,
  },
  {
    title: "Telecom",
    subtitle: "Customer care and network insights",
    href: "/services",
    icon: Radio,
  },
  {
    title: "Real Estate",
    subtitle: "Lead scoring and virtual tours",
    href: "/services",
    icon: Building2,
  },
  {
    title: "Insurance",
    subtitle: "Faster claims and risk scoring",
    href: "/services",
    icon: ShieldCheck,
  },
];

export const aboutItems = [
  {
    title: "Who We Are",
    subtitle: "Our story, vision and culture",
    href: "/about-us",
    source: "about",
    icon: Users,
  },
  {
    title: "What We Do",
    subtitle: "Services that drive real outcomes",
    href: "/services",
    source: "services",
    icon: Workflow,
  },
  {
    title: "Contact Us",
    subtitle: "Let's build something together",
    href: "/contact-us",
    source: "about",
    icon: Mail,
  },
];

const automationIcons = [Bot, Brain, Cpu, Sparkles, Workflow, Zap, Cloud, Users];

function sanitizeSubtitle(input) {
  if (!input || typeof input !== "string") return "";
  // Remove HTML tags (e.g. <div>, <p>, <span>...)
  let text = input.replace(/<[^>]*>/g, " ");
  // Decode common HTML entities that often appear in descriptions
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

const megaThemes = {
  default: {
    accentText: "text-primary",
    accentBg: "bg-primary/5",
    accentBgStrong: "bg-primary/15",
    accentBorder: "border-primary/20",
    accentBorderMd: "border-primary/30",
    accentBorderBottom: "border-primary/50",
    hoverBg: "hover:bg-[#fff5f1]",
    hoverText: "group-hover:text-primary",
    iconHover: "group-hover:bg-primary group-hover:text-white",
    bullet: "bg-primary",
    productsShell:
      "bg-[#faf7f4] rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.22)] border border-orange-100/60",
    productCard:
      "bg-white/80 rounded-xl border border-orange-100/70 p-4 shadow-[0_2px_10px_rgba(255,99,51,0.04)]",
    productIconBox:
      "w-10 h-10 rounded-xl border border-primary/30 bg-[#fff5f1] text-primary",
    sidebarGradient:
      "from-[#ff6333]/15 via-[#fe9272]/20 to-[#040416]/10",
    bar1: "bg-primary/40",
    bar2: "bg-primary/70",
    bar3: "bg-primary",
    bar4: "bg-[#e15226]/80",
    bar5: "bg-[#040416]/50",
    bar6: "bg-[#040416]/35",
    decor: "text-[#040416]/50",
    shellShadow: "shadow-[0_20px_60px_rgba(0,0,0,0.18)]",
    linkHover: "hover:text-primary",
  },
  webdevelopment: {
    accentText: "text-[#FE602F]",
    accentBg: "bg-[#fff0eb]",
    accentBgStrong: "bg-[#ffe4da]",
    accentBorder: "border-orange-200",
    accentBorderMd: "border-orange-200",
    accentBorderBottom: "border-[#FE602F]/50",
    hoverBg: "hover:bg-[#fff5f1]",
    hoverText: "group-hover:text-[#d9471b]",
    iconHover: "group-hover:bg-[#FE602F] group-hover:text-white",
    bullet: "bg-[#FE602F]",
    productsShell:
      "bg-gradient-to-br from-[#fff8f5] via-white to-[#f5f5f6] rounded-2xl shadow-[0_24px_70px_rgba(46,53,69,0.14)] border border-orange-100/80",
    productCard:
      "bg-white/95 rounded-xl border border-orange-100 p-4 shadow-[0_2px_12px_rgba(254,96,47,0.06)]",
    productIconBox:
      "w-10 h-10 rounded-xl border border-orange-200 bg-[#fff0eb] text-[#FE602F]",
    sidebarGradient:
      "from-[#FE602F]/20 via-[#ff8a62]/20 to-[#2E3545]/12",
    bar1: "bg-[#FE602F]/40",
    bar2: "bg-[#FE602F]/70",
    bar3: "bg-[#FE602F]",
    bar4: "bg-[#e95325]/80",
    bar5: "bg-[#2E3545]/45",
    bar6: "bg-[#2E3545]/30",
    decor: "text-[#2E3545]/60",
    shellShadow: "shadow-[0_20px_60px_rgba(46,53,69,0.14)]",
    linkHover: "hover:text-[#FE602F]",
  },
};

function getMegaTheme(variant = "default") {
  return megaThemes[variant] || megaThemes.default;
}

function MegaSidebar({ title, description, children }) {
  return (
    <div className="flex flex-col justify-between border-r border-gray-100 bg-[#f8f8f8] p-4 xl:p-6 2xl:p-7">
      <div>
        <h3 className="mb-2 text-[17px] font-bold text-gray-900 xl:mb-3 xl:text-[20px] 2xl:text-[22px]">
          {title}
        </h3>
        <p className="text-[12px] leading-relaxed text-gray-500 xl:text-[13px]">
          {description}
        </p>
      </div>
      <div className="relative mt-5 xl:mt-8">{children}</div>
    </div>
  );
}

function MegaShell({ children, cols = "grid-cols-[240px_1fr]", theme }) {
  const t = theme || megaThemes.default;
  return (
    <div
      className={`overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white ${t.shellShadow}`}
    >
      <div className={`grid ${cols}`}>{children}</div>
    </div>
  );
}

function getIconMotion(title = "") {
  const t = title.toLowerCase();
  if (t.includes("re-kyc") || t.includes("refresh")) return "spin";
  if (t.includes("website") || t.includes("globe")) return "spin-slow";
  if (t.includes("commerce") || t.includes("store")) return "wiggle";
  if (t.includes("gis") || t.includes("map")) return "pin";
  if (t.includes("kyc") || t.includes("closer") || t.includes("shield")) return "pop";
  if (t.includes("trading") || t.includes("ipo") || t.includes("mobile") || t.includes("mutual"))
    return "bob";
  return "pulse";
}

function AnimatedMegaIcon({ icon: Icon, title, size = 18 }) {
  const reduce = useReducedMotion();
  const kind = getIconMotion(title);

  const motionProps = reduce
    ? {}
    : {
        pulse: {
          animate: { scale: [1, 1.14, 1] },
          transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
        },
        bob: {
          animate: { y: [0, -2.5, 0] },
          transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        },
        spin: {
          animate: { rotate: 360 },
          transition: { duration: 2.4, repeat: Infinity, ease: "linear" },
        },
        "spin-slow": {
          animate: { rotate: 360 },
          transition: { duration: 8, repeat: Infinity, ease: "linear" },
        },
        wiggle: {
          animate: { rotate: [0, -10, 10, -6, 0] },
          transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
        },
        pin: {
          animate: { y: [0, -3, 0], scale: [1, 1.08, 1] },
          transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
        },
        pop: {
          animate: { scale: [1, 1.16, 1] },
          transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
        },
      }[kind] || {};

  return (
    <motion.span className="relative z-10 inline-flex" {...motionProps}>
      <Icon size={size} strokeWidth={2.25} />
    </motion.span>
  );
}

function MegaItem({
  icon: Icon,
  title,
  subtitle,
  onClick,
  theme,
  solidIcon = false,
}) {
  const t = theme || megaThemes.default;
  const reduce = useReducedMotion();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-start gap-2.5 rounded-xl p-2 text-left transition-colors duration-200 xl:gap-3.5 xl:p-3 ${t.hoverBg}`}
    >
      <motion.span
        className={
          solidIcon
            ? "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FE602F]/70 text-white shadow-[0_8px_18px_rgba(254,96,47,0.2)] xl:h-11 xl:w-11"
            : `flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${t.accentBorder} ${t.accentBg} ${t.accentText} transition-colors duration-200 xl:h-10 xl:w-10 ${t.iconHover}`
        }
        animate={
          solidIcon && !reduce
            ? { boxShadow: [
                "0 8px 18px rgba(254,96,47,0.28)",
                "0 8px 24px rgba(254,96,47,0.48)",
                "0 8px 18px rgba(254,96,47,0.28)",
              ] }
            : undefined
        }
        transition={
          solidIcon && !reduce
            ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
        whileHover={reduce ? undefined : { scale: 1.1 }}
      >
        {solidIcon && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-white/40"
            animate={
              reduce
                ? undefined
                : { scale: [1, 1.35, 1], opacity: [0.55, 0, 0.55] }
            }
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        {solidIcon ? (
          <AnimatedMegaIcon icon={Icon} title={title} />
        ) : (
          <Icon size={18} strokeWidth={2} className="relative z-10" />
        )}
      </motion.span>
      <span className="min-w-0 pt-0.5">
        <span
          className={`block text-[13px] font-bold transition-colors xl:text-[14px] ${
            solidIcon
              ? "text-[#FE602F] group-hover:text-[#d9471b]"
              : `text-gray-900 ${t.hoverText}`
          }`}
        >
          {title}
        </span>
        {subtitle && (
          <span className="mt-0.5 line-clamp-2 block text-[10px] leading-snug text-gray-500 xl:text-[11px]">
            {subtitle}
          </span>
        )}
      </span>
    </button>
  );
}

export function ProductsMegaPanel({ onNavigate, variant = "default" }) {
  const t = getMegaTheme(variant);

  if (variant === "webdevelopment") {
    return (
      <MegaShell
        cols="grid-cols-[160px_1fr] xl:grid-cols-[200px_1fr] 2xl:grid-cols-[240px_1fr]"
        theme={t}
      >
        <MegaSidebar
          title="Products"
          description="From banking and fintech to e-commerce, websites, mobile apps and custom SaaS — we build digital products for every business need."
        >
          <div
            className={`relative flex h-20 w-full items-end justify-center overflow-hidden rounded-xl bg-gradient-to-br xl:h-24 2xl:h-28 ${t.sidebarGradient}`}
          >
            <div className="flex w-full items-end justify-center gap-1 px-3 pb-2.5 xl:gap-1.5 xl:px-4 xl:pb-3">
              <span className={`h-8 w-5 rounded-t-md xl:h-10 xl:w-6 ${t.bar1}`} />
              <span className={`h-12 w-5 rounded-t-md xl:h-16 xl:w-7 ${t.bar2}`} />
              <span className={`h-10 w-6 rounded-t-md xl:h-12 xl:w-8 ${t.bar5}`} />
              <span className={`h-14 w-5 rounded-t-md xl:h-20 xl:w-6 ${t.bar3}`} />
              <span className={`h-11 w-5 rounded-t-md xl:h-14 xl:w-7 ${t.bar4}`} />
              <span className={`h-7 w-4 rounded-t-md xl:h-9 xl:w-5 ${t.bar6}`} />
            </div>
            <Sparkles size={16} className={`absolute top-2.5 right-3 xl:top-3 xl:right-4 ${t.accentText}`} />
            <Bot size={18} className={`absolute top-3 left-3 xl:top-4 xl:left-4 ${t.decor}`} />
          </div>
        </MegaSidebar>

        <div className="grid grid-cols-5 content-start gap-x-1 gap-y-0.5 p-2.5 xl:gap-x-1.5 xl:p-3 2xl:p-4">
          {showcaseProducts.map((product) => (
            <MegaItem
              key={product.title}
              icon={product.icon}
              title={product.title}
              subtitle={product.description}
              theme={t}
              solidIcon
              onClick={() => onNavigate(product.href, "products")}
            />
          ))}
        </div>
      </MegaShell>
    );
  }

  const renderTrailing = (link) => {
    if (link.trailing === "whatsapp") {
      return <FaWhatsapp className="text-[#25D366] text-[16px] shrink-0" />;
    }
    if (link.trailingIcon) {
      const TrailingIcon = link.trailingIcon;
      return (
        <TrailingIcon
          size={15}
          strokeWidth={2}
          className={`${t.accentText} shrink-0 opacity-80`}
        />
      );
    }
    return null;
  };

  return (
    <div className={`${t.productsShell} overflow-hidden`}>
      <div className="grid grid-cols-3 gap-4 p-5">
        {productColumns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4">
            {column.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.title} className={t.productCard}>
                  <div className="flex items-center gap-3 mb-3.5">
                    <span
                      className={`${t.productIconBox} flex items-center justify-center shrink-0`}
                    >
                      <Icon size={20} strokeWidth={1.8} />
                    </span>
                    <h4
                      className={`text-[13px] font-bold tracking-[0.06em] ${t.accentText} uppercase inline-block pb-1 border-b-2 ${t.accentBorderBottom}`}
                    >
                      {category.title}
                    </h4>
                  </div>

                  <ul className="space-y-0.5">
                    {category.links.map((link) => (
                      <li key={link.label}>
                        <button
                          type="button"
                          onClick={() =>
                            onNavigate(
                              resolveProductHref(link.label, variant),
                              "products"
                            )
                          }
                          className={`w-full flex items-center justify-between gap-3 text-left py-1.5 px-1 rounded-md ${t.hoverBg} transition-colors duration-200 group`}
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            <span className={`w-1.5 h-1.5 rounded-full ${t.bullet} shrink-0`} />
                            <span
                              className={`text-[13.5px] text-gray-800 font-medium ${t.hoverText} transition-colors truncate`}
                            >
                              {link.label}
                            </span>
                          </span>
                          {renderTrailing(link)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function IndustriesMegaPanel({ onNavigate, variant = "default" }) {
  const t = getMegaTheme(variant);

  return (
    <MegaShell theme={t}>
      <MegaSidebar
        title="Industries"
        description="Industry-ready AI and automation solutions tailored for your sector's unique workflows and growth goals."
      >
        <div
          className={`w-full h-28 rounded-xl bg-gradient-to-br ${t.sidebarGradient} flex items-end justify-center overflow-hidden relative`}
        >
          <div className="flex items-end gap-1.5 pb-3 px-4 w-full justify-center">
            <span className={`w-6 h-10 rounded-t-md ${t.bar1}`} />
            <span className={`w-7 h-16 rounded-t-md ${t.bar2}`} />
            <span className={`w-8 h-12 rounded-t-md ${t.bar5}`} />
            <span className={`w-6 h-20 rounded-t-md ${t.bar3}`} />
            <span className={`w-7 h-14 rounded-t-md ${t.bar4}`} />
            <span className={`w-5 h-9 rounded-t-md ${t.bar6}`} />
          </div>
          <Sparkles size={18} className={`absolute top-3 right-4 ${t.accentText}`} />
          <Bot size={20} className={`absolute top-4 left-4 ${t.decor}`} />
        </div>
      </MegaSidebar>

      <div className="grid grid-cols-3 gap-x-4 gap-y-1 p-5">
        {industryItems.map((item) => (
          <MegaItem
            key={item.title}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            theme={t}
            onClick={() =>
              onNavigate(resolveIndustryHref(item, variant), "industries")
            }
          />
        ))}
      </div>
    </MegaShell>
  );
}

export function AutomationMegaPanel({ services = [], onNavigate, variant = "default" }) {
  const t = getMegaTheme(variant);

  return (
    <MegaShell theme={t}>
      <MegaSidebar
        title="AI-Automation"
        description="Intelligent automation services that streamline operations, reduce cost, and unlock scalable growth."
      >
        <div
          className={`w-full h-28 rounded-xl bg-gradient-to-br ${t.sidebarGradient} flex items-center justify-center relative overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-30">
            <div
              className={`absolute top-4 left-6 w-10 h-10 rounded-full border-2 ${t.accentBorderMd} border-current ${t.accentText}`}
            />
            <div
              className={`absolute bottom-5 right-8 w-8 h-8 rounded-lg border-2 ${t.bar4} border-current`}
            />
          </div>
          <span
            className={`w-14 h-14 rounded-2xl bg-white shadow-md ${t.accentText} flex items-center justify-center z-[1]`}
          >
            <Bot size={28} strokeWidth={2} />
          </span>
          <Sparkles size={16} className={`absolute top-3 right-4 ${t.accentText}`} />
          <Cpu size={16} className={`absolute bottom-4 left-5 ${t.decor}`} />
        </div>
      </MegaSidebar>

      <div className="grid grid-cols-3 gap-x-4 gap-y-1 p-5">
        {services.length > 0 ? (
          services.map((service, index) => {
            const Icon = automationIcons[index % automationIcons.length];
            return (
              <MegaItem
                key={service._id || service.slug}
                icon={Icon}
                title={service.title}
                subtitle={
                  sanitizeSubtitle(service.shortDescription) ||
                  sanitizeSubtitle(service.description)?.slice(0, 48) ||
                  "Explore this AI automation service"
                }
                theme={t}
                onClick={() =>
                  onNavigate(resolveAutomationHref(service, variant), "automation")
                }
              />
            );
          })
        ) : (
          <div className="col-span-3 px-3 py-8 text-center text-gray-400 text-sm">
            No services available
          </div>
        )}
      </div>
    </MegaShell>
  );
}

export function AboutMegaPanel({ onNavigate, variant = "default" }) {
  const t = getMegaTheme(variant);

  return (
    <MegaShell cols="grid-cols-[220px_1fr]" theme={t}>
      <MegaSidebar
        title="About Us"
        description="Learn who we are, what we build, and how you can partner with TechCulture AI."
      >
        <div
          className={`w-full h-28 rounded-xl bg-gradient-to-br ${t.sidebarGradient} flex items-center justify-center relative overflow-hidden`}
        >
          <span
            className={`w-14 h-14 rounded-2xl bg-white shadow-md ${t.accentText} flex items-center justify-center z-[1]`}
          >
            <Info size={26} strokeWidth={2} />
          </span>
          <Users size={16} className={`absolute top-3 left-4 ${t.decor}`} />
          <Mail size={16} className={`absolute bottom-4 right-5 ${t.accentText}`} />
        </div>
      </MegaSidebar>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-5 content-start">
        {aboutItems.map((item) => (
          <MegaItem
            key={item.href}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            theme={t}
            onClick={() =>
              onNavigate(resolveAboutHref(item, variant), item.source)
            }
          />
        ))}
      </div>
    </MegaShell>
  );
}

export function ProductsMobileMenu({ onNavigate, variant = "default" }) {
  const t = getMegaTheme(variant);

  if (variant === "webdevelopment") {
    return (
      <div className="ml-1 mt-2 space-y-2.5 pb-2">
        <div className="rounded-xl bg-[#f7f7f8] px-3 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FE602F]">
            Our Products
          </p>
          <p className="mt-1 text-[13px] font-semibold text-[#1f2937]">
            Innovative Solutions for a{" "}
            <span className="text-[#FE602F]">Smarter Tomorrow</span>
          </p>
        </div>

        {showcaseProducts.map((product) => {
          const Icon = product.icon;
          return (
            <button
              key={product.title}
              type="button"
              onClick={() => onNavigate(product.href, "products")}
              className="flex w-full items-start gap-3 rounded-xl border border-gray-100 bg-[#fafafa] p-3 text-left"
            >
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FE602F]/70 text-white shadow-[0_8px_18px_rgba(254,96,47,0.2)]">
                <AnimatedMegaIcon icon={Icon} title={product.title} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold text-[#1f2937]">
                  {product.title}
                </span>
                <span className="mt-0.5 block text-[12px] leading-snug text-slate-500">
                  {product.description}
                </span>
                <span className="mt-2 flex flex-wrap gap-1">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#fff0eb] px-2 py-0.5 text-[10px] font-semibold text-[#d9471b]"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="ml-2 mt-2 space-y-4 pb-2">
      {productCategories.map((category) => {
        const Icon = category.icon;
        return (
          <div key={category.title}>
            <div className={`flex items-center gap-2 mb-1.5 ${t.accentText}`}>
              <Icon size={14} />
              <span
                className={`text-[12px] font-bold tracking-wide uppercase inline-block pb-0.5 border-b ${t.accentBorder}`}
              >
                {category.title}
              </span>
            </div>
            <div className="ml-5 space-y-1">
              {category.links.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  className={`flex items-center gap-2 w-full text-left text-gray-300 ${t.linkHover} transition-colors duration-200 py-1.5 text-[15px]`}
                  onClick={() =>
                    onNavigate(resolveProductHref(link.label, variant), "products")
                  }
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${t.bullet} shrink-0`} />
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function IndustriesMobileMenu({ onNavigate, variant = "default" }) {
  const t = getMegaTheme(variant);

  return (
    <div className="ml-2 mt-2 space-y-1 pb-2">
      {industryItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.title}
            type="button"
            className="flex items-center gap-3 w-full text-left py-2.5 border-b border-gray-800 last:border-none"
            onClick={() =>
              onNavigate(resolveIndustryHref(item, variant), "industries")
            }
          >
            <span
              className={`w-8 h-8 rounded-full ${t.accentBgStrong} ${t.accentText} flex items-center justify-center shrink-0`}
            >
              <Icon size={15} />
            </span>
            <span>
              <span className="block text-[15px] text-gray-200 font-medium">
                {item.title}
              </span>
              <span className="block text-[12px] text-gray-500">
                {item.subtitle}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function AutomationMobileMenu({ services = [], onNavigate, variant = "default" }) {
  const t = getMegaTheme(variant);

  return (
    <div className="ml-2 mt-2 space-y-1 pb-2">
      {services.length > 0 ? (
        services.map((service, index) => {
          const Icon = automationIcons[index % automationIcons.length];
          return (
            <button
              key={service._id || service.slug}
              type="button"
              className="flex items-center gap-3 w-full text-left py-2.5 border-b border-gray-800 last:border-none"
              onClick={() =>
                onNavigate(resolveAutomationHref(service, variant), "automation")
              }
            >
              <span
                className={`w-8 h-8 rounded-full ${t.accentBgStrong} ${t.accentText} flex items-center justify-center shrink-0`}
              >
                <Icon size={15} />
              </span>
              <span className="text-[15px] text-gray-200 font-medium">
                {service.title}
              </span>
            </button>
          );
        })
      ) : (
        <p className="text-gray-500 text-sm py-2">No services available</p>
      )}
    </div>
  );
}

export function AboutMobileMenu({ onNavigate, variant = "default" }) {
  const t = getMegaTheme(variant);

  return (
    <div className="ml-2 mt-2 space-y-1 pb-2">
      {aboutItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.href}
            type="button"
            className="flex items-center gap-3 w-full text-left py-2.5 border-b border-gray-800 last:border-none"
            onClick={() =>
              onNavigate(resolveAboutHref(item, variant), item.source)
            }
          >
            <span
              className={`w-8 h-8 rounded-full ${t.accentBgStrong} ${t.accentText} flex items-center justify-center shrink-0`}
            >
              <Icon size={15} />
            </span>
            <span>
              <span className="block text-[15px] text-gray-200 font-medium">
                {item.title}
              </span>
              <span className="block text-[12px] text-gray-500">
                {item.subtitle}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
