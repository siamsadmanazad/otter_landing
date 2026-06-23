import { ScrollProgress } from "../components/motion/ScrollProgress";
import { RevealOnScroll } from "../components/motion/RevealOnScroll";
import { MagneticButton } from "../components/motion/MagneticButton";
import { WarmWash } from "../founders/components/WarmWash";
import { Leaderboard } from "../components/leaderboard/Leaderboard";
import { UniversityRace } from "../components/leaderboard/UniversityRace";

/**
 * /leaderboard — the public board: top explorers + the university race. Shareable
 * social-proof surface ("BRAC takes the lead — can NSU catch up?").
 */
export default function LeaderboardPage() {
  return (
    <main className="relative">
      <WarmWash />
      <ScrollProgress />

      <section className="relative px-6 pb-10 pt-32 text-center">
        <RevealOnScroll>
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-treasure/80">
            // the expedition leaderboard
          </p>
          <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight sm:text-6xl">
            Who is leading the climb?
          </h1>
          <p className="mt-4 font-mono text-sm text-ink-soft">
            🔥 BRAC takes the lead — can NSU catch up?
          </p>
        </RevealOnScroll>
      </section>

      <section className="relative grid gap-14 px-6 py-12 sm:grid-cols-2">
        <RevealOnScroll>
          <Leaderboard />
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <UniversityRace />
        </RevealOnScroll>
      </section>

      <section className="relative flex flex-col items-center px-6 pb-36 pt-10 text-center">
        <RevealOnScroll>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Not on the board yet?
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.15} className="mt-8">
          <MagneticButton href="/founders">Become a Founding Explorer</MagneticButton>
        </RevealOnScroll>
      </section>
    </main>
  );
}
