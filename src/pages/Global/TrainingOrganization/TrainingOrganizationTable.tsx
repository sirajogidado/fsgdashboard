
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { DataTable } from "@/components/DataTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/components/ui/use-toast";

interface TrainingOrganizationItem {
  id: string;
  name: string;
  country: string;
  type: string;
  website?: string;
  description?: string;
}

interface TrainingOrganizationTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

// Sample data for demonstration
const sampleData: TrainingOrganizationItem[] = [
  {
    id: "1",
    name: "FlightSafety International",
    country: "United States",
    type: "Pilot Training",
    website: "https://www.flightsafety.com",
    description: "Pilot and maintenance training",
  },
  {
    id: "2",
    name: "CAE",
    country: "Canada",
    type: "Aviation Training",
    website: "https://www.cae.com",
    description: "Aviation training solutions",
  },
  {
    id: "3",
    name: "Pan Am International Flight Academy",
    country: "United States",
    type: "Flight Training",
    website: "https://www.panamacademy.com",
    description: "Aircraft type ratings and aviation training",
  },
  {
    id: "4",
    name: "Oxford Aviation Academy",
    country: "United Kingdom",
    type: "Flight Training",
    website: "https://www.l3harris.com",
    description: "Flight training and pilot placement",
  },
];

const TrainingOrganizationTable: React.FC<TrainingOrganizationTableProps> = ({ 
  searchQuery,
  onEdit 
}) => {
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    console.log("Delete item with ID:", id);
    toast({
      title: "Training Organization Deleted",
      description: "The training organization has been successfully deleted.",
    });
  };

  const filteredData = searchQuery 
    ? sampleData.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sampleData;

  const columns: ColumnDef<TrainingOrganizationItem>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "website",
      header: "Website",
      cell: ({ row }) => (
        <a 
          href={row.original.website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {row.original.website}
        </a>
      )
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

export default TrainingOrganizationTable;
