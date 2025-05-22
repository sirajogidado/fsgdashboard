
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

export interface ACStatusListProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

// Mock data - in a real app this would come from an API
const mockData = [
  {
    id: "1",
    aircraftType: "Boeing 737",
    registrationMark: "5N-ABC",
    serialNumber: "12345",
    operator: "Airline A",
    lastMaintenanceDate: "2023-01-15",
    nextMaintenanceDate: "2023-07-15",
    currentStatus: "Active",
    isInService: true,
  },
  {
    id: "2",
    aircraftType: "Airbus A320",
    registrationMark: "5N-XYZ",
    serialNumber: "67890",
    operator: "Airline B",
    lastMaintenanceDate: "2023-02-20",
    nextMaintenanceDate: "2023-08-20",
    currentStatus: "Active",
    isInService: true,
  },
  {
    id: "3",
    aircraftType: "Embraer E190",
    registrationMark: "5N-DEF",
    serialNumber: "54321",
    operator: "Airline C",
    lastMaintenanceDate: "2023-03-10",
    nextMaintenanceDate: "2023-04-10",
    currentStatus: "Maintenance",
    isInService: false,
  },
  {
    id: "4",
    aircraftType: "Boeing 777",
    registrationMark: "5N-GHI",
    serialNumber: "98765",
    operator: "Airline A",
    lastMaintenanceDate: "2023-04-05",
    nextMaintenanceDate: "2023-05-05",
    currentStatus: "Grounded",
    isInService: false,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "green";
    case "Maintenance":
      return "yellow";
    case "Grounded":
      return "red";
    case "Storage":
      return "blue";
    default:
      return "gray";
  }
};

const ACStatusList = ({ searchQuery, onEdit }: ACStatusListProps) => {
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
            <TableHead>Aircraft Type</TableHead>
            <TableHead>Registration Mark</TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead>Operator</TableHead>
            <TableHead className="hidden md:table-cell">Last Maintenance</TableHead>
            <TableHead className="hidden md:table-cell">Next Maintenance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((aircraft) => (
              <TableRow key={aircraft.id}>
                <TableCell>{aircraft.aircraftType}</TableCell>
                <TableCell>{aircraft.registrationMark}</TableCell>
                <TableCell>{aircraft.serialNumber}</TableCell>
                <TableCell>{aircraft.operator}</TableCell>
                <TableCell className="hidden md:table-cell">{new Date(aircraft.lastMaintenanceDate).toLocaleDateString()}</TableCell>
                <TableCell className="hidden md:table-cell">{new Date(aircraft.nextMaintenanceDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      getStatusColor(aircraft.currentStatus) === "red"
                        ? "bg-red-500"
                        : getStatusColor(aircraft.currentStatus) === "yellow"
                        ? "bg-yellow-500"
                        : getStatusColor(aircraft.currentStatus) === "blue"
                        ? "bg-blue-500"
                        : "bg-green-500"
                    } text-white`}
                  >
                    {aircraft.currentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(aircraft.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No aircraft records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ACStatusList;
