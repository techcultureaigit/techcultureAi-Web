"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  FileSignature,
  Fingerprint,
  Layers3,
  Search,
  UserRoundPlus,
} from "lucide-react";
import { productPages } from "@/lib/webdevelopment/catalog";
import { useBookDemo } from "@/context/BookDemoContext";

const filters = [
  "All Products",
  "Identity & KYC",
  "Digital Signing",
  "Onboarding",
  "Automation",
  "Platforms",
];

const categoryDetails = {
  "Identity & KYC": {
    icon: Fingerprint,
    description: "Secure identity, verification, and compliance journeys.",
  },
  "Digital Signing": {
    icon: FileSignature,
    description: "Fast, auditable digital consent and signature workflows.",
  },
  Onboarding: {
    icon: UserRoundPlus,
    description: "Connected acquisition experiences for every relationship.",
  },
  Automation: {
    icon: Bot,
    description: "Intelligent communication and operational automation.",
  },
  Platforms: {
    icon: Layers3,
    description: "Scalable platforms for complex financial operations.",
  },
};

function getCategory(title) {
  const value = title.toLowerCase();

  if (
    value.includes("kyc") ||
    value.includes("aadhaar verification") ||
    value.includes("identity")
  ) {
    return "Identity & KYC";
  }
  if (value.includes("esign") || value.includes("signature")) {
    return "Digital Signing";
  }
  if (value.includes("onboarding")) {
    return "Onboarding";
  }
  if (
    value.includes("automation") ||
    value.includes("whatsapp") ||
    value.includes("crm") ||
    value.includes("ai ")
  ) {
    return "Automation";
  }
  return "Platforms";
}

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ProductsHubPage() {
  const { openBookDemo } = useBookDemo();
  const reduceMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState("All Products");
  const [query, setQuery] = useState("");
  const animation = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : reveal;

  const products = useMemo(
    () =>
      productPages.map((product) => ({
        ...product,
        productCategory: getCategory(product.title),
      })),
    []
  );

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesFilter =
        activeFilter === "All Products" ||
        product.productCategory === activeFilter;
      const matchesQuery =
        !normalizedQuery ||
        `${product.title} ${product.summary} ${product.about}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, products, query]);

  return (
    <div className="overflow-hidden bg-white text-[#2E3545]">
      <section className="relative isolate min-h-162.5 overflow-hidden">
        <div className="absolute inset-0 -z-30 bg-[#fdfcfb]" />
        <div className="absolute -right-32 -top-24 -z-20 h-150 w-150 rounded-full bg-[#FE602F]/14 blur-[120px]" />
        <div className="absolute -bottom-40 left-[8%] -z-20 h-96 w-96 rounded-full bg-[#2E3545]/8 blur-[110px]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(46,53,69,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(46,53,69,0.035)_1px,transparent_1px)] bg-size-[48px_48px] mask-[linear-gradient(to_bottom,black,transparent_82%)]" />

        <div className="container mx-auto grid min-h-162.5 items-center gap-14 px-5 py-16 sm:px-6 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <motion.div initial="hidden" animate="visible">
            <motion.div
              variants={animation}
              className="mb-7 inline-flex items-center gap-2 rounded-full bg-[#fff0eb] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#d9471b] ring-1 ring-orange-100"
            >
              <Layers3 size={14} />
              TechCulture product ecosystem
            </motion.div>

            <motion.h1
              variants={animation}
              className="max-w-3xl text-[2rem] font-semibold leading-[1.1] tracking-[-0.045em] sm:text-4xl md:text-5xl lg:text-[4rem]"
            >
              One ecosystem. Every{" "}
              <span className="text-[#FE602F]">client journey.</span>
            </motion.h1>

            <motion.p
              variants={animation}
              className="mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8"
            >
              Secure identity, digital signing, onboarding, engagement, and
              intelligent operations—built as production-grade products for
              modern financial institutions.
            </motion.p>

            <motion.div
              variants={animation}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href="#product-suite"
                className="brand-cta-gradient inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold"
              >
                Explore products
                <ArrowRight size={17} />
              </a>
              <button
                type="button"
                onClick={openBookDemo}
                className="inline-flex items-center gap-2 rounded-full border border-[#2E3545]/20 bg-white px-6 py-3.5 font-semibold text-[#2E3545] shadow-sm transition hover:border-[#FE602F]/50 hover:bg-[#fff5f1] hover:text-[#FE602F]"
              >
                Book a Demo
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 36, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{
              duration: 0.75,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mx-auto w-full max-w-xl sm:max-w-2xl"
          >
            <img
              src="/all.png"
              alt="TechCulture digital ecosystem — Trading, HRMS, E-KYC, Re-KYC, Closer, GIS and IPO Master"
              className="h-auto w-full object-contain object-center"
            />
          </motion.div>
        </div>
      </section>

      <section
        id="product-suite"
        className="scroll-mt-24 bg-[#f7f7f8] py-20 sm:py-24"
      >
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FE602F]">
              Explore the suite
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Products for every financial workflow.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Start with one focused capability or connect products to build a
              complete client lifecycle.
            </p>
          </div>

          <label className="mx-auto mt-9 flex max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm focus-within:border-[#FE602F]/45 focus-within:ring-4 focus-within:ring-[#FE602F]/8">
            <Search size={18} className="shrink-0 text-[#FE602F]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeFilter === filter
                    ? "bg-[#FE602F] text-white shadow-[0_8px_20px_rgba(254,96,47,0.24)]"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-[#FE602F]/35 hover:text-[#FE602F]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {visibleProducts.length > 0 ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product, index) => {
                const details = categoryDetails[product.productCategory];
                const Icon = details.icon;

                return (
                  <motion.article
                    key={product.slug}
                    initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={reduceMotion ? undefined : { y: -7 }}
                    viewport={{ once: true, amount: 0.18 }}
                    transition={{
                      duration: 0.45,
                      delay: (index % 4) * 0.06,
                    }}
                    className="group h-full"
                  >
                    <Link
                      href={product.href}
                      className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#2E3545]/10 bg-white p-6 shadow-[0_12px_35px_rgba(46,53,69,0.06)] transition duration-300 hover:border-[#FE602F]/35 hover:shadow-[0_20px_48px_rgba(254,96,47,0.12)]"
                    >
                      <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-[#FE602F] to-[#2E3545] transition-transform duration-500 group-hover:scale-x-100" />
                      <div className="flex items-start justify-between gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0eb] text-[#FE602F] transition duration-300 group-hover:rotate-3 group-hover:scale-105">
                          <Icon size={21} />
                        </span>
                        <span className="rounded-full bg-[#2E3545]/7 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#2E3545]">
                          {product.productCategory}
                        </span>
                      </div>

                      <h3 className="mt-6 text-lg font-semibold leading-snug text-[#2E3545] transition group-hover:text-[#FE602F]">
                        {product.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                        {product.summary}
                      </p>

                      <div className="mt-5 space-y-2">
                        {(product.highlights || []).slice(0, 2).map((item) => (
                          <span
                            key={item}
                            className="flex items-start gap-2 text-xs leading-5 text-slate-500"
                          >
                            <CheckCircle2
                              size={14}
                              className="mt-0.5 shrink-0 text-[#FE602F]"
                            />
                            {item}
                          </span>
                        ))}
                      </div>

                      <span className="mt-auto flex items-center gap-2 pt-6 text-xs font-bold text-[#2E3545] transition group-hover:text-[#FE602F]">
                        Explore product
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <Search className="mx-auto text-[#FE602F]" size={28} />
              <h3 className="mt-4 text-lg font-semibold">No products found</h3>
              <p className="mt-2 text-sm text-slate-500">
                Try another keyword or choose a different category.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#fffaf8] py-16 sm:py-20">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-[#FE602F]/20 bg-white p-7 shadow-[0_18px_50px_rgba(254,96,47,0.08)] sm:p-9 md:flex-row"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FE602F]">
                Not sure where to start?
              </span>
              <h2 className="mt-2 text-2xl font-semibold">
                Let&apos;s map the right product journey.
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Share your workflow and we&apos;ll help identify the right
                capabilities.
              </p>
            </div>
            <button
              type="button"
              onClick={openBookDemo}
              className="brand-cta-gradient inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 font-semibold"
            >
              Book a Demo
              <ArrowRight size={17} />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
