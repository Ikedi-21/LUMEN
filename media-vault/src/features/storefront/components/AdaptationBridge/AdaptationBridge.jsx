import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import "./AdaptationBridge.css";

/**
 * Renders a horizontal connected sequence showing every format of a story.
 * Each item is a MediaCard; the current product is highlighted.
 *
 * @param {{ storyGroup: { title: string, items: Array }, currentProductId: string }} props
 */
export default function AdaptationBridge({ storyGroup, currentProductId }) {
  if (!storyGroup || !storyGroup.items || storyGroup.items.length === 0) return null;

  const { title, items } = storyGroup;

  return (
    <section className="adaptation-bridge">
      <h2 className="adaptation-bridge-title">
        <span className="adaptation-bridge-label">Also available as</span>
        {title}
      </h2>

      <div className="adaptation-bridge-scroll">
        {items.map((item, index) => {
          const isCurrent = item.productId === currentProductId;
          const displayType = item.formatType
            ? item.formatType.charAt(0).toUpperCase() + item.formatType.slice(1)
            : "";

          return (
            <div key={item.productId} className="adaptation-bridge-step">
              <Link
                to={`/product/${item.formatType}/${item.productId}`}
                className={`adaptation-bridge-card ${isCurrent ? "adaptation-bridge-card--current" : ""}`}
              >
                <div className="adaptation-bridge-card-cover">
                  {item.cover ? (
                    <img src={item.cover} alt={item.title} />
                  ) : (
                    <div className="adaptation-bridge-card-placeholder">{item.title}</div>
                  )}
                  {displayType && (
                    <span className="adaptation-bridge-card-badge">{displayType}</span>
                  )}
                </div>
                <div className="adaptation-bridge-card-info">
                  <h3>{item.title}</h3>
                  {item.creator && <p>{item.creator}</p>}
                </div>
                {isCurrent && <span className="adaptation-bridge-current-tag">Current</span>}
              </Link>

              {index < items.length - 1 && (
                <div className="adaptation-bridge-connector" aria-hidden="true">
                  <ChevronRight size={20} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
