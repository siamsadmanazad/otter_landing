import { Suspense } from "react";
import { WelcomeDashboard } from "./WelcomeDashboard";

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
