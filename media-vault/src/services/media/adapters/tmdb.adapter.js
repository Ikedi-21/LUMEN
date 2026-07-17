/**
 * Normalizes a raw TMDB movie object into the app's MediaItem shape.
 * Pure data mapper — no business logic (pricing applied in media.service.js).
 */
export function normalizeMovie(item) {
  return {
    id: `tmdb-${item.id}`,
    type: "movie",
    title: item.title,
    cover: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : null,
    backdrop: item.backdrop_path 
      ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
      : null,
    description: item.overview,
    rating: item.vote_average || null,
    releaseDate: item.release_date || null,
    genres: [],
    creator: null,
    source: "api",
  };
}
