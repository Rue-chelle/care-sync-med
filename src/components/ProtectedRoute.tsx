
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "@/stores/userStore";

type UserRole = "patient" | "doctor" | "admin" | "super_admin";

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
    // Redirect to appropriate dashboard based on user's actual role
    if (user?.role === "super_admin") {
      return <Navigate to="/super-admin" replace />;
    } else if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user?.role === "patient") {
      return <Navigate to="/patient" replace />;
    } else if (user?.role === "doctor") {
      return <Navigate to="/doctor" replace />;
    } else {
      // If no valid role, redirect to auth
      return <Navigate to="/auth" replace />;
    }
  }

  return <>{children}</>;
};
