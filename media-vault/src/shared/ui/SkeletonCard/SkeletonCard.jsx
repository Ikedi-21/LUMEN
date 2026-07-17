import "./SkeletonCard.css";

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-cover">
        <div className="skeleton-shimmer" />
      </div>
      <div className="skeleton-info">
        <div className="skeleton-text">
          <div className="skeleton-shimmer" />
        </div>
        <div className="skeleton-text short">
          <div className="skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
