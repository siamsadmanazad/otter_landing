"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ScrambleNumber } from "../../components/motion/ScrambleNumber";
import { referralUrl } from "@/lib/site";

/**
 * ReferralShare — the gamified referral core: the personal link + copy, the
 * Facebook / Messenger / WhatsApp share row, and a "+5 places per invite" demo
 * that slot-machine rolls the rank so the mechanic feels like a game.
 */
export function ReferralShare({
  code,
  basePosition,
}: {
  code: string;
  basePosition: number;
}) {
  const url = referralUrl(code);
  const [copied, setCopied] = useState(false);
  const [invites, setInvites] = useState(0);

  const projected = Math.max(1, basePosition - invites * 5);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  const shareText = encodeURIComponent("I found Otti. Join the founding expedition →");
  const enc = encodeURIComponent(url);
  const shares = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc}` },
    { label: "Messenger", href: `https://www.facebook.com/dialog/send?link=${enc}&app_id=0&redirect_uri=${enc}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${shareText}%20${enc}` },
  ];

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
        // move up the ranks
      </p>
      <h3 className="mt-2 text-center text-xl font-bold">Invite friends, climb the expedition</h3>

      {/* Link + copy */}
      <div className="mt-6 flex items-center gap-2 rounded-full border border-white/10 bg-noir-800/50 p-1.5 pl-4 backdrop-blur-[var(--fx-glass-sm)]">
        <span className="flex-1 truncate font-mono text-sm text-signal-2">{url}</span>
        <button
          onClick={copy}
          className="bg-signal rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-noir-950 transition-transform active:scale-95"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      {/* Share row */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {shares.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 bg-noir-800/40 py-3 text-center font-mono text-[11px] uppercase tracking-wider text-ink-soft transition-colors hover:border-treasure/40 hover:text-treasure"
          >
            {s.label}
          </a>
        ))}
      </div>

      {/* +5 per invite demo */}
      <div className="mt-8 rounded-2xl border border-treasure/15 bg-noir-800/40 p-5 text-center backdrop-blur-[var(--fx-glass-sm)]">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
          every invite moves you up 5 places
        </p>
        <p className="mt-3 text-3xl font-bold">
          #<ScrambleNumber value={projected} pad={4} className="text-treasure" />
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setInvites((n) => Math.max(0, n - 1))}
            className="h-8 w-8 rounded-full border border-white/15 text-ink-soft"
            aria-label="fewer invites"
          >
            −
          </button>
          <motion.span
            key={invites}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="min-w-28 font-mono text-xs uppercase tracking-wider text-ink-soft"
          >
            {invites} invite{invites === 1 ? "" : "s"}
          </motion.span>
          <button
            onClick={() => setInvites((n) => n + 1)}
            className="h-8 w-8 rounded-full border border-treasure/40 text-treasure"
            aria-label="more invites"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
