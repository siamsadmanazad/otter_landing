"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * GsapProvider — registers ScrollTrigger and drives it from the Lenis instance
 * created by <SmoothScroll> (window.__lenis). Lenis emits scroll → ScrollTrigger
 * updates; GSAP's lagSmoothing is off so scrubbed timelines track scroll exactly.
 * No-ops under reduced motion (ScrollTrigger animations resolve to end-state).
 */
export function GsapProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type LenisLike = { on: (e: string, cb: () => void) => void; off?: (e: string, cb: () => void) => void };
    const getLenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;

    let lenis = getLenis();
    const onScroll = () => ScrollTrigger.update();

    // Lenis may mount a tick after us; poll briefly until it exists.
    let tries = 0;
    const wait = setInterval(() => {
      lenis = getLenis();
      if (lenis || ++tries > 40) {
        clearInterval(wait);
        if (lenis && !reduce) lenis.on("scroll", onScroll);
        ScrollTrigger.refresh();
      }
    }, 50);

    gsap.ticker.lagSmoothing(0);

    return () => {
      clearInterval(wait);
      lenis?.off?.("scroll", onScroll);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
