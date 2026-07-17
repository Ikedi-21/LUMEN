import { Link } from "react-router-dom";
import "./EmptyState.css";

export default function EmptyState({ icon: Icon, title, message, actionLabel, actionTo }) {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="empty-state-icon">
          <Icon size={32} />
        </div>
      )}
      <h2 className="empty-state-title">{title}</h2>
      {message && <p className="empty-state-message">{message}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="empty-state-action">{actionLabel}</Link>
      )}
    </div>
  );
}
