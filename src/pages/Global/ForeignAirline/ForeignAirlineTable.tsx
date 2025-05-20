
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { DataTable } from "@/components/DataTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/components/ui/use-toast";

interface ForeignAirlineItem {
  id: string;
  name: string;
  iataCode: string;
  icaoCode: string;
  country: string;
  headquarters: string;
  website?: string;
  notes?: string;
}

interface ForeignAirlineTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

// Sample data for demonstration
const sampleData: ForeignAirlineItem[] = [
  {
    id: "1",
    name: "Emirates",
    iataCode: "EK",
    icaoCode: "UAE",
    country: "United Arab Emirates",
    headquarters: "Dubai",
    website: "https://www.emirates.com",
    notes: "Flag carrier of the UAE",
  },
  {
    id: "2",
    name: "British Airways",
    iataCode: "BA",
    icaoCode: "BAW",
    country: "United Kingdom",
    headquarters: "London",
    website: "https://www.britishairways.com",
    notes: "Flag carrier of the UK",
  },
  {
    id: "3",
    name: "Lufthansa",
    iataCode: "LH",
    icaoCode: "DLH",
    country: "Germany",
    headquarters: "Frankfurt",
    website: "https://www.lufthansa.com",
    notes: "Flag carrier of Germany",
  },
  {
    id: "4",
    name: "Singapore Airlines",
    iataCode: "SQ",
    icaoCode: "SIA",
    country: "Singapore",
    headquarters: "Singapore",
    website: "https://www.singaporeair.com",
    notes: "Flag carrier of Singapore",
  },
];

const ForeignAirlineTable: React.FC<ForeignAirlineTableProps> = ({ 
  searchQuery,
  onEdit 
}) => {
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    console.log("Delete item with ID:", id);
    toast({
      title: "Foreign Airline Deleted",
      description: "The foreign airline has been successfully deleted.",
    });
  };

  const filteredData = searchQuery 
    ? sampleData.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.iataCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.icaoCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sampleData;

  const columns: ColumnDef<ForeignAirlineItem>[] = [
    {
      accessorKey: "name",
      header: "Name",
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
      accessorKey: "country",
      header: "Country",
    },
    {
      accessorKey: "headquarters",
      header: "Headquarters",
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

export default ForeignAirlineTable;
