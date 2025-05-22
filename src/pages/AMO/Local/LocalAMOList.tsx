
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
    holderCriteria: "Existing AOC",
    approvalNumber: "ETH-AMO-2023-001",
    maintenanceLocation: "Addis Ababa",
    expireDate: "2024-12-31"
  },
  {
    id: "2",
    holderCriteria: "Non AOC holder",
    approvalNumber: "ETH-AMO-2023-002",
    maintenanceLocation: "Bahir Dar",
    expireDate: "2025-06-15"
  },
];

export interface LocalAMOListProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const LocalAMOList: React.FC<LocalAMOListProps> = ({ searchQuery, onEdit }) => {
  const filteredData = mockData.filter(item => 
    item.holderCriteria.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.approvalNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.maintenanceLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {filteredData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No local AMO records found</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Holder Criteria</TableHead>
                <TableHead>AMO Approval No.</TableHead>
                <TableHead>Maintenance Location</TableHead>
                <TableHead>Expire Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.holderCriteria}</TableCell>
                  <TableCell>{item.approvalNumber}</TableCell>
                  <TableCell>{item.maintenanceLocation}</TableCell>
                  <TableCell>{item.expireDate}</TableCell>
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

export default LocalAMOList;
