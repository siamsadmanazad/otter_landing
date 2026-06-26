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
 * GET /api/founders/leaderboard — top explorers (founders_leaderboard) + the real
 * campus race (founders_university_race: total signups per uni). Safe columns only.
 * In production it returns REAL data (empty arrays when the board is empty → the UI
 * shows a "be the first" state). The demo stub is used only in keyless dev.
 */
export async function GET() {
  if (!growthConfigured()) return NextResponse.json(STUB);
  try {
    const db = growthDb();
    const [board, race] = await Promise.all([
      db.rpc("founders_leaderboard", { p_limit: 50 }),
      db.rpc("founders_university_race", { p_limit: 8 }),
    ]);
    if (board.error || race.error) {
      console.error("leaderboard error:", board.error?.message ?? race.error?.message);
      return NextResponse.json({ explorers: [], universities: [] });
    }
    const explorers = ((board.data ?? []) as { rank: number; display_name: string; university: string | null; invites: number }[])
      .map((r) => ({
        rank: r.rank,
        name: r.display_name ?? "Explorer",
        university: r.university ?? "—",
        invites: r.invites ?? 0,
      }));
    const universities = ((race.data ?? []) as { name: string; explorers: number }[])
      .map((u) => ({ name: u.name, explorers: u.explorers }));

    return NextResponse.json({ explorers, universities });
  } catch (e) {
    console.error("GET /api/founders/leaderboard error:", e);
    return NextResponse.json({ explorers: [], universities: [] });
  }
}
