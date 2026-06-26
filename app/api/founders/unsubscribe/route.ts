import { NextRequest, NextResponse } from "next/server";
import { growthDb, growthConfigured } from "@/lib/supabase";

/**
 * GET /api/founders/unsubscribe?token=<uuid> — one-click opt-out from the email footer.
 * Flips the lead to status='unsubscribed' (idempotent) and shows a small confirmation page.
 */
function page(title: string, body: string) {
  return new NextResponse(
    `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
     <body style="margin:0;background:#0d0f14;color:#eee;font-family:ui-sans-serif,system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center">
       <div style="max-width:420px;padding:40px 28px;text-align:center">
         <div style="font-size:40px">🦦</div>
         <h1 style="font-size:22px;margin:12px 0 8px">${title}</h1>
         <p style="color:#aaa;line-height:1.6">${body}</p>
       </div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } },
  );
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim();
  if (!token) {
    return page("Link not valid", "This unsubscribe link is missing its token.");
  }
  if (!growthConfigured()) {
    return page("You're unsubscribed", "You won't receive further emails from this campaign.");
  }
  try {
    const db = growthDb();
    const { data, error } = await db.rpc("founders_unsubscribe", { p_token: token });
    if (error || data !== true) {
      return page("Link not valid", "We couldn't find that subscription. It may have already been removed.");
    }
    return page("You're unsubscribed", "Done — you won't receive further emails from the TripOtter founders campaign. We're sad to see Otti go.");
  } catch (e) {
    console.error("GET /api/founders/unsubscribe error:", e);
    return page("Something went wrong", "Please try again in a moment.");
  }
}
