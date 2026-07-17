import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { useEffect } from "react";

export default function RoleGuard({ allow, children }) {
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && profile && profile.status !== "active") {
      signOut();
    }
  }, [loading, profile, signOut]);

  if (loading) return <p>Loading...</p>;
  if (!user || !profile) return <Navigate to="/login" replace />;
  if (profile.status !== "active") return <Navigate to="/login" replace />;
  if (!allow.includes(profile.role)) return <Navigate to="/" replace />;

  return children;
}
