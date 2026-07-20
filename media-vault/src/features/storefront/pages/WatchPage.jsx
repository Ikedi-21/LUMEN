import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { hasPurchased, saveProgress } from "@/services/purchases";
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
    let active = true;
    if (authLoading) return;

    if (!user) {
      const timer = setTimeout(() => {
        if (active) setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    if (id) {
      hasPurchased(user.id, purchaseId)
        .then((isOwned) => {
          if (!active) return;
          setPurchased(isOwned);
          if (isOwned) {
            saveProgress(user.id, purchaseId, 45, "1h 10m left");
            return fetchMovieTrailer(tmdbId);
          }
        })
        .then((trailer) => {
          if (!active) return;
          if (trailer !== undefined) {
            if (trailer?.key) {
              setTrailerKey(trailer.key);
            }
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("WatchPage error:", err);
          if (active) {
            setError("Failed to verify access or load content.");
            setLoading(false);
          }
        });
    }
    return () => {
      active = false;
    };
  }, [user, id, authLoading, purchaseId, tmdbId]);

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
