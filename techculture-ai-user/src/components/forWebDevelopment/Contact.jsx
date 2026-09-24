"use client";

import { useState } from "react";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { ArrowRight, Send } from "lucide-react";
import SpotlightCard, {
  TEAL_SPOTLIGHT,
  BRAND_SPOTLIGHT,
} from "@/components/SpotlightCard";
import ScrollReveal, { ScrollRevealItem } from "@/components/ScrollReveal";
import { COMPANY } from "@/lib/company";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-[#fafbfc] px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#FE602F]/60 focus:bg-white focus:ring-2 focus:ring-[#FE602F]/15";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Failed to send message.");
      }
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
      setSubmitMessage(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MdEmail className="text-lg" />,
      label: "Email us",
      value: COMPANY.email,
      href: `mailto:${COMPANY.email}`,
      tint: "from-orange-50 to-amber-50 text-[#FE602F] ring-orange-100",
    },
    {
      icon: <MdPhone className="text-lg" />,
      label: "Call us",
      value: COMPANY.phone,
      href: `tel:${COMPANY.phoneTel}`,
      tint: "from-teal-50 to-emerald-50 text-[#0F766E] ring-teal-100",
    },
    {
      icon: <MdLocationOn className="text-lg" />,
      label: "Corporate office",
      value: COMPANY.corporateAddress.singleLine,
      href: null,
      tint: "from-slate-50 to-slate-100 text-[#2E3545] ring-slate-200",
    },
  ];

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-white/40 py-16 md:py-24 backdrop-blur-[1px]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 right-1/4 h-80 w-80 rounded-full bg-[#FE602F]/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/5 h-64 w-64 rounded-full bg-[#2E3545]/8 blur-[90px]" />
      </div>

      <div className="container relative">
        <ScrollReveal direction="up" delay={0.03} duration={0.65}>
          <div className="mb-10 max-w-2xl md:mb-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#FE602F]">
              Connect with us
            </p>
            <h2 className="mb-3 text-3xl font-bold leading-tight text-[#2E3545] sm:text-4xl">
              Get in touch with <span className="section-heading-accent">our team</span>
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-500">
              Have a project or partnership in mind? Reach out — we usually
              respond within one business day.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[0.95fr_1.15fr] lg:gap-10">
          <ScrollReveal
            direction="left"
            delay={0.05}
            stagger={0.09}
            className="flex h-full flex-col gap-4"
          >
            {contactInfo.map((info) => {
              const Wrapper = info.href ? "a" : "div";
              const wrapperProps = info.href
                ? { href: info.href }
                : {};

              return (
                <ScrollRevealItem key={info.label}>
                  <SpotlightCard
                    spotlightColor={
                      info.label === "Email us" ? BRAND_SPOTLIGHT : TEAL_SPOTLIGHT
                    }
                    className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_8px_28px_rgba(46,53,69,0.05)] backdrop-blur-sm transition hover:border-slate-300"
                  >
                    <Wrapper
                      {...wrapperProps}
                      className="flex items-start gap-4"
                    >
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 ${info.tint}`}
                      >
                        {info.icon}
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {info.label}
                        </p>
                        <p className="text-[14px] font-semibold leading-snug text-[#2E3545]">
                          {info.value}
                        </p>
                      </div>
                    </Wrapper>
                  </SpotlightCard>
                </ScrollRevealItem>
              );
            })}

            <ScrollRevealItem>
              <div className="relative mt-auto overflow-hidden rounded-2xl bg-gradient-to-br from-[#2E3545] to-[#073B3A] p-5 text-white shadow-lg lg:mt-8">
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#FE602F]/25 blur-2xl" />
                <p className="relative mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#FDBA74]">
                  Prefer a demo?
                </p>
                <p className="relative mb-3 text-sm leading-relaxed text-white/80">
                  Book a short walkthrough of our KYC and compliance products.
                </p>
                <a
                  href="#contact-form"
                  className="relative inline-flex items-center gap-1.5 text-sm font-semibold text-white transition hover:text-[#FDBA74]"
                >
                  Use the form
                  <ArrowRight size={15} />
                </a>
              </div>
            </ScrollRevealItem>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1} duration={0.75}>
          <SpotlightCard
            spotlightColor={BRAND_SPOTLIGHT}
            className="flex h-full flex-col rounded-[1.5rem] border border-slate-200/90 bg-white p-6 shadow-[0_16px_50px_rgba(46,53,69,0.08)] sm:p-8"
          >
            <div id="contact-form" className="mb-6 flex items-center gap-3 scroll-mt-28">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FE602F] to-[#ff7a4d] text-white shadow-md shadow-orange-500/25">
                <Send size={16} />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#2E3545]">
                  Send a message
                </h3>
                <p className="text-xs text-slate-500">
                  We&apos;ll get back to you shortly
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Name <span className="text-[#FE602F]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
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
                  placeholder="Enter your email"
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
                  placeholder="Enter your phone"
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
                  placeholder="Write a subject"
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Your Message <span className="text-[#FE602F]">*</span>
                </label>
                <textarea
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message"
                  className={`${inputClass} resize-none`}
                  required
                />
              </div>

              {submitMessage && (
                <div className="sm:col-span-2">
                  <p
                    className={`rounded-xl px-3 py-2.5 text-center text-sm ${
                      submitMessage.includes("Thank you")
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
                  className="brand-cta-gradient mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="-ml-1 mr-1 h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Submit
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </SpotlightCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
