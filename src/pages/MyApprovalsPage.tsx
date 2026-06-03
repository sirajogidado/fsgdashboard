import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { STAGE_COLORS, STAGE_LABELS, approveStage, rejectStage } from "@/lib/workflow";
import { Loader2, Inbox, Check, X, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { routeForRecord } from "@/lib/expiryRoutes";

interface WorkflowRow {
  id: string;
  table_name: string;
  record_id: string;
  current_stage: string;
  assigned_to: string | null;
  submitted_by: string | null;
  submitted_at: string | null;
  rejection_reason: string | null;
  updated_at: string;
}

const TABLE_LABELS: Record<string, string> = {
  aoc_certificates: "AOC Certificate",
  ato_licenses: "ATO License",
  amo_licenses: "AMO License",
  aerodrome_certifications: "Aerodrome Certification",
  paas_licenses: "PAAS License",
  aop_licenses: "AOP License",
  atl_licenses: "ATL License",
  atol_licenses: "ATOL License",
  fcop_licenses: "FCOP License",
  pncl_licenses: "PNCL License",
  acceptance_certificates: "Acceptance Certificate",
  focc_mcc_records: "FOCC/MCC Record",
  foreign_airline_dacl: "Foreign Airline DACL",
  safety_inspections: "Safety Inspection",
};

const TERMINAL = new Set(["approved", "rejected", "expired"]);

const MyApprovalsPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<WorkflowRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("assigned");
  const [actingId, setActingId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<WorkflowRow | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = async () => {
    if (!user) return;
    setLoading(true);
    let q = supabase
      .from("record_workflow")
      .select("*")
      .order("updated_at", { ascending: false });

    if (tab === "assigned") {
      q = q.eq("assigned_to", user.id).not("current_stage", "in", "(approved,rejected,expired)");
    } else if (tab === "submitted") {
      q = q.eq("submitted_by", user.id);
    }

    const { data, error } = await q.limit(200);
    if (!error) setItems((data ?? []) as WorkflowRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user, tab]);

  const isSuperUser = user?.role === "Super User";

  const handleApprove = async (row: WorkflowRow) => {
    if (!user) return;
    setActingId(row.id);
    try {
      await approveStage(row.table_name, row.record_id, { id: user.id, name: user.name });
      toast({ title: "Approved", description: "Record advanced to next stage." });
      load();
    } catch (e: any) {
      toast({ title: "Approve failed", description: e.message, variant: "destructive" });
    } finally {
      setActingId(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!user || !rejectTarget) return;
    if (!rejectReason.trim()) {
      toast({ title: "Reason required", description: "Please provide a rejection reason.", variant: "destructive" });
      return;
    }
    setActingId(rejectTarget.id);
    try {
      await rejectStage(rejectTarget.table_name, rejectTarget.record_id, { id: user.id, name: user.name }, rejectReason.trim());
      toast({ title: "Rejected", description: "Record marked as rejected." });
      setRejectTarget(null);
      setRejectReason("");
      load();
    } catch (e: any) {
      toast({ title: "Reject failed", description: e.message, variant: "destructive" });
    } finally {
      setActingId(null);
    }
  };

  const canAct = (row: WorkflowRow) =>
    !TERMINAL.has(row.current_stage) &&
    (row.assigned_to === user?.id || isSuperUser);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Approvals</h1>
        <p className="text-muted-foreground">Records moving through the certification workflow</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="assigned">Awaiting My Action</TabsTrigger>
          <TabsTrigger value="submitted">My Submissions</TabsTrigger>
          {isSuperUser && <TabsTrigger value="all">All Workflows</TabsTrigger>}
        </TabsList>

        <TabsContent value={tab}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {tab === "assigned"
                  ? "Records waiting for you to review or approve"
                  : tab === "submitted"
                    ? "Records you submitted"
                    : "All workflow activity"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Inbox className="h-10 w-10 mb-2 opacity-40" />
                  <p>Nothing here yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Record Type</TableHead>
                      <TableHead>Record ID</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">
                          {TABLE_LABELS[row.table_name] ?? row.table_name}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {row.record_id.slice(0, 8)}…
                        </TableCell>
                        <TableCell>
                          <Badge className={STAGE_COLORS[row.current_stage]}>
                            {STAGE_LABELS[row.current_stage] ?? row.current_stage}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(row.updated_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-xs">
                          {row.rejection_reason && (
                            <span className="text-red-600">{row.rejection_reason}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-1 whitespace-nowrap">
                          <Button asChild size="sm" variant="ghost" title="Open record">
                            <Link to={routeForRecord(row.table_name, row.record_id)}>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                          {canAct(row) && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-green-600 hover:bg-green-700"
                                disabled={actingId === row.id}
                                onClick={() => handleApprove(row)}
                              >
                                {actingId === row.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3 mr-1" />}
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={actingId === row.id}
                                onClick={() => { setRejectTarget(row); setRejectReason(""); }}
                              >
                                <X className="h-3 w-3 mr-1" /> Reject
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!rejectTarget} onOpenChange={(o) => !o && setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject record</DialogTitle>
            <DialogDescription>
              Tell the submitter why this record is being rejected. They will receive a notification.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRejectConfirm} disabled={!!actingId}>
              {actingId ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyApprovalsPage;
