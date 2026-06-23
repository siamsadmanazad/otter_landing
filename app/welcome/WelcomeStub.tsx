"use client";

import { useSearchParams } from "next/navigation";

/**
 * WelcomeStub — placeholder reveal for L3 so the founders redirect lands. Shows
 * the founder number + referral code returned by join. Replaced by the full
 * Act 3 dashboard in L4.
 */
export function WelcomeStub() {
  const params = useSearchParams();
  const pos = params.get("pos");
  const code = params.get("code");

  return (
    <div className="flex flex-col items-center">
      <p className="mb-4 text-5xl">🎉</p>
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-treasure/80">
        welcome, explorer
      </p>
      <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
        Founder{" "}
        <span className="text-treasure">#{pos ? String(pos).padStart(4, "0") : "—"}</span>
      </h1>
      {code && (
        <p className="mt-8 font-mono text-sm text-ink-soft">
          your referral code:{" "}
          <span className="text-signal-2">{code}</span>
        </p>
      )}
      <p className="mt-10 max-w-sm font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint">
        full dashboard · referral · leaderboard — coming in act 3
      </p>
    </div>
  );
}
