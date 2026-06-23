/**
 * Launch mode — on launch day the campaign flips from "join the waitlist" to
 * "download the app". Date-driven so it switches automatically on 08.05.2026,
 * with an env override for testing/staging:
 *   NEXT_PUBLIC_LAUNCH_MODE = "true" | "false"  (overrides the date)
 */
export const LAUNCH_TS = new Date("2026-08-05T00:00:00").getTime();

/** App store / download destination (placeholder until the app ships). */
export const DOWNLOAD_URL = "https://tripotter.app/download";

export function isLaunched(now: number = Date.now()): boolean {
  const flag = process.env.NEXT_PUBLIC_LAUNCH_MODE;
  if (flag === "true") return true;
  if (flag === "false") return false;
  return now >= LAUNCH_TS;
}
