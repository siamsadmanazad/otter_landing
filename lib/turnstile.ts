/**
 * Server-side Cloudflare Turnstile verification. No-op pass when TURNSTILE_SECRET_KEY
 * is unset (dev / before keys exist), so the form keeps working. Never exposes the secret.
 */
const SECRET = process.env.TURNSTILE_SECRET_KEY;
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const turnstileConfigured = Boolean(SECRET);

export async function verifyTurnstile(token: string | undefined, ip: string | null): Promise<boolean> {
  if (!SECRET) return true; // not configured → don't block
  if (!token) return false;
  try {
    const form = new URLSearchParams({ secret: SECRET, response: token });
    if (ip) form.set("remoteip", ip);
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data?.success);
  } catch {
    return false; // fail closed when configured
  }
}
