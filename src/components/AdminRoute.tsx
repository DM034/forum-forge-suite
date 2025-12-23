import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  // admin = roleName ADMIN OU roleId du rôle ADMIN
  const isAdmin =
    user.roleName === "ADMIN" || user.role?.name === "ADMIN" || user.isModerator === true;

  if (!isAdmin) return <Navigate to="/community" replace />;
  return <>{children}</>;
}
