import { NextResponse } from "next/server";

/**
 * GET /api/founders/leaderboard — top explorers + university race.
 * STUB (L3/L4): realistic mock so the dashboard + public board visualize.
 * At L2 this proxies the growth `leaderboard` Edge Function (v_leaderboard_public
 * — rank/display_name/score/verified_referrals only; never emails).
 */
export async function GET() {
  const explorers = [
    { rank: 1, name: "Sarah", university: "BRAC", invites: 21 },
    { rank: 2, name: "Rafi", university: "NSU", invites: 18 },
    { rank: 3, name: "Tanvir", university: "AIUB", invites: 15 },
    { rank: 4, name: "Mehjabin", university: "BRAC", invites: 12 },
    { rank: 5, name: "Arif", university: "DU", invites: 11 },
    { rank: 6, name: "Nusrat", university: "NSU", invites: 9 },
    { rank: 7, name: "Sakib", university: "IUB", invites: 8 },
    { rank: 8, name: "Priya", university: "BRAC", invites: 7 },
  ];

  const universities = [
    { name: "BRAC", explorers: 278 },
    { name: "NSU", explorers: 231 },
    { name: "AIUB", explorers: 190 },
    { name: "DU", explorers: 173 },
    { name: "IUB", explorers: 130 },
  ];

  return NextResponse.json({ explorers, universities });
}
