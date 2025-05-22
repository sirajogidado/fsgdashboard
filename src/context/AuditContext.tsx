
import React, { createContext, useContext, ReactNode, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { v4 as uuidv4 } from "uuid";
import { AuditAction, AuditEntry, AuditSection } from "@/types/audit";

interface AuditContextType {
  logAction: (action: AuditAction, section: AuditSection, itemId: string, itemName: string, details: string) => void;
  getAuditLog: () => AuditEntry[];
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export function AuditProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const logAction = useCallback((
    action: AuditAction,
    section: AuditSection,
    itemId: string,
    itemName: string,
    details: string
  ) => {
    if (!user) return;

    const newEntry: AuditEntry = {
      id: uuidv4(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      userDirectorate: user.directorate,
      action,
      section,
      itemId,
      itemName,
      details,
      timestamp: new Date(),
    };

    // Get existing log entries from localStorage
    const existingEntries = localStorage.getItem("ncaa_audit_log");
    const auditLog: AuditEntry[] = existingEntries ? JSON.parse(existingEntries) : [];
    
    // Add new entry and save back to localStorage
    auditLog.push(newEntry);
    localStorage.setItem("ncaa_audit_log", JSON.stringify(auditLog));
    
    console.log(`Audit log: ${action} action on ${section} by ${user.name}`);
  }, [user]);

  const getAuditLog = useCallback((): AuditEntry[] => {
    const existingEntries = localStorage.getItem("ncaa_audit_log");
    return existingEntries ? JSON.parse(existingEntries) : [];
  }, []);

  return (
    <AuditContext.Provider value={{ logAction, getAuditLog }}>
      {children}
    </AuditContext.Provider>
  );
}

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (context === undefined) {
    throw new Error("useAudit must be used within an AuditProvider");
  }
  return context;
};
