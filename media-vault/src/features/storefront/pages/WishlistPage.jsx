import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { getWishlistItems, removeFromWishlist } from "@/services/wishlist";
import { getMediaById } from "@/services/media";
import { useStorefront } from "../context";
import { MediaCard } from "@/shared/ui";
import { useToast } from "@/shared/ui";
import { EmptyState } from "@/shared/ui";
import { Heart } from "lucide-react";
import "./WishlistPage.css";

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { refreshWishlist } = useStorefront();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login", {
        replace: true,
        state: {
          message: "Log in to view and manage your wishlist.",
          from: "/wishlist",
        },
      });
      return;
    }

    async function loadWishlistData() {
      setLoading(true);
      setError(null);
      try {
        const rows = await getWishlistItems(user.id);
        
        // Fetch detailed product info for each wishlist row in parallel
        const enriched = await Promise.all(
          rows.map(async (row) => {
            try {
              const product = await getMediaById(row.product_type, row.product_id);
              return { ...row, product };
            } catch (err) {
              console.error(`Failed to load product details for ${row.product_id}:`, err);
              return { ...row, product: null };
            }
          })
        );

        // Filter out null/invalid products if any
        setWishlistItems(enriched.filter((item) => item.product !== null));
      } catch (err) {
        console.error("Error loading wishlist:", err);
        setError("Failed to load your wishlist. Please check your internet connection.");
      } finally {
        setLoading(false);
      }
    }

    loadWishlistData();
  }, [user, authLoading, navigate]);

  async function handleRemove(productId) {
    try {
      await removeFromWishlist(user.id, productId);
      setWishlistItems((prev) => prev.filter((item) => item.product_id !== productId));
      await refreshWishlist();
      addToast("Removed from wishlist", "info");
    } catch (err) {
      console.error("Error removing item from wishlist:", err);
      addToast("Failed to remove item", "error");
    }
  }

  if (authLoading || loading) {
    return (
      <div className="wishlist-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-page">
        <h1 className="wishlist-title">My Wishlist</h1>
        <div className="wishlist-empty" style={{ borderColor: "rgba(229, 72, 77, 0.3)" }}>
          <p style={{ color: "var(--danger)", marginBottom: "var(--space-4)" }}>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-start-shopping" style={{ border: "none", cursor: "pointer" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1 className="wishlist-title">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          message="Save movies, books, manga, or comics you want to come back to later."
          actionLabel="Start Discovering"
          actionTo="/"
        />
      ) : (
        <div className="wishlist-grid-container">
          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <div key={item.product_id} className="wishlist-item-wrapper">
                <button 
                  className="btn-remove-wishlist" 
                  onClick={() => handleRemove(item.product_id)} 
                  title="Remove from wishlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <MediaCard item={item.product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



