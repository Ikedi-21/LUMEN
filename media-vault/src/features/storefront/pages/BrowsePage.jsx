import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMediaFetch } from "../hooks/useMediaFetch";
import { MediaCard, SkeletonCard } from "@/shared/ui";
import { useInView } from "@/shared/hooks/useInView";
import "./BrowsePage.css";

export default function BrowsePage() {
  const { type } = useParams();
  const { items, loading } = useMediaFetch(type);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  // Reset filters when the media type changes
  useEffect(() => {
    setQuery("");
    setGenre("all");
  }, [type]);

  const allGenres = Array.from(
    new Set(items.flatMap((i) => i.genres || []))
  );

  const filtered = items.filter((item) => {
    const matchesQuery = item.title?.toLowerCase().includes(query.toLowerCase());
    const matchesGenre = genre === "all" || (item.genres || []).includes(genre);
    return matchesQuery && matchesGenre;
  });

  const handleGenreToggle = (g) => {
    if (genre === g) {
      setGenre("all");
    } else {
      setGenre(g);
    }
  };

  return (
    <div className="browse-page">
      <h1 className="browse-title">{type.charAt(0).toUpperCase() + type.slice(1)}s</h1>

      <div className="browse-controls">
        <input
          type="text"
          placeholder={`Search ${type}s...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        {allGenres.length > 0 && (
          <div className="filter-chips">
            <button
              className={`filter-chip ${genre === "all" ? "active" : ""}`}
              onClick={() => setGenre("all")}
            >
              All Genres
            </button>
            {allGenres.map((g) => (
              <button
                key={g}
                className={`filter-chip ${genre === g ? "active" : ""}`}
                onClick={() => handleGenreToggle(g)}
              >
                {g}
              </button>
            ))}
          </div>
        )}
      </div>

      <div 
        ref={ref} 
        className={`browse-grid ${loading ? "" : `scroll-reveal ${inView ? "in-view" : ""}`}`}
      >
        {loading ? (
          Array.from({ length: 12 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))
        ) : (
          filtered.map((item, idx) => (
            <MediaCard key={item.id} item={item} index={idx} />
          ))
        )}
        {!loading && filtered.length === 0 && (
          <p style={{ gridColumn: "1 / -1", color: "var(--text-secondary)", textAlign: "center", padding: "40px 0" }}>
            No results found.
          </p>
        )}
      </div>
    </div>
  );
}
