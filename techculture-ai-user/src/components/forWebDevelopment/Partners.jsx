"use client";

import Marquee from "react-fast-marquee";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

const PARTNER_LOGOS = [
  {
    name: "Airbnb",
    website: "https://www.airbnb.com/",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Airbnb_Logo_B%C3%A9lo.svg",
  },
  {
    name: "GoTu",
    website: "https://gotu.com/",
    logo: "https://gotu.com/wp-content/uploads/2024/05/GoTu-Logo.svg",
  },
  {
    name: "Abra Dental",
    website: "https://abradental.com/",
    logo: "https://abradental.com/wp-content/uploads/2022/09/Asset-30@4x-1.png",
  },
  {
    name: "Aspen Dental",
    website: "https://www.aspendental.com/",
    logo: "https://images.ctfassets.net/m8zwsu9tyucg/3AZGZPc19pKGc3fcpaoyTj/5d1aecc113c6290bcef8ed2b380543c8/AspenDental_logo_RGB_Navy__1_.svg",
  },
  {
    name: "Dental365",
    website: "https://www.godental365.com/",
    logo: "https://www.godental365.com/wp-content/uploads/2025/05/cropped-Dental365-Logo.png",
  },
  {
    name: "Lakshmi Stores",
    website: "https://www.lakshmistores.com/",
    logo: "https://www.lakshmistores.com/cdn/shop/files/PSD-LS-Logo-SS_779b7b52-895c-4464-8331-57b77e4e9619.png?v=1639413648",
  },
  {
    name: "Shoppin",
    website: "https://shoppin.app/",
    logo: "https://shoppin.app/images/shoppin-full-logo.png",
  },
  {
    name: "ChemScience",
    website: "https://www.chemscience.com/",
    logo: "https://www.chemscience.com/assets/front/logo/chemscience.svg",
  },
  {
    name: "IPO Master",
    website: "https://ipomaster.com/",
    logo: "/ipo-master-logo.webp",
  },
  {
    name: "Burger King",
    website: "https://www.burgerking.com/",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Burger_King_2020.svg",
  },
  {
    name: "Bharat Demographic Research",
    website: "https://bharatdemographic.com/",
    logo: "https://bharatdemographic.com/images/logo%20bdr.jpg",
  },
  {
    name: "EZ Wealth",
    website: "https://www.ezwealth.in/",
    logo: "https://www.ezwealth.in/logo.svg",
  },
];

function getPartner(client) {
  if (typeof client === "string") {
    return {
      logo: client,
      href: client,
      name: "Technology partner",
    };
  }

  const logo = client?.logo || client?.image || client?.url || "";
  const href =
    client?.website ||
    client?.link ||
    client?.href ||
    client?.siteUrl ||
    logo;

  return {
    logo,
    href: href || "#",
    name: client?.name || client?.title || "Technology partner",
  };
}

export default function Partners() {
  const clients = PARTNER_LOGOS;

  return (
    <section className="relative overflow-hidden bg-white/40 py-14 md:py-16 backdrop-blur-[1px]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 right-1/4 h-80 w-80 rounded-full bg-[#FE602F]/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/5 h-64 w-64 rounded-full bg-[#2E3545]/8 blur-[90px]" />
      </div>

      <div className="container relative mx-auto">
        <ScrollReveal direction="up" delay={0.03} duration={0.6}>
          <h2 className="mb-8 text-center text-xl font-bold tracking-tight text-slate-700 sm:mb-10 sm:text-2xl md:text-3xl">
            Trusted by{" "}
            <span className="section-heading-accent">100+</span> brands
            worldwide
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="fade" delay={0.08} duration={0.75}>
        {clients.length > 0 ? (
          <Marquee className="marquee__" direction="left" speed={40} gradient={false}>
            {clients.map((client, index) => {
              const partner = getPartner(client);
              if (!partner.logo) return null;

              return (
                <a
                  key={`${partner.logo}-${index}`}
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={partner.name}
                  className="partner-logo-link mx-3 flex h-[80px] w-[140px] items-center justify-center bg-transparent px-2 transition hover:scale-[1.05] sm:mx-5 sm:h-[110px] sm:w-[200px] sm:px-3"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={180}
                    height={72}
                    quality={100}
                    unoptimized
                    className="partner-logo-img h-auto max-h-16 w-auto max-w-[160px] object-contain"
                    style={{
                      filter: "none",
                      WebkitFilter: "none",
                      opacity: 1,
                      mixBlendMode: "normal",
                    }}
                  />
                </a>
              );
            })}
          </Marquee>
        ) : (
          <p className="text-center text-sm text-slate-400">Loading partners…</p>
        )}
        </ScrollReveal>
      </div>
    </section>
  );
}
