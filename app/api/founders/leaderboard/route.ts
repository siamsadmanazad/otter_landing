import { NextResponse } from "next/server";
import { growthDb, growthConfigured, CAMPAIGN_SLUG } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const STUB = {
  explorers: [
    { rank: 1, name: "Sarah", university: "BRAC", invites: 21 },
    { rank: 2, name: "Rafi", university: "NSU", invites: 18 },
    { rank: 3, name: "Tanvir", university: "AIUB", invites: 15 },
    { rank: 4, name: "Mehjabin", university: "BRAC", invites: 12 },
    { rank: 5, name: "Arif", university: "DU", invites: 11 },
  ],
  universities: [
    { name: "BRAC", explorers: 278 },
    { name: "NSU", explorers: 231 },
    { name: "AIUB", explorers: 190 },
    { name: "DU", explorers: 173 },
    { name: "IUB", explorers: 130 },
  ],
};

/**
 * GET /api/founders/leaderboard — top explorers + university race from the
 * growth.v_leaderboard view (safe columns only). When the board is still empty
 * (or no DB env), returns the demo stub so the page never looks broken.
 */
export async function GET() {
  if (!growthConfigured()) return NextResponse.json(STUB);
  try {
    const db = growthDb();
    const { data: campaign } = await db
      .from("campaigns")
      .select("id")
      .eq("slug", CAMPAIGN_SLUG)
      .single();
    if (!campaign) return NextResponse.json(STUB);

    const { data: rows } = await db
      .from("v_leaderboard")
      .select("display_name, university, invites, rank")
      .eq("campaign_id", campaign.id)
      .order("rank", { ascending: true })
      .limit(50);

    if (!rows || rows.length === 0) return NextResponse.json(STUB);

    const explorers = rows.map((r) => ({
      rank: r.rank as number,
      name: (r.display_name as string) ?? "Explorer",
      university: (r.university as string) ?? "—",
      invites: (r.invites as number) ?? 0,
    }));

    // University race = explorer counts grouped by university.
    const tally = new Map<string, number>();
    for (const r of rows) {
      const u = (r.university as string) || null;
      if (u) tally.set(u, (tally.get(u) ?? 0) + 1);
    }
    const universities = [...tally.entries()]
      .map(([name, explorersCount]) => ({ name, explorers: explorersCount }))
      .sort((a, b) => b.explorers - a.explorers)
      .slice(0, 6);

    return NextResponse.json({
      explorers,
      universities: universities.length ? universities : STUB.universities,
    });
  } catch (e) {
    console.error("GET /api/founders/leaderboard error:", e);
    return NextResponse.json(STUB);
  }
}
