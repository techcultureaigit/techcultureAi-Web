"use client";

import { motion, useReducedMotion } from "motion/react";

const presets = {
  up: { hidden: { opacity: 0, y: 44 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -32 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -48 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 48 }, visible: { opacity: 1, x: 0 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const ease = [0.22, 1, 0.36, 1];

export function ScrollRevealItem({
  children,
  className = "",
  as = "div",
  direction = "up",
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] || motion.div;
  const preset = presets[direction] || itemVariants;

  if (reduceMotion) {
    const StaticTag = as === "section" ? "section" : "div";
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: preset.hidden,
        visible: {
          ...preset.visible,
          transition: { duration: 0.55, ease },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}

export default function ScrollReveal({
  children,
  className = "",
  as = "div",
  direction = "up",
  delay = 0,
  duration = 0.7,
  once = true,
  amount = 0.16,
  stagger = 0,
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] || motion.div;
  const preset = presets[direction] || presets.up;

  if (reduceMotion) {
    const StaticTag = as === "section" ? "section" : "div";
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  const useStagger = stagger > 0;
  const parentHidden = useStagger
    ? { opacity: 0, ...(preset.hidden.y != null ? { y: 18 } : {}), ...(preset.hidden.x != null ? { x: preset.hidden.x > 0 ? 18 : -18 } : {}) }
    : preset.hidden;

  return (
    <MotionTag
      className={className}
      data-manual-reveal=""
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: "0px 0px -8% 0px" }}
      variants={{
        hidden: parentHidden,
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: {
            duration: useStagger ? Math.min(duration, 0.55) : duration,
            delay,
            ease,
            ...(useStagger
              ? { staggerChildren: stagger, delayChildren: delay || 0.06 }
              : {}),
          },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}
