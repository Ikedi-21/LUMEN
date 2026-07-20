import { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useMediaFetch } from "../hooks/useMediaFetch";
import { MediaCard, SkeletonCard } from "@/shared/ui";
import { useInView } from "@/shared/hooks/useInView";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import "./BrowsePage.css";

const SKELETON_COUNT = 12;
const FETCH_MORE_SKELETONS = 4;

export default function BrowsePage() {
  const { type } = useParams();
  const { items, loading, isFetchingMore, hasMore, loadMore } = useMediaFetch(type);
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const genre = searchParams.get("genre") || "all";
  const year = searchParams.get("year") || "all";
  const rating = searchParams.get("rating") || "all";

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const sentinelRef = useRef(null);

  // Reset genre when the media type changes (genres are type-specific),
  // but preserve search, year, and rating filters across type changes.
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("genre");
    setSearchParams(newParams, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const hasActiveFilters = query || genre !== "all" || year !== "all" || rating !== "all";

  const allGenres = Array.from(
    new Set(items.flatMap((i) => i.genres || []))
  );

  const allYears = Array.from(
    new Set(items.map((i) => i.releaseDate ? i.releaseDate.substring(0, 4) : null).filter(Boolean))
  ).sort().slice(-8).reverse(); // take last 8 years

  const filtered = items.filter((item) => {
    const matchesQuery = item.title?.toLowerCase().includes(query.toLowerCase());
    const matchesGenre = genre === "all" || (item.genres || []).includes(genre);
    
    const itemYear = item.releaseDate ? item.releaseDate.substring(0, 4) : "";
    const matchesYear = year === "all" || itemYear === year;

    let matchesRating = true;
    if (rating !== "all") {
      const minRating = Number(rating);
      if (!item.rating) {
        matchesRating = false;
      } else {
        const maxScale = item.type === "book" ? 5 : 10;
        const normalizedRating = maxScale === 5 ? item.rating : item.rating / 2;
        matchesRating = normalizedRating >= minRating;
      }
    }

    return matchesQuery && matchesGenre && matchesYear && matchesRating;
  });

  const updateSearchParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "all" || value === "") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleGenreToggle = (g) => {
    updateSearchParam("genre", genre === g ? "all" : g);
  };

  const handleYearToggle = (y) => {
    updateSearchParam("year", year === y ? "all" : y);
  };

  const handleRatingToggle = (r) => {
    updateSearchParam("rating", rating === r ? "all" : r);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  // Infinite scroll: load more when sentinel is visible
  useInfiniteScroll(sentinelRef, loadMore, hasMore && !loading);

  return (
    <div className="browse-page">
      <h1 className="browse-title">{type.charAt(0).toUpperCase() + type.slice(1)}s</h1>

      <div className="browse-controls">
        <input
          type="text"
          placeholder={`Search ${type}s...`}
          value={query}
          onChange={(e) => updateSearchParam("q", e.target.value)}
        />
        
        {allGenres.length > 0 && (
          <div className="filter-group">
            <span className="filter-group-label">Genres:</span>
            <div className="filter-chips">
              <button
                className={`filter-chip ${genre === "all" ? "active" : ""}`}
                onClick={() => handleGenreToggle("all")}
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
          </div>
        )}

        {allYears.length > 0 && (
          <div className="filter-group">
            <span className="filter-group-label">Release Year:</span>
            <div className="filter-chips">
              <button
                className={`filter-chip ${year === "all" ? "active" : ""}`}
                onClick={() => handleYearToggle("all")}
              >
                All Years
              </button>
              {allYears.map((y) => (
                <button
                  key={y}
                  className={`filter-chip ${year === y ? "active" : ""}`}
                  onClick={() => handleYearToggle(y)}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="filter-group">
          <span className="filter-group-label">Minimum Rating:</span>
          <div className="filter-chips">
            <button
              className={`filter-chip ${rating === "all" ? "active" : ""}`}
              onClick={() => handleRatingToggle("all")}
            >
              All Ratings
            </button>
            {[4, 3, 2].map((r) => (
              <button
                key={r}
                className={`filter-chip ${rating === String(r) ? "active" : ""}`}
                onClick={() => handleRatingToggle(String(r))}
              >
                ★ {r}+
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <button className="filter-clear-btn" onClick={handleClearFilters}>
            Clear all filters
          </button>
        )}
      </div>

      <div 
        ref={ref} 
        className={`browse-grid ${loading ? "" : `scroll-reveal ${inView ? "in-view" : ""}`}`}
      >
        {loading ? (
          Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))
        ) : (
          filtered.map((item, idx) => (
            <MediaCard key={item.id} item={item} index={idx} />
          ))
        )}

        {/* Loading-more skeletons appended after existing cards */}
        {isFetchingMore && !loading && (
          Array.from({ length: FETCH_MORE_SKELETONS }).map((_, idx) => (
            <SkeletonCard key={`more-${idx}`} />
          ))
        )}

        {!loading && filtered.length === 0 && (
          <p style={{ gridColumn: "1 / -1", color: "var(--text-secondary)", textAlign: "center", padding: "40px 0" }}>
            No results found.
          </p>
        )}
      </div>

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="infinite-scroll-sentinel" />

      {/* End-of-results indicator */}
      {!loading && !hasMore && items.length > 0 && (
        <p className="browse-end-message">You&apos;ve reached the end — {filtered.length} result{filtered.length !== 1 ? "s" : ""} total.</p>
      )}
    </div>
  );
}
