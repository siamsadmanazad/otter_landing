-- University canonicalization: merges already-collected free-text variants
-- ("NSU" / "North South University" / " nsu " / "N.S.U") of the same campus
-- so the university race tally and per-explorer leaderboard display count
-- them as one. Two-part fix (see marketing.md): this migration merges
-- existing data server-side; the /founders form now also ships a searchable
-- dropdown (BD_UNIVERSITIES in lib/universities.ts) so new signups mostly
-- submit an exact canonical string already. Raw `growth.leads.university`
-- is left untouched (still exported as typed) — only display/grouping uses
-- the canonical name.

-- ── squish: lowercase + strip everything but letters/digits, used as the
--    join key so casing/punctuation/whitespace differences never matter ──
create or replace function growth.squish_university(p text)
returns text
language sql
immutable
as $$
  select nullif(regexp_replace(lower(coalesce(p, '')), '[^a-z0-9]', '', 'g'), '')
$$;

-- ── alias table: squished variant -> canonical display name ──────────────
create table if not exists growth.university_aliases (
  alias_key      text primary key,
  canonical_name text not null,
  created_at     timestamptz not null default now()
);

-- ── canonical_university: alias lookup, falls back to the trimmed original
--    when nothing matches (unknown / not-yet-seeded university) ──────────
create or replace function growth.canonical_university(p text)
returns text
language sql
stable
as $$
  select coalesce(
    (select a.canonical_name from growth.university_aliases a
       where a.alias_key = growth.squish_university(p)),
    nullif(trim(p), '')
  )
$$;

-- ── seed: major Bangladeshi universities, common abbreviations + full names.
--    Best-effort, not exhaustive — extend with more insert rows any time.
--    Matches lib/universities.ts (the form's dropdown) so canonical names
--    for known variants are identical everywhere. ────────────────────────
insert into growth.university_aliases (alias_key, canonical_name)
select distinct growth.squish_university(t.variant), t.canonical
from (values
  ('North South University', 'North South University'), ('NSU', 'North South University'),
  ('BRAC University', 'BRAC University'), ('BRAC', 'BRAC University'), ('BRACU', 'BRAC University'),
  ('University of Dhaka', 'University of Dhaka'), ('Dhaka University', 'University of Dhaka'), ('DU', 'University of Dhaka'),
  ('Bangladesh University of Engineering and Technology', 'Bangladesh University of Engineering and Technology'), ('BUET', 'Bangladesh University of Engineering and Technology'),
  ('American International University-Bangladesh', 'American International University-Bangladesh'), ('American International University Bangladesh', 'American International University-Bangladesh'), ('AIUB', 'American International University-Bangladesh'),
  ('Independent University, Bangladesh', 'Independent University, Bangladesh'), ('Independent University Bangladesh', 'Independent University, Bangladesh'), ('IUB', 'Independent University, Bangladesh'),
  ('East West University', 'East West University'), ('EWU', 'East West University'),
  ('United International University', 'United International University'), ('UIU', 'United International University'),
  ('Daffodil International University', 'Daffodil International University'), ('DIU', 'Daffodil International University'), ('Daffodil', 'Daffodil International University'),
  ('Ahsanullah University of Science and Technology', 'Ahsanullah University of Science and Technology'), ('AUST', 'Ahsanullah University of Science and Technology'),
  ('Islamic University of Technology', 'Islamic University of Technology'), ('IUT', 'Islamic University of Technology'),
  ('Bangladesh University of Professionals', 'Bangladesh University of Professionals'), ('BUP', 'Bangladesh University of Professionals'),
  ('Southeast University', 'Southeast University'), ('SEU', 'Southeast University'),
  ('Stamford University Bangladesh', 'Stamford University Bangladesh'), ('Stamford University', 'Stamford University Bangladesh'), ('Stamford', 'Stamford University Bangladesh'),
  ('Presidency University', 'Presidency University'),
  ('World University of Bangladesh', 'World University of Bangladesh'), ('WUB', 'World University of Bangladesh'),
  ('Green University of Bangladesh', 'Green University of Bangladesh'), ('GUB', 'Green University of Bangladesh'), ('Green University', 'Green University of Bangladesh'),
  ('Uttara University', 'Uttara University'),
  ('University of Liberal Arts Bangladesh', 'University of Liberal Arts Bangladesh'), ('ULAB', 'University of Liberal Arts Bangladesh'),
  ('Jahangirnagar University', 'Jahangirnagar University'), ('JU', 'Jahangirnagar University'), ('Jahangirnagar', 'Jahangirnagar University'),
  ('Jagannath University', 'Jagannath University'), ('JnU', 'Jagannath University'), ('Jagannath', 'Jagannath University'),
  ('University of Rajshahi', 'University of Rajshahi'), ('Rajshahi University', 'University of Rajshahi'), ('RU', 'University of Rajshahi'),
  ('University of Chittagong', 'University of Chittagong'), ('Chittagong University', 'University of Chittagong'), ('CU', 'University of Chittagong'),
  ('Khulna University', 'Khulna University'), ('KU', 'Khulna University'),
  ('Shahjalal University of Science and Technology', 'Shahjalal University of Science and Technology'), ('SUST', 'Shahjalal University of Science and Technology'),
  ('Military Institute of Science and Technology', 'Military Institute of Science and Technology'), ('MIST', 'Military Institute of Science and Technology'),
  ('Khulna University of Engineering & Technology', 'Khulna University of Engineering & Technology'), ('Khulna University of Engineering and Technology', 'Khulna University of Engineering & Technology'), ('KUET', 'Khulna University of Engineering & Technology'),
  ('Rajshahi University of Engineering & Technology', 'Rajshahi University of Engineering & Technology'), ('Rajshahi University of Engineering and Technology', 'Rajshahi University of Engineering & Technology'), ('RUET', 'Rajshahi University of Engineering & Technology'),
  ('Chittagong University of Engineering & Technology', 'Chittagong University of Engineering & Technology'), ('Chittagong University of Engineering and Technology', 'Chittagong University of Engineering & Technology'), ('CUET', 'Chittagong University of Engineering & Technology'),
  ('Bangabandhu Sheikh Mujibur Rahman Science and Technology University', 'Bangabandhu Sheikh Mujibur Rahman Science and Technology University'), ('BSMRSTU', 'Bangabandhu Sheikh Mujibur Rahman Science and Technology University'),
  ('Comilla University', 'Comilla University'),
  ('Noakhali Science and Technology University', 'Noakhali Science and Technology University'), ('NSTU', 'Noakhali Science and Technology University'),
  ('Patuakhali Science and Technology University', 'Patuakhali Science and Technology University'), ('PSTU', 'Patuakhali Science and Technology University'),
  ('Bangladesh Agricultural University', 'Bangladesh Agricultural University'), ('BAU', 'Bangladesh Agricultural University'),
  ('Sher-e-Bangla Agricultural University', 'Sher-e-Bangla Agricultural University'), ('SAU', 'Sher-e-Bangla Agricultural University'),
  ('Bangladesh University of Textiles', 'Bangladesh University of Textiles'), ('BUTEX', 'Bangladesh University of Textiles'),
  ('Dhaka University of Engineering & Technology', 'Dhaka University of Engineering & Technology'), ('Dhaka University of Engineering and Technology', 'Dhaka University of Engineering & Technology'), ('DUET', 'Dhaka University of Engineering & Technology'),
  ('Northern University Bangladesh', 'Northern University Bangladesh'), ('NUB', 'Northern University Bangladesh'),
  ('Southern University Bangladesh', 'Southern University Bangladesh'), ('SUB', 'Southern University Bangladesh'),
  ('Premier University Chittagong', 'Premier University Chittagong'), ('Premier University', 'Premier University Chittagong'),
  ('International Islamic University Chittagong', 'International Islamic University Chittagong'), ('IIUC', 'International Islamic University Chittagong'),
  ('Leading University', 'Leading University'), ('Leading University Sylhet', 'Leading University'),
  ('Metropolitan University', 'Metropolitan University'), ('Metropolitan University Sylhet', 'Metropolitan University'),
  ('Varendra University', 'Varendra University'),
  ('City University', 'City University'),
  ('Manarat International University', 'Manarat International University'),
  ('East Delta University', 'East Delta University'), ('EDU', 'East Delta University'),
  ('Port City International University', 'Port City International University'), ('PCIU', 'Port City International University')
) as t(variant, canonical)
on conflict (alias_key) do update set canonical_name = excluded.canonical_name;

-- ── university_tally: group by canonical name instead of the raw string ──
create or replace function growth.university_tally(p_limit integer default 8)
returns table (name text, explorers integer)
language sql
security definer
set search_path = growth, public
as $$
  select growth.canonical_university(l.university) as name, count(*)::int as explorers
  from growth.leads l
  join growth.campaigns c on c.id = l.campaign_id and c.slug = 'founders-waitlist'
  where l.status not in ('blocked', 'unsubscribed')
    and growth.canonical_university(l.university) is not null
  group by 1
  order by explorers desc, name asc
  limit p_limit;
$$;

-- ── v_leaderboard: show the canonical name next to each explorer too ─────
create or replace view growth.v_leaderboard as
select
  l.campaign_id,
  l.referral_code,
  coalesce(nullif(l.full_name,''), 'Explorer') as display_name,
  growth.canonical_university(l.university) as university,
  l.score,
  (select count(*) from growth.referral_events re
     where re.referrer_lead_id = l.id and re.event_type = 'signup') as invites,
  rank() over (partition by l.campaign_id order by l.score desc, l.created_at asc) as rank
from growth.leads l
where l.status not in ('blocked','unsubscribed');

revoke all on function growth.squish_university(text) from public, anon, authenticated;
revoke all on function growth.canonical_university(text) from public, anon, authenticated;
