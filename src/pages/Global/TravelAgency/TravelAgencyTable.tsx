
import React, { useState } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";

interface TravelAgency {
  id: string;
  agencyName: string;
  location: string;
  contactPerson: string;
  description: string;
}

interface TravelAgencyTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const TravelAgencyTable = ({ searchQuery, onEdit }: TravelAgencyTableProps) => {
  const [data, setData] = useState<TravelAgency[]>([
    { id: "1", agencyName: "Elite Travel", location: "Lagos", contactPerson: "John Doe", description: "Premium travel services" },
    { id: "2", agencyName: "World Tours", location: "Abuja", contactPerson: "Jane Smith", description: "International travel agency" },
  ]);

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Travel Agency Deleted",
      description: "The travel agency has been deleted successfully.",
    });
  };

  const columns: ColumnDef<TravelAgency>[] = [
    {
      accessorKey: "agencyName",
      header: "Agency Name",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "contactPerson",
      header: "Contact Person",
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
        item.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  return <DataTable columns={columns} data={filteredData} />;
};

export default TravelAgencyTable;
