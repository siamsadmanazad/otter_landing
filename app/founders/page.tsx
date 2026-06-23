import { Suspense } from "react";
import { ScrollProgress } from "../components/motion/ScrollProgress";
import { ChapterIndicator } from "../components/chrome/ChapterIndicator";
import { RevealOnScroll } from "../components/motion/RevealOnScroll";
import { WarmWash } from "./components/WarmWash";
import { LiveTrio } from "./components/LiveTrio";
import { BenefitsList } from "./components/BenefitsList";
import { FounderForm } from "./components/FounderForm";

/**
 * /founders — Act 2: the invitation. Warming-tone conversion scene: hero, the
 * live urgency trio, founder benefits, urgency block, and the signup form.
 */
export default function FoundersPage() {
  return (
    <main className="relative">
      <WarmWash />
      <ScrollProgress />
      <ChapterIndicator index={2} total={3} label="the invitation" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-28 text-center">
        <RevealOnScroll>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.4em] text-treasure/80">
            // the expedition is forming
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h1 className="text-balance text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
            Become one of the first
            <br />
            <span className="text-treasure text-6xl sm:text-8xl">1000</span>
            <br />
            Founding Explorers
          </h1>
        </RevealOnScroll>
        <RevealOnScroll delay={0.25} className="mt-12 w-full">
          <LiveTrio />
        </RevealOnScroll>
        <RevealOnScroll delay={0.4}>
          <p className="mt-14 font-mono text-[10px] uppercase tracking-[0.4em] text-ink-faint">
            scroll to claim your place
          </p>
        </RevealOnScroll>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="relative px-6 py-20">
        <RevealOnScroll className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            What founders carry forever
          </h2>
        </RevealOnScroll>
        <BenefitsList />
      </section>

      {/* ── Urgency ──────────────────────────────────────────────────────── */}
      <section className="relative px-6 py-16 text-center">
        <RevealOnScroll>
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-ink-soft">
            Only 1000 spots.
          </p>
          <p className="mt-2 font-mono text-sm uppercase tracking-[0.3em] text-treasure">
            Never available again.
          </p>
        </RevealOnScroll>
      </section>

      {/* ── Signup form ──────────────────────────────────────────────────── */}
      <section className="relative px-6 pb-36 pt-6">
        <RevealOnScroll className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Claim your founder number
          </h2>
        </RevealOnScroll>
        <Suspense fallback={<div className="h-96" />}>
          <FounderForm />
        </Suspense>
      </section>
    </main>
  );
}
