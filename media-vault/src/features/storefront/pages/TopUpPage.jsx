import { useState } from "react";
import { useAuth } from "@/features/auth";
import { useStorefront } from "../context";
import { addCoins } from "@/services/coins";
import { useToast } from "@/shared/ui";
import "./TopUpPage.css";

const PACKAGES = [
  { id: "bronze", title: "Bronze Pack", coins: 100, price: "$0.99", bonus: "No bonus" },
  { id: "silver", title: "Silver Pack", coins: 500, price: "$4.99", bonus: "Most popular" },
  { id: "gold", title: "Gold Pack", coins: 1000, price: "$8.99", bonus: "Best value" }
];

export default function TopUpPage() {
  const { user } = useAuth();
  const { refreshCoins } = useStorefront();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handlePurchase(pkg) {
    if (!user) {
      addToast("You must be logged in to purchase coins.", "error");
      return;
    }

    setLoading(true);
    try {
      // Simulate fake checkout process
      await new Promise(resolve => setTimeout(resolve, 1000));
      await addCoins(user.id, pkg.coins);
      await refreshCoins();
      addToast(`Successfully purchased ${pkg.coins} coins!`, "success");
    } catch (err) {
      console.error(err);
      addToast("Purchase failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="topup-page">
      <div className="topup-header">
        <h1>Coin Store</h1>
        <p>Purchase coins to instantly unlock premium movies, books, and comics.</p>
      </div>

      <div className="topup-packages">
        {PACKAGES.map((pkg) => (
          <div key={pkg.id} className="topup-card">
            <div className="topup-card-header">
              <h3>{pkg.title}</h3>
              <span className="topup-bonus">{pkg.bonus}</span>
            </div>
            <div className="topup-card-coins">
              <span className="coins-amount">{pkg.coins}</span>
              <span className="coins-label">Coins</span>
            </div>
            <div className="topup-card-price">{pkg.price}</div>
            <button 
              className="btn-primary btn-purchase"
              onClick={() => handlePurchase(pkg)}
              disabled={loading}
            >
              {loading ? "Processing..." : `Buy for ${pkg.price}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
