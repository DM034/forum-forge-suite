// src/components/AdminRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  // ADMIN = ROLE001 (selon ton code backend)
  if (user.roleId !== "ROLE001") return <Navigate to="/community" replace />;

  return <>{children}</>;
}
