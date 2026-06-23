"use client";

import { useSearchParams } from "next/navigation";
import { ScrollProgress } from "../components/motion/ScrollProgress";
import { ChapterIndicator } from "../components/chrome/ChapterIndicator";
import { RevealOnScroll } from "../components/motion/RevealOnScroll";
import { MagneticButton } from "../components/motion/MagneticButton";
import { CountUp } from "../components/motion/CountUp";
import { WarmWash } from "../founders/components/WarmWash";
import { FounderStamp } from "./components/FounderStamp";
import { ReferralShare } from "./components/ReferralShare";
import { RewardTiers } from "./components/RewardTiers";
import { Leaderboard } from "../components/leaderboard/Leaderboard";
import { UniversityRace } from "../components/leaderboard/UniversityRace";
import { FOUNDER_CAP } from "@/lib/founders";

/**
 * WelcomeDashboard — the full Act 3 experience. Warmest tone (gold celebration),
 * confetti on arrival, then the gamified climb (referral, rewards, leaderboards).
 */
export function WelcomeDashboard() {
  const params = useSearchParams();
  const code = params.get("code") ?? "TO-OTTI-XXXX";
  const position = Number(params.get("pos")) || 287;
  const remaining = Math.max(0, FOUNDER_CAP - position);

  return (
    <main className="relative">
      <WarmWash />
      <ScrollProgress />
      <ChapterIndicator index={3} total={3} label="the reveal" />

      {/* ── Stamp + rank ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-24 text-center">
        <FounderStamp position={position} />

        <div className="mt-12 flex items-center gap-8 font-mono">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-ink-faint">rank</p>
            <p className="mt-1 text-2xl font-bold">
              <CountUp value={position} /> <span className="text-ink-faint">/ {FOUNDER_CAP.toLocaleString()}</span>
            </p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-ink-faint">spots left</p>
            <p className="mt-1 text-2xl font-bold text-treasure">
              <CountUp value={remaining} />
            </p>
          </div>
        </div>

        <RevealOnScroll delay={0.4}>
          <p className="mt-14 font-mono text-[10px] uppercase tracking-[0.4em] text-ink-faint">
            scroll — your climb begins
          </p>
        </RevealOnScroll>
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
        <RewardTiers invites={0} />
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
          <MagneticButton href="/leaderboard">See the full leaderboard</MagneticButton>
        </RevealOnScroll>
      </section>
    </main>
  );
}
