import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Award } from "lucide-react";
import { PersonnelForm } from "./PersonnelForm";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import RecordWorkflowSection from "@/components/RecordWorkflowSection";

const PersonnelPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<any>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: personnel = [], isLoading } = useQuery({
    queryKey: ["aerodrome-personnel"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("aerodrome_personnel")
        .select("*, aerodrome_certifications(aerodrome_name)")
        .order("full_name");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("aerodrome_personnel").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aerodrome-personnel"] });
      toast.success("Personnel added successfully");
      setIsDialogOpen(false);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { error } = await supabase.from("aerodrome_personnel").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aerodrome-personnel"] });
      toast.success("Personnel updated successfully");
      setIsDialogOpen(false);
      setEditingPersonnel(null);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("aerodrome_personnel").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aerodrome-personnel"] });
      toast.success("Personnel deleted successfully");
    },
    onError: (error: any) => toast.error(error.message),
  });

  const handleSubmit = (data: any) => {
    const cleanedData = {
      ...data,
      email: data.email || null,
      phone: data.phone || null,
      hire_date: data.hire_date || null,
    };

    if (editingPersonnel) {
      updateMutation.mutate({ id: editingPersonnel.id, ...cleanedData });
    } else {
      createMutation.mutate(cleanedData);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      "on-leave": "bg-yellow-100 text-yellow-800",
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Aerodrome Personnel</h1>
          <p className="text-muted-foreground">Manage aerodrome staff and their certifications</p>
        </div>
        <Button onClick={() => { setEditingPersonnel(null); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Personnel
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : personnel.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No personnel found. Click "Add Personnel" to create one.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Aerodrome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personnel.map((person: any) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.full_name}</TableCell>
                  <TableCell>{person.position}</TableCell>
                  <TableCell>{person.aerodrome_certifications?.aerodrome_name || "N/A"}</TableCell>
                  <TableCell>{person.email || "N/A"}</TableCell>
                  <TableCell>{person.phone || "N/A"}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(person.status)}>{person.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/daas/personnel/${person.id}/certifications`)}
                      title="View Certifications"
                    >
                      <Award className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setEditingPersonnel(person); setIsDialogOpen(true); }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this personnel?")) {
                          deleteMutation.mutate(person.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPersonnel ? "Edit Personnel" : "Add New Personnel"}</DialogTitle>
          </DialogHeader>
          {editingPersonnel && (
            <RecordWorkflowSection
              tableName="aerodrome_personnel"
              editingId={(editingPersonnel as any).id}
              directorate="DAAS"
            />
          )}
          <PersonnelForm
            initialData={editingPersonnel}
            onSubmit={handleSubmit}
            onCancel={() => { setIsDialogOpen(false); setEditingPersonnel(null); }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonnelPage;
