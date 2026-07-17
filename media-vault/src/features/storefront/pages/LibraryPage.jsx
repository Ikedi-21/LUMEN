import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { getUserPurchases, removePurchase } from "@/services/purchases";
import { Play, BookOpen, Trash2 } from "lucide-react";
import { useToast } from "@/shared/ui";
import { EmptyState } from "@/shared/ui";
import "./LibraryPage.css";

export default function LibraryPage() {
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadLibrary();
    }
  }, [user]);

  async function loadLibrary() {
    setLoading(true);
    try {
      const data = await getUserPurchases(user.id);
      setPurchases(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(e, productId, title) {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      `Are you sure you want to permanently remove "${title}" from your Library?\nThis action cannot be undone and will not refund your coins.`
    );
    if (!confirmed) return;

    try {
      await removePurchase(user.id, productId);
      setPurchases((prev) => prev.filter((p) => p.product_id !== productId));
      addToast(`"${title}" removed from library`, "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to remove item from library", "error");
    }
  }

  if (authLoading) return <div className="library-loading">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="library-page">
      <header className="library-header">
        <h1>My Library</h1>
        <p>Access and manage all your purchased movies, books, and comics.</p>
      </header>

      {loading ? (
        <div className="library-loading">Loading your library...</div>
      ) : purchases.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Your library is empty"
          message="You have not unlocked any content yet. Head over to the store to discover something new."
          actionLabel="Browse Store"
          actionTo="/"
        />
      ) : (
        <div className="library-grid">
          {purchases.map((item) => {
            const isMovie = item.product_type === "movie";
            const route = isMovie ? `/watch/${item.product_id}` : `/preview/${item.product_type}/${item.product_id}`;
            return (
              <Link to={route} key={item.id} className="library-card">
                <div className="card-image-wrapper">
                  <img src={item.cover} alt={item.title} className="card-image" />
                  <div className="card-overlay">
                    {isMovie ? <Play size={48} className="overlay-icon" /> : <BookOpen size={48} className="overlay-icon" />}
                  </div>
                  <button
                    className="library-remove-btn"
                    onClick={(e) => handleRemove(e, item.product_id, item.title)}
                    title="Remove from Library"
                    aria-label="Remove from Library"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="card-info">
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-meta">Purchased on {new Date(item.purchased_at).toLocaleDateString()}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}



