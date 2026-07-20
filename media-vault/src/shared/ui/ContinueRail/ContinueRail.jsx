import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth";
import { getAllProgress } from "@/services/purchases";
import { getMediaById } from "@/services/media";
import { useInView } from "@/shared/hooks/useInView";
import MediaCard from "../MediaCard/MediaCard";
import "./ContinueRail.css";

export default function ContinueRail() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  useEffect(() => {
    if (!user) return;

    let active = true;

    async function loadProgress() {
      const progressMap = getAllProgress(user.id);
      const productIds = Object.keys(progressMap);

      if (productIds.length === 0) {
        if (active) setLoading(false);
        return;
      }

      // Sort by most recently updated, take up to 10
      const sorted = productIds
        .map((id) => ({ id, ...progressMap[id] }))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 10);

      const enriched = await Promise.all(
        sorted.map(async (entry) => {
          // Product IDs have format "prefix-id" (e.g. "tmdb-12345", "openlib-OL123W")
          const dashIndex = entry.id.indexOf("-");
          if (dashIndex === -1) return null;

          const prefix = entry.id.substring(0, dashIndex);
          const prefixToType = {
            openlib: "book",
            tmdb: "movie",
            jikan: "manga",
            comicvine: "comic"
          };
          const type = prefixToType[prefix];
          if (!type) return null;

          try {
            const product = await getMediaById(type, entry.id);
            if (product) {
              return { product, progress: entry };
            }
          } catch {
            // Product may no longer exist
          }
          return null;
        })
      );

      if (active) {
        setItems(enriched.filter(Boolean));
        setLoading(false);
      }
    }

    loadProgress();
    return () => { active = false; };
  }, [user]);

  if (!user || (!loading && items.length === 0)) return null;

  return (
    <section
      ref={ref}
      className={`media-rail scroll-reveal ${inView ? "in-view" : ""}`}
    >
      <h2>Continue Watching / Reading</h2>
      <div className="media-rail-scroll">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="continue-skeleton" />
          ))
        ) : (
          items.map((entry, index) => (
            <MediaCard
              key={entry.product.id}
              item={entry.product}
              index={index}
              progress={entry.progress}
            />
          ))
        )}
      </div>
    </section>
  );
}
