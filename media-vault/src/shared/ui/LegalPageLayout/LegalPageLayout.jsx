import "./LegalPageLayout.css";

export default function LegalPageLayout({ title, children }) {
  return (
    <div className="legal-page">
      <div className="legal-container">
        {title && <h1 className="legal-title">{title}</h1>}
        {children}
      </div>
    </div>
  );
}
