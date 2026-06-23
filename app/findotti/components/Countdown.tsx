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
    <div className="flex items-stretch gap-2.5 font-mono sm:gap-3">
      {cells.map(([label, val], i) => (
        <div key={label} className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex flex-col items-center">
            <span className="grid min-w-[2.6ch] place-items-center rounded-xl border border-white/[0.08] bg-noir-800/60 px-2 py-2.5 text-3xl font-bold tabular-nums text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:min-w-[2.4ch] sm:px-3 sm:py-3 sm:text-5xl">
              {String(val).padStart(2, "0")}
            </span>
            <span className="mt-2 text-[10px] uppercase tracking-[0.3em] text-ink-faint">
              {label}
            </span>
          </div>
          {i < cells.length - 1 && (
            <span className="-mt-6 text-2xl text-signal-2/40 sm:text-3xl" aria-hidden>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
