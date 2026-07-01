"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { useScrollDrift } from "../../components/motion/useScrollDrift";
import { InviteOtti } from "./InviteOtti";

/**
 * CampFlankRow — Otti stands fully visible and undimmed; "Founding" and
 * "Explorers" sandwich him, reading as "Founding [Otti] Explorers". Each word
 * gets its own independent up/down scroll-drift, so the arrangement feels
 * layered and alive rather than static.
 *
 * One container, one Otti instance — no duplicated DOM/animations. Below
 * `md:` it's a flex column (Founding above, Otti, Explorers below — the
 * side-by-side flanking needs more width than a phone has, and a whole word
 * can't wrap mid-word, so it would overflow off both edges there). From
 * `md:` up it becomes a grid row (Founding | Otti | Explorers), with the
 * middle column's width protected so the flanking words can't squeeze Otti's
 * column down and distort him.
 */
export function CampFlankRow() {
  const leftRef = useRef<HTMLParagraphElement>(null);
  const rightRef = useRef<HTMLParagraphElement>(null);
  const leftY = useScrollDrift(leftRef, [0, 40]);
  const rightY = useScrollDrift(rightRef, [0, -40]);

  return (
    <div
      className="flex w-full flex-col items-center gap-1 md:grid md:items-center md:gap-6"
      style={{ gridTemplateColumns: "1fr minmax(180px,360px) 1fr" }}
    >
      <motion.p
        ref={leftRef}
        style={{ y: leftY }}
        className="text-center text-3xl font-extrabold leading-[1.05] tracking-tight md:justify-self-end md:text-right md:text-4xl lg:text-6xl"
      >
        Founding
      </motion.p>

      <div className="pointer-events-none flex justify-center">
        <InviteOtti />
      </div>

      <motion.p
        ref={rightRef}
        style={{ y: rightY }}
        className="text-center text-3xl font-extrabold leading-[1.05] tracking-tight md:justify-self-start md:text-left md:text-4xl lg:text-6xl"
      >
        Explorers
      </motion.p>
    </div>
  );
}
