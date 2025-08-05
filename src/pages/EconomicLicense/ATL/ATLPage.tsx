import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ATLForm from "./ATLForm";

const ATLPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Air Transport License (ATL) Management</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add New ATL</Button>
      </div>

      {isFormOpen && (
        <ATLForm 
          onCancel={() => setIsFormOpen(false)} 
          editingId={editingId} 
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>ATL Records List</CardTitle>
        </CardHeader>
        <CardContent>
          <p>ATL records list will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ATLPage;