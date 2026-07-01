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
import { LiveTrio, FounderHud } from "./components/LiveTrio";
import { BenefitsList } from "./components/BenefitsList";
import { WhyTripotter } from "./components/WhyTripotter";
import { FounderForm } from "./components/FounderForm";
import { JoinCause } from "./components/JoinCause";
import { CampHeadline } from "./components/CampHeadline";
import { CampFlankRow } from "./components/CampFlankRow";
import { ClaimFounderButton } from "./components/ClaimFounderButton";
import { ASSETS } from "@/lib/assets";

/**
 * /founders — Act 2: the invitation. The signup form leads (top of page, so it's
 * the first thing a visitor acts on), then the Camp hero and Charter follow in
 * their original story order.
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

      {/* ── Scene 0: Claim your number (form) — leads the page ──────────────── */}
      <section id="join" className="relative scroll-mt-24 px-6 pb-16 pt-28 text-center">
        <SceneBackdrop tone="night" blendTop={false} />
        <FoliageFrame />
        <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center">
          {/* A small lantern-Otti echo lights the decision point. */}
          <div className="pointer-events-none">
            <OttiStage
              src={ASSETS.ottiInvite}
              alt="Otti waiting at the camp"
              heightClass="h-[22vh] max-h-[250px] min-h-[120px] sm:min-h-[160px]"
              width={1060}
              height={1484}
            />
          </div>
          <RevealOnScroll className="mt-2">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.28em] text-treasure sm:tracking-[0.4em]">
              // your seat at the fire
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Claim your founder number
            </h2>
          </RevealOnScroll>

          {/* Meaning behind the number — before the counter, so the stakes land first. */}
          <RevealOnScroll delay={0.05} className="mt-4 max-w-md">
            <p className="font-mono text-xs uppercase leading-relaxed tracking-[0.15em] text-ink-faint sm:text-sm">
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
          <RevealOnScroll delay={0.15} className="mt-8 w-full max-w-lg rounded-2xl border border-white/10 bg-noir-800/40 px-6 py-5 text-left backdrop-blur-sm [text-shadow:none]">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-treasure sm:text-sm">
              Why do we need your email?
            </p>
            <ul className="mt-3 space-y-2 text-base text-ink-soft">
              <li>✓ Reserve your Founder Number</li>
              <li>✓ Notify you when Tripotter launches</li>
              <li>✓ Send updates about Otti&apos;s journey</li>
            </ul>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
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

      {/* ── Bridge: gives the scroll runway before the pinned Camp scene a reason to exist ── */}
      <JoinCause />

      {/* ── Scene 1: The Camp (pinned hero) ─────────────────────────────────── */}
      <CinematicScene
        pin
        pinContent={
          // Mobile: a genuine flex column (headline → flank row → CTA), which
          // flexbox mathematically cannot let overlap regardless of viewport
          // aspect ratio — the previous approach mixed normal-flow (headline)
          // with two independently absolute-positioned, fixed-% blocks, which
          // could only ever be tuned for specific aspect ratios and kept
          // recurring on anything unusual. Desktop (md:) reverts to the
          // existing absolute layout via md: overrides, since that already
          // has more room to spare and was already confirmed working.
          <div className="relative flex min-h-dvh w-full flex-col px-6 pb-6 md:block">
            {/* Headline up in the dusk sky: kicker + "Become one of the first
                / 1000". "Founding Explorers" now flanks Otti below instead of
                overlapping this block. */}
            <div className="relative z-20 mx-auto flex max-w-2xl flex-col items-center pt-[6vh] text-center [text-shadow:0_2px_28px_rgba(0,0,0,0.75)] md:pt-[13vh]">
              <RevealOnScroll immediate>
                <p className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-treasure sm:text-sm sm:tracking-[0.4em]">
                  // the expedition is forming
                </p>
              </RevealOnScroll>
              <RevealOnScroll immediate delay={0.1} className="w-full">
                <CampHeadline />
              </RevealOnScroll>
            </div>

            {/* Otti stands fully visible, undimmed, dead centre — "Founding" and
                "Explorers" flank him left/right (reads as "Founding [Otti]
                Explorers"), each with its own scroll-drift. Nothing overlaps
                him. Mobile: flex-1 fills the remaining space and centres Otti
                in it. Desktop: reverts to absolute + fixed bottom-%. */}
            <div className="pointer-events-none relative z-10 flex flex-1 items-center justify-center py-4 md:absolute md:inset-x-0 md:bottom-[10%] md:flex-none md:px-6 md:py-0">
              <RevealOnScroll immediate delay={0.15} className="mx-auto w-full max-w-2xl md:max-w-4xl lg:max-w-5xl">
                <CampFlankRow />
              </RevealOnScroll>
            </div>

            {/* Grounded action — CTA + scroll cue. Mobile: last flex child, so
                it's always after the flank row, never fought over the same
                space. Desktop: reverts to absolute-pinned-low as before. */}
            <div className="relative z-20 flex flex-col items-center gap-5 md:absolute md:inset-x-0 md:bottom-7 md:px-6">
              <RevealOnScroll immediate delay={0.3} className="[text-shadow:none]">
                <ClaimFounderButton />
              </RevealOnScroll>
              <RevealOnScroll immediate delay={0.6}>
                <p className="text-center font-mono text-xs uppercase tracking-[0.4em] text-ink-faint [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
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

      {/* ── Scene 2: The Charter (benefits) — the page's last scene, so its
          backdrop fades all the way into the footer instead of hard-cutting ── */}
      <section className="relative px-6 pb-24">
        {/* Melt up out of the camp's bottom fade. */}
        <div className="relative -mt-[16vh]">
          <SceneBackdrop tone="twilight" blendTop />
          <FoliageFrame />
          <div className="relative z-10 pt-[18vh]">
            <WhyTripotter />
            <RevealOnScroll className="mb-10 text-center">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.28em] text-treasure sm:text-sm sm:tracking-[0.4em]">
                // the founder&apos;s charter
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                What founders carry forever
              </h2>
            </RevealOnScroll>
            <BenefitsList />
          </div>
        </div>
      </section>
    </main>
  );
}
