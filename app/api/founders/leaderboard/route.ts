import { NextResponse } from "next/server";
import { growthDb, growthConfigured } from "@/lib/supabase";

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
 * GET /api/founders/leaderboard — top explorers + university race via the locked
 * public.founders_leaderboard wrapper (safe columns only — never email/socials).
 * Returns the demo stub when the board is empty or DB env is absent.
 */
export async function GET() {
  if (!growthConfigured()) return NextResponse.json(STUB);
  try {
    const db = growthDb();
    const { data: rows, error } = await db.rpc("founders_leaderboard", { p_limit: 50 });
    if (error) {
      console.error("founders_leaderboard error:", error.message);
      return NextResponse.json(STUB);
    }
    if (!rows || rows.length === 0) return NextResponse.json(STUB);

    const explorers = (rows as { rank: number; display_name: string; university: string | null; invites: number }[])
      .map((r) => ({
        rank: r.rank,
        name: r.display_name ?? "Explorer",
        university: r.university ?? "—",
        invites: r.invites ?? 0,
      }));

    const tally = new Map<string, number>();
    for (const r of explorers) {
      if (r.university && r.university !== "—") {
        tally.set(r.university, (tally.get(r.university) ?? 0) + 1);
      }
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
