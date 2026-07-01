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
import { TrailGenesis } from "./components/TrailGenesis";
import { TrailResolve } from "./components/TrailResolve";
import { FoliageFrame } from "./components/FoliageFrame";
import { TrailInterlude } from "./components/TrailInterlude";

/**
 * /findotti — Act 1: the clue. Now staged as a cinematic scene: layered parallax
 * terrain (drop-in art slots) behind a pinned hero that crossfades into the clue
 * chapter, then the countdown + CTA. Mystery only — no rankings/features/app name.
 */
export default function FindOttiPage() {
  return (
    <main className="relative">
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
                  Otti wasn&apos;t searching alone. He was searching for the
                  first explorers who would help build a global home for
                  explorers.{" "}
                  <span className="text-ink font-semibold">
                    Today, you found him.
                  </span>
                </p>
              </RevealOnScroll>
            </div>

            {/* Otti standing on the rock — absolutely placed so his feet land on
                the painted stage regardless of the headline height. */}
            <div className="absolute inset-x-0 bottom-[16%] flex justify-center sm:bottom-[23%]">
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
        <SceneLayer depth={0.08} disableScrubOnMobile>
          <HeroBackdrop />
        </SceneLayer>
        <LightRays />
        <FloatingCharms />
      </CinematicScene>

      {/* ── Scene 2: The Evidence Trail (dusk; the neon route threads the clues) */}
      <section className="relative px-6 pb-4">
        {/* Genesis: embers coalesce into the neon line, overlapping the hero's
            bottom (negative margin) so the trail is born out of the valley. */}
        <div className="relative z-10 -mt-[26vh]">
          <TrailGenesis />
        </div>
        {/* The dossier backdrop sits behind the trail only (not the genesis melt). */}
        <div className="relative">
          <SceneBackdrop tone="dusk" blendTop={false} blendBottom={false} />
          {/* Dark forest foliage framing the edges (the trail winds through it). */}
          <FoliageFrame />
          <div className="relative z-10">
            <EvidenceTrail />
          </div>
        </div>
        {/* Interlude: the trail goes quiet — Otti's tracks lead on into a dense
            night thicket, bridging the clues to the countdown. */}
        <TrailInterlude />
      </section>

      {/* ── Scene 3: The trail's terminus — the light blooms into the console ── */}
      <section className="relative flex flex-col items-center px-6 pb-36 pt-2 text-center">
        <SceneBackdrop tone="twilight" />
        {/* Foliage framing here too — the console sits in the same forest. */}
        <FoliageFrame />
        <div className="relative z-10 flex w-full flex-col items-center">
          {/* Resolve: the line gathers to a point and the console frame draws in. */}
          <TrailResolve>
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-signal-2/80">
              something is coming
            </p>
            <div className="mt-7 flex justify-center">
              <Countdown />
            </div>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint">
              08.05.2026
            </p>
          </TrailResolve>

          <RevealOnScroll delay={0.2} className="mt-12">
            <PrimaryCta preLabel="Become a Founding Explorer" preHref="/founders" />
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
