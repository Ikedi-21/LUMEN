import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { getMediaByType } from "@/services/media";
import { useAuth } from "@/features/auth";
import { addToCart } from "@/services/cart";
import { getWishlistItems, addToWishlist, removeFromWishlist } from "@/services/wishlist";
import { hasPurchased, createPurchase } from "@/services/purchases";
import { spendCoins } from "@/services/coins";
import { useStorefront } from "../context";
import { MediaRail, useToast } from "@/shared/ui";
import "./ProductDetailPage.css";

export default function ProductDetailPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { coins, refreshCoins, refreshCart, refreshWishlist } = useStorefront();

  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [cartButtonText, setCartButtonText] = useState("Add to cart");

  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      try {
        // Fetch all items of this type once — avoids the double-call that
        // getMediaById(type,id) + getMediaByType(type) would cause,
        // since getMediaById internally calls getMediaByType already.
        const allItems = await getMediaByType(type);
        const product = allItems.find((i) => i.id === id) || null;
        setItem(product);

        if (product) {
          setRelated(allItems.filter((i) => i.id !== id).slice(0, 10));

          // If user is logged in, check wishlist state and purchase state
          if (user) {
            const wishlist = await getWishlistItems(user.id);
            setIsInWishlist(wishlist.some((w) => w.product_id === id));
            
            const owned = await hasPurchased(user.id, id);
            setIsPurchased(owned);
          }
        }
      } catch (err) {
        console.error("Error loading product detail page:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProductData();
  }, [type, id, user]);

  async function handleAddToCart() {
    if (!user) {
      navigate("/login", {
        state: {
          message: "Log in to add items to your cart",
          from: location.pathname,
        },
      });
      return;
    }

    try {
      setCartButtonText("Adding...");
      await addToCart(user.id, item.id, item.type);
      await refreshCart();
      setCartButtonText("Added!");
      addToast("Added to cart", "success");
      setTimeout(() => {
        setCartButtonText("Add to cart");
      }, 1500);
    } catch (err) {
      console.error(err);
      setCartButtonText("Add to cart");
      addToast("Failed to add to cart", "error");
    }
  }

  async function handleToggleWishlist() {
    if (!user) {
      navigate("/login", {
        state: {
          message: "Log in to add items to your wishlist",
          from: location.pathname,
        },
      });
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(user.id, item.id);
        setIsInWishlist(false);
        await refreshWishlist();
        addToast("Removed from wishlist", "info");
      } else {
        await addToWishlist(user.id, item.id, item.type);
        setIsInWishlist(true);
        await refreshWishlist();
        addToast("Added to wishlist!", "success");
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to update wishlist", "error");
    }
  }

  async function handlePurchase() {
    if (!user) return;
    setPurchaseLoading(true);
    try {
      const coinPrice = 1;
      await spendCoins(user.id, coinPrice);
      await createPurchase(user.id, item, coinPrice);
      await refreshCoins();
      setIsPurchased(true);
      // We still toast briefly, but navigate immediately
      navigate("/receipt", {
        state: {
          items: [{
            id: item.id,
            type: item.type,
            title: item.title,
            cover: item.cover
          }]
        }
      });
    } catch (err) {
      console.error(err);
      addToast(err.message === "Insufficient coins" ? "Not enough coins." : "Failed to process purchase.", "error");
    } finally {
      setPurchaseLoading(false);
    }
  }

  // removed inline handleTopUp in favor of a direct Link

  if (loading) {
    return (
      <div className="product-detail-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <p>Loading details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="product-detail-page product-detail-notfound">
        <h1>Item Not Found</h1>
        <p>We couldn't find the product you were looking for.</p>
        <Link to="/" className="btn-back-home">Back to Storefront</Link>
      </div>
    );
  }

  const formattedPrice = item.price ? `₦${(item.price / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "Free";
  const displayType = item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : "";

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-detail-image-wrapper">
          {item.cover ? (
            <img src={item.cover} alt={item.title} />
          ) : (
            <div style={{ height: "450px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
              No Cover Art Available
            </div>
          )}
        </div>

        <div className="product-detail-content">
          {displayType && <span className="product-detail-type">{displayType}</span>}
          <h1 className="product-detail-title">{item.title}</h1>
          {item.creator && <p className="product-detail-creator">By {item.creator}</p>}

          <div className="product-detail-meta">
            {item.rating && <span className="product-detail-rating">★ {Number(item.rating).toFixed(1)}</span>}
            {item.releaseDate && <span className="product-detail-year">{item.releaseDate.substring(0, 4)}</span>}
            {item.genres && item.genres.length > 0 && (
              <div className="product-detail-genres">
                {item.genres.map((g) => (
                  <span key={g} className="product-detail-genre-badge">{g}</span>
                ))}
              </div>
            )}
          </div>

          <div className="product-detail-divider" />

          {item.description && (
            <>
              <p className="product-detail-description">{item.description}</p>
              <div className="product-detail-divider" />
            </>
          )}

          <div className="product-detail-price">{formattedPrice}</div>

          <div className="product-detail-actions">
            {isPurchased ? (
              <Link 
                to={item.type === "movie" ? `/watch/${item.id}` : `/preview/${item.type}/${item.id}`} 
                className="btn-primary"
              >
                {item.type === "movie" ? "Watch Trailer" : "View Preview"}
              </Link>
            ) : !user ? (
              <Link to="/login" className="btn-primary" state={{ message: "Log in to purchase", from: location.pathname }}>
                Log in to purchase
              </Link>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <button 
                  className="btn-primary" 
                  onClick={handlePurchase} 
                  disabled={purchaseLoading || coins < 1}
                >
                  {purchaseLoading ? "Processing..." : `Unlock for 1 coin`}
                </button>
                {coins < 1 && (
                  <p style={{ fontSize: "0.85rem", color: "var(--danger)" }}>
                    Not enough coins. <Link to="/top-up" style={{ color: "var(--accent-primary)", textDecoration: "underline" }}>Get more coins</Link>
                  </p>
                )}
              </div>
            )}

            <button className="btn-add-cart" onClick={handleAddToCart} disabled={cartButtonText === "Adding..."}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartButtonText}
            </button>

            <button 
              className={`btn-wishlist ${isInWishlist ? "active" : ""}`} 
              onClick={handleToggleWishlist}
              title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill={isInWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {related.length > 0 && (
        <MediaRail title={`More ${displayType}s`} items={related} />
      )}
    </div>
  );
}
