import { useState, useEffect } from "react";
import RoleGuard from "@/shared/guards/RoleGuard";
import { useAuth } from "@/features/auth";
import { useToast } from "@/shared/ui";
import { getAllProfiles, updateProfileStatus, updateProfileRole } from "@/services/profiles";
import "./StaffPage.css";

export default function StaffPage() {
  const { profile: currentProfile } = useAuth();
  const { addToast } = useToast();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    setLoading(true);
    const data = await getAllProfiles();
    setProfiles(data);
    setLoading(false);
  }

  async function handleToggleStatus(userId, currentStatus) {
    let newStatus = currentStatus;
    if (currentStatus === "active") newStatus = "suspended";
    else if (currentStatus === "suspended") newStatus = "active";
    else if (currentStatus === "banned") newStatus = "active"; // Reactivate from ban
    
    if (currentStatus === "active" && !window.confirm("Are you sure you want to suspend this user?")) return;

    const { success } = await updateProfileStatus(userId, newStatus);
    if (success) {
      setProfiles(profiles.map(p => p.id === userId ? { ...p, status: newStatus } : p));
      addToast(`User status updated to ${newStatus}`, "success");
    } else {
      addToast("Failed to update status.", "error");
    }
  }

  async function handleBan(userId) {
    if (!window.confirm("Are you sure you want to ban this user? They will not be able to log in.")) return;
    const { success } = await updateProfileStatus(userId, "banned");
    if (success) {
      setProfiles(profiles.map(p => p.id === userId ? { ...p, status: "banned" } : p));
      addToast("User has been banned", "success");
    } else {
      addToast("Failed to ban user.", "error");
    }
  }

  async function handleSetRole(userId, newRole) {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    const { success } = await updateProfileRole(userId, newRole);
    if (success) {
      setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p));
      addToast(`User role updated to ${newRole}`, "success");
    } else {
      addToast("Failed to update role.", "error");
    }
  }


  return (
    <RoleGuard allow={["manager"]}>
      <div className="staff-page">
        <header className="staff-header">
          <h1>Staff Management</h1>
          <p>Manage staff accounts, roles, and access.</p>
        </header>

        {loading ? (
          <p>Loading profiles...</p>
        ) : (
          <div className="table-container">
            <table className="staff-table">
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
                        <span className={`role-badge role-${p.role}`}>{p.role}</span>
                      </td>
                      <td>
                        <span className={`status-badge status-${p.status}`}>{p.status}</span>
                      </td>
                      <td>{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="actions-cell">
                        {!isSelf && (
                          <>
                            {p.role === "customer" && (
                              <button
                                className="btn-action btn-role"
                                onClick={() => handleSetRole(p.id, "staff")}
                              >
                                Promote to Staff
                              </button>
                            )}
                            {p.role === "staff" && (
                              <>
                                <button
                                  className="btn-action btn-role"
                                  onClick={() => handleSetRole(p.id, "manager")}
                                  style={{ marginRight: "0.25rem" }}
                                >
                                  Promote to Manager
                                </button>
                                <button
                                  className="btn-action btn-role"
                                  onClick={() => handleSetRole(p.id, "customer")}
                                >
                                  Demote to Customer
                                </button>
                              </>
                            )}
                            {p.role === "manager" && (
                              <button
                                className="btn-action btn-role"
                                onClick={() => handleSetRole(p.id, "staff")}
                              >
                                Demote to Staff
                              </button>
                            )}
                            <button
                              className={`btn-action ${p.status === "active" ? "btn-suspend" : "btn-reactivate"}`}
                              onClick={() => handleToggleStatus(p.id, p.status)}
                            >
                              {p.status === "active" ? "Suspend" : "Reactivate"}
                            </button>
                            {p.status !== "banned" && (
                              <button
                                className="btn-action btn-ban"
                                onClick={() => handleBan(p.id)}
                              >
                                Ban
                              </button>
                            )}
                          </>
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
