"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Hero from "@/components/forWebDevelopment/Hero";
import Partners from "@/components/forWebDevelopment/Partners";
import Testimonials from "@/components/forWebDevelopment/Testimonials";
import Contact from "@/components/forWebDevelopment/Contact";
import EcosystemsSection from "@/components/EcosystemsSection";
import MiddlewareTeaser from "@/components/forWebDevelopment/MiddlewareTeaser";
import SupportShowcase from "@/components/forWebDevelopment/SupportShowcase";
import ScrollReveal from "@/components/ScrollReveal";

const PhoneCarousel = dynamic(
  () => import("@/components/forWebDevelopment/PhoneCarousel"),
  { ssr: false }
);

export default function BankingFintechPage() {
  return (
    <div className="relative">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <Image
          src="/hero-office-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-white/92 via-white/82 to-white/55" />
        <div className="absolute inset-0 bg-linear-to-b from-white/70 via-transparent to-white/90" />
      </div>

      <div className="relative z-10">
        <section id="home" className="scroll-mt-24">
          <Hero />
        </section>

        <ScrollReveal direction="up" delay={0.04} duration={0.75}>
          <EcosystemsSection variant="webdevelopment" />
        </ScrollReveal>

        <ScrollReveal direction="left" delay={0.06} duration={0.75}>
          <MiddlewareTeaser />
        </ScrollReveal>

        <ScrollReveal direction="scale" delay={0.05} duration={0.8}>
          <PhoneCarousel />
        </ScrollReveal>

        <ScrollReveal direction="right" delay={0.06} duration={0.75}>
          <SupportShowcase />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.05} duration={0.75}>
          <section id="testimonials" className="scroll-mt-24">
            <Testimonials />
          </section>
        </ScrollReveal>

        <ScrollReveal direction="fade" delay={0.04} duration={0.7}>
          <section id="clients" className="scroll-mt-24">
            <Partners />
          </section>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.06} duration={0.75}>
          <section id="contact" className="scroll-mt-24 relative z-0 pb-8">
            <Contact />
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
