
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { DataTable } from "@/components/DataTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/components/ui/use-toast";

interface StateRegistryItem {
  id: string;
  name: string;
  code: string;
  region: string;
  notes?: string;
}

interface StateRegistryTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

// Sample data for demonstration
const sampleData: StateRegistryItem[] = [
  {
    id: "1",
    name: "United States",
    code: "US",
    region: "North America",
    notes: "FAA is the regulator",
  },
  {
    id: "2",
    name: "United Kingdom",
    code: "UK",
    region: "Europe",
    notes: "CAA is the regulator",
  },
  {
    id: "3",
    name: "Canada",
    code: "CA",
    region: "North America",
    notes: "Transport Canada Civil Aviation (TCCA)",
  },
  {
    id: "4",
    name: "Australia",
    code: "AU",
    region: "Oceania",
    notes: "CASA is the regulator",
  },
];

const StateRegistryTable: React.FC<StateRegistryTableProps> = ({ 
  searchQuery,
  onEdit 
}) => {
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    console.log("Delete item with ID:", id);
    toast({
      title: "State Registry Deleted",
      description: "The state registry has been successfully deleted.",
    });
  };

  const filteredData = searchQuery 
    ? sampleData.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.region.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sampleData;

  const columns: ColumnDef<StateRegistryItem>[] = [
    {
      accessorKey: "name",
      header: "State Name",
    },
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "region",
      header: "Region",
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

export default StateRegistryTable;
