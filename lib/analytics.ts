/**
 * Lightweight analytics/conversion tracking for the ad campaign. Both providers are
 * optional — everything no-ops unless the matching NEXT_PUBLIC_* id is set, so paid
 * traffic can be measured (cost-per-signup, which creative converts) without coupling.
 */
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
export const analyticsEnabled = Boolean(FB_PIXEL_ID || GA_ID);

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fired on a successful waitlist signup (the primary conversion). */
export function trackLead() {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "Lead");
  window.gtag?.("event", "sign_up", { method: "founders_waitlist" });
}

/** Fired when a lead confirms their email (double opt-in completed). */
export function trackVerified() {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "CompleteRegistration");
  window.gtag?.("event", "email_verified");
}
