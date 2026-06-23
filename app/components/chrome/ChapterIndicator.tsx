"use client";

import { motion, useScroll, useTransform } from "motion/react";

/**
 * ChapterIndicator — a fixed, cinematic "CHAPTER 01 / 03" label with a thin
 * journey-progress tick, evoking a film/video chapter marker. Decorative; bound
 * to page scroll. Hidden on small screens to keep mobile uncluttered.
 */
export function ChapterIndicator({
  index = 1,
  total = 3,
  label = "the clue",
}: {
  index?: number;
  total?: number;
  label?: string;
}) {
  const { scrollYProgress } = useScroll();
  const h = useTransform(scrollYProgress, [0, 1], ["8%", "100%"]);

  return (
    <div
      aria-hidden
      className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-start gap-3 lg:flex"
    >
      <div className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.3em] text-ink-faint">
        <span className="text-signal-2">
          {String(index).padStart(2, "0")}
        </span>{" "}
        / {String(total).padStart(2, "0")}
      </div>
      <div className="relative h-24 w-[2px] overflow-hidden rounded-full bg-white/10">
        <motion.div className="bg-signal absolute inset-x-0 top-0" style={{ height: h }} />
      </div>
      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-faint [writing-mode:vertical-lr]">
        {label}
      </div>
    </div>
  );
}
