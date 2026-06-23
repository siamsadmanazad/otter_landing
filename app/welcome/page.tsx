import { Suspense } from "react";
import { WelcomeStub } from "./WelcomeStub";

/**
 * /welcome — Act 3: the reveal. (L3 stub — the full founder dashboard, referral
 * share, reward tiers and leaderboards land in L4.) Confirms the redirect lands
 * and shows the returned founder number + code.
 */
export default function WelcomePage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Suspense fallback={null}>
        <WelcomeStub />
      </Suspense>
    </main>
  );
}
