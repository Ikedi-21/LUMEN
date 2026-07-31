function resolveComicDescription(item) {
  if (item.first_sentence) {
    if (typeof item.first_sentence === "string") return item.first_sentence;
    if (Array.isArray(item.first_sentence)) return item.first_sentence.join(" ");
    if (item.first_sentence.value) return item.first_sentence.value;
  }
  if (item.description) {
    if (typeof item.description === "string") return item.description;
    if (item.description.value) return item.description.value;
  }
  if (item.subject && item.subject.length > 0) {
    return `Subjects: ${item.subject.slice(0, 5).join(", ")}`;
  }
  return "";
}

export function normalizeComic(item) {
  const workId = item.key ? item.key.replace(/^\/works\//, '') : Math.random().toString(36).substring(2, 9);
  const id = `olcomic-${workId}`;

  let cover = null;
  if (item.cover_i) {
    cover = `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`;
  } else if (item.isbn && item.isbn.length > 0) {
    cover = `https://covers.openlibrary.org/b/isbn/${item.isbn[0]}-M.jpg`;
  } else if (item.edition_key && item.edition_key.length > 0) {
    cover = `https://covers.openlibrary.org/b/olid/${item.edition_key[0]}-M.jpg`;
  }

  const archiveId = item.ia && item.ia.length > 0 ? item.ia[0] : null;
  const isPublicDomain = !!item.public_scan_b;

  return {
    id,
    type: "comic",
    title: item.title || "Untitled Comic",
    cover,
    description: resolveComicDescription(item),
    rating: item.ratings_average ? Math.round(item.ratings_average * 10) / 10 : null,
    releaseDate: item.first_publish_year ? String(item.first_publish_year) : null,
    genres: item.subject ? item.subject.slice(0, 5) : [],
    creator: (item.author_name && item.author_name.join(", ")) || null,
    source: "api",
    archiveId,
    isPublicDomain
  };
}

export function normalizeComicPage(response) {
  const docs = response.docs || [];
  return {
    items: docs.map(normalizeComic),
    hasMore: docs.length >= 20,
  };
}
