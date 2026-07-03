"use client";

import { motion } from "motion/react";

const BENEFITS = [
  "Permanent Founding Explorer Badge",
  "Lifetime Early Supporter Status",
  "Private Founders Community",
  "Help Shape Future Features",
  "Founder-only Experiences & Events",
];

/**
 * BenefitsList — the five founder perks, revealed as a staggered "charter being
 * granted": each line materializes (blur→sharp + rise) with a warm-gold check.
 */
export function BenefitsList() {
  return (
    <ul className="mx-auto grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      {BENEFITS.map((b, i) => {
        // The first perk is the headline reward — spans full width, warmer glow.
        const hero = i === 0;
        return (
          <motion.li
            key={b}
            initial={{ opacity: 0, x: -14, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
            className={`flex items-center gap-5 rounded-2xl border px-6 py-4 backdrop-blur-[var(--fx-glass-sm)] sm:px-7 sm:py-5 ${
              hero
                ? "border-treasure/30 bg-treasure/[0.08] shadow-[0_10px_40px_rgba(255,179,71,0.10)] sm:col-span-2"
                : "border-treasure/15 bg-noir-800/40"
            }`}
          >
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm text-treasure sm:h-8 sm:w-8 ${
                hero ? "bg-treasure/25" : "bg-treasure/15"
              }`}
            >
              ✓
            </span>
            <span
              className={`text-ink-soft ${
                hero ? "text-lg font-semibold text-ink sm:text-xl" : "text-base sm:text-lg"
              }`}
            >
              {b}
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}
