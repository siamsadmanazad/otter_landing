import type { Metadata } from "next";
import { LegalShell } from "../components/chrome/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy · TripOtter",
  description: "How TripOtter collects and uses information for its pre-launch founders campaign.",
};

// NOTE: placeholder copy — have it reviewed before launch and adjust to your jurisdiction.
export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="June 2026">
      <p>
        This policy covers the TripOtter pre-launch &ldquo;Founding Explorers&rdquo; campaign at this
        site. It explains what we collect when you join the waitlist and how we use it. It is separate
        from the main TripOtter app&rsquo;s data.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Details you submit: name, email, university, and any optional fields (social handles, favourite destination).</li>
        <li>Referral data: the code you arrived with and the code you share.</li>
        <li>Basic technical data: IP address and browser user-agent, used only for spam/abuse prevention.</li>
        <li>Campaign attribution (UTM tags) so we know which channel referred you.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To place you on the founders waitlist and show your referral progress.</li>
        <li>To email you about your spot, email verification, and the launch — only with your consent.</li>
        <li>To rank the leaderboard and campus race (we never publish your email or socials).</li>
        <li>To prevent fraudulent or automated signups.</li>
      </ul>

      <h2>Email &amp; consent</h2>
      <p>
        We email you only if you opt in at signup. Every email has an unsubscribe link, and you can opt
        out at any time — it takes effect immediately. We use a third-party email provider solely to
        deliver these messages.
      </p>

      <h2>Storage &amp; sharing</h2>
      <p>
        Your data is stored securely in our database and is never sold. We do not share it with third
        parties except the email-delivery provider needed to contact you.
      </p>

      <h2>Your choices</h2>
      <p>
        You can request access to, correction of, or deletion of your data, or unsubscribe entirely, by
        emailing <a href="mailto:hello@tripotter.net">hello@tripotter.net</a>.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? <a href="mailto:hello@tripotter.net">hello@tripotter.net</a>.
      </p>
    </LegalShell>
  );
}
