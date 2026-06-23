"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getLeaderboard, type Explorer } from "@/lib/founders";

const MEDALS = ["🥇", "🥈", "🥉"];

/**
 * Leaderboard — top explorers (medals for the podium), optionally highlighting
 * the current user's row. Shared by /welcome and the public /leaderboard.
 */
export function Leaderboard({ highlightName }: { highlightName?: string }) {
  const [rows, setRows] = useState<Explorer[]>([]);

  useEffect(() => {
    getLeaderboard()
      .then((d) => setRows(d.explorers))
      .catch(() => setRows([]));
  }, []);

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
        // top explorers
      </p>
      <ul className="space-y-2">
        {rows.map((e, i) => {
          const me = highlightName && e.name.toLowerCase() === highlightName.toLowerCase();
          return (
            <motion.li
              key={e.rank}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${
                me
                  ? "border-treasure/50 bg-treasure/10"
                  : "border-white/8 bg-noir-800/40"
              }`}
            >
              <span className="w-6 text-center text-sm">
                {MEDALS[i] ?? <span className="text-ink-faint">{e.rank}</span>}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{e.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                  {e.university}
                </p>
              </div>
              <span className="font-mono text-sm text-signal-2">{e.invites}</span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
