
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
    aocHolder: "Ethiopian Airlines",
    registrationMark: "ET-AOP",
    aircraftType: "Boeing 737-800",
    serialNumber: "SN12345",
    cofaStatus: "2023-12-31", // Date string to represent C of A status
    registeredOwner: "Ethiopian Airlines Group"
  },
  {
    id: "2",
    aocHolder: "Ethiopian Airlines",
    registrationMark: "ET-AOR",
    aircraftType: "Boeing 777-300ER",
    serialNumber: "SN67890",
    cofaStatus: "2024-06-15", // Date string to represent C of A status
    registeredOwner: "Ethiopian Airlines Group"
  },
];

export interface ACStatusListProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const ACStatusList: React.FC<ACStatusListProps> = ({ searchQuery, onEdit }) => {
  const filteredData = mockData.filter(item => 
    item.aocHolder.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.registrationMark.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.aircraftType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to determine if C of A is expired, active, or expiring soon
  const getCofAStatus = (dateString: string) => {
    const today = new Date();
    const cofaDate = new Date(dateString);
    const daysDiff = Math.floor((cofaDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return { status: "Expired", color: "text-red-500" };
    if (daysDiff < 30) return { status: "Expiring Soon", color: "text-yellow-500" };
    return { status: "Active", color: "text-green-500" };
  };

  return (
    <div>
      {filteredData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No aircraft status records found</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>AOC Holder</TableHead>
                <TableHead>Registration Mark</TableHead>
                <TableHead>Aircraft Type</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>C of A Status</TableHead>
                <TableHead>Registered Owner</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => {
                const cofaStatus = getCofAStatus(item.cofaStatus);
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.aocHolder}</TableCell>
                    <TableCell>{item.registrationMark}</TableCell>
                    <TableCell>{item.aircraftType}</TableCell>
                    <TableCell>{item.serialNumber}</TableCell>
                    <TableCell className={cofaStatus.color}>
                      {cofaStatus.status} ({item.cofaStatus})
                    </TableCell>
                    <TableCell>{item.registeredOwner}</TableCell>
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
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ACStatusList;
