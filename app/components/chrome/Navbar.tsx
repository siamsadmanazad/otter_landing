"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

/**
 * Navbar — minimal cinematic nav. Transparent at the top; gains a subtle
 * glass-blur background once scrolled. Tiny Otti mark left, a single CTA right.
 * Part of the scene, never a dashboard. (Mystery-safe: no app name / feature links.)
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-5 py-3 transition-all duration-500 sm:px-8 ${
          scrolled
            ? "mt-2 rounded-full border border-white/10 bg-noir-900/50 backdrop-blur-xl sm:mx-6"
            : "border border-transparent"
        }`}
      >
        <Link href="/findotti" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-signal text-sm">
            🦦
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-ink-soft">
            otti
          </span>
        </Link>

        <Link
          href="/founders"
          className="rounded-full border border-signal-2/40 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-signal-2 transition-colors hover:bg-signal-2/10"
        >
          Join
        </Link>
      </div>
    </motion.header>
  );
}
