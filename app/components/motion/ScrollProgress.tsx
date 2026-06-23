"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * ScrollProgress — a thin signal-gradient bar pinned to the top, bound to page
 * scroll. The quiet "you're being guided" reading indicator.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="bg-signal fixed inset-x-0 top-0 z-50 h-[2px] origin-left"
    />
  );
}
