"use client";

import Image from "next/image";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { useMouseParallax } from "../motion/useMouseParallax";

/**
 * OttiHero — the full-body Otti mascot holding the glowing compass. The compass's
 * cyan light is the "signal": sonar ping rings emanate from it (ties to "//
 * signal detected"). Warm + cyan glow bloom behind him, a soft ground shadow, a
 * gentle idle float, and cursor parallax. Bespoke painterly art in public/otti.
 */
export function OttiHero() {
  const reduce = useReducedMotion();
  const { x, y } = useMouseParallax();
  const tx = useTransform(x, (v) => v * 22);
  const ty = useTransform(y, (v) => v * 14);

  return (
    <motion.div
      style={{ x: tx, y: ty }}
      className="relative flex h-[34vh] max-h-[380px] min-h-[180px] sm:min-h-[240px] items-end justify-center"
    >
      {/* Soft glow bloom behind Otti (warm subject + cyan signal) — subtle, the
          painterly scene already carries the light. */}
      <span
        aria-hidden
        className="absolute bottom-[14%] h-[55%] w-[48%] rounded-full opacity-55 blur-[70px]"
        style={{
          background:
            "radial-gradient(circle at 45% 55%, rgba(255,140,70,0.40), rgba(13,185,200,0.28) 50%, transparent 72%)",
        }}
      />

      {/* Sonar rings emanating from the compass (upper-left of his chest). */}
      {!reduce &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute bottom-[42%] left-1/2 rounded-full border border-signal-2/35"
            style={{ translateX: "-115%" }}
            initial={{ width: 40, height: 40, opacity: 0.55 }}
            animate={{ width: 220, height: 220, opacity: 0 }}
            transition={{ duration: 3.4, repeat: Infinity, delay: i * 1.13, ease: "easeOut" }}
          />
        ))}

      {/* Otti, floating gently. */}
      <motion.div
        className="relative z-10"
        animate={reduce ? {} : { y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/otti/otti_hero.png"
          alt="Otti the otter, holding a glowing compass"
          width={847}
          height={1213}
          priority
          className="h-[34vh] max-h-[380px] min-h-[180px] sm:min-h-[240px] w-auto drop-shadow-[0_24px_40px_rgba(0,0,0,0.55)]"
        />
      </motion.div>

      {/* Soft ground shadow / contact glow under his feet. */}
      <span
        aria-hidden
        className="absolute bottom-[6%] h-6 w-[42%] rounded-[50%] bg-black/45 blur-xl"
      />
    </motion.div>
  );
}
