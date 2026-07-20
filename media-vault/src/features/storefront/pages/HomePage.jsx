import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getMediaByType } from "@/services/media";
import { HeroBanner, MediaRail, ContinueRail } from "@/shared/ui";

const SECTIONS = [
  { type: "movie", title: "Movies" },
  { type: "book", title: "Books" },
  { type: "manga", title: "Manga" },
  { type: "comic", title: "Comics" },
];

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const sectionFilter = searchParams.get("section") || "all";

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    async function loadAll() {
      const results = [];

      const movieResult = await getMediaByType("movie")
        .then((items) => ["movie", items.slice(0, 10)])
        .catch((err) => { console.error("Failed to load movie:", err); return ["movie", []]; });
      results.push(movieResult);

      const bookResult = await getMediaByType("book")
        .then((items) => ["book", items.slice(0, 10)])
        .catch((err) => { console.error("Failed to load book:", err); return ["book", []]; });
      results.push(bookResult);

      const mangaResult = await getMediaByType("manga")
        .then((items) => ["manga", items.slice(0, 10)])
        .catch((err) => { console.error("Failed to load manga:", err); return ["manga", []]; });
      results.push(mangaResult);

      const comicResult = await getMediaByType("comic")
        .then((items) => ["comic", items.slice(0, 10)])
        .catch((err) => { console.error("Failed to load comic:", err); return ["comic", []]; });
      results.push(comicResult);

      const dataMap = Object.fromEntries(results);
      setData(dataMap);

      const movies = (dataMap.movie || []).filter((m) => m.cover || m.backdrop);
      const manga = (dataMap.manga || []).filter((m) => m.cover);
      const books = (dataMap.book || []).filter((m) => m.cover);

      const picks = [
        ...movies.slice(0, 3),
        ...(manga.length > 0 ? [manga[0]] : []),
        ...(books.length > 0 ? [books[0]] : []),
      ].slice(0, 5);

      if (picks.length < 5) {
        const remaining = movies.slice(3);
        for (const m of remaining) {
          if (picks.length >= 5) break;
          if (!picks.find((p) => p.id === m.id)) picks.push(m);
        }
      }

      setFeaturedItems(picks);
      setLoading(false);
    }

    loadAll();
  }, []);

  // Filter sections to show
  const filteredSections = SECTIONS.filter(
    (s) => sectionFilter === "all" || s.type === sectionFilter
  );

  // Filter featured items to match the current section if not 'all'
  const displayFeatured = featuredItems.filter(
    (item) => sectionFilter === "all" || item.type === sectionFilter
  );

  return (
    <div>
      {loading ? (
        <div
          className="hero-banner-placeholder"
          style={{
            height: "480px",
            backgroundColor: "var(--surface)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="skeleton-shimmer" />
        </div>
      ) : displayFeatured.length > 0 ? (
        <HeroBanner items={displayFeatured} />
      ) : null}
      
      {sectionFilter === "all" && <ContinueRail />}
      
      {filteredSections.map((s) => (
        <MediaRail key={s.type} title={s.title} items={data[s.type] || []} loading={loading} />
      ))}
    </div>
  );
}
