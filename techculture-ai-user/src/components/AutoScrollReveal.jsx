"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SELECTOR = [
  "main.theme-main section",
  "main.theme-main article",
  "main.theme-main [data-scroll-section]",
].join(", ");

const DIRECTIONS = ["up", "fade", "scale", "up", "fade", "up"];

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function shouldSkip(el) {
  if (!el || el.nodeType !== 1) return true;
  if (el.hasAttribute("data-no-auto-reveal")) return true;
  if (el.closest("[data-manual-reveal]")) return true;
  if (el.closest("[data-no-auto-reveal]")) return true;
  if (el.classList.contains("auto-reveal")) return true;
  return false;
}

export default function AutoScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    let cancelled = false;
    let observer;
    let index = 0;

    const ensureObserver = () => {
      if (observer) return observer;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("auto-reveal--in");
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.05, rootMargin: "0px 0px 18% 0px" }
      );
      return observer;
    };

    const enhance = () => {
      if (cancelled) return;

      const nodes = Array.from(document.querySelectorAll(SELECTOR)).filter(
        (el) => !shouldSkip(el)
      );
      if (!nodes.length) return;

      const io = ensureObserver();

      nodes.forEach((el) => {
        const dir = DIRECTIONS[index % DIRECTIONS.length];
        index += 1;
        el.classList.add("auto-reveal");
        el.dataset.revealDir = dir;
        el.style.setProperty("--reveal-delay", `${((index - 1) % 4) * 45}ms`);

        const rect = el.getBoundingClientRect();
        const inView =
          rect.top < window.innerHeight * 1.05 && rect.bottom > 0;
        if (inView) {
          requestAnimationFrame(() => {
            el.classList.add("auto-reveal--in");
          });
        } else {
          io.observe(el);
        }
      });
    };

    enhance();
    const t1 = window.setTimeout(enhance, 120);
    const t2 = window.setTimeout(enhance, 450);
    // Safety: never leave content permanently invisible
    const t3 = window.setTimeout(() => {
      document.querySelectorAll(".auto-reveal:not(.auto-reveal--in)").forEach((el) => {
        el.classList.add("auto-reveal--in");
      });
    }, 1200);

    let scheduled = false;
    const mo = new MutationObserver(() => {
      if (scheduled || cancelled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        scheduled = false;
        enhance();
      });
    });
    const main = document.querySelector("main.theme-main");
    if (main) {
      mo.observe(main, { childList: true, subtree: true });
    }

    return () => {
      cancelled = true;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      mo.disconnect();
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
