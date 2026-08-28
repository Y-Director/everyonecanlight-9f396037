// Flexible name search: matches on any word of an item's name, not just the start.
// e.g. "storm", "600", "pro", "arri x21" all match without typing the full name.

const tokenize = (value: string): string[] =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

export const matchesSearch = (name: string, query: string): boolean => {
  const terms = tokenize(query);
  if (terms.length === 0) return true;

  const words = tokenize(name);
  const flat = words.join(" ");

  return terms.every(
    (term) => words.some((word) => word.startsWith(term)) || flat.includes(term),
  );
};
