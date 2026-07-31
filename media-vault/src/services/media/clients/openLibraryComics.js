import { readCache, writeCache } from "@/shared/lib/cache";

const BASE_URL = "https://openlibrary.org";
const CACHE_KEY_PREFIX = "openlibrary_comics_cache_";

export async function fetchComics(page = 1) {
  const cacheKey = `${CACHE_KEY_PREFIX}top_p${page}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const query = 'subject:"comics" OR subject:"graphic novels"';
  const res = await fetch(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=20&page=${page}`);
  if (!res.ok) throw new Error(`Open Library request failed (${res.status})`);
  
  const data = await res.json();
  const comics = data.docs || [];
  const result = { docs: comics, numFound: data.numFound || 0, page };

  writeCache(cacheKey, result);
  return result;
}

export async function searchComics(query, page = 1) {
  const cacheKey = `${CACHE_KEY_PREFIX}search_${query}_p${page}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const searchQuery = `${query} (subject:"graphic novels" OR subject:"comics")`;
  const res = await fetch(`${BASE_URL}/search.json?q=${encodeURIComponent(searchQuery)}&limit=20&page=${page}`);
  if (!res.ok) throw new Error(`Open Library request failed (${res.status})`);
  
  const data = await res.json();
  const comics = data.docs || [];
  const result = { docs: comics, numFound: data.numFound || 0, page };

  writeCache(cacheKey, result);
  return result;
}
