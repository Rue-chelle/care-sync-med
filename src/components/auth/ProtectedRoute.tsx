
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "@/stores/userStore";

type UserRole = "patient" | "doctor" | "admin";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useUserStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If a specific role is required, check for that role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user?.role === "patient") {
      return <Navigate to="/patient" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
