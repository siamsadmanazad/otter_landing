"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * FounderStamp — the climactic reveal of "FOUNDER #NNNN": the number stamps in
 * (scale-down settle + gold glow) and fires a celebratory confetti burst on
 * mount. Confetti + motion skipped under reduced motion.
 */
export function FounderStamp({ position }: { position: number }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    (async () => {
      const confetti = (await import("canvas-confetti")).default;
      if (cancelled) return;
      const fire = (ratio: number, opts: Record<string, unknown>) =>
        confetti({
          origin: { y: 0.35 },
          colors: ["#ffb347", "#ff7a45", "#34f5e4", "#0099db", "#ffb59e"],
          disableForReducedMotion: true,
          particleCount: Math.floor(160 * ratio),
          ...opts,
        });
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.35, { spread: 60 });
      fire(0.25, { spread: 100, decay: 0.91, scalar: 0.9 });
      fire(0.15, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    })();
    return () => {
      cancelled = true;
    };
  }, [reduce]);

  return (
    <div className="flex flex-col items-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-mono text-xs uppercase tracking-[0.5em] text-treasure/80"
      >
        welcome, explorer
      </motion.p>

      <motion.h1
        initial={reduce ? false : { scale: 1.6, opacity: 0, filter: "blur(12px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="mt-6 text-center text-4xl font-extrabold leading-none tracking-tight sm:text-7xl"
      >
        FOUNDER
        <br />
        <span className="text-treasure drop-shadow-[0_0_30px_rgba(255,179,71,0.5)]">
          #{String(position).padStart(4, "0")}
        </span>
      </motion.h1>
    </div>
  );
}
