"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";

/**
 * ScrambleNumber — rolls a number to `value` like a slot machine (overshoots
 * through intermediate digits), used to make rank changes feel like a game.
 * Snaps under reduced motion.
 */
export function ScrambleNumber({
  value,
  className = "",
  pad = 0,
}: {
  value: number;
  className?: string;
  pad?: number;
}) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    if (reduce) {
      setN(value);
      from.current = value;
      return;
    }
    const controls = animate(from.current, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    from.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  return (
    <span className={`tabular-nums ${className}`}>
      {pad ? String(n).padStart(pad, "0") : n.toLocaleString()}
    </span>
  );
}
