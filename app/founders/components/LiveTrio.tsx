"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CountUp } from "../../components/motion/CountUp";
import { getFounderStats, FOUNDER_CAP, type FounderStats } from "@/lib/founders";

/**
 * useFounderStats — polls the stats proxy every 12s so the count feels live
 * (becomes true realtime when the route proxies the Edge Function at L2). Shared
 * by both the full LiveTrio panel and the compact hero HUD so there's one source.
 */
function useFounderStats(): { joined: number; total: number; pct: number; remaining: number } {
  const [stats, setStats] = useState<FounderStats>({ joined: 0, total: FOUNDER_CAP });

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const s = await getFounderStats();
        if (active) setStats(s);
      } catch {
        /* keep last value */
      }
    };
    load();
    const id = setInterval(load, 12_000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return {
    joined: stats.joined,
    total: stats.total,
    pct: Math.min(100, (stats.joined / stats.total) * 100),
    remaining: Math.max(0, stats.total - stats.joined),
  };
}

/**
 * FounderHud — the compact, always-visible urgency pill pinned in the hero. A
 * slim glass chip: live joined-count, a hairline fill meter, and spots left.
 */
export function FounderHud() {
  const reduce = useReducedMotion();
  const { joined, total, pct, remaining } = useFounderStats();

  return (
    <div className="pointer-events-auto w-[180px] rounded-2xl border border-white/15 bg-noir-900/70 px-4 py-3 shadow-[0_14px_44px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-white/5 backdrop-blur-xl [text-shadow:none] sm:w-[200px]">
      <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-ink-faint">
        explorers joined
      </p>
      <p className="mt-1 font-mono text-2xl font-bold leading-none text-ink">
        <CountUp value={joined} />
        <span className="text-sm text-ink-faint"> / {total.toLocaleString()}</span>
      </p>
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, var(--treasure), var(--ember))" }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: false }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 60, damping: 18, delay: 0.2 }}
        />
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-treasure">
        {remaining > 0 ? `${remaining.toLocaleString()} spots left` : "spots full · waitlist open"}
      </p>
    </div>
  );
}

/**
 * LiveTrio — the full urgency engine: animated joined-count, a springing
 * RankMeter, and "X spots remaining". Used at the decision point by the form.
 */
export function LiveTrio() {
  const reduce = useReducedMotion();
  const { joined, total, pct, remaining } = useFounderStats();
  const stats = { joined, total };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/15 bg-noir-900/70 px-6 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-white/5 backdrop-blur-xl [text-shadow:none] sm:px-7 sm:py-5">
      <div className="flex items-end justify-between font-mono">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-faint">
            explorers joined
          </p>
          <p className="mt-1 text-5xl font-bold text-ink sm:text-6xl">
            <CountUp value={stats.joined} />
            <span className="text-ink-faint"> / {stats.total.toLocaleString()}</span>
          </p>
        </div>
        <p className="text-right text-sm uppercase tracking-[0.2em] text-treasure">
          {remaining > 0 ? (
            <>
              {remaining.toLocaleString()}
              <br />
              <span className="text-ink-faint">spots left</span>
            </>
          ) : (
            <>
              waitlist
              <br />
              <span className="text-ink-faint">open</span>
            </>
          )}
        </p>
      </div>

      {/* RankMeter — springs to fill. */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, var(--treasure), var(--ember))",
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: false }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 60, damping: 18, delay: 0.2 }
          }
        />
      </div>
    </div>
  );
}
