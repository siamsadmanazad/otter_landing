/**
 * Curated list of Bangladeshi universities for the signup form's searchable
 * dropdown. Picking from this list (instead of free-typing) is what stops new
 * "NSU" / "North South University" / "nsu " splits in the campus race —
 * everyone who selects an entry submits the exact same canonical string.
 * Canonical names here MUST match `growth.university_aliases.canonical_name`
 * in supabase/migrations/20260703120000_growth_university_canon.sql, which
 * also folds in already-collected free-text variants of the same names.
 */
export const BD_UNIVERSITIES: string[] = [
  "Ahsanullah University of Science and Technology",
  "American International University-Bangladesh",
  "Bangabandhu Sheikh Mujibur Rahman Science and Technology University",
  "Bangladesh Agricultural University",
  "Bangladesh University of Engineering and Technology",
  "Bangladesh University of Professionals",
  "Bangladesh University of Textiles",
  "BRAC University",
  "Chittagong University of Engineering & Technology",
  "City University",
  "Comilla University",
  "Daffodil International University",
  "Dhaka University of Engineering & Technology",
  "East Delta University",
  "East West University",
  "Green University of Bangladesh",
  "Independent University, Bangladesh",
  "International Islamic University Chittagong",
  "Islamic University of Technology",
  "Jagannath University",
  "Jahangirnagar University",
  "Khulna University",
  "Khulna University of Engineering & Technology",
  "Leading University",
  "Manarat International University",
  "Metropolitan University",
  "Military Institute of Science and Technology",
  "Noakhali Science and Technology University",
  "North South University",
  "Northern University Bangladesh",
  "Patuakhali Science and Technology University",
  "Port City International University",
  "Premier University Chittagong",
  "Presidency University",
  "Rajshahi University of Engineering & Technology",
  "Sher-e-Bangla Agricultural University",
  "Shahjalal University of Science and Technology",
  "Southeast University",
  "Southern University Bangladesh",
  "Stamford University Bangladesh",
  "United International University",
  "University of Chittagong",
  "University of Dhaka",
  "University of Liberal Arts Bangladesh",
  "University of Rajshahi",
  "Uttara University",
  "Varendra University",
  "World University of Bangladesh",
];
