const BASE_URL = "https://api.jikan.moe/v4";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function jikanFetch(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    if (i > 0) await sleep(1500 * i);
    const res = await fetch(url);
    if (res.status === 429 || res.status >= 500) {
      if (i < retries - 1) continue;
    }
    if (!res.ok) throw new Error(`Jikan request failed (${res.status})`);
    const data = await res.json();
    return data;
  }
}

export async function fetchTopManga(page = 1) {
  const data = await jikanFetch(`${BASE_URL}/top/manga?page=${page}`);
  return { data: data.data || [], pagination: data.pagination || {} };
}

export async function searchManga(query, page = 1) {
  const data = await jikanFetch(`${BASE_URL}/manga?q=${encodeURIComponent(query)}&page=${page}`);
  return { data: data.data || [], pagination: data.pagination || {} };
}
