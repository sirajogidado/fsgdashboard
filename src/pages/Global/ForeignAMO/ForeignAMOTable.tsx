
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

interface ForeignAMOTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

// Sample data for demonstration
const sampleData = [
  {
    id: "1",
    name: "Lufthansa Technik",
    country: "Germany",
    certificateNumber: "DE.145.0001",
    description: "Aircraft maintenance organization for Lufthansa fleet",
  },
  {
    id: "2",
    name: "Air France Industries",
    country: "France",
    certificateNumber: "FR.145.0010",
    description: "MRO services for Air France and other airlines",
  },
  {
    id: "3",
    name: "British Airways Engineering",
    country: "United Kingdom",
    certificateNumber: "UK.145.00125",
    description: "Engineering services for BA fleet and third parties",
  },
  {
    id: "4",
    name: "Emirates Engineering",
    country: "UAE",
    certificateNumber: "UAE.145.0032",
    description: "Maintenance services for Emirates fleet",
  },
];

const ForeignAMOTable: React.FC<ForeignAMOTableProps> = ({
  searchQuery,
  onEdit,
}) => {
  const filteredData = searchQuery
    ? sampleData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sampleData;

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>AMO Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Certificate Number</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No foreign AMOs found.
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.country}</TableCell>
                <TableCell>{item.certificateNumber}</TableCell>
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

export default ForeignAMOTable;
