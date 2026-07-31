import { fetchPopularMovies, searchMovies } from "./clients/tmdb";
import { fetchBooks } from "./clients/openLibrary";
import { fetchTopManga, searchManga, fetchMangaById } from "./clients/anilist";
import { fetchComics, searchComics } from "./clients/openLibraryComics";

import { normalizeMovie, normalizeMoviePage } from "./adapters/tmdb.adapter";
import { normalizeBook, normalizeBookPage } from "./adapters/openLibrary.adapter";
import { normalizeManga, normalizeMangaPage } from "./adapters/anilist.adapter";
import { normalizeComic, normalizeComicPage } from "./adapters/openLibraryComics.adapter";

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
 * key expired) returns an empty page instead of crashing the entire page.
 */
const EMPTY_PAGE = { items: [], hasMore: false };

async function safeFetch(label, fn) {
  try {
    return await fn();
  } catch (err) {
    console.warn(`[${label}] API fetch failed — returning empty results:`, err.message);
    return EMPTY_PAGE;
  }
}

// ---------------------------------------------------------------------------
// Paginated browse fetchers (one per media type)
// Each returns { items, hasMore } after adapter normalization + pricing.
// ---------------------------------------------------------------------------

const PAGE_FETCHERS = {
  movie: (page) => safeFetch("TMDB", async () => {
    const raw = await fetchPopularMovies(page);
    const { items, hasMore } = normalizeMoviePage(raw);
    return { items: items.map(withPrice), hasMore };
  }),
  book: (page) => safeFetch("OpenLibrary", async () => {
    const raw = await fetchBooks("fiction", page);
    const { items, hasMore } = normalizeBookPage(raw);
    return { items: items.map(withPrice), hasMore };
  }),
  manga: (page) => safeFetch("AniList", async () => {
    const raw = await fetchTopManga(page);
    const { items, hasMore } = normalizeMangaPage(raw);
    return { items: items.map(withPrice), hasMore };
  }),
  comic: (page) => safeFetch("OpenLibraryComics", async () => {
    const raw = await fetchComics(page);
    const { items, hasMore } = normalizeComicPage(raw);
    return { items: items.map(withPrice), hasMore };
  }),
};

// ---------------------------------------------------------------------------
// Paginated search fetchers (one per media type)
// ---------------------------------------------------------------------------

const SEARCH_FETCHERS = {
  movie: (q, page) => safeFetch("TMDB_Search", async () => {
    const raw = await searchMovies(q, page);
    const { items, hasMore } = normalizeMoviePage(raw);
    return { items: items.map(withPrice), hasMore };
  }),
  book: (q, page) => safeFetch("OpenLibrary_Search", async () => {
    const raw = await fetchBooks(q, page);
    const { items, hasMore } = normalizeBookPage(raw);
    return { items: items.map(withPrice), hasMore };
  }),
  manga: (q, page) => safeFetch("AniList_Search", async () => {
    const raw = await searchManga(q, page);
    const { items, hasMore } = normalizeMangaPage(raw);
    return { items: items.map(withPrice), hasMore };
  }),
  comic: (q, page) => safeFetch("OpenLibraryComics_Search", async () => {
    const raw = await searchComics(q, page);
    const { items, hasMore } = normalizeComicPage(raw);
    return { items: items.map(withPrice), hasMore };
  }),
};

// ---------------------------------------------------------------------------
// Public API — Browse
// ---------------------------------------------------------------------------

/**
 * Paginated browse: returns { items, hasMore, nextPage }.
 * Admin products are prepended on page 1 only.
 */
export async function getMediaByTypePage(type, page = 1) {
  const fetcher = PAGE_FETCHERS[type];
  if (!fetcher) throw new Error(`Unknown media type: ${type}`);

  const [apiResult, allAdminItems] = await Promise.all([
    fetcher(page),
    page === 1
      ? getAdminProducts().catch((err) => {
          console.warn("Admin products fetch failed:", err.message);
          return [];
        })
      : Promise.resolve([]),
  ]);

  const adminItems = allAdminItems.filter((p) => p.type === type);
  const items = [...adminItems, ...apiResult.items];

  return {
    items,
    hasMore: apiResult.hasMore,
    nextPage: apiResult.hasMore ? page + 1 : null,
  };
}

/**
 * Backward-compatible: returns a flat array of items for page 1.
 * Used by HomePage rails, getMediaById, and existing consumers.
 */
export async function getMediaByType(type) {
  const result = await getMediaByTypePage(type, 1);
  return result.items;
}

// ---------------------------------------------------------------------------
// Public API — Product detail
// ---------------------------------------------------------------------------

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
    if (type === "manga" && id.startsWith("anilist-")) {
      const anilistId = id.replace("anilist-", "");
      const raw = await fetchMangaById(anilistId);
      if (raw) {
        return {
          ...normalizeManga(raw),
          price: generatePrice(id, raw.averageScore ? raw.averageScore / 10 : null),
        };
      }
    }
    if (type === "comic" && id.startsWith("olcomic-")) {
      const workId = id.replace("olcomic-", "");
      const res = await fetch(`https://openlibrary.org/search.json?q=${workId}&limit=1`);
      if (res.ok) {
        const data = await res.json();
        const doc = data.docs?.[0];
        if (doc) {
          return {
            ...normalizeComic(doc),
            price: generatePrice(id, doc.ratings_average),
          };
        }
      }
    }
  } catch (err) {
    console.warn(`Failed to resolve media item ${id} directly:`, err);
  }

  return null;
}

// ---------------------------------------------------------------------------
// Public API — Search
// ---------------------------------------------------------------------------

/**
 * Paginated search: returns { items, hasMore, nextPage }.
 * Searches all media types concurrently. Admin products are included on page 1 only.
 */
export async function searchMediaPage(query, page = 1) {
  if (!query || !query.trim()) return { items: [], hasMore: false, nextPage: null };
  const q = query.trim();

  const movies = await SEARCH_FETCHERS.movie(q, page);
  const books = await SEARCH_FETCHERS.book(q, page);
  const manga = await SEARCH_FETCHERS.manga(q, page);
  const comics = await SEARCH_FETCHERS.comic(q, page);

  const apiItems = [...movies.items, ...books.items, ...manga.items, ...comics.items];
  const anyHasMore = movies.hasMore || books.hasMore || manga.hasMore || comics.hasMore;

  let adminItems = [];
  if (page === 1) {
    const adminProducts = await getAdminProducts().catch(() => []);
    adminItems = adminProducts.filter((p) =>
      p.title?.toLowerCase().includes(q.toLowerCase()) ||
      p.creator?.toLowerCase().includes(q.toLowerCase()) ||
      p.description?.toLowerCase().includes(q.toLowerCase())
    );
  }

  const items = [...adminItems, ...apiItems];

  return {
    items,
    hasMore: anyHasMore,
    nextPage: anyHasMore ? page + 1 : null,
  };
}

/**
 * Backward-compatible: returns a flat array of search results (page 1 only).
 */
export async function searchMedia(query) {
  const result = await searchMediaPage(query, 1);
  return result.items;
}
