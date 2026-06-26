"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getLeaderboard, type University } from "@/lib/founders";

const MEDALS = ["🥇", "🥈", "🥉"];

/**
 * UniversityRace — the tribal-competition engine: universities by explorer count
 * as animated bars that grow on view (BRAC vs NSU…). The single most viral hook
 * in BD — students compete to push their campus up.
 */
export function UniversityRace() {
  const [unis, setUnis] = useState<University[]>([]);

  useEffect(() => {
    getLeaderboard()
      .then((d) => setUnis(d.universities))
      .catch(() => setUnis([]));
  }, []);

  const max = unis.reduce((m, u) => Math.max(m, u.explorers), 1);

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
        // university race
      </p>
      {unis.length === 0 && (
        <p className="rounded-xl border border-white/8 bg-noir-800/40 px-4 py-6 text-center text-sm text-ink-soft">
          No campuses on the board yet —{" "}
          <span className="text-treasure">rally yours to the top.</span>
        </p>
      )}
      <div className="space-y-4">
        {unis.map((u, i) => (
          <div key={u.name}>
            <div className="mb-1 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span>{MEDALS[i] ?? "•"}</span>
                {u.name}
              </span>
              <span className="font-mono text-xs text-ink-soft">
                {u.explorers} explorers
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    i === 0
                      ? "linear-gradient(90deg, var(--treasure), var(--ember))"
                      : "linear-gradient(90deg, var(--signal-1), var(--signal-2))",
                }}
                initial={{ width: 0 }}
                whileInView={{ width: `${(u.explorers / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 50, damping: 16, delay: i * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
