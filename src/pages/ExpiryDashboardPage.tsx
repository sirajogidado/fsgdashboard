import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ExpiryFinding, RiskLevel, riskColor, riskLabel, toCSV } from "@/lib/expiry";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { AlertTriangle, Download, Loader2, RefreshCw, Search } from "lucide-react";

const RISK_ORDER: RiskLevel[] = ["expired", "critical", "high", "medium", "low"];

const ExpiryDashboardPage = () => {
  const [findings, setFindings] = useState<ExpiryFinding[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<RiskLevel | "all">("all");
  const [lastScan, setLastScan] = useState<string | null>(null);

  const runScan = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("expiry-scanner");
      if (error) throw error;
      setFindings(data?.findings ?? []);
      setLastScan(new Date().toLocaleString());
      toast({
        title: "Scan complete",
        description: `${data?.findings?.length ?? 0} items flagged · ${data?.notificationsCreated ?? 0} notifications`,
      });
    } catch (e: any) {
      toast({ title: "Scan failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { runScan(); }, []);

  const buckets = useMemo(() => {
    const b: Record<RiskLevel, number> = { expired: 0, critical: 0, high: 0, medium: 0, low: 0, ok: 0 };
    findings.forEach(f => { b[f.risk_level]++; });
    return b;
  }, [findings]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return findings
      .filter(f => filter === "all" || f.risk_level === filter)
      .filter(f =>
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.module.toLowerCase().includes(q) ||
        (f.number ?? "").toLowerCase().includes(q)
      )
      .sort((a, b) => a.days_left - b.days_left);
  }, [findings, search, filter]);

  const downloadCSV = () => {
    const blob = new Blob([toCSV(filtered)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expiry-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-7 w-7 text-amber-500" />
            Compliance & Expiry Dashboard
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Certificates expiring within 90 days across all modules
            {lastScan && ` · Last scan: ${lastScan}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runScan} disabled={loading} variant="outline">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
            Run scan now
          </Button>
          <Button onClick={downloadCSV} disabled={!filtered.length}>
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Heatmap */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {RISK_ORDER.map(level => (
          <Card
            key={level}
            className={`cursor-pointer transition ${filter === level ? "ring-2 ring-primary" : ""}`}
            onClick={() => setFilter(filter === level ? "all" : level)}
          >
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">{riskLabel(level)}</div>
              <div className="text-3xl font-bold mt-1">{buckets[level]}</div>
              <Badge className={`${riskColor(level)} mt-2`} variant="outline">{level}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row justify-between items-center">
          <CardTitle>Findings {filter !== "all" && <span className="text-sm font-normal text-muted-foreground">· {riskLabel(filter)}</span>}</CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8 w-[250px]" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Scanning all modules...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No items match the current filter.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead>Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((f, i) => (
                  <TableRow key={`${f.table}-${f.record_id}-${i}`}>
                    <TableCell className="font-medium">{f.module}</TableCell>
                    <TableCell>{f.name}</TableCell>
                    <TableCell className="text-muted-foreground">{f.number || "—"}</TableCell>
                    <TableCell>{f.expiry_date}</TableCell>
                    <TableCell className={f.days_left < 0 ? "text-red-600 font-semibold" : ""}>{f.days_left}</TableCell>
                    <TableCell>
                      <Badge className={riskColor(f.risk_level)} variant="outline">
                        {riskLabel(f.risk_level)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpiryDashboardPage;
