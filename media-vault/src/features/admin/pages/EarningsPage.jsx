import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth";
import { useToast } from "@/shared/ui";
import { getUserCoins } from "@/services/coins/coins.service";
import { createPayoutRequest, getUserPayoutRequests } from "@/services/payouts";
import "./AdminPages.css";

export default function EarningsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const { addToast } = useToast();
  
  const [coins, setCoins] = useState(0);
  const [requests, setRequests] = useState([]);
  const [requestedCoins, setRequestedCoins] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      loadEarningsData();
    }
  }, [user]);

  async function loadEarningsData() {
    setLoading(true);
    try {
      const [currentCoins, requestHistory] = await Promise.all([
        getUserCoins(user.id),
        getUserPayoutRequests(user.id),
      ]);
      setCoins(currentCoins);
      setRequests(requestHistory);
    } catch (err) {
      console.error("Failed to load earnings data:", err);
      addToast("Failed to load earnings information.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestPayout(e) {
    e.preventDefault();
    const amount = parseInt(requestedCoins, 10);

    if (isNaN(amount) || amount <= 0) {
      addToast("Please enter a valid amount of coins to request.", "error");
      return;
    }

    if (amount > coins) {
      addToast("You cannot request more coins than your current balance.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await createPayoutRequest(user.id, amount);
      addToast(`Payout request for ${amount} coins submitted successfully!`, "success");
      setRequestedCoins("");
      // Refresh the page data
      await loadEarningsData();
      await refreshProfile();
    } catch (err) {
      console.error("Payout request failed:", err);
      addToast(err.message || "Failed to submit payout request.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="earnings-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Creator Earnings</h1>
      </div>
      <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "32px", textAlign: "left" }}>
        Track your earned coins and request simulated payouts.
      </p>

      {loading ? (
        <p style={{ textAlign: "left" }}>Loading earnings information...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div className="dashboard-grid">
            <div className="dashboard-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="dashboard-card-label">Earned Balance</div>
              <div className="dashboard-card-value">{coins} Coins</div>
            </div>
            
            <div className="admin-form-container" style={{ margin: 0, maxWidth: "none" }}>
              <h2 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "1rem", textAlign: "left" }}>
                Request Payout
              </h2>
              <form onSubmit={handleRequestPayout} style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
                <div className="admin-form-field" style={{ flex: 1, minWidth: "200px" }}>
                  <label htmlFor="coins-input">Coins to Payout</label>
                  <input
                    id="coins-input"
                    type="number"
                    min="1"
                    max={coins}
                    value={requestedCoins}
                    onChange={(e) => setRequestedCoins(e.target.value)}
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-admin-action btn-admin-primary"
                  disabled={isSubmitting || coins === 0}
                  style={{ height: "46px" }}
                >
                  {isSubmitting ? "Submitting..." : "Request Payout"}
                </button>
              </form>
            </div>
          </div>

          <div style={{ textAlign: "left" }}>
            <h2 style={{ fontSize: "1.4rem", color: "var(--text-primary)", marginBottom: "1rem" }}>
              Payout Request History
            </h2>
            {requests.length === 0 ? (
              <p style={{ color: "var(--text-secondary)" }}>You have not requested any payouts yet.</p>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Coins Requested</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => {
                      let badgeClass = "status-suspended"; // pending (amber)
                      if (req.status === "approved") badgeClass = "status-active"; // green
                      if (req.status === "rejected") badgeClass = "status-banned"; // red

                      return (
                        <tr key={req.id}>
                          <td>{new Date(req.requested_at).toLocaleDateString()}</td>
                          <td><strong>{req.coins_requested}</strong></td>
                          <td>
                            <span className={`status-badge ${badgeClass}`}>
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
