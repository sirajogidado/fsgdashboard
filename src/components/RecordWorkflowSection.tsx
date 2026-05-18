import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WorkflowActionBar from "./WorkflowActionBar";

interface Props {
  tableName: string;
  editingId?: string | null;
  directorate?: string | null;
}

/**
 * Renders the workflow action bar for the record being edited.
 * Only visible when an existing record (editingId) is selected.
 */
const RecordWorkflowSection: React.FC<Props> = ({ tableName, editingId, directorate }) => {
  if (!editingId) return null;
  return (
    <Card className="mb-4 border-primary/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Approval Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <WorkflowActionBar tableName={tableName} recordId={editingId} directorate={directorate} />
      </CardContent>
    </Card>
  );
};

export default RecordWorkflowSection;
