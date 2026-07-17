import { AuthProvider } from "@/features/auth";
import { ToastProvider } from "@/shared/ui";
import { StorefrontProvider } from "@/features/storefront";

export default function AppProviders({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <StorefrontProvider>
          {children}
        </StorefrontProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
