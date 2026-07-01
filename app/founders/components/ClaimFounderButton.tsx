"use client";

import { scrollToHash } from "../../components/motion/scrollToHash";

/**
 * ClaimFounderButton — the Camp hero's CTA back to the join form. Uses
 * scrollToHash (Lenis-aware) instead of a plain `<a href="#join">`, since a
 * native anchor jump gets fought/reverted by Lenis's own scroll-position
 * tracking on this page — the button would otherwise silently do nothing.
 */
export function ClaimFounderButton() {
  return (
    <a
      href="#join"
      onClick={(e) => {
        // Only prevent the native anchor jump if scrollToHash actually found
        // the target — if something's ever wrong there, the plain href still
        // works as a last-resort fallback rather than doing nothing.
        if (scrollToHash("#join")) e.preventDefault();
      }}
      className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ink-soft underline decoration-ink-faint/40 underline-offset-4 transition-colors hover:text-signal-2 hover:decoration-signal-2/60"
    >
      Claim your founder number
      <span aria-hidden className="transition-transform group-hover:translate-x-1">
        ↑
      </span>
    </a>
  );
}
