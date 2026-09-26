"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useBookDemo } from "@/context/BookDemoContext";
import { webdevHref } from "@/lib/webdevelopment/paths";
import ScrollReveal, { ScrollRevealItem } from "@/components/ScrollReveal";
import SpotlightCard, { BRAND_SPOTLIGHT } from "@/components/SpotlightCard";

const ease = [0.22, 1, 0.36, 1];

function AnimatedFeatureIcon({ icon: Icon, delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="relative mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0eb] text-[#FE602F] ring-1 ring-[#FE602F]/20"
      animate={
        reduce
          ? undefined
          : { y: [0, -3, 0], scale: [1, 1.06, 1] }
      }
      transition={{
        duration: 2.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <Icon size={18} strokeWidth={2.1} />
    </motion.span>
  );
}

function HeroPlaceholder({ Icon, title }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-[28px] bg-linear-to-br from-[#2E3545] via-[#3d4558] to-[#FE602F] sm:max-w-lg lg:max-w-xl">
      <motion.div
        className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-[#FE602F]/35 blur-3xl"
        animate={reduce ? undefined : { x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-8 bottom-6 h-44 w-44 rounded-full bg-white/10 blur-3xl"
        animate={reduce ? undefined : { x: [0, -20, 0], y: [0, -16, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <motion.span
          className="grid h-20 w-20 place-items-center rounded-3xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm"
          animate={reduce ? undefined : { rotate: [0, 4, -4, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon size={36} strokeWidth={1.8} />
        </motion.span>
        <p className="max-w-xs text-sm font-medium text-white/80">
          {title} visual coming soon — hero image will appear here.
        </p>
      </div>
    </div>
  );
}

/**
 * Shared layout for offering pages (E-Commerce, Websites, Mobile, SaaS).
 * Pass heroImage later when available — until then a branded animated placeholder is shown.
 */
export default function ServiceOfferingPage({
  eyebrow = "What we build",
  title,
  summary,
  about,
  heroFeatures = [],
  offerings = [],
  outcomes = [],
  heroImage,
  heroAlt,
  Icon,
}) {
  const { openBookDemo } = useBookDemo();
  const reduce = useReducedMotion();

  return (
    <div className="min-w-0 w-full bg-white text-slate-800">
      <section className="relative overflow-hidden bg-[#FDFCFB] pt-6 pb-10 sm:pt-8 sm:pb-12 md:pt-10 md:pb-16">
        {/* Matches hero GIF cream + soft peach washes */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#fff7f3] via-[#FDFCFB] to-[#FDFCFB]" />
        <div className="pointer-events-none absolute top-1/4 right-[8%] h-[420px] w-[420px] rounded-full bg-[#FDECE2]/90 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-[35%] h-64 w-64 rounded-full bg-[#FDECE2]/70 blur-3xl" />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#FE602F]/10 blur-3xl"
          animate={reduce ? undefined : { x: [0, 40, 0], y: [0, 24, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container relative">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
            <div>
              <p className="mb-2 text-sm font-semibold tracking-wide text-[#FE602F]">
                {eyebrow}
              </p>

              <motion.h1
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease }}
                className="mb-3 text-[28px] leading-tight font-bold text-[#2E3545]! sm:text-[34px] md:text-[42px] lg:text-[46px]"
              >
                {title}
              </motion.h1>

              <p className="mb-4 max-w-xl text-[16px] font-semibold text-[#FE602F] sm:text-[17px]">
                {summary}
              </p>

              <p className="mb-8 max-w-xl text-[14.5px] leading-relaxed text-slate-500 sm:text-[15px]">
                {about}
              </p>

              <div className="mb-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={openBookDemo}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FE602F] px-5 py-2.5 text-sm font-semibold text-white! transition hover:bg-[#e55528] sm:w-auto"
                >
                  Book a demo
                  <ArrowRight size={15} />
                </button>
                <Link
                  href={webdevHref("/contact")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#2E3545]/20 px-5 py-2.5 text-sm font-semibold text-[#2E3545]! transition hover:border-[#FE602F] hover:text-[#FE602F]! sm:w-auto"
                >
                  Contact us
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {heroFeatures.map((item, i) => {
                  const FeatureIcon = item.icon;
                  return (
                    <div key={item.title} className="min-w-0">
                      <AnimatedFeatureIcon icon={FeatureIcon} delay={i * 0.15} />
                      <p className="mb-0.5 text-[12.5px] leading-snug font-bold text-[#2E3545]!">
                        {item.title}
                      </p>
                      <p className="text-[11px] leading-snug text-slate-500">
                        {item.subtitle}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-sm overflow-hidden sm:max-w-md sm:overflow-visible md:max-w-lg lg:max-w-xl">
              {heroImage ? (
                <div
                  className="origin-center scale-100 sm:scale-[1.05] lg:scale-[1.1] [mask-image:linear-gradient(to_right,transparent_0%,#000_10%,#000_90%,transparent_100%),linear-gradient(to_bottom,transparent_0%,#000_10%,#000_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_10%,#000_90%,transparent_100%),linear-gradient(to_bottom,transparent_0%,#000_10%,#000_90%,transparent_100%)] [mask-composite:intersect] [-webkit-mask-composite:source-in] [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat] [mask-size:100%_100%] [-webkit-mask-size:100%_100%]"
                >
                  <Image
                    src={heroImage}
                    alt={heroAlt || title}
                    width={720}
                    height={594}
                    priority
                    unoptimized={/\.gif($|\?)/i.test(heroImage)}
                    className="h-auto w-full object-contain object-center mix-blend-multiply"
                    sizes="(max-width: 1024px) 90vw, 480px"
                  />
                </div>
              ) : (
                <HeroPlaceholder Icon={Icon} title={title} />
              )}
            </div>
          </div>
        </div>
      </section>

      <ScrollReveal as="section" direction="up" delay={0.04} duration={0.7} className="pb-14 md:pb-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-[28px] border border-orange-100/80 bg-linear-to-br from-[#fff8f5] via-[#faf9f6] to-white p-6 sm:p-8 md:p-10">
            <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[#FE602F]/10 blur-3xl" />
            <h2 className="relative mb-6 text-[24px] font-bold text-[#2E3545]! sm:text-[28px] md:mb-8">
              What you get
            </h2>

            <ScrollReveal
              direction="up"
              delay={0.05}
              stagger={0.08}
              className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {offerings.map((card) => {
                const CardIcon = card.icon;
                return (
                  <ScrollRevealItem key={card.title} direction="scale">
                    <SpotlightCard
                      spotlightColor={BRAND_SPOTLIGHT}
                      className="group h-full rounded-2xl border border-orange-100/80 bg-white px-5 py-7 text-center shadow-[0_4px_18px_rgba(254,96,47,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#FE602F]/40 hover:shadow-[0_14px_32px_rgba(254,96,47,0.12)]"
                    >
                      <div className="flex h-full flex-col items-center">
                        <motion.span
                          className="mb-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#fff0eb] text-[#FE602F]"
                          whileHover={reduce ? undefined : { scale: 1.08, rotate: -4 }}
                        >
                          <CardIcon size={24} strokeWidth={1.9} />
                        </motion.span>
                        <h3 className="mb-2.5 text-[14px] leading-snug font-bold text-[#2E3545]!">
                          {card.title}
                        </h3>
                        <p className="text-[12.5px] leading-[1.7] text-slate-500">
                          {card.desc}
                        </p>
                      </div>
                    </SpotlightCard>
                  </ScrollRevealItem>
                );
              })}
            </ScrollReveal>
          </div>
        </div>
      </ScrollReveal>

      {outcomes.length > 0 && (
        <ScrollReveal as="section" direction="up" delay={0.04} duration={0.65} className="pb-16 md:pb-20">
          <div className="container">
            <div className="rounded-[28px] bg-[#2E3545] px-6 py-8 sm:px-10 sm:py-10">
              <h2 className="mb-6 text-[22px] font-bold text-white! sm:text-[26px]">
                Built for real outcomes
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {outcomes.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={reduce ? false : { opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.08 * i, duration: 0.4, ease }}
                    className="flex items-start gap-3 text-sm text-white/85"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-[#FE602F]"
                    />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
