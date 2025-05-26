
import React, { useState } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";

interface GeneralAviation {
  id: string;
  operatorName: string;
  registrationMark: string;
  aircraftType: string;
  description: string;
}

interface GeneralAviationTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const GeneralAviationTable = ({ searchQuery, onEdit }: GeneralAviationTableProps) => {
  const [data, setData] = useState<GeneralAviation[]>([
    { id: "1", operatorName: "Private Aviation", registrationMark: "5N-ABC", aircraftType: "Cessna 172", description: "Private operator" },
    { id: "2", operatorName: "Charter Services", registrationMark: "5N-DEF", aircraftType: "King Air", description: "Charter operations" },
  ]);

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    toast({
      title: "General Aviation Deleted",
      description: "The general aviation record has been deleted successfully.",
    });
  };

  const columns: ColumnDef<GeneralAviation>[] = [
    {
      accessorKey: "operatorName",
      header: "Operator Name",
    },
    {
      accessorKey: "registrationMark",
      header: "Registration Mark",
    },
    {
      accessorKey: "aircraftType",
      header: "Aircraft Type",
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
        item.operatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.registrationMark.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  return <DataTable columns={columns} data={filteredData} />;
};

export default GeneralAviationTable;
