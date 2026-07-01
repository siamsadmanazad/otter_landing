"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * TrailResolve — the trail's terminus. The neon line curves in from the left rail
 * toward centre, gathers to a bright point, and BLOOMS into the countdown console:
 * the console's frame (top hairline + signal border) draws itself in as the light
 * arrives, so the route "becomes" the console. Scroll-driven; the children (the
 * countdown content) stay readable throughout — only the framing animates.
 */
export function TrailResolve({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 80%"],
  });

  // Whole sequence compressed into the first ~60% of the tracked range (was
  // stretched to 0.96) — the countdown content itself has no reveal delay, so
  // the frame needs to fully resolve well before a reader would naturally
  // stop scrolling, or it reads as a broken/incomplete border, not "the
  // console still forming." The remaining ~40% is a stable, fully-framed rest.
  const pathLength = useTransform(scrollYProgress, [0, 0.4], [reduce ? 1 : 0, 1]);
  // The gather point blooms as the curve lands.
  const gatherOpacity = useTransform(scrollYProgress, [0.28, 0.4, 0.58, 0.65], [0, 1, 1, 0]);
  const gatherScale = useTransform(scrollYProgress, [0.32, 0.45], [0.4, 1]);
  // The console frame draws in.
  const hairlineScaleX = useTransform(scrollYProgress, [0.35, 0.6], [reduce ? 1 : 0, 1]);
  const borderOpacity = useTransform(scrollYProgress, [0.35, 0.6], [reduce ? 1 : 0, 1]);

  return (
    <div ref={ref} className="flex w-full flex-col items-center">
      {/* Connector: curves from the trail's left rail toward centre. */}
      <div aria-hidden className="relative mx-auto h-20 w-full max-w-2xl">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
          <defs>
            <linearGradient id="resolveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0099db" stopOpacity="0" />
              <stop offset="40%" stopColor="#0099db" />
              <stop offset="100%" stopColor="#34f5e4" />
            </linearGradient>
          </defs>
          <motion.path
            d="M6 0 C 6 56, 50 44, 50 100"
            fill="none"
            stroke="url(#resolveGrad)"
            strokeWidth={2}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength }}
          />
        </svg>
        {/* Gather point — the bright bloom where the light condenses. */}
        <motion.span
          className="absolute left-1/2 bottom-0 h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#eafffd]"
          style={{
            opacity: gatherOpacity,
            scale: gatherScale,
            boxShadow: "0 0 12px 4px rgba(52,245,228,0.85), 0 0 26px 11px rgba(0,153,219,0.45)",
          }}
        />
      </div>

      {/* The console — bg/blur static for readability; the signal frame draws in.
          max-w-3xl (was max-w-xl/576px — too narrow: the countdown row needs
          ~540-580px on its own at full size, so with side padding subtracted
          the cells were overflowing past the edges and getting clipped by
          this box's own overflow-hidden). */}
      <div className="relative w-full max-w-3xl">
        <div
          className="relative w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-noir-900/55 px-4 py-10 backdrop-blur-xl sm:px-12 sm:py-12"
          style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.45)" }}
        >
          {/* Signal top hairline — sweeps outward from centre as the light lands. */}
          <motion.span
            aria-hidden
            className="absolute inset-x-10 top-0 h-px origin-center"
            style={{
              scaleX: hairlineScaleX,
              background: "linear-gradient(90deg, transparent, rgba(52,245,228,0.8), transparent)",
            }}
          />
          {children}
        </div>
        {/* Signal border that glows in as the frame resolves. */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl border border-signal-2/30"
          style={{ opacity: borderOpacity, boxShadow: "0 0 30px rgba(52,245,228,0.10)" }}
        />
      </div>
    </div>
  );
}
