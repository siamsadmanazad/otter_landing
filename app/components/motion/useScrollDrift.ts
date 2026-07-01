"use client";

import { useEffect } from "react";
import { useMotionValue, useTransform, useReducedMotion, type MotionValue } from "motion/react";

type LenisLike = { on: (e: string, cb: () => void) => void; off?: (e: string, cb: () => void) => void };

/**
 * useScrollDrift — maps how far the page has scrolled since a ref'd element's
 * natural top entered view onto an output range (an up/down parallax drift).
 *
 * Uses raw window.scrollY rather than the element's own live bounding rect:
 * once GSAP ScrollTrigger pins an ancestor (see CinematicScene), the pinned
 * element's rect freezes for the whole pinned duration, which would silently
 * stall a rect-based scroll tracker. Raw scrollY keeps advancing throughout
 * the pin (driven by ScrollTrigger's pin-spacer), so this keeps working.
 */
export function useScrollDrift<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  outputRange: [number, number],
  distancePx?: number
): MotionValue<number> {
  const reduce = useReducedMotion();
  const raw = useMotionValue(0);
  const drift = useTransform(
    raw,
    [0, distancePx ?? (typeof window !== "undefined" ? window.innerHeight * 0.8 : 800)],
    outputRange
  );

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    let start = 0;
    const measure = () => {
      start = window.scrollY + el.getBoundingClientRect().top;
    };
    const onScroll = () => raw.set(Math.max(0, window.scrollY - start));

    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);

    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    lenis?.on?.("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      lenis?.off?.("scroll", onScroll);
    };
  }, [ref, raw, reduce]);

  return drift;
}
