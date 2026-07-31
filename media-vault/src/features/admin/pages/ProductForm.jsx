import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { getAdminProducts, addProduct, updateProduct } from "@/services/products";
import { useToast } from "@/shared/ui";
import "./AdminPages.css";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const isEditMode = Boolean(id);

  // Form states
  const [title, setTitle] = useState("");
  const [type, setType] = useState("movie");
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [genres, setGenres] = useState("");
  const [creator, setCreator] = useState("");
  const [price, setPrice] = useState("");

  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEditMode) return;

    async function loadProduct() {
      setLoading(true);
      try {
        const all = await getAdminProducts();
        const found = all.find((p) => p.id === id);
        if (found) {
          setTitle(found.title || "");
          setType(found.type || "movie");
          setCover(found.cover || "");
          setDescription(found.description || "");
          setRating(found.rating !== null && found.rating !== undefined ? String(found.rating) : "");
          setReleaseDate(found.releaseDate || "");
          setGenres(found.genres ? found.genres.join(", ") : "");
          setCreator(found.creator || "");
          setPrice(found.price ? String(found.price) : "");
        } else {
          addToast("Product not found in the custom catalog.", "error");
          navigate("/admin/products");
        }
      } catch (err) {
        console.error("Failed to load product for editing:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode, navigate]);

  function validate() {
    const tempErrors = {};
    if (!title.trim()) tempErrors.title = "Title is required";
    if (!price || Number(price) <= 0) tempErrors.price = "A valid price is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    // Convert genres string to array of trimmed values
    const genresArray = genres
      .split(",")
      .map((g) => g.trim())
      .filter((g) => g.length > 0);

    const priceInKobo = Math.round(Number(price));

    setLoading(true);
    try {
      if (isEditMode) {
        // Map updates to Supabase columns
        const updates = {
          title,
          type,
          cover: cover || null,
          description: description || null,
          rating: rating !== "" ? Number(rating) : null,
          release_date: releaseDate || null,
          genres: genresArray,
          creator: creator || null,
          price: priceInKobo,
        };
        await updateProduct(id, updates);
      } else {
        const newProduct = {
          id: `admin-${Date.now()}`,
          title,
          type,
          cover: cover || null,
          description: description || null,
          rating: rating !== "" ? Number(rating) : null,
          releaseDate: releaseDate || null,
          genres: genresArray,
          creator: creator || null,
          price: priceInKobo,
          createdBy: user.id,
        };
        await addProduct(newProduct);
      }
      addToast(`"${title}" saved successfully`, "success");
      navigate("/admin/products");
    } catch (err) {
      console.error("Failed to save product:", err);
      addToast(`Failed to save product: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  }

  if (loading && isEditMode) {
    return <p style={{ textAlign: "left" }}>Loading product data...</p>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">{isEditMode ? "Edit Custom Product" : "Create Custom Product"}</h1>
      </div>

      <div className="admin-form-container">
        <form onSubmit={handleSubmit} className="admin-form-grid">
          <div className="admin-form-field">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Inception"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
            {errors.title && <span className="admin-form-error">{errors.title}</span>}
          </div>

          <div className="admin-form-field">
            <label htmlFor="type">Media Type *</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value)} disabled={loading}>
              <option value="movie">Movie</option>
              <option value="book">Book</option>
              <option value="manga">Manga</option>
              <option value="comic">Comic</option>
            </select>
          </div>

          <div className="admin-form-field">
            <label htmlFor="price">Price (Coins) *</label>
            <input
              id="price"
              type="number"
              placeholder="e.g. 100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading}
            />
            {errors.price && <span className="admin-form-error">{errors.price}</span>}
          </div>

          <div className="admin-form-field">
            <label htmlFor="creator">Creator (Director, Author, Illustrator)</label>
            <input
              id="creator"
              type="text"
              placeholder="e.g. Christopher Nolan"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="releaseDate">Release Date / Year</label>
            <input
              id="releaseDate"
              type="text"
              placeholder="e.g. 2010"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="rating">Rating (0.0 to 10.0)</label>
            <input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="e.g. 8.8"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="admin-form-field full-width">
            <label htmlFor="cover">Cover Art URL</label>
            <input
              id="cover"
              type="url"
              placeholder="https://example.com/cover.jpg"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="admin-form-field full-width">
            <label htmlFor="genres">Genres (Comma separated)</label>
            <input
              id="genres"
              type="text"
              placeholder="e.g. Sci-Fi, Action, Thriller"
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="admin-form-field full-width">
            <label htmlFor="description">Description / Overview</label>
            <textarea
              id="description"
              placeholder="Enter product description here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="admin-form-actions full-width">
            <button type="button" className="btn-admin-action btn-admin-secondary" onClick={() => navigate("/admin/products")} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-admin-action btn-admin-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
