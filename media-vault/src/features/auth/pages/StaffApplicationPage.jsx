import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { useToast, Badge } from "@/shared/ui";
import { submitApplication, getApplicationForUser } from "@/services/staffApplications";
import { ShieldCheck, Send, Clock, CheckCircle, XCircle } from "lucide-react";
import "./StaffApplicationPage.css";

const STATUS_CONFIG = {
  pending: { variant: "warning", icon: Clock, label: "Under Review" },
  approved: { variant: "success", icon: CheckCircle, label: "Approved" },
  rejected: { variant: "danger", icon: XCircle, label: "Rejected" },
};

export default function StaffApplicationPage() {
  const { user, profile } = useAuth();
  const { addToast } = useToast();

  const [reason, setReason] = useState("");
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    getApplicationForUser(user.id).then((app) => {
      setApplication(app);
      setLoading(false);
    });
  }, [user]);

  const isStaff = profile?.role === "staff" || profile?.role === "manager";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!reason.trim()) return;

    setSubmitting(true);
    const { success, error } = await submitApplication(user.id, reason.trim());
    setSubmitting(false);

    if (success) {
      addToast("Application submitted!", "success");
      const app = await getApplicationForUser(user.id);
      setApplication(app);
      setReason("");
    } else {
      addToast(error || "Failed to submit application.", "error");
    }
  }

  if (loading) {
    return (
      <div className="staff-app-page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="staff-app-page">
      <div className="staff-app-card">
        <div className="staff-app-header">
          <ShieldCheck size={32} className="staff-app-icon" />
          <h1>Apply for Staff Access</h1>
          <p>Join the team and help manage the Media Vault catalog.</p>
        </div>

        {isStaff ? (
          <div className="staff-app-already">
            <Badge variant="success" size="md">You already have staff access</Badge>
            <Link to="/admin" className="btn-staff-app-admin">Go to Admin Console</Link>
          </div>
        ) : application ? (
          <div className="staff-app-status-section">
            <div className="staff-app-status-row">
              <span className="staff-app-status-label">Application Status:</span>
              <Badge variant={STATUS_CONFIG[application.status]?.variant || "default"}>
                {STATUS_CONFIG[application.status]?.label || application.status}
              </Badge>
            </div>
            <p className="staff-app-status-date">
              Submitted on {new Date(application.created_at).toLocaleDateString()}
            </p>
            {application.status === "rejected" && (
              <div className="staff-app-reapply">
                <p>You can submit a new application.</p>
                <form onSubmit={handleSubmit} className="staff-app-form">
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Tell us why you'd be a great fit for the team..."
                    rows={5}
                    required
                  />
                  <button type="submit" className="btn-staff-app-submit" disabled={submitting || !reason.trim()}>
                    <Send size={16} />
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="staff-app-form">
            <div className="staff-app-field">
              <label htmlFor="reason">Why do you want to become a staff member?</label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe your interest in contributing to the Media Vault team, any relevant experience, and how you'd like to help..."
                rows={6}
                required
              />
            </div>
            <button type="submit" className="btn-staff-app-submit" disabled={submitting || !reason.trim()}>
              <Send size={16} />
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
