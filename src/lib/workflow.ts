import { supabase } from "@/integrations/supabase/client";

export type WorkflowStageKey =
  | "draft"
  | "submitted"
  | "inspector_review"
  | "director_review"
  | "approved"
  | "rejected"
  | "expired";

export interface WorkflowStage {
  id: string;
  stage_key: string;
  stage_name: string;
  stage_order: number;
  color: string;
  is_terminal: boolean;
}

export interface RecordWorkflow {
  id: string;
  table_name: string;
  record_id: string;
  current_stage: string;
  assigned_to: string | null;
  submitted_by: string | null;
  submitted_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  directorate: string | null;
  priority: string | null;
}

const STAGE_FLOW: Record<string, WorkflowStageKey> = {
  draft: "submitted",
  submitted: "inspector_review",
  inspector_review: "director_review",
  director_review: "approved",
};

export const STAGE_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  submitted: "bg-blue-100 text-blue-700",
  inspector_review: "bg-amber-100 text-amber-700",
  director_review: "bg-purple-100 text-purple-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  expired: "bg-red-100 text-red-700",
};

export const STAGE_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  inspector_review: "Inspector Review",
  director_review: "Director Approval",
  approved: "Approved",
  rejected: "Rejected",
  expired: "Expired",
};

/** Get or create the workflow row for a record. */
export async function ensureRecordWorkflow(
  tableName: string,
  recordId: string,
  directorate?: string | null,
): Promise<RecordWorkflow> {
  const { data: existing } = await supabase
    .from("record_workflow")
    .select("*")
    .eq("table_name", tableName)
    .eq("record_id", recordId)
    .maybeSingle();

  if (existing) return existing as RecordWorkflow;

  const { data, error } = await supabase
    .from("record_workflow")
    .insert({
      table_name: tableName,
      record_id: recordId,
      current_stage: "draft",
      directorate: directorate ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as RecordWorkflow;
}

export async function getRecordWorkflow(
  tableName: string,
  recordId: string,
): Promise<RecordWorkflow | null> {
  const { data } = await supabase
    .from("record_workflow")
    .select("*")
    .eq("table_name", tableName)
    .eq("record_id", recordId)
    .maybeSingle();
  return (data as RecordWorkflow) ?? null;
}

interface ActorInfo {
  id: string;
  name: string;
}

async function logTransition(
  workflowId: string,
  from: string,
  to: string,
  action: string,
  actor: ActorInfo,
  comment?: string,
) {
  await supabase.from("workflow_transitions").insert({
    record_workflow_id: workflowId,
    from_stage: from,
    to_stage: to,
    action,
    actor_id: actor.id,
    actor_name: actor.name,
    comment: comment ?? null,
  });

  await supabase.from("audit_trail").insert({
    action: `WORKFLOW_${action.toUpperCase()}`,
    user_id: actor.id,
    user_name: actor.name,
    module: "Workflow",
    details: `${from || "—"} → ${to}${comment ? ` · ${comment}` : ""}`,
  });
}

async function notify(
  userId: string,
  title: string,
  body: string,
  link?: string,
  category = "approvals",
) {
  if (!userId) return;
  await supabase.from("notifications").insert({
    user_id: userId,
    title,
    body,
    category,
    link: link ?? null,
  });
}

export async function submitForApproval(
  tableName: string,
  recordId: string,
  actor: ActorInfo,
  options?: { assignTo?: string; directorate?: string | null; comment?: string },
) {
  const wf = await ensureRecordWorkflow(tableName, recordId, options?.directorate);
  const next = STAGE_FLOW[wf.current_stage] ?? "submitted";

  const { data, error } = await supabase
    .from("record_workflow")
    .update({
      current_stage: next,
      assigned_to: options?.assignTo ?? null,
      submitted_by: actor.id,
      submitted_at: new Date().toISOString(),
      rejection_reason: null,
    })
    .eq("id", wf.id)
    .select()
    .single();

  if (error) throw error;

  await logTransition(wf.id, wf.current_stage, next, "SUBMIT", actor, options?.comment);

  if (options?.assignTo) {
    await notify(
      options.assignTo,
      "New record awaiting your review",
      `${tableName} record ${recordId.slice(0, 8)} submitted by ${actor.name}`,
      `/approvals`,
    );
  }

  return data as RecordWorkflow;
}

export async function approveStage(
  tableName: string,
  recordId: string,
  actor: ActorInfo,
  options?: { assignTo?: string; comment?: string },
) {
  const wf = await getRecordWorkflow(tableName, recordId);
  if (!wf) throw new Error("Workflow not found");
  const next = STAGE_FLOW[wf.current_stage] ?? "approved";
  const isFinal = next === "approved";

  const { data, error } = await supabase
    .from("record_workflow")
    .update({
      current_stage: next,
      assigned_to: isFinal ? null : options?.assignTo ?? null,
      approved_by: isFinal ? actor.id : wf.approved_by,
      approved_at: isFinal ? new Date().toISOString() : wf.approved_at,
    })
    .eq("id", wf.id)
    .select()
    .single();

  if (error) throw error;
  await logTransition(wf.id, wf.current_stage, next, "APPROVE", actor, options?.comment);

  if (wf.submitted_by) {
    await notify(
      wf.submitted_by,
      isFinal ? "Your record was approved" : "Your record advanced",
      `${tableName} ${recordId.slice(0, 8)}: now at ${STAGE_LABELS[next]}`,
      `/approvals`,
    );
  }
  if (!isFinal && options?.assignTo) {
    await notify(
      options.assignTo,
      "Record awaiting your review",
      `${tableName} ${recordId.slice(0, 8)} advanced by ${actor.name}`,
      `/approvals`,
    );
  }

  return data as RecordWorkflow;
}

export async function rejectStage(
  tableName: string,
  recordId: string,
  actor: ActorInfo,
  reason: string,
) {
  const wf = await getRecordWorkflow(tableName, recordId);
  if (!wf) throw new Error("Workflow not found");

  const { data, error } = await supabase
    .from("record_workflow")
    .update({
      current_stage: "rejected",
      rejection_reason: reason,
      assigned_to: null,
    })
    .eq("id", wf.id)
    .select()
    .single();

  if (error) throw error;
  await logTransition(wf.id, wf.current_stage, "rejected", "REJECT", actor, reason);

  if (wf.submitted_by) {
    await notify(
      wf.submitted_by,
      "Your record was rejected",
      `${tableName} ${recordId.slice(0, 8)}: ${reason}`,
      `/approvals`,
    );
  }

  return data as RecordWorkflow;
}

export async function resetToDraft(
  tableName: string,
  recordId: string,
  actor: ActorInfo,
) {
  const wf = await getRecordWorkflow(tableName, recordId);
  if (!wf) throw new Error("Workflow not found");
  const { data, error } = await supabase
    .from("record_workflow")
    .update({
      current_stage: "draft",
      assigned_to: null,
      rejection_reason: null,
    })
    .eq("id", wf.id)
    .select()
    .single();
  if (error) throw error;
  await logTransition(wf.id, wf.current_stage, "draft", "RESET", actor);
  return data as RecordWorkflow;
}
