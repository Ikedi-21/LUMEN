import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="lumen-footer">
      <div className="footer-inner">

        <p className="footer-contact">
          Need help? <a href="mailto:support@lumen.app">Get in touch</a>.
        </p>

        <div className="footer-grid">
          <div className="footer-col">
            <Link to="/browse/movie">Browse Movies</Link>
            <Link to="/browse/book">Browse Books</Link>
            <Link to="/browse/manga">Browse Manga</Link>
            <Link to="/browse/comic">Browse Comics</Link>
          </div>
          <div className="footer-col">
            <Link to="/library">My Library</Link>
            <Link to="/wishlist">My Wishlist</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/settings">Account Settings</Link>
          </div>
          <div className="footer-col">
            <a href="#about">About</a>
            <a href="#careers">Careers</a>
            <a href="#contact">Contact</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="footer-col">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookie Preferences</a>
          </div>
        </div>

        <p className="footer-region">Lumen — Nigeria</p>

        <p className="footer-copy">
          © 2026 Lumen. Movies, manga, books, and comics — discover and collect your next favorite.
        </p>

      </div>
    </footer>
  );
}
