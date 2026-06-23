import { NextResponse } from "next/server";
import { FOUNDER_CAP } from "@/lib/founders";
import { growthDb, growthConfigured, CAMPAIGN_SLUG } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /api/founders/stats — real joined count for the live counter. Counts leads
 * in the active campaign. Falls back to a time-drift stub without DB env.
 */
export async function GET() {
  if (!growthConfigured()) {
    const joined = Math.min(FOUNDER_CAP, 278 + Math.floor((Date.now() / 1000 / 420) % 140));
    return NextResponse.json({ joined, total: FOUNDER_CAP });
  }
  try {
    const db = growthDb();
    const { data: campaign } = await db
      .from("campaigns")
      .select("id")
      .eq("slug", CAMPAIGN_SLUG)
      .single();
    let joined = 0;
    if (campaign) {
      const { count } = await db
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", campaign.id);
      joined = count ?? 0;
    }
    return NextResponse.json({ joined, total: FOUNDER_CAP });
  } catch (e) {
    console.error("GET /api/founders/stats error:", e);
    return NextResponse.json({ joined: 0, total: FOUNDER_CAP });
  }
}
