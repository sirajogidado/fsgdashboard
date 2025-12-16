import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { format, isBefore, addDays } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const certFormSchema = z.object({
  certification_name: z.string().min(1, "Certification name is required"),
  certification_number: z.string().optional(),
  issuing_authority: z.string().min(1, "Issuing authority is required"),
  issue_date: z.string().min(1, "Issue date is required"),
  expiry_date: z.string().min(1, "Expiry date is required"),
  status: z.string().min(1, "Status is required"),
});

const certificationTypes = [
  "Airport Safety Officer",
  "Fire & Rescue Training",
  "Air Traffic Control License",
  "Ground Handling Certification",
  "Security Screening",
  "Dangerous Goods Handling",
  "First Aid Certification",
  "Emergency Response Training",
  "Other",
];

const PersonnelCertificationsPage = () => {
  const { personnelId } = useParams();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: personnel } = useQuery({
    queryKey: ["personnel", personnelId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("aerodrome_personnel")
        .select("*, aerodrome_certifications(aerodrome_name)")
        .eq("id", personnelId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: certifications = [], isLoading } = useQuery({
    queryKey: ["personnel-certifications", personnelId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personnel_certifications")
        .select("*")
        .eq("personnel_id", personnelId)
        .order("expiry_date");
      if (error) throw error;
      return data;
    },
  });

  const form = useForm({
    resolver: zodResolver(certFormSchema),
    defaultValues: {
      certification_name: "",
      certification_number: "",
      issuing_authority: "",
      issue_date: "",
      expiry_date: "",
      status: "active",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("personnel_certifications").insert([{ ...data, personnel_id: personnelId }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personnel-certifications", personnelId] });
      toast.success("Certification added successfully");
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { error } = await supabase.from("personnel_certifications").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personnel-certifications", personnelId] });
      toast.success("Certification updated successfully");
      setIsDialogOpen(false);
      setEditingCert(null);
      form.reset();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("personnel_certifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personnel-certifications", personnelId] });
      toast.success("Certification deleted successfully");
    },
    onError: (error: any) => toast.error(error.message),
  });

  const handleSubmit = (data: any) => {
    const cleanedData = {
      ...data,
      certification_number: data.certification_number || null,
    };

    if (editingCert) {
      updateMutation.mutate({ id: editingCert.id, ...cleanedData });
    } else {
      createMutation.mutate(cleanedData);
    }
  };

  const handleEdit = (cert: any) => {
    setEditingCert(cert);
    form.reset({
      certification_name: cert.certification_name,
      certification_number: cert.certification_number || "",
      issuing_authority: cert.issuing_authority,
      issue_date: cert.issue_date,
      expiry_date: cert.expiry_date,
      status: cert.status,
    });
    setIsDialogOpen(true);
  };

  const getStatusBadge = (expiryDate: string, status: string) => {
    if (status !== "active") return "bg-gray-100 text-gray-800";
    const today = new Date();
    const expiry = new Date(expiryDate);
    if (isBefore(expiry, today)) return "bg-red-100 text-red-800";
    if (isBefore(expiry, addDays(today, 30))) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getStatusText = (expiryDate: string, status: string) => {
    if (status !== "active") return status;
    const today = new Date();
    const expiry = new Date(expiryDate);
    if (isBefore(expiry, today)) return "Expired";
    if (isBefore(expiry, addDays(today, 30))) return "Expiring Soon";
    return "Valid";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/daas/personnel")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {personnel?.full_name || "Personnel"} - Certifications
          </h1>
          <p className="text-muted-foreground">
            {personnel?.position} at {personnel?.aerodrome_certifications?.aerodrome_name || "N/A"}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => { setEditingCert(null); form.reset(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Certification
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : certifications.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No certifications found. Click "Add Certification" to create one.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certification</TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Issuing Authority</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certifications.map((cert: any) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-medium">{cert.certification_name}</TableCell>
                  <TableCell>{cert.certification_number || "N/A"}</TableCell>
                  <TableCell>{cert.issuing_authority}</TableCell>
                  <TableCell>{format(new Date(cert.issue_date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{format(new Date(cert.expiry_date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(cert.expiry_date, cert.status)}>
                      {getStatusText(cert.expiry_date, cert.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(cert)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this certification?")) {
                          deleteMutation.mutate(cert.id);
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCert ? "Edit Certification" : "Add New Certification"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="certification_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certification Name</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select certification" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {certificationTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certification_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certification Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter certification number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issuing_authority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuing Authority</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter issuing authority" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="issue_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiry_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="revoked">Revoked</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); setEditingCert(null); }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingCert ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonnelCertificationsPage;
