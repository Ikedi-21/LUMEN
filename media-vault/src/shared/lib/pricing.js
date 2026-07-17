/**
 * Deterministic fake price generator — same id always yields same price.
 * Pure function, no side effects.
 */

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generatePrice(id, rating = 0) {
  const basePrice = (simpleHash(id) % 20000) + 2000;
  const ratingBonus = rating ? Math.round(rating * 300) : 0;
  return basePrice + ratingBonus;
}
