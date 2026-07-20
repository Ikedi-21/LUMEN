/**
 * Normalizes a raw Jikan manga object into the app's MediaItem shape.
 * Pure data mapper — no business logic (pricing applied in media.service.js).
 */
export function normalizeManga(item) {
  return {
    id: `jikan-${item.mal_id}`,
    type: "manga",
    title: item.title,
    cover: item.images?.jpg?.image_url || null,
    description: item.synopsis || "",
    rating: item.score || null,
    releaseDate: item.published?.from || null,
    genres: (item.genres || []).map((g) => g.name),
    creator: (item.authors && item.authors.map((a) => a.name).join(", ")) || null,
    source: "api",
  };
}

/**
 * Normalizes a paginated Jikan response into { items, hasMore }.
 * Uses pagination.has_next_page from the Jikan API.
 */
export function normalizeMangaPage(response) {
  const data = response.data || [];
  return {
    items: data.map(normalizeManga),
    hasMore: response.pagination?.has_next_page ?? false,
  };
}
