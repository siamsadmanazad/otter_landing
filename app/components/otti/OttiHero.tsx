"use client";

import Image from "next/image";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { useMouseParallax } from "../motion/useMouseParallax";

/**
 * OttiHero — the cute Otti mascot, front and centre. A glossy otter on a soft
 * glass-glow pedestal, gently floating, with sonar ping rings (he's the signal
 * being detected) and a warm ember halo. Cursor parallax adds life. The otter
 * art is a commercially-safe open-source placeholder (public/otti) — swap for
 * the bespoke Otti Lottie/art into the same slot later.
 */
export function OttiHero() {
  const reduce = useReducedMotion();
  const { x, y } = useMouseParallax();
  const tx = useTransform(x, (v) => v * 20);
  const ty = useTransform(y, (v) => v * 16);

  return (
    <motion.div
      style={{ x: tx, y: ty }}
      className="relative mx-auto flex h-60 w-60 items-center justify-center sm:h-80 sm:w-80"
    >
      {/* Sonar ping rings. */}
      {!reduce &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full border border-signal-2/35"
            initial={{ width: 90, height: 90, opacity: 0.6 }}
            animate={{ width: 320, height: 320, opacity: 0 }}
            transition={{ duration: 3.4, repeat: Infinity, delay: i * 1.13, ease: "easeOut" }}
          />
        ))}

      {/* Static guide ring. */}
      <span className="absolute h-48 w-48 rounded-full border border-signal-1/12 sm:h-60 sm:w-60" />

      {/* Warm ember + teal glow behind Otti. */}
      <span
        aria-hidden
        className="absolute h-44 w-44 rounded-full opacity-60 blur-3xl sm:h-52 sm:w-52"
        style={{
          background:
            "radial-gradient(circle at 50% 60%, rgba(255,140,70,0.5), rgba(13,185,200,0.25) 55%, transparent 72%)",
        }}
      />

      {/* Glass pedestal + the otter, floating. */}
      <motion.div
        className="relative grid h-40 w-40 place-items-center rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm sm:h-48 sm:w-48"
        animate={reduce ? {} : { y: [0, -12, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/otti/otter_3d.png"
          alt="Otti the otter"
          width={150}
          height={150}
          priority
          className="drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] sm:scale-110"
        />
      </motion.div>
    </motion.div>
  );
}
