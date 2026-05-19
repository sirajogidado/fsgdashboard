import React from "react";
import { Navigate } from "react-router-dom";
import { useModuleAccess, ModuleKey } from "@/hooks/useModuleAccess";

interface Props {
  moduleKey: ModuleKey;
  children: React.ReactNode;
}

const ModuleAccessRoute: React.FC<Props> = ({ moduleKey, children }) => {
  const { hasAccess, loading } = useModuleAccess(moduleKey);
  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }
  if (!hasAccess) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
};

export default ModuleAccessRoute;
