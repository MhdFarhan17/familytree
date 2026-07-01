/**
 * Utility functions for name normalization and similarity matching.
 * Handles cases like:
 * - "Hj. Komariah" == "Komariah"
 * - "M. Farhan" == "Muhammad Farhan"
 * - "(Alm.) H. Suparman" == "Suparman"
 */

const TITLES = [
  "h.",
  "hj.",
  "alm.",
  "almh.",
  "bapak",
  "ibu",
  "bpk",
  "dr.",
  "drs.",
  "ir.",
];
const ALIASES: Record<string, string> = {
  "m.": "muhammad",
  m: "muhammad",
  mohd: "muhammad",
  "mohd.": "muhammad",
  moh: "muhammad",
  "moh.": "muhammad",
};

/**
 * Normalizes a name by removing common titles, lowercasing, and expanding abbreviations.
 */
export function normalizeName(name: string): string {
  if (!name) return "";

  // Lowercase and remove symbols like (), ., ,
  let normalized = name.toLowerCase().replace(/[(),]/g, "");

  // Split into words
  let words = normalized.split(/\s+/).filter((w) => w.length > 0);

  // Remove titles and expand aliases
  words = words
    .filter((word) => !TITLES.includes(word + ".") && !TITLES.includes(word)) // exact or with dot
    .map((word) => {
      const wWithDot = word + ".";
      if (ALIASES[word]) return ALIASES[word];
      if (ALIASES[wWithDot]) return ALIASES[wWithDot];
      return word;
    });

  return words.join(" ");
}

/**
 * Checks if two names are likely the same person based on normalization.
 */
export function isSamePerson(name1: string, name2: string): boolean {
  const norm1 = normalizeName(name1);
  const norm2 = normalizeName(name2);

  if (norm1 === norm2 && norm1 !== "") return true;

  // Partial match: "Muhammad Farhan" vs "Farhan"
  // If one name is fully contained within the other
  if (norm1.includes(norm2) && norm2.length > 3) return true;
  if (norm2.includes(norm1) && norm1.length > 3) return true;

  return false;
}
