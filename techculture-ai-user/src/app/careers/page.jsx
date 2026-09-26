"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Eye,
  HeartHandshake,
  Lightbulb,
  MapPin,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import JobApplyModal from "@/components/careers/JobApplyModal";
import JobDescriptionModal from "@/components/careers/JobDescriptionModal";
import { getFeaturedJobs } from "@/lib/careers/jobs";
import { webdevHref } from "@/lib/webdevelopment/paths";

const benefits = [
  {
    title: "Meaningful products",
    description:
      "Build production platforms that simplify complex financial journeys for real businesses and their customers.",
    icon: Rocket,
  },
  {
    title: "Own your work",
    description:
      "Take ideas from discussion to delivery with the trust, context, and support needed to make strong decisions.",
    icon: Lightbulb,
  },
  {
    title: "Grow together",
    description:
      "Learn through thoughtful reviews, close collaboration, and challenges that expand your technical perspective.",
    icon: Users,
  },
  {
    title: "Quality matters",
    description:
      "Work with a team that values secure engineering, maintainable systems, and polished customer experiences.",
    icon: ShieldCheck,
  },
];

const roleIcons = {
  "full-stack-developer": Code2,
  "react-native-developer": Zap,
  "qa-automation-engineer": BriefcaseBusiness,
};

const featuredRoles = getFeaturedJobs(3);

const hiringSteps = [
  {
    number: "01",
    title: "Introduce yourself",
    description: "Send us your profile, work samples, and the role you are interested in.",
  },
  {
    number: "02",
    title: "Meet the team",
    description: "A focused conversation about your experience, goals, and how you approach problems.",
  },
  {
    number: "03",
    title: "Show your craft",
    description: "A practical, role-relevant discussion or task designed to respect your time.",
  },
  {
    number: "04",
    title: "Build with us",
    description: "Align on the opportunity, expectations, and everything you need to get started.",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function CareersPage() {
  const reduceMotion = useReducedMotion();
  const animation = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : reveal;
  const [selectedJob, setSelectedJob] = useState(null);
  const [jdOpen, setJdOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  const openJd = (job) => {
    setSelectedJob(job);
    setJdOpen(true);
    setApplyOpen(false);
  };

  const openApply = (job) => {
    setSelectedJob(job);
    setApplyOpen(true);
    setJdOpen(false);
  };

  return (
    <div className="overflow-hidden bg-white text-[#2E3545]" data-manual-reveal>
      <section className="relative isolate min-h-162.5 overflow-hidden" data-no-auto-reveal>
        <div className="absolute inset-0 -z-30 bg-[#fdfcfb]" />
        <div className="absolute -right-32 -top-24 -z-20 h-150 w-150 rounded-full bg-[#FE602F]/14 blur-[120px]" />
        <div className="absolute -bottom-40 left-[8%] -z-20 h-96 w-96 rounded-full bg-[#2E3545]/8 blur-[110px]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(46,53,69,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(46,53,69,0.035)_1px,transparent_1px)] bg-size-[48px_48px] mask-[linear-gradient(to_bottom,black,transparent_82%)]" />

        <div className="container mx-auto grid min-h-0 items-center gap-8 px-4 py-12 sm:min-h-162.5 sm:gap-14 sm:px-6 sm:py-16 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <motion.div initial="hidden" animate="visible">
            <motion.div
              variants={animation}
              className="mb-7 inline-flex items-center gap-2 rounded-full bg-[#fff0eb] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#d9471b] ring-1 ring-orange-100"
            >
              <BriefcaseBusiness size={14} />
              Careers at TechCulture AI
            </motion.div>

            <motion.h1
              variants={animation}
              className="max-w-3xl text-[2rem] font-semibold leading-[1.1] tracking-[-0.045em] sm:text-4xl md:text-5xl lg:text-[4rem]"
            >
              Do the best work of your career.{" "}
              <span className="text-[#FE602F]">Build what matters.</span>
            </motion.h1>

            <motion.p
              variants={animation}
              className="mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8"
            >
              Join a team of builders creating secure, scalable technology for
              India&apos;s financial ecosystem. Bring your curiosity, own your
              craft, and grow alongside products used in the real world.
            </motion.p>

            <motion.div
              variants={animation}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href="#open-roles"
                className="brand-cta-gradient inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold"
              >
                View open roles
                <ArrowRight size={17} />
              </a>
              <a
                href="mailto:info@techculture.ai?subject=Career%20at%20TechCulture%20AI"
                className="inline-flex items-center gap-2 rounded-full border border-[#2E3545]/20 bg-white px-6 py-3.5 font-semibold text-[#2E3545] shadow-sm transition hover:border-[#FE602F]/50 hover:bg-[#fff5f1] hover:text-[#FE602F]"
              >
                Share your profile
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 36, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-3xl overflow-visible lg:max-w-none lg:justify-self-end"
          >
            <img
              src="/careers-hero.png"
              alt="Build your future with TechCulture AI — join our passionate team"
              className="h-auto w-full -translate-x-[20%] scale-[1.2] object-contain object-center drop-shadow-[0_24px_60px_rgba(46,53,69,0.12)]"
            />
          </motion.div>
        </div>
      </section>

      <section className="bg-[#f7f7f8] py-20 sm:py-24" data-no-auto-reveal>
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FE602F]">
              Why TechCulture
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              A place to learn, own, and make an impact.
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
              We keep teams close to the problem, decisions transparent, and
              every contribution connected to a real customer outcome.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <motion.article
                  key={benefit.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={reduceMotion ? undefined : { y: -6 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.07 }}
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.04)] transition-colors hover:border-[#FE602F]/30"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0eb] text-[#FE602F]">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {benefit.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="open-roles" className="scroll-mt-24 bg-white py-20 sm:py-24" data-no-auto-reveal>
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-9 bg-[#FE602F]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  Open opportunities
                </span>
              </div>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Find your place on the team.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
                We look for thoughtful people who enjoy solving hard problems
                and turning good ideas into dependable products.
              </p>
              <div className="mt-7 flex items-center gap-2 text-sm font-medium text-slate-600">
                <MapPin size={17} className="text-[#FE602F]" />
                India · Full-time opportunities
              </div>
              <Link
                href={webdevHref("/careers/openings")}
                className="brand-cta-gradient mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
              >
                Find more
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {featuredRoles.map((role, index) => {
                const Icon = roleIcons[role.id] || BriefcaseBusiness;

                return (
                  <motion.article
                    key={role.id}
                    initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="group rounded-3xl border border-slate-200 bg-[#fdfcfc] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#FE602F]/35 hover:bg-white hover:shadow-[0_18px_45px_rgba(254,96,47,0.09)] sm:p-6"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2E3545] text-white transition group-hover:bg-[#FE602F]">
                        <Icon size={21} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold">{role.title}</h3>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#FE602F]">
                          {role.stack}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                          {role.summary}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col gap-2 sm:items-stretch">
                        <button
                          type="button"
                          onClick={() => openJd(role)}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2E3545]/15 px-5 py-2.5 text-sm font-semibold transition hover:border-[#2E3545]/35"
                        >
                          <Eye size={15} />
                          View JD
                        </button>
                        <button
                          type="button"
                          onClick={() => openApply(role)}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2E3545]/15 px-5 py-2.5 text-sm font-semibold transition hover:border-[#FE602F] hover:bg-[#FE602F] hover:text-white"
                        >
                          Apply
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}

              <div className="pt-2 text-center sm:text-right">
                <Link
                  href={webdevHref("/careers/openings")}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#FE602F] transition hover:gap-3"
                >
                  View all openings
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#fffaf8] py-20 sm:py-24" data-no-auto-reveal>
        <div className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-[#FE602F]/10 blur-[100px]" />
        <div className="absolute -bottom-48 -left-24 -z-10 h-96 w-96 rounded-full bg-[#2E3545]/6 blur-[110px]" />
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_center,rgba(46,53,69,0.05)_1px,transparent_1px)] bg-size-[26px_26px] opacity-45" />

        <div className="container relative mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FE602F]/20 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FE602F] shadow-sm">
              <Sparkles size={13} />
              How we hire
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-[#2E3545] sm:text-4xl">
              A clear, human hiring process.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Four thoughtful steps designed to understand your craft while
              keeping the experience simple, transparent, and respectful.
            </p>
          </div>

          <div className="relative grid gap-5 md:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-8 hidden h-0.5 bg-linear-to-r from-[#2E3545]/10 via-[#FE602F]/50 to-[#2E3545]/10 md:block" />
            {hiringSteps.map((step, index) => (
              <motion.article
                key={step.number}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={reduceMotion ? undefined : { y: -7 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.09 }}
                className="group relative rounded-3xl border border-slate-200/80 bg-white p-5 text-center shadow-[0_14px_40px_rgba(46,53,69,0.07)] transition-colors hover:border-[#FE602F]/30 sm:p-6"
              >
                <span
                  className={`relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-[#fffaf8] text-sm font-bold text-white shadow-lg transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105 ${
                    index % 2 === 0 ? "bg-[#FE602F]" : "bg-[#2E3545]"
                  }`}
                >
                  {step.number}
                </span>
                <div className="mx-auto mt-5 h-px w-8 bg-[#FE602F]/35 transition-all duration-300 group-hover:w-14" />
                <h3 className="mt-5 text-base font-semibold text-[#2E3545]">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {step.description}
                </p>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="mt-14 flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl border border-[#FE602F]/20 bg-white p-6 shadow-[0_18px_50px_rgba(254,96,47,0.08)] sm:p-8 md:flex-row md:text-left"
          >
            <div className="flex items-center gap-4">
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff0eb] text-[#FE602F] sm:flex">
                <HeartHandshake size={22} />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-[#2E3545]">
                  Your role is not listed?
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  We still want to hear from thoughtful builders.
                </p>
              </div>
            </div>
            <Link
              href={webdevHref("/careers/openings")}
              className="brand-cta-gradient inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 font-semibold"
            >
              Browse all openings
              <ArrowRight size={17} />
            </Link>
          </motion.div>
        </div>
      </section>

      <JobDescriptionModal
        open={jdOpen}
        job={selectedJob}
        onClose={() => setJdOpen(false)}
        onApply={openApply}
      />
      <JobApplyModal
        open={applyOpen}
        job={selectedJob}
        onClose={() => setApplyOpen(false)}
      />
    </div>
  );
}
