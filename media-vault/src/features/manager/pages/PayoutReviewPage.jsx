import { useState, useEffect } from "react";
import RoleGuard from "@/shared/guards/RoleGuard";
import { useAuth } from "@/features/auth";
import { useToast } from "@/shared/ui";
import { getAllPayoutRequests, reviewPayoutRequest } from "@/services/payouts";
import "../../admin/pages/AdminPages.css";
import "./PayoutReviewPage.css";

export default function PayoutReviewPage() {
  const { profile: currentProfile } = useAuth();
  const { addToast } = useToast();
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    try {
      const data = await getAllPayoutRequests();
      setRequests(data);
    } catch (err) {
      console.error("Failed to load payout requests:", err);
      addToast("Failed to load payout requests.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(requestId, status, amount, requesterName) {
    const actionText = status === "approved" ? "approve" : "reject";
    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} the payout request of ${amount} coins for user "${requesterName}"?`
    );
    if (!confirmed) return;

    try {
      await reviewPayoutRequest(requestId, status, currentProfile.id);
      addToast(`Payout request ${status} successfully!`, "success");
      // Refresh request list
      await fetchRequests();
    } catch (err) {
      console.error(`Failed to review payout request:`, err);
      addToast(err.message || `Failed to ${actionText} request.`, "error");
    }
  }

  return (
    <RoleGuard allow={["manager"]}>
      <div className="payout-review-page">
        <header className="admin-page-header">
          <h1 className="admin-page-title">Payout Requests Review</h1>
        </header>

        <div className="simulation-note">
          <strong>Important Simulated System Note:</strong>
          <p>
            This dashboard displays all requested coin payouts from content creators. All payouts are simulated and processed manually by managers. No real bank or monetary transfer occurs when requests are approved or rejected.
          </p>
        </div>

        {loading ? (
          <p style={{ textAlign: "left" }}>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", textAlign: "left" }}>
            No payout requests found in the system.
          </p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Requester</th>
                  <th>Coins Requested</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => {
                  const requesterName = req.profiles?.username || req.profiles?.email || "Unknown User";
                  const isPending = req.status === "pending";
                  
                  let badgeClass = "status-suspended"; // pending (amber)
                  if (req.status === "approved") badgeClass = "status-active"; // green
                  if (req.status === "rejected") badgeClass = "status-banned"; // red

                  return (
                    <tr key={req.id}>
                      <td>{new Date(req.requested_at).toLocaleDateString()}</td>
                      <td>
                        <strong>{requesterName}</strong>
                      </td>
                      <td>
                        <strong>{req.coins_requested}</strong>
                      </td>
                      <td>
                        <span className={`status-badge ${badgeClass}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        {isPending ? (
                          <div className="admin-table-actions">
                            <button
                              onClick={() => handleReview(req.id, "approved", req.coins_requested, requesterName)}
                              className="btn-admin-action btn-admin-primary"
                              style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReview(req.id, "rejected", req.coins_requested, requesterName)}
                              className="btn-admin-action btn-admin-danger"
                              style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                            Processed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
