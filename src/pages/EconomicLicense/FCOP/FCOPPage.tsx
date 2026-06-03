import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FCOPForm from "./FCOPForm";
import RecordWorkflowSection from "@/components/RecordWorkflowSection";
import SimpleLiveList, { dateCol, statusBadge } from "@/components/SimpleLiveList";


const FCOPPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Foreign Carrier Operating Permit (FCOP) Management</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add New FCOP</Button>
      </div>

      {isFormOpen && (
        <>
          <RecordWorkflowSection tableName="fcop_licenses" editingId={editingId} />
          <FCOPForm onCancel={() => setIsFormOpen(false)} editingId={editingId} />
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>FCOP Records List</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleLiveList
            table="fcop_licenses"
            onEdit={(id) => { setEditingId(id); setIsFormOpen(true); }}
            columns={[ { key: "operator_name", label: "Operator" }, { key: "license_number", label: "License #" }, { key: "issue_date", label: "Issued", format: dateCol }, { key: "expiry_date", label: "Expires", format: dateCol }, { key: "status", label: "Status", format: statusBadge } ]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FCOPPage;
