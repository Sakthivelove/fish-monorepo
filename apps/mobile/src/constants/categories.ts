// Categories themselves are NOT hardcoded here — they're free-text
// on the backend (admins can type anything), so the real list is
// always derived from actual product data (see HomeScreen /
// ProductListScreen). This file only maps a category name to a
// display emoji, with a sensible fallback for anything unrecognized
// so a brand-new category typed by an admin never breaks the UI.
const CATEGORY_EMOJIS: Record<string, string> = {
  All: "🛒",
  Fish: "🐟",
  Prawn: "🦐",
  Crab: "🦀",
  Shellfish: "🐚",
};

const DEFAULT_EMOJI = "🐠";

export function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJIS[category] ?? DEFAULT_EMOJI;
}
