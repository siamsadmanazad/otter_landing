import { NextResponse } from "next/server";
import { FOUNDER_CAP } from "@/lib/founders";

/**
 * GET /api/founders/stats — joined count + cap.
 * STUB (L3): returns a realistic, slowly-growing number derived from time so the
 * live counter feels alive in dev. At L2 this proxies the growth `leaderboard`/
 * stats Edge Function (count of leads in the `founders-waitlist` campaign).
 */
export async function GET() {
  // Base 278 + a gentle drift (~1 every 7 min) so polling shows movement.
  const base = 278;
  const drift = Math.floor((Date.now() / 1000 / 420) % 140);
  const joined = Math.min(FOUNDER_CAP, base + drift);
  return NextResponse.json({ joined, total: FOUNDER_CAP });
}
