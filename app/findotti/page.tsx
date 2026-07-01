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
import { HeroParagraph } from "./components/HeroParagraph";
import { EvidenceTrail } from "./components/EvidenceTrail";
import { TrailGenesis } from "./components/TrailGenesis";
import { WaterSplashConnector } from "./components/WaterSplashConnector";
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
            {/* Headline up in the open sky. z-20 + tighter spacing so this block
                never collides with Otti or the scroll cue below, even on short
                desktop viewports. */}
            <div className="relative z-20 flex flex-col items-center pt-[8vh] text-center sm:pt-[10vh]">
              <p className="mb-6 font-mono text-sm uppercase tracking-[0.4em] text-signal-2/90">
                // signal detected
              </p>
              <ClueReveal
                text={"YOU FOUND\nA CLUE."}
                className="text-balance text-6xl font-extrabold leading-[0.95] tracking-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.7)] sm:text-8xl [&>span:last-child]:text-signal"
              />
              <RevealOnScroll delay={0.9}>
                <HeroParagraph />
              </RevealOnScroll>
            </div>

            {/* Otti standing on the rock — absolutely placed so his feet land on
                the painted stage regardless of the headline height. Pulled
                closer to the true bottom so the (now bigger) headline above has
                guaranteed clearance. */}
            <div className="absolute inset-x-0 z-10 bottom-[12%] flex justify-center sm:bottom-[14%]">
              <OttiHero />
            </div>

            {/* Tucked in a corner (not centred) so it never contests the same
                space as the paragraph above, regardless of viewport height. */}
            <RevealOnScroll delay={1.2}>
              <p className="absolute bottom-6 right-6 z-20 text-right font-mono text-xs uppercase tracking-[0.4em] text-ink-faint">
                scroll to follow<br />the trail
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
            bottom (negative margin) so the trail is born out of the valley. A
            splash connector bridges the painted river into the pond below. */}
        <div className="relative z-10 -mt-[26vh]">
          <WaterSplashConnector />
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
            <p className="font-mono text-sm uppercase tracking-[0.4em] text-signal-2/80">
              something is coming
            </p>
            <div className="mt-7 flex justify-center">
              <Countdown />
            </div>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-ink-faint">
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
