// Maps backend table names to their UI route + display module name.
export const TABLE_ROUTES: Record<string, string> = {
  aoc_certificates: "/aoc",
  ato_licenses: "/ato",
  aircraft_status: "/ac-status",
  foreign_airline_dacl: "/foreign-airline-dacl",
  amo_licenses: "/amo/local",
  focc_mcc_records: "/focc-mcc",
  acceptance_certificates: "/acceptance-certificate",
  aerodrome_certifications: "/daas/aerodrome-certifications",
  safety_inspections: "/daas/safety-inspections",
  aerodrome_personnel: "/daas/personnel",
  personnel_certifications: "/daas/personnel",
  paas_licenses: "/economic-license/paas",
  aop_licenses: "/economic-license/aop",
  atl_licenses: "/economic-license/atl",
  pncl_licenses: "/economic-license/pncf",
  atol_licenses: "/economic-license/atol",
  fcop_licenses: "/economic-license/fcop",
};

export function routeForRecord(table: string, recordId: string): string {
  const base = TABLE_ROUTES[table] ?? "/";
  return `${base}?recordId=${encodeURIComponent(recordId)}`;
}
