import { NextRequest, NextResponse } from "next/server";

/**
 * GET /r/[code] — the referral front door. Captures the inviter's code into a
 * cookie (so it survives even if the visitor wanders) and forwards to /founders
 * with ?ref=code so the signup form pre-fills it. This is the entry point the
 * /welcome share links point at; at L2 the `signup` Edge Function reads `ref` to
 * credit the inviter's score.
 */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ code: string }> }
): Promise<Response> {
  const { code } = await ctx.params;
  const clean = (code ?? "").trim().slice(0, 40);

  const url = new URL("/founders", req.url);
  if (clean) url.searchParams.set("ref", clean);

  const res = NextResponse.redirect(url);
  if (clean) {
    res.cookies.set("otti_ref", clean, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "lax",
    });
  }
  return res;
}
