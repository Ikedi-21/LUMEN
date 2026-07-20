import { useState, useEffect } from "react";
import RoleGuard from "@/shared/guards/RoleGuard";
import { useAuth } from "@/features/auth";
import { useToast, Badge, ConfirmDialog } from "@/shared/ui";
import { getAllProfiles, updateProfileStatus, updateProfileRole } from "@/services/profiles";
import { getAllApplications, reviewApplication } from "@/services/staffApplications";
import { ArrowUpCircle, ArrowDownCircle, ShieldOff, ShieldCheck, Ban, RotateCcw, CheckCircle, XCircle, FileText } from "lucide-react";
import "../../admin/pages/AdminPages.css";
import "./StaffPage.css";

const ROLE_VARIANTS = { manager: "accent", staff: "info", customer: "default" };
const STATUS_VARIANTS = { active: "success", suspended: "warning", banned: "danger" };

export default function StaffPage() {
  const { profile: currentProfile } = useAuth();
  const { addToast } = useToast();
  const [profiles, setProfiles] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: "", message: "", label: "", onConfirm: null });

  useEffect(() => {
    let active = true;
    Promise.all([getAllProfiles(), getAllApplications()]).then(([profilesData, appsData]) => {
      if (active) {
        setProfiles(profilesData);
        setApplications(appsData);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  function openConfirm(title, message, label, onConfirm) {
    setConfirmConfig({ title, message, label, onConfirm });
    setConfirmOpen(true);
  }

  async function handleReviewApp(appId, status, targetUserId, username) {
    const action = status === "approved" ? "approve" : "reject";
    openConfirm(
      `${action === "approve" ? "Approve" : "Reject"} Application`,
      `Are you sure you want to ${action} the staff application from "${username}"?${status === "approved" ? " They will be promoted to Staff." : ""}`,
      status === "approved" ? "Approve" : "Reject",
      async () => {
        const { success } = await reviewApplication(appId, status, currentProfile.id, targetUserId);
        if (success) {
          addToast(`Application ${status} successfully!`, "success");
          setApplications((prev) => prev.map(a => a.id === appId ? { ...a, status } : a));
          if (status === "approved") {
            setProfiles((prev) => prev.map(p => p.id === targetUserId ? { ...p, role: "staff" } : p));
          }
        } else {
          addToast(`Failed to ${action} application.`, "error");
        }
      }
    );
  }

  async function handleToggleStatus(userId, currentStatus) {
    let newStatus = currentStatus;
    if (currentStatus === "active") newStatus = "suspended";
    else if (currentStatus === "suspended") newStatus = "active";
    else if (currentStatus === "banned") newStatus = "active";

    if (currentStatus === "active") {
      openConfirm("Suspend User", "Are you sure you want to suspend this user?", "Suspend", async () => {
        const { success } = await updateProfileStatus(userId, newStatus);
        if (success) {
          setProfiles(profiles.map(p => p.id === userId ? { ...p, status: newStatus } : p));
          addToast(`User status updated to ${newStatus}`, "success");
        } else {
          addToast("Failed to update status.", "error");
        }
      });
    } else {
      const { success } = await updateProfileStatus(userId, newStatus);
      if (success) {
        setProfiles(profiles.map(p => p.id === userId ? { ...p, status: newStatus } : p));
        addToast(`User status updated to ${newStatus}`, "success");
      } else {
        addToast("Failed to update status.", "error");
      }
    }
  }

  async function handleBan(userId) {
    openConfirm("Ban User", "Are you sure you want to ban this user? They will not be able to log in.", "Ban", async () => {
      const { success } = await updateProfileStatus(userId, "banned");
      if (success) {
        setProfiles(profiles.map(p => p.id === userId ? { ...p, status: "banned" } : p));
        addToast("User has been banned", "success");
      } else {
        addToast("Failed to ban user.", "error");
      }
    });
  }

  async function handleSetRole(userId, newRole) {
    openConfirm("Change Role", `Are you sure you want to change this user's role to ${newRole}?`, "Confirm", async () => {
      const { success } = await updateProfileRole(userId, newRole);
      if (success) {
        setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p));
        addToast(`User role updated to ${newRole}`, "success");
      } else {
        addToast("Failed to update role.", "error");
      }
    });
  }

  const pendingApps = applications.filter(a => a.status === "pending");

  return (
    <RoleGuard allow={["manager"]}>
      <div className="staff-page">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Staff Management</h1>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "var(--space-5)", textAlign: "left" }}>
          Manage staff accounts, roles, and access.
        </p>

        {loading ? (
          <p style={{ textAlign: "left" }}>Loading...</p>
        ) : (
          <>
            {/* ── Pending Applications ─────────────────────────── */}
            {pendingApps.length > 0 && (
              <div className="admin-section-block">
                <div className="admin-section-header">
                  <FileText size={18} />
                  <h2 className="admin-section-title">Pending Applications</h2>
                  <Badge variant="warning">{pendingApps.length}</Badge>
                </div>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Applicant</th>
                        <th>Reason</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingApps.map(app => {
                        const name = app.profiles?.username || app.profiles?.email || "Unknown";
                        return (
                          <tr key={app.id}>
                            <td><strong>{name}</strong></td>
                            <td className="app-reason-cell">{app.reason}</td>
                            <td>{new Date(app.created_at).toLocaleDateString()}</td>
                            <td>
                              <div className="payout-actions">
                                <button className="btn-action btn-payout-approve" onClick={() => handleReviewApp(app.id, "approved", app.user_id, name)}>
                                  <CheckCircle size={14} />
                                  <span>Approve</span>
                                </button>
                                <button className="btn-action btn-payout-reject" onClick={() => handleReviewApp(app.id, "rejected", app.user_id, name)}>
                                  <XCircle size={14} />
                                  <span>Reject</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── All Profiles ─────────────────────────────────── */}
            <div className="admin-section-block">
              <div className="admin-section-header">
                <h2 className="admin-section-title">All Users</h2>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map(p => {
                      const isSelf = p.id === currentProfile?.id;
                      return (
                        <tr key={p.id}>
                          <td>
                            <strong>{p.username || "Unknown"}</strong>
                            {isSelf && <span className="self-badge"> (You)</span>}
                          </td>
                          <td>
                            <Badge variant={ROLE_VARIANTS[p.role] || "default"}>{p.role}</Badge>
                          </td>
                          <td>
                            <Badge variant={STATUS_VARIANTS[p.status] || "default"}>{p.status}</Badge>
                          </td>
                          <td>{new Date(p.created_at).toLocaleDateString()}</td>
                          <td>
                            {isSelf ? (
                              <span className="actions-cell-self">Current user</span>
                            ) : (
                              <div className="actions-cell">
                                <div className="actions-group">
                                  {p.role === "customer" && (
                                    <button className="btn-action btn-role-up" onClick={() => handleSetRole(p.id, "staff")} title="Promote to Staff">
                                      <ArrowUpCircle size={14} />
                                      <span>Staff</span>
                                    </button>
                                  )}
                                  {p.role === "staff" && (
                                    <>
                                      <button className="btn-action btn-role-up" onClick={() => handleSetRole(p.id, "manager")} title="Promote to Manager">
                                        <ArrowUpCircle size={14} />
                                        <span>Manager</span>
                                      </button>
                                      <button className="btn-action btn-role-down" onClick={() => handleSetRole(p.id, "customer")} title="Demote to Customer">
                                        <ArrowDownCircle size={14} />
                                        <span>Customer</span>
                                      </button>
                                    </>
                                  )}
                                  {p.role === "manager" && (
                                    <button className="btn-action btn-role-down" onClick={() => handleSetRole(p.id, "staff")} title="Demote to Staff">
                                      <ArrowDownCircle size={14} />
                                      <span>Staff</span>
                                    </button>
                                  )}
                                </div>

                                {p.role !== "customer" && <div className="actions-separator" />}

                                <div className="actions-group">
                                  {p.status === "active" ? (
                                    <button className="btn-action btn-suspend" onClick={() => handleToggleStatus(p.id, p.status)} title="Suspend user">
                                      <ShieldOff size={14} />
                                      <span>Suspend</span>
                                    </button>
                                  ) : p.status === "suspended" ? (
                                    <button className="btn-action btn-reactivate" onClick={() => handleToggleStatus(p.id, p.status)} title="Reactivate user">
                                      <ShieldCheck size={14} />
                                      <span>Reactivate</span>
                                    </button>
                                  ) : (
                                    <button className="btn-action btn-reactivate" onClick={() => handleToggleStatus(p.id, p.status)} title="Restore user">
                                      <RotateCcw size={14} />
                                      <span>Restore</span>
                                    </button>
                                  )}

                                  {p.status !== "banned" && (
                                    <button className="btn-action btn-ban" onClick={() => handleBan(p.id)} title="Ban user">
                                      <Ban size={14} />
                                      <span>Ban</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        <ConfirmDialog
          isOpen={confirmOpen}
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmLabel={confirmConfig.label}
          onConfirm={() => { confirmConfig.onConfirm?.(); setConfirmOpen(false); }}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    </RoleGuard>
  );
}
