"use client";

import { motion } from "motion/react";

const TIERS = [
  { count: 1, reward: "Explorer Sticker Pack", icon: "✦" },
  { count: 3, reward: "Silver Explorer Badge", icon: "🥈" },
  { count: 5, reward: "Priority Founder Status", icon: "⚡" },
  { count: 10, reward: "Gold Founding Explorer Badge", icon: "🥇" },
];

/**
 * RewardTiers — the 1/3/5/10-invite unlock ladder. Tiers at or below the
 * current invite count read "unlocked" (gold + shimmer); the rest are locked.
 */
export function RewardTiers({ invites = 0 }: { invites?: number }) {
  return (
    <div className="mx-auto grid w-full max-w-md gap-3">
      {TIERS.map((t, i) => {
        const unlocked = invites >= t.count;
        return (
          <motion.div
            key={t.count}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`relative flex items-center gap-4 overflow-hidden rounded-2xl border px-5 py-4 backdrop-blur-[var(--fx-glass-sm)] ${
              unlocked
                ? "border-treasure/50 bg-treasure/10"
                : "border-white/10 bg-noir-800/40"
            }`}
          >
            <span className={`text-xl ${unlocked ? "" : "opacity-40 grayscale"}`}>
              {t.icon}
            </span>
            <div className="flex-1">
              <p className={`text-sm font-semibold ${unlocked ? "text-treasure" : "text-ink-soft"}`}>
                {t.reward}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                invite {t.count} friend{t.count === 1 ? "" : "s"}
              </p>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
              {unlocked ? "unlocked" : "🔒"}
            </span>
            {unlocked && (
              <motion.div
                aria-hidden
                className="absolute inset-0"
                initial={{ x: "-120%" }}
                animate={{ x: "120%" }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,179,71,0.18) 50%, transparent 60%)",
                }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
