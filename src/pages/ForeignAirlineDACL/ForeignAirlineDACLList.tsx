
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

export interface ForeignAirlineDACLListProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

// Sample data for demonstration
const sampleData = [
  {
    id: "1",
    airlineName: "Emirates",
    country: "United Arab Emirates",
    approval: "DACL/FOR/2023-001",
    issueDate: "2023-01-10",
    expiryDate: "2023-12-31",
    status: "Active",
  },
  {
    id: "2",
    airlineName: "British Airways",
    country: "United Kingdom",
    approval: "DACL/FOR/2023-002",
    issueDate: "2023-02-15",
    expiryDate: "2023-12-31",
    status: "Active",
  },
  {
    id: "3",
    airlineName: "Air France",
    country: "France",
    approval: "DACL/FOR/2023-003",
    issueDate: "2023-03-05",
    expiryDate: "2023-06-30",
    status: "Expired",
  },
];

const ForeignAirlineDACLList: React.FC<ForeignAirlineDACLListProps> = ({ searchQuery, onEdit }) => {
  const [data, setData] = useState(sampleData);

  // Filter data based on search query
  const filteredData = data.filter((item) =>
    item.airlineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.approval.toLowerCase().includes(searchQuery.toLowerCase())
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
            <TableHead>Airline Name</TableHead>
            <TableHead className="hidden md:table-cell">Country</TableHead>
            <TableHead>Approval Reference</TableHead>
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
                <TableCell>{item.airlineName}</TableCell>
                <TableCell className="hidden md:table-cell">{item.country}</TableCell>
                <TableCell>{item.approval}</TableCell>
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
                No Foreign Airline DACL records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ForeignAirlineDACLList;
