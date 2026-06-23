import { Suspense } from "react";
import type { Metadata } from "next";
import { WelcomeDashboard } from "./WelcomeDashboard";

/**
 * Per-founder share card: when a founder shares their /welcome link, the preview
 * shows "I'm Founder #NNNN" (dynamic OG via /api/og).
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ pos?: string }>;
}): Promise<Metadata> {
  const { pos } = await searchParams;
  const og = `/api/og?type=founder&pos=${encodeURIComponent(pos ?? "279")}`;
  const title = `I'm Founder #${(pos ?? "279").padStart(4, "0")} — find Otti`;
  return {
    title,
    openGraph: { title, images: [{ url: og, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, images: [og] },
  };
}

/**
 * /welcome — Act 3: the reveal. The gamified founder dashboard — founder stamp +
 * confetti, rank, referral + share, reward tiers, and leaderboards. Post-signup
 * destination (reads ?code & ?pos from the join redirect).
 */
export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <WelcomeDashboard />
    </Suspense>
  );
}
