"use client";

import { motion, useTransform } from "motion/react";
import { useMouseParallax } from "../motion/useMouseParallax";

/**
 * CloudLayer — soft volumetric fog/cloud blobs drifting horizontally at
 * different speeds (depth via parallax) and nudged by the cursor. Adds the
 * cinematic atmospheric haze between the aurora and the content. Fixed, behind
 * everything. Pure CSS animation + a light cursor parallax; reduced-motion safe.
 */
type Cloud = {
  top: string;
  size: number; // vmax
  hue: string;
  opacity: number;
  duration: number; // s
  depth: number; // cursor parallax factor (px)
  from: string;
  to: string;
  delay: number;
};

const CLOUDS: Cloud[] = [
  { top: "8%", size: 70, hue: "13,185,200", opacity: 0.1, duration: 70, depth: 26, from: "-12%", to: "12%", delay: 0 },
  { top: "34%", size: 90, hue: "109,92,246", opacity: 0.08, duration: 95, depth: 16, from: "10%", to: "-10%", delay: -20 },
  { top: "58%", size: 80, hue: "18,58,107", opacity: 0.14, duration: 80, depth: 36, from: "-8%", to: "14%", delay: -45 },
  { top: "76%", size: 65, hue: "0,153,219", opacity: 0.09, duration: 110, depth: 10, from: "6%", to: "-12%", delay: -10 },
];

export function CloudLayer() {
  const { x, y } = useMouseParallax();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {CLOUDS.map((c, i) => (
        <CloudBlob key={i} cloud={c} px={x} py={y} />
      ))}
    </div>
  );
}

function CloudBlob({
  cloud,
  px,
  py,
}: {
  cloud: Cloud;
  px: ReturnType<typeof useMouseParallax>["x"];
  py: ReturnType<typeof useMouseParallax>["y"];
}) {
  // Cursor parallax — foreground (higher depth) clouds shift more.
  const tx = useTransform(px, (v) => v * cloud.depth);
  const ty = useTransform(py, (v) => v * cloud.depth * 0.5);

  return (
    <motion.div className="absolute left-1/2 -translate-x-1/2" style={{ top: cloud.top, x: tx, y: ty }}>
      {/* Inner element carries the continuous horizontal drift animation. */}
      <div
        style={
          {
            width: `${cloud.size}vmax`,
            height: `${cloud.size * 0.55}vmax`,
            opacity: cloud.opacity,
            background: `radial-gradient(50% 50% at 50% 50%, rgba(${cloud.hue},1), transparent 70%)`,
            filter: "blur(60px)",
            animation: `cloud-drift ${cloud.duration}s ease-in-out ${cloud.delay}s infinite alternate`,
            "--cloud-from": cloud.from,
            "--cloud-to": cloud.to,
          } as React.CSSProperties
        }
      />
    </motion.div>
  );
}
