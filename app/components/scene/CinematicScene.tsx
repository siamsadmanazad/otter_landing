"use client";

import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * CinematicScene — a full-viewport chapter. When `pin` is set, it pins while the
 * content (`pinContent`) plays a scrubbed timeline: content fades + drifts up and
 * the scene crossfades out near the end — so the next scene emerges instead of
 * hard-cutting. Holds parallax <SceneLayer>s as the absolute backdrop. Pinning is
 * disabled on mobile + reduced motion (the section just scrolls normally).
 */
export function CinematicScene({
  children,
  pinContent,
  className = "",
  pin = false,
}: {
  children: ReactNode;
  pinContent?: ReactNode;
  className?: string;
  pin?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const inner = content.current;
    if (!el || !inner || !pin) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 640px)").matches;
    if (reduce || mobile) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=80%",
          scrub: true,
          pin: true,
          pinSpacing: true,
        },
      });
      // Hold, then drift the content up + fade as the scene hands off.
      tl.to(inner, { yPercent: -8, ease: "none" }, 0).to(
        inner,
        { opacity: 0, filter: "blur(6px)", ease: "power1.in" },
        0.6
      );
    }, root);
    return () => ctx.revert();
  }, [pin]);

  return (
    <section
      ref={root}
      className={`relative flex min-h-dvh flex-col items-center justify-center overflow-hidden ${className}`}
    >
      {children}
      <div ref={content} className="relative z-10 flex w-full flex-col items-center">
        {pinContent}
      </div>
    </section>
  );
}
