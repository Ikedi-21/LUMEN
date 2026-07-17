/**
 * Normalizes a raw Open Library search document object into the app's MediaItem shape.
 * Pure data mapper — pricing applied post-normalization in media.service.js.
 */

/**
 * Open Library returns description/first_sentence in inconsistent shapes:
 *   - a plain string
 *   - an object like { type: "/type/text", value: "..." }
 *   - an array of strings
 * This helper normalizes all cases into a single string.
 */
function resolveBookDescription(item) {
  // Try first_sentence first (from search results)
  if (item.first_sentence) {
    if (typeof item.first_sentence === "string") return item.first_sentence;
    if (Array.isArray(item.first_sentence)) return item.first_sentence.join(" ");
    if (item.first_sentence.value) return item.first_sentence.value;
  }
  // Try description (from works endpoint)
  if (item.description) {
    if (typeof item.description === "string") return item.description;
    if (item.description.value) return item.description.value;
  }
  // Fallback to subject list
  if (item.subject && item.subject.length > 0) {
    return `Subjects: ${item.subject.slice(0, 5).join(", ")}`;
  }
  return "";
}
export function normalizeBook(item) {
  // item.key is typically in the form "/works/OL12345W"
  const workId = item.key ? item.key.replace(/^\/works\//, '') : Math.random().toString(36).substring(2, 9);
  const id = `openlib-${workId}`;

  // Resolve cover image from Covers API prioritizing cover_i, then isbn, then olid (edition_key)
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
    type: "book",
    title: item.title || "Untitled Book",
    cover,
    description: resolveBookDescription(item),
    rating: item.ratings_average ? Math.round(item.ratings_average * 10) / 10 : null,
    releaseDate: item.first_publish_year ? String(item.first_publish_year) : null,
    genres: item.subject ? item.subject.slice(0, 5) : [],
    creator: (item.author_name && item.author_name.join(", ")) || null,
    source: "api",
    archiveId,
    isPublicDomain
  };
}
