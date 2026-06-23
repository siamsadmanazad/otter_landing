import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/founders/join — create a founder lead.
 * STUB (L3): validates server-side and returns a realistic founder result.
 * At L2 this proxies the growth `signup` Edge Function (the function owns the
 * real insert, dedupe, referral credit, scoring, and email). The response shape
 * is the planned safe payload, so the UI is already final.
 */
function code(name: string) {
  const clean = (name || "OTTI").replace(/[^a-zA-Z]/g, "").slice(0, 5).toUpperCase() || "OTTI";
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TO-${clean}-${rand}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.fullName?.trim() || !body?.email?.trim() || !body?.university?.trim()) {
    return NextResponse.json(
      { message: "Name, email and university are required." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ message: "Enter a valid email." }, { status: 400 });
  }

  const referralCode = code(body.fullName);
  // A plausible position for the welcome reveal (stub).
  const position = 278 + Math.floor(Math.random() * 40) + 1;

  return NextResponse.json({
    leadId: crypto.randomUUID(),
    referralCode,
    referralUrl: `https://tripotter.com/r/${referralCode}`,
    position,
    message: "You are on the founding expedition.",
  });
}
