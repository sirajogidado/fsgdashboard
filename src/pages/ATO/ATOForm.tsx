
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { saveRecord, loadRecord } from "@/lib/saveRecord";
import { useEffect } from "react";

const formSchema = z.object({
  trainingOrganization: z.string().min(1, "Training organization is required"),
  approvalNumber: z.string().min(1, "Approval number is required"),
  certificateFile: z.any(),
  dateOfInitialIssue: z.string().min(1, "Date of initial issue is required"),
  dateOfLastRenewal: z.string().optional(),
  expiryDate: z.string().min(1, "Expiry date is required"),
  comment: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ATOFormProps {
  editingId?: string | null;
  onCancel?: () => void;
}

const ATOForm = ({ editingId, onCancel }: ATOFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trainingOrganization: "",
      approvalNumber: "",
      dateOfInitialIssue: "",
      dateOfLastRenewal: "",
      expiryDate: "",
      comment: "",
    },
  });

  useEffect(() => {
    (async () => {
      if (!editingId) return;
      try {
        const r = await loadRecord("ato_licenses", editingId);
        form.reset({
          trainingOrganization: r.organization_name ?? "",
          approvalNumber: r.certificate_number ?? "",
          dateOfInitialIssue: r.issue_date ?? "",
          dateOfLastRenewal: "",
          expiryDate: r.expiry_date ?? "",
          comment: "",
        });
      } catch {}
    })();
  }, [editingId, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      await saveRecord("ato_licenses", editingId, {
        organization_name: data.trainingOrganization,
        certificate_number: data.approvalNumber,
        issue_date: data.dateOfInitialIssue,
        expiry_date: data.expiryDate,
        training_type: data.comment || null,
        status: "active",
      });
      toast({ title: editingId ? "ATO Updated" : "ATO Added", description: "Saved successfully." });
      form.reset();
      if (onCancel) onCancel();
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    }
  };

  // Mock data for dropdowns - from Training Organization in global operations
  const trainingOrganizations = ["Ethiopian Airlines Training Academy", "Kenya Airways Training Center", "Rwanda Aviation Academy", "Tanzania Civil Aviation Academy"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="trainingOrganization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Training Organizations</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select training organization" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {trainingOrganizations.map((org) => (
                      <SelectItem key={org} value={org}>
                        {org}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="approvalNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Approval Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter approval number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certificateFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Certificate</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    onChange={(e) => field.onChange(e.target.files?.[0])} 
                    className="cursor-pointer"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfInitialIssue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Initial Issue</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfLastRenewal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Last Renewal</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiryDate"
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

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter comment" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel || (() => form.reset())}>
            Cancel
          </Button>
          <Button type="submit">{editingId ? "Update" : "Save"}</Button>
        </div>
      </form>
    </Form>
  );
};

export default ATOForm;
