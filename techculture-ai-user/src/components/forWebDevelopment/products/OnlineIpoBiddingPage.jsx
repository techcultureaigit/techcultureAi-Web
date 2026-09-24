"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  FileText,
  Landmark,
  LineChart,
  Lock,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";
import { webdevHref } from "../../../lib/webdevelopment/paths";
import SpotlightCard, { BRAND_SPOTLIGHT } from "@/components/SpotlightCard";

const heroStats = [
  { title: "ASBA ready", subtitle: "Compliant bid capture", icon: ShieldCheck },
  { title: "Live status", subtitle: "Real-time updates", icon: LineChart },
  { title: "Mobile first", subtitle: "Apply in minutes", icon: Smartphone },
];

const whatYouGet = [
  {
    title: "Investor application flow",
    desc: "Guided IPO apply journey with price band, lot size and UPI/ASBA options.",
    icon: Smartphone,
  },
  {
    title: "Bid capture & validation",
    desc: "Capture bids with category rules, quantity checks and payment confirmation.",
    icon: Landmark,
  },
  {
    title: "Live IPO insights",
    desc: "Show subscription status, key dates, financials and allotment updates.",
    icon: BarChart3,
  },
  {
    title: "Ops reconciliation hooks",
    desc: "Push status callbacks and packs for broker back-office reconciliation.",
    icon: FileText,
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Browse open IPOs",
    desc: "Investors see live issues with price band, lot size and key dates.",
    icon: Landmark,
  },
  {
    step: 2,
    title: "Review details",
    desc: "Company overview, financials, documents and important dates in one place.",
    icon: FileText,
  },
  {
    step: 3,
    title: "Place bid",
    desc: "Select category, lots and payment mode — validated before submit.",
    icon: CheckCircle2,
  },
  {
    step: 4,
    title: "Track status",
    desc: "Follow application, allotment and listing updates in real time.",
    icon: CalendarDays,
  },
];

const keyBenefits = [
  {
    title: "Trusted & secure",
    desc: "Built for regulated IPO participation with clear audit trails.",
    icon: ShieldCheck,
  },
  {
    title: "Faster applications",
    desc: "Cut drop-offs with a mobile-first, step-by-step apply experience.",
    icon: Zap,
  },
  {
    title: "Clear investor UX",
    desc: "Price band, lot size and min investment shown before they bid.",
    icon: LineChart,
  },
  {
    title: "Broker-ready ops",
    desc: "Status hooks and reconciliation support for your operations team.",
    icon: Lock,
  },
];

const HERO_IMAGE_SRC = "/Firefly.png";

export default function OnlineIpoBiddingPage() {
  return (
    <div className="bg-white text-slate-800 w-full min-w-0" data-manual-reveal>
      {/* HERO */}
      <section className="relative overflow-hidden py-10 md:py-14">
        <div className="absolute inset-0 bg-linear-to-br from-[#fff8f5] via-white to-[#f4f5f7] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.45] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(46,53,69,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(46,53,69,0.05) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
        />
        <div className="absolute -top-20 right-0 w-120 h-120 bg-[#FE602F]/14 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#2E3545]/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-8 items-center">
            <div>
              <Link
                href={webdevHref("/fintech")}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#FE602F] hover:text-[#d9471b] mb-5 transition-colors"
              >
                <ArrowLeft size={15} />
                Back to Fintech
              </Link>

              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff0eb] text-[#d9471b] text-[11px] font-bold tracking-[0.14em] uppercase ring-1 ring-orange-100 mb-5">
                <Landmark size={14} />
                IPO Services
              </span>

              <h1 className="text-[34px] sm:text-[42px] md:text-[48px] font-bold text-slate-900 leading-[1.12] mb-4">
                Online{" "}
                <span className="bg-linear-to-r from-[#FE602F] via-[#e94e20] to-[#2E3545] bg-clip-text text-transparent">
                  IPO Bidding
                </span>
              </h1>

              <p className="text-[16px] sm:text-[17px] font-semibold text-[#2E3545] mb-3 max-w-xl">
                Invest in India’s growth story — apply in minutes.
              </p>

              <p className="text-slate-500 text-[14.5px] sm:text-[15px] leading-relaxed max-w-xl mb-7">
                Digitise IPO application and bidding for brokers and platforms.
                Show live issues, capture compliant bids, and keep investors
                updated through allotment and listing.
              </p>

              <div className="flex flex-wrap gap-5 sm:gap-7 mb-8">
                {heroStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.title} className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-lg bg-[#fff0eb] text-[#FE602F] ring-1 ring-orange-100 flex items-center justify-center shrink-0">
                        <Icon size={17} strokeWidth={2} />
                      </span>
                      <div className="leading-tight">
                        <p className="text-[13px] font-bold text-slate-800">
                          {stat.title}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {stat.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={webdevHref("/contact")}
                  className="brand-cta-gradient group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold"
                >
                  Schedule a Demo
                  <ArrowRight
                    size={17}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
                <Link
                  href={webdevHref("/contact")}
                  className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold px-6 py-3.5 rounded-xl hover:border-[#FE602F]/50 hover:text-[#d9471b] transition-all"
                >
                  Talk to Sales
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute inset-6 rounded-[28px] bg-[#FE602F]/10 blur-2xl pointer-events-none" />
              <Image
                src={HERO_IMAGE_SRC}
                alt="Online IPO Bidding — apply, track and invest on mobile"
                width={1400}
                height={1050}
                priority
                className="relative h-auto w-full object-contain object-center drop-shadow-[0_24px_50px_rgba(15,23,42,0.18)]"
                sizes="(max-width: 1024px) 92vw, 560px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="pb-10 md:pb-14">
        <div className="container">
          <div className="max-w-2xl mb-7">
            <h2 className="text-[22px] sm:text-[26px] font-bold text-slate-900 mb-2">
              What you get
            </h2>
            <p className="text-slate-500 text-[14.5px] leading-relaxed">
              Everything brokers need to offer a smooth, compliant IPO
              participation journey to investors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {whatYouGet.map((card) => {
              const Icon = card.icon;
              return (
                <SpotlightCard
                  key={card.title}
                  spotlightColor={BRAND_SPOTLIGHT}
                  className="group rounded-2xl bg-[#fff8f5] border border-orange-100/70 p-5 hover:bg-white hover:border-orange-200 hover:shadow-[0_10px_28px_rgba(254,96,47,0.10)] transition-all duration-300"
                >
                  <span className="w-11 h-11 rounded-xl bg-white text-[#FE602F] ring-1 ring-orange-100 flex items-center justify-center mb-4 shadow-sm group-hover:bg-[#fff0eb] transition-colors">
                    <Icon size={20} strokeWidth={2} />
                  </span>
                  <h3 className="text-[14px] font-bold text-slate-900 mb-2 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-[12.5px] text-slate-500 leading-relaxed">
                    {card.desc}
                  </p>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS + BENEFITS */}
      <section className="pb-12 md:pb-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-8 lg:gap-10 items-start">
            <div>
              <h2 className="text-[22px] sm:text-[26px] font-bold text-slate-900 mb-8">
                How it works
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {howItWorks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.step}
                      className="relative rounded-2xl border border-slate-200/80 bg-white p-5 hover:border-orange-200 transition-colors"
                    >
                      <span className="absolute -top-2.5 left-5 w-6 h-6 rounded-full bg-gradient-to-br from-[#FE602F] to-[#e94e20] text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                        {item.step}
                      </span>
                      <span className="w-11 h-11 rounded-xl bg-[#fff0eb] text-[#FE602F] flex items-center justify-center mb-3 mt-1">
                        <Icon size={20} strokeWidth={2} />
                      </span>
                      <h3 className="text-[14px] font-bold text-slate-900 mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-[12.5px] text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[24px] bg-[#fff8f5] border border-orange-100 p-6 sm:p-7">
              <h2 className="text-[18px] sm:text-[20px] font-bold text-slate-900 mb-2">
                Key benefits
              </h2>
              <p className="text-[#FE602F] text-[12.5px] font-semibold mb-6 leading-relaxed">
                Trusted. Simple. Secure.
              </p>

              <ul className="space-y-5">
                {keyBenefits.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.title} className="flex gap-3.5">
                      <span className="w-9 h-9 rounded-full bg-white text-[#FE602F] ring-1 ring-orange-100 flex items-center justify-center shrink-0 shadow-sm">
                        <Icon size={16} strokeWidth={2} />
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-[13.5px] font-bold text-slate-900 mb-0.5">
                          {item.title}
                        </p>
                        <p className="text-[12px] text-slate-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-14 md:pb-16">
        <div className="container">
          <div className="relative overflow-hidden rounded-[28px] border border-orange-100 bg-[#fff8f5] px-6 py-10 sm:px-10 sm:py-12 text-center">
            <div className="absolute -top-16 right-10 w-56 h-56 bg-[#FE602F]/12 rounded-full blur-[90px] pointer-events-none" />
            <div className="relative">
              <h2
                className="text-[24px] sm:text-[30px] font-bold mb-3"
                style={{ color: "#0f172a" }}
              >
                Ready to launch Online IPO Bidding?
              </h2>
              <p
                className="text-[14.5px] sm:text-[15px] max-w-xl mx-auto mb-7 leading-relaxed"
                style={{ color: "#475569" }}
              >
                Give your investors a modern apply experience — and give your
                ops team the status and reconciliation hooks they need.
              </p>
              <Link
                href={webdevHref("/contact")}
                className="brand-cta-gradient group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white"
              >
                Get Started
                <ArrowRight
                  size={17}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
