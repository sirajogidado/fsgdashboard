
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import CertificateTypeTable from "./CertificateTypeTable";
import CertificateTypeForm from "./CertificateTypeForm";

const CertificateTypePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    setIsFormVisible(true);
    setEditingId(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Certificate Type</h2>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Button onClick={toggleForm}>
          <Plus className="mr-2 h-4 w-4" />
          {isFormVisible ? "Hide Form" : "Add Certificate Type"}
        </Button>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search certificate type..."
            className="pl-8 w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isFormVisible && (
        <Card>
          <CardContent className="pt-6">
            <CertificateTypeForm 
              onCancel={toggleForm} 
              editingId={editingId} 
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <CertificateTypeTable 
            searchQuery={searchQuery} 
            onEdit={handleEdit} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificateTypePage;
