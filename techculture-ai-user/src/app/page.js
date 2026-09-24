"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  Clock3,
  Cloud,
  Globe2,
  Settings2,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";
import { useBookDemo } from "@/context/BookDemoContext";
import { webdevHref } from "@/lib/webdevelopment/paths";
import ScrollReveal from "@/components/ScrollReveal";
import {
  AiBrainIcon,
  AiSparkCluster,
} from "@/components/forWebDevelopment/AnimatedAiIcons";
import Partners from "@/components/forWebDevelopment/Partners";
import Testimonials from "@/components/forWebDevelopment/Testimonials";
import TechnologyStackSection from "@/components/forWebDevelopment/TechnologyStackSection";

const HERO_VIDEOS = ["/heroVideo1.mp4", "/heroVideo2.mp4"];

const highlightStats = [
  { end: 1000, suffix: "+", label: "Projects Delivered", Icon: Users },
  { end: 25, suffix: "+", label: "Years Experience", Icon: Clock3 },
  { end: 97, suffix: "%", label: "Client Retention", Icon: Award },
  { end: 100, suffix: "%", label: "Global Reach", Icon: Globe2 },
];

function StatCounter({ end, suffix = "", duration = 1.8 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(end);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(end * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, end, duration, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

const buildOfferings = [
  {
    title: "AI & Machine Learning",
    description: "Intelligent automation, models and AI-powered product experiences.",
    Icon: Brain,
    href: webdevHref("/products"),
  },
  {
    title: "Cloud & DevOps",
    description: "Reliable cloud infrastructure, CI/CD and scalable deployments.",
    Icon: Cloud,
    href: webdevHref("/middleware"),
  },
  {
    title: "Mobile & Web Applications",
    description: "High-performing apps and websites for iOS, Android and the web.",
    Icon: Smartphone,
    href: webdevHref("/mobile-applications"),
  },
  {
    title: "Custom Software Development",
    description: "Tailored platforms engineered around your exact workflows.",
    Icon: Settings2,
    href: webdevHref("/custom-saas"),
  },
  {
    title: "Enterprise Solutions",
    description: "Secure, compliant systems for government and private enterprises.",
    Icon: ShieldCheck,
    href: webdevHref("/banking-fintech"),
  },
  {
    title: "Business Intelligence & Analytics",
    description: "Dashboards and insights that turn data into clear decisions.",
    Icon: BarChart3,
    href: webdevHref("/tracking"),
  },
];

const ease = [0.22, 1, 0.36, 1];

const HERO_HEADLINE = "A software company building intelligent products that scale";
const HERO_HIGHLIGHT = "intelligent products";
const HERO_HIGHLIGHT_START = HERO_HEADLINE.indexOf(HERO_HIGHLIGHT);
const HERO_HIGHLIGHT_END = HERO_HIGHLIGHT_START + HERO_HIGHLIGHT.length;

function TypedHeroHeadline({ className }) {
  const reduceMotion = useReducedMotion();
  const [charCount, setCharCount] = useState(
    reduceMotion ? HERO_HEADLINE.length : 0,
  );

  useEffect(() => {
    if (reduceMotion) {
      setCharCount(HERO_HEADLINE.length);
      return;
    }

    setCharCount(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCharCount(i);
      if (i >= HERO_HEADLINE.length) clearInterval(id);
    }, 38);

    return () => clearInterval(id);
  }, [reduceMotion]);

  const before = HERO_HEADLINE.slice(
    0,
    Math.min(charCount, HERO_HIGHLIGHT_START),
  );
  const highlight = HERO_HEADLINE.slice(
    HERO_HIGHLIGHT_START,
    Math.min(charCount, HERO_HIGHLIGHT_END),
  );
  const after =
    charCount > HERO_HIGHLIGHT_END
      ? HERO_HEADLINE.slice(HERO_HIGHLIGHT_END, charCount)
      : "";
  const done = charCount >= HERO_HEADLINE.length;

  return (
    <h1 className={className} aria-label={HERO_HEADLINE}>
      {before}
      {highlight ? (
        <span className="text-[#FE602F]!">{highlight}</span>
      ) : null}
      {after}
      <span
        aria-hidden
        className={`ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-[0.08em] bg-[#FE602F] align-baseline ${
          done ? "animate-pulse opacity-70" : "opacity-100"
        }`}
      />
    </h1>
  );
}

function HeroVideoBackground() {
  const [active, setActive] = useState(0);
  const videoRefs = useRef([]);

  useEffect(() => {
    const video = videoRefs.current[active];
    if (!video) return;

    videoRefs.current.forEach((el, i) => {
      if (!el || i === active) return;
      el.pause();
      el.currentTime = 0;
    });

    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise?.catch) playPromise.catch(() => {});
  }, [active]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {HERO_VIDEOS.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            videoRefs.current[i] = el;
          }}
          src={src}
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          onEnded={() => setActive((prev) => (prev + 1) % HERO_VIDEOS.length)}
        />
      ))}
      <div className="absolute inset-0 bg-linear-to-r from-black from-0% via-black/95 via-[15%] to-transparent to-[72%]" />
    </div>
  );
}

export default function HomePage() {
  const { openBookDemo } = useBookDemo();
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative flex min-h-[calc(100vh-5rem)] flex-col justify-center px-5 pb-20 pt-10 sm:px-8 lg:px-10 xl:px-20">
        <HeroVideoBackground />

        <div className="relative z-10 mr-auto w-full max-w-2xl lg:max-w-3xl [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">
            <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur-md"
          >
            <AiBrainIcon size={26} />
            <span className="text-xs font-semibold tracking-wide text-white/90 uppercase">
              AI-powered software studio
            </span>
          </motion.div>

          <div className="relative">
            <AiSparkCluster className="-right-4 -top-6 hidden sm:block" />
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease }}
              className="text-2xl font-bold tracking-tight text-white! sm:text-3xl"
            >
              TechCulture AI
            </motion.p>
          </div>

          <TypedHeroHeadline className="mt-5 max-w-3xl text-3xl font-semibold leading-[1.15] tracking-tight text-white! sm:text-4xl lg:text-5xl" />

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease }}
            className="mt-5 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg"
          >
            We design and develop websites, mobile apps and custom software for
            government and private organizations — from idea to production.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.26, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              href={webdevHref("/banking-fintech")}
              className="inline-flex items-center gap-2 rounded-full bg-[#FE602F] px-6 py-3 text-sm font-semibold text-white! transition hover:bg-[#e55528] hover:scale-[1.03] active:scale-[0.98]"
            >
              Explore Banking & Fintech
              <ArrowRight size={16} />
            </Link>
            <button
              type="button"
              onClick={openBookDemo}
              className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/10 px-6 py-3 text-sm font-semibold text-white! backdrop-blur-sm transition hover:bg-white/20 hover:scale-[1.03] active:scale-[0.98]"
            >
              Book a demo
            </button>
          </motion.div>
        </div>
      </section>

      <ScrollReveal direction="fade" delay={0.04} duration={0.7}>
        <section id="clients" className="scroll-mt-24">
          <Partners />
        </section>
      </ScrollReveal>

      {/* Who we are */}
      <section className="relative z-10 w-full overflow-hidden bg-white px-4 py-0 sm:px-6 md:px-8 lg:px-10 xl:px-14 2xl:px-20">
        <div className="pointer-events-none absolute -left-10 top-16 h-40 w-40 rounded-full border border-[#FE602F]/20" />
        <div className="pointer-events-none absolute left-24 top-28 h-2 w-2 rounded-full bg-[#FE602F]/50" />
        <div className="pointer-events-none absolute right-[38%] bottom-16 h-28 w-28 rounded-full border border-[#FE602F]/15" />

        <div className="relative z-10 grid w-full items-center gap-6 md:gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
          <ScrollReveal direction="left" delay={0.04} duration={0.75} className="w-full min-w-0">
            <p className="flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] text-[#FE602F] uppercase sm:text-xs">
              <span className="h-px w-4 bg-[#FE602F] sm:w-5" />
              Who we are
            </p>
            <h2 className="mt-2 text-[28px] font-bold tracking-tight text-[#2E3545]! sm:text-4xl md:text-[40px] lg:text-[42px] xl:text-5xl lg:leading-tight">
              We are a full-stack{" "}
              <span className="text-[#FE602F]!">software company</span>
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#667085] sm:text-[15px] md:text-base">
              TechCulture AI builds intelligent, scalable digital solutions for
              every kind of organization — from citizen portals and banking
              products to enterprise tools and consumer apps.
            </p>

            <div className="mt-5 grid w-full grid-cols-2 gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-4">
              {highlightStats.map((item) => {
                const Icon = item.Icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-[#eceae6] bg-white px-3 py-4 text-center shadow-[0_8px_24px_rgba(46,53,69,0.05)] sm:px-4 sm:py-5"
                  >
                    <span className="mx-auto mb-2 inline-flex text-[#FE602F]">
                      <Icon size={22} strokeWidth={2} />
                    </span>
                    <p className="text-2xl font-bold tracking-tight text-[#2E3545]! sm:text-3xl">
                      <StatCounter end={item.end} suffix={item.suffix} />
                    </p>
                    <p className="mt-1 text-[11px] leading-snug font-medium text-[#667085] sm:text-xs">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1} duration={0.75} className="w-full min-w-0">
            <div className="relative w-full">
              <div className="pointer-events-none absolute -top-6 -left-4 hidden h-24 w-24 rounded-full border border-[#FE602F]/25 sm:block" />
              <div className="pointer-events-none absolute -right-3 top-10 hidden h-16 w-16 rounded-full border border-[#FE602F]/20 sm:block" />
              <div className="pointer-events-none absolute -bottom-4 left-10 hidden h-20 w-20 rounded-full border border-[#FE602F]/15 sm:block" />

              <div className="relative w-full overflow-hidden rounded-2xl bg-transparent sm:rounded-[28px]">
                <Image
                  src="/whoweare.png"
                  alt="TechCulture team collaborating"
                  width={1376}
                  height={768}
                  className="h-auto w-full object-contain object-center"
                  sizes="100vw"
                  priority
                />
              </div>

              <div className="absolute top-2 left-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/80 text-[#FE602F] shadow-lg backdrop-blur-md sm:left-6 sm:h-12 sm:w-12 sm:rounded-2xl">
                <Brain size={18} strokeWidth={2} className="sm:h-5 sm:w-5" />
              </div>
              <div className="absolute top-6 -right-1 flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/80 text-[#FE602F] shadow-lg backdrop-blur-md sm:top-8 sm:-right-3 sm:h-12 sm:w-12 sm:rounded-2xl">
                <BarChart3 size={18} strokeWidth={2} className="sm:h-5 sm:w-5" />
              </div>
              <div className="absolute bottom-2 right-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/80 text-[#FE602F] shadow-lg backdrop-blur-md sm:right-10 sm:h-12 sm:w-12 sm:rounded-2xl">
                <Globe2 size={18} strokeWidth={2} className="sm:h-5 sm:w-5" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <TechnologyStackSection />

      {/* What we build */}
      <section className="relative z-10 w-full overflow-hidden bg-white px-4 py-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 2xl:px-20">
        <div className="pointer-events-none absolute right-10 top-12 h-32 w-32 rounded-full border border-[#FE602F]/15" />
        <div className="pointer-events-none absolute bottom-10 left-[20%] h-2 w-2 rounded-full bg-[#FE602F]/40" />
        <div className="pointer-events-none absolute top-1/3 left-[8%] h-64 w-64 rounded-full bg-[#FE602F]/5 blur-3xl" />

        <div className="relative z-10 grid w-full items-center gap-6 md:gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 xl:gap-12">
          <ScrollReveal direction="left" delay={0.04} duration={0.7} className="w-full min-w-0 py-2">
            <p className="flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] text-[#FE602F] uppercase sm:text-xs">
              <span className="h-px w-4 bg-[#FE602F] sm:w-5" />
              What we build
            </p>
            <h2 className="mt-2 text-[28px] font-bold tracking-tight text-[#2E3545]! sm:text-4xl md:text-[40px] lg:text-[42px] xl:text-5xl lg:leading-tight">
              Turning ideas into{" "}
              <span className="text-[#FE602F]!">powerful digital solutions</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#667085] sm:text-[15px] md:text-base">
              From discovery to deployment, we design, engineer and scale
              products that feel clear, secure and ready for real users.
            </p>
          </ScrollReveal>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1, delayChildren: 0.08 },
              },
            }}
            className="grid w-full min-w-0 grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3"
          >
            {buildOfferings.map((item, index) => {
              const Icon = item.Icon;
              return (
                <motion.div
                  key={item.title}
                  variants={
                    reduceMotion
                      ? undefined
                      : {
                          hidden: {
                            opacity: 0,
                            y: 36,
                            scale: 0.92,
                            rotateX: 8,
                          },
                          visible: {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            rotateX: 0,
                            transition: {
                              duration: 0.55,
                              ease: [0.22, 1, 0.36, 1],
                            },
                          },
                        }
                  }
                  style={{ transformPerspective: 900 }}
                  className="h-full"
                >
                  <motion.div
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            y: -10,
                            scale: 1.03,
                            transition: {
                              type: "spring",
                              stiffness: 320,
                              damping: 18,
                            },
                          }
                    }
                    className="h-full"
                  >
                    <Link
                      href={item.href}
                      className="group relative flex h-full min-h-[160px] flex-col overflow-hidden rounded-2xl border border-[#eceae6] bg-white p-4 shadow-[0_8px_24px_rgba(46,53,69,0.04)] sm:min-h-[172px] sm:p-5"
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#FE602F]/0 blur-2xl transition duration-500 group-hover:bg-[#FE602F]/20"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-[#FE602F] to-[#e55528] transition duration-500 group-hover:scale-x-100"
                      />

                      <motion.span
                        className="relative mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0eb] text-[#FE602F] sm:mb-4 sm:h-11 sm:w-11"
                        animate={
                          reduceMotion
                            ? undefined
                            : {
                                y: [0, -3, 0],
                              }
                        }
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.18,
                        }}
                        whileHover={
                          reduceMotion
                            ? undefined
                            : { rotate: [0, -8, 8, 0], scale: 1.12 }
                        }
                      >
                        <Icon size={20} strokeWidth={2} />
                      </motion.span>

                      <h3 className="relative text-[14px] font-bold leading-snug text-[#2E3545]! transition group-hover:text-[#FE602F]! sm:text-[15px]">
                        {item.title}
                      </h3>
                      <p className="relative mt-2 flex-1 text-[12px] leading-relaxed text-[#667085] sm:text-[12.5px]">
                        {item.description}
                      </p>
                      <span className="relative mt-3 inline-flex items-center gap-1 text-[#FE602F] transition duration-300 group-hover:gap-2.5 sm:mt-4">
                        <ArrowRight size={15} className="sm:h-4 sm:w-4" />
                      </span>
                    </Link>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <ScrollReveal direction="up" delay={0.05} duration={0.75}>
        <section id="testimonials" className="scroll-mt-24">
          <Testimonials />
        </section>
      </ScrollReveal>

      {/* CTA */}
      <section className="relative z-10 overflow-hidden bg-white px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <ScrollReveal
          direction="scale"
          delay={0.04}
          duration={0.7}
          className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 overflow-hidden rounded-3xl border border-[#e8e6e1] bg-linear-to-br from-[#2E3545] to-[#1a1f2a] px-8 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-12 sm:py-12"
        >
          <div className="pointer-events-none absolute -right-6 -top-6 opacity-80" aria-hidden>
            <AiBrainIcon size={96} />
          </div>
          <AiSparkCluster className="right-16 bottom-8 hidden sm:block" />

          <div className="relative max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight text-white! sm:text-3xl">
              Have a software idea? Let&apos;s build it together.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-white/70">
              Tell us what you need — a website, a mobile app, or a complete
              custom platform. We&apos;ll help you shape it and ship it.
            </p>
          </div>
          <div className="relative flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openBookDemo}
              className="inline-flex items-center gap-2 rounded-full bg-[#FE602F] px-6 py-3 text-sm font-semibold text-white! transition hover:bg-[#e55528] hover:scale-[1.03] active:scale-[0.98]"
            >
              Book a demo
              <ArrowRight size={16} />
            </button>
            <Link
              href={webdevHref("/contact")}
              className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/5 px-6 py-3 text-sm font-semibold text-white! transition hover:bg-white/15 hover:scale-[1.03] active:scale-[0.98]"
            >
              Contact us
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
