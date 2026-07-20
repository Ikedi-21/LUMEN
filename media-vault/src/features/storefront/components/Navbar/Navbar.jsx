import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/shared/ui";
import { useAuth } from "@/features/auth";
import { useStorefront } from "../../context";

import { ShoppingCart, Heart, Coins, Search, Menu, X, Settings, LogOut, BookOpen, Shield } from "lucide-react";
import { formatCoinsAsCurrency } from "@/shared/lib/pricing";
import "./Navbar.css";
import "./NavbarDropdown.css";

const NAV_LINKS = [
  { to: "/browse/movie", label: "Movies" },
  { to: "/browse/book", label: "Books" },
  { to: "/browse/manga", label: "Manga" },
  { to: "/browse/comic", label: "Comics" },
];

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { cartCount, wishlistCount, coins } = useStorefront();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const displayInitials = profile?.username?.charAt(0).toUpperCase() ||
                          profile?.email?.charAt(0).toUpperCase() ||
                          "?";

  function handleTopUp() {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/top-up");
  }

  return (
    <>
      <nav className="navbar">
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <Link to="/" className="navbar-logo">
          <Logo size={36} />
        </Link>

        <div className="navbar-links">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to}>{link.label}</Link>
          ))}
        </div>

        <div className="navbar-actions">
          <Link to="/search" className="navbar-icon badge-container" title="Search">
            <Search size={20} />
          </Link>
          {user ? (
            <>
              <button 
                onClick={handleTopUp} 
                className="navbar-icon coin-balance" 
                title={`Balance: ${formatCoinsAsCurrency(coins)}`} 
                style={{ background: "none", cursor: "pointer", fontFamily: "inherit", border: "none" }}
              >
                <Coins size={20} />
                <span>{coins}</span>
                <span className="coin-currency-hint">{formatCoinsAsCurrency(coins)}</span>
              </button>

              <Link to="/wishlist" className="navbar-icon badge-container" title="Wishlist">
                <Heart size={20} />
                {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
              </Link>

              <Link to="/cart" className="navbar-icon badge-container" title="Cart">
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </Link>

              <div className="navbar-user-dropdown" ref={dropdownRef}>
                <button
                  className="navbar-avatar-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="navbar-avatar-img" />
                  ) : (
                    <div className="navbar-avatar-initials">{displayInitials}</div>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <strong>{profile?.username || profile?.email?.split('@')[0]}</strong>
                    </div>
                    <hr className="dropdown-divider" />
                    <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Settings</Link>
                    <Link to="/library" className="dropdown-item" onClick={() => setDropdownOpen(false)}>My Library</Link>
                    {(profile?.role === "staff" || profile?.role === "manager") && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Admin Panel</Link>
                    )}
                    <hr className="dropdown-divider" />
                    <button
                      onClick={() => { setDropdownOpen(false); signOut(); }}
                      className="dropdown-item dropdown-logout"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="navbar-icon">Login</Link>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <Logo size={32} />
              <button
                className="mobile-menu-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>
            <div className="mobile-menu-links">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="mobile-menu-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {user && (
              <div className="mobile-menu-actions">
                <Link to="/search" className="mobile-menu-action" onClick={() => setMenuOpen(false)}>
                  <Search size={18} />
                  <span>Search</span>
                </Link>
                <Link to="/library" className="mobile-menu-action" onClick={() => setMenuOpen(false)}>
                  <BookOpen size={18} />
                  <span>My Library</span>
                </Link>
                <Link to="/cart" className="mobile-menu-action" onClick={() => setMenuOpen(false)}>
                  <ShoppingCart size={18} />
                  <span>Cart</span>
                  {cartCount > 0 && <span className="mobile-menu-badge">{cartCount}</span>}
                </Link>
                <Link to="/wishlist" className="mobile-menu-action" onClick={() => setMenuOpen(false)}>
                  <Heart size={18} />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && <span className="mobile-menu-badge">{wishlistCount}</span>}
                </Link>
                <button
                  className="mobile-menu-action"
                  onClick={() => { setMenuOpen(false); handleTopUp(); }}
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", width: "100%", textAlign: "left" }}
                >
                  <Coins size={18} />
                  <span className="mobile-menu-coin-balance">{coins} coins ({formatCoinsAsCurrency(coins)})</span>
                  <span className="mobile-menu-topup-label">Top up</span>
                </button>
                <Link to="/settings" className="mobile-menu-action" onClick={() => setMenuOpen(false)}>
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
                {(profile?.role === "staff" || profile?.role === "manager") && (
                  <Link to="/admin" className="mobile-menu-action" onClick={() => setMenuOpen(false)}>
                    <Shield size={18} />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <button
                  className="mobile-menu-action mobile-menu-logout"
                  onClick={() => { setMenuOpen(false); signOut(); }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}

            {!user && (
              <Link
                to="/login"
                className="mobile-menu-login"
                onClick={() => setMenuOpen(false)}
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
