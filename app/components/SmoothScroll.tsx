"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { isLitePerf } from "@/lib/perfTier";

/**
 * SmoothScroll — wraps the app in Lenis inertia smooth-scroll (the biggest single
 * "premium feel" upgrade). Disabled automatically when the user prefers reduced
 * motion, and on devices flagged `lite` (see lib/perfTier.ts) — JS-driven scroll
 * is one of the more failure-prone effects on weak/old hardware, and native
 * scroll is a completely safe fallback. GSAP ScrollTrigger (added later) will
 * hook into Lenis' raf loop.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || isLitePerf()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Landing directly on a hash URL (e.g. /founders#join from a cross-page
    // link): the browser's native jump happens before Lenis takes over, and
    // Lenis's own scroll-position tracking would otherwise snap back to
    // wherever it thinks scroll is (usually the top) on its next tick. Sync
    // it to the hash target immediately once it exists.
    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) lenis.scrollTo(target, { immediate: true });
    }

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Don't run the scroll rAF in a hidden tab (no scrolling happens there).
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Expose for later modules (GSAP ScrollTrigger sync).
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
