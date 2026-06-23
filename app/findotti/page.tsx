import { ScrollProgress } from "../components/motion/ScrollProgress";
import { ParticleField } from "../components/atmosphere/ParticleField";
import { ChapterIndicator } from "../components/chrome/ChapterIndicator";
import { CinematicScene } from "../components/scene/CinematicScene";
import { SceneLayer } from "../components/scene/SceneLayer";
import { SceneBackdrop } from "../components/scene/SceneBackdrop";
import { HeroBackdrop } from "../components/scene/HeroBackdrop";
import { LightRays } from "../components/scene/ProceduralTerrain";
import { OttiHero } from "../components/otti/OttiHero";
import { FloatingCharms } from "../components/otti/FloatingCharms";
import { ClueReveal } from "../components/motion/ClueReveal";
import { PrimaryCta } from "../components/PrimaryCta";
import { RevealOnScroll } from "../components/motion/RevealOnScroll";
import { Countdown } from "./components/Countdown";
import { EvidenceTrail } from "./components/EvidenceTrail";
import { TrailSeam } from "./components/TrailSeam";

/**
 * /findotti — Act 1: the clue. Now staged as a cinematic scene: layered parallax
 * terrain (drop-in art slots) behind a pinned hero that crossfades into the clue
 * chapter, then the countdown + CTA. Mystery only — no rankings/features/app name.
 */
export default function FindOttiPage() {
  return (
    <main className="relative">
      <ScrollProgress />
      <ParticleField />
      <ChapterIndicator index={1} total={3} label="the clue" />

      {/* ── Scene 1: Hero ────────────────────────────────────────────────── */}
      <CinematicScene
        pinContent={
          <div className="relative min-h-dvh w-full px-6">
            {/* Headline up in the open sky. */}
            <div className="flex flex-col items-center pt-[14vh] text-center">
              <p className="mb-6 font-mono text-xs uppercase tracking-[0.4em] text-signal-2/90">
                // signal detected
              </p>
              <ClueReveal
                text={"YOU FOUND\nA CLUE."}
                className="text-balance text-5xl font-extrabold leading-[0.95] tracking-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.7)] sm:text-7xl [&>span:last-child]:text-signal"
              />
              <RevealOnScroll delay={0.9}>
                <p className="mx-auto mt-7 max-w-md font-mono text-sm leading-relaxed text-ink-soft drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  Otti isn&apos;t lost. He&apos;s searching — for hidden places,
                  stories, and people who love adventures.
                </p>
              </RevealOnScroll>
            </div>

            {/* Otti standing on the rock — absolutely placed so his feet land on
                the painted stage regardless of the headline height. */}
            <div className="absolute inset-x-0 bottom-[23%] flex justify-center">
              <OttiHero />
            </div>

            <RevealOnScroll delay={1.2}>
              <p className="absolute inset-x-0 bottom-6 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-ink-faint">
                scroll to follow the trail
              </p>
            </RevealOnScroll>
          </div>
        }
      >
        {/* Bespoke painterly valley backdrop + atmosphere (parallax). */}
        <SceneLayer depth={0.08}>
          <HeroBackdrop />
        </SceneLayer>
        <LightRays />
        <FloatingCharms />
      </CinematicScene>

      {/* ── Scene 2: The Evidence Trail (dusk; the neon route threads the clues) */}
      <section className="relative px-6 pb-28">
        <SceneBackdrop tone="dusk" blendTop={false} />
        {/* Transition: the hero valley melts down; the trail emerges from it. */}
        <TrailSeam />
        <div className="relative z-10 pt-4">
          <EvidenceTrail />
        </div>
      </section>

      {/* ── Scene 3: The trail's terminus — countdown console + CTA ───────── */}
      <section className="relative flex flex-col items-center px-6 pb-36 pt-4 text-center">
        <SceneBackdrop tone="twilight" />
        <div className="relative z-10 flex w-full flex-col items-center">
          {/* The trail continues down into the console (visual continuity). */}
          <div aria-hidden className="mb-2 h-16 w-px" style={{ background: "linear-gradient(to bottom, rgba(52,245,228,0.5), rgba(0,153,219,0))" }} />

          <RevealOnScroll className="w-full max-w-lg">
            <div
              className="relative w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-noir-900/55 px-6 py-9 backdrop-blur-xl sm:px-10"
              style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.45)" }}
            >
              {/* Top hairline glow — the console's signal edge. */}
              <span aria-hidden className="absolute inset-x-10 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(52,245,228,0.7), transparent)" }} />
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-signal-2/80">
                something is coming
              </p>
              <div className="mt-7 flex justify-center">
                <Countdown />
              </div>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint">
                08.05.2026
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2} className="mt-12">
            <PrimaryCta preLabel="Become a Founding Explorer" preHref="/founders" />
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
