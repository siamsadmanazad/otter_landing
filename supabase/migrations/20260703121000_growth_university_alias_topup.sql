-- Top-up aliases found by diffing real live `growth.leads.university` values
-- against growth.canonical_university() right after the first canon pass —
-- "North South" (without the word "University") wasn't merging into
-- "North South University" because only the "NSU" abbreviation was seeded.
-- Adds a few more bare/short forms people commonly type.

insert into growth.university_aliases (alias_key, canonical_name)
select distinct growth.squish_university(t.variant), t.canonical
from (values
  ('North South', 'North South University'),
  ('East West', 'East West University'),
  ('Rajshahi', 'University of Rajshahi'),
  ('Chittagong', 'University of Chittagong'),
  ('Jahangirnagar Uni', 'Jahangirnagar University')
) as t(variant, canonical)
on conflict (alias_key) do update set canonical_name = excluded.canonical_name;
