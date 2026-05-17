import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import {
  ensureRecordWorkflow,
  approveStage,
  rejectStage,
  submitForApproval,
  resetToDraft,
  RecordWorkflow,
  STAGE_COLORS,
  STAGE_LABELS,
} from "@/lib/workflow";
import { Check, X, Send, RotateCcw, Loader2 } from "lucide-react";

interface Props {
  tableName: string;
  recordId: string;
  directorate?: string | null;
}

const WorkflowActionBar: React.FC<Props> = ({ tableName, recordId, directorate }) => {
  const { user } = useAuth();
  const [wf, setWf] = useState<RecordWorkflow | null>(null);
  const [users, setUsers] = useState<{ id: string; name: string; role: string }[]>([]);
  const [assignTo, setAssignTo] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const w = await ensureRecordWorkflow(tableName, recordId, directorate);
        setWf(w);
        const { data } = await supabase
          .from("users")
          .select("id,name,role")
          .eq("is_active", true)
          .neq("role", "Read and View");
        setUsers((data as any[]) ?? []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tableName, recordId, directorate]);

  const actor = user ? { id: user.id, name: user.name } : null;

  const run = async (fn: () => Promise<RecordWorkflow>) => {
    if (!actor) return;
    setBusy(true);
    try {
      const updated = await fn();
      setWf(updated);
      toast({ title: "Workflow updated", description: STAGE_LABELS[updated.current_stage] });
    } catch (e: any) {
      toast({ title: "Action failed", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  if (loading || !wf) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading workflow…
      </div>
    );
  }

  const stage = wf.current_stage;
  const isTerminal = stage === "approved" || stage === "rejected" || stage === "expired";
  const isAssignedToMe = wf.assigned_to === user?.id;
  const isSuperUser = user?.role === "Super User";
  const canAct = isAssignedToMe || isSuperUser;

  return (
    <div className="border rounded-lg p-4 bg-card space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Workflow Stage:</span>
          <Badge className={STAGE_COLORS[stage] ?? ""}>{STAGE_LABELS[stage] ?? stage}</Badge>
          {wf.rejection_reason && (
            <span className="text-xs text-red-600 ml-2">Reason: {wf.rejection_reason}</span>
          )}
        </div>
        {wf.submitted_at && (
          <span className="text-xs text-muted-foreground">
            Submitted {new Date(wf.submitted_at).toLocaleString()}
          </span>
        )}
      </div>

      {!isTerminal && (
        <div className="flex flex-wrap items-end gap-2">
          {(stage === "draft" || stage === "submitted" || stage === "inspector_review") && (
            <div className="flex-1 min-w-[180px]">
              <Label className="text-xs">Assign next reviewer</Label>
              <Select value={assignTo} onValueChange={setAssignTo}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select reviewer" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {stage === "draft" && (
              <Button
                size="sm"
                disabled={busy || !actor}
                onClick={() =>
                  run(() =>
                    submitForApproval(tableName, recordId, actor!, {
                      assignTo: assignTo || undefined,
                      directorate,
                    }),
                  )
                }
              >
                <Send className="h-4 w-4 mr-1" /> Submit
              </Button>
            )}

            {stage !== "draft" && canAct && (
              <>
                <Button
                  size="sm"
                  variant="default"
                  disabled={busy}
                  onClick={() =>
                    run(() =>
                      approveStage(tableName, recordId, actor!, {
                        assignTo: assignTo || undefined,
                      }),
                    )
                  }
                >
                  <Check className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={busy}
                  onClick={() => setRejectOpen(true)}
                >
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
              </>
            )}
            {stage !== "draft" && !canAct && (
              <span className="text-xs text-muted-foreground">
                Awaiting action by assignee
              </span>
            )}
          </div>
        </div>
      )}

      {isTerminal && isSuperUser && (
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => run(() => resetToDraft(tableName, recordId, actor!))}
        >
          <RotateCcw className="h-4 w-4 mr-1" /> Reset to Draft
        </Button>
      )}

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject this record</DialogTitle>
            <DialogDescription>
              Provide a reason. The submitter will be notified.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for rejection"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!reason.trim() || busy}
              onClick={async () => {
                setRejectOpen(false);
                await run(() => rejectStage(tableName, recordId, actor!, reason.trim()));
                setReason("");
              }}
            >
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowActionBar;
