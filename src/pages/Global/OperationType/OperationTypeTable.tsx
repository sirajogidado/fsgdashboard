
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { DataTable } from "@/components/DataTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/components/ui/use-toast";

interface OperationTypeItem {
  id: string;
  name: string;
  code: string;
  description?: string;
}

interface OperationTypeTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

// Sample data for demonstration
const sampleData: OperationTypeItem[] = [
  {
    id: "1",
    name: "Scheduled Passenger",
    code: "SP",
    description: "Regular scheduled passenger services",
  },
  {
    id: "2",
    name: "Charter Passenger",
    code: "CP",
    description: "Non-scheduled passenger services",
  },
  {
    id: "3",
    name: "Cargo",
    code: "CG",
    description: "Freight services",
  },
  {
    id: "4",
    name: "Air Ambulance",
    code: "AA",
    description: "Medical emergency services",
  },
];

const OperationTypeTable: React.FC<OperationTypeTableProps> = ({ 
  searchQuery,
  onEdit 
}) => {
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    console.log("Delete item with ID:", id);
    toast({
      title: "Operation Type Deleted",
      description: "The operation type has been successfully deleted.",
    });
  };

  const filteredData = searchQuery 
    ? sampleData.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sampleData;

  const columns: ColumnDef<OperationTypeItem>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "description",
      header: "Description",
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

export default OperationTypeTable;
