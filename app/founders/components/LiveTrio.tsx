"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CountUp } from "../../components/motion/CountUp";
import { getFounderStats, FOUNDER_CAP, type FounderStats } from "@/lib/founders";

/**
 * LiveTrio — the urgency engine: animated joined-count, a springing RankMeter,
 * and "X spots remaining". Polls the stats proxy every 12s so it feels live
 * (becomes true realtime when the route proxies the Edge Function at L2).
 */
export function LiveTrio() {
  const reduce = useReducedMotion();
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

  const pct = Math.min(100, (stats.joined / stats.total) * 100);
  const remaining = Math.max(0, stats.total - stats.joined);

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/15 bg-noir-900/70 px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-white/5 backdrop-blur-xl [text-shadow:none]">
      <div className="flex items-end justify-between font-mono">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-ink-faint">
            explorers joined
          </p>
          <p className="mt-1 text-4xl font-bold text-ink sm:text-5xl">
            <CountUp value={stats.joined} />
            <span className="text-ink-faint"> / {stats.total.toLocaleString()}</span>
          </p>
        </div>
        <p className="text-right text-xs uppercase tracking-[0.2em] text-treasure">
          {remaining.toLocaleString()}
          <br />
          <span className="text-ink-faint">spots left</span>
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
