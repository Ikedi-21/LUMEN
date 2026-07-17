/**
 * Generic localStorage cache with TTL support.
 * Extracted from googleBooks.js for reuse across any API client.
 */

const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour

export function readCache(key, ttlMs = DEFAULT_TTL_MS) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > ttlMs) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // localStorage unavailable (quota exceeded / private browsing) — silently skip
  }
}

export function clearCache(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // silently skip
  }
}
