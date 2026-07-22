import { Outlet } from "react-router-dom";
import { PageTransitionWrapper } from "@/shared/ui";

export default function MinimalLayout() {
  return (
    <div className="minimal-layout-wrapper">
      <div className="minimal-layout-container">
        <PageTransitionWrapper>
          <Outlet />
        </PageTransitionWrapper>
      </div>
    </div>
  );
}
