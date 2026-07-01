"use client";

import { motion, useReducedMotion } from "motion/react";
import { RevealOnScroll } from "../../components/motion/RevealOnScroll";

/**
 * JoinCause — the bridge between the form and the Camp story. The form now
 * leads the page, so without a hook here visitors who've just submitted (or
 * skipped) it have no reason to keep scrolling through what would otherwise
 * be the pinned scene's empty scroll runway.
 */
export function JoinCause() {
  const reduce = useReducedMotion();

  return (
    <div className="relative z-10 flex flex-col items-center px-6 py-24 text-center">
      <RevealOnScroll>
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-signal-2/80 sm:text-sm">
          // the journey continues
        </p>
        <h2 className="text-balance text-4xl font-extrabold tracking-tight sm:text-6xl">
          Join Our Cause
        </h2>
        <p className="mx-auto mt-5 max-w-md font-mono text-base leading-relaxed text-ink-soft sm:text-lg">
          A founder number is just the start. Scroll on to see the world
          you&apos;re helping Otti build — and why it&apos;s worth chasing.
        </p>
      </RevealOnScroll>

      <motion.div
        aria-hidden
        className="mt-10 flex flex-col items-center gap-1.5 text-signal-2/70"
        animate={reduce ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.4em]">keep scrolling</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    </div>
  );
}
