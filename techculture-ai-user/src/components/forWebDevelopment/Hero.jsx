"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import SpotlightCard, { TEAL_SPOTLIGHT, BRAND_SPOTLIGHT } from "@/components/SpotlightCard";
import { useBookDemo } from "@/context/BookDemoContext";

const HERO_FLOW_SLIDES = [
  {
    src: "/hero-flow-01-create-account.png",
    alt: "Create your account — open demat account in minutes",
  },
  {
    src: "/hero-flow-02-digilocker.png",
    alt: "Connect with DigiLocker to fetch KYC documents",
  },
  {
    src: "/hero-flow-03-liveness.png",
    alt: "Selfie with liveness check and geo tagging",
  },
  {
    src: "/hero-flow-04-bank-verification.png",
    alt: "Bank verification with UPI Intent and Collect",
  },
  {
    src: "/hero-flow-05-esign.png",
    alt: "eSign application documents with Aadhaar eSign",
  },
  {
    src: "/hero-flow-06-success.png",
    alt: "Demat account opened successfully",
  },
];

const FLOW_SLIDE_MS = 2800;

function useCarouselSpread() {
  const [spread, setSpread] = useState({ near: 72, far: 100 });

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 640) setSpread({ near: 64, far: 88 });
      else if (w < 1024) setSpread({ near: 68, far: 94 });
      else if (w < 1280) setSpread({ near: 52, far: 76 });
      else if (w < 1536) setSpread({ near: 64, far: 90 });
      else setSpread({ near: 72, far: 104 });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return spread;
}

const GradientText = dynamic(() => import("@/components/GradientText"), {
  ssr: false,
  loading: () => (
    <span className="bg-linear-to-r from-[#2E3545] via-[#FE602F] to-[#2E3545] bg-clip-text text-transparent">
      Digital Solutions Built for Financial Growth
    </span>
  ),
});

const features = [
  {
    title: "Secure by Design",
    desc: "Bank-grade security built into every layer of our solutions",
    bg: "from-emerald-50 to-teal-50",
    ring: "ring-emerald-100",
    hover: "hover:bg-emerald-50/60",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Scalable Architecture",
    desc: "Built to grow with your business from startup to enterprise",
    bg: "from-orange-50 to-amber-50",
    ring: "ring-orange-100",
    hover: "hover:bg-orange-50/60",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Intelligent Solutions",
    desc: "AI-powered insights for smarter decision making",
    bg: "from-sky-50 to-blue-50",
    ring: "ring-sky-100",
    hover: "hover:bg-sky-50/60",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2">
        <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
        <path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75L19 15z" />
      </svg>
    ),
  },
  {
    title: "Faster Innovation",
    desc: "Accelerate digital transformation with proven frameworks",
    bg: "from-violet-50 to-purple-50",
    ring: "ring-violet-100",
    hover: "hover:bg-violet-50/60",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function HeroFlowShowcase({ reduceMotion }) {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const spread = useCarouselSpread();

  useEffect(() => {
    if (reduceMotion || paused) return undefined;

    const timer = window.setTimeout(() => {
      setStep((prev) => (prev + 1) % HERO_FLOW_SLIDES.length);
    }, FLOW_SLIDE_MS);

    return () => window.clearTimeout(timer);
  }, [step, paused, reduceMotion]);

  return (
    <div
      className="relative mx-auto w-full max-w-[17rem] sm:max-w-xs lg:max-w-[15.5rem] xl:max-w-md 2xl:max-w-lg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative flex min-h-[28rem] items-center justify-center overflow-visible sm:min-h-[32rem] lg:min-h-[30rem] xl:min-h-[36rem]"
        style={{ perspective: "1400px" }}
      >
        <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
          {HERO_FLOW_SLIDES.map((slide, index) => {
            const offset = index - step;
            const absOffset = Math.abs(offset);
            if (absOffset > 2) return null;

            const isCenter = offset === 0;
            const shiftX = offset * (absOffset >= 2 ? spread.far : spread.near);

            return (
              <button
                key={slide.src}
                type="button"
                aria-label={slide.alt}
                aria-current={isCenter ? "true" : undefined}
                onClick={() => setStep(index)}
                className="absolute left-1/2 top-1/2 origin-center cursor-pointer border-0 bg-transparent p-0 outline-none transition-all duration-500 ease-out focus-visible:ring-2 focus-visible:ring-[#FE602F]/50 focus-visible:ring-offset-2"
                style={{
                  zIndex: 40 - absOffset,
                  opacity: isCenter ? 1 : Math.max(0.42, 1 - absOffset * 0.28),
                  filter: isCenter
                    ? "none"
                    : `brightness(${1 - absOffset * 0.08})`,
                  transform: `
                    translate(-50%, -50%)
                    translateX(${shiftX}px)
                    scale(${isCenter ? 1 : 1 - absOffset * 0.15})
                    rotateY(${offset * -20}deg)
                    translateZ(${-absOffset * 110}px)
                  `,
                  transformStyle: "preserve-3d",
                }}
              >
                <span
                  className={`relative block bg-transparent transition-shadow duration-500 ${
                    isCenter
                      ? "drop-shadow-[0_22px_40px_rgba(46,53,69,0.22)]"
                      : "drop-shadow-[0_10px_24px_rgba(46,53,69,0.12)]"
                  }`}
                >
                  <img
                    src={slide.src}
                    alt=""
                    className="pointer-events-none h-auto w-[11.5rem] max-w-none select-none bg-transparent object-contain sm:w-[13rem] lg:w-[12.25rem] xl:w-[14.5rem] 2xl:w-[16.25rem]"
                    draggable={false}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="mt-4 flex items-center justify-center gap-1.5"
        role="tablist"
        aria-label="Hero product flow"
      >
        {HERO_FLOW_SLIDES.map((slide, index) => {
          const isActive = index === step;
          return (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Step ${index + 1}: ${slide.alt}`}
              onClick={() => setStep(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isActive ? "w-6 bg-[#FE602F]" : "w-1.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function Hero() {
  const { openBookDemo } = useBookDemo();
  const reduceMotion = useReducedMotion();

  const reveal = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        },
      };

  const stagger = reduceMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.1, delayChildren: 0.08 },
        },
      };

  return (
    <section className="hero-flow-section relative overflow-x-clip overflow-y-visible bg-transparent">
      <div className="relative z-10 mx-auto w-[min(100%,1800px)] px-5 pb-10 pt-6 sm:px-8 sm:pb-12 sm:pt-8 md:px-10 lg:px-14 lg:pt-10 xl:px-20 2xl:px-24">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 xl:grid-cols-2 xl:gap-14">
          <motion.div
            className="relative z-10 min-w-0 text-center lg:pr-6 lg:text-left xl:pr-10"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.h1
              variants={reveal}
              className="-mt-1 mb-4 text-4xl font-bold leading-[1.12] tracking-tight sm:mb-5 sm:text-5xl lg:-mt-2 lg:text-[3.4rem]"
            >
              <GradientText
                colors={["#2E3545", "#FE602F", "#FF7A4D", "#FE602F", "#2E3545"]}
                animationSpeed={4}
                showBorder={false}
                className="hero-gradient-heading"
              >
                Digital Solutions Built for Financial Growth
              </GradientText>
            </motion.h1>

            <motion.p
              variants={reveal}
              className="mx-auto mb-6 max-w-xl text-base leading-relaxed text-slate-600 sm:mb-7 sm:text-lg lg:mx-0"
            >
              We build secure, scalable, and intelligent digital platforms
              across the complete client lifecycle. With nine production-grade
              services spanning eKYC, onboarding, E-IPO, MFD, and closure, we
              empower financial institutions to grow, innovate, and lead with
              confidence — trusted by 25+ brokers.
            </motion.p>

            <motion.div
              variants={reveal}
              className="mb-6 flex flex-col items-center justify-center gap-3 sm:mb-7 sm:flex-row sm:gap-4 lg:justify-start"
            >
              <a
                href="#overview"
                className="hero-cta-gradient inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#2E3545]/20 transition hover:brightness-105"
              >
                Explore Solutions
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <button
                type="button"
                onClick={openBookDemo}
                className="hero-cta-demo group inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 font-semibold"
              >
                <span className="hero-cta-demo__icon flex h-7 w-7 items-center justify-center rounded-full">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                Book a Demo
              </button>
            </motion.div>

            <motion.div
              variants={reveal}
              className="grid grid-cols-1 gap-2.5 text-left sm:grid-cols-2 sm:gap-3"
            >
              {features.map((f, i) => (
                <SpotlightCard
                  key={f.title}
                  spotlightColor={i % 2 === 0 ? TEAL_SPOTLIGHT : BRAND_SPOTLIGHT}
                  className={`dash-card-enter dash-card-enter-${i + 1} group rounded-xl border border-slate-200/80 bg-white/85 p-3 shadow-[0_4px_16px_rgba(46,53,69,0.05)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md ${f.hover}`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${f.bg} ${f.ring} ring-1 shadow-sm transition-transform duration-300 group-hover:scale-105`}
                    >
                      {f.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="mb-0.5 text-[13px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-teal-700">
                        {f.title}
                      </h3>
                      <p className="text-[11px] leading-snug text-slate-500 sm:text-[12px]">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="relative z-0 min-w-0 overflow-hidden xl:overflow-visible xl:pl-4"
            initial={reduceMotion ? false : { opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroFlowShowcase reduceMotion={reduceMotion} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
