"use client";

import { motion } from "motion/react";

/**
 * TrailSeam — the handoff between the hero valley (Act 1 top) and the evidence
 * dossier below. Instead of a hard cut to black, the scene melts down through a
 * gradient and a single bright origin node emits a descending beam — so the
 * expedition trail reads as flowing *out of* the hero scene into the clues.
 * Scroll-revealed (no idle cost).
 */
export function TrailSeam() {
  return (
    <div aria-hidden className="pointer-events-none relative h-40 w-full overflow-hidden sm:h-52">
      {/* Tonal melt so the painted valley dissolves into the dossier's dark. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,7,13,0) 0%, rgba(5,7,13,0.55) 45%, var(--noir-950) 100%)",
        }}
      />
      {/* Origin node + descending beam, aligned to the trail's left-rail entry
          (matches EvidenceTrail's centred max-w-2xl container + 36px spine). */}
      <div className="absolute inset-0 px-6">
        <div className="relative mx-auto h-full w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-2 h-full w-px origin-top"
            style={{
              left: 36,
              background:
                "linear-gradient(to bottom, rgba(52,245,228,0.9), rgba(0,153,219,0.35) 55%, transparent)",
            }}
          />
          <motion.span
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-signal-2"
            style={{ left: 36, boxShadow: "0 0 12px 4px rgba(52,245,228,0.8), 0 0 26px 10px rgba(0,153,219,0.45)" }}
          />
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
            className="absolute bottom-5 font-mono text-[10px] uppercase tracking-[0.4em] text-signal-2/70"
            style={{ left: 60 }}
          >
            // following the trail
          </motion.p>
        </div>
      </div>
    </div>
  );
}
