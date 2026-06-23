"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * EvidenceTrail — the signature motif, elevated. A glowing serpentine neon spine
 * that *draws itself* as you scroll, threading four clues as illuminated
 * waypoints — Otti's expedition route assembling into a case file. A comet-head
 * travels the path (CSS offset-path bound to scroll); each node ignites as the
 * draw reaches it; the clue card beside it materializes. All motion is
 * scroll-driven or a one-shot reveal (no idle GPU cost).
 */

type Clue = { tag: string; title: string; icon: ReactNode };

const CLUES: Clue[] = [
  { tag: "Evidence 01", title: "Loves hidden places", icon: <PinIcon /> },
  { tag: "Evidence 02", title: "Appears near explorers", icon: <ExplorersIcon /> },
  { tag: "Evidence 03", title: "Carries mysterious maps", icon: <MapIcon /> },
  { tag: "Evidence 04", title: "Never stays in one place", icon: <CompassIcon /> },
];

// Fixed coordinate system shared by the SVG path AND the comet's offset-path, so
// they trace exactly the same route. Gutter is 72px wide; rows are 168px tall.
const GUTTER = 72;
const ROW_H = 168;
const TOP_PAD = 36;
const CX = GUTTER / 2; // spine centre — nodes sit here, so they're always on the line
const BOW = 22; // how far the line bows out between waypoints
const N = CLUES.length;
const TOTAL_H = TOP_PAD * 2 + N * ROW_H;
const nodeY = (i: number) => TOP_PAD + ROW_H * i + ROW_H / 2;

// Build a smooth serpentine through the centred waypoints, bowing left/right
// between them so the route weaves like a trail on a map.
function buildPath(): string {
  const ys = [TOP_PAD - 8, ...CLUES.map((_, i) => nodeY(i)), TOTAL_H - TOP_PAD + 8];
  let d = `M ${CX} ${ys[0]}`;
  for (let i = 0; i < ys.length - 1; i++) {
    const ya = ys[i];
    const yb = ys[i + 1];
    const dir = i % 2 === 0 ? 1 : -1;
    const cp1x = CX + BOW * dir;
    const cp2x = CX - BOW * dir;
    d += ` C ${cp1x} ${ya + (yb - ya) / 3}, ${cp2x} ${ya + (2 * (yb - ya)) / 3}, ${CX} ${yb}`;
  }
  return d;
}
const PATH_D = buildPath();

export function EvidenceTrail() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    // Start later (spine top near mid-viewport) so the genesis line finishes its
    // descent first — the two journeys read sequentially, not at the same time.
    offset: ["start 48%", "end 60%"],
  });

  // The bright stroke draws from 0 → full as the section passes through.
  const pathLength = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0, 1]);
  // The comet head rides the same route.
  const cometDist = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  // Fade the head in/out in step with the line's masked ends so it never
  // appears as a bright dot over a faded stretch of trail.
  const cometOpacity = useTransform(scrollYProgress, [0, 0.1, 0.84, 1], [0, 1, 1, 0]);

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Section heading — the route passes it on the left rail (a dim connector
          bridges the genesis line above into the spine below, so the light never
          visually breaks across the heading). */}
      <div className="relative pb-12 text-center">
        <span
          aria-hidden
          className="absolute w-px"
          style={{
            left: CX,
            top: 0,
            bottom: 0,
            background: "linear-gradient(to bottom, rgba(52,245,228,0.45), rgba(27,53,82,0.55) 60%, rgba(27,53,82,0.85))",
          }}
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-mono text-[11px] uppercase tracking-[0.4em] text-signal-2/80"
        >
          // the evidence
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          What do we know about Otti?
        </motion.h2>
      </div>

      {/* Trail + waypoints */}
      <div ref={ref} className="relative" style={{ height: TOTAL_H }}>
        {/* The neon spine (fixed-size box so SVG units == px, matching the comet). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0"
          style={{ width: GUTTER }}
        >
          <svg
            width={GUTTER}
            height={TOTAL_H}
            viewBox={`0 0 ${GUTTER} ${TOTAL_H}`}
            className="overflow-visible"
          >
            <defs>
              <linearGradient id="evTrailGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0099db" />
                <stop offset="100%" stopColor="#34f5e4" />
              </linearGradient>
              <filter id="evGlow" x="-120%" y="-20%" width="340%" height="140%">
                <feGaussianBlur stdDeviation="3.2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Vertical alpha fade so the line emerges from nothing at the top
                  and dissolves into nothing at the bottom — no hard caps. */}
              <linearGradient id="evFadeGrad" x1="0" y1="0" x2="0" y2="1">
                {/* Short top fade so the genesis line hands straight into the
                    spine; longer bottom fade as the trail dissolves toward the
                    resolve/console below. */}
                <stop offset="0%" stopColor="#000" />
                <stop offset="3%" stopColor="#fff" />
                <stop offset="88%" stopColor="#fff" />
                <stop offset="100%" stopColor="#000" />
              </linearGradient>
              <mask id="evFade">
                <rect x="0" y="0" width={GUTTER} height={TOTAL_H} fill="url(#evFadeGrad)" />
              </mask>
            </defs>

            {/* The route strokes fade at both ends via the mask; the waypoint
                nodes stay fully lit (they sit in the solid middle band). */}
            <g mask="url(#evFade)">
              {/* Dim base route — the full path, always faintly present. */}
              <path
                d={PATH_D}
                fill="none"
                stroke="#1b3552"
                strokeWidth={2}
                strokeLinecap="round"
              />
              {/* Bright self-drawing route (scroll-bound). */}
              <motion.path
                d={PATH_D}
                fill="none"
                stroke="url(#evTrailGrad)"
                strokeWidth={2.5}
                strokeLinecap="round"
                filter="url(#evGlow)"
                style={{ pathLength }}
              />
            </g>

            {/* Waypoint nodes — ignite as the draw passes each one. */}
            {CLUES.map((_, i) => (
              <Node key={i} index={i} progress={scrollYProgress} reduce={!!reduce} />
            ))}
          </svg>

          {/* Comet head — travels the exact same route via offset-path. */}
          {!reduce && (
            <motion.span
              aria-hidden
              className="absolute left-0 top-0 h-3 w-3 rounded-full bg-signal-2"
              style={{
                offsetPath: `path('${PATH_D}')`,
                offsetDistance: cometDist,
                offsetRotate: "0deg",
                opacity: cometOpacity,
                boxShadow:
                  "0 0 10px 3px rgba(52,245,228,0.9), 0 0 22px 8px rgba(0,153,219,0.55)",
              }}
            />
          )}
        </div>

        {/* Clue cards — one per waypoint row, tethered to its node. */}
        <div className="absolute inset-0" style={{ paddingTop: TOP_PAD, paddingBottom: TOP_PAD }}>
          {CLUES.map((clue, i) => (
            <div
              key={clue.title}
              className="absolute right-0 flex items-center"
              style={{ top: nodeY(i) - 44, height: 88, left: GUTTER }}
            >
              {/* Connector stub from the spine to the card. */}
              <span
                aria-hidden
                className="h-px w-5 shrink-0 sm:w-8"
                style={{ background: "linear-gradient(90deg, rgba(52,245,228,0.6), rgba(52,245,228,0))" }}
              />
              <ClueCard clue={clue} index={i} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Node({
  index,
  progress,
  reduce,
}: {
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduce: boolean;
}) {
  const cy = nodeY(index);
  const at = (index + 0.5) / N;
  const lit = useTransform(progress, [at - 0.06, at], [reduce ? 1 : 0, 1]);
  const scale = useTransform(lit, [0, 1], [0.5, 1]);
  return (
    <motion.g style={{ opacity: lit }}>
      {/* halo */}
      <motion.circle cx={CX} cy={cy} r={9} fill="rgba(52,245,228,0.16)" style={{ scale, transformOrigin: `${CX}px ${cy}px` }} />
      {/* core */}
      <circle cx={CX} cy={cy} r={3.5} fill="#34f5e4" filter="url(#evGlow)" />
      <circle cx={CX} cy={cy} r={1.6} fill="#eafffd" />
    </motion.g>
  );
}

function ClueCard({ clue, index }: { clue: Clue; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 18, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 + index * 0.05 }}
      className="group flex w-full items-center gap-4 rounded-2xl border border-white/[0.08] bg-noir-800/50 px-4 py-3.5 backdrop-blur-md transition-colors duration-300 hover:border-signal-2/30 sm:px-5 sm:py-4"
      style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.35)" }}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-signal-2/20 bg-signal-1/10 text-signal-2 transition-colors duration-300 group-hover:bg-signal-1/20">
        {clue.icon}
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-[9px] uppercase tracking-[0.3em] text-ink-faint">
          {clue.tag}
        </span>
        <span className="mt-0.5 block text-sm font-medium text-ink sm:text-base">
          {clue.title}
        </span>
      </span>
    </motion.div>
  );
}

/* ── Inline stroke icons (no icon dependency) ─────────────────────────────── */
function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}
function ExplorersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 6.5a3 3 0 0 1 0 5.5" />
      <path d="M18.5 20a6 6 0 0 0-3-5.2" />
    </svg>
  );
}
function MapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4Z" />
      <path d="M9 4v13M15 6.5v13" />
    </svg>
  );
}
function CompassIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  );
}
