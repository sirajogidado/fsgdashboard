import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FCOPForm from "./FCOPForm";
import RecordWorkflowSection from "@/components/RecordWorkflowSection";

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
          <p>FCOP records list will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FCOPPage;
