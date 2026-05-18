import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Plus, Plane } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AerodromeCertificationForm, {
  AerodromeCertificationFormValues,
} from "./AerodromeCertificationForm";
import AerodromeCertificationList, {
  AerodromeCertification,
} from "./AerodromeCertificationList";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const AerodromeCertificationPage = () => {
  const [certifications, setCertifications] = useState<AerodromeCertification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] =
    useState<AerodromeCertification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from("aerodrome_certifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCertifications(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch certifications: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleSubmit = async (data: AerodromeCertificationFormValues) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        aerodrome_name: data.aerodrome_name,
        icao_code: data.icao_code || null,
        location: data.location,
        certificate_number: data.certificate_number,
        certificate_type: data.certificate_type,
        issue_date: format(data.issue_date, "yyyy-MM-dd"),
        expiry_date: format(data.expiry_date, "yyyy-MM-dd"),
        status: data.status,
        operator_name: data.operator_name,
        runway_count: data.runway_count || null,
        runway_length: data.runway_length || null,
        category: data.category || null,
        last_inspection_date: data.last_inspection_date
          ? format(data.last_inspection_date, "yyyy-MM-dd")
          : null,
        next_inspection_date: data.next_inspection_date
          ? format(data.next_inspection_date, "yyyy-MM-dd")
          : null,
        comments: data.comments || null,
      };

      if (selectedCertification) {
        const { error } = await supabase
          .from("aerodrome_certifications")
          .update(formattedData)
          .eq("id", selectedCertification.id);

        if (error) throw error;
        toast.success("Certification updated successfully");
      } else {
        const { error } = await supabase
          .from("aerodrome_certifications")
          .insert([formattedData]);

        if (error) throw error;
        toast.success("Certification created successfully");
      }

      setIsFormOpen(false);
      setSelectedCertification(null);
      fetchCertifications();
    } catch (error: any) {
      toast.error("Failed to save certification: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (certification: AerodromeCertification) => {
    setSelectedCertification(certification);
    setIsFormOpen(true);
  };

  const handleView = (certification: AerodromeCertification) => {
    setSelectedCertification(certification);
    setIsViewOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const cert = certifications.find((c) => c.id === id);
    if (cert) {
      setSelectedCertification(cert);
      setIsDeleteOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCertification) return;

    try {
      const { error } = await supabase
        .from("aerodrome_certifications")
        .delete()
        .eq("id", selectedCertification.id);

      if (error) throw error;
      toast.success("Certification deleted successfully");
      fetchCertifications();
    } catch (error: any) {
      toast.error("Failed to delete certification: " + error.message);
    } finally {
      setIsDeleteOpen(false);
      setSelectedCertification(null);
    }
  };

  const getInitialData = () => {
    if (!selectedCertification) return undefined;
    return {
      aerodrome_name: selectedCertification.aerodrome_name,
      icao_code: selectedCertification.icao_code || "",
      location: selectedCertification.location,
      certificate_number: selectedCertification.certificate_number,
      certificate_type: selectedCertification.certificate_type,
      issue_date: new Date(selectedCertification.issue_date),
      expiry_date: new Date(selectedCertification.expiry_date),
      status: selectedCertification.status,
      operator_name: selectedCertification.operator_name,
      runway_count: selectedCertification.runway_count || 1,
      runway_length: selectedCertification.runway_length || "",
      category: selectedCertification.category || "",
      last_inspection_date: selectedCertification.last_inspection_date
        ? new Date(selectedCertification.last_inspection_date)
        : null,
      next_inspection_date: selectedCertification.next_inspection_date
        ? new Date(selectedCertification.next_inspection_date)
        : null,
      comments: selectedCertification.comments || "",
    };
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      suspended: "secondary",
      expired: "destructive",
      pending: "outline",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Aerodrome Certifications
          </h1>
          <p className="text-muted-foreground">
            Manage aerodrome licenses and certifications
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Certification
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Certifications List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <AerodromeCertificationList
              data={certifications}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onView={handleView}
            />
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setSelectedCertification(null);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedCertification
                ? "Edit Aerodrome Certification"
                : "Add New Aerodrome Certification"}
            </DialogTitle>
          </DialogHeader>
          {selectedCertification && (
            <RecordWorkflowSection
              tableName="aerodrome_certifications"
              editingId={selectedCertification.id}
              directorate="DAAS"
            />
          )}
          <AerodromeCertificationForm
            onSubmit={handleSubmit}
            initialData={getInitialData()}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Certification Details</DialogTitle>
          </DialogHeader>
          {selectedCertification && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Aerodrome Name</p>
                  <p className="font-medium">{selectedCertification.aerodrome_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ICAO Code</p>
                  <p className="font-medium">{selectedCertification.icao_code || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedCertification.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Operator</p>
                  <p className="font-medium">{selectedCertification.operator_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Certificate Number</p>
                  <p className="font-medium">{selectedCertification.certificate_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Certificate Type</p>
                  <p className="font-medium">{selectedCertification.certificate_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Issue Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedCertification.issue_date), "PPP")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedCertification.expiry_date), "PPP")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedCertification.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{selectedCertification.category || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Runways</p>
                  <p className="font-medium">
                    {selectedCertification.runway_count || "-"} (
                    {selectedCertification.runway_length || "N/A"})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Inspection</p>
                  <p className="font-medium">
                    {selectedCertification.last_inspection_date
                      ? format(new Date(selectedCertification.last_inspection_date), "PPP")
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Inspection</p>
                  <p className="font-medium">
                    {selectedCertification.next_inspection_date
                      ? format(new Date(selectedCertification.next_inspection_date), "PPP")
                      : "-"}
                  </p>
                </div>
              </div>
              {selectedCertification.comments && (
                <div>
                  <p className="text-sm text-muted-foreground">Comments</p>
                  <p className="font-medium">{selectedCertification.comments}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the certification for{" "}
              <strong>{selectedCertification?.aerodrome_name}</strong>. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AerodromeCertificationPage;
