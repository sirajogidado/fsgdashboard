import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { SafetyInspectionForm } from "./SafetyInspectionForm";
import { SafetyInspectionList } from "./SafetyInspectionList";
import RecordWorkflowSection from "@/components/RecordWorkflowSection";

const SafetyInspectionPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInspection, setEditingInspection] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: inspections = [], isLoading } = useQuery({
    queryKey: ["safety-inspections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("safety_inspections")
        .select("*, aerodrome_certifications(aerodrome_name)")
        .order("scheduled_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("safety_inspections").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["safety-inspections"] });
      toast.success("Inspection created successfully");
      setIsDialogOpen(false);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { error } = await supabase.from("safety_inspections").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["safety-inspections"] });
      toast.success("Inspection updated successfully");
      setIsDialogOpen(false);
      setEditingInspection(null);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("safety_inspections").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["safety-inspections"] });
      toast.success("Inspection deleted successfully");
    },
    onError: (error: any) => toast.error(error.message),
  });

  const handleSubmit = (data: any) => {
    const cleanedData = {
      ...data,
      completed_date: data.completed_date || null,
      next_inspection_date: data.next_inspection_date || null,
      findings: data.findings || null,
      recommendations: data.recommendations || null,
    };

    if (editingInspection) {
      updateMutation.mutate({ id: editingInspection.id, ...cleanedData });
    } else {
      createMutation.mutate(cleanedData);
    }
  };

  const handleEdit = (inspection: any) => {
    setEditingInspection(inspection);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this inspection?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Safety Inspections</h1>
          <p className="text-muted-foreground">Manage aerodrome safety inspections and compliance</p>
        </div>
        <Button onClick={() => { setEditingInspection(null); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Inspection
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <SafetyInspectionList
          inspections={inspections}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingInspection ? "Edit Inspection" : "Add New Inspection"}</DialogTitle>
          </DialogHeader>
          {editingInspection && (
            <RecordWorkflowSection
              tableName="safety_inspections"
              editingId={(editingInspection as any).id}
              directorate="DAAS"
            />
          )}
          <SafetyInspectionForm
            initialData={editingInspection}
            onSubmit={handleSubmit}
            onCancel={() => { setIsDialogOpen(false); setEditingInspection(null); }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SafetyInspectionPage;
