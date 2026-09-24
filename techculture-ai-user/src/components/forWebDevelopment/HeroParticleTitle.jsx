"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/context/ThemeContext";

const ParticleText = dynamic(() => import("@/components/ParticleText"), {
  ssr: false,
});

const titleClass =
  "text-[clamp(1.85rem,4.5vw,3.15rem)] font-bold leading-[1.15] tracking-tight text-[var(--theme-heading)]";

export default function HeroParticleTitle() {
  const { theme, themeId } = useTheme();

  const headingColor = theme.colors.heading;

  return (
    <div className="hero-particle-title mb-8 lg:mb-10 w-full max-w-2xl">
      <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--theme-border)] bg-[var(--theme-surface)]/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--theme-accent-label)] shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--theme-accent)]" />
        Premium Fintech Solutions
      </p>

      <h1 className={titleClass}>Digital Solutions Built for</h1>

      <div className="hero-particle-accent relative mt-0 w-full bg-transparent">
        <div
          className={`relative w-full ${titleClass}`}
          style={{ height: "clamp(2.6rem, 5.2vw, 3.65rem)" }}
        >
          <ParticleText
            key={themeId}
            text="Financial Growth"
            particleSize={4.2}
            density={1}
            color={headingColor}
            highlightColor={headingColor}
            scatter={80}
            gatherDuration={1200}
            stagger={200}
            pointerRepel={18}
            repelRadius={70}
            idleDrift={0.12}
            trigger="mount"
            fontSize="clamp(1.85rem, 4.5vw, 3.15rem)"
            fontWeight={700}
            fontFamily="inherit"
            glow={false}
            className="hero-particle-canvas"
            style={{ width: "100%", height: "100%", background: "transparent" }}
          />
        </div>
      </div>
    </div>
  );
}
