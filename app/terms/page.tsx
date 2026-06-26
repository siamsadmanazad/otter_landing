import type { Metadata } from "next";
import { LegalShell } from "../components/chrome/LegalShell";

export const metadata: Metadata = {
  title: "Terms · TripOtter",
  description: "Terms for the TripOtter pre-launch founders campaign.",
};

// NOTE: placeholder copy — have it reviewed before launch and adjust to your jurisdiction.
export default function TermsPage() {
  return (
    <LegalShell title="Campaign Terms" updated="June 2026">
      <p>
        These terms cover the TripOtter pre-launch &ldquo;Founding Explorers&rdquo; waitlist campaign.
        By joining, you agree to them.
      </p>

      <h2>The waitlist</h2>
      <ul>
        <li>Joining reserves a founder spot but does not guarantee any specific reward, rank, or pricing.</li>
        <li>One spot per person. Duplicate or fraudulent signups may be removed.</li>
        <li>Founder positions and the leaderboard reflect verified activity and may be recalculated to prevent abuse.</li>
      </ul>

      <h2>Referrals &amp; rewards</h2>
      <ul>
        <li>Referral points are awarded for genuine signups that verify their email. Self-referrals, fake accounts, or automated entries are not counted.</li>
        <li>Reward tiers shown are goals for the campaign and may change. We&rsquo;ll honour them in good faith for legitimate participants.</li>
        <li>We may disqualify entries that abuse the system, at our discretion.</li>
      </ul>

      <h2>Launch</h2>
      <p>
        The launch date (08.05.2026) and any features described are targets and may change. Joining the
        waitlist does not create an obligation to launch on a specific date.
      </p>

      <h2>Your data</h2>
      <p>
        Your information is handled per our{" "}
        <a href="/privacy">Privacy Policy</a>. You can unsubscribe or request deletion at any time.
      </p>

      <h2>Contact</h2>
      <p>
        <a href="mailto:hello@tripotter.net">hello@tripotter.net</a>.
      </p>
    </LegalShell>
  );
}
