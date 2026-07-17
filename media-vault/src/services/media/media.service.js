import { fetchPopularMovies, searchMovies } from "./clients/tmdb";
import { fetchBooks } from "./clients/openLibrary";
import { fetchTopManga, searchManga } from "./clients/jikan";
import { fetchComics } from "./clients/comicVine";

import { normalizeMovie } from "./adapters/tmdb.adapter";
import { normalizeBook } from "./adapters/openLibrary.adapter";
import { normalizeManga } from "./adapters/jikan.adapter";
import { normalizeComic } from "./adapters/comicVine.adapter";

import { generatePrice } from "@/shared/lib/pricing";
import { getAdminProducts } from "@/services/products";

/**
 * Applies pricing as a post-normalization step.
 * This keeps adapters as pure data mappers.
 */
function withPrice(item) {
  return {
    ...item,
    price: generatePrice(item.id, item.rating),
  };
}

/**
 * Wraps an async fetcher so a single failing API (rate-limited, offline,
 * key expired) returns [] instead of crashing the entire page.
 */
async function safeFetch(label, fn) {
  try {
    return await fn();
  } catch (err) {
    console.warn(`[${label}] API fetch failed — returning empty results:`, err.message);
    return [];
  }
}

const FETCHERS = {
  movie: () => safeFetch("TMDB", async () => (await fetchPopularMovies()).map(normalizeMovie).map(withPrice)),
  book:  () => safeFetch("OpenLibrary", async () => (await fetchBooks()).map(normalizeBook).map(withPrice)),
  manga: () => safeFetch("Jikan", async () => (await fetchTopManga()).map(normalizeManga).map(withPrice)),
  comic: () => safeFetch("ComicVine", async () => (await fetchComics()).map(normalizeComic).map(withPrice)),
};

export async function getMediaByType(type) {
  const fetcher = FETCHERS[type];
  if (!fetcher) throw new Error(`Unknown media type: ${type}`);

  // Run API fetch and admin products fetch in parallel, both resilient
  const [apiItems, allAdminItems] = await Promise.all([
    fetcher(),
    getAdminProducts().catch((err) => {
      console.warn("Admin products fetch failed:", err.message);
      return [];
    }),
  ]);

  const adminItems = allAdminItems.filter((p) => p.type === type);
  return [...adminItems, ...apiItems];
}

export async function getMediaById(type, id) {
  const all = await getMediaByType(type);
  const found = all.find((item) => item.id === id);
  if (found) return found;

  // Fallback direct API lookup for specific IDs not in the default list
  try {
    if (type === "book" && id.startsWith("openlib-")) {
      const workId = id.replace("openlib-", "");
      const res = await fetch(`https://openlibrary.org/search.json?q=${workId}&limit=1`);
      if (res.ok) {
        const data = await res.json();
        const doc = data.docs?.[0];
        if (doc) {
          return {
            ...normalizeBook(doc),
            price: generatePrice(id, doc.ratings_average),
          };
        }
      }
    }
    if (type === "movie" && id.startsWith("tmdb-")) {
      const tmdbId = id.replace("tmdb-", "");
      const KEY = import.meta.env.VITE_TMDB_KEY;
      const res = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${KEY}`);
      if (res.ok) {
        const movie = await res.json();
        return {
          ...normalizeMovie(movie),
          price: generatePrice(id, movie.vote_average),
        };
      }
    }
  } catch (err) {
    console.warn(`Failed to resolve media item ${id} directly:`, err);
  }

  return null;
}

export async function searchMedia(query) {
  if (!query || !query.trim()) return [];
  const q = query.trim();

  // Search API clients concurrently with resilience
  const [movies, books, manga, comics] = await Promise.all([
    safeFetch("TMDB_Search", async () => (await searchMovies(q)).map(normalizeMovie).map(withPrice)),
    safeFetch("OpenLibrary_Search", async () => (await fetchBooks(q)).map(normalizeBook).map(withPrice)),
    safeFetch("Jikan_Search", async () => (await searchManga(q)).map(normalizeManga).map(withPrice)),
    safeFetch("ComicVine_Search", async () => (await fetchComics(q)).map(normalizeComic).map(withPrice)),
  ]);

  // Search local custom products
  const adminProducts = await getAdminProducts().catch(() => []);
  const filteredAdmin = adminProducts.filter((p) => 
    p.title?.toLowerCase().includes(q.toLowerCase()) || 
    p.creator?.toLowerCase().includes(q.toLowerCase()) || 
    p.description?.toLowerCase().includes(q.toLowerCase())
  );

  return [...filteredAdmin, ...movies, ...books, ...manga, ...comics];
}

