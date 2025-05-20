
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
import { useToast } from "@/components/ui/use-toast";

interface AircraftTypeTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

// Sample manufacturers data for lookup
const manufacturers = [
  { id: "1", name: "Boeing" },
  { id: "2", name: "Airbus" },
  { id: "3", name: "Embraer" },
  { id: "4", name: "Bombardier" },
];

// Sample aircraft types data
const sampleTypes = [
  {
    id: "1",
    manufacturerId: "1",
    typeName: "737",
    description: "Twin jet narrow-body airliner",
  },
  {
    id: "2",
    manufacturerId: "1",
    typeName: "777",
    description: "Wide-body twin-engine jet airliner",
  },
  {
    id: "3",
    manufacturerId: "2",
    typeName: "A320",
    description: "Narrow-body commercial passenger jet",
  },
  {
    id: "4",
    manufacturerId: "3",
    typeName: "E190",
    description: "Narrow-body medium-range jet airliner",
  },
];

const AircraftTypeTable: React.FC<AircraftTypeTableProps> = ({
  searchQuery,
  onEdit,
}) => {
  const { toast } = useToast();
  const [data, setData] = useState(sampleTypes);

  // Get manufacturer name from ID
  const getManufacturerName = (manufacturerId: string) => {
    const manufacturer = manufacturers.find(m => m.id === manufacturerId);
    return manufacturer ? manufacturer.name : "Unknown";
  };

  // Filter data based on search query
  const filteredData = data.filter(
    (item) =>
      item.typeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getManufacturerName(item.manufacturerId)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setData(data.filter((item) => item.id !== id));
    toast({
      title: "Aircraft Type Deleted",
      description: "Aircraft type has been successfully deleted.",
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Manufacturer</TableHead>
            <TableHead>Aircraft Type</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {getManufacturerName(item.manufacturerId)}
                </TableCell>
                <TableCell className="font-medium">{item.typeName}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {item.description}
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
              <TableCell colSpan={4} className="text-center py-4">
                No aircraft types found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AircraftTypeTable;
