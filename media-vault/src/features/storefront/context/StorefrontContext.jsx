import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/features/auth";
import { getCartItems } from "@/services/cart";
import { getWishlistItems } from "@/services/wishlist";
import { getUserCoins } from "@/services/coins";

const StorefrontContext = createContext();

export function StorefrontProvider({ children }) {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [coins, setCoins] = useState(0);

  const refreshCart = useCallback(async () => {
    if (!user) return setCartCount(0);
    try {
      const items = await getCartItems(user.id);
      const total = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
      setCartCount(total);
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const refreshWishlist = useCallback(async () => {
    if (!user) return setWishlistCount(0);
    try {
      const items = await getWishlistItems(user.id);
      setWishlistCount(items.length);
    } catch (e) {
      console.error(e);
    }
  }, [user]);
  
  const refreshCoins = useCallback(async () => {
    if (!user) return setCoins(0);
    try {
      const amount = await getUserCoins(user.id);
      setCoins(amount);
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshCart();
      refreshWishlist();
      refreshCoins();
    } else {
      setCartCount(0);
      setWishlistCount(0);
      setCoins(0);
    }
  }, [user, refreshCart, refreshWishlist, refreshCoins]);

  const value = {
    cartCount,
    wishlistCount,
    coins,
    refreshCart,
    refreshWishlist,
    refreshCoins
  };

  return <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>;
}

export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error("useStorefront must be used within a StorefrontProvider");
  }
  return context;
}
