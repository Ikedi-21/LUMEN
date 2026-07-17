const BASE_URL = "https://api.jikan.moe/v4";

export async function fetchTopManga() {
  const res = await fetch(`${BASE_URL}/top/manga`);
  if (!res.ok) throw new Error("Jikan request failed");
  const data = await res.json();
  return data.data || [];
}

export async function searchManga(query) {
  const res = await fetch(`${BASE_URL}/manga?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Jikan search failed");
  const data = await res.json();
  return data.data || [];
}
