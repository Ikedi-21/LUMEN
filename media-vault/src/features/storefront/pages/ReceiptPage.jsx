import { useLocation, Link } from "react-router-dom";
import "./ReceiptPage.css";

export default function ReceiptPage() {
  const location = useLocation();
  const items = location.state?.items || [];

  if (items.length === 0) {
    return (
      <div className="receipt-page">
        <div className="receipt-container empty-state">
          <h2>No recent purchase to show</h2>
          <p>It looks like you haven't made any recent purchases in this session.</p>
          <div className="receipt-actions">
            <Link to="/library" className="btn-primary">View my library</Link>
            <Link to="/" className="btn-secondary" style={{ marginTop: "1rem" }}>Back to browsing</Link>
          </div>
        </div>
      </div>
    );
  }

  const dateStr = new Date().toLocaleString(undefined, {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
  });

  return (
    <div className="receipt-page">
      <div className="receipt-container">
        <h1 className="receipt-title">Purchase complete</h1>
        <p className="receipt-date">{dateStr}</p>
        
        <div className="receipt-items">
          {items.map((item) => {
            const displayType = item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : "";
            const isMovie = item.type === "movie";
            const actionText = isMovie ? "Watch trailer" : "Read preview";
            const actionLink = isMovie ? `/watch/${item.id}` : `/product/${item.type}/${item.id}?preview=true`;

            return (
              <div key={item.id} className="receipt-item">
                <div className="receipt-item-cover">
                  {item.cover ? (
                    <img src={item.cover} alt={item.title} />
                  ) : (
                    <div className="receipt-item-no-cover">No Cover</div>
                  )}
                </div>
                <div className="receipt-item-info">
                  <h3>{item.title}</h3>
                  <span className="receipt-item-type">{displayType}</span>
                </div>
                <div className="receipt-item-price">1 coin</div>
                <div className="receipt-item-action">
                  <Link to={actionLink} className="btn-action-small">{actionText}</Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="receipt-summary">
          <div className="receipt-total">
            <span>Total</span>
            <span>{items.length} {items.length === 1 ? 'coin' : 'coins'} spent</span>
          </div>
        </div>

        <div className="receipt-footer-actions">
          <Link to="/library" className="btn-primary">View my library</Link>
          <Link to="/" className="btn-secondary" style={{ marginTop: "1rem" }}>Back to browsing</Link>
        </div>
      </div>
    </div>
  );
}
