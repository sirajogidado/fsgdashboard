
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ForeignAMOForm from "./ForeignAMOForm";
import ForeignAMOList from "./ForeignAMOList";

const ForeignAMOPage = () => {
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
        <h2 className="text-3xl font-bold tracking-tight">Foreign AMO</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="view">View Foreign AMO</TabsTrigger>
            <TabsTrigger value="add">{editingId ? "Edit Foreign AMO" : "Add Foreign AMO"}</TabsTrigger>
          </TabsList>
          
          {activeTab === "view" && (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search AMO..."
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
              <CardTitle>Foreign AMO Records</CardTitle>
            </CardHeader>
            <CardContent>
              <ForeignAMOList searchQuery={searchQuery} onEdit={handleEdit} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Foreign AMO" : "Add New Foreign AMO"}</CardTitle>
            </CardHeader>
            <CardContent>
              <ForeignAMOForm onCancel={handleCancel} editingId={editingId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ForeignAMOPage;
