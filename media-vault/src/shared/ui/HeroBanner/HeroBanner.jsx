import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import "./HeroBanner.css";

const MAX_SLIDES = 3;

export default function HeroBanner({ items = [], item }) {
  // Backwards-compat: accept either `items` array or single `item`
  const allSlides = items.length > 0 ? items : item ? [item] : [];
  const slides = allSlides.slice(0, MAX_SLIDES);

  const [activeIndex, setActiveIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const navigate = useNavigate();

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  function goToSlide(index) {
    setActiveIndex(index);
  }

  function goPrev() {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }

  function goNext() {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }

  if (slides.length === 0) return null;

  const fadeStyle = prefersReducedMotion
    ? "hero-carousel-slide hero-carousel-slide--cut"
    : "hero-carousel-slide";

  return (
    <section className="netflix-hero">
      {/* Slide layers — all stacked, only active one gets opacity 1 */}
      {slides.map((slide, i) => {
        const bgImage =
          slide.backdrop ||
          slide.cover ||
          "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop";

        return (
          <div
            key={slide.id || i}
            className={`${fadeStyle} ${i === activeIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${bgImage})` }}
            aria-hidden={i !== activeIndex}
          />
        );
      })}

      {/* Vignette overlay (always on top of images) */}
      <div className="netflix-hero-vignette" />

      {/* Content for active slide */}
      <div className="netflix-hero-content">
        <h1 className="netflix-hero-title">{slides[activeIndex]?.title}</h1>
        <p className="netflix-hero-description">
          {(() => {
            const desc = slides[activeIndex]?.description;
            if (!desc) return "Explore this amazing title.";
            return desc.length > 200 ? desc.substring(0, 200) + "..." : desc;
          })()}
        </p>

        <div className="netflix-hero-actions">
          <button
            className="netflix-btn netflix-btn-play"
            onClick={() => {
              const s = slides[activeIndex];
              navigate(`/watch/${s.id.replace("tmdb-", "")}`);
            }}
          >
            <Play fill="currentColor" size={24} />
            <span>Play</span>
          </button>

          <Link
            to={`/product/${slides[activeIndex]?.type}/${slides[activeIndex]?.id}`}
            className="netflix-btn netflix-btn-info"
          >
            <Info size={24} />
            <span>More Info</span>
          </Link>
        </div>
      </div>

      {/* Manual prev/next arrows */}
      {slides.length > 1 && (
        <>
          <button className="hero-arrow hero-arrow--prev" onClick={goPrev} aria-label="Previous slide">
            <ChevronLeft size={28} />
          </button>
          <button className="hero-arrow hero-arrow--next" onClick={goNext} aria-label="Next slide">
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === activeIndex ? "hero-dot--active" : ""}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
