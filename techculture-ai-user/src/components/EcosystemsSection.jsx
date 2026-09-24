"use client";
import Button from "@mui/material/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Brain,
  Fingerprint,
  Globe2,
  KeyRound,
  Scan,
  ShieldCheck,
} from "lucide-react";
import { webdevHref } from "../lib/webdevelopment/paths";
import SpotlightCard, { TEAL_SPOTLIGHT, BRAND_SPOTLIGHT } from "@/components/SpotlightCard";
import ScrollReveal, { ScrollRevealItem } from "@/components/ScrollReveal";

const features = [
  {
    title: "Biometric Verification",
    subtitle: "Facial recognition with liveness detection",
    icon: Fingerprint,
  },
  {
    title: "AI-Powered Processing",
    subtitle: "70% auto-approval via intelligent rules engine",
    icon: Brain,
  },
  {
    title: "OCR Extraction",
    subtitle: "Document capture and validation via OCR",
    icon: Scan,
  },
  {
    title: "Multi-Entity Support",
    subtitle: "Individual, Corporate, HUF, NRI, Joint",
    icon: Globe2,
  },
  {
    title: "SEBI Compliant",
    subtitle: "Full regulatory compliance & audit logs",
    icon: ShieldCheck,
  },
  {
    title: "STP Processing",
    subtitle: "End-to-end straight through processing",
    icon: KeyRound,
  },
];

const EcosystemsSection = ({ variant = "default" }) => {
  const router = useRouter();
  const isWebDev = variant === "webdevelopment";

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/contact-us");
    }
  };

  if (isWebDev) {
    return (
      <section className="relative overflow-hidden bg-white/45 py-16 md:py-24 backdrop-blur-[1px]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-10 right-1/4 h-80 w-80 rounded-full bg-[#FE602F]/10 blur-[100px]" />
          <div className="absolute bottom-0 left-1/5 h-64 w-64 rounded-full bg-[#2E3545]/8 blur-[90px]" />
        </div>
        <div className="container relative">
          <ScrollReveal direction="up" delay={0.02} duration={0.65}>
            <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
              <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-slate-900 leading-[1.2]">
                Five Powerful{" "}
                <span className="section-heading-accent">
                  Ecosystems
                </span>
              </h2>
              <p className="text-slate-500 font-normal text-[16px] sm:text-[18px] md:text-[20px] py-3 leading-relaxed">
                End-to-end solutions for KYC, partner lifecycle, referral growth,
                journey-driven CRM, and customer service.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <ScrollReveal direction="left" delay={0.05} stagger={0.07}>
              <ScrollRevealItem>
                <p className="text-teal-600 text-[13px] sm:text-[14px] font-semibold tracking-[0.14em] uppercase mb-3">
                  KYC &amp; Onboarding
                </p>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <h3 className="text-slate-900 text-[28px] sm:text-[34px] md:text-[40px] font-bold leading-tight mb-4">
                  Unified KYC Ecosystem
                </h3>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <p className="text-slate-500 text-[16px] sm:text-[17px] md:text-[18px] leading-relaxed mb-7">
                  AI-driven identity verification platform for Individuals,
                  Corporates, HUFs, NRIs, and Joint accounts — with biometric
                  recognition, OCR extraction, and automated compliance scoring.
                </p>
              </ScrollRevealItem>

              <ScrollReveal
                direction="fade"
                delay={0.05}
                stagger={0.07}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8"
              >
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <ScrollRevealItem key={feature.title}>
                      <SpotlightCard
                        spotlightColor={TEAL_SPOTLIGHT}
                        className="rounded-xl border border-teal-100 bg-white/80 backdrop-blur-sm p-4 shadow-sm hover:border-teal-300 hover:shadow-md hover:shadow-teal-500/10 transition-all duration-300 group h-full"
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 text-teal-600 ring-1 ring-teal-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Icon size={18} strokeWidth={2} />
                          </span>
                          <div>
                            <h4 className="text-slate-900 text-[15px] sm:text-[16px] font-semibold mb-1">
                              {feature.title}
                            </h4>
                            <p className="text-slate-500 text-[13px] sm:text-[14px] leading-snug">
                              {feature.subtitle}
                            </p>
                          </div>
                        </div>
                      </SpotlightCard>
                    </ScrollRevealItem>
                  );
                })}
              </ScrollReveal>

              <ScrollRevealItem>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={() => router.push(webdevHref("/products"))}
                    className="brand-cta-outline inline-flex items-center justify-center gap-2 border-2 font-semibold px-6 py-3 rounded-full transition"
                  >
                    Know More —
                  </button>
                  <button
                    type="button"
                    onClick={scrollToContact}
                    className="brand-cta-gradient inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold"
                  >
                    Get in Touch
                  </button>
                </div>
              </ScrollRevealItem>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.12} duration={0.8}>
              <div className="relative">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-teal-300/25 via-emerald-200/10 to-teal-400/20 blur-2xl pointer-events-none" />
                <div className="relative rounded-2xl overflow-hidden border border-teal-100 shadow-[0_20px_60px_rgba(13,148,136,0.15)] bg-white ring-1 ring-teal-50">
                  <Image
                    src="/kyc-verification-dashboard.jpg"
                    alt="KYC Verification Process Dashboard"
                    width={1200}
                    height={900}
                    className="w-full h-auto object-cover object-top"
                    priority={false}
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-[#000319] imageBg">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
          <h2 className="mainHd text-[36px] sm:text-[44px] md:text-[50px] font-bold text-white leading-[1.2]">
            Five Powerful <span className="section-heading-accent">Ecosystems</span>
          </h2>
          <p className="text-white/70 font-light text-[16px] sm:text-[18px] md:text-[20px] py-3 leading-relaxed">
            End-to-end solutions for KYC, partner lifecycle, referral growth,
            journey-driven CRM, and customer service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div>
            <p className="text-primary text-[13px] sm:text-[14px] font-semibold tracking-[0.14em] uppercase mb-3">
              KYC &amp; Onboarding
            </p>
            <h3 className="text-white text-[28px] sm:text-[34px] md:text-[40px] font-bold leading-tight mb-4">
              Unified KYC Ecosystem
            </h3>
            <p className="text-white/70 text-[16px] sm:text-[17px] md:text-[18px] leading-relaxed mb-7 text-justify">
              AI-driven identity verification platform for Individuals,
              Corporates, HUFs, NRIs, and Joint accounts — with biometric
              recognition, OCR extraction, and automated compliance scoring.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <SpotlightCard
                    key={feature.title}
                    spotlightColor={BRAND_SPOTLIGHT}
                    className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#1e293b80] p-4 hover:border-primary/40 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
                        <Icon size={18} strokeWidth={2} />
                      </span>
                      <div>
                        <h4 className="text-white text-[15px] sm:text-[16px] font-semibold mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-white/55 text-[13px] sm:text-[14px] leading-snug">
                          {feature.subtitle}
                        </p>
                      </div>
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                onClick={() => router.push("/services")}
                className="brand-cta-outline !rounded-md !px-6 !py-3 !capitalize !font-bold"
                size="large"
                variant="outlined"
              >
                Know More —
              </Button>
              <Button
                onClick={() => router.push("/contact-us")}
                className="brand-cta-gradient !text-white !rounded-md !px-6 !py-3 !capitalize !font-bold"
                size="large"
              >
                Get in Touch
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-primary/10 blur-2xl pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.12)] shadow-[0_20px_60px_rgba(0,0,0,0.45)] bg-[#0b1220]">
              <Image
                src="/kyc-verification-dashboard3.png"
                alt="KYC Verification Process Dashboard"
                width={1200}
                height={900}
                className="w-full h-auto object-cover object-top"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemsSection;
