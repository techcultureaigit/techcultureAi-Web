"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Clock,
  Code2,
  FileText,
  Headphones,
  MonitorCheck,
  Search,
  ServerCog,
  ShieldCheck,
  Target,
  Zap,
} from "lucide-react";
import { webdevHref } from "../../../lib/webdevelopment/paths";
import SpotlightCard, { BRAND_SPOTLIGHT } from "@/components/SpotlightCard";

const heroStats = [
  { title: "100% Secure", subtitle: "UIDAI Compliant", icon: ShieldCheck },
  { title: "Real-time", subtitle: "Verification", icon: Zap },
  { title: "High Success", subtitle: "Rate", icon: BadgeCheck },
];

const trustCards = [
  {
    title: "Secure & Compliant",
    desc: "UIDAI-authorized verification with end-to-end data encryption.",
    icon: ShieldCheck,
  },
  {
    title: "Real-time Response",
    desc: "Get instant verification results in just a few seconds.",
    icon: Clock,
  },
  {
    title: "High Accuracy",
    desc: "Reliable data match with high success rates.",
    icon: Target,
  },
  {
    title: "Easy Integration",
    desc: "Simple REST API with comprehensive documentation.",
    icon: Code2,
  },
  {
    title: "Scalable & Reliable",
    desc: "Built to handle high volumes with 99.9% uptime.",
    icon: BarChart3,
  },
];

const workflowSteps = [
  {
    step: 1,
    title: "Submit Aadhaar Number",
    desc: "Send Aadhaar number using our simple API request.",
    icon: MonitorCheck,
  },
  {
    step: 2,
    title: "Secure Processing",
    desc: "We securely send the request to UIDAI for verification.",
    icon: ServerCog,
  },
  {
    step: 3,
    title: "Verify & Validate",
    desc: "UIDAI validates the Aadhaar number and returns the response.",
    icon: Search,
  },
  {
    step: 4,
    title: "Get Instant Response",
    desc: "Receive real-time verification status in your system.",
    icon: BadgeCheck,
  },
  {
    step: 5,
    title: "Use Verified Data",
    desc: "Proceed with onboarding, KYC, or service activation.",
    icon: BarChart3,
  },
];

const ctaPoints = [
  {
    title: "Quick Integration",
    desc: "Get started in minutes",
    icon: Zap,
  },
  {
    title: "24/7 Support",
    desc: "We're here to help",
    icon: Headphones,
  },
  {
    title: "Trusted by Businesses",
    desc: "Across industries",
    icon: ShieldCheck,
  },
];

export default function AadhaarVerificationPage() {
  return (
    <div className="bg-white text-slate-800 w-full min-w-0" data-manual-reveal>
      {/* HERO */}
      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 bg-linear-to-br from-[#fff8f5] via-white to-[#f5f5f6] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.5] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(46,53,69,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(46,53,69,0.06) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
        />
        <div className="absolute -top-16 left-1/3 w-105 h-105 bg-[#FE602F]/16 rounded-full blur-[120px] pointer-events-none" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.95fr] gap-10 lg:gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff0eb] text-[#d9471b] text-[11px] font-bold tracking-[0.14em] uppercase ring-1 ring-orange-100 mb-6">
                <ShieldCheck size={14} />
                Aadhaar Verification API
              </span>

              <h1 className="text-[34px] sm:text-[42px] md:text-[48px] font-bold text-slate-900 leading-[1.15] mb-5">
                Fast. Secure. Reliable.
                <br />
                <span className="bg-linear-to-r from-[#FE602F] via-[#e94e20] to-[#2E3545] bg-clip-text text-transparent">
                  Aadhaar Verification
                </span>
                <br />
                for Your Business
              </h1>

              <p className="text-slate-500 text-[15px] sm:text-[16px] leading-relaxed max-w-xl mb-7">
                Verify Aadhaar numbers in real-time and ensure authenticity with
                UIDAI-authorized verification. Reduce fraud, ensure compliance
                and onboard customers with confidence.
              </p>

              <div className="flex flex-wrap gap-5 sm:gap-8 mb-8">
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
                  Get Started Now
                  <ArrowRight
                    size={17}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
                <Link
                  href={webdevHref("/contact")}
                  className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold px-6 py-3.5 rounded-xl hover:border-[#FE602F]/50 hover:text-[#d9471b] transition-all"
                >
                  View API Docs
                  <FileText size={16} />
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-[480px] lg:ml-auto lg:min-w-0">
              <Image
                src="/aadhaar-verification-hero.jpg"
                alt="Aadhaar Verification — Instant, compliant Aadhaar-based identity checks for onboarding"
                width={1800}
                height={1125}
                priority
                className="h-auto w-full object-contain object-center"
                sizes="(max-width: 1024px) 90vw, 480px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHY TRUST */}
      <section className="py-10 md:py-14 bg-[#fafbfc]">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
            <h2 className="text-[26px] sm:text-[32px] font-bold text-slate-900 mb-3">
              Why Businesses Trust Our Aadhaar Verification API
            </h2>
            <p className="text-slate-500 text-[15px] leading-relaxed">
              Built for security, speed and scalability to help businesses
              verify identities and prevent fraud with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {trustCards.map((card) => {
              const Icon = card.icon;
              return (
                <SpotlightCard
                  key={card.title}
                  spotlightColor={BRAND_SPOTLIGHT}
                  className="group bg-white rounded-2xl border border-slate-200/80 p-6 text-center hover:border-[#FE602F]/40 hover:shadow-lg hover:shadow-[#FE602F]/10 transition-all duration-300"
                >
                  <span className="w-12 h-12 rounded-xl bg-[#fff0eb] text-[#FE602F] ring-1 ring-orange-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                    <Icon size={22} strokeWidth={2} />
                  </span>
                  <h3 className="text-[15px] font-bold text-slate-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    {card.desc}
                  </p>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-10 md:py-14 bg-white">
        <div className="container">
          <h2 className="text-[26px] sm:text-[32px] font-bold text-slate-900 text-center mb-8 md:mb-10">
            How{" "}
            <span className="bg-linear-to-r from-[#FE602F] to-[#2E3545] bg-clip-text text-transparent">
              Aadhaar Verification
            </span>{" "}
            Works
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
            {workflowSteps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative flex items-stretch gap-3">
                  <div className="relative w-full rounded-2xl border border-slate-200/80 bg-white p-5 pt-7 text-center shadow-sm transition-all hover:border-[#FE602F]/40 hover:shadow-md">
                    <span className="absolute -top-3 left-4 flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-[#FE602F] to-[#2E3545] text-[12px] font-bold text-white shadow-md shadow-[#FE602F]/25">
                      {item.step}
                    </span>
                    <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#fff0eb] text-[#FE602F] ring-1 ring-orange-100">
                      <Icon size={26} strokeWidth={2} />
                    </span>
                    <h3 className="mb-2 text-[14px] font-bold leading-snug text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-[12.5px] leading-relaxed text-slate-500">
                      {item.desc}
                    </p>
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <div className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                      <ArrowRight size={18} className="text-[#FE602F]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-white pb-10 pt-2 md:pb-12">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-linear-to-br from-[#fff4ef] via-white to-[#f3f4f6] p-7 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#FE602F]/20 blur-3xl" />

            <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
              <div>
                <h2 className="mb-3 text-[24px] font-bold leading-snug text-slate-900 sm:text-[30px]">
                  Ready to Verify Aadhaar Instantly?
                </h2>
                <p className="mb-6 max-w-md text-[14.5px] leading-relaxed text-slate-500">
                  Integrate our Aadhaar Verification API and streamline your KYC
                  process, reduce fraud and build trust with your customers.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={webdevHref("/contact")}
                    className="brand-cta-gradient group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold"
                  >
                    Get Started Now
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                  <Link
                    href={webdevHref("/contact")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:border-[#FE602F]/50 hover:text-[#d9471b]"
                  >
                    Contact Sales
                    <Headphones size={16} />
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                {ctaPoints.map((point) => {
                  const Icon = point.icon;
                  return (
                    <div key={point.title} className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#FE602F] shadow-sm ring-1 ring-orange-100">
                        <Icon size={18} strokeWidth={2} />
                      </span>
                      <div className="leading-tight">
                        <p className="text-[13.5px] font-bold text-slate-800">
                          {point.title}
                        </p>
                        <p className="mt-0.5 text-[12px] text-slate-500">
                          {point.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
