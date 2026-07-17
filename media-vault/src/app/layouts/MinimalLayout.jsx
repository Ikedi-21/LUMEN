import { Outlet } from "react-router-dom";
import { PageTransitionWrapper } from "@/shared/ui";

export default function MinimalLayout() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      <div style={{ width: "100%", maxWidth: "440px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-card)", padding: "40px" }}>
        <PageTransitionWrapper>
          <Outlet />
        </PageTransitionWrapper>
      </div>
    </div>
  );
}
