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

export type UtmParams = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
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
  /** Marketing-permission consent (required by the form before submit). */
  consent?: boolean;
  /** Campaign attribution captured from the landing URL. */
  utm?: UtmParams;
  /** Honeypot — must stay empty; bots that fill it are silently rejected server-side. */
  hp?: string;
  /** Cloudflare Turnstile token (present only when the widget is configured). */
  turnstileToken?: string;
};

export type JoinResult = {
  leadId: string;
  referralCode: string;
  referralUrl: string;
  position: number;
  message: string;
};

/** Pull utm_* attribution out of the landing URL's query string. */
export function readUtm(params: URLSearchParams): UtmParams {
  const pick = (k: string) => params.get(`utm_${k}`)?.slice(0, 200) || undefined;
  return {
    source: pick("source"),
    medium: pick("medium"),
    campaign: pick("campaign"),
    term: pick("term"),
    content: pick("content"),
  };
}

export async function getFounderStats(): Promise<FounderStats> {
  const res = await fetch("/api/founders/stats", { cache: "no-store" });
  if (!res.ok) throw new Error("stats failed");
  return res.json();
}

export type Explorer = {
  rank: number;
  name: string;
  university: string;
  invites: number;
};
export type University = { name: string; explorers: number };
export type LeaderboardData = {
  explorers: Explorer[];
  universities: University[];
};

export async function getLeaderboard(): Promise<LeaderboardData> {
  const res = await fetch("/api/founders/leaderboard", { cache: "no-store" });
  if (!res.ok) throw new Error("leaderboard failed");
  return res.json();
}

export type MeStats = {
  referralCode: string;
  position: number;
  score: number;
  rank: number;
  invites: number;
  verifiedInvites: number;
  verified: boolean;
};

/** Live per-lead stats for the founder dashboard, looked up by the shareable code. */
export async function getMe(code: string): Promise<MeStats | null> {
  const res = await fetch(`/api/founders/me?code=${encodeURIComponent(code)}`, { cache: "no-store" });
  if (!res.ok) return null;
  const d = await res.json();
  return d?.referralCode ? (d as MeStats) : null;
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
