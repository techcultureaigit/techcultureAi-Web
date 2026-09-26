"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import BounceCards from "@/components/BounceCards";
import ScrollReveal from "@/components/ScrollReveal";

const CLIENT_STORIES = [
  {
    name: "Fintech Operations Team",
    company: "Digital Brokerage",
    title: "Frictionless digital onboarding",
    description:
      "A connected onboarding experience that brings identity verification, document collection, and account activation into one clear journey.",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=85",
    capabilities: ["eKYC", "Account opening", "Workflow automation"],
  },
  {
    name: "Compliance Leadership",
    company: "Lending & NBFC",
    title: "Compliance-ready KYC workflows",
    description:
      "Structured KYC and re-KYC workflows designed to reduce manual follow-ups while keeping every verification step visible and auditable.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=85",
    capabilities: ["KYC & re-KYC", "Audit trails", "Secure documents"],
  },
  {
    name: "Customer Experience Team",
    company: "Insurance Services",
    title: "Connected customer support",
    description:
      "An intelligent support workspace that unifies conversations, customer context, ownership, and service workflows for faster resolution.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=85",
    capabilities: ["AI helpdesk", "Omnichannel support", "SLA workflows"],
  },
  {
    name: "Digital Product Team",
    company: "Wealth & Trading",
    title: "Clear, dependable trading experiences",
    description:
      "Modern web and mobile product experiences that make investing, portfolio access, and transaction journeys easier to understand and use.",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=85",
    capabilities: ["Trading apps", "Investment journeys", "Mobile platforms"],
  },
  {
    name: "Revenue & Growth Team",
    company: "Enterprise Business",
    title: "Smarter lead and sales automation",
    description:
      "A connected CRM workflow that helps teams capture opportunities, automate follow-ups, and keep every conversation moving forward.",
    image:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=85",
    capabilities: ["Lead management", "CRM automation", "AI engagement"],
  },
];

const CARD_TRANSFORMS_DESKTOP = [
  "rotate(-8deg) translate(-180px)",
  "rotate(6deg) translate(-90px)",
  "rotate(-2deg)",
  "rotate(7deg) translate(90px)",
  "rotate(-7deg) translate(180px)",
];

const CARD_TRANSFORMS_MOBILE = [
  "rotate(-6deg) translate(-72px)",
  "rotate(4deg) translate(-36px)",
  "rotate(-1deg)",
  "rotate(5deg) translate(36px)",
  "rotate(-5deg) translate(72px)",
];

export default function Testimonials() {
  const [activeClient, setActiveClient] = useState(2);
  const [isMobile, setIsMobile] = useState(false);
  const story = CLIENT_STORIES[activeClient];

  useEffect(() => {
    const sync = () => setIsMobile(window.innerWidth < 768);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white/40 px-4 py-12 backdrop-blur-[1px] sm:px-6 sm:py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#2E3545]/8 blur-[90px]" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#FE602F]/12 blur-[100px]" />
      </div>

      <div className="container relative mx-auto">
        <ScrollReveal direction="up" delay={0.03} duration={0.65}>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              Our <span className="section-heading-accent">Happy Clients</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base">
              We partner with teams across fintech, compliance, customer
              experience, and enterprise operations to build technology that
              feels clear, dependable, and ready to scale.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-8 grid items-center gap-8 sm:mt-12 lg:mt-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          <ScrollReveal direction="scale" delay={0.06} duration={0.8}>
            <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-transparent px-2 py-4 sm:min-h-[360px] sm:px-3 sm:py-8 md:min-h-[440px]">
              <BounceCards
                className="relative z-10 scale-[0.72] sm:scale-[0.88] md:scale-100"
                items={CLIENT_STORIES}
                containerWidth={isMobile ? 320 : 620}
                containerHeight={isMobile ? 260 : 390}
                animationDelay={0.25}
                animationStagger={0.09}
                easeType="elastic.out(1, 0.55)"
                transformStyles={
                  isMobile ? CARD_TRANSFORMS_MOBILE : CARD_TRANSFORMS_DESKTOP
                }
                enableHover={!isMobile}
                onActiveChange={setActiveClient}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1} duration={0.75}>
            <div
              key={story.title}
              className="animate-[clientStoryIn_420ms_cubic-bezier(0.22,1,0.36,1)] rounded-2xl border border-orange-100 bg-white p-5 shadow-[0_20px_55px_rgba(46,53,69,0.08)] sm:rounded-[28px] sm:p-7 md:p-9"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#FE602F]">
                  Client focus {String(activeClient + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                  {story.company}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-bold leading-tight tracking-tight text-slate-900 sm:mt-6 sm:text-2xl md:text-3xl">
                {story.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-[15px] sm:leading-7">
                {story.description}
              </p>

              <div className="mt-5 space-y-3 border-y border-slate-100 py-5 sm:mt-7 sm:py-6">
                {story.capabilities.map((capability) => (
                  <div
                    key={capability}
                    className="flex items-center gap-3 text-sm font-semibold text-slate-700"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-50 text-[#FE602F]">
                      <CheckCircle2 size={15} />
                    </span>
                    {capability}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 sm:mt-7">
                <div className="flex min-w-0 items-center gap-3">
                  <Image
                    src={story.image}
                    alt={story.name}
                    width={48}
                    height={48}
                    unoptimized
                    className="h-11 w-11 rounded-xl object-cover sm:h-12 sm:w-12"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {story.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {story.company}
                    </p>
                  </div>
                </div>
                <ArrowRight className="shrink-0 text-[#FE602F]" size={22} />
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal direction="up" delay={0.08} duration={0.6}>
          <div className="mt-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-10 sm:flex-wrap sm:justify-center sm:overflow-visible [&::-webkit-scrollbar]:hidden">
            {CLIENT_STORIES.map((client, index) => (
              <button
                key={client.company}
                type="button"
                onClick={() => setActiveClient(index)}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-bold transition sm:px-4 ${
                  activeClient === index
                    ? "border-[#FE602F] bg-[#FE602F] text-white! shadow-md shadow-orange-500/20"
                    : "border-orange-200 bg-white text-orange-700 hover:border-orange-400 hover:bg-orange-50"
                }`}
              >
                {client.company}
              </button>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
