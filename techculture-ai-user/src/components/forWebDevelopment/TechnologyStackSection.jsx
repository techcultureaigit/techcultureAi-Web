"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  ChevronRight,
  Landmark,
  Layers,
  Network,
  Rocket,
  Smartphone,
} from "lucide-react";
import { useBookDemo } from "@/context/BookDemoContext";
import { webdevHref } from "@/lib/webdevelopment/paths";
import ScrollReveal from "@/components/ScrollReveal";

const STACK_CATEGORIES = [
  {
    id: "ai",
    label: "AI & Machine Learning",
    icon: Brain,
    cta: "Explore AI Solutions",
    image: "/ai.gif",
    imageAlt: "AI & Machine Learning platforms",
    techs: [
      "OpenAI",
      "Anthropic Claude",
      "Google Gemini",
      "Meta Llama",
      "Mistral AI",
      "LangGraph",
      "LlamaIndex",
      "CrewAI",
      "Pinecone",
      "Weaviate",
      "PyTorch",
      "Hugging Face",
      "TensorFlow",
      "Scikit-learn",
    ],
  },
  {
    id: "banking-fintech",
    label: "Banking & Fintech",
    icon: Landmark,
    cta: "Explore Fintech Solutions",
    image: "/fintech-growth-hero.png",
    imageAlt: "Banking and fintech platforms",
    techs: [
      "eKYC / DigiLocker",
      "Re-KYC",
      "Account Closure",
      "Trading Apps",
      "Mutual Fund",
      "IPO Bidding",
      "CKYC / KRA",
      "Video KYC",
      "Aadhaar APIs",
      "Secure Onboarding",
      "Compliance Workflows",
      "Audit Trails",
    ],
  },
  {
    id: "products",
    label: "Products & Platforms",
    icon: Layers,
    cta: "Explore Our Products",
    image: "/hero-ecosystem.png",
    imageAlt: "TechCulture products and platforms",
    techs: [
      "Trading Applications",
      "Mutual Fund",
      "HRMS",
      "GIS Application",
      "IPO",
      "LMS",
      "Tracking System",
      "Custom SaaS",
      "Admin Portals",
      "Dashboards",
      "Role-Based Access",
      "Analytics",
    ],
  },
  {
    id: "middleware",
    label: "Middleware & Integrations",
    icon: Network,
    cta: "Explore Middleware",
    image: "/middleware-central-engine.png",
    imageAlt: "Middleware and integration layer",
    techs: [
      "API Gateway",
      "Request Routing",
      "Identity Middleware",
      "Status Sync",
      "Webhooks",
      "SSO / OAuth",
      "REST APIs",
      "Message Queues",
      "Data Mapping",
      "Partner Integrations",
      "Retry & Failover",
      "Monitoring",
    ],
  },
  {
    id: "web-mobile",
    label: "Web, Mobile & SaaS",
    icon: Smartphone,
    cta: "Explore App Solutions",
    image: "/saas.gif",
    imageAlt: "Web, mobile and SaaS development",
    techs: [
      "E-Commerce",
      "Corporate Websites",
      "Mobile Applications",
      "Custom SaaS",
      "React / Next.js",
      "React Native",
      "Flutter",
      "Node.js",
      "Cloud Hosting",
      "CI/CD",
      "Push Notifications",
      "CMS",
    ],
  },
];

export default function TechnologyStackSection() {
  const { openBookDemo } = useBookDemo();
  const [activeId, setActiveId] = useState(STACK_CATEGORIES[0].id);
  const active =
    STACK_CATEGORIES.find((item) => item.id === activeId) || STACK_CATEGORIES[0];
  const ActiveIcon = active.icon;

  return (
    <section
      data-no-auto-reveal
      className="relative z-10 w-full overflow-visible bg-white px-4 py-10 sm:px-6 sm:py-12"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.25]" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(46,53,69,0.1) 1px, transparent 0)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse 55% 45% at 8% 12%, #000 20%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 55% 45% at 8% 12%, #000 20%, transparent 70%)",
          }}
        />
        <div className="absolute -right-16 top-10 h-72 w-72 rounded-full bg-[#FE602F]/8 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-[#2E3545]/5 blur-3xl" />
      </div>

      <div className="container relative z-10">
        <ScrollReveal direction="up" delay={0.03} duration={0.65}>
          <div className="mx-auto max-w-3xl px-1 text-center sm:px-0">
            <h2 className="text-[1.35rem] font-bold tracking-tight text-[#2E3545]! sm:text-3xl lg:text-4xl">
              Powering Ideas with{" "}
              <span className="bg-linear-to-r from-[#FE602F] to-[#e55528] bg-clip-text text-transparent">
                Modern Technology
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#667085] sm:mt-4 sm:text-base">
              We leverage cutting-edge tools, frameworks and platforms to build
              scalable, secure and high-performing digital solutions for your
              business.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.08} duration={0.7} className="mt-8 sm:mt-10">
          {/* Mobile category chips — centered */}
          <div className="mb-5 flex justify-center gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-0 flex-wrap justify-center gap-2">
              {STACK_CATEGORIES.map((category) => {
                const isActive = category.id === active.id;
                return (
                  <button
                    key={`chip-${category.id}`}
                    type="button"
                    onClick={() => setActiveId(category.id)}
                    className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                      isActive
                        ? "border-[#FE602F] bg-[#FE602F] text-white!"
                        : "border-orange-200 bg-white text-[#2E3545]!"
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mx-auto grid max-w-xl gap-5 lg:max-w-none lg:grid-cols-[0.9fr_1.15fr_1.1fr] lg:items-stretch lg:gap-6">
            <div className="hidden rounded-3xl border border-orange-100/80 bg-white p-3 shadow-[0_10px_30px_rgba(46,53,69,0.05)] sm:p-4 lg:block">
              <div className="flex flex-col gap-2">
                {STACK_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const isActive = category.id === active.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveId(category.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3.5 text-left transition ${
                        isActive
                          ? "bg-linear-to-r from-[#FE602F] to-[#e55528] text-white! shadow-[0_10px_24px_rgba(254,96,47,0.28)]"
                          : "text-[#2E3545]! hover:bg-[#fff5f1]"
                      }`}
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                          isActive
                            ? "bg-white/20 text-white!"
                            : "bg-[#fff0eb] text-[#FE602F]!"
                        }`}
                      >
                        <Icon size={17} strokeWidth={2} />
                      </span>
                      <span
                        className={`min-w-0 flex-1 text-[13px] font-semibold leading-snug sm:text-sm ${
                          isActive ? "text-white!" : "text-[#2E3545]!"
                        }`}
                      >
                        {category.label}
                      </span>
                      <ChevronRight
                        size={16}
                        className={`shrink-0 ${isActive ? "text-white!" : "text-slate-400"}`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 border-t border-slate-100 px-2 pt-4 text-center">
                <div className="mb-2 flex items-center justify-center gap-1.5">
                  {STACK_CATEGORIES.map((category) => (
                    <span
                      key={category.id}
                      className={`h-1.5 w-1.5 rounded-full ${
                        category.id === active.id ? "bg-[#FE602F]" : "bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[11px] font-medium tracking-wide text-slate-400">
                  Smarter Technology. Better Tomorrow.
                </p>
              </div>
            </div>

            <div
              className={`relative order-first mx-auto w-full min-h-[220px] overflow-hidden rounded-3xl shadow-[0_10px_30px_rgba(46,53,69,0.05)] sm:min-h-[300px] lg:order-none lg:min-h-full ${
                active.id === "ai"
                  ? "border-0 bg-[#0b0d12]"
                  : "border border-orange-100/80 bg-white"
              }`}
            >
              {active.image ? (
                active.id === "ai" ? (
                  <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={active.image}
                      alt={active.imageAlt}
                      className="block h-full w-full object-cover object-center"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-white p-3 sm:p-4">
                    <div className="relative h-[90%] w-[90%] [mask-image:linear-gradient(to_right,transparent_0%,#000_10%,#000_90%,transparent_100%),linear-gradient(to_bottom,transparent_0%,#000_10%,#000_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_10%,#000_90%,transparent_100%),linear-gradient(to_bottom,transparent_0%,#000_10%,#000_90%,transparent_100%)] [mask-composite:intersect] [-webkit-mask-composite:source-in] [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat] [mask-size:100%_100%] [-webkit-mask-size:100%_100%]">
                      <Image
                        src={active.image}
                        alt={active.imageAlt}
                        fill
                        unoptimized={/\.gif($|\?)/i.test(active.image)}
                        className="object-contain object-center mix-blend-multiply"
                        sizes="(max-width: 1024px) 100vw, 420px"
                      />
                    </div>
                  </div>
                )
              ) : (
                <div className="relative flex h-full min-h-[280px] flex-col items-center justify-center gap-4 bg-white p-8 text-center sm:min-h-[340px]">
                  <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-[#fff0eb] text-[#FE602F] ring-1 ring-orange-100">
                    <ActiveIcon size={30} strokeWidth={1.8} />
                  </span>
                  <div className="relative">
                    <p className="text-lg font-semibold text-[#2E3545]!">
                      {active.label}
                    </p>
                    <p className="mt-2 max-w-[220px] text-xs leading-relaxed text-slate-500">
                      Visual coming soon — drop your image here for this category.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mx-auto flex h-full w-full flex-col rounded-3xl border border-orange-100/80 bg-white p-5 text-center shadow-[0_10px_30px_rgba(46,53,69,0.05)] sm:p-6 lg:text-left">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-[#2E3545]! sm:text-lg">
                  Popular Technologies
                </h3>
                <Link
                  href={webdevHref("/contact")}
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#FE602F] transition hover:text-[#d9471b]"
                >
                  View All
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="flex flex-wrap content-start justify-center gap-2 lg:justify-start">
                {active.techs.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-[#2E3545] shadow-[0_1px_2px_rgba(46,53,69,0.04)] transition hover:border-[#FE602F]/35 hover:text-[#FE602F]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={openBookDemo}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#FE602F] to-[#e55528] px-5 py-3.5 text-sm font-semibold text-white! shadow-[0_12px_28px_rgba(254,96,47,0.28)] transition hover:brightness-105 lg:mt-auto"
              >
                <Rocket size={16} />
                {active.cta}
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
