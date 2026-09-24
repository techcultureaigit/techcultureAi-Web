"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  FileCheck2,
  FileText,
  ScanFace,
  ShieldCheck,
  Target,
  Timer,
  Zap,
  BarChart3,
  ScanLine,
} from "lucide-react";
import { webdevHref } from "../../../lib/webdevelopment/paths";
import SpotlightCard, { TEAL_SPOTLIGHT } from "@/components/SpotlightCard";

const heroFeatures = [
  {
    title: "Secure & Compliant",
    subtitle: "RBI & SEBI Compliant",
    icon: ShieldCheck,
  },
  {
    title: "OCR Powered",
    subtitle: "High accuracy data extraction",
    icon: ScanLine,
  },
  {
    title: "Liveness Check",
    subtitle: "Real-time face verification",
    icon: ScanFace,
  },
  {
    title: "Instant Approval",
    subtitle: "Rule-based auto approvals",
    icon: Zap,
  },
  {
    title: "Audit Ready",
    subtitle: "Complete logs & audit trail",
    icon: FileText,
  },
];

const whatYouGet = [
  {
    title: "Document OCR & Validation",
    desc: "Extract and validate data from documents with high accuracy OCR.",
    icon: ScanLine,
  },
  {
    title: "Liveness / Face Match",
    desc: "Verify real user presence with advanced liveness detection.",
    icon: ScanFace,
  },
  {
    title: "Rule-based Auto-Approval",
    desc: "Configure business rules and automate approvals instantly.",
    icon: Zap,
  },
  {
    title: "SEBI-friendly Audit Logs",
    desc: "Maintain immutable audit logs for regulatory compliance.",
    icon: FileCheck2,
  },
  {
    title: "Complete Compliance Trail",
    desc: "End-to-end encrypted logs and reports for full traceability.",
    icon: ShieldCheck,
  },
];

const performanceStats = [
  { value: "99.9%", label: "Accuracy", icon: Target },
  { value: "< 5 sec", label: "Avg. Verification Time", icon: Timer },
  { value: "10M+", label: "Verifications", icon: BarChart3 },
  { value: "100+", label: "Enterprises", icon: Building2 },
];

const HERO_IMAGE_SRC = "/digital-kyc-hero.png";

export default function DigitalKycPage() {
  return (
    <div className="bg-white text-slate-800 w-full min-w-0">
      <section className="relative overflow-hidden pt-8 pb-12 md:pt-10 md:pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f7faf9] via-white to-white pointer-events-none" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.2fr] gap-10 lg:gap-8 items-center">
            <div>
              <Link
                href={webdevHref("/products")}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-700 hover:text-teal-800 mb-6 transition-colors"
              >
                <ArrowLeft size={15} />
                Back to Products
              </Link>

              <h1 className="text-[36px] sm:text-[44px] md:text-[48px] font-bold text-slate-900 leading-tight mb-3">
                Digital KYC
              </h1>

              <p className="text-[16px] sm:text-[17px] font-semibold text-teal-700 mb-4 max-w-xl">
                End-to-end digital KYC for individuals with OCR and liveness.
              </p>

              <p className="text-slate-500 text-[14.5px] sm:text-[15px] leading-relaxed max-w-xl mb-8">
                Digital KYC digitises paper-heavy verification. Capture
                documents, extract data with OCR, run liveness checks, and push
                straight-through approvals where rules allow — with full
                compliance trail.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-3">
                {heroFeatures.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="min-w-0">
                      <span className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100 flex items-center justify-center mb-2.5">
                        <Icon size={18} strokeWidth={2} />
                      </span>
                      <p className="text-[12.5px] font-bold text-slate-900 leading-snug mb-0.5">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {item.subtitle}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-xl lg:min-w-0">
              <Image
                src={HERO_IMAGE_SRC}
                alt="Digital KYC verification — document OCR, liveness check and instant verification"
                width={612}
                height={408}
                quality={100}
                priority
                unoptimized
                className="h-auto w-full object-contain object-center"
                sizes="(max-width: 1024px) 90vw, 420px"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14 md:pb-20">
        <div className="container">
          <div className="relative rounded-[28px] bg-gradient-to-br from-[#f3faf8] via-[#f7fcfa] to-[#eff9f5] border border-teal-100/70 p-6 sm:p-8 md:p-10 overflow-hidden">
            <div className="absolute -top-24 -right-16 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
            <h2 className="relative text-[24px] sm:text-[28px] font-bold text-slate-900 mb-6 md:mb-8">
              What you get
            </h2>

            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {whatYouGet.map((card) => {
                const Icon = card.icon;
                return (
                  <SpotlightCard
                    key={card.title}
                    spotlightColor={TEAL_SPOTLIGHT}
                    className="group h-full bg-white rounded-2xl border border-teal-100/70 px-5 py-7 text-center shadow-[0_4px_18px_rgba(13,148,136,0.06)] hover:border-teal-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(13,148,136,0.14)] transition-all duration-300"
                  >
                    <div className="flex flex-col items-center h-full">
                      <span className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-5 shrink-0 group-hover:bg-teal-100 group-hover:scale-105 transition-all duration-300">
                        <Icon size={24} strokeWidth={1.9} />
                      </span>
                      <h3 className="text-[13.5px] font-bold text-slate-900 mb-2.5 leading-snug">
                        {card.title}
                      </h3>
                      <p className="text-[12.5px] text-slate-500 leading-[1.7]">
                        {card.desc}
                      </p>
                    </div>
                  </SpotlightCard>
                );
              })}

              <div className="rounded-2xl bg-gradient-to-b from-[#0f766e] to-[#0d5c56] p-5 sm:p-6 text-white shadow-[0_12px_32px_rgba(15,118,110,0.28)] sm:col-span-2 lg:col-span-1 xl:col-span-1">
                <h3 className="text-[15px] font-bold mb-3">
                  Built for Performance
                </h3>
                <div className="h-px bg-white/20 mb-5" />
                <ul className="space-y-4">
                  {performanceStats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <li key={stat.label} className="flex items-start gap-3">
                        <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon size={15} strokeWidth={2} />
                        </span>
                        <div className="leading-tight min-w-0">
                          <p className="text-[15px] font-bold">{stat.value}</p>
                          <p className="text-[11.5px] text-teal-100/90 mt-0.5">
                            {stat.label}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
