"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%*?";

/**
 * ClueReveal — a "decoding" headline. Each character scrambles through random
 * monospace glyphs before locking into place, left-to-right, like a cipher
 * resolving. Falls back to the plain text under reduced motion. The provided
 * text may include "\n" for explicit line breaks.
 */
export function ClueReveal({
  text,
  className = "",
  charDelay = 45,
  startDelay = 250,
}: {
  text: string;
  className?: string;
  charDelay?: number;
  startDelay?: number;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? text : "");
  const frame = useRef(0);

  useEffect(() => {
    if (reduce) {
      setDisplay(text);
      return;
    }
    const chars = text.split("");
    let settled = 0;
    let raf = 0;
    let last = 0;
    let started = 0;

    const tick = (t: number) => {
      if (!started) started = t;
      if (t - started < startDelay) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (t - last > 28) {
        last = t;
        frame.current++;
        // Advance the "settled" cursor at charDelay cadence.
        settled = Math.min(
          chars.length,
          Math.floor((t - started - startDelay) / charDelay)
        );
        const out = chars
          .map((c, i) => {
            if (c === "\n" || c === " ") return c;
            if (i < settled) return c;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("");
        setDisplay(out);
      }
      if (settled < chars.length) raf = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, reduce, charDelay, startDelay]);

  return (
    <h1 className={className}>
      {display.split("\n").map((line, i) => (
        <span key={i} className="block">
          {line || " "}
        </span>
      ))}
    </h1>
  );
}
