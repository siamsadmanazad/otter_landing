import { growthDb, growthConfigured } from "@/lib/supabase";

/**
 * Outbound email via Brevo (300/day free; HTTP API). The DB is the source of truth
 * (growth.leads); the provider is just the postman. No-ops cleanly when BREVO_API_KEY
 * is unset (dev / before keys). Every attempt is appended to growth.email_logs.
 *
 * Provider-isolated: to swap providers later, only `sendTransactional` below changes.
 */
const BREVO_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = process.env.MAIL_FROM ?? "otti@tripotter.net";
const FROM_NAME = process.env.MAIL_FROM_NAME ?? "TripOtter";
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tripotter.net").replace(/\/$/, "");
const PROVIDER = "brevo";

export const emailConfigured = Boolean(BREVO_KEY);

async function logEmail(args: {
  leadId: string | null;
  type: string;
  recipient: string;
  messageId: string | null;
  status: string;
  error: string | null;
}) {
  if (!growthConfigured()) return;
  try {
    await growthDb().rpc("founders_log_email", {
      p_lead_id: args.leadId,
      p_email_type: args.type,
      p_recipient: args.recipient,
      p_provider: PROVIDER,
      p_message_id: args.messageId ?? "",
      p_status: args.status,
      p_error: args.error ?? "",
    });
  } catch (e) {
    console.error("founders_log_email failed:", e);
  }
}

/** The only provider-specific code. Returns the provider message id, or throws. */
async function sendTransactional(args: { to: string; subject: string; html: string }): Promise<string> {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_KEY as string, "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: args.to }],
      subject: args.subject,
      htmlContent: args.html,
    }),
  });
  const data = (await res.json().catch(() => ({}))) as { messageId?: string; message?: string };
  if (!res.ok) throw new Error(data?.message ?? `HTTP ${res.status}`);
  return data?.messageId ?? "";
}

function welcomeHtml(fullName: string, verifyUrl: string, referralUrl: string, unsubscribeUrl: string) {
  const name = fullName.split(" ")[0] || "explorer";
  return `<!doctype html><html><body style="margin:0;background:#0d0f14;color:#eee;font-family:ui-sans-serif,system-ui,sans-serif">
  <div style="max-width:520px;margin:0 auto;padding:40px 28px">
    <h1 style="font-size:24px;letter-spacing:-0.02em;margin:0 0 8px">You found Otti. 🦦</h1>
    <p style="color:#aaa;line-height:1.6">Hey ${name} — your founding-explorer spot is reserved. One tap to lock it in:</p>
    <p style="margin:28px 0"><a href="${verifyUrl}" style="background:#ffb347;color:#0d0f14;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:999px;display:inline-block">Confirm my spot →</a></p>
    <p style="color:#aaa;line-height:1.6">Then climb the ranks — every friend who joins with your link moves you up:</p>
    <p style="font-family:ui-monospace,monospace;color:#ffb347;word-break:break-all">${referralUrl}</p>
    <p style="color:#666;font-size:12px;margin-top:32px">Launching 08.05.2026. If you didn't sign up, ignore this email.</p>
    <p style="color:#555;font-size:11px;margin-top:8px">Don't want these? <a href="${unsubscribeUrl}" style="color:#888">Unsubscribe</a>.</p>
  </div></body></html>`;
}

/** Send the "You Found Otti" welcome + email-verify message. Safe to await; never throws. */
export async function sendWelcomeEmail(args: {
  leadId: string | null;
  email: string;
  fullName: string;
  referralCode: string;
  verifyToken: string;
  unsubscribeToken: string;
}): Promise<void> {
  const verifyUrl = `${SITE_URL}/api/founders/verify?token=${encodeURIComponent(args.verifyToken)}`;
  const referralUrl = `${SITE_URL}/r/${args.referralCode}`;
  const unsubscribeUrl = `${SITE_URL}/api/founders/unsubscribe?token=${encodeURIComponent(args.unsubscribeToken)}`;

  if (!BREVO_KEY) {
    await logEmail({ leadId: args.leadId, type: "welcome_verify", recipient: args.email, messageId: null, status: "skipped", error: "no BREVO_API_KEY" });
    return;
  }

  try {
    const messageId = await sendTransactional({
      to: args.email,
      subject: "You Found Otti.",
      html: welcomeHtml(args.fullName, verifyUrl, referralUrl, unsubscribeUrl),
    });
    await logEmail({ leadId: args.leadId, type: "welcome_verify", recipient: args.email, messageId, status: "sent", error: null });
  } catch (e) {
    await logEmail({ leadId: args.leadId, type: "welcome_verify", recipient: args.email, messageId: null, status: "failed", error: String(e) });
  }
}
