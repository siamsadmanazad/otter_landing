"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * ExplorerTrail — the signature motif: a glowing dotted map-line that *draws
 * itself* as you scroll down its section, threading the page like a treasure
 * route. Place inside a `relative` section and it spans that section's height.
 * Stroke reveal is bound to scroll progress (works with Lenis via native scroll).
 */
export function ExplorerTrail({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 20%"],
  });
  // Reveal the dashed path from 0 → full as the section passes through.
  const pathLength = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0, 1]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 ${className}`}
    >
      <svg
        width="40"
        height="100%"
        viewBox="0 0 40 1000"
        preserveAspectRatio="none"
        className="h-full"
      >
        <defs>
          <linearGradient id="trailGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0099db" />
            <stop offset="100%" stopColor="#00f0e4" />
          </linearGradient>
        </defs>
        {/* The serpentine trail path. */}
        <motion.path
          d="M20 0 C 6 160, 34 320, 20 480 S 6 800, 20 1000"
          fill="none"
          stroke="url(#trailGrad)"
          strokeWidth="2"
          strokeDasharray="2 10"
          strokeLinecap="round"
          style={{ pathLength, opacity: 0.6 }}
        />
      </svg>
    </div>
  );
}
