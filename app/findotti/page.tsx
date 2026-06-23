import { ScrollProgress } from "../components/motion/ScrollProgress";
import { ParticleField } from "../components/atmosphere/ParticleField";
import { ChapterIndicator } from "../components/chrome/ChapterIndicator";
import { CinematicScene } from "../components/scene/CinematicScene";
import { SceneLayer } from "../components/scene/SceneLayer";
import {
  FarRange,
  MidRidge,
  ForegroundRidge,
  LightRays,
} from "../components/scene/ProceduralTerrain";
import { ExplorerTrail } from "../components/atmosphere/ExplorerTrail";
import { OttiHero } from "../components/otti/OttiHero";
import { ClueReveal } from "../components/motion/ClueReveal";
import { MagneticButton } from "../components/motion/MagneticButton";
import { RevealOnScroll } from "../components/motion/RevealOnScroll";
import { Countdown } from "./components/Countdown";
import { ClueList } from "./components/ClueList";

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

      {/* ── Scene 1: Hero (pinned, crossfades out) ───────────────────────── */}
      <CinematicScene
        pin
        className="px-6"
        pinContent={
          <div className="flex flex-col items-center text-center">
            <p className="mb-8 font-mono text-xs uppercase tracking-[0.4em] text-signal-2/80">
              // signal detected
            </p>
            <OttiHero />
            <ClueReveal
              text={"YOU FOUND\nA CLUE."}
              className="mt-10 text-balance text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl [&>span:last-child]:text-signal"
            />
            <RevealOnScroll delay={0.9}>
              <p className="mx-auto mt-8 max-w-md font-mono text-sm leading-relaxed text-ink-soft">
                Otti isn&apos;t lost. He&apos;s searching — for hidden places,
                stories, and people who love adventures.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={1.2}>
              <p className="mt-14 font-mono text-[10px] uppercase tracking-[0.4em] text-ink-faint">
                scroll to follow the trail
              </p>
              <span
                aria-hidden
                className="mx-auto mt-3 block h-8 w-[1px] animate-pulse bg-gradient-to-b from-signal-2/60 to-transparent"
              />
            </RevealOnScroll>
          </div>
        }
      >
        {/* Parallax depth stack (back → front). Art slots: swap children later. */}
        <LightRays />
        <SceneLayer depth={0.15} hideOnMobile>
          <FarRange />
        </SceneLayer>
        <SceneLayer depth={0.4} hideOnMobile>
          <MidRidge />
        </SceneLayer>
        <SceneLayer depth={0.85}>
          <ForegroundRidge />
        </SceneLayer>
      </CinematicScene>

      {/* ── Scene 2: Clues (trail threads through) ───────────────────────── */}
      <section className="relative px-6 py-28">
        <ExplorerTrail />
        <ClueList />
      </section>

      {/* ── Scene 3: Countdown + CTA ─────────────────────────────────────── */}
      <section className="relative flex flex-col items-center px-6 pb-36 pt-10 text-center">
        <RevealOnScroll>
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-ink-faint">
            something is coming
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.15} className="mt-8">
          <Countdown />
        </RevealOnScroll>
        <RevealOnScroll delay={0.3} className="mt-16">
          <MagneticButton href="/founders">
            Become a Founding Explorer
          </MagneticButton>
        </RevealOnScroll>
        <RevealOnScroll delay={0.45}>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint">
            08.05.2026
          </p>
        </RevealOnScroll>
      </section>
    </main>
  );
}
