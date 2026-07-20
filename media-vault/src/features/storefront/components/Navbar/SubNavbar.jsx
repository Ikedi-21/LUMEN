import { Link, useLocation, useSearchParams } from "react-router-dom";
import { LayoutGrid, Film, Book, BookOpen, Newspaper } from "lucide-react";
import "./SubNavbar.css";

const sections = [
  { id: "all", name: "All Categories", icon: LayoutGrid, path: "/" },
  { id: "movie", name: "Movies", icon: Film, path: "/browse/movie" },
  { id: "book", name: "Books", icon: Book, path: "/browse/book" },
  { id: "manga", name: "Manga", icon: BookOpen, path: "/browse/manga" },
  { id: "comic", name: "Comics", icon: Newspaper, path: "/browse/comic" },
];

export default function SubNavbar() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isHomepage = location.pathname === "/";
  const activeSection = isHomepage ? (searchParams.get("section") || "all") : null;

  return (
    <div className="sub-navbar">
      <div className="sub-navbar-inner">
        <div className="sub-navbar-links">
          {sections.map(({ id, name, icon: Icon, path }) => {
            const isActive = isHomepage
              ? activeSection === id
              : location.pathname === path;

            const toPath = isHomepage ? `/?section=${id}` : path;

            return (
              <Link
                key={id}
                to={toPath}
                className={`sub-navbar-link ${isActive ? "sub-navbar-link--active" : ""}`}
              >
                <Icon size={14} strokeWidth={2.2} />
                <span>{name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
