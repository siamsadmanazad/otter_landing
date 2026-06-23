"use client";

import { motion } from "motion/react";

/**
 * RevealOnScroll — the house "materialize" entrance (opacity + rise + slight
 * blur-out→in), per the Expedition Noir motion DNA ("weight, not bounce").
 * Reused across every act. Reduced-motion is handled globally + by Framer.
 */
export function RevealOnScroll({
  children,
  delay = 0,
  y = 14,
  className = "",
  once = true,
  immediate = false,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  /** Above-the-fold (hero) content: animate in on mount instead of on scroll,
   *  so it never depends on the IntersectionObserver firing (no blank flash). */
  immediate?: boolean;
}) {
  const reveal = { opacity: 1, y: 0, filter: "blur(0px)" };
  const initial = { opacity: 0, y, filter: "blur(6px)" };
  const transition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay };

  if (immediate) {
    return (
      <motion.div initial={initial} animate={reveal} transition={transition} className={className}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={initial}
      whileInView={reveal}
      viewport={{ once, margin: "-10%" }}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
