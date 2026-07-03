"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { scrollToHash } from "../motion/scrollToHash";

/**
 * Navbar — minimal cinematic nav. Transparent at the top; gains a subtle
 * glass-blur background once scrolled. Tiny Otti mark left, a single CTA right.
 * Part of the scene, never a dashboard. (Mystery-safe: no app name / feature links.)
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const pathname = usePathname();

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
      {/* Stable centered wrapper — geometry never changes on scroll. */}
      <div className="mx-auto max-w-6xl px-4 pt-2 sm:px-6">
        {/* Inner pill — only the glass styling fades in on scroll (no layout shift). */}
        <div
          className={`flex items-center justify-between rounded-full border px-5 py-3.5 transition-colors duration-500 sm:px-6 sm:py-4 ${
            scrolled
              ? "border-white/10 bg-noir-900/50 backdrop-blur-[var(--fx-glass-xl)]"
              : "border-transparent"
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/findotti" className="flex items-center gap-2.5">
              <Image
                src="/otti/otter_logo.png"
                alt="Otti"
                width={36}
                height={36}
                className="h-8 w-8 drop-shadow sm:h-9 sm:w-9"
              />
              <span className="font-mono text-xs uppercase tracking-[0.35em] text-ink-soft sm:text-sm">
                otti
              </span>
            </Link>

            {/* Small glass social buttons, beside the mark — same understated
                glass language as the nav pill itself, monochrome not brand-colour. */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <a
                href="https://www.instagram.com/trip.otter"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Otti on Instagram"
                className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-ink-faint backdrop-blur-[var(--fx-glass-sm)] transition-colors hover:border-white/20 hover:bg-white/10 hover:text-ink-soft sm:h-9 sm:w-9"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.facebook.com/tripotter.net"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Otti on Facebook"
                className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-ink-faint backdrop-blur-[var(--fx-glass-sm)] transition-colors hover:border-white/20 hover:bg-white/10 hover:text-ink-soft sm:h-9 sm:w-9"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          <Link
            href="/founders#join"
            onClick={(e) => {
              // Same page already: a native hash jump gets fought/reverted by
              // Lenis's own scroll tracking, so drive it through Lenis instead.
              // Cross-page: let Next.js navigate normally (SmoothScroll handles
              // the hash once Lenis mounts on the new page).
              if (pathname === "/founders" && scrollToHash("#join")) {
                e.preventDefault();
              }
            }}
            className="relative rounded-full border border-signal-2/40 px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] text-signal-2 transition-colors hover:bg-signal-2/10 sm:px-6 sm:py-2.5 sm:text-sm"
          >
            {/* Tempting pulse — a soft expanding ring, elegant not obnoxious. */}
            <motion.span
              aria-hidden
              className="absolute inset-0 -z-10 rounded-full bg-signal-2/25"
              animate={reduce ? {} : { opacity: [0.4, 0, 0.4], scale: [1, 1.4, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative">Join</span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.5 21v-8.2h2.7l.4-3.2h-3.1V7.6c0-.9.3-1.6 1.6-1.6h1.6V3.1C17.4 3 16.4 3 15.3 3c-2.7 0-4.6 1.7-4.6 4.7v2.9H7.9v3.2h2.8V21h3.8Z" />
    </svg>
  );
}
