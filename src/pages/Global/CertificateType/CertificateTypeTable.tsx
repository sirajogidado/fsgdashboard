
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { DataTable } from "@/components/DataTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/components/ui/use-toast";

interface CertificateTypeItem {
  id: string;
  name: string;
  code: string;
  category: string;
  description?: string;
}

interface CertificateTypeTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

// Sample data for demonstration
const sampleData: CertificateTypeItem[] = [
  {
    id: "1",
    name: "Air Operator Certificate",
    code: "AOC",
    category: "Operations",
    description: "Certificate authorizing an operator to carry out specified commercial air transport operations",
  },
  {
    id: "2",
    name: "Airworthiness Certificate",
    code: "CofA",
    category: "Airworthiness",
    description: "Certificate confirming that an aircraft meets its approved design and is in condition for safe operation",
  },
  {
    id: "3",
    name: "Type Certificate",
    code: "TC",
    category: "Design",
    description: "Certificate confirming that an aircraft type design meets regulatory requirements",
  },
  {
    id: "4",
    name: "Approved Training Organization",
    code: "ATO",
    category: "Training",
    description: "Certificate for organizations providing approved training courses",
  },
];

const CertificateTypeTable: React.FC<CertificateTypeTableProps> = ({ 
  searchQuery,
  onEdit 
}) => {
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    console.log("Delete item with ID:", id);
    toast({
      title: "Certificate Type Deleted",
      description: "The certificate type has been successfully deleted.",
    });
  };

  const filteredData = searchQuery 
    ? sampleData.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sampleData;

  const columns: ColumnDef<CertificateTypeItem>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "category",
      header: "Category",
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

export default CertificateTypeTable;
