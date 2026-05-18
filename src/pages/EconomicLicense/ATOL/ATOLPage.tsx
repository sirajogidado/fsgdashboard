import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ATOLForm from "./ATOLForm";
import RecordWorkflowSection from "@/components/RecordWorkflowSection";

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
          <p>ATOL records list will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ATOLPage;
