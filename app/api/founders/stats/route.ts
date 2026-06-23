import { NextResponse } from "next/server";
import { FOUNDER_CAP } from "@/lib/founders";
import { growthDb, growthConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /api/founders/stats — real joined count via the locked public.founders_count
 * wrapper. Falls back to a time-drift stub without DB env.
 */
export async function GET() {
  if (!growthConfigured()) {
    const joined = Math.min(FOUNDER_CAP, 278 + Math.floor((Date.now() / 1000 / 420) % 140));
    return NextResponse.json({ joined, total: FOUNDER_CAP });
  }
  try {
    const db = growthDb();
    const { data, error } = await db.rpc("founders_count");
    if (error) {
      console.error("founders_count error:", error.message);
      return NextResponse.json({ joined: 0, total: FOUNDER_CAP });
    }
    return NextResponse.json({ joined: Number(data) || 0, total: FOUNDER_CAP });
  } catch (e) {
    console.error("GET /api/founders/stats error:", e);
    return NextResponse.json({ joined: 0, total: FOUNDER_CAP });
  }
}
