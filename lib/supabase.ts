import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase admin client for the marketing `growth` schema. Uses the
 * service-role key (bypasses RLS) and is scoped to `growth`, so it can never be
 * imported into client code. The schema is isolated from the app's public tables.
 *
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the browser (no NEXT_PUBLIC_ prefix).
 */
export function growthDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase env missing (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }
  // Default (public) schema: the growth data is reached via locked-down public
  // wrapper RPCs (founders_signup/_count/_leaderboard), not direct table access.
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** True when the backend is configured (so routes can fall back to stub data in dev). */
export function growthConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export const CAMPAIGN_SLUG = "founders-waitlist";
