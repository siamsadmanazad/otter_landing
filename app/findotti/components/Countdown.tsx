"use client";

import { useEffect, useState } from "react";

const TARGET = new Date("2026-08-05T00:00:00").getTime();

function diff() {
  const ms = Math.max(0, TARGET - Date.now());
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return { d, h, m, s };
}

/**
 * Countdown — live mono ticker to 08.05.2026. Renders nothing until mounted
 * (avoids hydration mismatch on the time-dependent values).
 */
export function Countdown() {
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff());
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  const cells: [string, number][] = t
    ? [
        ["days", t.d],
        ["hrs", t.h],
        ["min", t.m],
        ["sec", t.s],
      ]
    : [
        ["days", 0],
        ["hrs", 0],
        ["min", 0],
        ["sec", 0],
      ];

  return (
    <div className="flex w-full max-w-full items-stretch justify-center gap-[clamp(0.25rem,2.5vw,1rem)] font-mono">
      {cells.map(([label, val], i) => (
        <div key={label} className="flex items-center gap-[clamp(0.25rem,2.5vw,1rem)]">
          <div className="flex flex-col items-center">
            <span className="grid min-w-[2.4ch] place-items-center rounded-xl border border-white/[0.08] bg-noir-800/60 px-[clamp(0.25rem,1.8vw,1rem)] py-[clamp(0.25rem,1.6vw,1rem)] text-[clamp(1.2rem,6.5vw,3.75rem)] font-bold tabular-nums text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              {String(val).padStart(2, "0")}
            </span>
            <span className="mt-2 text-[10px] uppercase tracking-[0.3em] text-ink-faint sm:text-sm">
              {label}
            </span>
          </div>
          {i < cells.length - 1 && (
            <span className="-mt-6 text-[clamp(0.8125rem,4vw,2.25rem)] text-signal-2/40" aria-hidden>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
