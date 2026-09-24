"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

/** Logo palette — orange + slate only */
const C = {
  orange: "#FE602F",
  orangeDeep: "#E04E22",
  orangeSoft: "#FF7A45",
  navy: "#2E3545",
  slate: "#5C6578",
};

function IconShell({ children, size = 48, className = "" }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  );
}

function pulse(reduce, delay = 0) {
  if (reduce) return undefined;
  return {
    animate: { opacity: [0.55, 1, 0.55] },
    transition: { duration: 1.8, repeat: Infinity, delay, ease: "easeInOut" },
  };
}

export function IconOrb({ icon: Icon, size = 76, className = "" }) {
  const iconSize = Math.round(size * 0.7);
  return (
    <span
      className={`relative inline-grid place-items-center ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="absolute inset-0 rounded-2xl bg-[#fff0eb]" />
      <span className="relative z-10">
        <Icon size={iconSize} />
      </span>
    </span>
  );
}

export function AiBrainIcon({ size = 48, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <IconShell size={size} className={className}>
      <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible" fill="none">
        <circle cx="32" cy="32" r="22" stroke={C.orange} strokeWidth="3" />
        <circle cx="32" cy="32" r="10" fill={C.orange} fillOpacity="0.15" stroke={C.navy} strokeWidth="2.5" />
        <path d="M24 32h16M32 24v16" stroke={C.orange} strokeWidth="2.5" strokeLinecap="round" />
        {[
          [32, 10],
          [54, 32],
          [32, 54],
          [10, 32],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r="3.5"
            fill={i % 2 ? C.navy : C.orange}
            {...pulse(reduce, i * 0.2)}
          />
        ))}
      </svg>
    </IconShell>
  );
}

export function AiGlobeIcon({ size = 48, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <IconShell size={size} className={className}>
      <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible" fill="none">
        <circle cx="32" cy="32" r="18" stroke={C.navy} strokeWidth="2.6" />
        <ellipse cx="32" cy="32" rx="8" ry="18" stroke={C.orange} strokeWidth="2.4" />
        <path d="M14 32h36M18 23h28M18 41h28" stroke={C.slate} strokeWidth="2" strokeLinecap="round" />
        <motion.circle cx="46" cy="18" r="4" fill={C.orange} {...pulse(reduce)} />
      </svg>
    </IconShell>
  );
}

export function AiPhoneIcon({ size = 48, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <IconShell size={size} className={className}>
      <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible" fill="none">
        <rect x="20" y="8" width="24" height="48" rx="5" stroke={C.navy} strokeWidth="2.6" />
        <rect x="26" y="13" width="12" height="2.5" rx="1" fill={C.slate} />
        <motion.rect
          x="26"
          y="24"
          width="12"
          height="3"
          rx="1.5"
          fill={C.orange}
          {...pulse(reduce)}
        />
        <circle cx="32" cy="48" r="2.2" fill={C.orange} />
      </svg>
    </IconShell>
  );
}

export function AiCodeIcon({ size = 48, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <IconShell size={size} className={className}>
      <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible" fill="none">
        <path d="M26 18L12 32l14 14" stroke={C.navy} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M38 18l14 14-14 14" stroke={C.orange} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <motion.rect x="30" y="18" width="4" height="28" rx="1" fill={C.orange} {...pulse(reduce)} />
      </svg>
    </IconShell>
  );
}

export function AiPipelineIcon({ size = 48, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <IconShell size={size} className={className}>
      <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible" fill="none">
        <path d="M14 32h36" stroke={C.slate} strokeWidth="2.4" strokeLinecap="round" />
        {[16, 32, 48].map((cx, i) => (
          <circle
            key={cx}
            cx={cx}
            cy="32"
            r="7"
            stroke={i === 1 ? C.orange : C.navy}
            strokeWidth="2.6"
            fill={i === 1 ? "#FE602F22" : "transparent"}
          />
        ))}
        <motion.circle cx="32" cy="32" r="3.2" fill={C.orange} {...pulse(reduce)} />
      </svg>
    </IconShell>
  );
}

export function AiBankIcon({ size = 48, className = "" }) {
  return (
    <IconShell size={size} className={className}>
      <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible" fill="none">
        <path d="M10 26L32 12l22 14" stroke={C.orange} strokeWidth="2.8" strokeLinejoin="round" />
        <path d="M16 26v18h32V26" stroke={C.navy} strokeWidth="2.6" />
        <path d="M12 46h40" stroke={C.orange} strokeWidth="2.8" strokeLinecap="round" />
        <rect x="20" y="30" width="5" height="12" rx="1" fill={C.navy} />
        <rect x="29.5" y="30" width="5" height="12" rx="1" fill={C.orange} />
        <rect x="39" y="30" width="5" height="12" rx="1" fill={C.orangeSoft} />
      </svg>
    </IconShell>
  );
}

export function AiLayersIcon({ size = 48, className = "" }) {
  return (
    <IconShell size={size} className={className}>
      <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible" fill="none">
        <path d="M8 22L32 12l24 10-24 10L8 22z" stroke={C.slate} strokeWidth="2.4" fill="#5C657818" />
        <path d="M8 32L32 22l24 10-24 10L8 32z" stroke={C.orange} strokeWidth="2.6" fill="#FE602F22" />
        <path d="M8 42L32 32l24 10-24 10L8 42z" stroke={C.navy} strokeWidth="2.4" fill="#2E354518" />
      </svg>
    </IconShell>
  );
}

export function AiNetworkIcon({ size = 48, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <IconShell size={size} className={className}>
      <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible" fill="none">
        <path d="M32 18v8M32 38v8M20 44l8-6M36 38l8 6M20 20l8 6M36 26l8-6" stroke={C.slate} strokeWidth="2.2" strokeLinecap="round" />
        <motion.circle cx="32" cy="32" r="6" fill={C.orange} {...pulse(reduce)} />
        <circle cx="32" cy="14" r="4.5" stroke={C.navy} strokeWidth="2.4" />
        <circle cx="16" cy="46" r="4.5" stroke={C.orange} strokeWidth="2.4" />
        <circle cx="48" cy="46" r="4.5" stroke={C.navy} strokeWidth="2.4" />
      </svg>
    </IconShell>
  );
}

export function AiShieldIcon({ size = 48, className = "" }) {
  return (
    <IconShell size={size} className={className}>
      <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible" fill="none">
        <path
          d="M32 8l18 7v14c0 12-8 20-18 24C22 49 14 41 14 29V15l18-7z"
          stroke={C.navy}
          strokeWidth="2.6"
          fill="#2E354512"
        />
        <path d="M24 32l6 6 12-14" stroke={C.orange} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </IconShell>
  );
}

export function AiBuildingIcon({ size = 48, className = "" }) {
  const reduce = useReducedMotion();
  const lights = [C.orange, C.navy, C.orangeSoft, C.slate, C.orange, C.navy, C.orangeSoft, C.slate, C.orange];
  return (
    <IconShell size={size} className={className}>
      <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible" fill="none">
        <rect x="16" y="12" width="32" height="40" rx="2" stroke={C.navy} strokeWidth="2.6" />
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <motion.rect
              key={`${row}-${col}`}
              x={22 + col * 8}
              y={18 + row * 9}
              width="5"
              height="5"
              rx="1"
              fill={lights[row * 3 + col]}
              {...pulse(reduce, (row * 3 + col) * 0.12)}
            />
          ))
        )}
      </svg>
    </IconShell>
  );
}

export function AiNeuralDecor({ className = "" }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 800 400"
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`neural-a-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.orange} stopOpacity="0.35" />
          <stop offset="100%" stopColor={C.navy} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path
        d="M40 80C120 40 200 140 280 100S440 20 520 90s160 140 240 100"
        stroke={`url(#neural-a-${uid})`}
        strokeWidth="1.5"
      />
      <circle cx="120" cy="70" r="4" fill={C.orange} />
      <circle cx="280" cy="100" r="4" fill={C.navy} />
      <circle cx="520" cy="90" r="4" fill={C.orange} />
    </svg>
  );
}

export function AiSparkCluster({ className = "" }) {
  const reduce = useReducedMotion();
  const sparks = [
    { x: 0, y: 8, c: C.orange },
    { x: 18, y: 0, c: C.navy },
    { x: 32, y: 14, c: C.orangeSoft },
  ];
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden>
      {sparks.map((s, i) => (
        <motion.span
          key={i}
          className="absolute block h-1.5 w-1.5 rounded-full"
          style={{ left: s.x, top: s.y, backgroundColor: s.c }}
          {...pulse(reduce, i * 0.2)}
        />
      ))}
    </div>
  );
}
