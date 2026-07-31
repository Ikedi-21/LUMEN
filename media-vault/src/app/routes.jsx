import { Routes, Route } from "react-router-dom";
import StorefrontLayout from "./layouts/StorefrontLayout";
import AdminLayout from "./layouts/AdminLayout";
import MinimalLayout from "./layouts/MinimalLayout";

import { HomePage, BrowsePage, ProductDetailPage, SearchPage, CartPage, WishlistPage, LibraryPage, WatchPage, ReceiptPage, TopUpPage, AboutPage, CareersPage, ContactPage, FAQPage, PrivacyPolicyPage, TermsOfServicePage, CookiePreferencesPage } from "@/features/storefront";
import { LoginPage, SignupPage, SettingsPage, StaffApplicationPage } from "@/features/auth";
import { AdminDashboardPage, ProductTable, ProductForm, EarningsPage } from "@/features/admin";
import SalesPage from "@/features/admin/pages/SalesPage";
import { StaffPage, PayoutReviewPage } from "@/features/manager";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Storefront / Public Routes */}
      <Route path="/" element={<StorefrontLayout />}>
        <Route index element={<HomePage />} />
        <Route path="browse/:type" element={<BrowsePage />} />
        <Route path="product/:type/:id" element={<ProductDetailPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="watch/:id" element={<WatchPage />} />
        <Route path="receipt" element={<ReceiptPage />} />
        <Route path="top-up" element={<TopUpPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="apply-staff" element={<StaffApplicationPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="careers" element={<CareersPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
        <Route path="terms" element={<TermsOfServicePage />} />
        <Route path="cookie-preferences" element={<CookiePreferencesPage />} />
      </Route>

      {/* Auth / Minimal Layout Routes */}
      <Route element={<MinimalLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<ProductTable />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="earnings" element={<EarningsPage />} />
        <Route path="payouts" element={<PayoutReviewPage />} />
      </Route>
    </Routes>
  );
}
