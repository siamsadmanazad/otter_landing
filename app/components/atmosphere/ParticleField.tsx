"use client";

import { useEffect, useRef } from "react";

/**
 * ParticleField — ambient drifting dust/fireflies on a lightweight canvas with
 * DEPTH: each particle has a z-tier (0..1) that scales its size, brightness,
 * drift speed, and how far it shifts with the cursor + scroll (parallax).
 * Custom (not tsParticles) for mobile perf. Skipped under reduced motion.
 */
export function ParticleField({ count = 48 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const n = window.innerWidth < 640 ? Math.round(count * 0.55) : count;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    type P = {
      x: number;
      y: number;
      r: number;
      vy: number;
      a: number;
      tw: number;
      z: number; // depth 0 (far) .. 1 (near)
      warm: boolean;
    };
    let parts: P[] = [];

    // Parallax targets (eased toward).
    let mx = 0;
    let my = 0;
    let curMx = 0;
    let curMy = 0;
    let scrollY = window.scrollY;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const seed = () => {
      parts = Array.from({ length: n }, () => {
        const z = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: (0.4 + z * 1.8) * (0.8 + Math.random() * 0.5),
          vy: (0.03 + z * 0.22) * (0.6 + Math.random()),
          a: 0.12 + z * 0.5,
          tw: Math.random() * Math.PI * 2,
          z,
          warm: Math.random() < 0.18, // a few warm ember motes
        };
      });
    };

    resize();
    seed();

    let raf = 0;
    // Cap to ~30fps — ambient dust doesn't need the display's full refresh rate
    // (120Hz on ProMotion), which halves+ the per-second canvas redraw cost.
    const frameMs = 1000 / 30;
    let last = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < frameMs) return;
      last = t;

      // Ease parallax.
      curMx += (mx - curMx) * 0.06;
      curMy += (my - curMy) * 0.06;
      const sy = window.scrollY;

      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.vy;
        p.tw += 0.02;
        if (p.y < -6) {
          p.y = h + 6;
          p.x = Math.random() * w;
        }
        // Depth parallax: nearer particles shift more with cursor + scroll.
        const px = p.x + curMx * (8 + p.z * 34);
        const py =
          p.y + curMy * (5 + p.z * 22) - (sy - scrollY) * (p.z * 0.04);
        const alpha = p.a * (0.55 + 0.45 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.warm
          ? `rgba(255, 150, 90, ${alpha})`
          : `rgba(70, 240, 228, ${alpha})`;
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(draw);

    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onResize = () => {
      resize();
      seed();
      scrollY = window.scrollY;
    };
    // Stop drawing entirely while the tab is hidden — no point burning the GPU
    // on dust nobody can see; resume on return.
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = 0;
        raf = requestAnimationFrame(draw);
      }
    };
    if (!coarse) window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full"
    />
  );
}
