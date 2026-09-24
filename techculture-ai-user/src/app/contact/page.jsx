"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";
import { useBookDemo } from "@/context/BookDemoContext";
import { fetchPublicFaqs } from "@/lib/faqApi";
import { COMPANY } from "@/lib/company";
import ScrollReveal, { ScrollRevealItem } from "@/components/ScrollReveal";
import SpotlightCard, { BRAND_SPOTLIGHT } from "@/components/SpotlightCard";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#2E3545] placeholder:text-slate-400 outline-none transition focus:border-[#FE602F]/55 focus:ring-4 focus:ring-[#FE602F]/10";

const contactCards = [
  {
    label: "Email",
    value: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
    icon: Mail,
    tone: "bg-[#fff0eb] text-[#FE602F] ring-orange-100",
  },
  {
    label: "Phone",
    value: COMPANY.phone,
    href: `tel:${COMPANY.phoneTel}`,
    icon: Phone,
    tone: "bg-slate-100 text-[#2E3545] ring-slate-200",
  },
  {
    label: "Corporate Office",
    value: "Corenthum, Sector-62, Noida",
    href: null,
    icon: MapPin,
    tone: "bg-[#fff0eb] text-[#FE602F] ring-orange-100",
  },
  {
    label: "Response",
    value: "Within 1 business day",
    href: null,
    icon: Clock3,
    tone: "bg-slate-100 text-[#2E3545] ring-slate-200",
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

export default function ContactPage() {
  const { openBookDemo } = useBookDemo();
  const reduceMotion = useReducedMotion();
  const animation = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : reveal;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitOk, setSubmitOk] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [faqLoading, setFaqLoading] = useState(true);
  const [openFaqId, setOpenFaqId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadFaqs() {
      setFaqLoading(true);
      try {
        const data = await fetchPublicFaqs();
        if (!cancelled) {
          setFaqs(data);
          if (data[0]) setOpenFaqId(data[0].id || data[0]._id);
        }
      } catch {
        if (!cancelled) setFaqs([]);
      } finally {
        if (!cancelled) setFaqLoading(false);
      }
    }
    loadFaqs();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitOk(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to send message.");

      setSubmitOk(true);
      setSubmitMessage(
        data.message || "Thank you! Your message has been sent successfully."
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setSubmitOk(false);
      setSubmitMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="overflow-hidden bg-white text-[#2E3545]">
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 -z-20 bg-[#fdfcfb]" />
        <div className="absolute -right-24 -top-24 -z-10 h-130 w-130 rounded-full bg-[#FE602F]/14 blur-[110px]" />
        <div className="absolute bottom-0 left-[10%] -z-10 h-72 w-72 rounded-full bg-[#2E3545]/8 blur-[100px]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(46,53,69,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(46,53,69,0.035)_1px,transparent_1px)] bg-size-[48px_48px] mask-[linear-gradient(to_bottom,black,transparent_85%)]" />

        <div className="container mx-auto grid items-center gap-12 px-5 py-16 sm:px-6 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:px-8 lg:py-24">
          <motion.div initial="hidden" animate="visible" className="space-y-6">
            <motion.div
              variants={animation}
              className="inline-flex items-center gap-2 rounded-full bg-[#fff0eb] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#d9471b] ring-1 ring-orange-100"
            >
              <MessageSquare size={14} />
              Contact TechCulture AI
            </motion.div>

            <motion.h1
              variants={animation}
              className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-[3.75rem]"
            >
              Let&apos;s build something{" "}
              <span className="text-[#FE602F]">useful</span> together.
            </motion.h1>

            <motion.p
              variants={animation}
              className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8"
            >
              Tell us about your KYC, middleware, onboarding, or digital product
              needs. Our team typically responds within one business day.
            </motion.p>

            <motion.div
              variants={animation}
              className="flex flex-wrap items-center gap-3"
            >
              <button
                type="button"
                onClick={openBookDemo}
                className="brand-cta-gradient inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold"
              >
                Book a Demo
                <ArrowRight size={17} />
              </button>
              <a
                href="#contact-form"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-[#2E3545] transition hover:border-[#FE602F]/40 hover:text-[#FE602F]"
              >
                Send a message
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-xl lg:max-w-none"
          >
            <div className="relative">
              <Image
                src="/contact-hero.jpg"
                alt="TechCulture AI — Smart Solutions for Your Business"
                width={1408}
                height={768}
                priority
                className="h-auto w-full object-cover object-center"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
              {/* Soft edge blend into page background */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_52%,#fdfcfb_100%)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-[#fdfcfb] to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#fdfcfb] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-linear-to-r from-[#fdfcfb] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-linear-to-l from-[#fdfcfb] to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact cards */}
      <ScrollReveal
        as="section"
        direction="up"
        delay={0.04}
        duration={0.7}
        className="bg-white py-12 md:py-16"
      >
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <ScrollReveal
            direction="fade"
            stagger={0.08}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {contactCards.map((card) => {
              const Icon = card.icon;
              const Wrapper = card.href ? "a" : "div";
              const props = card.href
                ? { href: card.href, className: "block h-full" }
                : { className: "block h-full" };
              return (
                <ScrollRevealItem key={card.label}>
                  <Wrapper {...props}>
                    <SpotlightCard
                      spotlightColor={BRAND_SPOTLIGHT}
                      className="h-full rounded-3xl border border-slate-200/90 bg-[#fdfcfb] p-5 transition hover:border-[#FE602F]/25"
                    >
                      <span
                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${card.tone}`}
                      >
                        <Icon size={20} />
                      </span>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        {card.label}
                      </p>
                      <p className="mt-1.5 text-[15px] font-semibold leading-snug text-[#2E3545]">
                        {card.value}
                      </p>
                    </SpotlightCard>
                  </Wrapper>
                </ScrollRevealItem>
              );
            })}
          </ScrollReveal>
        </div>
      </ScrollReveal>

      {/* Form section */}
      <ScrollReveal
        as="section"
        direction="up"
        delay={0.05}
        duration={0.75}
        className="relative overflow-hidden bg-[#f7f7f8] py-16 md:py-20"
      >
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#FE602F]/8 blur-[100px]" />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#2E3545]/8 blur-[90px]" />

        <div className="container relative mx-auto grid items-start gap-10 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-8">
          <ScrollReveal direction="left" delay={0.06} duration={0.7}>
            <div className="lg:sticky lg:top-28">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FE602F]">
                Write to us
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Send a message
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-500 sm:text-[15px]">
                Share a few details and we&apos;ll route your note to the right
                person. Prefer a live walkthrough? Book a demo instead.
              </p>

              <div className="relative mt-8 overflow-hidden rounded-3xl bg-linear-to-br from-[#171b24] via-[#2E3545] to-[#434c5f] p-6 text-white shadow-xl shadow-slate-500/20">
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#FE602F]/25 blur-2xl" />
                <p className="relative text-xs font-bold uppercase tracking-[0.16em] text-[#ffad92]">
                  Prefer a demo?
                </p>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-200">
                  See KYC, middleware, and onboarding flows in a short live
                  session with our team.
                </p>
                <button
                  type="button"
                  onClick={openBookDemo}
                  className="brand-cta-gradient relative mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold !text-white"
                >
                  Book a Demo
                  <ArrowRight size={15} />
                </button>
              </div>

              <div className="mt-6 space-y-4 rounded-3xl border border-slate-200 bg-white p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Company
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-snug text-[#2E3545]">
                    {COMPANY.legalName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">CIN: {COMPANY.cin}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FE602F]">
                    {COMPANY.corporateAddress.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {COMPANY.corporateAddress.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    {COMPANY.registeredAddress.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {COMPANY.registeredAddress.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FE602F] hover:underline"
                >
                  About the company
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.08} duration={0.75}>
            <SpotlightCard
              spotlightColor={BRAND_SPOTLIGHT}
              className="rounded-[1.75rem] border border-slate-200/90 bg-white p-6 shadow-[0_24px_70px_rgba(46,53,69,0.08)] sm:p-8"
            >
              <div
                id="contact-form"
                className="mb-7 flex items-center gap-3 scroll-mt-28"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-[#FE602F] to-[#ff7a4d] text-white shadow-md shadow-orange-500/25">
                  <Send size={17} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#2E3545]">
                    Contact form
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fields marked * are required
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Name <span className="text-[#FE602F]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Email <span className="text-[#FE602F]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Message <span className="text-[#FE602F]">*</span>
                  </label>
                  <textarea
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share a bit about your project or question…"
                    className={`${inputClass} resize-none`}
                    required
                  />
                </div>

                {submitMessage && (
                  <div className="sm:col-span-2">
                    <p
                      className={`rounded-2xl px-4 py-3 text-center text-sm ${
                        submitOk
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                          : "bg-red-50 text-red-600 ring-1 ring-red-100"
                      }`}
                    >
                      {submitMessage}
                    </p>
                  </div>
                )}

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="brand-cta-gradient mt-1 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      "Sending…"
                    ) : (
                      <>
                        Send message
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </SpotlightCard>
          </ScrollReveal>
        </div>
      </ScrollReveal>

      {/* FAQs */}
      <ScrollReveal
        as="section"
        direction="up"
        delay={0.05}
        duration={0.7}
        className="bg-white py-16 md:py-20"
      >
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FE602F]">
              FAQs
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-[15px]">
              Quick answers about our KYC, middleware, demos, and how to work
              with TechCulture AI.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl space-y-3">
            {faqLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-[#fdfcfb] px-5 py-8 text-center text-sm text-slate-400">
                Loading FAQs…
              </div>
            ) : faqs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-[#fdfcfb] px-5 py-8 text-center text-sm text-slate-400">
                FAQs will appear here soon.
              </div>
            ) : (
              faqs.map((item, index) => {
                const id = item.id || item._id || String(index);
                const isOpen = openFaqId === id;
                return (
                  <div
                    key={id}
                    className={`overflow-hidden rounded-2xl border bg-[#fdfcfb] transition ${
                      isOpen
                        ? "border-[#FE602F]/35 shadow-sm shadow-orange-500/10"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : id)}
                      className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="pr-2 text-[15px] font-semibold leading-snug text-[#2E3545]">
                        {item.question}
                      </span>
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                          isOpen
                            ? "bg-[#FE602F] text-white"
                            : "bg-white text-[#2E3545] ring-1 ring-slate-200"
                        }`}
                      >
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </span>
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm leading-7 text-slate-600">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Bottom CTA */}
      <ScrollReveal
        as="section"
        direction="up"
        delay={0.05}
        duration={0.7}
        className="bg-white pb-16 pt-4 md:pb-24 md:pt-6"
      >
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-r from-[#171b24] via-[#2E3545] to-[#434c5f] px-8 py-12 shadow-xl shadow-slate-500/20 sm:px-12 sm:py-14">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#FE602F]/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
            <div className="relative z-10 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffad92]">
                Next step
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white! sm:text-3xl">
                Ready to explore our platforms?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-200 sm:text-base">
                Browse fintech products or jump straight into a guided demo with
                the TechCulture team.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/fintech"
                  className="brand-cta-gradient inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold !text-white"
                >
                  Explore Fintech
                  <ArrowRight size={16} />
                </Link>
                <button
                  type="button"
                  onClick={openBookDemo}
                  className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-transparent px-6 py-3.5 font-semibold text-white! transition hover:bg-white/10"
                >
                  Book a Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
