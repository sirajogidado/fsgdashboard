
import React, { useState } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";

interface ForeignAMO {
  id: string;
  amoName: string;
  country: string;
  description: string;
}

interface ForeignAMOTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const ForeignAMOTable = ({ searchQuery, onEdit }: ForeignAMOTableProps) => {
  const [data, setData] = useState<ForeignAMO[]>([
    { id: "1", amoName: "Emirates AMO", country: "United Arab Emirates", description: "Full maintenance services" },
    { id: "2", amoName: "Lufthansa Technik", country: "Germany", description: "Aircraft maintenance organization" },
  ]);

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Foreign AMO Deleted",
      description: "The Foreign AMO has been deleted successfully.",
    });
  };

  const columns: ColumnDef<ForeignAMO>[] = [
    {
      accessorKey: "amoName",
      header: "AMO Name",
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
        item.amoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  return <DataTable columns={columns} data={filteredData} />;
};

export default ForeignAMOTable;
