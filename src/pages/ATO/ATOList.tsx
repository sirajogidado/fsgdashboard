
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit } from "lucide-react";

interface ATOListProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

// Mock data - in a real app this would come from an API
const mockData = [
  {
    id: "1",
    name: "Avios Flight Academy",
    licenseNumber: "ATO-001-2023",
    operationType: "Training",
    issueDate: "2023-01-15",
    validityDate: "2024-01-15",
    contactPerson: "John Smith",
  },
  {
    id: "2",
    name: "Sky Professional Training",
    licenseNumber: "ATO-002-2023",
    operationType: "Certification",
    issueDate: "2023-02-20",
    validityDate: "2024-02-20",
    contactPerson: "Jane Doe",
  },
  {
    id: "3",
    name: "Aviation Excellence Institute",
    licenseNumber: "ATO-003-2023",
    operationType: "Assessment",
    issueDate: "2023-03-10",
    validityDate: "2023-05-10", // expired
    contactPerson: "Michael Johnson",
  },
  {
    id: "4",
    name: "Global Flight Training",
    licenseNumber: "ATO-004-2023",
    operationType: "Training",
    issueDate: "2023-04-05",
    validityDate: "2023-06-30", // about to expire in demo
    contactPerson: "Sarah Williams",
  },
];

const getStatusColor = (validityDate: string) => {
  const today = new Date();
  const validity = new Date(validityDate);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  if (validity < today) {
    return "red"; // expired
  } else if (validity < thirtyDaysFromNow) {
    return "yellow"; // about to expire
  } else {
    return "green"; // valid
  }
};

const ATOList = ({ searchQuery, onEdit }: ATOListProps) => {
  // Filter data based on search query
  const filteredData = mockData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Operator Name</TableHead>
            <TableHead>License Number</TableHead>
            <TableHead>Operation Type</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Validity Date</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((ato) => (
              <TableRow key={ato.id}>
                <TableCell>{ato.name}</TableCell>
                <TableCell>{ato.licenseNumber}</TableCell>
                <TableCell>{ato.operationType}</TableCell>
                <TableCell>{new Date(ato.issueDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(ato.validityDate).toLocaleDateString()}</TableCell>
                <TableCell>{ato.contactPerson}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      getStatusColor(ato.validityDate) === "red"
                        ? "destructive"
                        : getStatusColor(ato.validityDate) === "yellow"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {getStatusColor(ato.validityDate) === "red"
                      ? "Expired"
                      : getStatusColor(ato.validityDate) === "yellow"
                      ? "Expiring Soon"
                      : "Valid"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(ato.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No ATO records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ATOList;
