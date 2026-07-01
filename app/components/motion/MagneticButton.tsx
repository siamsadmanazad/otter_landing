"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * MagneticButton — a premium CTA that leans toward the cursor (magnetic pull)
 * and scales on press, wrapped in a signal-gradient glow. The single warm,
 * interactive object on the cold mystery page. Pointer-follow is disabled on
 * touch / reduced-motion. Renders as a Next <Link> when `href` is given.
 */
export function MagneticButton({
  href,
  children,
  className = "",
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    setPos({ x: x * 0.25, y: y * 0.35 });
  }
  function reset() {
    setPos({ x: 0, y: 0 });
  }

  const inner = (
    <motion.span
      className="relative inline-flex items-center justify-center gap-3 rounded-full bg-signal px-10 py-5 text-base font-bold uppercase tracking-[0.18em] text-noir-950 glow-signal sm:px-12 sm:py-5"
      animate={{ x: pos.x, y: pos.y }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.4 }}
    >
      {children}
      <span aria-hidden className="text-lg">
        →
      </span>
    </motion.span>
  );

  const shared = {
    ref: ref as never,
    onMouseMove: onMove,
    onMouseLeave: reset,
    className: `group inline-block ${className}`,
  };

  if (href) {
    return (
      <Link href={href} {...shared}>
        {inner}
      </Link>
    );
  }
  return <button {...shared}>{inner}</button>;
}
