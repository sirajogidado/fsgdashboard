
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { CircleEllipsis } from "lucide-react";

// Mock data for demonstration
const mockData = [
  {
    id: "1",
    operatorType: "Existing AOC",
    foccNumber: "FOCC-2023-001",
    mccNumber: "MCC-2023-001",
    aircraftType: "Boeing 737-800",
    aircraftRegNumber: "ET-AOP",
    validityDate: "2024-12-31"
  },
  {
    id: "2",
    operatorType: "General Aviation",
    foccNumber: "FOCC-2023-002",
    mccNumber: "MCC-2023-002",
    aircraftType: "Cessna 172",
    aircraftRegNumber: "ET-ABC",
    validityDate: "2025-06-15"
  },
];

interface FOCCMCCListProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const FOCCMCCList: React.FC<FOCCMCCListProps> = ({ searchQuery, onEdit }) => {
  const filteredData = mockData.filter(item => 
    item.foccNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.mccNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.aircraftType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.aircraftRegNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {filteredData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No FOCC/MCC records found</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operator Type</TableHead>
                <TableHead>FOCC No.</TableHead>
                <TableHead>MCC No.</TableHead>
                <TableHead>Aircraft Type</TableHead>
                <TableHead>Registration Mark</TableHead>
                <TableHead>Validity Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.operatorType}</TableCell>
                  <TableCell>{item.foccNumber}</TableCell>
                  <TableCell>{item.mccNumber}</TableCell>
                  <TableCell>{item.aircraftType}</TableCell>
                  <TableCell>{item.aircraftRegNumber}</TableCell>
                  <TableCell>{item.validityDate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <CircleEllipsis className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(item.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default FOCCMCCList;
