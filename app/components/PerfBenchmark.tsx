"use client";

import { useEffect } from "react";
import { benchmarkAndMaybeDowngrade } from "@/lib/perfTier";

/** Runs the real frame-timing sample once on mount. Renders nothing. */
export function PerfBenchmark() {
  useEffect(() => {
    benchmarkAndMaybeDowngrade();
  }, []);
  return null;
}
