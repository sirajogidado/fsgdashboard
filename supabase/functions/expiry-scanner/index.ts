// Expiry Scanner — scans certificate tables for upcoming expiries and creates notifications.
// Runs daily via pg_cron. Can also be invoked manually from the Expiry Dashboard.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ScanTable {
  table: string;
  module: string;
  nameField: string;
  numberField: string;
  expiryField: string;
}

const TABLES: ScanTable[] = [
  { table: "aerodrome_certifications", module: "Aerodrome Certifications", nameField: "aerodrome_name", numberField: "certificate_number", expiryField: "expiry_date" },
  { table: "amo_licenses", module: "AMO", nameField: "approval_number", numberField: "approval_number", expiryField: "expiry_date" },
  { table: "aoc_certificates", module: "AOC", nameField: "operator_name", numberField: "certificate_number", expiryField: "expiry_date" },
  { table: "aop_licenses", module: "AOP", nameField: "operator_name", numberField: "license_number", expiryField: "expiry_date" },
  { table: "atl_licenses", module: "ATL", nameField: "operator_name", numberField: "license_number", expiryField: "expiry_date" },
  { table: "ato_licenses", module: "ATO", nameField: "organization_name", numberField: "certificate_number", expiryField: "expiry_date" },
  { table: "atol_licenses", module: "ATOL", nameField: "operator_name", numberField: "license_number", expiryField: "expiry_date" },
  { table: "fcop_licenses", module: "FCOP", nameField: "operator_name", numberField: "license_number", expiryField: "expiry_date" },
  { table: "focc_mcc_records", module: "FOCC/MCC", nameField: "operator_name", numberField: "record_number", expiryField: "expiry_date" },
  { table: "paas_licenses", module: "PAAS", nameField: "operator_name", numberField: "license_number", expiryField: "expiry_date" },
  { table: "personnel_certifications", module: "Personnel Certifications", nameField: "certification_name", numberField: "certification_number", expiryField: "expiry_date" },
  { table: "pncl_licenses", module: "PNCL", nameField: "operator_name", numberField: "license_number", expiryField: "expiry_date" },
  { table: "aircraft_status", module: "Aircraft Status", nameField: "registration_mark", numberField: "serial_number", expiryField: "cofa_expiry" },
];

const RISK_THRESHOLDS = [
  { days: 0, level: "expired", label: "EXPIRED" },
  { days: 7, level: "critical", label: "≤ 7 days" },
  { days: 30, level: "high", label: "≤ 30 days" },
  { days: 60, level: "medium", label: "≤ 60 days" },
  { days: 90, level: "low", label: "≤ 90 days" },
];

function riskFor(daysLeft: number) {
  if (daysLeft < 0) return RISK_THRESHOLDS[0];
  if (daysLeft <= 7) return RISK_THRESHOLDS[1];
  if (daysLeft <= 30) return RISK_THRESHOLDS[2];
  if (daysLeft <= 60) return RISK_THRESHOLDS[3];
  if (daysLeft <= 90) return RISK_THRESHOLDS[4];
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const today = new Date();
  const horizon = new Date();
  horizon.setDate(today.getDate() + 90);
  const todayISO = today.toISOString().slice(0, 10);
  const horizonISO = horizon.toISOString().slice(0, 10);

  const findings: any[] = [];
  let notificationsCreated = 0;

  // Fetch active users (Super User + Technical) to notify
  const { data: staff } = await supabase
    .from("users")
    .select("id, role")
    .in("role", ["Super User", "Technical"]);
  const staffIds = (staff ?? []).map((u: any) => u.id);

  for (const t of TABLES) {
    const { data, error } = await supabase
      .from(t.table)
      .select(`id, ${t.nameField}, ${t.numberField}, ${t.expiryField}`)
      .not(t.expiryField, "is", null)
      .lte(t.expiryField, horizonISO);
    if (error) {
      console.error(`scan ${t.table}:`, error.message);
      continue;
    }
    for (const row of data ?? []) {
      const exp = (row as any)[t.expiryField];
      if (!exp) continue;
      const daysLeft = Math.ceil(
        (new Date(exp).getTime() - new Date(todayISO).getTime()) / 86400000,
      );
      const risk = riskFor(daysLeft);
      if (!risk) continue;

      const name = (row as any)[t.nameField] ?? "Record";
      const num = (row as any)[t.numberField] ?? "";

      findings.push({
        table: t.table,
        module: t.module,
        record_id: (row as any).id,
        name,
        number: num,
        expiry_date: exp,
        days_left: daysLeft,
        risk_level: risk.level,
      });

      // Notify only at major thresholds to avoid spam (7, 30, 60, 90, expired)
      if ([0, 7, 30, 60, 90].includes(daysLeft) || daysLeft < 0) {
        const title = daysLeft < 0
          ? `EXPIRED: ${t.module} — ${name}`
          : `${t.module} expires in ${daysLeft}d — ${name}`;
        const body = `${num ? num + " · " : ""}Expiry: ${exp} (${risk.label})`;

        for (const uid of staffIds) {
          // Dedupe: skip if same notification already created today
          const { data: existing } = await supabase
            .from("notifications")
            .select("id")
            .eq("user_id", uid)
            .eq("title", title)
            .gte("created_at", `${todayISO}T00:00:00Z`)
            .limit(1);
          if (existing && existing.length) continue;

          await supabase.from("notifications").insert({
            user_id: uid,
            title,
            body,
            category: "expiry",
            link: "/expiry-dashboard",
            metadata: { table: t.table, record_id: (row as any).id, risk: risk.level },
          });
          notificationsCreated++;
        }
      }
    }
  }

  await supabase.from("audit_trail").insert({
    action: "EXPIRY_SCAN",
    module: "Compliance",
    user_name: "System",
    details: `Scanned ${TABLES.length} tables; ${findings.length} findings; ${notificationsCreated} notifications`,
  });

  return new Response(
    JSON.stringify({ ok: true, findings, notificationsCreated, scannedTables: TABLES.length }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
