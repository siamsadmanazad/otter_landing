import { Suspense } from "react";
import { ParticleField } from "../components/atmosphere/ParticleField";
import { ScrollProgress } from "../components/motion/ScrollProgress";
import { ChapterIndicator } from "../components/chrome/ChapterIndicator";
import { RevealOnScroll } from "../components/motion/RevealOnScroll";
import { CinematicScene } from "../components/scene/CinematicScene";
import { SceneLayer } from "../components/scene/SceneLayer";
import { SceneBackdrop } from "../components/scene/SceneBackdrop";
import { FloatingCharms } from "../components/otti/FloatingCharms";
import { OttiStage } from "../components/otti/OttiStage";
import { FoliageFrame } from "../findotti/components/FoliageFrame";
import { CampBackdrop } from "./components/CampBackdrop";
import { InviteOtti } from "./components/InviteOtti";
import { LiveTrio, FounderHud } from "./components/LiveTrio";
import { BenefitsList } from "./components/BenefitsList";
import { WhyTripotter } from "./components/WhyTripotter";
import { FounderForm } from "./components/FounderForm";
import { ASSETS } from "@/lib/assets";

/**
 * /founders — Act 2: the invitation. Staged as a cinematic film to match Act 1
 * (/findotti): a pinned camp hero where Otti — lantern raised — invites you to the
 * fire, the charter melting up out of the camp through night foliage, and the
 * signup resolving as the trail's terminus. One continuous twilight→night world.
 */
export default function FoundersPage() {
  return (
    <main className="relative">
      {/* Ambient fireflies/embers drifting across the whole act (matches Act 1). */}
      <ParticleField />
      <ScrollProgress />
      <ChapterIndicator index={2} total={3} label="the invitation" />

      {/* Floating urgency HUD — always-visible, pinned top-right (desktop). */}
      <div className="pointer-events-none fixed right-4 top-24 z-30 hidden md:block">
        <FounderHud />
      </div>

      {/* ── Scene 1: The Camp (pinned hero) ─────────────────────────────────── */}
      <CinematicScene
        pin
        pinContent={
          <div className="relative min-h-dvh w-full px-6">
            {/* Headline up in the dusk sky. */}
            <div className="mx-auto flex max-w-2xl flex-col items-center pt-[13vh] text-center [text-shadow:0_2px_28px_rgba(0,0,0,0.75)]">
              <RevealOnScroll immediate>
                <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-treasure sm:text-xs sm:tracking-[0.4em]">
                  // the expedition is forming
                </p>
              </RevealOnScroll>
              <RevealOnScroll immediate delay={0.1} className="w-full">
                <h1 className="w-full text-pretty text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
                  <span className="block">Become one of the first</span>
                  <span className="my-1 block text-6xl leading-none text-treasure drop-shadow-[0_6px_30px_rgba(255,122,69,0.5)] sm:text-8xl">
                    1000
                  </span>
                  <span className="block">Founding Explorers</span>
                </h1>
              </RevealOnScroll>
            </div>

            {/* Otti — lantern raised — grounded on the camp stage. Absolutely
                placed so he sits in the scene regardless of headline height. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-[16%] flex justify-center sm:bottom-[22%]">
              <InviteOtti />
            </div>

            {/* Grounded action — CTA + scroll cue pinned low so Otti never covers
                them (he stands above, on the rock). */}
            <div className="absolute inset-x-0 bottom-7 flex flex-col items-center gap-5 px-6">
              <RevealOnScroll immediate delay={0.3} className="[text-shadow:none]">
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
              <RevealOnScroll immediate delay={0.6}>
                <p className="text-center font-mono text-[10px] uppercase tracking-[0.4em] text-ink-faint [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
                  scroll to read the charter
                </p>
              </RevealOnScroll>
            </div>
          </div>
        }
      >
        {/* The painterly camp as the deep, slow-parallax backdrop + companions. */}
        <SceneLayer depth={0.08} disableScrubOnMobile>
          <CampBackdrop />
        </SceneLayer>
        <FloatingCharms />
      </CinematicScene>

      {/* ── Scene 2: The Charter (benefits) ─────────────────────────────────── */}
      <section className="relative px-6 pb-10">
        {/* Melt up out of the camp's bottom fade. */}
        <div className="relative -mt-[16vh]">
          <SceneBackdrop tone="twilight" blendTop blendBottom={false} />
          <FoliageFrame />
          <div className="relative z-10 pt-[18vh]">
            <WhyTripotter />
            <RevealOnScroll className="mb-10 text-center">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-treasure sm:text-xs sm:tracking-[0.4em]">
                // the founder&apos;s charter
              </p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                What founders carry forever
              </h2>
            </RevealOnScroll>
            <BenefitsList />
          </div>
        </div>
      </section>

      {/* ── Scene 3: Claim your number (form) — the terminus ────────────────── */}
      <section id="join" className="relative scroll-mt-24 px-6 pb-36 pt-2 text-center">
        <SceneBackdrop tone="night" blendTop={false} />
        <FoliageFrame />
        <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center">
          {/* A small lantern-Otti echo lights the decision point. */}
          <div className="pointer-events-none">
            <OttiStage
              src={ASSETS.ottiInvite}
              alt="Otti waiting at the camp"
              heightClass="h-[18vh] max-h-[200px] min-h-[100px] sm:min-h-[130px]"
              width={1060}
              height={1484}
            />
          </div>
          <RevealOnScroll className="mt-2">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-treasure sm:tracking-[0.4em]">
              // your seat at the fire
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Claim your founder number
            </h2>
          </RevealOnScroll>

          {/* Meaning behind the number — before the counter, so the stakes land first. */}
          <RevealOnScroll delay={0.05} className="mt-4 max-w-sm">
            <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-ink-faint">
              Only the first 1,000 explorers will ever receive a Founder Number.
              <br />
              It can never be claimed again.
            </p>
          </RevealOnScroll>

          {/* Full live counter at the moment of decision. */}
          <RevealOnScroll delay={0.1} className="mt-7 w-full">
            <LiveTrio />
          </RevealOnScroll>

          {/* Trust block — why we ask for an email, right before the form. */}
          <RevealOnScroll delay={0.15} className="mt-8 w-full max-w-md rounded-2xl border border-white/10 bg-noir-800/40 px-5 py-4 text-left backdrop-blur-sm [text-shadow:none]">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-treasure">
              Why do we need your email?
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
              <li>✓ Reserve your Founder Number</li>
              <li>✓ Notify you when Tripotter launches</li>
              <li>✓ Send updates about Otti&apos;s journey</li>
            </ul>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              No spam. Unsubscribe anytime.
            </p>
          </RevealOnScroll>

          <div className="mt-6 w-full [text-shadow:none]">
            <Suspense fallback={<div className="h-96" />}>
              <FounderForm />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
