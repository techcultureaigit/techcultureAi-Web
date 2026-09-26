"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  FileText,
  Mail,
  Scale,
  Shield,
} from "lucide-react";
import { COMPANY } from "@/lib/company";
import { LEGAL_FOOTER_LINKS } from "@/lib/legal";
import { webdevHref } from "@/lib/webdevelopment/paths";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function slugifyHeading(heading = "") {
  return String(heading)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function LegalDocumentPage({ doc, heroImage }) {
  const reduceMotion = useReducedMotion();
  const animation = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : reveal;
  const [activeId, setActiveId] = useState("");

  const sections = (doc?.sections || []).map((section, index) => ({
    ...section,
    id: slugifyHeading(section.heading) || `section-${index + 1}`,
    number: String(index + 1).padStart(2, "0"),
  }));

  useEffect(() => {
    if (!sections.length) return;

    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.4, 0.7] }
    );

    nodes.forEach((node) => observer.observe(node));
    setActiveId(sections[0].id);

    return () => observer.disconnect();
  }, [doc?.title]);

  if (!doc) return null;

  return (
    <div className="overflow-hidden bg-white text-slate-900">
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-slate-100 bg-[#fdfcfb]">
        <div className="container relative grid items-center gap-4 px-5 py-6 sm:px-6 sm:py-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:py-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: reduceMotion ? 0 : 0.08 },
              },
            }}
            className={`mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-2xl lg:text-left ${
              heroImage ? "" : "lg:col-span-2"
            }`}
          >
            <motion.div
              variants={animation}
              className="inline-flex items-center gap-2 rounded-full border border-[#FE602F]/20 bg-[#fff4f0] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[#FE602F]"
            >
              <Scale size={13} strokeWidth={2.4} />
              Legal
            </motion.div>

            <motion.h1
              variants={animation}
              className="mt-5 text-4xl font-bold tracking-tight text-[#2E3545] sm:text-5xl md:text-[3.25rem] md:leading-[1.1]"
            >
              {doc.title}
            </motion.h1>

            <motion.p
              variants={animation}
              className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg"
            >
              {doc.summary}
            </motion.p>

            <motion.div
              variants={animation}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              {doc.lastUpdated ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600">
                  <FileText size={14} className="text-[#FE602F]" />
                  Updated {doc.lastUpdated}
                </span>
              ) : null}
              <a
                href={`mailto:${COMPANY.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 transition hover:border-[#FE602F]/35 hover:text-[#FE602F]"
              >
                <Mail size={14} />
                {COMPANY.email}
              </a>
            </motion.div>
          </motion.div>

          {heroImage ? (
            <div className="relative mx-auto w-full max-w-[320px] lg:mx-0 lg:max-w-[420px] lg:justify-self-end">
              <Image
                src={heroImage}
                alt={doc.title}
                width={1480}
                height={1062}
                priority
                quality={100}
                unoptimized
                className="h-auto w-full object-contain"
              />
            </div>
          ) : null}
        </div>
      </section>

      {/* Body */}
      <section className="relative bg-[#faf9f7]">
        <div className="container px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[260px_minmax(0,1fr)_220px]">
            {/* On-page TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase">
                  On this page
                </p>
                <nav className="mt-4 space-y-1 border-l border-slate-200">
                  {sections.map((section) => {
                    const isActive = activeId === section.id;
                    return (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className={`block border-l-2 py-2 pl-4 text-sm transition-colors ${
                          isActive
                            ? "-ml-px border-[#FE602F] font-semibold text-[#FE602F]"
                            : "border-transparent text-slate-500 hover:text-[#2E3545]"
                        }`}
                      >
                        {section.heading}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <article className="min-w-0">
              <div className="space-y-5">
                {sections.map((section) => (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={animation}
                    className="scroll-mt-28 rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_10px_40px_-28px_rgba(46,53,69,0.35)] sm:p-8"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff1ec] text-sm font-bold text-[#FE602F]">
                        {section.number}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-semibold tracking-tight text-[#2E3545] sm:text-2xl">
                          {section.heading}
                        </h2>
                        <p className="mt-3 text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8">
                          {section.body}
                        </p>
                      </div>
                    </div>
                  </motion.section>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 overflow-hidden rounded-[28px] border border-[#FE602F]/15 bg-linear-to-br from-[#fff8f5] via-white to-[#f4f6f9] p-6 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FE602F] text-white">
                      <Shield size={18} />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-[#2E3545]">
                        Questions about this policy?
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        Reach our team at {COMPANY.email} — we typically respond
                        within one business day.
                      </p>
                    </div>
                  </div>
                  <Link
                    href={webdevHref("/contact")}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#FE602F] px-5 py-3 text-sm font-semibold text-white! transition hover:bg-[#e5552a]"
                  >
                    Contact us
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>

            {/* Other policies */}
            <aside className="lg:col-span-2 xl:col-span-1">
              <div className="xl:sticky xl:top-28">
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <p className="text-sm font-semibold text-[#2E3545]">
                    Other policies
                  </p>
                  <ul className="mt-4 space-y-1">
                    {LEGAL_FOOTER_LINKS.map((item) => {
                      const isCurrent = item.name === doc.title;
                      return (
                        <li key={item.key}>
                          <Link
                            href={webdevHref(item.href)}
                            className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                              isCurrent
                                ? "bg-[#fff1ec] font-semibold text-[#FE602F]"
                                : "text-slate-600 hover:bg-slate-50 hover:text-[#2E3545]"
                            }`}
                          >
                            {item.name}
                            {!isCurrent ? (
                              <ArrowRight size={14} className="opacity-40" />
                            ) : null}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
