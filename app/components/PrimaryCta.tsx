"use client";

import { useEffect, useState } from "react";
import { MagneticButton } from "./motion/MagneticButton";
import { isLaunched, DOWNLOAD_URL } from "@/lib/launch";

/**
 * PrimaryCta — the launch-aware primary call to action. Before launch it invites
 * (e.g. "Become a Founding Explorer" → /founders); on/after 08.05.2026 it flips
 * to "Download Now" → the app. Evaluated client-side so it switches on launch day
 * without a redeploy. Falls back to the pre-launch label during hydration.
 */
export function PrimaryCta({
  preLabel,
  preHref,
  postLabel = "Download Now",
}: {
  preLabel: string;
  preHref: string;
  postLabel?: string;
}) {
  const [launched, setLaunched] = useState(false);
  useEffect(() => setLaunched(isLaunched()), []);

  return launched ? (
    <MagneticButton href={DOWNLOAD_URL}>{postLabel}</MagneticButton>
  ) : (
    <MagneticButton href={preHref}>{preLabel}</MagneticButton>
  );
}
