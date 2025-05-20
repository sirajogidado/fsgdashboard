
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { DataTable } from "@/components/DataTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/components/ui/use-toast";

interface TravelAgencyItem {
  id: string;
  name: string;
  licenseNumber: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  website?: string;
  notes?: string;
}

interface TravelAgencyTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

// Sample data for demonstration
const sampleData: TravelAgencyItem[] = [
  {
    id: "1",
    name: "Global Travel Services",
    licenseNumber: "TA-10023",
    address: "123 Main St, New York, NY",
    contactPerson: "John Smith",
    phone: "+1-212-555-0123",
    email: "info@globaltravel.com",
    website: "https://www.globaltravel.com",
    notes: "Corporate travel specialist",
  },
  {
    id: "2",
    name: "Travel Express",
    licenseNumber: "TA-20045",
    address: "456 High St, London, UK",
    contactPerson: "Emma Johnson",
    phone: "+44-20-7123-4567",
    email: "info@travelexpress.com",
    website: "https://www.travelexpress.com",
    notes: "Leisure travel specialist",
  },
  {
    id: "3",
    name: "Sky Voyagers",
    licenseNumber: "TA-30067",
    address: "789 Bay St, Toronto, Canada",
    contactPerson: "Michael Brown",
    phone: "+1-416-555-7890",
    email: "info@skyvoyagers.com",
    website: "https://www.skyvoyagers.com",
    notes: "Group tours specialist",
  },
];

const TravelAgencyTable: React.FC<TravelAgencyTableProps> = ({ 
  searchQuery,
  onEdit 
}) => {
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    console.log("Delete item with ID:", id);
    toast({
      title: "Travel Agency Deleted",
      description: "The travel agency has been successfully deleted.",
    });
  };

  const filteredData = searchQuery 
    ? sampleData.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sampleData;

  const columns: ColumnDef<TravelAgencyItem>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "licenseNumber",
      header: "License No.",
    },
    {
      accessorKey: "contactPerson",
      header: "Contact Person",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "email",
      header: "Email",
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

export default TravelAgencyTable;
