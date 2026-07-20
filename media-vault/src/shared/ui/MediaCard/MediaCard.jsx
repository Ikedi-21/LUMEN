import { Link } from "react-router-dom";
import "./MediaCard.css";

export default function MediaCard({ item, index, progress }) {
  const displayType = item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : "";
  const displayYear = item.releaseDate ? item.releaseDate.substring(0, 4) : "";
  const displayRating = item.rating ? Number(item.rating).toFixed(1) : null;
  const primaryGenre = item.genres && item.genres[0] ? item.genres[0] : null;

  return (
    <Link 
      to={`/product/${item.type}/${item.id}`} 
      className="media-card"
      style={index !== undefined ? { "--stagger-index": index } : {}}
    >
      <div className="media-card-cover">
        {item.cover ? (
          <img src={item.cover} alt={item.title} loading="lazy" />
        ) : (
          <div className="media-card-placeholder">
            <span>{item.title}</span>
          </div>
        )}
        {displayType && <span className="media-card-badge">{displayType}</span>}
        {displayRating && <span className="media-card-rating-badge">★ {displayRating}</span>}
        
        {/* Hover info overlay */}
        <div className="media-card-overlay">
          {displayRating && <span className="overlay-rating">★ {displayRating}</span>}
          {primaryGenre && <span className="overlay-genre">{primaryGenre}</span>}
        </div>

        {progress != null && (
          <div className="media-card-progress">
            <div className="media-card-progress-bar">
              <div className="media-card-progress-fill" style={{ width: `${Math.min(progress.percentComplete, 100)}%` }} />
            </div>
            {progress.lastPositionText && (
              <span className="media-card-progress-label">{progress.lastPositionText}</span>
            )}
          </div>
        )}
      </div>
      <div className="media-card-info">
        <h3>{item.title}</h3>
        <div className="media-card-meta">
          {item.rating && (
            <span className="media-card-rating">★ {Number(item.rating).toFixed(1)}</span>
          )}
          {displayYear && <span className="media-card-year">{displayYear}</span>}
        </div>
      </div>
    </Link>
  );
}

