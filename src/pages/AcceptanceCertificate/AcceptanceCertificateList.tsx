
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
    certificateNumber: "TAC-2023-001",
    aircraftManufacturer: "Boeing",
    aircraftType: "737-800",
    engineType: "CFM56-7B",
    issueDate: "2023-01-15"
  },
  {
    id: "2",
    certificateNumber: "TAC-2023-002",
    aircraftManufacturer: "Airbus",
    aircraftType: "A350-900",
    engineType: "Rolls-Royce Trent XWB",
    issueDate: "2023-05-22"
  },
];

interface AcceptanceCertificateListProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const AcceptanceCertificateList: React.FC<AcceptanceCertificateListProps> = ({ searchQuery, onEdit }) => {
  const filteredData = mockData.filter(item => 
    item.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.aircraftManufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.aircraftType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {filteredData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No type acceptance certificate records found</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certificate Number</TableHead>
                <TableHead>Aircraft Manufacturer</TableHead>
                <TableHead>Aircraft Type</TableHead>
                <TableHead>Engine Type</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.certificateNumber}</TableCell>
                  <TableCell>{item.aircraftManufacturer}</TableCell>
                  <TableCell>{item.aircraftType}</TableCell>
                  <TableCell>{item.engineType}</TableCell>
                  <TableCell>{item.issueDate}</TableCell>
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

export default AcceptanceCertificateList;
