import { NextRequest, NextResponse } from "next/server";
import { growthDb, growthConfigured } from "@/lib/supabase";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendWelcomeEmail } from "@/lib/email";

/**
 * POST /api/founders/join — create a founder lead in the growth schema.
 * Defends (honeypot, Turnstile, per-IP rate-limit in the RPC), then calls the atomic
 * `growth.signup_lead` RPC (position, referral link, dedupe, verify token, consent + UTM).
 * Returns the safe payload. Falls back to a local stub only when Supabase env is absent.
 */
function stubCode(name: string) {
  const clean = (name || "OTTI").replace(/[^a-zA-Z]/g, "").slice(0, 5).toUpperCase() || "OTTI";
  return `TO-${clean}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function joinedPayload(code: string, position: number, duplicate = false) {
  return {
    leadId: crypto.randomUUID(),
    referralCode: code,
    referralUrl: `https://tripotter.com/r/${code}`,
    position,
    message: duplicate
      ? "Welcome back, explorer — you're already on the list."
      : "You are on the founding expedition.",
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.fullName?.trim() || !body?.email?.trim() || !body?.university?.trim()) {
    return NextResponse.json({ message: "Name, email and university are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ message: "Enter a valid email." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const ua = request.headers.get("user-agent") ?? null;

  // Honeypot: a bot filled the hidden field. Return a plausible success without persisting.
  if (typeof body.hp === "string" && body.hp.trim().length > 0) {
    return NextResponse.json(joinedPayload(stubCode(body.fullName), 287));
  }

  // Human check (no-op when Turnstile isn't configured).
  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return NextResponse.json({ message: "Please complete the human check." }, { status: 400 });
  }

  // Dev fallback (no keys) — keep the UI working without a DB.
  if (!growthConfigured()) {
    return NextResponse.json(joinedPayload(stubCode(body.fullName), 278 + Math.floor(Math.random() * 40) + 1));
  }

  const utm = body.utm ?? {};
  try {
    const db = growthDb();
    const { data, error } = await db.rpc("founders_signup", {
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
      p_consent: Boolean(body.consent),
      p_utm_source: utm.source ?? "",
      p_utm_medium: utm.medium ?? "",
      p_utm_campaign: utm.campaign ?? "",
      p_utm_term: utm.term ?? "",
      p_utm_content: utm.content ?? "",
    });
    if (error) {
      if (error.message?.includes("RATE_LIMITED")) {
        return NextResponse.json({ message: "Slow down a moment, then try again." }, { status: 429 });
      }
      console.error("signup_lead error:", error.message);
      return NextResponse.json({ message: "Could not join. Please try again." }, { status: 500 });
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.referral_code) {
      return NextResponse.json({ message: "Could not join." }, { status: 500 });
    }
    // Send the welcome + verify email to new (and unverified returning) leads. Never throws.
    if (row.verify_token && !row.verified) {
      await sendWelcomeEmail({
        leadId: row.lead_id,
        email: body.email.trim(),
        fullName: body.fullName.trim(),
        referralCode: row.referral_code,
        verifyToken: row.verify_token,
      });
    }
    return NextResponse.json({
      leadId: row.lead_id,
      referralCode: row.referral_code,
      referralUrl: `https://tripotter.com/r/${row.referral_code}`,
      position: row.lead_position,
      message: row.duplicate
        ? "Welcome back, explorer — you're already on the list."
        : "You are on the founding expedition.",
    });
  } catch (e) {
    console.error("POST /api/founders/join error:", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
