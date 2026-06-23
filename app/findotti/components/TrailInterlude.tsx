"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "motion/react";
import { FoliageThicket } from "./FoliageFrame";
import { Fern, Reeds, Mushrooms, Grass, Pebbles } from "./NatureElements";

/**
 * TrailInterlude — the held breath between the clues ("what we know") and the
 * countdown ("something is coming"). Otti's glowing paw-prints descend through a
 * layered night FOREST FLOOR — ferns, reeds, bioluminescent mushrooms, grass and
 * a dense bush thicket — igniting one-by-one as you scroll. The whole column is
 * populated (not just the bottom) so the tracks lead *through* the forest, not
 * over a void. Paws + spores ignite on scroll; nature is static SVG (~0 GPU).
 * Desktop-only nature; the copy + paws still show on mobile.
 */

// Paw-prints: descending the centre with a walking gait, weaving between the
// flanking nature. `at` = scroll fraction it ignites.
const PAWS = [
  { x: -30, top: 9, s: 1.0, rot: -10, at: 0.16 },
  { x: 26, top: 25, s: 0.92, rot: 9, at: 0.3 },
  { x: -20, top: 42, s: 0.8, rot: -8, at: 0.44 },
  { x: 18, top: 59, s: 0.66, rot: 7, at: 0.58 },
  { x: -10, top: 76, s: 0.54, rot: -6, at: 0.72 },
];

// Drifting glowing spores (forest motes) — gentle scroll-driven rise + fade.
const SPORES = [
  { left: "30%", top: "30%", r: 3, at: 0.2 },
  { left: "66%", top: "22%", r: 2, at: 0.32 },
  { left: "40%", top: "54%", r: 2.5, at: 0.46 },
  { left: "72%", top: "60%", r: 2, at: 0.56 },
  { left: "28%", top: "70%", r: 3, at: 0.66 },
];

export function TrailInterlude() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 82%", "end 50%"] });

  return (
    <div ref={ref} className="relative mx-auto h-[72vh] min-h-[560px] w-full max-w-5xl overflow-hidden">
      {/* ── Forest-floor nature, layered down the whole column ────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
        {/* FAR tier — tall silhouettes flanking high up (depth, still readable) */}
        <div className="absolute left-[2%] top-[4%] h-[46%] w-[16vw] max-w-[220px] opacity-50 blur-[2.5px]"><Fern shade="#0c1420" /></div>
        <div className="absolute right-[3%] top-[2%] h-[50%] w-[16vw] max-w-[220px] -scale-x-100 opacity-50 blur-[2.5px]"><Fern shade="#0c1420" /></div>
        <div className="absolute left-[18%] top-[1%] h-[34%] w-[12vw] max-w-[170px] opacity-45 blur-[3px]"><Reeds shade="#0b1018" /></div>
        <div className="absolute right-[20%] top-[2%] h-[32%] w-[12vw] max-w-[170px] -scale-x-100 opacity-45 blur-[3px]"><Reeds shade="#0b1018" /></div>
        <div className="absolute left-[36%] top-[5%] h-[26%] w-[10vw] max-w-[130px] opacity-35 blur-[3px]"><Fern shade="#0a1119" /></div>
        <div className="absolute right-[38%] top-[7%] h-[24%] w-[10vw] max-w-[130px] -scale-x-100 opacity-35 blur-[3px]"><Reeds shade="#0a1119" /></div>

        {/* MID tier — ferns + reeds leaning toward the path */}
        <div className="absolute left-[6%] top-[34%] h-[42%] w-[17vw] max-w-[240px] rotate-[8deg] opacity-65"><Fern /></div>
        <div className="absolute right-[7%] top-[30%] h-[46%] w-[17vw] max-w-[240px] -scale-x-100 rotate-[8deg] opacity-65"><Fern /></div>
        <div className="absolute left-[24%] top-[44%] h-[34%] w-[11vw] max-w-[150px] opacity-70"><Reeds /></div>
        <div className="absolute right-[26%] top-[40%] h-[36%] w-[11vw] max-w-[150px] -scale-x-100 opacity-70"><Reeds /></div>

        {/* Bioluminescent mushroom clusters flanking the path (the glow accents) */}
        <Glow at={0.36} progress={scrollYProgress} reduce={!!reduce} className="absolute left-[30%] top-[40%] h-[12%] w-[8vw] max-w-[110px]"><Mushrooms /></Glow>
        <Glow at={0.62} progress={scrollYProgress} reduce={!!reduce} className="absolute right-[31%] top-[64%] h-[11%] w-[7vw] max-w-[100px]"><Mushrooms /></Glow>
        <Glow at={0.8} progress={scrollYProgress} reduce={!!reduce} className="absolute left-[36%] top-[80%] h-[9%] w-[6vw] max-w-[80px]"><Mushrooms /></Glow>

        {/* NEAR tier — dense bush thicket + grass at the base (full width) */}
        <FoliageThicket />
        <div className="absolute -bottom-2 left-[14%] h-[14%] w-[12vw] max-w-[170px] opacity-80"><Grass /></div>
        <div className="absolute -bottom-2 right-[16%] h-[13%] w-[12vw] max-w-[170px] -scale-x-100 opacity-80"><Grass /></div>
        <div className="absolute bottom-0 left-[40%] h-[10%] w-[10vw] max-w-[140px] opacity-70"><Grass /></div>
        <div className="absolute -bottom-1 left-[22%] h-[8%] w-[14vw] max-w-[200px] opacity-60"><Pebbles /></div>
        <div className="absolute -bottom-1 right-[20%] h-[8%] w-[14vw] max-w-[200px] -scale-x-100 opacity-60"><Pebbles /></div>
      </div>

      {/* Ground shadow + faint teal pool so the floor reads grounded. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5" style={{ background: "linear-gradient(to top, var(--noir-950) 8%, transparent)" }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: "radial-gradient(55% 100% at 50% 100%, rgba(13,185,200,0.08), transparent 70%)" }} />

      {/* Drifting glowing spores. */}
      <div aria-hidden className="absolute inset-0 hidden sm:block">
        {SPORES.map((s, i) => (
          <Spore key={i} spore={s} progress={scrollYProgress} reduce={!!reduce} />
        ))}
      </div>

      {/* The copy beat. */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="absolute inset-x-0 top-[3%] z-10 text-center font-mono text-[11px] uppercase tracking-[0.4em] text-signal-2/70"
      >
        // the trail goes quiet — the tracks lead on
      </motion.p>

      {/* Otti's paw-prints descending through the forest. */}
      <div aria-hidden className="absolute inset-0 z-10 hidden sm:block">
        {PAWS.map((p, i) => (
          <Paw key={i} paw={p} progress={scrollYProgress} reduce={!!reduce} />
        ))}
      </div>
    </div>
  );
}

/** Wraps a nature element so its bioluminescence ignites as the scroll reaches it. */
function Glow({
  at,
  progress,
  reduce,
  className,
  children,
}: {
  at: number;
  progress: MotionValue<number>;
  reduce: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const opacity = useTransform(progress, [at - 0.12, at], [reduce ? 1 : 0.35, 1]);
  const glow = useTransform(progress, [at - 0.12, at], [reduce ? 1 : 0, 1]);
  const drop = useTransform(glow, (g) => `drop-shadow(0 0 ${6 * g}px rgba(52,245,228,${0.5 * g}))`);
  return (
    <motion.div className={className} style={{ opacity, filter: drop }}>
      {children}
    </motion.div>
  );
}

function Spore({
  spore,
  progress,
  reduce,
}: {
  spore: (typeof SPORES)[number];
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const y = useTransform(progress, [spore.at, spore.at + 0.5], [10, -28]);
  const opacity = useTransform(progress, [spore.at, spore.at + 0.12, spore.at + 0.5], [0, reduce ? 0.5 : 0.9, 0]);
  return (
    <motion.span
      className="absolute rounded-full"
      style={{
        left: spore.left,
        top: spore.top,
        width: spore.r * 2,
        height: spore.r * 2,
        y,
        opacity,
        background: "radial-gradient(circle, rgba(190,255,250,0.95), rgba(52,245,228,0) 70%)",
        boxShadow: "0 0 8px 2px rgba(52,245,228,0.5)",
      }}
    />
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
  // Toes point DOWN — the direction Otti is walking (down the page, into the
  // thicket) — so the prints read as tracks heading away from you.
  return (
    <svg width="26" height="26" viewBox="-16 -16 32 32" fill="#7df3ea">
      {/* pad (behind, up) */}
      <ellipse cx="0" cy="-5.5" rx="8.5" ry="6.6" />
      {/* toes (forward, down) */}
      <circle cx="-8.4" cy="2" r="2.7" />
      <circle cx="-3" cy="7.2" r="2.9" />
      <circle cx="3" cy="7.2" r="2.9" />
      <circle cx="8.4" cy="2" r="2.7" />
    </svg>
  );
}
