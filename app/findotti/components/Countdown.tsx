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
    <div className="flex items-stretch gap-3 font-mono sm:gap-4">
      {cells.map(([label, val], i) => (
        <div key={label} className="flex items-center gap-3 sm:gap-4">
          <div className="flex flex-col items-center">
            <span className="min-w-[2ch] text-3xl font-bold tabular-nums text-ink sm:text-5xl">
              {String(val).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-ink-faint">
              {label}
            </span>
          </div>
          {i < cells.length - 1 && (
            <span className="text-2xl text-signal-2/50 sm:text-4xl" aria-hidden>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
