"use client";

import { useEffect } from "react";
import { useMotionValue, type MotionValue } from "motion/react";

/**
 * useScrollProgress — a robust 0→1 page-scroll progress MotionValue.
 *
 * Why not motion's useScroll? This page pins the hero via GSAP ScrollTrigger,
 * which mutates the document height (pin-spacer) after mount. motion's useScroll
 * caches scroll dimensions and can desync from that change, so its progress never
 * reaches 1 at the true bottom — the chapter meter + top bar then under-report.
 *
 * Instead we recompute from the LIVE scroll position on every scroll tick using
 * the current scrollHeight, so the denominator is always correct regardless of
 * pin-spacers, late-loading images, or layout shifts. Lenis drives native scroll,
 * so a passive window 'scroll' listener catches it; we also hook Lenis directly
 * and re-measure briefly while the layout settles.
 */
type LenisLike = { on: (e: string, cb: () => void) => void; off?: (e: string, cb: () => void) => void };

export function useScrollProgress(): MotionValue<number> {
  const progress = useMotionValue(0);

  useEffect(() => {
    const se = document.scrollingElement || document.documentElement;
    const compute = () => {
      const max = se.scrollHeight - window.innerHeight;
      progress.set(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);

    // Lenis may mount a tick later (GsapProvider polls for it); attach when ready.
    let lenis: LenisLike | undefined;
    const attachLenis = () => {
      lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
      if (lenis) lenis.on("scroll", compute);
    };
    attachLenis();

    // Re-measure while the layout settles (Lenis mount, ScrollTrigger pin-spacer,
    // image loads) so the meter is accurate once the cinematic scene is built.
    const settle = setInterval(() => {
      if (!lenis) attachLenis();
      compute();
    }, 250);
    const stopSettle = setTimeout(() => clearInterval(settle), 4000);

    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
      lenis?.off?.("scroll", compute);
      clearInterval(settle);
      clearTimeout(stopSettle);
    };
  }, [progress]);

  return progress;
}
