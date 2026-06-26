import { NextRequest, NextResponse } from "next/server";
import { growthDb, growthConfigured } from "@/lib/supabase";

/**
 * GET /api/founders/verify?token=<uuid> — the email-verify link target (double opt-in).
 * Calls founders_verify (flips status → email_verified, awards lead +10 / referrer +40,
 * idempotent), then redirects into /welcome. Invalid/expired tokens land on a soft error.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim();
  const welcome = (params: Record<string, string>) =>
    NextResponse.redirect(new URL(`/welcome?${new URLSearchParams(params)}`, request.url));

  if (!token) {
    return welcome({ verified: "0" });
  }

  // Dev fallback (no keys): treat as verified so the flow stays demoable.
  if (!growthConfigured()) {
    return welcome({ verified: "1" });
  }

  try {
    const db = growthDb();
    const { data, error } = await db.rpc("founders_verify", { p_token: token });
    if (error) {
      // TOKEN_INVALID (or any failure) → soft error on /welcome.
      return welcome({ verified: "0" });
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.referral_code) {
      return welcome({ verified: "0" });
    }
    return welcome({
      code: row.referral_code,
      pos: String(row.lead_position),
      verified: "1",
    });
  } catch (e) {
    console.error("GET /api/founders/verify error:", e);
    return welcome({ verified: "0" });
  }
}
