
import React, { useState } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";

interface TrainingOrganization {
  id: string;
  organizationName: string;
  country: string;
  category: string;
  description: string;
}

interface TrainingOrganizationTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const TrainingOrganizationTable = ({ searchQuery, onEdit }: TrainingOrganizationTableProps) => {
  const [data, setData] = useState<TrainingOrganization[]>([
    { id: "1", organizationName: "Flight Training Academy", country: "Nigeria", category: "Commercial", description: "Professional pilot training" },
    { id: "2", organizationName: "Aviation Skills Institute", country: "Kenya", category: "Technical", description: "Aircraft maintenance training" },
  ]);

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Training Organization Deleted",
      description: "The training organization has been deleted successfully.",
    });
  };

  const columns: ColumnDef<TrainingOrganization>[] = [
    {
      accessorKey: "organizationName",
      header: "Organization Name",
    },
    {
      accessorKey: "country",
      header: "Country",
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
        item.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  return <DataTable columns={columns} data={filteredData} />;
};

export default TrainingOrganizationTable;
