import { ScrollProgress } from "../components/motion/ScrollProgress";
import { ParticleField } from "../components/atmosphere/ParticleField";
import { ExplorerTrail } from "../components/atmosphere/ExplorerTrail";
import { OttiHero } from "../components/otti/OttiHero";
import { ClueReveal } from "../components/motion/ClueReveal";
import { MagneticButton } from "../components/motion/MagneticButton";
import { RevealOnScroll } from "../components/motion/RevealOnScroll";
import { Parallax } from "../components/motion/Parallax";
import { Countdown } from "./components/Countdown";
import { ClueList } from "./components/ClueList";

/**
 * /findotti — Act 1: the clue. Mystery only. No rankings, no features, no app
 * name. A cinematic transmission that decodes itself and pulls toward /founders.
 */
export default function FindOttiPage() {
  return (
    <main className="relative">
      <ScrollProgress />
      <ParticleField />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-24 text-center">
        <RevealOnScroll>
          <p className="mb-8 font-mono text-xs uppercase tracking-[0.4em] text-signal-2/80">
            // signal detected
          </p>
        </RevealOnScroll>

        {/* Otti sits on a nearer plane (moves more on scroll). */}
        <Parallax speed={-60}>
          <OttiHero />
        </Parallax>

        {/* Headline on a slightly-lagging plane for depth separation. */}
        <Parallax speed={-24}>
          <ClueReveal
            text={"YOU FOUND\nA CLUE."}
            className="mt-10 text-balance text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl [&>span:last-child]:text-signal"
          />
        </Parallax>

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
      </section>

      {/* ── Clues (trail threads through here) ───────────────────────────── */}
      <section className="relative px-6 py-28">
        <ExplorerTrail />
        <ClueList />
      </section>

      {/* ── Countdown + CTA ──────────────────────────────────────────────── */}
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
