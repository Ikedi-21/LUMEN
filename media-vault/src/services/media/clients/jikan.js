const BASE_URL = "https://api.jikan.moe/v4";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let lastRequestTime = 0;
const MIN_INTERVAL = 800;

// ── In-memory cache (avoids repeated 429s during development) ──────────
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}
// ───────────────────────────────────────────────────────────────────────

async function jikanFetch(url, retries = 3) {
  const cached = getCached(url);
  if (cached) return cached;

  for (let i = 0; i < retries; i++) {
    if (i > 0) await sleep(2000 * i);

    const elapsed = Date.now() - lastRequestTime;
    if (elapsed < MIN_INTERVAL) await sleep(MIN_INTERVAL - elapsed);
    lastRequestTime = Date.now();

    try {
      const res = await fetch(url);
      if (res.status === 429 || res.status >= 500) {
        if (i < retries - 1) continue;
        throw new Error(`Jikan request failed (${res.status})`);
      }
      if (!res.ok) throw new Error(`Jikan request failed (${res.status})`);
      const json = await res.json();
      setCache(url, json);
      return json;
    } catch (err) {
      if (i === retries - 1) throw err;
    }
  }
}

const FALLBACK_MANGA = [
  { mal_id: 1, title: "One Piece", score: 9.1, published: { from: "1997-07-22" }, synopsis: "Monkey D. Luffy sets off on an adventure with his pirate crew in hopes of finding the greatest treasure ever, known as 'One Piece'.", genres: [{ name: "Adventure" }, { name: "Comedy" }], authors: [{ name: "Eiichiro Oda" }], images: { jpg: { image_url: "https://cdn.myanimelist.net/images/manga/2/253146l.jpg", large_image_url: "https://cdn.myanimelist.net/images/manga/2/253146l.jpg" } } },
  { mal_id: 11, title: "Naruto", score: 8.0, published: { from: "1999-09-21" }, synopsis: "Naruto Uzumaki, a hyperactive and knuckle-headed ninja, trains under Team 7 and works to become the Hokage.", genres: [{ name: "Action" }, { name: "Fantasy" }], authors: [{ name: "Masashi Kishimoto" }], images: { jpg: { image_url: "https://cdn.myanimelist.net/images/manga/2/258749l.jpg", large_image_url: "https://cdn.myanimelist.net/images/manga/2/258749l.jpg" } } },
  { mal_id: 13, title: "Bleach", score: 8.2, published: { from: "2001-08-07" }, synopsis: "Ichigo Kurosaki becomes a Soul Reaper and protects humans from evil spirits and guides souls to the afterlife.", genres: [{ name: "Action" }, { name: "Supernatural" }], authors: [{ name: "Tite Kubo" }], images: { jpg: { image_url: "https://cdn.myanimelist.net/images/manga/3/258749l.jpg", large_image_url: "https://cdn.myanimelist.net/images/manga/3/258749l.jpg" } } },
  { mal_id: 25, title: "Fullmetal Alchemist", score: 9.05, published: { from: "2001-07-12" }, synopsis: "Two brothers search for a Philosopher's Stone after an ill-fated attempt to revive their deceased mother.", genres: [{ name: "Action" }, { name: "Drama" }], authors: [{ name: "Hiromu Arakawa" }], images: { jpg: { image_url: "https://cdn.myanimelist.net/images/manga/2/33673l.jpg", large_image_url: "https://cdn.myanimelist.net/images/manga/2/33673l.jpg" } } },
  { mal_id: 30, title: "Death Note", score: 8.62, published: { from: "2003-12-01" }, synopsis: "A high school student discovers a supernatural notebook that grants its user the ability to kill anyone.", genres: [{ name: "Mystery" }, { name: "Thriller" }], authors: [{ name: "Tsugumi Ohba" }, { name: "Takeshi Obata" }], images: { jpg: { image_url: "https://cdn.myanimelist.net/images/manga/2/258749l.jpg", large_image_url: "https://cdn.myanimelist.net/images/manga/2/258749l.jpg" } } },
  { mal_id: 44, title: "Attack on Titan", score: 8.54, published: { from: "2009-09-09" }, synopsis: "Humanity lives inside cities surrounded by enormous walls due to the Titans, gigantic humanoid beings.", genres: [{ name: "Action" }, { name: "Drama" }], authors: [{ name: "Hajime Isayama" }], images: { jpg: { image_url: "https://cdn.myanimelist.net/images/manga/2/390139l.jpg", large_image_url: "https://cdn.myanimelist.net/images/manga/2/390139l.jpg" } } },
  { mal_id: 57, title: "Berserk", score: 9.02, published: { from: "1989-08-01" }, synopsis: "Guts, a former mercenary, seeks revenge while battling dark forces in a medieval fantasy world.", genres: [{ name: "Action" }, { name: "Horror" }], authors: [{ name: "Kentaro Miura" }], images: { jpg: { image_url: "https://cdn.myanimelist.net/images/manga/2/390139l.jpg", large_image_url: "https://cdn.myanimelist.net/images/manga/2/390139l.jpg" } } },
  { mal_id: 72, title: "Hunter x Hunter", score: 9.04, published: { from: "1998-03-03" }, synopsis: "Gon Freecss aspires to become a Hunter to find his absent father.", genres: [{ name: "Adventure" }, { name: "Fantasy" }], authors: [{ name: "Yoshihiro Togashi" }], images: { jpg: { image_url: "https://cdn.myanimelist.net/images/manga/3/199681l.jpg", large_image_url: "https://cdn.myanimelist.net/images/manga/3/199681l.jpg" } } },
  { mal_id: 92, title: "Monster", score: 9.05, published: { from: "1994-12-05" }, synopsis: "A brilliant neurosurgeon saves a boy's life, only to discover years later that the boy has become a serial killer.", genres: [{ name: "Drama" }, { name: "Thriller" }], authors: [{ name: "Naoki Urasawa" }], images: { jpg: { image_url: "https://cdn.myanimelist.net/images/manga/2/258749l.jpg", large_image_url: "https://cdn.myanimelist.net/images/manga/2/258749l.jpg" } } },
  { mal_id: 101, title: "Vagabond", score: 9.14, published: { from: "1998-09-04" }, synopsis: "A fictionalized account of the life of Japanese swordsman Miyamoto Musashi.", genres: [{ name: "Action" }, { name: "Historical" }], authors: [{ name: "Takehiko Inoue" }], images: { jpg: { image_url: "https://cdn.myanimelist.net/images/manga/2/258749l.jpg", large_image_url: "https://cdn.myanimelist.net/images/manga/2/258749l.jpg" } } },
];

export async function fetchTopManga(page = 1) {
  try {
    const data = await jikanFetch(`${BASE_URL}/top/manga?page=${page}`);
    return { data: data.data || [], pagination: data.pagination || {} };
  } catch (err) {
    console.warn(`[Jikan] Using fallback manga data: ${err.message}`);
    // Fallback only covers page 1
    if (page > 1) return { data: [], pagination: { has_next_page: false } };
    return { data: FALLBACK_MANGA, pagination: { has_next_page: false } };
  }
}

export async function searchManga(query, page = 1) {
  try {
    const data = await jikanFetch(`${BASE_URL}/manga?q=${encodeURIComponent(query)}&page=${page}`);
    return { data: data.data || [], pagination: data.pagination || {} };
  } catch (err) {
    console.warn(`[Jikan] Search fallback: ${err.message}`);
    if (page > 1) return { data: [], pagination: { has_next_page: false } };
    const q = query.toLowerCase();
    const filtered = FALLBACK_MANGA.filter(m =>
      m.title.toLowerCase().includes(q) || m.synopsis.toLowerCase().includes(q)
    );
    return { data: filtered, pagination: { has_next_page: false } };
  }
}

/**
 * Fetches a single manga by its MAL ID.
 * Used as a direct-lookup fallback when a manga isn't in the page-1 results.
 */
export async function fetchMangaById(malId) {
  try {
    const data = await jikanFetch(`${BASE_URL}/manga/${malId}`);
    return data.data || null;
  } catch (err) {
    console.warn(`[Jikan] Direct lookup failed for manga ${malId}: ${err.message}`);
    // Try fallback data
    return FALLBACK_MANGA.find(m => m.mal_id === Number(malId)) || null;
  }
}
