"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";

/**
 * CountUp — animates a number from its previous value to `value` (eased), so the
 * live joined-counter visibly *ticks up*. Honors reduced motion (snaps). Used by
 * the founders urgency engine; re-animates whenever `value` changes (e.g. polled).
 */
export function CountUp({
  value,
  duration = 1.2,
  className = "",
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      from.current = value;
      return;
    }
    const controls = animate(from.current, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    from.current = value;
    return () => controls.stop();
  }, [value, duration, reduce]);

  return <span className={`tabular-nums ${className}`}>{display.toLocaleString()}</span>;
}
