"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { useMouseParallax } from "../../components/motion/useMouseParallax";
import { useScrollDrift } from "../../components/motion/useScrollDrift";

/**
 * CampHeadline — the lead-in line above Otti: "Become one of the first / 1000".
 * "Founding Explorers" now flanks Otti directly (see CampFlankRow) so he stands
 * fully visible, undimmed, dead centre — nothing overlaps him. This block still
 * gets its own cursor-parallax + scroll-drift so it feels alive independently
 * of Otti and the flanking words. "1000" breathes a slow glow on its own timer.
 */
export function CampHeadline() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { x, y } = useMouseParallax();
  const txMouse = useTransform(x, (v) => v * -10);
  const tyMouse = useTransform(y, (v) => v * -6);
  const tyScroll = useScrollDrift(ref, [0, -50]);
  const ty = useTransform(() => tyMouse.get() + tyScroll.get());

  return (
    <motion.div
      ref={ref}
      style={{ x: txMouse, y: ty }}
      className="w-full text-pretty text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
    >
      <span className="block">Become one of the first</span>
      <motion.span
        className="mt-1 block text-7xl leading-none text-treasure drop-shadow-[0_6px_30px_rgba(255,122,69,0.5)] sm:text-8xl md:text-9xl"
        animate={reduce ? {} : { scale: [1, 1.02, 1], opacity: [0.92, 1, 0.92] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        1000
      </motion.span>
    </motion.div>
  );
}
