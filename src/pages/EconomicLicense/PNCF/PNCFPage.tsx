import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PNCFForm from "./PNCFForm";

const PNCFPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Private Non-Commercial Flight (PNCF) Management</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add New PNCF</Button>
      </div>

      {isFormOpen && (
        <PNCFForm 
          onCancel={() => setIsFormOpen(false)} 
          editingId={editingId} 
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>PNCF Records List</CardTitle>
        </CardHeader>
        <CardContent>
          <p>PNCF records list will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PNCFPage;