import { Outlet } from "react-router-dom";
import { Navbar, SubNavbar, Footer } from "@/features/storefront";
import { PageTransitionWrapper } from "@/shared/ui";

export default function StorefrontLayout() {
  return (
    <>
      <Navbar />
      <SubNavbar />
      <main style={{ minHeight: "70vh" }}>
        <PageTransitionWrapper>
          <Outlet />
        </PageTransitionWrapper>
      </main>
      <Footer />
    </>
  );
}
