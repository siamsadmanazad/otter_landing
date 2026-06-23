"use client";

import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * SceneLayer — one parallax plane in a cinematic scene. `depth` (0 = far/static,
 * 1 = near/fast) drives a GSAP-scrubbed vertical drift + subtle scale as the
 * scene scrolls past. The child is a DROP-IN ART SLOT: a procedural node now, an
 * <Image>/Lottie later — no refactor. On mobile (or `hideOnMobile`) the layer can
 * opt out to keep the scene light. Reduced motion = no transform.
 */
export function SceneLayer({
  children,
  depth = 0.5,
  className = "",
  hideOnMobile = false,
}: {
  children: ReactNode;
  depth?: number;
  className?: string;
  hideOnMobile?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (hideOnMobile && window.matchMedia("(max-width: 640px)").matches) return;

    // Nearer layers travel further; far layers barely move (depth → range).
    const range = -120 * depth;
    const scaleTo = 1 + 0.06 * depth;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -range * 0.15, scale: 1 },
        {
          yPercent: range * 0.15,
          scale: scaleTo,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [depth, hideOnMobile]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 will-change-transform ${
        hideOnMobile ? "hidden sm:block" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
