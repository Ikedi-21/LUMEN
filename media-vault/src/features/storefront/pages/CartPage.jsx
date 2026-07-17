import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { getCartItems, removeFromCart } from "@/services/cart";
import { getMediaById } from "@/services/media";
import { hasPurchased, createPurchase } from "@/services/purchases";
import { spendCoins } from "@/services/coins";
import { useStorefront } from "../context";
import { useToast } from "@/shared/ui";
import { EmptyState } from "@/shared/ui";
import { ShoppingCart } from "lucide-react";
import "./CartPage.css";

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { cartCount, coins, refreshCart, refreshCoins } = useStorefront();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login", {
        replace: true,
        state: {
          message: "Log in to view and manage your shopping cart.",
          from: "/cart",
        },
      });
      return;
    }

    async function loadCartData() {
      setLoading(true);
      setError(null);
      try {
        const rows = await getCartItems(user.id);
        
        // Fetch detailed product info for each cart row in parallel
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
        setCartItems(enriched.filter((item) => item.product !== null));
      } catch (err) {
        console.error("Error loading cart:", err);
        setError("Failed to load your cart data. Please check your internet connection.");
      } finally {
        setLoading(false);
      }
    }

    loadCartData();
  }, [user, authLoading]);

  function handleTopUp() {
    navigate("/top-up");
  }

  async function handleRemove(productId) {
    try {
      await removeFromCart(user.id, productId);
      setCartItems((prev) => prev.filter((item) => item.product_id !== productId));
      await refreshCart();
      addToast("Removed from cart", "info");
    } catch (err) {
      console.error("Error removing item from cart:", err);
      addToast("Failed to remove item", "error");
    }
  }

  if (authLoading || loading) {
    return (
      <div className="cart-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page">
        <h1 className="cart-title">Your Shopping Cart</h1>
        <div className="cart-empty" style={{ borderColor: "rgba(229, 72, 77, 0.3)" }}>
          <p style={{ color: "var(--danger)", marginBottom: "var(--space-4)" }}>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-start-shopping" style={{ border: "none", cursor: "pointer" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  async function handleCheckout() {
    if (!user) return;
    
    if (coins < cartItems.length) {
      addToast("You don't have enough coins.", "error");
      return;
    }

    setCheckoutLoading(true);
    try {
      const itemsToBuy = [];
      const alreadyOwnedIds = [];

      for (const item of cartItems) {
        const owned = await hasPurchased(user.id, item.product_id);
        if (owned) {
          alreadyOwnedIds.push(item.product_id);
        } else {
          itemsToBuy.push(item);
        }
      }

      for (const id of alreadyOwnedIds) {
        await removeFromCart(user.id, id);
      }

      if (itemsToBuy.length > 0) {
        await spendCoins(user.id, itemsToBuy.length);

        for (const item of itemsToBuy) {
          await createPurchase(user.id, item.product, 1);
          await removeFromCart(user.id, item.product_id);
        }
        await refreshCoins();
      }

      await refreshCart();
      
      const purchasedItems = itemsToBuy.map(item => ({
        id: item.product.id,
        type: item.product.type,
        title: item.product.title,
        cover: item.product.cover
      }));

      // No longer showing toast here since receipt acts as confirmation
      navigate("/receipt", { state: { items: purchasedItems } });
    } catch (err) {
      console.error(err);
      addToast("An error occurred during checkout. Please try again.", "error");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            message="Add movies, books, manga, or comics you want to unlock."
            actionLabel="Start Shopping"
            actionTo="/"
          />
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => {
              const itemPrice = item.product.price || 0;
              const formattedPrice = `â‚¦${(itemPrice / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              const displayType = item.product.type ? item.product.type.charAt(0).toUpperCase() + item.product.type.slice(1) : "";

              return (
                <div key={item.product_id} className="cart-item">
                  <div className="cart-item-image">
                    {item.product.cover ? (
                      <img src={item.product.cover} alt={item.product.title} />
                    ) : (
                      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "var(--text-secondary)" }}>
                        No Cover
                      </div>
                    )}
                  </div>
                  <div className="cart-item-details">
                    <h3>{item.product.title}</h3>
                    <span className="cart-item-type">{displayType}</span>
                  </div>
                  <div className="cart-item-price">1 coin</div>
                  <div className="cart-item-quantity cart-item-controls-col">
                     <span className="cart-qty-value">x1</span>
                  </div>
                  <button className="btn-remove-item" onClick={() => handleRemove(item.product_id)} title="Remove item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="cart-total-row">
              <span>Total Cost:</span>
              <span className="cart-total-value">{cartItems.length} coins</span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button 
                className="btn-checkout" 
                onClick={handleCheckout}
                disabled={checkoutLoading || coins < cartItems.length}
              >
                {checkoutLoading ? "Processing..." : `Checkout`}
              </button>
              
              {coins < cartItems.length && (
                <p style={{ fontSize: "0.85rem", color: "var(--danger)", textAlign: "center" }}>
                  You need {cartItems.length - coins} more coins. <Link to="/top-up" style={{ color: "var(--accent-primary)", textDecoration: "underline" }}>Get more coins</Link>
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}



