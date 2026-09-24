"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  FilePlus2,
  FolderSync,
  Lock,
  Send,
  ShieldCheck,
  Target,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { webdevHref } from "../../../lib/webdevelopment/paths";
import SpotlightCard, { TEAL_SPOTLIGHT } from "@/components/SpotlightCard";

const whatYouGet = [
  {
    title: "Expiry-based triggers",
    desc: "Auto-trigger re-KYC before document expiry.",
    icon: Target,
  },
  {
    title: "Omnichannel reminders",
    desc: "WhatsApp, Email & SMS nudges.",
    icon: Bell,
  },
  {
    title: "Prefilled document updates",
    desc: "Re-use existing data & ask for updates only.",
    icon: FilePlus2,
  },
  {
    title: "Campaign dashboards",
    desc: "Track response, completion & status.",
    icon: ShieldCheck,
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Set Trigger Rules",
    desc: "Define expiry windows and user segments.",
    icon: Target,
  },
  {
    step: 2,
    title: "Send Reminders",
    desc: "Reach users via preferred channels automatically.",
    icon: Send,
  },
  {
    step: 3,
    title: "Collect & Verify",
    desc: "Users submit updated documents securely.",
    icon: FilePlus2,
  },
  {
    step: 4,
    title: "Review & Approve",
    desc: "Verify documents and approve the update.",
    icon: ShieldCheck,
  },
  {
    step: 5,
    title: "Update & Store",
    desc: "Refreshed KYC stored with full audit trail.",
    icon: FolderSync,
  },
];

const impactStats = [
  {
    value: "90%",
    title: "Faster Re-KYC completion",
    desc: "Automated reminders increase response rate.",
    icon: Clock3,
  },
  {
    value: "70%",
    title: "Operational efficiency",
    desc: "Reduce manual follow-ups and workload.",
    icon: TrendingUp,
  },
  {
    value: "100%",
    title: "Compliance assured",
    desc: "Stay audit-ready with complete logs.",
    icon: ShieldCheck,
  },
  {
    value: null,
    title: "Better experience",
    desc: "Seamless, secure and convenient for customers.",
    icon: UserRound,
  },
];

const trustBadges = [
  { title: "RBI Compliant", subtitle: null, icon: ShieldCheck },
  { title: "Data Encryption", subtitle: "End-to-end", icon: Lock },
  { title: "Audit Trail", subtitle: "Complete logs", icon: ShieldCheck },
  { title: "Privacy First", subtitle: "User data protected", icon: UserRound },
];

/** Set when the final hero illustration is provided */
const HERO_IMAGE_SRC = "/re-kyc-hero.jpg";

function HeroVisualPlaceholder() {
  const checks = ["Identity Proof", "Address Proof", "Selfie Verification"];

  return (
    <div className="relative w-full max-w-[480px] mx-auto min-h-[380px] sm:min-h-[440px] flex items-center justify-center">
      <div className="absolute top-8 right-6 w-52 h-52 bg-emerald-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-4 left-8 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Pedestal */}
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[58%] h-4 rounded-[100%] bg-slate-200/70 blur-[2px]" />
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[46%] h-2.5 rounded-[100%] bg-slate-300/50" />

      {/* Phone */}
      <div className="relative z-10 w-[180px] sm:w-[200px] rounded-[1.75rem] border-[6px] border-slate-900 bg-slate-900 shadow-[0_28px_60px_rgba(15,23,42,0.25)] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-900 rounded-b-xl z-20" />
        <div className="bg-white min-h-[340px] sm:min-h-[380px] p-3.5 pt-7 flex flex-col">
          <p className="text-[11px] font-bold text-emerald-700 text-center mb-3">
            Re-KYC Verification
          </p>
          <div className="rounded-xl bg-slate-100 h-28 mb-3 relative overflow-hidden flex items-end justify-center">
            <div className="w-14 h-14 rounded-full bg-slate-300 mb-2 relative">
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-20 h-12 rounded-t-full bg-slate-300" />
            </div>
            <span className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <CheckCircle2 size={13} strokeWidth={2.5} />
            </span>
          </div>
          <ul className="space-y-2 mt-1">
            {checks.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2
                  size={13}
                  className="text-emerald-500 shrink-0"
                  strokeWidth={2.4}
                />
                <span className="text-[10px] font-medium text-slate-600">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Floating cards */}
      {[
        { label: "WhatsApp Reminder", pos: "top-[8%] left-0" },
        { label: "Email Reminder", pos: "top-[28%] left-0" },
        { label: "Expiry Alert", pos: "bottom-[30%] left-0" },
        { label: "Secure & Verified", pos: "top-[18%] right-0" },
        { label: "Refreshed Records", pos: "bottom-[24%] right-0" },
      ].map((card) => (
        <div
          key={card.label}
          className={`absolute ${card.pos} z-20 bg-white rounded-xl border border-slate-200/90 shadow-[0_10px_28px_rgba(15,23,42,0.08)] px-3 py-2 max-w-[130px]`}
        >
          <p className="text-[10px] font-semibold text-slate-700 leading-tight">
            {card.label}
          </p>
        </div>
      ))}

      <div className="absolute bottom-[6%] left-1/2 translate-x-6 z-20">
        <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30">
          <ShieldCheck size={22} strokeWidth={2.4} />
        </span>
      </div>
    </div>
  );
}

export default function ReKycPage() {
  return (
    <div className="bg-white text-slate-800 w-full min-w-0">
      {/* HERO */}
      <section className="relative overflow-hidden pt-8 pb-8 md:pt-10 md:pb-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5fbf9] via-white to-white pointer-events-none" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12 items-start">
            <div>
              <Link
                href={webdevHref("/fintech")}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-700 hover:text-teal-800 mb-6 transition-colors"
              >
                <ArrowLeft size={15} />
                Back to Fintech
              </Link>

              <h1 className="text-[36px] sm:text-[44px] md:text-[48px] font-bold text-slate-900 leading-tight mb-3">
                Re-KYC
              </h1>

              <p className="text-[16px] sm:text-[17px] font-semibold text-teal-700 mb-4 max-w-xl">
                Periodic re-KYC campaigns with automated reminders.
              </p>

              <p className="text-slate-500 text-[14.5px] sm:text-[15px] leading-relaxed max-w-xl mb-8">
                Re-KYC keeps customer records current. Trigger campaigns by
                expiry windows, push WhatsApp/email nudges, and collect
                refreshed proofs without restarting your core KYC stack.
              </p>

              <h2 className="text-[18px] sm:text-[20px] font-bold text-slate-900 mb-4">
                What you get
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {whatYouGet.map((card) => {
                  const Icon = card.icon;
                  return (
                    <SpotlightCard
                      key={card.title}
                      spotlightColor={TEAL_SPOTLIGHT}
                      className="group rounded-2xl bg-[#f4f7f6] border border-teal-100/50 p-4 hover:bg-white hover:border-teal-200 hover:shadow-[0_8px_22px_rgba(13,148,136,0.10)] transition-all duration-300"
                    >
                      <div className="flex gap-3">
                        <span className="w-10 h-10 rounded-full bg-white text-teal-600 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-teal-50 transition-colors">
                          <Icon size={17} strokeWidth={2} />
                        </span>
                        <div className="min-w-0 pt-0.5">
                          <h3 className="text-[13px] font-bold text-slate-900 mb-1 leading-snug">
                            {card.title}
                          </h3>
                          <p className="text-[12px] text-slate-500 leading-relaxed">
                            {card.desc}
                          </p>
                        </div>
                      </div>
                    </SpotlightCard>
                  );
                })}
              </div>
            </div>

            <div className="relative lg:pt-4">
              {HERO_IMAGE_SRC ? (
                <Image
                  src={HERO_IMAGE_SRC}
                  alt="Re-KYC verification — identity, address and selfie checks on mobile"
                  width={1400}
                  height={1050}
                  quality={100}
                  priority
                  className="w-full h-auto max-w-[572px] mx-auto select-none pointer-events-none object-contain"
                />
              ) : (
                <HeroVisualPlaceholder />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS + IMPACT */}
      <section className="pb-10 md:pb-14">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-8 lg:gap-10 items-start">
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
                          <span className="absolute -top-2 left-1/2 sm:left-7 -translate-x-1/2 sm:translate-x-0 w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-[10px] font-bold flex items-center justify-center z-10 shadow-sm">
                            {item.step}
                          </span>
                          <span className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto sm:mx-0 mb-3 mt-1">
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
                          <div className="w-6 border-t border-dashed border-teal-300" />
                          <ArrowRight
                            size={14}
                            className="text-teal-400 -ml-0.5"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[24px] bg-white border border-teal-100/70 shadow-[0_10px_32px_rgba(13,148,136,0.08)] p-6 sm:p-7">
              <h2 className="text-[18px] sm:text-[20px] font-bold text-slate-900 mb-5">
                Impact that matters
              </h2>

              <ul className="space-y-5">
                {impactStats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.title} className="flex gap-3.5">
                      <span className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <Icon size={16} strokeWidth={2} />
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-[13.5px] font-bold text-slate-900 mb-0.5 leading-snug">
                          {item.value ? (
                            <>
                              <span className="text-teal-700">{item.value}</span>{" "}
                              {item.title}
                            </>
                          ) : (
                            item.title
                          )}
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

      {/* TRUST BADGES */}
      <section className="pb-14 md:pb-16">
        <div className="container">
          <div className="rounded-2xl bg-[#f4f7f6] border border-teal-100/40 px-5 py-6 sm:px-8 sm:py-7">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.title}
                    className="flex items-center gap-3 justify-center md:justify-start"
                  >
                    <span className="w-9 h-9 rounded-full bg-white text-teal-600 flex items-center justify-center shrink-0 shadow-sm">
                      <Icon size={16} strokeWidth={2} />
                    </span>
                    <div className="min-w-0 leading-tight">
                      <p className="text-[13px] font-bold text-slate-800">
                        {badge.title}
                      </p>
                      {badge.subtitle && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {badge.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
