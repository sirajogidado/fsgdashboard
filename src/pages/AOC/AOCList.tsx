
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

interface AOCListProps {
  searchQuery: string;
}

// Mock data - in a real app this would come from an API
const mockData = [
  {
    id: "1",
    aocHolder: "Airline A",
    certificateNumber: "AOC-001-2023",
    aircraftType: "Boeing 737",
    issueDate: "2023-01-15",
    validityDate: "2024-01-15",
    operations: "Commercial",
  },
  {
    id: "2",
    aocHolder: "Airline B",
    certificateNumber: "AOC-002-2023",
    aircraftType: "Airbus A320",
    issueDate: "2023-02-20",
    validityDate: "2024-02-20",
    operations: "Commercial",
  },
  {
    id: "3",
    aocHolder: "Airline C",
    certificateNumber: "AOC-003-2023",
    aircraftType: "Embraer E190",
    issueDate: "2023-03-10",
    validityDate: "2023-05-10", // expired
    operations: "Cargo",
  },
  {
    id: "4",
    aocHolder: "Airline D",
    certificateNumber: "AOC-004-2023",
    aircraftType: "Boeing 777",
    issueDate: "2023-04-05",
    validityDate: "2023-06-30", // about to expire in demo
    operations: "Private",
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

const AOCList = ({ searchQuery }: AOCListProps) => {
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
            <TableHead>AOC Holder</TableHead>
            <TableHead>Certificate Number</TableHead>
            <TableHead>Aircraft Type</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Validity Date</TableHead>
            <TableHead>Operations</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((aoc) => (
              <TableRow key={aoc.id}>
                <TableCell>{aoc.aocHolder}</TableCell>
                <TableCell>{aoc.certificateNumber}</TableCell>
                <TableCell>{aoc.aircraftType}</TableCell>
                <TableCell>{new Date(aoc.issueDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(aoc.validityDate).toLocaleDateString()}</TableCell>
                <TableCell>{aoc.operations}</TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      getStatusColor(aoc.validityDate) === "red"
                        ? "bg-red-500"
                        : getStatusColor(aoc.validityDate) === "yellow"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    } text-white`}
                  >
                    {getStatusColor(aoc.validityDate) === "red"
                      ? "Expired"
                      : getStatusColor(aoc.validityDate) === "yellow"
                      ? "Expiring Soon"
                      : "Valid"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No AOC records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AOCList;
