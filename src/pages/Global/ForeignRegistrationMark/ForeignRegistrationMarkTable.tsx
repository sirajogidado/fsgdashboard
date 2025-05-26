
import React, { useState } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";

interface ForeignRegistrationMark {
  id: string;
  registrationMark: string;
  country: string;
  description: string;
}

interface ForeignRegistrationMarkTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const ForeignRegistrationMarkTable = ({ searchQuery, onEdit }: ForeignRegistrationMarkTableProps) => {
  const [data, setData] = useState<ForeignRegistrationMark[]>([
    { id: "1", registrationMark: "N-", country: "United States", description: "US Registration" },
    { id: "2", registrationMark: "G-", country: "United Kingdom", description: "UK Registration" },
  ]);

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Foreign Registration Mark Deleted",
      description: "The registration mark has been deleted successfully.",
    });
  };

  const columns: ColumnDef<ForeignRegistrationMark>[] = [
    {
      accessorKey: "registrationMark",
      header: "Registration Mark",
    },
    {
      accessorKey: "country",
      header: "Country",
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
        item.registrationMark.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  return <DataTable columns={columns} data={filteredData} />;
};

export default ForeignRegistrationMarkTable;
