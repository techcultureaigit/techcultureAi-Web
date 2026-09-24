"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  FileCheck2,
  FileText,
  Files,
  ShieldCheck,
  Timer,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { webdevHref } from "../../../lib/webdevelopment/paths";
import SpotlightCard, { TEAL_SPOTLIGHT } from "@/components/SpotlightCard";

const heroFeatures = [
  { title: "Compliant", subtitle: "by Design", icon: ShieldCheck },
  { title: "Multi-document", subtitle: "Workflows", icon: Files },
  { title: "Authorized", subtitle: "Signatories", icon: Users },
  { title: "Structured", subtitle: "Audit Trail", icon: FileCheck2 },
  { title: "Faster", subtitle: "Onboarding", icon: Zap },
];

const whatYouGet = [
  {
    title: "Multi-document entity packs",
    desc: "Collect and validate CIN, GST, PAN and other documents in a single flow.",
    icon: FileText,
    wide: false,
  },
  {
    title: "Signatory verification",
    desc: "Verify authorized signatories and their identity with confidence.",
    icon: UserCheck,
    wide: false,
  },
  {
    title: "Maker checker ready",
    desc: "Built-in maker checker workflows for better control and accountability.",
    icon: FileCheck2,
    wide: false,
  },
  {
    title: "Reusable for partners & vendors",
    desc: "Use the same workflow for partners, vendors and suppliers.",
    icon: Building2,
    wide: false,
  },
  {
    title: "Structured compliance audit trail",
    desc: "Maintain an end-to-end audit trail with logs, remarks and status at every step.",
    icon: ShieldCheck,
    wide: true,
  },
];

const complianceStats = [
  { value: "99.9%", label: "Accuracy", icon: ShieldCheck },
  { value: "< 5 sec", label: "Avg. Verification Time", icon: Zap },
  { value: "10M+", label: "Verifications", icon: Building2 },
  { value: "100+", label: "Enterprises", icon: Users },
];

const regulators = ["SEBI", "RBI", "MCA", "GSTN"];

const HERO_IMAGE_SRC = "/business-kyc-hero.png";

function HeroVisualPlaceholder() {
  return (
    <div className="relative w-full max-w-[520px] mx-auto min-h-[300px] sm:min-h-[340px] flex items-center justify-center">
      <div className="absolute top-4 right-4 w-56 h-56 bg-teal-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-6 w-44 h-44 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Laptop */}
      <div className="relative z-10 w-[280px] sm:w-[320px]">
        <div className="rounded-t-xl border-[8px] border-slate-800 bg-slate-800 overflow-hidden">
          <div className="bg-white p-3 min-h-[180px]">
            <p className="text-[10px] font-bold text-slate-700 mb-2.5">
              Business KYC Dashboard
            </p>
            <div className="space-y-2">
              {[0, 1, 2, 3].map((row) => (
                <div
                  key={row}
                  className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-1.5"
                >
                  <span className="w-4 h-4 rounded bg-teal-100 shrink-0" />
                  <span className="h-1.5 rounded bg-slate-200 flex-1" />
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-2.5 bg-slate-300 rounded-b-xl" />
        <div className="h-1.5 w-[70%] mx-auto bg-slate-200 rounded-b-lg" />
      </div>

      {/* Floating cards */}
      <div className="absolute top-0 left-0 z-20 bg-white rounded-xl border border-slate-200/90 shadow-[0_10px_28px_rgba(15,23,42,0.08)] px-3 py-2.5 w-[150px]">
        <p className="text-[10px] font-bold text-slate-700 mb-2">
          Multi-document Collection
        </p>
        {["CIN", "GST", "PAN"].map((doc) => (
          <div key={doc} className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-slate-600">
              {doc}
            </span>
            <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 rounded px-1.5 py-0.5">
              Verified
            </span>
          </div>
        ))}
      </div>

      <div className="absolute top-8 right-0 z-20 bg-white rounded-xl border border-slate-200/90 shadow-[0_10px_28px_rgba(15,23,42,0.08)] px-3 py-2.5 w-[120px] text-center">
        <p className="text-[10px] font-bold text-slate-700 mb-2">
          Authorized Signatory
        </p>
        <span className="w-9 h-9 rounded-full bg-slate-200 mx-auto block" />
      </div>

      <div className="absolute bottom-2 right-0 z-20 bg-white rounded-xl border border-slate-200/90 shadow-[0_10px_28px_rgba(15,23,42,0.08)] px-3 py-2.5 w-[120px]">
        <p className="text-[10px] font-bold text-slate-700 mb-2">Audit Trail</p>
        <div className="space-y-1.5">
          {[0, 1, 2].map((line) => (
            <span key={line} className="block h-1.5 rounded bg-slate-200" />
          ))}
        </div>
      </div>

      {/* Shield */}
      <div className="absolute bottom-8 left-1/2 z-30">
        <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30">
          <ShieldCheck size={26} strokeWidth={2.4} />
        </span>
      </div>
    </div>
  );
}

export default function BusinessKycPage() {
  return (
    <div className="bg-white text-slate-800 w-full min-w-0">
      {/* HERO */}
      <section className="relative overflow-hidden pt-8 pb-10 md:pt-10 md:pb-14">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5fbf9] via-white to-white pointer-events-none" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-12 items-center">
            <div>
              <Link
                href={webdevHref("/fintech")}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-700 hover:text-teal-800 mb-6 transition-colors"
              >
                <ArrowLeft size={15} />
                Back to Fintech
              </Link>

              <h1 className="text-[36px] sm:text-[44px] md:text-[48px] font-bold text-slate-900 leading-tight mb-3">
                Business KYC
              </h1>

              <p className="text-[16px] sm:text-[17px] font-semibold text-teal-700 mb-4 max-w-xl">
                Corporate and entity KYC with multi-document workflows.
              </p>

              <p className="text-slate-500 text-[14.5px] sm:text-[15px] leading-relaxed max-w-xl mb-8">
                Business KYC is built for companies, HUFs and other entities.
                Collect CIN/GST/PAN packs, verify authorised signatories, and
                keep a structured trail for compliance teams.
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-3">
                {heroFeatures.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="text-center min-w-0">
                      <span className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-2.5">
                        <Icon size={20} strokeWidth={2} />
                      </span>
                      <p className="text-[12px] font-bold text-slate-900 leading-snug">
                        {item.title}
                      </p>
                      <p className="text-[12px] font-bold text-slate-900 leading-snug">
                        {item.subtitle}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              {HERO_IMAGE_SRC ? (
                <Image
                  src={HERO_IMAGE_SRC}
                  alt="Business KYC dashboard with multi-document verification"
                  width={1024}
                  height={738}
                  quality={100}
                  priority
                  className="w-full h-auto max-w-[560px] mx-auto select-none pointer-events-none"
                />
              ) : (
                <HeroVisualPlaceholder />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET + COMPLIANCE */}
      <section className="pb-14 md:pb-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5 lg:gap-6">
            {/* What you get */}
            <div className="relative rounded-[26px] bg-white border border-teal-100/70 p-6 sm:p-8 shadow-[0_6px_28px_rgba(13,148,136,0.06)]">
              <h2 className="text-[22px] sm:text-[25px] font-bold text-slate-900 mb-6">
                What you get
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {whatYouGet.map((card) => {
                  const Icon = card.icon;
                  return (
                    <SpotlightCard
                      key={card.title}
                      spotlightColor={TEAL_SPOTLIGHT}
                      className={`group rounded-2xl border border-teal-100/70 bg-[#fbfefd] p-4 hover:border-teal-300 hover:shadow-[0_8px_22px_rgba(13,148,136,0.10)] transition-all duration-300 ${
                        card.wide ? "sm:col-span-2" : ""
                      }`}
                    >
                      <div className="flex gap-3.5">
                        <span className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:bg-teal-100 transition-colors">
                          <Icon size={20} strokeWidth={2} />
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-[13.5px] font-bold text-slate-900 mb-1.5 leading-snug">
                            {card.title}
                          </h3>
                          <p className="text-[12.5px] text-slate-500 leading-relaxed">
                            {card.desc}
                          </p>
                        </div>
                      </div>
                    </SpotlightCard>
                  );
                })}
              </div>
            </div>

            {/* Built for compliance */}
            <div className="relative rounded-[26px] bg-gradient-to-br from-[#effaf6] via-[#f4fbf9] to-[#e9f7f2] border border-teal-100/70 p-6 sm:p-8 overflow-hidden">
              <div className="absolute -top-20 -right-14 w-64 h-64 bg-teal-200/25 rounded-full blur-3xl pointer-events-none" />

              <div className="relative text-center mb-8">
                <h2 className="text-[19px] sm:text-[21px] font-bold text-slate-900 mb-2 leading-snug">
                  Built for Compliance. Backed by Results.
                </h2>
                <p className="text-[13px] text-slate-500">
                  Helping businesses stay compliant and move faster.
                </p>
              </div>

              <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-5 mb-8">
                {complianceStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <span className="w-11 h-11 rounded-2xl bg-white/80 text-teal-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <Icon size={19} strokeWidth={2} />
                      </span>
                      <p className="text-[18px] font-bold text-teal-700 leading-none mb-1.5">
                        {stat.value}
                      </p>
                      <p className="text-[11.5px] text-slate-500 leading-snug">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="relative pt-6 border-t border-teal-100">
                <div className="grid grid-cols-4 gap-3 items-center">
                  {regulators.map((name) => (
                    <span
                      key={name}
                      className="text-center text-[13px] font-bold text-slate-400 tracking-wide"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
