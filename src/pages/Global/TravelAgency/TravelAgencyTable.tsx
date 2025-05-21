
import React, { useState, useEffect } from "react";
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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAudit } from "@/context/AuditContext";

interface TravelAgency {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  createdAt: Date;
}

interface TravelAgencyTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
  canEdit: boolean;
}

const TravelAgencyTable: React.FC<TravelAgencyTableProps> = ({ 
  searchQuery, 
  onEdit,
  canEdit 
}) => {
  const [agencies, setAgencies] = useState<TravelAgency[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const { logAction } = useAudit();

  useEffect(() => {
    // Load agencies from localStorage
    const storedAgencies = localStorage.getItem("ncaa_travel_agencies");
    if (storedAgencies) {
      try {
        const parsedAgencies = JSON.parse(storedAgencies).map((agency: any) => ({
          ...agency,
          createdAt: new Date(agency.createdAt)
        }));
        setAgencies(parsedAgencies);
      } catch (error) {
        console.error("Error parsing travel agencies:", error);
        setAgencies([]);
      }
    }
  }, []);

  const handleDelete = (id: string) => {
    setSelectedAgencyId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedAgencyId) return;

    const agencyToDelete = agencies.find(a => a.id === selectedAgencyId);
    if (!agencyToDelete) return;

    const updatedAgencies = agencies.filter(a => a.id !== selectedAgencyId);
    setAgencies(updatedAgencies);
    localStorage.setItem("ncaa_travel_agencies", JSON.stringify(updatedAgencies));
    
    // Log delete action
    logAction(
      "delete",
      "travel-agency",
      selectedAgencyId,
      agencyToDelete.name,
      `Travel Agency ${agencyToDelete.name} was deleted`
    );
    
    setDeleteConfirmOpen(false);
    setSelectedAgencyId(null);
  };

  // Filter agencies based on search query
  const filteredAgencies = agencies.filter(agency => 
    agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agency.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agency.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              {canEdit && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canEdit ? 6 : 5} className="text-center py-10 text-gray-500">
                  {searchQuery ? "No travel agencies match your search" : "No travel agencies found. Add one to get started!"}
                </TableCell>
              </TableRow>
            ) : (
              filteredAgencies.map((agency) => (
                <TableRow key={agency.id}>
                  <TableCell>{agency.name}</TableCell>
                  <TableCell>{agency.contactPerson}</TableCell>
                  <TableCell>{agency.email}</TableCell>
                  <TableCell>{agency.phone}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{agency.address}</TableCell>
                  {canEdit && (
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(agency.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(agency.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              travel agency record from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TravelAgencyTable;
