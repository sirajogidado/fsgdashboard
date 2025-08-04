
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Directorate } from "../types/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "Super User" | "Technical" | "Read and View";
  requiredDirectorate?: Directorate;
  allowReadOnly?: boolean;
  excludeDirectorates?: Directorate[];
  requireAIAccess?: boolean;
}

const ProtectedRoute = ({ 
  children,
  requiredRole,
  requiredDirectorate,
  allowReadOnly = true,
  excludeDirectorates = [],
  requireAIAccess = false
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ncaa-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check AI access requirement
  if (requireAIAccess && user.role === "Read and View") {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check for required role
  if (requiredRole && user.role !== requiredRole) {
    if (requiredRole === "Super User" || 
        (requiredRole === "Technical" && user.role === "Read and View")) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check for excluded directorates
  if (excludeDirectorates.length > 0 && 
      excludeDirectorates.includes(user.directorate) && 
      user.role !== "Super User") {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check for required directorate
  if (requiredDirectorate && 
      user.directorate !== requiredDirectorate && 
      user.directorate !== "ICT" && 
      user.role !== "Super User") {
    return <Navigate to="/unauthorized" replace />;
  }

  // Special restriction for DATR users - only Technical role can access Economic License
  if (user.directorate === "DATR" && 
      user.role !== "Technical" && 
      user.role !== "Super User" &&
      location.pathname.startsWith("/economic-license")) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if read-only user is trying to access non-read-only content
  if (!allowReadOnly && user.role === "Read and View") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
