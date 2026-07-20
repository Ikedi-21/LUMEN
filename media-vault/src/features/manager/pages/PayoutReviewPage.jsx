import { useState, useEffect } from "react";
import RoleGuard from "@/shared/guards/RoleGuard";
import { useAuth } from "@/features/auth";
import { useToast, Badge } from "@/shared/ui";
import { getAllPayoutRequests, reviewPayoutRequest } from "@/services/payouts";
import { CheckCircle, XCircle } from "lucide-react";
import "../../admin/pages/AdminPages.css";
import "./PayoutReviewPage.css";

export default function PayoutReviewPage() {
  const { profile: currentProfile } = useAuth();
  const { addToast } = useToast();
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                  const variant = req.status === "approved" ? "success" : req.status === "rejected" ? "danger" : "warning";

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
                        <Badge variant={variant}>{req.status}</Badge>
                      </td>
                      <td>
                        {isPending ? (
                          <div className="payout-actions">
                            <button
                              onClick={() => handleReview(req.id, "approved", req.coins_requested, requesterName)}
                              className="btn-action btn-payout-approve"
                            >
                              <CheckCircle size={14} />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleReview(req.id, "rejected", req.coins_requested, requesterName)}
                              className="btn-action btn-payout-reject"
                            >
                              <XCircle size={14} />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <Badge variant="default" size="sm">Processed</Badge>
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
