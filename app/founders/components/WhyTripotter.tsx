"use client";

import { RevealOnScroll } from "../../components/motion/RevealOnScroll";

/**
 * WhyTripotter — the concept reveal + emotional hook, placed right before the
 * Founder's Charter. /findotti stays mystery-only; this is the page where the
 * concept finally gets named, so this is where "why Tripotter" belongs.
 */
export function WhyTripotter() {
  return (
    <div className="mx-auto mb-16 max-w-2xl text-center">
      <RevealOnScroll>
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.28em] text-treasure sm:tracking-[0.4em]">
          // why tripotter
        </p>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Tripotter?</h2>
        <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
          Most travel apps help you plan trips.
        </p>
        <p className="mt-3 text-lg font-semibold text-ink sm:text-xl">
          Tripotter helps you discover people, stories, and hidden places worth remembering.
        </p>
        <p className="mt-3 text-base leading-relaxed text-ink-soft sm:text-lg">
          We&apos;re building a community where every journey becomes a shared experience.
        </p>
        <p className="mt-5 font-mono text-sm uppercase tracking-[0.2em] text-treasure/80">
          That&apos;s why Otti has been searching — for explorers like you.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={0.15} className="mt-14">
        <h3 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
          Every great journey starts with finding your people.
        </h3>
        <p className="mt-3 text-base leading-relaxed text-ink-soft sm:text-lg">
          Tripotter isn&apos;t just another platform. It&apos;s a home for explorers who believe
          every place has a story worth sharing.
        </p>
      </RevealOnScroll>
    </div>
  );
}
