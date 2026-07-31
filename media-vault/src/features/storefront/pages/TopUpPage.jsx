import { useState } from "react";
import { useAuth } from "@/features/auth";
import { useStorefront } from "../context";
import { useToast } from "@/shared/ui";
import { createPendingCoinPurchase } from "@/services/coinPurchases/coinPurchases.service";
import { usePaystackPayment } from "react-paystack";
import "./TopUpPage.css";

const PACKAGES = [
  { id: "bronze", title: "Bronze Pack", coins: 100, price: 500, bonus: "Quick top-up" },
  { id: "silver", title: "Silver Pack", coins: 500, price: 2500, bonus: "Most popular" },
  { id: "gold", title: "Gold Pack", coins: 1000, price: 5000, bonus: "Best value" },
  { id: "diamond", title: "Diamond Pack", coins: 2500, price: 12500, bonus: "Huge savings" }
];

function PackageCard({ pkg, user, refreshCoins, addToast }) {
  const [loading, setLoading] = useState(false);

  const config = {
    email: user?.email || "user@example.com",
    amount: pkg.price * 100,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
  };

  const initializePayment = usePaystackPayment(config);

  async function handlePurchase() {
    if (!user) {
      addToast("You must be logged in to purchase coins.", "error");
      return;
    }

    setLoading(true);
    try {
      const purchaseId = await createPendingCoinPurchase(user.id, pkg.coins, pkg.price);
      
      const onSuccess = async (reference) => {
        try {
          addToast("Payment successful! Verifying...", "info");
          const res = await fetch("/api/verify-coin-purchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: reference.reference, purchaseId }),
          });

          const text = await res.text();
          let data;
          try {
            data = JSON.parse(text);
          } catch (e) {
            console.error("Non-JSON response:", text);
            throw new Error("Server configuration error: Are you running the serverless backend?");
          }

          if (res.ok && data.success) {
            await refreshCoins();
            addToast(`Successfully purchased ${pkg.coins} coins!`, "success");
          } else {
            throw new Error(data.error || "Verification failed");
          }
        } catch (err) {
          console.error(err);
          addToast(err.message, "error");
        } finally {
          setLoading(false);
        }
      };

      const onClose = () => {
        setLoading(false);
        addToast("Payment cancelled.", "info");
      };

      // In react-paystack v6+, initializePayment accepts an object
      initializePayment({ onSuccess, onClose });
    } catch (err) {
      console.error(err);
      addToast("Failed to initiate purchase.", "error");
      setLoading(false);
    }
  }

  return (
    <div className="topup-card">
      <div className="topup-card-header">
        <h3>{pkg.title}</h3>
        <span className="topup-bonus">{pkg.bonus}</span>
      </div>
      <div className="topup-card-coins" style={{ display: "flex", flexDirection: "column", gap: "0.25rem", margin: "1.5rem 0" }}>
        <div>
          <span className="coins-amount" style={{ fontSize: "2.2rem", display: "inline" }}>{pkg.coins}</span>
          <span style={{ color: "var(--text-secondary)", fontSize: "1.2rem", marginLeft: "0.5rem" }}>Coins</span>
        </div>
        <div style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>for</div>
        <div className="coins-price-val" style={{ color: "var(--accent-secondary)", fontSize: "2rem", fontWeight: "bold" }}>
          ₦{pkg.price.toLocaleString()}
        </div>
      </div>
      <button 
        className="btn-primary btn-purchase"
        onClick={handlePurchase}
        disabled={loading}
      >
        {loading ? "Processing..." : `Buy Package`}
      </button>
    </div>
  );
}

export default function TopUpPage() {
  const { user } = useAuth();
  const { refreshCoins, coins } = useStorefront();
  const { addToast } = useToast();

  return (
    <div className="topup-page">
      <div className="topup-header">
        <h1>Coin Store</h1>
        <p>Purchase coins to instantly unlock premium movies, books, and comics.</p>
        {user && (
          <p className="topup-balance">
            Your balance: <strong>{coins.toLocaleString()} coins</strong>
          </p>
        )}
      </div>

      <div className="topup-packages">
        {PACKAGES.map((pkg) => (
          <PackageCard 
            key={pkg.id} 
            pkg={pkg} 
            user={user} 
            refreshCoins={refreshCoins} 
            addToast={addToast} 
          />
        ))}
      </div>
    </div>
  );
}
