
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
import { Edit, ExternalLink, Trash2 } from "lucide-react";

interface AircraftManufacturerListProps {
  searchQuery: string;
}

// Sample data for demonstration
const sampleData = [
  {
    id: "1",
    name: "Boeing",
    country: "United States",
    website: "https://www.boeing.com",
    description: "Commercial and military aircraft manufacturer",
  },
  {
    id: "2",
    name: "Airbus",
    country: "France/Germany",
    website: "https://www.airbus.com",
    description: "Global aerospace corporation",
  },
  {
    id: "3",
    name: "Embraer",
    country: "Brazil",
    website: "https://www.embraer.com",
    description: "Brazilian aerospace conglomerate",
  },
  {
    id: "4",
    name: "Bombardier",
    country: "Canada",
    website: "https://www.bombardier.com",
    description: "Aviation and rail transport manufacturer",
  },
];

const AircraftManufacturerList: React.FC<AircraftManufacturerListProps> = ({ searchQuery }) => {
  const [data, setData] = useState(sampleData);

  // Filter data based on search query
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Manufacturer Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead className="hidden md:table-cell">Website</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.country}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {item.website && (
                    <a href={item.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                      Visit <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-xs truncate">
                  {item.description}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
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
              <TableCell colSpan={5} className="text-center py-4">
                No aircraft manufacturers found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AircraftManufacturerList;
