"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * Parallax — shifts its children vertically as the page scrolls, at a fraction
 * of scroll speed (`speed`). Negative speed = moves up faster (foreground);
 * positive = lags behind (background). Used to put hero elements on distinct
 * depth planes. Reduced-motion is respected (useScroll resolves to no shift via
 * the global CSS guard + the small ranges).
 */
export function Parallax({
  children,
  speed = -40,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
