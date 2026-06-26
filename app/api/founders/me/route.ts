import { NextRequest, NextResponse } from "next/server";
import { growthDb, growthConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /api/founders/me?code=<referralCode> — live, safe per-lead stats for the
 * founder dashboard (real rank, invites, score). Looked up by the shareable code
 * via the locked public.founders_me wrapper; never exposes email/socials.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim();
  if (!code) {
    return NextResponse.json({ message: "code required" }, { status: 400 });
  }
  if (!growthConfigured()) {
    return NextResponse.json({
      referralCode: code, position: 287, score: 0, rank: 287, invites: 0, verifiedInvites: 0, verified: false,
    });
  }
  try {
    const db = growthDb();
    const { data, error } = await db.rpc("founders_me", { p_code: code });
    if (error) {
      console.error("founders_me error:", error.message);
      return NextResponse.json({ message: "lookup failed" }, { status: 500 });
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.referral_code) {
      return NextResponse.json({ message: "not found" }, { status: 404 });
    }
    return NextResponse.json({
      referralCode: row.referral_code,
      position: row.lead_position,
      score: row.score,
      rank: row.rank,
      invites: row.invites,
      verifiedInvites: row.verified_invites,
      verified: row.verified,
    });
  } catch (e) {
    console.error("GET /api/founders/me error:", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
