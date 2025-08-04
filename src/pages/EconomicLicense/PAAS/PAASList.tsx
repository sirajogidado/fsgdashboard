import React from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

interface PAASRecord {
  id: string;
  permitNumber: string;
  applicantName: string;
  serviceType: string;
  validityPeriod: string;
  status: string;
  issueDate: string;
  expiryDate: string;
}

interface PAASListProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const PAASList = ({ searchQuery, onEdit }: PAASListProps) => {
  const { canEdit, canDelete } = usePermissions();

  // Mock data - replace with actual data fetching
  const mockData: PAASRecord[] = [
    {
      id: "1",
      permitNumber: "PAAS-2024-001",
      applicantName: "Sky Services Ltd",
      serviceType: "Aerial Photography",
      validityPeriod: "12 months",
      status: "Active",
      issueDate: "2024-01-15",
      expiryDate: "2025-01-15"
    },
    {
      id: "2",
      permitNumber: "PAAS-2024-002",
      applicantName: "AgriDrone Solutions",
      serviceType: "Crop Spraying",
      validityPeriod: "24 months",
      status: "Active",
      issueDate: "2024-02-01",
      expiryDate: "2026-02-01"
    }
  ];

  const filteredData = mockData.filter(item =>
    item.permitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Active: "bg-green-100 text-green-800",
      Expired: "bg-red-100 text-red-800",
      Suspended: "bg-yellow-100 text-yellow-800",
      Revoked: "bg-gray-100 text-gray-800"
    };
    
    return (
      <Badge className={statusConfig[status as keyof typeof statusConfig] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  const columns = [
    {
      accessorKey: "permitNumber",
      header: "Permit Number",
    },
    {
      accessorKey: "applicantName",
      header: "Applicant Name",
    },
    {
      accessorKey: "serviceType",
      header: "Service Type",
    },
    {
      accessorKey: "validityPeriod",
      header: "Validity Period",
    },
    {
      accessorKey: "issueDate",
      header: "Issue Date",
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => getStatusBadge(row.original.status),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex space-x-2">
          {canEdit() && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(row.original.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {canDelete() && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Handle delete
                console.log("Delete", row.original.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={filteredData} />;
};

export default PAASList;