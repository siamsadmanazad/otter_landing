"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { useMouseParallax } from "../../components/motion/useMouseParallax";
import { useScrollDrift } from "../../components/motion/useScrollDrift";
import { ASSETS } from "@/lib/assets";

/**
 * InviteOtti — Act 2's focal character: Otti at the camp, lantern raised and one
 * paw open in welcome. The Act-1 counterpart to OttiHero — same grounded staging
 * (big, feet on the painted stage, idle float, cursor parallax, contact shadow)
 * so the two acts read as one film. The lantern is the "signal" here: a warm glow
 * blooms and *breathes* from the lantern position (mirroring /findotti's sonar
 * rings), tying Otti's light to the campfire behind him — visually, an invitation
 * to the fire. Renders nothing until the invite pose exists (graceful slot).
 */
export function InviteOtti() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { x, y } = useMouseParallax();
  const tx = useTransform(x, (v) => v * 20);
  const tyMouse = useTransform(y, (v) => v * 13);
  // A small, opposite-direction scroll drift to CampHeadline's (text drifts up
  // to -90px; Otti drifts down a little instead) — keeps him grounded/close to
  // the rock while the text visibly separates from him as you scroll.
  const tyScroll = useScrollDrift(ref, [0, 22]);
  const ty = useTransform(() => tyMouse.get() + tyScroll.get());

  if (!ASSETS.ottiInvite) return null; // graceful: empty until the pose is generated

  return (
    <motion.div
      ref={ref}
      style={{ x: tx, y: ty }}
      className="relative flex h-[40vh] max-h-[460px] min-h-[220px] sm:min-h-[280px] items-end justify-center"
    >
      {/* Warm subject bloom behind Otti — soft; the camp already carries the light. */}
      <span
        aria-hidden
        className="absolute bottom-[14%] h-[56%] w-[50%] rounded-full opacity-55 blur-[var(--fx-blur-glow)]"
        style={{
          background:
            "radial-gradient(circle at 45% 55%, rgba(255,150,80,0.42), rgba(13,185,200,0.22) 52%, transparent 72%)",
        }}
      />

      {/* The lantern's living light — a breathing warm halo at the lantern (lower
          centre-left of the pose), the Act-2 echo of the Act-1 sonar ping. */}
      <motion.span
        aria-hidden
        className="absolute bottom-[34%] left-1/2 h-28 w-28 rounded-full"
        style={{
          translateX: "-128%",
          background:
            "radial-gradient(circle, rgba(255,196,110,0.55), rgba(255,150,70,0.30) 42%, transparent 70%)",
        }}
        animate={reduce ? {} : { opacity: [0.55, 0.9, 0.55], scale: [1, 1.12, 1] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Faint expanding lantern rings — the "come closer" pulse. */}
      {!reduce &&
        [0, 1].map((i) => (
          <motion.span
            key={i}
            className="absolute bottom-[34%] left-1/2 rounded-full border border-treasure/30"
            style={{ translateX: "-128%" }}
            initial={{ width: 56, height: 56, opacity: 0.5 }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 2, ease: "easeOut" }}
          />
        ))}

      {/* Otti, floating gently. */}
      <motion.div
        className="relative z-10"
        animate={reduce ? {} : { y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src={ASSETS.ottiInvite}
          alt="Otti the otter, lantern raised, inviting you to the camp"
          width={1060}
          height={1484}
          priority
          className="h-[40vh] max-h-[460px] min-h-[220px] sm:min-h-[280px] w-auto drop-shadow-[0_24px_42px_rgba(0,0,0,0.6)]"
        />
      </motion.div>

      {/* Soft ground shadow / contact glow under his feet. */}
      <span
        aria-hidden
        className="absolute bottom-[5%] h-6 w-[44%] rounded-[50%] bg-black/50 blur-xl"
      />
    </motion.div>
  );
}
