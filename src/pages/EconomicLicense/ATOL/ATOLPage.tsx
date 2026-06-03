import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ATOLForm from "./ATOLForm";
import RecordWorkflowSection from "@/components/RecordWorkflowSection";
import SimpleLiveList, { dateCol, statusBadge } from "@/components/SimpleLiveList";


const ATOLPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Air Travel Organizer's License (ATOL) Management</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add New ATOL</Button>
      </div>

      {isFormOpen && (
        <>
          <RecordWorkflowSection tableName="atol_licenses" editingId={editingId} />
          <ATOLForm onCancel={() => setIsFormOpen(false)} editingId={editingId} />
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>ATOL Records List</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleLiveList
            table="atol_licenses"
            onEdit={(id) => { setEditingId(id); setIsFormOpen(true); }}
            columns={[ { key: "operator_name", label: "Operator" }, { key: "license_number", label: "License #" }, { key: "issue_date", label: "Issued", format: dateCol }, { key: "expiry_date", label: "Expires", format: dateCol }, { key: "status", label: "Status", format: statusBadge } ]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ATOLPage;
