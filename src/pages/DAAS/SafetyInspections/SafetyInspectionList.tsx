import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface SafetyInspectionListProps {
  inspections: any[];
  onEdit: (inspection: any) => void;
  onDelete: (id: string) => void;
}

const getStatusBadge = (status: string) => {
  const variants: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
  };
  return variants[status] || "bg-gray-100 text-gray-800";
};

const getComplianceBadge = (status: string) => {
  const variants: Record<string, string> = {
    pending: "bg-gray-100 text-gray-800",
    compliant: "bg-green-100 text-green-800",
    "non-compliant": "bg-red-100 text-red-800",
    partial: "bg-yellow-100 text-yellow-800",
  };
  return variants[status] || "bg-gray-100 text-gray-800";
};

export const SafetyInspectionList = ({ inspections, onEdit, onDelete }: SafetyInspectionListProps) => {
  if (inspections.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No safety inspections found. Click "Add Inspection" to create one.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Aerodrome</TableHead>
            <TableHead>Inspection Type</TableHead>
            <TableHead>Scheduled Date</TableHead>
            <TableHead>Inspector</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Compliance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inspections.map((inspection) => (
            <TableRow key={inspection.id}>
              <TableCell className="font-medium">
                {inspection.aerodrome_certifications?.aerodrome_name || "N/A"}
              </TableCell>
              <TableCell>{inspection.inspection_type}</TableCell>
              <TableCell>{format(new Date(inspection.scheduled_date), "MMM dd, yyyy")}</TableCell>
              <TableCell>{inspection.inspector_name}</TableCell>
              <TableCell>
                <Badge className={getStatusBadge(inspection.status)}>{inspection.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getComplianceBadge(inspection.compliance_status)}>
                  {inspection.compliance_status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(inspection)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(inspection.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
