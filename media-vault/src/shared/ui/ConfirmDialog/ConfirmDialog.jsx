import "./ConfirmDialog.css";

export default function ConfirmDialog({ isOpen, title = "Confirm Action", message = "Are you sure you want to perform this action?", onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div className="confirm-dialog-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="confirm-dialog-title">{title}</h2>
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button className="btn-confirm-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm-action" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
