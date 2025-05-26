
import React, { useState } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

interface AuditTrail {
  id: string;
  userName: string;
  action: "Added" | "Edited" | "Deleted";
  entity: string;
  entityName: string;
  timestamp: string;
  loginTime: string;
}

interface AuditTrailTableProps {
  searchQuery: string;
}

const AuditTrailTable = ({ searchQuery }: AuditTrailTableProps) => {
  const [data] = useState<AuditTrail[]>([
    {
      id: "1",
      userName: "Admin User",
      action: "Added",
      entity: "Aircraft Manufacturer",
      entityName: "Boeing",
      timestamp: "2024-01-15 10:30:00",
      loginTime: "2024-01-15 09:15:00"
    },
    {
      id: "2",
      userName: "DAWS User",
      action: "Edited",
      entity: "AOC",
      entityName: "Air Peace",
      timestamp: "2024-01-15 11:45:00",
      loginTime: "2024-01-15 08:30:00"
    },
    {
      id: "3",
      userName: "Admin User",
      action: "Deleted",
      entity: "User Role",
      entityName: "Test Role",
      timestamp: "2024-01-15 14:20:00",
      loginTime: "2024-01-15 09:15:00"
    },
  ]);

  const columns: ColumnDef<AuditTrail>[] = [
    {
      accessorKey: "userName",
      header: "User Name",
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const action = row.original.action;
        return (
          <Badge
            className={
              action === "Added"
                ? "bg-green-100 text-green-800 border-green-300"
                : action === "Edited"
                ? "bg-blue-100 text-blue-800 border-blue-300"
                : "bg-red-100 text-red-800 border-red-300"
            }
          >
            {action}
          </Badge>
        );
      },
    },
    {
      accessorKey: "entity",
      header: "Entity Type",
    },
    {
      accessorKey: "entityName",
      header: "Entity Name",
    },
    {
      accessorKey: "timestamp",
      header: "Action Time",
    },
    {
      accessorKey: "loginTime",
      header: "Login Time",
    },
  ];

  const filteredData = searchQuery
    ? data.filter(item =>
        item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.entityName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  return <DataTable columns={columns} data={filteredData} />;
};

export default AuditTrailTable;
