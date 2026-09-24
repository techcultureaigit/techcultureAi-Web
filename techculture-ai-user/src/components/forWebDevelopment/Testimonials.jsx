"use client";

import { useState } from "react";
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

const CARD_TRANSFORMS = [
  "rotate(-8deg) translate(-180px)",
  "rotate(6deg) translate(-90px)",
  "rotate(-2deg)",
  "rotate(7deg) translate(90px)",
  "rotate(-7deg) translate(180px)",
];

export default function Testimonials() {
  const [activeClient, setActiveClient] = useState(2);
  const story = CLIENT_STORIES[activeClient];

  return (
    <section className="relative overflow-hidden bg-white/40 px-5 py-16 sm:px-6 md:py-24 backdrop-blur-[1px]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#2E3545]/8 blur-[90px]" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#FE602F]/12 blur-[100px]" />
      </div>

      <div className="container relative mx-auto">
        <ScrollReveal direction="up" delay={0.03} duration={0.65}>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Our <span className="section-heading-accent">Happy Clients</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              We partner with teams across fintech, compliance, customer
              experience, and enterprise operations to build technology that
              feels clear, dependable, and ready to scale.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          <ScrollReveal direction="scale" delay={0.06} duration={0.8}>
            <div className="relative flex min-h-[390px] items-center justify-center overflow-hidden bg-transparent px-3 py-8 sm:min-h-[440px]">
              <BounceCards
                className="relative z-10"
                items={CLIENT_STORIES}
                containerWidth={620}
                containerHeight={390}
                animationDelay={0.25}
                animationStagger={0.09}
                easeType="elastic.out(1, 0.55)"
                transformStyles={CARD_TRANSFORMS}
                enableHover
                onActiveChange={setActiveClient}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1} duration={0.75}>
          <div
            key={story.title}
            className="animate-[clientStoryIn_420ms_cubic-bezier(0.22,1,0.36,1)] rounded-[28px] border border-orange-100 bg-white p-7 shadow-[0_20px_55px_rgba(46,53,69,0.08)] sm:p-9"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#FE602F]">
                Client focus {String(activeClient + 1).padStart(2, "0")}
              </span>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                {story.company}
              </span>
            </div>

            <h3 className="mt-6 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
              {story.title}
            </h3>
            <p className="mt-4 text-[15px] leading-7 text-slate-600">
              {story.description}
            </p>

            <div className="mt-7 space-y-3 border-y border-slate-100 py-6">
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

            <div className="mt-7 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Image
                  src={story.image}
                  alt={story.name}
                  width={48}
                  height={48}
                  unoptimized
                  className="h-12 w-12 rounded-xl object-cover"
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
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {CLIENT_STORIES.map((client, index) => (
            <button
              key={client.company}
              type="button"
              onClick={() => setActiveClient(index)}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                activeClient === index
                  ? "border-[#FE602F] bg-[#FE602F] text-white shadow-md shadow-orange-500/20"
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
