import { Suspense } from "react";
import { ScrollProgress } from "../components/motion/ScrollProgress";
import { ChapterIndicator } from "../components/chrome/ChapterIndicator";
import { RevealOnScroll } from "../components/motion/RevealOnScroll";
import { SceneBackdrop } from "../components/scene/SceneBackdrop";
import { OttiStage } from "../components/otti/OttiStage";
import { LiveTrio } from "./components/LiveTrio";
import { BenefitsList } from "./components/BenefitsList";
import { FounderForm } from "./components/FounderForm";
import { ASSETS } from "@/lib/assets";

/**
 * /founders — Act 2: the invitation. Warming-tone conversion scene: hero, the
 * live urgency trio, founder benefits, urgency block, and the signup form.
 */
export default function FoundersPage() {
  return (
    <main className="relative">
      {/* Act 2 lives in a continuous DEEP TWILIGHT world (image slot ready). */}
      <SceneBackdrop fixed tone="twilight" image={ASSETS.foundersBg} priority />
      <ScrollProgress />
      <ChapterIndicator index={2} total={3} label="the invitation" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-dvh flex-col items-center px-6 pb-24 pt-[12vh] text-center">
        {/* Inviting Otti — grounded focal anchor, standing on his rock. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[2%] z-0 flex justify-center">
          <OttiStage
            src={ASSETS.ottiInvite}
            alt="Otti inviting you to join"
            heightClass="h-[34vh] max-h-[400px] min-h-[230px]"
            width={1060}
            height={1484}
            priority
          />
        </div>

        {/* Headline scrim — keeps the upper copy crisp over the scene. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[62%]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,7,13,0.68), rgba(5,7,13,0.30) 45%, transparent)",
          }}
        />

        <div className="relative z-10 flex w-full max-w-2xl flex-col items-center [text-shadow:0_2px_28px_rgba(0,0,0,0.75)]">
          <RevealOnScroll immediate>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-treasure sm:text-xs sm:tracking-[0.4em]">
              // the expedition is forming
            </p>
          </RevealOnScroll>
          <RevealOnScroll immediate delay={0.1} className="w-full">
            <h1 className="w-full text-pretty text-2xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Become one of the first</span>
              <span className="my-1 block text-6xl leading-none text-treasure drop-shadow-[0_6px_30px_rgba(255,122,69,0.5)] sm:text-8xl">
                1000
              </span>
              <span className="block">Founding Explorers</span>
            </h1>
          </RevealOnScroll>
          <RevealOnScroll immediate delay={0.25} className="mt-9 w-full">
            <LiveTrio />
          </RevealOnScroll>
        </div>

        <RevealOnScroll immediate delay={0.4} className="relative z-10 mt-auto">
          <p className="pt-10 font-mono text-[10px] uppercase tracking-[0.32em] text-ink-soft/80 [text-shadow:0_1px_12px_rgba(0,0,0,0.85)]">
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
