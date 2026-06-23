"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "motion/react";
import { LeafCluster } from "./FoliageFrame";

/**
 * TrailInterlude — the held breath between the clues ("what we know") and the
 * countdown ("something is coming"). Otti's glowing paw-prints descend the
 * centre and vanish into a dense night thicket, igniting one-by-one as you
 * scroll — the trail goes quiet, but the tracks lead on. Fills the dead gap with
 * narrative, not clutter; the darkness stays the point. Paws ignite on scroll
 * (cheap); foliage is static SVG (~0 GPU). Desktop-only.
 */

// Paw-prints: descending the centre with a walking gait (alternating x), each
// smaller + fainter into the distance. `at` = scroll fraction it ignites.
const PAWS = [
  { x: -30, top: 8, s: 1.0, rot: -10, at: 0.16 },
  { x: 26, top: 26, s: 0.9, rot: 9, at: 0.3 },
  { x: -22, top: 44, s: 0.78, rot: -8, at: 0.44 },
  { x: 18, top: 62, s: 0.64, rot: 7, at: 0.58 },
  { x: -12, top: 79, s: 0.52, rot: -6, at: 0.72 },
];

export function TrailInterlude() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });

  return (
    <div ref={ref} className="relative mx-auto h-[56vh] min-h-[420px] w-full max-w-3xl overflow-hidden">
      {/* Dense night thicket the tracks vanish into — layered leaf clusters. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
        {/* far, blurred, dark back row */}
        <div className="absolute -bottom-4 left-[6%] h-[34vh] w-[26vw] max-w-[340px] opacity-45 blur-[3px]"><LeafCluster /></div>
        <div className="absolute -bottom-4 left-[30%] h-[40vh] w-[28vw] max-w-[360px] opacity-40 blur-[4px]"><LeafCluster /></div>
        <div className="absolute -bottom-4 right-[8%] h-[34vh] w-[26vw] max-w-[340px] -scale-x-100 opacity-45 blur-[3px]"><LeafCluster /></div>
        {/* near, crisper front row — denser, taller, overlapping toward centre */}
        <div className="absolute -bottom-8 -left-10 h-[44vh] w-[30vw] max-w-[400px] opacity-90"><LeafCluster /></div>
        <div className="absolute -bottom-10 left-[22%] h-[50vh] w-[30vw] max-w-[400px] opacity-85"><LeafCluster /></div>
        <div className="absolute -bottom-10 right-[20%] h-[50vh] w-[30vw] max-w-[400px] -scale-x-100 opacity-85"><LeafCluster /></div>
        <div className="absolute -bottom-8 -right-10 h-[44vh] w-[30vw] max-w-[400px] -scale-x-100 opacity-90"><LeafCluster /></div>
        {/* a couple of centre blades crossing the path */}
        <div className="absolute bottom-0 left-[44%] h-[36vh] w-[16vw] max-w-[200px] rotate-[8deg] opacity-70"><LeafCluster /></div>
        <div className="absolute bottom-0 left-[48%] h-[30vh] w-[14vw] max-w-[180px] -rotate-[10deg] opacity-60"><LeafCluster /></div>
      </div>

      {/* Ground shadow + faint teal pool so the thicket has a floor. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5" style={{ background: "linear-gradient(to top, var(--noir-950) 10%, transparent)" }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: "radial-gradient(55% 100% at 50% 100%, rgba(13,185,200,0.07), transparent 70%)" }} />

      {/* The copy beat. */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="absolute inset-x-0 top-[3%] text-center font-mono text-[11px] uppercase tracking-[0.4em] text-signal-2/70"
      >
        // the trail goes quiet — the tracks lead on
      </motion.p>

      {/* Otti's paw-prints descending into the thicket. */}
      <div aria-hidden className="absolute inset-0 hidden sm:block">
        {PAWS.map((p, i) => (
          <Paw key={i} paw={p} progress={scrollYProgress} reduce={!!reduce} />
        ))}
      </div>
    </div>
  );
}

function Paw({
  paw,
  progress,
  reduce,
}: {
  paw: (typeof PAWS)[number];
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  // Ignite as the scroll passes the print, then hold lit (footprint lighting up).
  const lit = useTransform(progress, [paw.at - 0.1, paw.at], [reduce ? 0.85 : 0.12, 0.85]);
  const scale = useTransform(lit, [0.12, 0.85], [0.8, 1]);
  return (
    <motion.span
      className="absolute left-1/2 top-0"
      style={{
        top: `${paw.top}%`,
        x: paw.x,
        marginLeft: -13 * paw.s,
        opacity: lit,
        scale,
      }}
    >
      <span style={{ display: "block", transform: `scale(${paw.s}) rotate(${paw.rot}deg)`, filter: "drop-shadow(0 0 7px rgba(52,245,228,0.75))" }}>
        <PawShape />
      </span>
    </motion.span>
  );
}

function PawShape() {
  return (
    <svg width="26" height="26" viewBox="-16 -16 32 32" fill="#7df3ea">
      {/* pad */}
      <ellipse cx="0" cy="5.5" rx="8.5" ry="6.6" />
      {/* toes */}
      <circle cx="-8.4" cy="-2" r="2.7" />
      <circle cx="-3" cy="-7.2" r="2.9" />
      <circle cx="3" cy="-7.2" r="2.9" />
      <circle cx="8.4" cy="-2" r="2.7" />
    </svg>
  );
}
