"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "motion/react";

/**
 * TrailGenesis — the birth of the trail. Replaces the old flat seam between the
 * hero valley and the evidence dossier with a scroll-driven morph: a few blurry
 * glowing embers drift in and MERGE into a single orb, which then SHARPENS and
 * STRETCHES into the top of the neon trail line — so the expedition route reads
 * as coalescing out of the hero scene. Aligned to the trail's left rail (x=36 in
 * a centred max-w-2xl) so the line hands straight into EvidenceTrail's spine.
 * All motion is scroll-bound (no idle cost).
 */

// Convergence point (where embers fuse → orb → line start), as a % of the block.
const CONVERGE_TOP = "52%";
const RAIL_X = 36; // matches EvidenceTrail CX

// Embers: scattered start offsets (px) relative to the convergence point.
const EMBERS = [
  { dx: -150, dy: -210, r: 11, warm: true, in: 0.0, gone: 0.5 },
  { dx: 124, dy: -176, r: 9, warm: false, in: 0.03, gone: 0.52 },
  { dx: -58, dy: -128, r: 8, warm: false, in: 0.07, gone: 0.5 },
  { dx: 64, dy: -76, r: 7, warm: true, in: 0.11, gone: 0.52 },
];

export function TrailGenesis() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "end 45%"],
  });

  // Orb: fades in as the embers land, sharpens (blur→), then yields to the line.
  const orbOpacity = useTransform(scrollYProgress, [0.42, 0.54, 0.62, 0.74], [0, 1, 1, 0]);
  const orbBlur = useTransform(scrollYProgress, [0.42, 0.68], [16, 1]);
  const orbBlurFilter = useTransform(orbBlur, (b) => `blur(${b}px)`);
  const orbScaleY = useTransform(scrollYProgress, [0.52, 0.74], [1, 3.4]);

  // Line: a crisp neon segment grows downward out of the orb to hand to the
  // trail — finishes its full descent BEFORE the evidence spine begins drawing
  // (the spine's scroll range starts later) so the two journeys are sequential.
  const lineScaleY = useTransform(scrollYProgress, [0.6, 0.88], [reduce ? 1 : 0, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0.58, 0.7], [reduce ? 1 : 0, 1]);
  // Core node at the convergence point — the seam where orb becomes line.
  const coreOpacity = useTransform(scrollYProgress, [0.48, 0.58, 0.94, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none relative h-[58vh] min-h-[440px] w-full overflow-hidden">
      {/* Tonal melt — extends up over the hero's bottom edge to kill the hard cut. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,7,13,0) 0%, rgba(5,7,13,0.45) 30%, rgba(5,7,13,0.85) 60%, var(--noir-950) 100%)",
        }}
      />

      {/* Moonlit pond filling the void — the trail descends to the water (Otti's
          river continuing from the hero). Static caustics/sheen; ripples below. */}
      <WaterPool />

      <div className="absolute inset-0 px-6">
        <div className="relative mx-auto h-full w-full max-w-2xl">
          {/* Dim base rail from the convergence point down — continuity under the
              bright line, so the route never visually breaks. */}
          <div
            className="absolute w-px"
            style={{ left: RAIL_X, top: CONVERGE_TOP, bottom: 0, background: "linear-gradient(to bottom, rgba(27,53,82,0.9), rgba(27,53,82,0.2))" }}
          />

          {/* The growing neon line (origin at the convergence point). */}
          <motion.div
            className="absolute w-[2.5px] origin-top rounded-full"
            style={{
              left: RAIL_X - 1,
              top: CONVERGE_TOP,
              bottom: 0,
              opacity: lineOpacity,
              scaleY: lineScaleY,
              background: "linear-gradient(to bottom, #34f5e4, #0099db)",
              boxShadow: "0 0 8px 1px rgba(52,245,228,0.55)",
            }}
          />

          {/* Embers — drift in and merge into the orb. */}
          {!reduce &&
            EMBERS.map((e, i) => (
              <Ember key={i} ember={e} progress={scrollYProgress} />
            ))}

          {/* The merged orb — blooms, sharpens, stretches into the line. */}
          {!reduce && (
            <motion.span
              className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: RAIL_X,
                top: CONVERGE_TOP,
                opacity: orbOpacity,
                filter: orbBlurFilter,
                scaleY: orbScaleY,
                background: "radial-gradient(circle at 50% 45%, rgba(234,255,253,0.95), rgba(52,245,228,0.7) 40%, rgba(0,153,219,0) 72%)",
              }}
            />
          )}

          {/* Neon reflection bloom on the water surface where the line enters. */}
          <motion.span
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
            style={{
              left: RAIL_X,
              top: CONVERGE_TOP,
              width: 92,
              height: 26,
              opacity: coreOpacity,
              filter: "blur(5px)",
              background: "radial-gradient(closest-side, rgba(52,245,228,0.34), transparent)",
            }}
          />

          {/* Ripple rings spreading where the orb lands on the water. */}
          <RippleRing progress={scrollYProgress} at={0.48} reduce={!!reduce} />
          <RippleRing progress={scrollYProgress} at={0.6} reduce={!!reduce} />
          <RippleRing progress={scrollYProgress} at={0.72} reduce={!!reduce} />

          {/* Bright core node at the seam (orb → line). */}
          <motion.span
            className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#eafffd]"
            style={{
              left: RAIL_X,
              top: CONVERGE_TOP,
              opacity: coreOpacity,
              boxShadow: "0 0 10px 3px rgba(52,245,228,0.85), 0 0 22px 9px rgba(0,153,219,0.45)",
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="absolute font-mono text-[10px] uppercase tracking-[0.4em] text-signal-2/70"
            style={{ left: 60, top: `calc(${CONVERGE_TOP} - 10px)` }}
          >
            // following the trail
          </motion.p>
        </div>
      </div>
    </div>
  );
}

/** A moonlit pond filling the void — static caustics, sheen and depth tint. */
function WaterPool() {
  return (
    <div aria-hidden className="absolute inset-x-0 overflow-hidden" style={{ top: CONVERGE_TOP, bottom: 0 }}>
      {/* underwater depth tint */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(8,18,26,0) 0%, rgba(7,16,24,0.5) 55%, rgba(5,12,20,0.8) 100%)" }} />
      {/* waterline sheen at the surface */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent 6%, rgba(130,210,218,0.32) 50%, transparent 94%)" }} />
      <div className="absolute inset-x-0 top-0 h-8" style={{ background: "linear-gradient(to bottom, rgba(120,200,210,0.06), transparent)" }} />
      {/* caustic light pools */}
      <div className="absolute left-[16%] top-[18%] h-24 w-72 rounded-full opacity-[0.10] blur-2xl" style={{ background: "radial-gradient(circle, #34f5e4, transparent 70%)" }} />
      <div className="absolute right-[12%] top-[42%] h-28 w-80 rounded-full opacity-[0.09] blur-2xl" style={{ background: "radial-gradient(circle, #0099db, transparent 70%)" }} />
      <div className="absolute left-[42%] bottom-[14%] h-20 w-64 rounded-full opacity-[0.08] blur-2xl" style={{ background: "radial-gradient(circle, #34f5e4, transparent 70%)" }} />
      {/* still-water highlights */}
      <div className="absolute inset-x-[12%] top-[34%] h-px opacity-25" style={{ background: "linear-gradient(90deg, transparent, rgba(130,200,210,0.5) 50%, transparent)" }} />
      <div className="absolute inset-x-[26%] top-[62%] h-px opacity-20" style={{ background: "linear-gradient(90deg, transparent, rgba(130,200,210,0.4) 50%, transparent)" }} />
    </div>
  );
}

/** An elliptical ripple spreading from the orb's landing point (scroll-driven). */
function RippleRing({ progress, at, reduce }: { progress: MotionValue<number>; at: number; reduce: boolean }) {
  const scale = useTransform(progress, [at, at + 0.42], [0.22, 1.15]);
  const opacity = useTransform(progress, [at, at + 0.07, at + 0.42], [0, reduce ? 0 : 0.45, 0]);
  return (
    <motion.span
      className="absolute rounded-[50%] border"
      style={{
        left: RAIL_X,
        top: CONVERGE_TOP,
        width: 200,
        height: 54,
        marginLeft: -100,
        marginTop: -27,
        borderColor: "rgba(52,245,228,0.5)",
        scale,
        opacity,
      }}
    />
  );
}

function Ember({
  ember,
  progress,
}: {
  ember: (typeof EMBERS)[number];
  progress: MotionValue<number>;
}) {
  // Drift from scattered → convergence point (0 offset) — slower range so the
  // "embers gathering" beat is legible.
  const x = useTransform(progress, [0, 0.5], [ember.dx, 0]);
  const y = useTransform(progress, [0, 0.5], [ember.dy, 0]);
  const opacity = useTransform(progress, [ember.in, ember.in + 0.14, ember.gone], [0, 1, 0]);
  return (
    <motion.span
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        left: RAIL_X,
        top: CONVERGE_TOP,
        x,
        y,
        opacity,
        width: ember.r * 2,
        height: ember.r * 2,
        filter: "blur(4px)",
        background: ember.warm
          ? "radial-gradient(circle, rgba(255,210,160,1), rgba(255,122,69,0) 70%)"
          : "radial-gradient(circle, rgba(160,255,248,1), rgba(0,153,219,0) 70%)",
        boxShadow: ember.warm
          ? "0 0 14px 4px rgba(255,150,80,0.45)"
          : "0 0 14px 4px rgba(52,245,228,0.5)",
      }}
    />
  );
}
