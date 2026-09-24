"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileSignature,
  FolderOpen,
  IndianRupee,
  Lock,
  PenLine,
  ShieldCheck,
  UserRound,
  Wallet,
  Zap,
} from "lucide-react";
import { webdevHref } from "../../../lib/webdevelopment/paths";
import SpotlightCard, { TEAL_SPOTLIGHT } from "@/components/SpotlightCard";

const whatYouGet = [
  {
    title: "Guided closure checklist",
    desc: "Smart checklist to ensure all steps are completed before closure.",
    icon: ClipboardCheck,
  },
  {
    title: "e-Sign / e-Consent capture",
    desc: "Capture verified e-consent from customers securely and compliantly.",
    icon: FileSignature,
  },
  {
    title: "Dues task queue",
    desc: "Identify and clear pending dues, holds, or obligations with ease.",
    icon: Wallet,
  },
  {
    title: "Final status & closure pack",
    desc: "Generate a complete closure report with audit trail and documents.",
    icon: FolderOpen,
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Verify Customer",
    desc: "Authenticate and verify the customer identity.",
    icon: UserRound,
  },
  {
    step: 2,
    title: "Run Closure Checklist",
    desc: "System-driven checklist ensures all required steps are completed.",
    icon: ClipboardCheck,
  },
  {
    step: 3,
    title: "Clear Dues",
    desc: "Identify and resolve any pending dues, holds, or obligations.",
    icon: IndianRupee,
  },
  {
    step: 4,
    title: "Capture Consent",
    desc: "Collect e-consent from the customer securely.",
    icon: PenLine,
  },
  {
    step: 5,
    title: "Generate Closure Pack",
    desc: "Create an auditable closure pack for back office records.",
    icon: FolderOpen,
  },
];

const keyBenefits = [
  {
    title: "100% Compliant",
    desc: "Adhere to regulatory guidelines with complete audit trail.",
    icon: ShieldCheck,
  },
  {
    title: "Faster Turnaround",
    desc: "Automate tasks and reduce manual effort.",
    icon: Zap,
  },
  {
    title: "Secure & Reliable",
    desc: "Data privacy and security at every step.",
    icon: Lock,
  },
  {
    title: "Better Experience",
    desc: "Seamless and transparent exit experience for customers.",
    icon: BarChart3,
  },
];

const HERO_IMAGE_SRC = "/account-closure-hero.jpg";

function HeroVisualPlaceholder() {
  const checklist = [
    "Verify Identity",
    "Collect Reason",
    "Clear Dues",
    "Capture Consent",
    "Generate Closure Pack",
  ];

  return (
    <div className="relative w-full max-w-[520px] mx-auto min-h-[300px] sm:min-h-[340px] flex items-center justify-center">
      <div className="absolute top-6 right-8 w-48 h-48 bg-emerald-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Monitor */}
      <div className="relative z-10 w-[250px] sm:w-[290px]">
        <div className="rounded-t-xl border-[10px] border-slate-800 bg-slate-800 overflow-hidden shadow-[0_24px_50px_rgba(15,23,42,0.18)]">
          <div className="bg-white p-3.5 min-h-[200px]">
            <p className="text-[11px] font-bold text-slate-800 mb-3">
              Closure Checklist
            </p>
            <ul className="space-y-2">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-emerald-500 shrink-0"
                    strokeWidth={2.4}
                  />
                  <span className="text-[11px] font-medium text-slate-600">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="h-3 bg-slate-300 rounded-b-md" />
        <div className="h-1.5 w-[55%] mx-auto bg-slate-200 rounded-b" />
      </div>

      {/* Floating cards */}
      <div className="absolute top-2 left-0 z-20 bg-white rounded-xl border border-slate-200/90 shadow-[0_10px_28px_rgba(15,23,42,0.08)] px-3 py-2.5 w-[130px]">
        <p className="text-[10px] font-bold text-slate-700 mb-2">
          Customer Consent
        </p>
        <svg viewBox="0 0 80 28" className="w-full h-7 text-slate-500">
          <path
            d="M4 18 C 14 6, 22 22, 32 14 S 48 6, 58 16 S 70 22, 76 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="absolute top-10 right-0 z-20 bg-white rounded-xl border border-slate-200/90 shadow-[0_10px_28px_rgba(15,23,42,0.08)] px-3 py-2.5 w-[110px] text-center">
        <p className="text-[10px] font-bold text-slate-700 mb-2">Dues Cleared</p>
        <span className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
          <CheckCircle2 size={18} strokeWidth={2.5} />
        </span>
      </div>

      <div className="absolute bottom-6 right-2 z-20 bg-white rounded-xl border border-slate-200/90 shadow-[0_10px_28px_rgba(15,23,42,0.08)] px-3 py-2.5 w-[110px] text-center">
        <p className="text-[10px] font-bold text-slate-700 mb-2">Closure Pack</p>
        <span className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <Download size={16} strokeWidth={2.2} />
        </span>
      </div>

      <div className="absolute bottom-4 left-[28%] z-20">
        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <ShieldCheck size={18} strokeWidth={2.4} />
        </span>
      </div>
    </div>
  );
}

export default function AccountClosurePage() {
  return (
    <div className="bg-white text-slate-800 w-full min-w-0">
      {/* HERO */}
      <section className="relative overflow-hidden pt-8 pb-10 md:pt-10 md:pb-14">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f6fbf9] via-white to-white pointer-events-none" />

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
                Account Closure
              </h1>

              <p className="text-[16px] sm:text-[17px] font-semibold text-teal-700 mb-4 max-w-xl">
                Compliant account closure with checklist and audit trail.
              </p>

              <p className="text-slate-500 text-[14.5px] sm:text-[15px] leading-relaxed max-w-xl">
                Account Closure streamlines the exit journey — collect reasons,
                clear dues, capture e-consent, and generate an auditable
                closure pack for back office.
              </p>
            </div>

            <div className="relative">
              {HERO_IMAGE_SRC ? (
                <Image
                  src={HERO_IMAGE_SRC}
                  alt="Account Closure checklist dashboard"
                  width={1024}
                  height={860}
                  quality={100}
                  priority
                  className="w-full h-auto max-w-[540px] mx-auto select-none pointer-events-none"
                />
              ) : (
                <HeroVisualPlaceholder />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="pb-10 md:pb-14">
        <div className="container">
          <h2 className="text-[22px] sm:text-[26px] font-bold text-slate-900 mb-6">
            What you get
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {whatYouGet.map((card) => {
              const Icon = card.icon;
              return (
                <SpotlightCard
                  key={card.title}
                  spotlightColor={TEAL_SPOTLIGHT}
                  className="group rounded-2xl bg-[#f4f7f6] border border-teal-100/50 p-5 hover:bg-white hover:border-teal-200 hover:shadow-[0_10px_28px_rgba(13,148,136,0.10)] transition-all duration-300"
                >
                  <span className="w-11 h-11 rounded-xl bg-white text-teal-600 flex items-center justify-center mb-4 shadow-sm group-hover:bg-teal-50 transition-colors">
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

      {/* HOW IT WORKS + KEY BENEFITS */}
      <section className="pb-12 md:pb-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-8 lg:gap-10 items-start">
            {/* How it works */}
            <div>
              <h2 className="text-[22px] sm:text-[26px] font-bold text-slate-900 mb-8">
                How it works
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-0">
                {howItWorks.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.step}
                      className="flex-1 flex flex-col sm:flex-row items-start sm:items-stretch"
                    >
                      <div className="relative w-full text-center sm:text-left px-1">
                        <div className="relative inline-flex sm:flex flex-col items-center sm:items-start w-full">
                          <span className="absolute -top-2 left-1/2 sm:left-7 -translate-x-1/2 sm:translate-x-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#FE602F] to-[#e94e20] text-white text-[10px] font-bold flex items-center justify-center z-10 shadow-sm">
                            {item.step}
                          </span>
                          <span className="w-14 h-14 rounded-2xl bg-[#fff0eb] text-[#FE602F] flex items-center justify-center mx-auto sm:mx-0 mb-3 mt-1">
                            <Icon size={22} strokeWidth={2} />
                          </span>
                          <h3 className="text-[13px] font-bold text-slate-900 mb-1.5 leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-[11.5px] text-slate-500 leading-relaxed max-w-[150px] mx-auto sm:mx-0">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      {index < howItWorks.length - 1 && (
                        <div className="hidden sm:flex items-center justify-center self-start mt-8 px-1 shrink-0">
                          <div className="w-6 border-t border-dashed border-orange-200" />
                          <ArrowRight size={14} className="text-[#FE602F]/70 -ml-0.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key benefits */}
            <div className="rounded-[24px] bg-[#fff8f5] border border-orange-100/60 p-6 sm:p-7">
              <h2 className="text-[18px] sm:text-[20px] font-bold text-[#2E3545] mb-5">
                Key benefits
              </h2>

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
                        <p className="text-[12px] text-slate-500 leading-relaxed">
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
    </div>
  );
}
