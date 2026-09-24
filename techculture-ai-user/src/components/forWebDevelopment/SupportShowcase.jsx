"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Gauge,
  Headphones,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";
import ScrollReveal, { ScrollRevealItem } from "@/components/ScrollReveal";

const highlights = [
  {
    icon: MessagesSquare,
    title: "One unified inbox",
    description: "Email, chat and customer requests in a single agent workspace.",
  },
  {
    icon: Gauge,
    title: "Faster resolution",
    description: "Priorities, ownership and status stay visible from start to finish.",
  },
  {
    icon: ShieldCheck,
    title: "Built for trust",
    description: "Secure customer context with a complete, audit-ready conversation trail.",
  },
];

export default function SupportShowcase() {
  return (
    <section className="relative overflow-hidden bg-white/40 py-16 md:py-24 backdrop-blur-[1px]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-[#2E3545]/8 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#FE602F]/12 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
          <ScrollReveal direction="left" delay={0.04} stagger={0.08}>
            <ScrollRevealItem>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-700">
                <Headphones size={14} />
                Customer Service Ecosystem
              </span>
            </ScrollRevealItem>

            <ScrollRevealItem>
              <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                Turn every customer request into{" "}
                <span className="section-heading-accent">clear action</span>
              </h2>
            </ScrollRevealItem>

            <ScrollRevealItem>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
                Give support teams the complete context they need to respond
                faster, collaborate better and deliver consistent service across
                every customer conversation.
              </p>
            </ScrollRevealItem>

            <ScrollReveal
              direction="fade"
              delay={0.05}
              stagger={0.1}
              className="mt-7 space-y-5"
            >
              {highlights.map(({ icon: Icon, title, description }) => (
                <ScrollRevealItem key={title}>
                  <div className="flex gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-teal-50 to-orange-50 text-teal-700 ring-1 ring-teal-100">
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                        {title}
                      </h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-slate-500">
                        {description}
                      </p>
                    </div>
                  </div>
                </ScrollRevealItem>
              ))}
            </ScrollReveal>

            <ScrollRevealItem>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="#contact"
                  className="brand-cta-gradient inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold"
                >
                  Transform Customer Support
                  <ArrowRight size={17} />
                </Link>
                <span className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-500 sm:justify-start">
                  <CheckCircle2 size={16} className="text-teal-600" />
                  Designed for regulated teams
                </span>
              </div>
            </ScrollRevealItem>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1} duration={0.8}>
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-linear-to-br from-teal-300/25 via-transparent to-orange-300/30 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_70px_rgba(15,40,38,0.16)] ring-1 ring-slate-100 sm:p-3">
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <Image
                    src="/customer-support-dashboard.jpg"
                    alt="TechCulture AI customer support dashboard showing ticket conversations, customer context and ticket management"
                    width={1024}
                    height={576}
                    className="h-auto w-full object-cover"
                    sizes="(max-width: 1024px) 95vw, 58vw"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
