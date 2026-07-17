import { readCache, writeCache } from "@/shared/lib/cache";

const BASE_URL = "https://openlibrary.org";
const CACHE_KEY_PREFIX = "openlibrary_cache_";

export async function fetchBooks(query = "fiction") {
  const cacheKey = `${CACHE_KEY_PREFIX}${query}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=20`);
  if (!res.ok) throw new Error(`Open Library request failed (${res.status})`);
  
  const data = await res.json();
  const books = data.docs || [];

  writeCache(cacheKey, books);
  return books;
}
