
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface LocalAMOListProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

// Sample data for demonstration
const sampleData = [
  {
    id: "1",
    organizationName: "Nigerian Aviation Maintenance",
    location: "Lagos",
    approvalNumber: "NCAA.145.0001",
    issueDate: "2023-02-15",
    expiryDate: "2025-02-14",
    status: "Active",
  },
  {
    id: "2",
    organizationName: "Aero Technical Services",
    location: "Abuja",
    approvalNumber: "NCAA.145.0032",
    issueDate: "2022-10-05",
    expiryDate: "2024-10-04",
    status: "Active",
  },
  {
    id: "3",
    organizationName: "West African Aircraft Maintenance",
    location: "Port Harcourt",
    approvalNumber: "NCAA.145.0057",
    issueDate: "2022-07-10",
    expiryDate: "2023-07-09",
    status: "Expired",
  },
];

const LocalAMOList: React.FC<LocalAMOListProps> = ({ searchQuery, onEdit }) => {
  const [data, setData] = useState(sampleData);

  // Filter data based on search query
  const filteredData = data.filter((item) =>
    item.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.approvalNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setData(data.filter((item) => item.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Expired":
        return "bg-red-500";
      case "Suspended":
        return "bg-yellow-500";
      case "Revoked":
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization Name</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead>Approval Number</TableHead>
            <TableHead className="hidden md:table-cell">Issue Date</TableHead>
            <TableHead className="hidden md:table-cell">Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.organizationName}</TableCell>
                <TableCell className="hidden md:table-cell">{item.location}</TableCell>
                <TableCell>{item.approvalNumber}</TableCell>
                <TableCell className="hidden md:table-cell">{item.issueDate}</TableCell>
                <TableCell className="hidden md:table-cell">{item.expiryDate}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEdit(item.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No Local AMO records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LocalAMOList;
