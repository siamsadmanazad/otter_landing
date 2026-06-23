"use client";

import Image from "next/image";
import { motion, useTransform, useReducedMotion } from "motion/react";
import { useMouseParallax } from "../motion/useMouseParallax";

/**
 * FloatingCharms — cute themed companions (compass, map, star, trophy) drifting
 * around the hero on their own parallax depths with gentle idle bob. Adds warmth
 * and "expedition" character. Hidden on small screens to keep mobile clean.
 * Open-source placeholder art (public/otti, MIT).
 */
type Charm = {
  src: string;
  alt: string;
  size: number;
  className: string; // position
  depth: number; // cursor parallax px
  delay: number;
};

const CHARMS: Charm[] = [
  { src: "/otti/compass_3d.png", alt: "compass", size: 54, className: "left-[12%] top-[26%]", depth: 28, delay: 0 },
  { src: "/otti/map_3d.png", alt: "map", size: 60, className: "right-[12%] top-[20%]", depth: 20, delay: 0.6 },
  { src: "/otti/star_3d.png", alt: "star", size: 38, className: "right-[20%] bottom-[26%]", depth: 36, delay: 1.1 },
  { src: "/otti/compass_3d.png", alt: "", size: 32, className: "left-[20%] bottom-[24%]", depth: 16, delay: 0.3 },
];

export function FloatingCharms() {
  const reduce = useReducedMotion();
  const { x, y } = useMouseParallax();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
      {CHARMS.map((c, i) => (
        <Charm key={i} charm={c} px={x} py={y} reduce={!!reduce} />
      ))}
    </div>
  );
}

function Charm({
  charm,
  px,
  py,
  reduce,
}: {
  charm: Charm;
  px: ReturnType<typeof useMouseParallax>["x"];
  py: ReturnType<typeof useMouseParallax>["y"];
  reduce: boolean;
}) {
  const tx = useTransform(px, (v) => v * charm.depth);
  const ty = useTransform(py, (v) => v * charm.depth * 0.6);
  return (
    <motion.div className={`absolute ${charm.className}`} style={{ x: tx, y: ty }}>
      <motion.div
        animate={reduce ? {} : { y: [0, -10, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 6 + charm.delay, repeat: Infinity, ease: "easeInOut", delay: charm.delay }}
        className="opacity-80 drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
      >
        <Image src={charm.src} alt={charm.alt} width={charm.size} height={charm.size} />
      </motion.div>
    </motion.div>
  );
}
