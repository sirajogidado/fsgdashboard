import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const BACKUP_TABLES = [
  "aoc_certificates", "ato_licenses", "amo_licenses", "foreign_amo",
  "aerodrome_certifications", "aerodrome_personnel", "safety_inspections", "personnel_certifications",
  "paas_licenses", "aop_licenses", "atl_licenses", "atol_licenses", "fcop_licenses", "pncl_licenses",
  "acceptance_certificates", "focc_mcc_records", "foreign_airline_dacl", "aircraft_status",
  "aircraft_manufacturers", "aircraft_types", "certificate_types", "operation_types",
  "foreign_airlines", "foreign_registration_marks", "general_aviation", "state_of_registry",
  "training_organizations", "travel_agencies", "directorates", "user_roles_config",
  "users", "user_module_access", "notifications", "notification_preferences",
  "record_workflow", "workflow_transitions", "workflow_stages", "audit_trail",
];

const BackupPanel = () => {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  const runBackup = async () => {
    setRunning(true);
    setProgress("Starting backup...");
    const payload: Record<string, any> = {
      generated_at: new Date().toISOString(),
      version: 1,
      tables: {},
    };
    const errors: string[] = [];

    for (const table of BACKUP_TABLES) {
      setProgress(`Exporting ${table}...`);
      const { data, error } = await (supabase as any).from(table).select("*");
      if (error) {
        errors.push(`${table}: ${error.message}`);
        payload.tables[table] = { error: error.message };
      } else {
        payload.tables[table] = data ?? [];
      }
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fsg-backup-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);

    const totalRows = Object.values(payload.tables).reduce(
      (sum: number, t: any) => sum + (Array.isArray(t) ? t.length : 0), 0,
    );
    toast({
      title: "Backup downloaded",
      description: `${totalRows} rows across ${BACKUP_TABLES.length} tables${errors.length ? ` · ${errors.length} table errors` : ""}.`,
      variant: errors.length ? "destructive" : "default",
    });

    setProgress(null);
    setRunning(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Backup</CardTitle>
        <CardDescription>
          Export every record in the database to a single JSON file you can download and store offline.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Includes {BACKUP_TABLES.length} tables — certificates, licenses, workflow, users, notifications,
          audit trail and global operations reference data.
        </div>
        <Button onClick={runBackup} disabled={running}>
          {running ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
          {running ? "Building backup..." : "Run Backup & Download JSON"}
        </Button>
        {progress && <div className="text-xs text-muted-foreground">{progress}</div>}
      </CardContent>
    </Card>
  );
};

export default BackupPanel;
