
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DataTable } from "@/components/DataTable/DataTable";
import { Directorate, UserRole } from "@/types/auth";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendingRegistrations from "@/components/PendingRegistrations";
import { callAuthApi } from "@/lib/authApi";
import ModuleAccessDialog from "@/components/ModuleAccessDialog";

interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  directorate: string;
  role: string;
  profile_image: string;
  is_active: boolean;
}

const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<DatabaseUser | null>(null);
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessUser, setAccessUser] = useState<DatabaseUser | null>(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    directorate: "DAWS" as Directorate,
    role: "Technical" as UserRole,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { users } = await callAuthApi<{ users: DatabaseUser[] }>("list_users");
      setUsers(users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditUser = (user: DatabaseUser) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      phoneNumber: user.phone_number || "",
      password: "", // Don't prefill password
      directorate: user.directorate as Directorate,
      role: user.role as UserRole,
    });
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      await callAuthApi("update_user", {
        id: editingUser.id,
        name: newUser.name,
        email: newUser.email,
        phone_number: newUser.phoneNumber,
        directorate: newUser.directorate,
        role: newUser.role,
        password: newUser.password || undefined,
      });
      toast({ title: "User Updated", description: `${newUser.name} has been updated successfully.` });
      setIsEditUserOpen(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update user.", variant: "destructive" });
    }
  };

  const handleAddUser = async () => {
    try {
      await callAuthApi("create_user", {
        name: newUser.name,
        email: newUser.email,
        phone_number: newUser.phoneNumber,
        directorate: newUser.directorate,
        role: newUser.role,
        password: newUser.password,
      });
      toast({ title: "User Added", description: `${newUser.name} has been added successfully.` });
      setIsAddUserOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to add user.", variant: "destructive" });
    }
  };

  const handleDeactivateUser = async (userId: string, userName: string) => {
    try {
      await callAuthApi("deactivate_user", { id: userId });
      toast({ title: "User Deactivated", description: `${userName} has been deactivated.` });
      fetchUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to deactivate user.", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setNewUser({
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      directorate: "DAWS",
      role: "Technical",
    });
    setEditingUser(null);
  };

  const columns: ColumnDef<DatabaseUser>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone_number",
      header: "Phone Number",
    },
    {
      accessorKey: "directorate",
      header: "Directorate",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-gray-100">
          {row.original.directorate}
        </Badge>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        return (
          <Badge
            className={
              role === "Super User"
                ? "bg-purple-100 text-purple-800 border-purple-300"
                : role === "Technical"
                ? "bg-blue-100 text-blue-800 border-blue-300"
                : "bg-gray-100 text-gray-800 border-gray-300"
            }
          >
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={
            row.original.is_active
              ? "bg-green-100 text-green-800 border-green-300"
              : "bg-red-100 text-red-800 border-red-300"
          }
        >
          {row.original.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleEditUser(row.original)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAccessUser(row.original)}
          >
            Access
          </Button>
          {row.original.is_active && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDeactivateUser(row.original.id, row.original.name)}
            >
              Deactivate
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (!currentUser || currentUser.role !== "Super User") {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
      </div>

      <Tabs defaultValue="active-users" className="w-full">
        <TabsList>
          <TabsTrigger value="active-users">Active Users</TabsTrigger>
          <TabsTrigger value="pending-registrations">Pending Registrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active-users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Active Users</h2>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button>Add User</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account with appropriate role and permissions.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Staff Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newUser.name}
                      onChange={handleInputChange}
                      placeholder="Enter staff name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newUser.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={newUser.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="directorate">Directorate</Label>
                    <Select
                      value={newUser.directorate}
                      onValueChange={(value: Directorate) =>
                        setNewUser((prev) => ({ ...prev, directorate: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select directorate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DAWS">DAWS</SelectItem>
                        <SelectItem value="DAAS">DAAS</SelectItem>
                        <SelectItem value="ICT">ICT</SelectItem>
                        <SelectItem value="DOLTS">DOLTS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>User Role</Label>
                    <RadioGroup
                      value={newUser.role}
                      onValueChange={(value: UserRole) =>
                        setNewUser((prev) => ({ ...prev, role: value }))
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Super User" id="super" />
                        <Label htmlFor="super">Super User</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Technical" id="technical" />
                        <Label htmlFor="technical">Technical</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Read and View" id="read" />
                        <Label htmlFor="read">Read and View</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>Add User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                  <DialogDescription>
                    Update user information and permissions.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Staff Name</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={newUser.name}
                      onChange={handleInputChange}
                      placeholder="Enter staff name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      name="email"
                      type="email"
                      value={newUser.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-phoneNumber">Phone Number</Label>
                    <Input
                      id="edit-phoneNumber"
                      name="phoneNumber"
                      value={newUser.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-password">New Password (optional)</Label>
                    <Input
                      id="edit-password"
                      name="password"
                      type="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-directorate">Directorate</Label>
                    <Select
                      value={newUser.directorate}
                      onValueChange={(value: Directorate) =>
                        setNewUser((prev) => ({ ...prev, directorate: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select directorate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DAWS">DAWS</SelectItem>
                        <SelectItem value="DAAS">DAAS</SelectItem>
                        <SelectItem value="ICT">ICT</SelectItem>
                        <SelectItem value="DOLTS">DOLTS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>User Role</Label>
                    <RadioGroup
                      value={newUser.role}
                      onValueChange={(value: UserRole) =>
                        setNewUser((prev) => ({ ...prev, role: value }))
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Super User" id="edit-super" />
                        <Label htmlFor="edit-super">Super User</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Technical" id="edit-technical" />
                        <Label htmlFor="edit-technical">Technical</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Read and View" id="edit-read" />
                        <Label htmlFor="edit-read">Read and View</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsEditUserOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateUser}>Update User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-md shadow">
            <div className="p-6">
              <DataTable columns={columns} data={users} searchKey="name" />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pending-registrations">
          <div className="bg-white rounded-md shadow">
            <div className="p-6">
              <PendingRegistrations />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <ModuleAccessDialog
        open={!!accessUser}
        onOpenChange={(o) => !o && setAccessUser(null)}
        userId={accessUser?.id ?? null}
        userName={accessUser?.name}
      />
    </div>
  );
};

export default UsersPage;
