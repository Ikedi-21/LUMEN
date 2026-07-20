import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { getAdminProducts } from "@/services/products";
import { Package, Layers, Film, Plus } from "lucide-react";
import EarningsChart from "../components/EarningsChart/EarningsChart";
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
      <p className="admin-page-subtitle">
        Welcome back, <strong>{profile?.username || user?.email}</strong>! Here is the current catalog status.
      </p>

      {loading ? (
        <p style={{ textAlign: "left" }}>Loading statistics...</p>
      ) : (
        <>
          <div className="dashboard-grid">
            <div className="dashboard-card dashboard-card--accent">
              <div className="dashboard-card-icon">
                <Package size={20} />
              </div>
              <div className="dashboard-card-label">Total Custom Products</div>
              <div className="dashboard-card-value">{productCount}</div>
            </div>
            <div className="dashboard-card">
              <div className="dashboard-card-icon">
                <Layers size={20} />
              </div>
              <div className="dashboard-card-label">Catalog Modules Active</div>
              <div className="dashboard-card-value">4</div>
            </div>
            <div className="dashboard-card">
              <div className="dashboard-card-icon">
                <Film size={20} />
              </div>
              <div className="dashboard-card-label">Media Sources</div>
              <div className="dashboard-card-value">4</div>
            </div>
          </div>

          <div className="admin-quick-actions">
            <h2 className="admin-section-title">Quick Actions</h2>
            <Link to="/admin/products/new" className="btn-admin-action btn-admin-primary">
              <Plus size={16} />
              Add New Product
            </Link>
          </div>

          <EarningsChart />
        </>
      )}
    </div>
  );
}
