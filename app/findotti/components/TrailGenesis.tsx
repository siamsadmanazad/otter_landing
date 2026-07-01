"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "motion/react";
import { LilyPad, Reeds } from "./NatureElements";

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
  { dx: -150, dy: -210, r: 14, warm: true, in: 0.0, gone: 0.5 },
  { dx: 124, dy: -176, r: 12, warm: false, in: 0.03, gone: 0.52 },
  { dx: -58, dy: -128, r: 10, warm: false, in: 0.07, gone: 0.5 },
  { dx: 64, dy: -76, r: 9, warm: true, in: 0.11, gone: 0.52 },
  { dx: -110, dy: -60, r: 8, warm: false, in: 0.15, gone: 0.5 },
  { dx: 90, dy: -240, r: 10, warm: true, in: 0.02, gone: 0.52 },
];

// Droplets fling outward from the landing point at this spread of angles
// (degrees from straight up) — the "splash" moment.
const DROPLET_ANGLES = [-80, -58, -34, -12, 12, 34, 58, 80];

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
    <div ref={ref} aria-hidden className="pointer-events-none relative h-[64vh] min-h-[380px] w-full overflow-hidden sm:min-h-[500px]">
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

      {/* No px-6 here — the outer <section> in page.tsx already provides it, and
          EvidenceTrail's container doesn't add its own either. An extra layer of
          padding here would shift RAIL_X out of alignment with EvidenceTrail's
          CX (both are x=36 in a centred max-w-2xl, meant to line up exactly). */}
      <div className="absolute inset-0">
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
              // Tapers at the tail instead of a hard stop — it hands off into
              // EvidenceTrail's spine rather than visibly cutting.
              background: "linear-gradient(to bottom, #34f5e4 0%, #0099db 78%, rgba(0,153,219,0.35) 100%)",
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
              className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: RAIL_X,
                top: CONVERGE_TOP,
                opacity: orbOpacity,
                filter: orbBlurFilter,
                scaleY: orbScaleY,
                background: "radial-gradient(circle at 50% 45%, rgba(234,255,253,0.98), rgba(52,245,228,0.75) 40%, rgba(0,153,219,0) 72%)",
                boxShadow: "0 0 28px 10px rgba(52,245,228,0.35)",
              }}
            />
          )}

          {/* The splash — the orb's impact on the water, a flash + flinging droplets,
              plus a smaller secondary echo splash right after for a fuller moment. */}
          <SplashBurst progress={scrollYProgress} at={0.46} reduce={!!reduce} />
          <SplashBurst progress={scrollYProgress} at={0.53} reduce={!!reduce} scale={0.6} />

          {/* Neon reflection on the water where the line enters: a soft surface
              bloom + a shimmering mirrored streak running down into the pond. */}
          <motion.span
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
            style={{
              left: RAIL_X,
              top: CONVERGE_TOP,
              width: 120,
              height: 30,
              opacity: coreOpacity,
              filter: "blur(5px)",
              background: "radial-gradient(closest-side, rgba(52,245,228,0.5), transparent)",
            }}
          />
          <motion.span
            className="absolute -translate-x-1/2 origin-top"
            style={{
              left: RAIL_X,
              top: CONVERGE_TOP,
              width: 7,
              height: 120,
              opacity: coreOpacity,
              filter: "blur(2.5px)",
              background: "linear-gradient(to bottom, rgba(52,245,228,0.55), rgba(0,153,219,0.12) 60%, transparent)",
            }}
          />

          {/* Ripple rings spreading where the orb lands on the water. */}
          <RippleRing progress={scrollYProgress} at={0.46} reduce={!!reduce} />
          <RippleRing progress={scrollYProgress} at={0.53} reduce={!!reduce} />
          <RippleRing progress={scrollYProgress} at={0.6} reduce={!!reduce} />
          <RippleRing progress={scrollYProgress} at={0.66} reduce={!!reduce} />
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

          <TrailLabel progress={scrollYProgress} reduce={!!reduce} />
        </div>
      </div>
    </div>
  );
}

/** The trail's caption — reveals as the embers converge, then "vibes" with the
 *  water: it pulses brighter/bigger in sync with each splash burst (0.46 and
 *  0.53), so the label reads as a consequence of the impact, not a static
 *  overlay. A thin shimmering waterline echoes beneath it, tying it visually
 *  to the pond. Bigger + more prominent than the old fixed-tiny caption. */
function TrailLabel({ progress, reduce }: { progress: MotionValue<number>; reduce: boolean }) {
  const opacity = useTransform(progress, [0.36, 0.46], [0, 1]);
  const y = useTransform(progress, [0.36, 0.46], [16, 0]);

  // Two brightness/scale pulses, timed exactly to the main + echo splash.
  const pulse1 = useTransform(progress, [0.46, 0.5, 0.58], reduce ? [1, 1, 1] : [1, 1.1, 1]);
  const pulse2 = useTransform(progress, [0.53, 0.57, 0.65], reduce ? [1, 1, 1] : [1, 1.06, 1]);
  const scale = useTransform(() => pulse1.get() * pulse2.get());
  const glow1 = useTransform(progress, [0.46, 0.5, 0.6], reduce ? [0.5, 0.5, 0.5] : [0.5, 1, 0.5]);
  const glow2 = useTransform(progress, [0.53, 0.57, 0.66], reduce ? [0.5, 0.5, 0.5] : [0.5, 0.85, 0.5]);
  const glow = useTransform(() => Math.max(glow1.get(), glow2.get()));
  const textShadow = useTransform(glow, (g) => `0 0 ${14 + g * 18}px rgba(52,245,228,${0.35 + g * 0.35})`);

  return (
    <motion.div
      className="absolute max-w-[72%]"
      style={{ left: RAIL_X + 26, top: `calc(${CONVERGE_TOP} + 30px)`, opacity, y, scale }}
    >
      <motion.p
        className="font-mono text-base font-semibold uppercase leading-snug tracking-[0.25em] text-signal-2 sm:text-2xl sm:tracking-[0.35em]"
        style={{ textShadow }}
      >
        // following the trail
      </motion.p>
      {/* A shimmering waterline echo beneath the label — ties it to the pond. */}
      <motion.span
        aria-hidden
        className="mt-2 block h-px w-full max-w-[220px]"
        style={{ background: "linear-gradient(90deg, rgba(52,245,228,0.6), transparent 80%)" }}
        animate={reduce ? {} : { opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/** A premium moonlit pond filling the void — deep tint, a moon-reflection
 *  column, drifting caustics, lily pads, edge reeds, surface ripples and a
 *  vignette, with two slow idle shimmers so it clearly *is* water at rest. */
function WaterPool() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="absolute inset-x-0 overflow-hidden" style={{ top: CONVERGE_TOP, bottom: 0 }}>
      {/* deep underwater tint — surface unmistakable */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,26,36,0.20) 0%, rgba(8,20,30,0.66) 50%, rgba(4,11,19,0.96) 100%)" }} />
      {/* a cool radial deepening toward the centre = the pond's "bowl" */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(80% 90% at 50% 30%, rgba(16,40,52,0.35), transparent 70%)" }} />

      {/* bright waterline + surface sheen */}
      <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent 4%, rgba(150,235,240,0.75) 50%, transparent 96%)" }} />
      <div className="absolute inset-x-0 top-0 h-14" style={{ background: "linear-gradient(to bottom, rgba(120,210,218,0.14), transparent)" }} />

      {/* MOON REFLECTION + caustics — desktop-only flourish (decorative, not core). */}
      <div className="hidden sm:block">
        {/* a soft vertical column of light shimmering on the surface, broken into a few horizontal glints (the premium centrepiece) */}
        <div className="absolute left-1/2 top-0 h-2/3 w-28 -translate-x-1/2" style={{ background: "linear-gradient(to bottom, rgba(150,235,240,0.16), rgba(52,245,228,0.05) 45%, transparent)", filter: "blur(6px)" }} />
        {[8, 20, 34, 50].map((t, i) => (
          <div key={i} className="absolute left-1/2 -translate-x-1/2" style={{ top: `${t}%`, width: `${120 - i * 18}px`, height: "2px", opacity: 0.5 - i * 0.08, background: "linear-gradient(90deg, transparent, rgba(180,245,248,0.8), transparent)", filter: "blur(0.5px)" }} />
        ))}

        {/* drifting caustic light pools (brighter, varied) */}
        <div className="absolute left-[14%] top-[16%] h-24 w-72 rounded-full opacity-[0.16] blur-2xl" style={{ background: "radial-gradient(circle, #34f5e4, transparent 70%)" }} />
        <div className="absolute right-[10%] top-[40%] h-28 w-80 rounded-full opacity-[0.14] blur-2xl" style={{ background: "radial-gradient(circle, #0099db, transparent 70%)" }} />
        <div className="absolute left-[40%] bottom-[12%] h-20 w-64 rounded-full opacity-[0.12] blur-2xl" style={{ background: "radial-gradient(circle, #34f5e4, transparent 70%)" }} />
      </div>

      {/* horizontal ripple highlights — always-present surface texture */}
      {[
        { x: "8%", t: "14%", o: 0.32 },
        { x: "10%", t: "24%", o: 0.4 },
        { x: "16%", t: "33%", o: 0.28 },
        { x: "18%", t: "40%", o: 0.3 },
        { x: "22%", t: "48%", o: 0.24 },
        { x: "24%", t: "56%", o: 0.26 },
        { x: "27%", t: "64%", o: 0.22 },
        { x: "30%", t: "72%", o: 0.2 },
        { x: "24%", t: "80%", o: 0.18 },
        { x: "20%", t: "86%", o: 0.16 },
        { x: "16%", t: "92%", o: 0.14 },
      ].map((r, i) => (
        <div key={i} className="absolute h-px" style={{ left: r.x, right: r.x, top: r.t, opacity: r.o, background: "linear-gradient(90deg, transparent, rgba(150,215,222,0.6) 50%, transparent)" }} />
      ))}

      {/* lily pads + edge reeds — desktop-only flourish (decorative, not core). */}
      <div className="hidden sm:block">
        <LilyPad className="absolute left-[12%] top-[30%] h-7 w-16 opacity-70" />
        <LilyPad className="absolute right-[16%] top-[52%] h-6 w-12 opacity-60" style={{ transform: "scaleX(-1)" }} />
        <LilyPad className="absolute left-[24%] top-[66%] h-5 w-10 opacity-50" />

        <div className="absolute -left-2 bottom-0 h-[42%] w-[10vw] max-w-[140px] opacity-75"><Reeds /></div>
        <div className="absolute -right-3 bottom-0 h-[46%] w-[11vw] max-w-[150px] -scale-x-100 opacity-75"><Reeds /></div>
      </div>

      {/* edge vignette so the pond reads as deep, framed still water */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 50% 40%, transparent 55%, rgba(3,8,14,0.7) 100%)" }} />

      {/* two slow idle shimmers — desktop-only (idle rAF cost, skip on mobile + reduced motion) */}
      {!reduce && (
        <div className="hidden sm:block">
          <motion.div
            className="absolute inset-x-0 top-0 h-full"
            style={{ background: "linear-gradient(100deg, transparent 32%, rgba(120,210,220,0.05) 48%, rgba(150,235,240,0.10) 50%, rgba(120,210,220,0.05) 52%, transparent 68%)" }}
            animate={{ x: ["-12%", "12%", "-12%"] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-x-0 top-0 h-full"
            style={{ background: "linear-gradient(82deg, transparent 40%, rgba(120,210,220,0.04) 50%, transparent 60%)" }}
            animate={{ x: ["10%", "-10%", "10%"] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}
    </div>
  );
}

/** An elliptical ripple spreading from the orb's landing point (scroll-driven). */
function RippleRing({ progress, at, reduce }: { progress: MotionValue<number>; at: number; reduce: boolean }) {
  const scale = useTransform(progress, [at, at + 0.42], [0.2, 1.35]);
  const opacity = useTransform(progress, [at, at + 0.06, at + 0.42], [0, reduce ? 0 : 0.6, 0]);
  return (
    <motion.span
      className="absolute rounded-[50%] border-2"
      style={{
        left: RAIL_X,
        top: CONVERGE_TOP,
        width: 260,
        height: 68,
        marginLeft: -130,
        marginTop: -34,
        borderColor: "rgba(52,245,228,0.6)",
        boxShadow: "0 0 18px 2px rgba(52,245,228,0.25)",
        scale,
        opacity,
      }}
    />
  );
}

/** The splash: a bright impact flash + droplets flinging outward and falling
 *  back, timed to the orb landing on the water — the "cinematic beat" of the
 *  scene. One-shot per scroll-through (not looping), pure CSS transforms. */
function SplashBurst({
  progress,
  at,
  reduce,
  scale = 1,
}: {
  progress: MotionValue<number>;
  at: number;
  reduce: boolean;
  scale?: number;
}) {
  const flashOpacity = useTransform(progress, [at, at + 0.035, at + 0.16], [0, reduce ? 0.35 : 1, 0]);
  const flashScale = useTransform(progress, [at, at + 0.2], [0.25, 1.8 * scale]);
  return (
    <>
      <motion.span
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: RAIL_X,
          top: CONVERGE_TOP,
          width: 90,
          height: 90,
          opacity: flashOpacity,
          scale: flashScale,
          filter: "blur(2px)",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.95), rgba(150,235,240,0.45) 45%, transparent 75%)",
        }}
      />
      {!reduce &&
        DROPLET_ANGLES.map((deg, i) => (
          <Droplet key={i} progress={progress} at={at} angleDeg={deg} scale={scale} />
        ))}
    </>
  );
}

function Droplet({
  progress,
  at,
  angleDeg,
  scale = 1,
}: {
  progress: MotionValue<number>;
  at: number;
  angleDeg: number;
  scale?: number;
}) {
  const rad = (angleDeg * Math.PI) / 180;
  const dist = (36 + Math.abs(angleDeg) * 0.35) * scale;
  const x = useTransform(progress, [at, at + 0.16], [0, Math.sin(rad) * dist]);
  const y = useTransform(progress, [at, at + 0.1, at + 0.22], [0, -Math.cos(rad) * dist * 0.85, 8]);
  const opacity = useTransform(progress, [at, at + 0.03, at + 0.2], [0, 0.95, 0]);
  return (
    <motion.span
      className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d8fbf7]"
      style={{
        left: RAIL_X,
        top: CONVERGE_TOP,
        x,
        y,
        opacity,
        boxShadow: "0 0 6px 1px rgba(150,235,240,0.75)",
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
