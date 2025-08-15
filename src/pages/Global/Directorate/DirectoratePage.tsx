import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Building } from "lucide-react";
import DirectorateTable from "./DirectorateTable";
import DirectorateForm from "./DirectorateForm";

const DirectoratePage = () => {
  const [activeTab, setActiveTab] = useState("view");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setActiveTab("add");
  };

  const handleCancel = () => {
    setEditingId(null);
    setActiveTab("view");
  };

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case "view":
        return "Search directorates...";
      default:
        return "Search...";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Directorate Management</h1>
          <p className="text-muted-foreground">
            Manage organizational directorates
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TabsList>
            <TabsTrigger value="view">View Directorates</TabsTrigger>
            <TabsTrigger value="add">
              {editingId ? "Edit Directorate" : "Add Directorate"}
            </TabsTrigger>
          </TabsList>
          
          <div className="w-full sm:w-72">
            <Input
              placeholder={getSearchPlaceholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <TabsContent value="view" className="space-y-4">
          <DirectorateTable 
            searchQuery={searchQuery}
            onEdit={handleEdit}
            refreshTrigger={refreshTrigger}
          />
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <DirectorateForm 
            onCancel={handleCancel}
            editingId={editingId}
            onSuccess={handleSuccess}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DirectoratePage;