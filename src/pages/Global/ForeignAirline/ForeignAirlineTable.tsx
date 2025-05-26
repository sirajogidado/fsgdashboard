
import React, { useState } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";

interface ForeignAirline {
  id: string;
  airlineName: string;
  country: string;
  iataCode: string;
  icaoCode: string;
}

interface ForeignAirlineTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const ForeignAirlineTable = ({ searchQuery, onEdit }: ForeignAirlineTableProps) => {
  const [data, setData] = useState<ForeignAirline[]>([
    { id: "1", airlineName: "British Airways", country: "United Kingdom", iataCode: "BA", icaoCode: "BAW" },
    { id: "2", airlineName: "Emirates", country: "United Arab Emirates", iataCode: "EK", icaoCode: "UAE" },
  ]);

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Foreign Airline Deleted",
      description: "The foreign airline has been deleted successfully.",
    });
  };

  const columns: ColumnDef<ForeignAirline>[] = [
    {
      accessorKey: "airlineName",
      header: "Airline Name",
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      accessorKey: "iataCode",
      header: "IATA Code",
    },
    {
      accessorKey: "icaoCode",
      header: "ICAO Code",
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
        item.airlineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  return <DataTable columns={columns} data={filteredData} />;
};

export default ForeignAirlineTable;
