
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import UserRolesForm from "./UserRolesForm";
import UserRolesTable from "./UserRolesTable";
import AuditTrailTable from "./AuditTrailTable";

const UserRolesPage = () => {
  const { user } = useAuth();
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

  // Check if user is Super User
  const isSuperUser = user?.role === "Super User";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">User Roles Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="view">View User Roles</TabsTrigger>
            <TabsTrigger value="add">{editingId ? "Edit User Role" : "Add User Role"}</TabsTrigger>
            {isSuperUser && <TabsTrigger value="directorates">Directorates</TabsTrigger>}
            {isSuperUser && <TabsTrigger value="audit">Audit Trail</TabsTrigger>}
          </TabsList>
          
          {(activeTab === "view" || activeTab === "directorates" || (activeTab === "audit" && isSuperUser)) && (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={
                  activeTab === "audit" 
                    ? "Search audit trail..." 
                    : activeTab === "directorates"
                    ? "Search directorates..."
                    : "Search users..."
                }
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
              <CardTitle>User Roles Records</CardTitle>
            </CardHeader>
            <CardContent>
              <UserRolesTable searchQuery={searchQuery} onEdit={handleEdit} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit User Role" : "Add New User Role"}</CardTitle>
            </CardHeader>
            <CardContent>
              <UserRolesForm onCancel={handleCancel} editingId={editingId} />
            </CardContent>
          </Card>
        </TabsContent>

        {isSuperUser && (
          <TabsContent value="directorates">
            <Card>
              <CardHeader>
                <CardTitle>Directorates Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Directorates management will be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {isSuperUser && (
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <AuditTrailTable searchQuery={searchQuery} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default UserRolesPage;
