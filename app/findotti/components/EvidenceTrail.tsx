"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "motion/react";

/**
 * EvidenceTrail — the signature motif, elevated. A glowing serpentine neon spine
 * that *draws itself* as you scroll, threading four clues as illuminated
 * waypoints. The icon cell at each waypoint sits DIRECTLY on the spine — the
 * neon line passes behind it through a translucent glass panel, so the light
 * visibly runs through the icon rather than beside it. As the draw (and the
 * comet head) reaches each cell, it "hops" — a quick energized bounce + glow
 * burst, like current arcing through — before the case-file card beside it
 * materializes. All motion is scroll-driven or a one-shot reveal (no idle cost).
 */

type Clue = { tag: string; title: string; icon: ReactNode };

const CLUES: Clue[] = [
  { tag: "Evidence 01", title: "Loves hidden places", icon: <PinIcon /> },
  { tag: "Evidence 02", title: "Appears near explorers", icon: <ExplorersIcon /> },
  { tag: "Evidence 03", title: "Carries mysterious maps", icon: <MapIcon /> },
  { tag: "Evidence 04", title: "Never stays in one place", icon: <CompassIcon /> },
];

// Fixed coordinate system shared by the SVG path AND the comet's offset-path, so
// they trace exactly the same route. CX=36 matches TrailGenesis's RAIL_X
// exactly (same x, same centred max-w-2xl container) so the neon line hands
// off with zero visual break — do not change CX without updating RAIL_X too.
const GUTTER = 72;
const ROW_H = 168;
const TOP_PAD = 36;
const CX = GUTTER / 2; // spine centre — the line + spark sit here
// Icon cells are ~76px wide, centred on CX — wider than GUTTER, but they're
// plain absolutely-positioned divs (not SVG content), so they safely overflow
// the gutter's nominal width without being clipped. Cards start right at the
// desktop icon cell's edge (CX + half its ~76px width) so the connector stub
// reads as flush against it, not floating in a gap.
const CARD_LEFT = CX + 40;
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
        {/* Bridges TrailGenesis's tapered line into the spine below — stays
            cyan-tinted throughout (never fades to dark navy) so the route
            reads as continuously connected, not broken across the heading. */}
        <motion.span
          aria-hidden
          className="absolute w-px"
          style={{
            left: CX,
            top: 0,
            bottom: 0,
            background: "linear-gradient(to bottom, rgba(52,245,228,0.55), rgba(52,245,228,0.22) 65%, rgba(52,245,228,0.12))",
          }}
          animate={
            reduce
              ? {}
              : {
                  x: [-1.5, 1.5, -1.5],
                  opacity: [0.65, 1, 0.65],
                  boxShadow: [
                    "0 0 6px rgba(52,245,228,0.2)",
                    "0 0 13px rgba(52,245,228,0.5)",
                    "0 0 6px rgba(52,245,228,0.2)",
                  ],
                }
          }
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-mono text-xs uppercase tracking-[0.4em] text-signal-2/80"
        >
          // the evidence
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
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

            {/* A bright core spark at each waypoint, behind the glass icon cell —
                this is what "shows through" the translucent panel above it. */}
            {CLUES.map((_, i) => (
              <Spark key={i} index={i} progress={scrollYProgress} reduce={!!reduce} />
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

        {/* Icon cells — sit ON the spine (z-index above the SVG, so the line and
            spark paint behind their glass panel), enlarged, glowing, and each
            "hops" — a quick energized bounce — as the draw reaches it. */}
        {CLUES.map((clue, i) => (
          <IconCell key={i} index={i} icon={clue.icon} progress={scrollYProgress} reduce={!!reduce} />
        ))}

        {/* Case-file cards — one per waypoint row, tethered to its icon cell. */}
        <div className="absolute inset-0" style={{ paddingTop: TOP_PAD, paddingBottom: TOP_PAD }}>
          {CLUES.map((clue, i) => (
            <div
              key={clue.title}
              className="absolute right-0 flex items-center"
              style={{ top: nodeY(i) - 44, height: 88, left: CARD_LEFT }}
            >
              {/* Connector stub from the icon cell to the card. */}
              <span
                aria-hidden
                className="h-px w-3 shrink-0 sm:w-4"
                style={{ background: "linear-gradient(90deg, rgba(52,245,228,0.6), rgba(52,245,228,0))" }}
              />
              <TextCard clue={clue} index={i} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** A bright core spark at the waypoint, rendered in the SVG (behind the icon
 *  cell's glass panel). Ignites as the draw reaches it. */
function Spark({ index, progress, reduce }: { index: number; progress: MotionValue<number>; reduce: boolean }) {
  const cy = nodeY(index);
  const at = (index + 0.5) / N;
  const lit = useTransform(progress, [at - 0.06, at], [reduce ? 1 : 0, 1]);
  const scale = useTransform(lit, [0, 1], [0.5, 1]);
  return (
    <motion.g style={{ opacity: lit }}>
      <motion.circle cx={CX} cy={cy} r={16} fill="rgba(52,245,228,0.14)" style={{ scale, transformOrigin: `${CX}px ${cy}px` }} />
      <circle cx={CX} cy={cy} r={4.5} fill="#34f5e4" filter="url(#evGlow)" />
      <circle cx={CX} cy={cy} r={2} fill="#eafffd" />
    </motion.g>
  );
}

/** The waypoint's icon cell — a glass-panel frame sitting directly on the
 *  spine, so the neon line + spark show through behind it (translucent
 *  background, blurred). "Hops" — scale + glow burst — exactly as the draw
 *  arrives, like current arcing through the logo. */
function IconCell({
  index,
  icon,
  progress,
  reduce,
}: {
  index: number;
  icon: ReactNode;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const at = (index + 0.5) / N;
  const lit = useTransform(progress, [at - 0.07, at], [reduce ? 1 : 0, 1]);
  // The "hop" — a quick overshoot bounce right as the current arrives.
  const scale = useTransform(progress, [at - 0.07, at - 0.01, at + 0.05], reduce ? [1, 1, 1] : [0.88, 1.16, 1]);
  const glowOpacity = useTransform(progress, [at - 0.05, at, at + 0.3], reduce ? [0.5, 0.5, 0.5] : [0, 1, 0.55]);
  const borderColor = useTransform(lit, (l) => `rgba(52,245,228,${0.16 + l * 0.55})`);
  const iconColor = useTransform(lit, (l) => (l > 0.5 ? "#8ffbf1" : "#3b5568"));

  return (
    <motion.div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: CX, top: nodeY(index), scale }}
    >
      {/* Energize burst — a soft glow blooming outward on arrival. */}
      <motion.span
        aria-hidden
        className="absolute inset-[-10px] rounded-[22px]"
        style={{ opacity: glowOpacity, boxShadow: "0 0 26px 6px rgba(52,245,228,0.4)" }}
      />
      {/* Glass panel — translucent + blurred, so the spine/spark behind it show through. */}
      <motion.div
        className="relative grid h-16 w-16 place-items-center rounded-2xl border backdrop-blur-md sm:h-[76px] sm:w-[76px]"
        style={{
          borderColor,
          background: "rgba(8,16,26,0.38)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 14px 34px rgba(0,0,0,0.4)",
        }}
      >
        <motion.span
          className="[&>svg]:h-6 [&>svg]:w-6 sm:[&>svg]:h-7 sm:[&>svg]:w-7"
          style={{ color: iconColor }}
        >
          {icon}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

function TextCard({ clue, index }: { clue: Clue; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 18, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 + index * 0.05 }}
      className="group w-full rounded-2xl border border-white/[0.08] bg-noir-800/50 px-5 py-4 backdrop-blur-md transition-colors duration-300 hover:border-signal-2/30 sm:px-6 sm:py-5"
      style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.35)" }}
    >
      <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint sm:text-xs">
        {clue.tag}
      </span>
      <span className="mt-0.5 block text-base font-medium text-ink sm:text-lg">{clue.title}</span>
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
