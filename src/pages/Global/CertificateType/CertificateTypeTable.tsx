
import React, { useState } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";

interface CertificateType {
  id: string;
  certificateName: string;
  category: string;
  validity: string;
  description: string;
}

interface CertificateTypeTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const CertificateTypeTable = ({ searchQuery, onEdit }: CertificateTypeTableProps) => {
  const [data, setData] = useState<CertificateType[]>([
    { id: "1", certificateName: "Type Certificate", category: "Aircraft", validity: "Indefinite", description: "Aircraft type approval" },
    { id: "2", certificateName: "Supplemental Type Certificate", category: "Aircraft", validity: "5 years", description: "Aircraft modification approval" },
  ]);

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Certificate Type Deleted",
      description: "The certificate type has been deleted successfully.",
    });
  };

  const columns: ColumnDef<CertificateType>[] = [
    {
      accessorKey: "certificateName",
      header: "Certificate Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "validity",
      header: "Validity Period",
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
        item.certificateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  return <DataTable columns={columns} data={filteredData} />;
};

export default CertificateTypeTable;
