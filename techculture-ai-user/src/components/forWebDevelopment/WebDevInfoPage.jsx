"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Rocket,
  Sparkles,
} from "lucide-react";
import { webdevHref } from "../../lib/webdevelopment/paths";
import SpotlightCard, { TEAL_SPOTLIGHT } from "@/components/SpotlightCard";
import ScrollReveal, { ScrollRevealItem } from "@/components/ScrollReveal";

export default function WebDevInfoPage({
  title,
  summary,
  about,
  highlights = [],
  productHref,
  ctaLabel = "Open product",
  backHref = webdevHref("/"),
  backLabel = "Back to Web Development",
  children,
  relatedLinks = [],
}) {
  return (
    <div className="bg-white text-slate-800 w-full min-w-0">
      <ScrollReveal as="section" direction="up" delay={0.02} duration={0.7} className="relative pt-8 md:pt-12 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0fdfa] via-white to-[#eff6ff] pointer-events-none" />
        <div className="absolute top-8 left-1/4 w-[380px] h-[380px] bg-teal-200/25 rounded-full blur-[100px] pointer-events-none" />

        <div className="container relative">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 text-sm font-semibold mb-6 transition"
          >
            <ArrowLeft size={16} />
            {backLabel}
          </Link>

          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-slate-900 leading-tight max-w-3xl mb-3">
            {title}
          </h1>
          {summary && (
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-2xl">
              {summary}
            </p>
          )}
        </div>
      </ScrollReveal>

      <section className="pb-12 md:pb-16" data-no-auto-reveal>
        <div className="container grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-8 lg:gap-12 items-start">
          <ScrollReveal direction="left" delay={0.05} stagger={0.08}>
            <ScrollRevealItem>
              <h2 className="text-xl font-bold text-slate-900 mb-3">About this</h2>
              <p className="text-slate-600 leading-relaxed text-[15px] sm:text-base whitespace-pre-line mb-8">
                {about}
              </p>
            </ScrollRevealItem>

            {highlights.length > 0 && (
              <ScrollRevealItem>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  What you get
                </h3>
                <ScrollReveal
                  direction="fade"
                  delay={0.04}
                  stagger={0.07}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
                >
                  {highlights.map((item) => (
                    <ScrollRevealItem key={item}>
                      <SpotlightCard
                        spotlightColor={TEAL_SPOTLIGHT}
                        className="flex items-start gap-2.5 rounded-xl border border-teal-100 bg-teal-50/40 px-4 py-3 text-sm text-slate-700 h-full"
                      >
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2
                            size={18}
                            className="text-teal-600 shrink-0 mt-0.5"
                          />
                          <span>{item}</span>
                        </div>
                      </SpotlightCard>
                    </ScrollRevealItem>
                  ))}
                </ScrollReveal>
              </ScrollRevealItem>
            )}

            {children ? <ScrollRevealItem>{children}</ScrollRevealItem> : null}
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1} duration={0.75}>
            <aside className="lg:sticky lg:top-28">
              <SpotlightCard
                spotlightColor={TEAL_SPOTLIGHT}
                className="relative m-[10px] rounded-3xl border border-teal-100/90 bg-white overflow-hidden shadow-[0_18px_50px_rgba(13,148,136,0.12)]"
              >
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 z-[2]" />
                <div className="absolute -top-16 -right-12 w-44 h-44 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-12 w-40 h-40 bg-emerald-200/25 rounded-full blur-3xl pointer-events-none" />

                <div className="relative p-6 sm:p-7">
                  <div className="flex items-start gap-3.5 mb-5">
                    <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/25 shrink-0">
                      <Rocket size={22} strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.12em] uppercase text-teal-700 bg-teal-50 ring-1 ring-teal-100 rounded-full px-2.5 py-1">
                        <Sparkles size={11} />
                        Ready to use
                      </span>
                      <h3 className="text-[19px] font-bold text-slate-900 mt-2 leading-snug">
                        Open the live product
                      </h3>
                    </div>
                  </div>

                  <p className="text-[14px] text-slate-500 leading-relaxed mb-6">
                    This page is an overview. Jump straight into the product or
                    service experience we already ship.
                  </p>

                  <div className="space-y-3">
                    {productHref && (
                      <Link
                        href={productHref}
                        className="brand-cta-gradient group w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-semibold duration-300"
                      >
                        {ctaLabel}
                        <ExternalLink
                          size={16}
                          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </Link>
                    )}

                    <Link
                      href={webdevHref("/contact")}
                      className="brand-cta-outline group w-full flex items-center justify-center gap-2 border font-semibold px-5 py-3.5 rounded-2xl transition-all duration-300"
                    >
                      <MessageCircle size={16} />
                      Talk to us
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </Link>
                  </div>

                  {relatedLinks.length > 0 && (
                    <div className="mt-7 pt-6 border-t border-dashed border-teal-100">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-3">
                        Related
                      </p>
                      <ul className="space-y-1.5">
                        {relatedLinks.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-[14px] font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                            >
                              <span className="flex items-center gap-2.5 min-w-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                                <span className="truncate">{link.name}</span>
                              </span>
                              <ChevronRight
                                size={15}
                                className="text-teal-500 shrink-0 group-hover:translate-x-0.5 transition-transform"
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </SpotlightCard>
            </aside>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
