export function normalizeManga(item) {
  const title = item.title?.english || item.title?.romaji || "Untitled Manga";
  const cover = item.coverImage?.large || null;
  
  let description = item.description || "";
  // Strip HTML tags (like <br>)
  description = description.replace(/<[^>]*>?/gm, '');

  let rating = null;
  if (item.averageScore) {
    rating = Math.round((item.averageScore / 10) * 10) / 10;
  }

  let releaseDate = null;
  if (item.startDate?.year) {
    releaseDate = `${item.startDate.year}`;
    if (item.startDate.month) {
      releaseDate += `-${String(item.startDate.month).padStart(2, '0')}`;
      if (item.startDate.day) {
        releaseDate += `-${String(item.startDate.day).padStart(2, '0')}`;
      }
    }
  }

  let creator = null;
  if (item.staff?.edges?.length > 0) {
    creator = item.staff.edges[0]?.node?.name?.full || null;
  }

  return {
    id: `anilist-${item.id}`,
    type: "manga",
    title,
    cover,
    description,
    rating,
    releaseDate,
    genres: item.genres ? item.genres.slice(0, 5) : [],
    creator,
    source: "api"
  };
}

export function normalizeMangaPage(response) {
  const items = response.items || [];
  return {
    items: items.map(normalizeManga),
    hasMore: items.length >= 20,
  };
}
