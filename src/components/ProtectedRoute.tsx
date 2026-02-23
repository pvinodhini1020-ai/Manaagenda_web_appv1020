import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  // Check if authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/dashboard" replace />;
      case 'employee':
        return <Navigate to="/dashboard" replace />;
      case 'client':
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
