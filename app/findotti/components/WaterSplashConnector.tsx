"use client";

import { motion, useReducedMotion } from "motion/react";

const RIPPLES = [
  { left: "12%", delay: 0, scale: 0.85 },
  { left: "28%", delay: 0.9, scale: 1 },
  { left: "45%", delay: 1.7, scale: 0.75 },
  { left: "62%", delay: 0.5, scale: 0.95 },
  { left: "80%", delay: 1.3, scale: 0.8 },
  { left: "93%", delay: 2.1, scale: 0.7 },
];
const DROPLETS = [16, 30, 42, 55, 68, 82];

/**
 * WaterSplashConnector — a lightweight (CSS/motion only, no canvas) ripple +
 * droplet band bridging the hero's painted river into TrailGenesis's water
 * below, so the cut between scenes reads as the river continuing to flow
 * rather than a hard edit. Sits at the seam (pulled up into the hero's bottom
 * edge by the negative margin in page.tsx).
 */
export function WaterSplashConnector() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none relative h-20 w-full overflow-hidden sm:h-28">
      {/* Bright waterline, gently shimmering. */}
      <motion.div
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent 6%, rgba(150,235,240,0.6) 50%, transparent 94%)",
        }}
        animate={reduce ? {} : { opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Splash ripples — expanding rings "popping" along the waterline. */}
      {!reduce &&
        RIPPLES.map((r, i) => (
          <motion.span
            key={i}
            className="absolute top-1/2 rounded-[50%] border border-signal-2/50"
            style={{ left: r.left, translateX: "-50%", translateY: "-50%" }}
            initial={{ width: 6, height: 6, opacity: 0.8 }}
            animate={{ width: 90 * r.scale, height: 32 * r.scale, opacity: 0 }}
            transition={{ duration: 2.2, repeat: Infinity, delay: r.delay, ease: "easeOut" }}
          />
        ))}

      {/* A few droplet glints for sparkle. */}
      {!reduce &&
        DROPLETS.map((left, i) => (
          <motion.span
            key={`d${i}`}
            className="absolute top-1/2 h-1.5 w-1.5 rounded-full bg-[#bff7f2]"
            style={{ left: `${left}%`, boxShadow: "0 0 6px 1px rgba(150,235,240,0.7)" }}
            animate={{ y: [0, -16, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.35, ease: "easeOut" }}
          />
        ))}
    </div>
  );
}
