"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ScrollProgress } from "../components/motion/ScrollProgress";
import { ChapterIndicator } from "../components/chrome/ChapterIndicator";
import { RevealOnScroll } from "../components/motion/RevealOnScroll";
import { PrimaryCta } from "../components/PrimaryCta";
import { CountUp } from "../components/motion/CountUp";
import { SceneBackdrop } from "../components/scene/SceneBackdrop";
import { OttiStage } from "../components/otti/OttiStage";
import { FounderStamp } from "./components/FounderStamp";
import { ASSETS } from "@/lib/assets";
import { ReferralShare } from "./components/ReferralShare";
import { RewardTiers } from "./components/RewardTiers";
import { Leaderboard } from "../components/leaderboard/Leaderboard";
import { UniversityRace } from "../components/leaderboard/UniversityRace";
import { FOUNDER_CAP, getMe, type MeStats } from "@/lib/founders";
import { trackVerified } from "@/lib/analytics";

/**
 * WelcomeDashboard — the full Act 3 experience. Warmest tone (gold celebration),
 * confetti on arrival, then the gamified climb (referral, rewards, leaderboards).
 */
export function WelcomeDashboard() {
  const params = useSearchParams();
  const code = params.get("code") ?? "TO-OTTI-XXXX";
  const urlPos = Number(params.get("pos")) || 287;

  // Live per-lead stats (real rank + invites). URL ?pos is the instant fallback.
  const [me, setMe] = useState<MeStats | null>(null);
  useEffect(() => {
    let on = true;
    if (code && code !== "TO-OTTI-XXXX") getMe(code).then((m) => on && setMe(m));
    return () => {
      on = false;
    };
  }, [code]);

  // Fire the verify conversion once, when arriving from the email-verify redirect.
  useEffect(() => {
    if (params.get("verified") === "1") trackVerified();
  }, [params]);

  const position = me?.position ?? urlPos;
  const rank = me?.rank ?? position;
  const invites = me?.invites ?? 0;
  const remaining = Math.max(0, FOUNDER_CAP - position);
  // First 1000 are Founders; everyone past that is captured too, shown as a waitlist tier.
  const isFounder = position <= FOUNDER_CAP;
  const waitlistNo = Math.max(1, position - FOUNDER_CAP);

  return (
    <main className="relative">
      {/* Act 3 lives in a continuous STARLIT NIGHT world (image slot ready). */}
      <SceneBackdrop fixed tone="night" image={ASSETS.summitBg} priority />
      <ScrollProgress />
      <ChapterIndicator index={3} total={3} label="the reveal" />

      {/* ── Stamp + rank ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-24 text-center">
        {/* Celebrating Otti slot (renders when otti_celebrate.png lands). */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[6%] z-0 flex justify-center opacity-90">
          <OttiStage src={ASSETS.ottiCelebrate} alt="Otti celebrating" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
        <FounderStamp position={position} waitlist={!isFounder} />

        <div className="mt-12 flex items-center gap-8 font-mono">
          {isFounder ? (
            <>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-ink-faint">rank</p>
                <p className="mt-1 text-2xl font-bold">
                  <CountUp value={rank} /> <span className="text-ink-faint">/ {FOUNDER_CAP.toLocaleString()}</span>
                </p>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-ink-faint">spots left</p>
                <p className="mt-1 text-2xl font-bold text-treasure">
                  <CountUp value={remaining} />
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-ink-faint">waitlist spot</p>
                <p className="mt-1 text-2xl font-bold">
                  #<CountUp value={waitlistNo} />
                </p>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-ink-faint">founder spots</p>
                <p className="mt-1 text-2xl font-bold text-treasure">full</p>
              </div>
            </>
          )}
        </div>

        <RevealOnScroll delay={0.4}>
          <p className="mt-14 font-mono text-[10px] uppercase tracking-[0.4em] text-ink-faint">
            {isFounder ? "scroll — your climb begins" : "scroll — refer to move up the line"}
          </p>
        </RevealOnScroll>
        </div>
      </section>

      {/* ── Referral + share ─────────────────────────────────────────────── */}
      <section className="relative px-6 py-20">
        <ReferralShare code={code} basePosition={position} />
      </section>

      {/* ── Reward tiers ─────────────────────────────────────────────────── */}
      <section className="relative px-6 py-16">
        <RevealOnScroll className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Unlock as you climb</h2>
        </RevealOnScroll>
        <RewardTiers invites={invites} />
      </section>

      {/* ── Leaderboards ─────────────────────────────────────────────────── */}
      <section className="relative grid gap-14 px-6 py-16 sm:grid-cols-2">
        <RevealOnScroll>
          <Leaderboard />
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <UniversityRace />
        </RevealOnScroll>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center px-6 pb-36 pt-10 text-center">
        <RevealOnScroll>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">
            Otti found his people.
          </h2>
          <p className="mt-4 font-mono text-sm text-ink-soft">The journey begins 08.05.2026.</p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.2} className="mt-10">
          <PrimaryCta
            preLabel="See the full leaderboard"
            preHref="/leaderboard"
            postLabel="Claim your Founder Badge"
          />
        </RevealOnScroll>
      </section>
    </main>
  );
}
