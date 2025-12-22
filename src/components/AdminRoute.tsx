import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ADMIN_ROLE_ID = "ROLE001";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (user.roleId !== ADMIN_ROLE_ID) return <Navigate to="/community" replace />;

  return <>{children}</>;
}
