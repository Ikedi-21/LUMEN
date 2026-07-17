import { useState } from "react";
import { searchMedia } from "@/services/media";
import { MediaCard, SkeletonCard } from "@/shared/ui";
import { useInView } from "@/shared/hooks/useInView";
import "./SearchPage.css";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const data = await searchMedia(query);
      setResults(data);
    } catch (err) {
      console.error("Search request failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

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

        {!loading && searched && results.length === 0 && (
          <div className="search-no-results">
            No matches found for "{query}".
          </div>
        )}

        {!loading && !searched && (
          <div className="search-no-results" style={{ opacity: 0.7 }}>
            Enter a query above to start searching the media archives.
          </div>
        )}
      </div>
    </div>
  );
}
