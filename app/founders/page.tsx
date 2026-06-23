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
      <section className="relative flex min-h-[100svh] flex-col items-center px-6 pb-10 pt-[10vh] text-center">
        {/* Inviting Otti — grounded focal anchor at the base of the scene,
            behind the copy so his size never displaces the CTA. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center">
          <OttiStage
            src={ASSETS.ottiInvite}
            alt="Otti inviting you to join"
            heightClass="h-[40vh] max-h-[440px] min-h-[230px]"
            width={1060}
            height={1484}
            priority
          />
        </div>

        {/* Headline scrim — keeps the upper copy crisp over the scene. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[58%]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,7,13,0.70), rgba(5,7,13,0.32) 45%, transparent)",
          }}
        />

        {/* Copy cluster: eyebrow → headline → live counter → CTA. Extends down
            toward Otti so there's no dead band between the text and the mascot. */}
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
          <RevealOnScroll immediate delay={0.25} className="mt-7 w-full">
            <LiveTrio />
          </RevealOnScroll>

          {/* Primary CTA — the hero's call to action, anchors to the form. */}
          <RevealOnScroll immediate delay={0.35} className="mt-5 [text-shadow:none]">
            <a
              href="#join"
              className="bg-signal glow-signal group inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-noir-950 transition-transform active:scale-95"
            >
              Claim your founder number
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </RevealOnScroll>
        </div>

        <RevealOnScroll immediate delay={0.5} className="relative z-10 mt-auto pt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink-soft/70 [text-shadow:0_1px_12px_rgba(0,0,0,0.85)]">
            scroll to explore the charter
          </p>
        </RevealOnScroll>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="relative px-6 py-20">
        <RevealOnScroll className="mb-10 text-center">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-treasure sm:text-xs sm:tracking-[0.4em]">
            // the founder&apos;s charter
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            What founders carry forever
          </h2>
        </RevealOnScroll>
        <BenefitsList />
      </section>

      {/* ── Signup form ──────────────────────────────────────────────────── */}
      <section id="join" className="relative scroll-mt-24 px-6 pb-36 pt-6">
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
