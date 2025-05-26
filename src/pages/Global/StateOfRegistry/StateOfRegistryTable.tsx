
import React, { useState } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";

interface StateOfRegistry {
  id: string;
  countryName: string;
  countryCode: string;
  registrationPrefix: string;
}

interface StateOfRegistryTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const StateOfRegistryTable = ({ searchQuery, onEdit }: StateOfRegistryTableProps) => {
  const [data, setData] = useState<StateOfRegistry[]>([
    { id: "1", countryName: "Nigeria", countryCode: "NG", registrationPrefix: "5N" },
    { id: "2", countryName: "United States", countryCode: "US", registrationPrefix: "N" },
    { id: "3", countryName: "United Kingdom", countryCode: "GB", registrationPrefix: "G" },
  ]);

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    toast({
      title: "State of Registry Deleted",
      description: "The state of registry has been deleted successfully.",
    });
  };

  const columns: ColumnDef<StateOfRegistry>[] = [
    {
      accessorKey: "countryName",
      header: "Country Name",
    },
    {
      accessorKey: "countryCode",
      header: "Country Code",
    },
    {
      accessorKey: "registrationPrefix",
      header: "Registration Prefix",
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
        item.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.countryCode.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  return <DataTable columns={columns} data={filteredData} />;
};

export default StateOfRegistryTable;
