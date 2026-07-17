import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAdminProducts, removeProduct } from "@/services/products";
import { ConfirmDialog, useToast } from "@/shared/ui";
import "./AdminPages.css";

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);
  const [targetDeleteTitle, setTargetDeleteTitle] = useState("");

  async function loadProducts() {
    setLoading(true);
    try {
      const items = await getAdminProducts();
      setProducts(items);
    } catch (err) {
      console.error("Failed to fetch admin products:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function triggerDeletePrompt(id, title) {
    setTargetDeleteId(id);
    setTargetDeleteTitle(title);
    setIsDeleteOpen(true);
  }

  async function handleConfirmDelete() {
    setIsDeleteOpen(false);
    try {
      await removeProduct(targetDeleteId);
      addToast(`"${targetDeleteTitle}" deleted successfully`, "success");
      // Refresh list
      loadProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
      addToast(`Failed to delete product: ${err.message}`, "error");
    }
  }

  function handleCancelDelete() {
    setIsDeleteOpen(false);
    setTargetDeleteId(null);
    setTargetDeleteTitle("");
  }

  if (loading) {
    return <p style={{ textAlign: "left" }}>Loading custom products...</p>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Manage Custom Catalog</h1>
        <Link to="/admin/products/new" className="btn-admin-action btn-admin-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>No custom products found in the catalog.</p>
          <Link to="/admin/products/new" className="btn-admin-action btn-admin-primary">Add your first product</Link>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Cover</th>
                <th>Title</th>
                <th>Type</th>
                <th>Price</th>
                <th style={{ width: "200px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const formattedPrice = p.price ? `₦${(p.price / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "Free";
                const displayType = p.type ? p.type.charAt(0).toUpperCase() + p.type.slice(1) : "";

                return (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-table-cover">
                        {p.cover ? (
                          <img src={p.cover} alt={p.title} />
                        ) : (
                          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.5rem", color: "var(--text-secondary)" }}>
                            No Cover
                          </div>
                        )}
                      </div>
                    </td>
                    <td><strong>{p.title}</strong><br /><span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{p.creator}</span></td>
                    <td>
                      <span style={{
                        fontSize: "0.8rem",
                        padding: "3px 8px",
                        backgroundColor: "var(--card-surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "4px"
                      }}>
                        {displayType}
                      </span>
                    </td>
                    <td><strong>{formattedPrice}</strong></td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="btn-admin-action btn-admin-secondary" onClick={() => navigate(`/admin/products/${p.id}/edit`)}>
                          Edit
                        </button>
                        <button className="btn-admin-action btn-admin-danger" onClick={() => triggerDeletePrompt(p.id, p.title)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Custom Product"
        message={`Are you sure you want to permanently delete "${targetDeleteTitle}" from the store catalog? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
