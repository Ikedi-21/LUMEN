import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { hasPurchased } from "@/services/purchases";
import { getMediaById } from "@/services/media";
import { ArrowLeft } from "lucide-react";
import "./PreviewPage.css";

export default function PreviewPage() {
  const { type, id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [showReader, setShowReader] = useState(false);

  useEffect(() => {
    if (user && id && type) {
      checkAccessAndLoad();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, id, type, authLoading]);

  async function checkAccessAndLoad() {
    setLoading(true);
    try {
      const isOwned = await hasPurchased(user.id, id);
      setPurchased(isOwned);
      
      if (isOwned) {
        const product = await getMediaById(type, id);
        if (product) {
          setItem(product);
        } else {
          setError("Item details could not be found.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to verify access or load content.");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) return <div className="preview-message">Loading content...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!purchased && !error) return <Navigate to={`/product/${type}/${id}`} replace />;

  if (error || !item) {
    return (
      <div className="preview-page error-page">
        <div className="preview-message error">{error || "Could not load content."}</div>
        <Link to={`/product/${type}/${id}`} className="back-link">Back to details</Link>
      </div>
    );
  }

  return (
    <div className="preview-page">
      <header className="preview-header">
        <Link to={`/product/${type}/${id}`} className="back-link">
          <ArrowLeft size={20} />
          Exit Reader
        </Link>
      </header>

      <main className="reader-container">
        {showReader && item.archiveId ? (
          <div className="full-reader-container">
            <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.5rem", color: "#fff", margin: 0 }}>{item.title}</h2>
              <button onClick={() => setShowReader(false)} className="btn-back-info">
                Back to Details
              </button>
            </div>
            <iframe
              src={`https://archive.org/embed/${item.archiveId}`}
              width="100%"
              height="750px"
              style={{ border: "none", borderRadius: "8px", backgroundColor: "#000" }}
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
              allowFullScreen
            />
          </div>
        ) : (
          <>
            <div className="reader-cover-wrapper">
               <img src={item.cover} alt={item.title} className="reader-cover" />
            </div>
            <div className="reader-content">
              <h1 className="reader-title">{item.title}</h1>
              {item.creator && <p className="reader-creator">By {item.creator}</p>}
              
              {item.genres && item.genres.length > 0 && (
                <div className="reader-genres">
                  {item.genres.map((g) => (
                    <span key={g} className="reader-genre-badge">{g}</span>
                  ))}
                </div>
              )}

              <div className="reader-divider" />
              
              <div className="reader-text">
                {item.description || "No full description available for this title."}
              </div>

              {type === "book" && item.isPublicDomain && item.archiveId && (
                <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
                  <button onClick={() => setShowReader(true)} className="btn-read-full">
                    Read Full Book
                  </button>
                </div>
              )}

              <div className="reader-footer-note">
                {type === "book" ? (
                  item.isPublicDomain && item.archiveId ? (
                    <p>Public Domain Title — Full book access available via Internet Archive.</p>
                  ) : (
                    <p>Full text unavailable — this title is not in the public domain.</p>
                  )
                ) : (
                  <p>Preview copy — full text unavailable due to publisher copyright restrictions.</p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
