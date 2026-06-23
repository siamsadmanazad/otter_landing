"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * OttiHero — placeholder mascot for L1. Until the Otti Lottie/art is supplied,
 * this is a *radar signal* visual (on-theme for "// signal detected"): a teal
 * blip with concentric sonar ping rings + a gentle float. When the Lottie
 * lands, swap the inner core for <Lottie .../> and keep the rings.
 */
export function OttiHero() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto flex h-56 w-56 items-center justify-center sm:h-72 sm:w-72">
      {/* Sonar ping rings. */}
      {!reduce &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full border border-signal-2/40"
            initial={{ width: 64, height: 64, opacity: 0.7 }}
            animate={{ width: 280, height: 280, opacity: 0 }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              delay: i * 1.06,
              ease: "easeOut",
            }}
          />
        ))}

      {/* Static faint guide ring (for reduced motion too). */}
      <span className="absolute h-44 w-44 rounded-full border border-signal-1/15 sm:h-56 sm:w-56" />

      {/* The blip core — Otti's location. */}
      <motion.div
        className="relative grid h-28 w-28 place-items-center rounded-full bg-signal glow-signal sm:h-32 sm:w-32"
        animate={reduce ? {} : { y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Replace with the Otti Lottie when available. */}
        <span className="select-none text-5xl" aria-hidden>
          🦦
        </span>
        <span className="absolute inset-0 rounded-full bg-noir-950/10" />
      </motion.div>
    </div>
  );
}
