import { useState, useRef, useCallback } from "react";
import { searchMediaPage } from "@/services/media";
import { MediaCard, SkeletonCard } from "@/shared/ui";
import { useInView } from "@/shared/hooks/useInView";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import "./SearchPage.css";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeQuery, setActiveQuery] = useState("");

  const pageRef = useRef(1);
  const fetchingRef = useRef(false);
  const sentinelRef = useRef(null);

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const q = query.trim();
    setActiveQuery(q);
    setLoading(true);
    setSearched(true);
    setResults([]);
    setHasMore(false);
    pageRef.current = 1;

    try {
      const data = await searchMediaPage(q, 1);
      setResults(data.items);
      setHasMore(data.hasMore);
      pageRef.current = data.hasMore ? 2 : 1;
    } catch (err) {
      console.error("Search request failed:", err);
      setResults([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const loadMore = useCallback(async () => {
    if (fetchingRef.current || !hasMore || loading) return;
    fetchingRef.current = true;
    setIsFetchingMore(true);

    try {
      const nextPage = pageRef.current;
      const data = await searchMediaPage(activeQuery, nextPage);
      setResults((prev) => [...prev, ...data.items]);
      setHasMore(data.hasMore);
      pageRef.current = data.hasMore ? nextPage + 1 : nextPage;
    } catch (err) {
      console.error("Search pagination failed:", err);
      setHasMore(false);
    } finally {
      setIsFetchingMore(false);
      fetchingRef.current = false;
    }
  }, [activeQuery, hasMore, loading]);

  useInfiniteScroll(sentinelRef, loadMore, hasMore && !loading && searched);

  return (
    <div className="search-page">
      <h1 className="search-title">Search Vault</h1>

      <div className="search-form-wrapper">
        <form onSubmit={handleSearch} className="search-input-container">
          <input
            type="text"
            placeholder="Search movies, books, manga, comics, creators..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn-search-submit" disabled={loading}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </button>
        </form>
      </div>

      <div 
        ref={ref} 
        className={`search-results-grid ${loading ? "" : `scroll-reveal ${inView ? "in-view" : ""}`}`}
      >
        {loading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))
        ) : (
          results.map((item, idx) => (
            <MediaCard key={item.id} item={item} index={idx} />
          ))
        )}

        {/* Loading-more skeletons */}
        {isFetchingMore && !loading && (
          Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonCard key={`more-${idx}`} />
          ))
        )}

        {!loading && searched && results.length === 0 && (
          <div className="search-no-results">
            No matches found for &quot;{activeQuery}&quot;.
          </div>
        )}

        {!loading && !searched && (
          <div className="search-no-results" style={{ opacity: 0.7 }}>
            Enter a query above to start searching the media archives.
          </div>
        )}
      </div>

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="infinite-scroll-sentinel" />

      {/* End-of-results indicator */}
      {!loading && !hasMore && searched && results.length > 0 && (
        <p className="search-end-message">You&apos;ve reached the end — {results.length} result{results.length !== 1 ? "s" : ""} total.</p>
      )}
    </div>
  );
}
