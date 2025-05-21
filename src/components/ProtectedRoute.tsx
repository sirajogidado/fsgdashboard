
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Directorate } from "../types/auth";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "Super User" | "Technical" | "Read and View";
  requiredDirectorate?: Directorate | Directorate[];
  allowReadOnly?: boolean;
  globalOperations?: boolean;
}

const ProtectedRoute = ({ 
  children,
  requiredRole,
  requiredDirectorate,
  allowReadOnly = true,
  globalOperations = false
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ncaa-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login and save the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check for Global Operations access (Super User and ICT only)
  if (globalOperations && user.role !== "Super User" && user.directorate !== "ICT") {
    toast({
      title: "Access Denied",
      description: "Only Super Users and ICT directorate can access Global Operations",
      variant: "destructive"
    });
    return <Navigate to="/unauthorized" replace />;
  }

  // Check for required role
  if (requiredRole && user.role !== requiredRole) {
    if (requiredRole === "Super User" || 
        (requiredRole === "Technical" && user.role === "Read and View")) {
      toast({
        title: "Access Denied",
        description: `This section requires ${requiredRole} permission`,
        variant: "destructive"
      });
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check for required directorate
  if (requiredDirectorate) {
    const directorates = Array.isArray(requiredDirectorate) 
      ? requiredDirectorate 
      : [requiredDirectorate];
    
    if (!directorates.includes(user.directorate) && 
        user.directorate !== "ICT" && 
        user.role !== "Super User") {
      toast({
        title: "Access Denied",
        description: "You don't have access to this section based on your directorate",
        variant: "destructive"
      });
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check if read-only user is trying to access non-read-only content
  if (!allowReadOnly && user.role === "Read and View") {
    toast({
      title: "Access Denied",
      description: "Read and View users cannot modify data",
      variant: "destructive"
    });
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
