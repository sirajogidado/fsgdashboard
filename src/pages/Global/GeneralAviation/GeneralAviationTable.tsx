
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { DataTable } from "@/components/DataTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/components/ui/use-toast";

interface GeneralAviationItem {
  id: string;
  name: string;
  type: string;
  status: string;
  notes?: string;
}

interface GeneralAviationTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

// Sample data for demonstration
const sampleData: GeneralAviationItem[] = [
  {
    id: "1",
    name: "Cirrus SR22",
    type: "Private Aircraft",
    status: "Active",
    notes: "Single-engine piston aircraft",
  },
  {
    id: "2",
    name: "Cessna 172",
    type: "Training Aircraft",
    status: "Active",
    notes: "Four-seat, single-engine",
  },
  {
    id: "3",
    name: "Piper PA-28",
    type: "Training Aircraft",
    status: "Active",
    notes: "Light aircraft",
  },
  {
    id: "4",
    name: "Diamond DA40",
    type: "Private Aircraft",
    status: "Inactive",
    notes: "Four-seat, single-engine",
  },
];

const GeneralAviationTable: React.FC<GeneralAviationTableProps> = ({ 
  searchQuery,
  onEdit 
}) => {
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    console.log("Delete item with ID:", id);
    toast({
      title: "General Aviation Deleted",
      description: "The general aviation record has been successfully deleted.",
    });
  };

  const filteredData = searchQuery 
    ? sampleData.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sampleData;

  const columns: ColumnDef<GeneralAviationItem>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "notes",
      header: "Notes",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(row.original.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={filteredData} />;
};

export default GeneralAviationTable;
