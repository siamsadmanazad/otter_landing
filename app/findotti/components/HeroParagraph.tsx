"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * HeroParagraph — the hero's lead-in copy. Brighter than the old muted
 * ink-soft tone, with a slow breathing cyan glow (text-shadow) so it reads
 * as "clear and alive" rather than flat body text competing with the bold
 * white headline above it.
 */
export function HeroParagraph() {
  const reduce = useReducedMotion();
  const glow = [
    "0 2px 8px rgba(0,0,0,0.8), 0 0 14px rgba(150,235,240,0.18)",
    "0 2px 8px rgba(0,0,0,0.8), 0 0 24px rgba(150,235,240,0.42)",
    "0 2px 8px rgba(0,0,0,0.8), 0 0 14px rgba(150,235,240,0.18)",
  ];

  return (
    <motion.p
      className="mx-auto mt-5 max-w-lg font-mono text-base leading-relaxed text-ink sm:max-w-2xl sm:text-lg"
      style={reduce ? { textShadow: glow[0] } : undefined}
      animate={reduce ? {} : { textShadow: glow }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
    >
      Otti wasn&apos;t searching alone. He was searching for the first
      explorers who would help build a global home for explorers.{" "}
      <span className="font-semibold text-white">Today, you found him.</span>
    </motion.p>
  );
}
