const BASE_URL = "https://api.themoviedb.org/3";
const KEY = import.meta.env.VITE_TMDB_KEY;

export async function fetchPopularMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${KEY}`);
  if (!res.ok) throw new Error("TMDB request failed");
  const data = await res.json();
  return data.results;
}

export async function searchMovies(query) {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${KEY}&query=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("TMDB search failed");
  const data = await res.json();
  return data.results;
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
