import { Outlet, NavLink, Link } from "react-router-dom";
import RoleGuard from "@/shared/guards/RoleGuard";
import { useAuth } from "@/features/auth";
import { Logo } from "@/shared/ui";
import "./AdminLayout.css";

export default function AdminLayout() {
  const { user, profile, signOut } = useAuth();

  return (
    <RoleGuard allow={["staff", "manager"]}>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-logo-wrapper">
            <Link to="/">
              <Logo size={32} />
            </Link>
          </div>
          <nav className="admin-nav">
            <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
              Products
            </NavLink>
            <NavLink to="/admin/earnings" className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
              Earnings
            </NavLink>
            {profile?.role === "manager" && (
              <>
                <NavLink to="/admin/staff" className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
                  Staff
                </NavLink>
                <NavLink to="/admin/payouts" className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
                  Payout Requests
                </NavLink>
              </>
            )}
          </nav>
        </aside>
        <div className="admin-main">
          <header className="admin-topbar">
            <div className="admin-breadcrumb">Admin Console</div>
            <div className="admin-user-menu">
              <span className="admin-username">
                Logged in as: <strong>{profile?.username || user?.email}</strong> ({profile?.role})
              </span>
              <button onClick={signOut} className="btn-admin-logout">
                Logout
              </button>
            </div>
          </header>
          <main className="admin-content-area">
            <Outlet />
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
