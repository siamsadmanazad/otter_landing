"use client";

import { motion } from "motion/react";

const CLUES = [
  "Loves hidden places",
  "Appears near explorers",
  "Carries mysterious maps",
  "Never stays in one place",
];

/**
 * ClueList — "What do we know about Otti?" Evidence-log styling: each clue
 * materializes (blur → sharp + rise) on scroll into view, staggered, prefixed
 * with a mono check, like a case file being assembled.
 */
export function ClueList() {
  return (
    <div className="mx-auto w-full max-w-md">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-6 text-center font-mono text-xs uppercase tracking-[0.3em] text-ink-faint"
      >
        // what do we know about Otti?
      </motion.p>

      <ul className="space-y-3">
        {CLUES.map((clue, i) => (
          <motion.li
            key={clue}
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.12 }}
            className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-noir-800/40 px-5 py-4 backdrop-blur-[var(--fx-glass-sm)]"
          >
            <span className="text-signal-2" aria-hidden>
              ✓
            </span>
            <span className="text-sm text-ink-soft sm:text-base">{clue}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
