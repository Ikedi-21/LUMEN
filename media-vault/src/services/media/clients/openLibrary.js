import { readCache, writeCache } from "@/shared/lib/cache";

const BASE_URL = "https://openlibrary.org";
const CACHE_KEY_PREFIX = "openlibrary_cache_";

export async function fetchBooks(query = "fiction", page = 1) {
  const cacheKey = `${CACHE_KEY_PREFIX}${query}_p${page}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=20&page=${page}`);
  if (!res.ok) throw new Error(`Open Library request failed (${res.status})`);
  
  const data = await res.json();
  const books = data.docs || [];
  const result = { docs: books, numFound: data.numFound || 0, page };

  writeCache(cacheKey, result);
  return result;
}
