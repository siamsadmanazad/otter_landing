"use client";

import Image from "next/image";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { useMouseParallax } from "../motion/useMouseParallax";

/**
 * OttiStage — a reusable slot for an Otti pose in any act (invite, celebrate…).
 * Warm+cyan glow bloom, soft ground shadow, gentle idle float, cursor parallax.
 * Renders NOTHING until the pose art exists (graceful slot) — so scenes can be
 * scaffolded now and the art drops in later with zero code change.
 */
export function OttiStage({
  src,
  alt = "Otti",
  heightClass = "h-[30vh] max-h-[320px] min-h-[150px] sm:min-h-[200px]",
  width = 847,
  height = 1213,
  priority = false,
}: {
  src?: string;
  alt?: string;
  heightClass?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  const reduce = useReducedMotion();
  const { x, y } = useMouseParallax();
  const tx = useTransform(x, (v) => v * 18);
  const ty = useTransform(y, (v) => v * 12);

  if (!src) return null; // graceful: slot empty until the pose is generated

  return (
    <motion.div
      style={{ x: tx, y: ty }}
      className={`relative flex items-end justify-center ${heightClass}`}
    >
      <span
        aria-hidden
        className="absolute bottom-[14%] h-[52%] w-[46%] rounded-full opacity-55 blur-[64px]"
        style={{
          background:
            "radial-gradient(circle at 45% 55%, rgba(255,140,70,0.40), rgba(13,185,200,0.26) 50%, transparent 72%)",
        }}
      />
      <motion.div
        className="relative z-10"
        animate={reduce ? {} : { y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className={`${heightClass} w-auto drop-shadow-[0_22px_38px_rgba(0,0,0,0.55)]`}
        />
      </motion.div>
      <span
        aria-hidden
        className="absolute bottom-[6%] h-5 w-[40%] rounded-[50%] bg-black/45 blur-xl"
      />
    </motion.div>
  );
}
