
import React, { useState } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";

interface OperationType {
  id: string;
  operationType: string;
  category: string;
  description: string;
}

interface OperationTypeTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const OperationTypeTable = ({ searchQuery, onEdit }: OperationTypeTableProps) => {
  const [data, setData] = useState<OperationType[]>([
    { id: "1", operationType: "Scheduled Passenger", category: "Commercial", description: "Regular passenger services" },
    { id: "2", operationType: "Cargo", category: "Commercial", description: "Freight transport" },
    { id: "3", operationType: "Charter", category: "Commercial", description: "On-demand services" },
  ]);

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Operation Type Deleted",
      description: "The operation type has been deleted successfully.",
    });
  };

  const columns: ColumnDef<OperationType>[] = [
    {
      accessorKey: "operationType",
      header: "Operation Type",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "description",
      header: "Description",
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
        item.operationType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  return <DataTable columns={columns} data={filteredData} />;
};

export default OperationTypeTable;
