const BASE_URL = "https://api.themoviedb.org/3";
const KEY = import.meta.env.VITE_TMDB_KEY;

export async function fetchPopularMovies(page = 1) {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${KEY}&page=${page}`);
  if (!res.ok) throw new Error("TMDB request failed");
  const data = await res.json();
  return { results: data.results, page: data.page, total_pages: data.total_pages };
}

export async function searchMovies(query, page = 1) {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${KEY}&query=${encodeURIComponent(query)}&page=${page}`
  );
  if (!res.ok) throw new Error("TMDB search failed");
  const data = await res.json();
  return { results: data.results, page: data.page, total_pages: data.total_pages };
}

export async function fetchMovieTrailer(tmdbId) {
  const res = await fetch(`${BASE_URL}/movie/${tmdbId}/videos?api_key=${KEY}`);
  if (!res.ok) throw new Error("TMDB trailer request failed");
  const data = await res.json();
  const results = data.results || [];
  // Priority: Official Trailer > Teaser > any YouTube video
  return (
    results.find(v => v.site === "YouTube" && v.type === "Trailer") ||
    results.find(v => v.site === "YouTube" && v.type === "Teaser") ||
    results.find(v => v.site === "YouTube") ||
    null
  );
}
