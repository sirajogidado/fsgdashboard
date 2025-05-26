
import React, { useState } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";

interface UserRole {
  id: string;
  roleName: string;
  description: string;
  permissions: string;
  users: number;
}

interface UserRolesTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const UserRolesTable = ({ searchQuery, onEdit }: UserRolesTableProps) => {
  const [data, setData] = useState<UserRole[]>([
    { id: "1", roleName: "Super User", description: "Full system access", permissions: "admin", users: 1 },
    { id: "2", roleName: "Technical", description: "Technical operations", permissions: "write", users: 3 },
    { id: "3", roleName: "Read and View", description: "View only access", permissions: "read", users: 1 },
  ]);

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    toast({
      title: "User Role Deleted",
      description: "The user role has been deleted successfully.",
    });
  };

  const columns: ColumnDef<UserRole>[] = [
    {
      accessorKey: "roleName",
      header: "Role Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => {
        const permission = row.original.permissions;
        return (
          <Badge
            className={
              permission === "admin"
                ? "bg-purple-100 text-purple-800 border-purple-300"
                : permission === "write"
                ? "bg-blue-100 text-blue-800 border-blue-300"
                : "bg-gray-100 text-gray-800 border-gray-300"
            }
          >
            {permission === "admin" ? "Administrator" : permission === "write" ? "Read & Write" : "Read Only"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "users",
      header: "Users Count",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(row.original.id)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const filteredData = searchQuery
    ? data.filter(item =>
        item.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  return <DataTable columns={columns} data={filteredData} />;
};

export default UserRolesTable;
