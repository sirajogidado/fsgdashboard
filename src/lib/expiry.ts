export type RiskLevel = "expired" | "critical" | "high" | "medium" | "low" | "ok";

export interface ExpiryFinding {
  table: string;
  module: string;
  record_id: string;
  name: string;
  number: string;
  expiry_date: string;
  days_left: number;
  risk_level: RiskLevel;
}

export function riskColor(level: RiskLevel): string {
  switch (level) {
    case "expired": return "bg-red-600 text-white";
    case "critical": return "bg-red-100 text-red-700 border border-red-300";
    case "high": return "bg-orange-100 text-orange-700 border border-orange-300";
    case "medium": return "bg-amber-100 text-amber-700 border border-amber-300";
    case "low": return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    default: return "bg-green-50 text-green-700 border border-green-200";
  }
}

export function riskLabel(level: RiskLevel): string {
  return {
    expired: "Expired",
    critical: "≤ 7 days",
    high: "≤ 30 days",
    medium: "≤ 60 days",
    low: "≤ 90 days",
    ok: "OK",
  }[level];
}

export function toCSV(rows: ExpiryFinding[]): string {
  const header = ["Module", "Name", "Number", "Expiry Date", "Days Left", "Risk"];
  const lines = rows.map(r =>
    [r.module, r.name, r.number, r.expiry_date, r.days_left, r.risk_level]
      .map(v => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header.join(","), ...lines].join("\n");
}
