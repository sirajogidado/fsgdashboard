import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";

export interface AerodromeCertification {
  id: string;
  aerodrome_name: string;
  icao_code: string | null;
  location: string;
  certificate_number: string;
  certificate_type: string;
  issue_date: string;
  expiry_date: string;
  status: string;
  operator_name: string;
  runway_count: number | null;
  runway_length: string | null;
  category: string | null;
  last_inspection_date: string | null;
  next_inspection_date: string | null;
  comments: string | null;
  created_at: string;
  updated_at: string;
}

interface AerodromeCertificationListProps {
  data: AerodromeCertification[];
  onEdit: (certification: AerodromeCertification) => void;
  onDelete: (id: string) => void;
  onView: (certification: AerodromeCertification) => void;
}

const AerodromeCertificationList: React.FC<AerodromeCertificationListProps> = ({
  data,
  onEdit,
  onDelete,
  onView,
}) => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      suspended: "secondary",
      expired: "destructive",
      pending: "outline",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const columns: ColumnDef<AerodromeCertification>[] = [
    {
      accessorKey: "aerodrome_name",
      header: "Aerodrome Name",
    },
    {
      accessorKey: "icao_code",
      header: "ICAO Code",
      cell: ({ row }) => row.original.icao_code || "-",
    },
    {
      accessorKey: "certificate_number",
      header: "Certificate No.",
    },
    {
      accessorKey: "certificate_type",
      header: "Type",
    },
    {
      accessorKey: "operator_name",
      header: "Operator",
    },
    {
      accessorKey: "expiry_date",
      header: "Expiry Date",
      cell: ({ row }) => format(new Date(row.original.expiry_date), "PP"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="aerodrome_name"
    />
  );
};

export default AerodromeCertificationList;
