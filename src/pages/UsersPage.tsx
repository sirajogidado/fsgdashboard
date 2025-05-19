
import React, { useState } from "react";
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
import { Directorate, User, UserRole } from "@/types/auth";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin@ncaa.gov.ng",
      phoneNumber: "08012345678",
      directorate: "ICT",
      role: "Super User",
      profileImage: "/placeholder.svg",
    },
    {
      id: "2",
      name: "DAWS User",
      email: "daws@ncaa.gov.ng",
      phoneNumber: "08023456789",
      directorate: "DAWS",
      role: "Technical",
      profileImage: "/placeholder.svg",
    },
    {
      id: "3",
      name: "DAAS User",
      email: "daas@ncaa.gov.ng",
      phoneNumber: "08034567890",
      directorate: "DAAS",
      role: "Technical",
      profileImage: "/placeholder.svg",
    },
    {
      id: "4",
      name: "View Only",
      email: "view@ncaa.gov.ng",
      phoneNumber: "08045678901",
      directorate: "DOLTS",
      role: "Read and View",
      profileImage: "/placeholder.svg",
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    directorate: "DAWS" as Directorate,
    role: "Technical" as UserRole,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = () => {
    const userId = `${users.length + 1}`;
    const createdUser: User = {
      id: userId,
      name: newUser.name,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      directorate: newUser.directorate,
      role: newUser.role,
      profileImage: "/placeholder.svg",
    };

    setUsers((prev) => [...prev, createdUser]);
    toast({
      title: "User Added",
      description: `${createdUser.name} has been added successfully.`,
    });
    setIsAddUserOpen(false);
    resetForm();
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
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phoneNumber",
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
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
            Deactivate
          </Button>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
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
      </div>

      <div className="bg-white rounded-md shadow">
        <div className="p-6">
          <DataTable columns={columns} data={users} searchKey="name" />
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
