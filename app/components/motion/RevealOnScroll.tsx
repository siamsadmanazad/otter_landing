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
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-10%" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
