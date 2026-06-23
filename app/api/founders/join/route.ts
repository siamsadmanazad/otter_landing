import { NextRequest, NextResponse } from "next/server";
import { growthDb, growthConfigured, CAMPAIGN_SLUG } from "@/lib/supabase";

/**
 * POST /api/founders/join — create a founder lead in the growth schema.
 * Validates, then calls the atomic `growth.signup_lead` RPC (position, referral
 * credit, scoring, dedupe). Returns the planned safe payload. Falls back to a
 * local stub only when Supabase env is absent (dev without keys).
 */
function stubCode(name: string) {
  const clean = (name || "OTTI").replace(/[^a-zA-Z]/g, "").slice(0, 5).toUpperCase() || "OTTI";
  return `TO-${clean}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.fullName?.trim() || !body?.email?.trim() || !body?.university?.trim()) {
    return NextResponse.json({ message: "Name, email and university are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ message: "Enter a valid email." }, { status: 400 });
  }

  // Dev fallback (no keys) — keep the UI working without a DB.
  if (!growthConfigured()) {
    const code = stubCode(body.fullName);
    const position = 278 + Math.floor(Math.random() * 40) + 1;
    return NextResponse.json({
      leadId: crypto.randomUUID(),
      referralCode: code,
      referralUrl: `https://tripotter.com/r/${code}`,
      position,
      message: "You are on the founding expedition.",
    });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const ua = request.headers.get("user-agent") ?? null;

  try {
    const db = growthDb();
    const { data, error } = await db.rpc("signup_lead", {
      p_campaign_slug: CAMPAIGN_SLUG,
      p_full_name: body.fullName.trim(),
      p_email: body.email.trim(),
      p_university: body.university?.trim() ?? "",
      p_facebook: body.facebook?.trim() ?? "",
      p_instagram: body.instagram?.trim() ?? "",
      p_favorite: body.favoriteDestination?.trim() ?? "",
      p_why: body.whyExplore?.trim() ?? "",
      p_ref_code: body.ref?.trim() ?? "",
      p_ip: ip,
      p_user_agent: ua,
    });
    if (error) {
      console.error("signup_lead error:", error.message);
      return NextResponse.json({ message: "Could not join. Please try again." }, { status: 500 });
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.referral_code) {
      return NextResponse.json({ message: "Could not join." }, { status: 500 });
    }
    return NextResponse.json({
      leadId: row.lead_id,
      referralCode: row.referral_code,
      referralUrl: `https://tripotter.com/r/${row.referral_code}`,
      position: row.position,
      message: row.duplicate
        ? "Welcome back, explorer — you're already on the list."
        : "You are on the founding expedition.",
    });
  } catch (e) {
    console.error("POST /api/founders/join error:", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
