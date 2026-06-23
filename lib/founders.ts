/**
 * Founders client — the typed surface the UI calls. Today these hit local proxy
 * routes that return realistic data; at L2 those routes proxy the growth
 * `signup` / `leaderboard` Edge Functions. The shapes match the planned safe
 * payloads (landingUI.md §4), so swapping the route body is the only change.
 */

export const FOUNDER_CAP = 1000;

export type FounderStats = {
  joined: number;
  total: number;
};

export type JoinPayload = {
  fullName: string;
  email: string;
  university: string;
  facebook?: string;
  instagram?: string;
  favoriteDestination?: string;
  whyExplore?: string;
  ref?: string;
};

export type JoinResult = {
  leadId: string;
  referralCode: string;
  referralUrl: string;
  position: number;
  message: string;
};

export async function getFounderStats(): Promise<FounderStats> {
  const res = await fetch("/api/founders/stats", { cache: "no-store" });
  if (!res.ok) throw new Error("stats failed");
  return res.json();
}

export async function joinFounders(payload: JoinPayload): Promise<JoinResult> {
  const res = await fetch("/api/founders/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "Could not join");
  return data;
}
