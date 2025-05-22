
export type AuditAction = "create" | "update" | "delete" | "view";

export type AuditSection = 
  | "aircraft-manufacturer"
  | "aircraft-type"
  | "foreign-registration"
  | "foreign-amo"
  | "general-aviation"
  | "operation-type"
  | "state-registry"
  | "training-organization"
  | "travel-agency"
  | "foreign-airline"
  | "certificate-type"
  | "aoc"
  | "ato"
  | "foreign-airline-dacl"
  | "ac-status"
  | "local-amo"
  | "users";

export interface AuditEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  userDirectorate: string;
  action: AuditAction;
  section: AuditSection;
  itemId: string;
  itemName: string;
  details: string;
  timestamp: Date;
  ipAddress?: string;
}
