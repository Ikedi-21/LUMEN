import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth";
import { getSalesForCreator, getAllSales, updateLastViewedSales } from "@/services/sales/sales.service";
import { formatCoinsAsCurrency } from "@/shared/lib/pricing";
import { ChevronDown, ChevronUp, Package, Users } from "lucide-react";
import "./AdminPages.css";

export default function SalesPage() {
  const { user, profile } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("my");
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    async function loadSales() {
      setLoading(true);
      try {
        let data = [];
        if (viewMode === "all" && profile?.role === "manager") {
          data = await getAllSales();
        } else {
          data = await getSalesForCreator(user.id);
        }
        setSales(data);

        if (viewMode === "my") {
          await updateLastViewedSales(user.id);
        }
      } catch (err) {
        console.error("Failed to load sales data", err);
      } finally {
        setLoading(false);
      }
    }
    
    if (user) {
      loadSales();
    }
  }, [user, viewMode, profile?.role]);

  const toggleRow = (productId) => {
    setExpandedRow(prev => prev === productId ? null : productId);
  };

  return (
    <div className="admin-sales-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Sales Tracking</h1>
        
        {profile?.role === "manager" && (
          <div className="admin-view-toggle" style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className={`btn-admin-action ${viewMode === "my" ? "btn-admin-primary" : "btn-admin-secondary"}`}
              onClick={() => setViewMode("my")}
            >
              My Sales
            </button>
            <button 
              className={`btn-admin-action ${viewMode === "all" ? "btn-admin-primary" : "btn-admin-secondary"}`}
              onClick={() => setViewMode("all")}
            >
              All Sales
            </button>
          </div>
        )}
      </div>

      <p className="admin-page-subtitle">
        {viewMode === "all" ? "Viewing sales for all creators." : "Viewing sales for your custom products."}
      </p>

      {loading ? (
        <p>Loading sales data...</p>
      ) : sales.length === 0 ? (
        <div className="empty-state">
          <Package size={48} opacity={0.5} style={{ marginBottom: "1rem", margin: "0 auto", display: "block" }} />
          <h3 style={{ textAlign: "center" }}>No sales found</h3>
          <p style={{ textAlign: "center" }}>You haven't made any sales yet.</p>
        </div>
      ) : (
        <div className="sales-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          {sales.map(item => (
            <div key={item.productId} className="sales-card" style={{ background: 'var(--surface-light)', borderRadius: '8px', overflow: 'hidden' }}>
              <div 
                className="sales-card-header" 
                onClick={() => toggleRow(item.productId)}
                style={{ display: 'flex', alignItems: 'center', padding: '1rem', cursor: 'pointer' }}
              >
                <img 
                  src={item.cover || "https://placehold.co/100x150/222/FFF?text=No+Cover"} 
                  alt={item.title} 
                  style={{ width: '50px', height: '75px', objectFit: 'cover', borderRadius: '4px', marginRight: '1rem' }} 
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.title}</h3>
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span><Users size={14} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> Sold {item.count} time{item.count !== 1 ? 's' : ''}</span>
                    <span>Earned {item.totalCoinsEarned} coin{item.totalCoinsEarned !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div>
                  {expandedRow === item.productId ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>

              {expandedRow === item.productId && (
                <div className="sales-card-details" style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Recent Buyers</h4>
                  {item.buyers.map((b, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: idx < item.buyers.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <span>{b.username}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {new Date(b.date).toLocaleDateString()} {new Date(b.date).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
