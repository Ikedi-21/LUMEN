import { readCache, writeCache } from "@/shared/lib/cache";

const URL = "https://graphql.anilist.co";
const CACHE_KEY_PREFIX = "anilist_manga_";

const MANGA_QUERY = `
  query ($page: Int, $perPage: Int, $search: String, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      media(type: MANGA, search: $search, sort: $sort) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        description
        averageScore
        startDate {
          year
          month
          day
        }
        genres
        staff {
          edges {
            node {
              name {
                full
              }
            }
          }
        }
      }
    }
  }
`;

export async function fetchTopManga(page = 1) {
  const cacheKey = `${CACHE_KEY_PREFIX}top_p${page}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      query: MANGA_QUERY,
      variables: {
        page,
        perPage: 20,
        sort: ["POPULARITY_DESC"],
      },
    }),
  });

  if (!res.ok) throw new Error(`AniList request failed (${res.status})`);

  const data = await res.json();
  const result = {
    items: data.data?.Page?.media || [],
    page,
  };

  writeCache(cacheKey, result);
  return result;
}

export async function searchManga(query, page = 1) {
  const cacheKey = `${CACHE_KEY_PREFIX}search_${query}_p${page}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      query: MANGA_QUERY,
      variables: {
        search: query,
        page,
        perPage: 20,
      },
    }),
  });

  if (!res.ok) throw new Error(`AniList request failed (${res.status})`);

  const data = await res.json();
  const result = {
    items: data.data?.Page?.media || [],
    page,
  };

  writeCache(cacheKey, result);
  return result;
}

const MANGA_BY_ID_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: MANGA) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
      }
      description
      averageScore
      startDate {
        year
        month
        day
      }
      genres
      staff {
        edges {
          node {
            name {
              full
            }
          }
        }
      }
    }
  }
`;

export async function fetchMangaById(id) {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      query: MANGA_BY_ID_QUERY,
      variables: { id: parseInt(id, 10) },
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data?.Media || null;
}
