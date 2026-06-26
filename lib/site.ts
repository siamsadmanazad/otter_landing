/**
 * Canonical public origin for the landing site. Reads NEXT_PUBLIC_SITE_URL (set in
 * Vercel / .env) and falls back to the production domain. Used everywhere a referral
 * or share link is built, so every link follows the real domain — never hardcoded.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tripotter.net").replace(/\/$/, "");

/** The shareable referral entry link for a code. */
export const referralUrl = (code: string) => `${SITE_URL}/r/${code}`;

/** Public contact address shown in the footer / legal pages. */
export const CONTACT_EMAIL = "hello@tripotter.net";
