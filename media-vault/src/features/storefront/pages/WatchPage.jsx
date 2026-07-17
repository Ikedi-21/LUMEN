import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { hasPurchased } from "@/services/purchases";
import { fetchMovieTrailer } from "@/services/media/clients/tmdb";
import { ArrowLeft } from "lucide-react";
import "./WatchPage.css";

export default function WatchPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [error, setError] = useState(null);

  // The route param `id` comes from ProductDetailPage which links to
  // /watch/${item.id}  — item.id is the prefixed form like "tmdb-12345".
  // hasPurchased needs the prefixed id (that's what we store in purchases).
  // TMDB's /movie/{id}/videos endpoint needs the raw numeric id.
  const purchaseId = id;                          // "tmdb-12345" or just "12345"
  const tmdbId = id.replace(/^tmdb-/, "");        // always "12345"

  useEffect(() => {
    if (user && id) {
      checkAccessAndLoad();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, id, authLoading]);

  async function checkAccessAndLoad() {
    setLoading(true);
    try {
      const isOwned = await hasPurchased(user.id, purchaseId);
      setPurchased(isOwned);

      if (isOwned) {
        const trailer = await fetchMovieTrailer(tmdbId);
        if (trailer?.key) {
          setTrailerKey(trailer.key);
        }
      }
    } catch (err) {
      console.error("WatchPage error:", err);
      setError("Failed to verify access or load content.");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) return <div className="watch-message">Loading player...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!purchased && !error) return <Navigate to={`/product/movie/tmdb-${tmdbId}`} replace />;

  return (
    <div className="watch-page">
      <header className="watch-header">
        <Link to={`/product/movie/tmdb-${tmdbId}`} className="back-link">
          <ArrowLeft size={20} />
          Back to details
        </Link>
      </header>

      <main className="player-container">
        {error ? (
          <div className="watch-message error">{error}</div>
        ) : trailerKey ? (
          <div className="video-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="watch-message">
            <h2>No trailer available for this title.</h2>
            <p>The content provider has not made a trailer available for embedding.</p>
          </div>
        )}
      </main>
    </div>
  );
}
