import { useState, useCallback } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import RoleGuard from "@/shared/guards/RoleGuard";
import { useAuth } from "@/features/auth";
import { Logo } from "@/shared/ui";
import { Menu, X } from "lucide-react";
import "./AdminLayout.css";

export default function AdminLayout() {
  const { user, profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <RoleGuard allow={["staff", "manager"]}>
      <div className="admin-layout">
        {sidebarOpen && <div className="admin-sidebar-overlay" onClick={closeSidebar} />}

        <aside className={`admin-sidebar ${sidebarOpen ? "admin-sidebar--open" : ""}`}>
          <div className="admin-sidebar-header">
            <div className="admin-logo-wrapper">
              <Link to="/" onClick={closeSidebar}>
                <Logo size={32} />
              </Link>
            </div>
            <button className="admin-sidebar-close" onClick={closeSidebar} aria-label="Close sidebar">
              <X size={20} />
            </button>
          </div>
          <nav className="admin-nav">
            <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
              Products
            </NavLink>
            <NavLink to="/admin/earnings" className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
              Earnings
            </NavLink>
            {profile?.role === "manager" && (
              <>
                <NavLink to="/admin/staff" className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                  Staff
                </NavLink>
                <NavLink to="/admin/payouts" className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                  Payout Requests
                </NavLink>
              </>
            )}
          </nav>
        </aside>

        <div className="admin-main">
          <header className="admin-topbar">
            <div className="admin-topbar-left">
              <button className="admin-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
                <Menu size={22} />
              </button>
              <div className="admin-breadcrumb">Admin Console</div>
            </div>
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
