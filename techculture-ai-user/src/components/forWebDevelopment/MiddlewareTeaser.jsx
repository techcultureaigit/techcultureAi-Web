"use client";

import Link from "next/link";
import Image from "next/image";
import { Layers, ArrowRight } from "lucide-react";
import { webdevHref } from "../../lib/webdevelopment/paths";
import SpotlightCard, { TEAL_SPOTLIGHT } from "@/components/SpotlightCard";
import ScrollReveal, { ScrollRevealItem } from "@/components/ScrollReveal";

export default function MiddlewareTeaser() {
  return (
    <section className="relative overflow-hidden bg-white/40 py-14 md:py-20 backdrop-blur-[1px]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 right-1/4 h-80 w-80 rounded-full bg-[#FE602F]/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/5 h-64 w-64 rounded-full bg-[#2E3545]/8 blur-[90px]" />
      </div>

      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <ScrollReveal direction="left" delay={0.04} stagger={0.09}>
            <ScrollRevealItem>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 ring-1 ring-teal-100">
                <Layers size={14} />
                Middleware · Central Engine
              </span>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <h2 className="mb-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                Route every request through{" "}
                <span className="section-heading-accent">
                  one intelligent engine
                </span>
              </h2>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <p className="text-slate-500 text-base sm:text-lg leading-relaxed mb-7 max-w-xl">
                From customer eSign to UCC, DP and KRA systems — our middleware
                aggregates responses and delivers a single final status to back
                office.
              </p>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <Link
                href={webdevHref("/middleware")}
                className="brand-cta-gradient inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold"
              >
                Explore Middleware
                <ArrowRight size={18} />
              </Link>
            </ScrollRevealItem>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1} duration={0.8}>
            <SpotlightCard
              spotlightColor={TEAL_SPOTLIGHT}
              className="rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 overflow-hidden"
            >
              <Link href={webdevHref("/middleware")} className="relative block">
                <div className="w-full bg-white p-2 sm:p-3">
                  <Image
                    src="/middleware-central-engine.png"
                    alt="Middleware Central Engine preview"
                    width={2048}
                    height={1364}
                    quality={100}
                    unoptimized
                    className="w-full h-auto object-contain"
                    sizes="(max-width: 1024px) 100vw, 560px"
                  />
                </div>
              </Link>
            </SpotlightCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
