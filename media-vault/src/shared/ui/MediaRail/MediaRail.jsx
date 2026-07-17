import { useInView } from "@/shared/hooks/useInView";
import MediaCard from "../MediaCard/MediaCard";
import SkeletonCard from "../SkeletonCard/SkeletonCard";
import "./MediaRail.css";

export default function MediaRail({ title, items = [], loading = false }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section 
      ref={ref} 
      className={`media-rail scroll-reveal ${inView ? "in-view" : ""}`}
    >
      <h2>{title}</h2>
      <div className="media-rail-scroll">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          items.map((item, index) => (
            <MediaCard key={item.id} item={item} index={index} />
          ))
        )}
      </div>
    </section>
  );
}
