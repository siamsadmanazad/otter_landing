import { NextRequest, NextResponse } from "next/server";
import { growthDb, growthConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/leads?key=SECRET — download all founder leads as CSV.
 * Secret-gated (ADMIN_EXPORT_SECRET); compared in constant time. Returns the full
 * contact sheet (name, email, university, socials, referral stats) for outreach.
 * Server-only data via the locked public.founders_export wrapper.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function csvCell(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: NextRequest) {
  const secret = process.env.ADMIN_EXPORT_SECRET;
  const key = req.nextUrl.searchParams.get("key") ?? "";
  if (!secret || !safeEqual(key, secret)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!growthConfigured()) {
    return NextResponse.json({ message: "Backend not configured" }, { status: 503 });
  }

  try {
    const db = growthDb();
    const { data, error } = await db.rpc("founders_export");
    if (error) {
      console.error("founders_export error:", error.message);
      return NextResponse.json({ message: "Export failed" }, { status: 500 });
    }
    const rows = (data ?? []) as Record<string, unknown>[];
    const cols = [
      "full_name",
      "email",
      "university",
      "facebook",
      "instagram",
      "favorite_destination",
      "why_explore",
      "referral_code",
      "referred_by",
      "lead_position",
      "score",
      "status",
      "created_at",
    ];
    const header = cols.join(",");
    const body = rows.map((r) => cols.map((c) => csvCell(r[c])).join(",")).join("\n");
    const csv = `${header}\n${body}\n`;
    const date = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="tripotter-leads-${date}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("GET /api/admin/leads error:", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
