
import { useAuth } from "@/context/AuthContext";

export const usePermissions = () => {
  const { user } = useAuth();

  const canAdd = () => {
    return user?.role !== "Read and View";
  };

  const canEdit = () => {
    return user?.role !== "Read and View";
  };

  const canDelete = () => {
    return user?.role !== "Read and View";
  };

  const canAccessGlobalOperations = () => {
    return user?.role === "Super User";
  };

  const canAccessAuditTrail = () => {
    return user?.role === "Super User";
  };

  const canEditUserDetails = () => {
    return user?.role === "Super User";
  };

  return {
    canAdd,
    canEdit,
    canDelete,
    canAccessGlobalOperations,
    canAccessAuditTrail,
    canEditUserDetails
  };
};
