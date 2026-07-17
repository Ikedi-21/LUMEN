import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { getAdminProducts } from "@/services/products";
import "./AdminPages.css";

export default function AdminDashboardPage() {
  const { user, profile } = useAuth();
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const products = await getAdminProducts();
        setProductCount(products.length);
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard Overview</h1>
      </div>
      <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "32px", textAlign: "left" }}>
        Welcome back, <strong>{profile?.username || user?.email}</strong>! Here is the current catalog status.
      </p>

      {loading ? (
        <p style={{ textAlign: "left" }}>Loading statistics...</p>
      ) : (
        <>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="dashboard-card-label">Total Custom Products</div>
              <div className="dashboard-card-value">{productCount}</div>
            </div>
            <div className="dashboard-card">
              <div className="dashboard-card-label">Catalog Modules Active</div>
              <div className="dashboard-card-value">4</div>
            </div>
          </div>

          <div className="admin-quick-actions" style={{ marginTop: "var(--space-6)", textAlign: "left" }}>
            <h2 style={{ fontSize: "1.3rem", marginBottom: "var(--space-3)", color: "var(--text-primary)" }}>Quick Actions</h2>
            <Link to="/admin/products/new" className="btn-admin-action btn-admin-primary" style={{ display: "inline-flex" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add New Product
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
