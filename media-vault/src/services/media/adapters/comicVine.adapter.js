/**
 * Normalizes a raw Comic Vine issue object into the app's MediaItem shape.
 * Pure data mapper — no business logic (pricing applied in media.service.js).
 */
function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

export function normalizeComic(item) {
  return {
    id: `comicvine-${item.id}`,
    type: "comic",
    title: item.name || item.volume?.name || "Untitled",
    cover: item.image?.medium_url || null,
    description: stripHtml(item.description),
    rating: null,
    releaseDate: item.cover_date || null,
    genres: [],
    creator: null,
    source: "api",
  };
}

/**
 * Normalizes a paginated Comic Vine response into { items, hasMore }.
 * Uses offset + results.length vs total_results to determine if more exist.
 */
export function normalizeComicPage(response) {
  const results = response.results || [];
  const offset = response.offset || 0;
  const total = response.total_results || 0;
  return {
    items: results.map(normalizeComic),
    hasMore: offset + results.length < total,
  };
}

