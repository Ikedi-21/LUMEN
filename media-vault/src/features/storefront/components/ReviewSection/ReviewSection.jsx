import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getReviews, getUserReview, upsertReview, getAverageRating } from "@/services/reviews";
import { useToast } from "@/shared/ui";
import "./ReviewSection.css";

export default function ReviewSection({ productId, productType, user, isPurchased }) {
  const { addToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, user]);

  async function loadReviews() {
    setLoading(true);
    const data = await getReviews(productId);
    setReviews(data);

    if (user) {
      const mine = await getUserReview(user.id, productId);
      if (mine) {
        setUserReview(mine);
        setRating(mine.rating);
        setComment(mine.comment || "");
      }
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) {
      addToast("Select a star rating first", "error");
      return;
    }
    setSubmitting(true);
    try {
      await upsertReview(user.id, productType, productId, rating, comment);
      addToast(userReview ? "Review updated" : "Review posted", "success");
      await loadReviews();
    } catch (err) {
      console.error(err);
      addToast("Failed to save review", "error");
    } finally {
      setSubmitting(false);
    }
  }

  const average = getAverageRating(reviews);

  return (
    <div className="review-section">
      <div className="review-summary">
        <h2>Reviews</h2>
        {average !== null ? (
          <div className="review-average">
            <Star size={18} fill="currentColor" />
            <span>{average.toFixed(1)}</span>
            <span className="review-count">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
          </div>
        ) : (
          <p className="review-empty-note">No reviews yet — be the first to unlock and review this.</p>
        )}
      </div>

      {user && isPurchased && (
        <form className="review-form" onSubmit={handleSubmit}>
          <div className="review-star-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="review-star-btn"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  size={26}
                  fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Share your thoughts (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : userReview ? "Update review" : "Post review"}
          </button>
        </form>
      )}

      {!user && (
        <p className="review-login-note">Log in and unlock this to leave a review.</p>
      )}
      {user && !isPurchased && (
        <p className="review-login-note">Unlock this to leave a review.</p>
      )}

      {!loading && reviews.length > 0 && (
        <div className="review-list">
          {reviews.map((r) => (
            <div key={r.id} className="review-item">
              <div className="review-item-header">
                <div className="review-item-avatar">
                  {r.profiles?.avatar_url ? (
                    <img src={r.profiles.avatar_url} alt="" />
                  ) : (
                    <span>{(r.profiles?.username || "?").charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <strong>{r.profiles?.username || "Anonymous"}</strong>
                  <div className="review-item-stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill={r.rating >= s ? "currentColor" : "none"} />
                    ))}
                  </div>
                </div>
              </div>
              {r.comment && <p className="review-item-comment">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
