
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

interface ForeignRegistrationTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

// Sample data for demonstration
const sampleData = [
  {
    id: "1",
    registrationMark: "N12345",
    country: "United States",
    description: "Boeing 737 registration",
  },
  {
    id: "2",
    registrationMark: "G-ABCD",
    country: "United Kingdom",
    description: "Airbus A320 registration",
  },
  {
    id: "3",
    registrationMark: "F-WXYZ",
    country: "France",
    description: "Airbus A350 registration",
  },
  {
    id: "4",
    registrationMark: "JA-ABC",
    country: "Japan",
    description: "Boeing 787 registration",
  },
];

const ForeignRegistrationTable: React.FC<ForeignRegistrationTableProps> = ({
  searchQuery,
  onEdit,
}) => {
  const filteredData = searchQuery
    ? sampleData.filter(
        (item) =>
          item.registrationMark.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sampleData;

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Registration Mark</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No foreign registrations found.
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.registrationMark}</TableCell>
                <TableCell>{item.country}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item.id)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ForeignRegistrationTable;
