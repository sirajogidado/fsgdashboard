
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CertificateTypeForm from "./CertificateTypeForm";
import CertificateTypeTable from "./CertificateTypeTable";

const CertificateTypePage = () => {
  const [activeTab, setActiveTab] = useState<string>("view");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setActiveTab("add");
  };

  const handleCancel = () => {
    setEditingId(null);
    setActiveTab("view");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Certificate Type</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="view">View Certificate Types</TabsTrigger>
            <TabsTrigger value="add">{editingId ? "Edit Certificate Type" : "Add Certificate Type"}</TabsTrigger>
          </TabsList>
          
          {activeTab === "view" && (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search certificate types..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Type Records</CardTitle>
            </CardHeader>
            <CardContent>
              <CertificateTypeTable searchQuery={searchQuery} onEdit={handleEdit} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Certificate Type" : "Add New Certificate Type"}</CardTitle>
            </CardHeader>
            <CardContent>
              <CertificateTypeForm onCancel={handleCancel} editingId={editingId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CertificateTypePage;
