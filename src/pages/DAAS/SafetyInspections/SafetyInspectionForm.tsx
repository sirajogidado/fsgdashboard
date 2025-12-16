import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  aerodrome_id: z.string().min(1, "Please select an aerodrome"),
  inspection_type: z.string().min(1, "Inspection type is required"),
  scheduled_date: z.string().min(1, "Scheduled date is required"),
  completed_date: z.string().optional(),
  inspector_name: z.string().min(1, "Inspector name is required"),
  status: z.string().min(1, "Status is required"),
  compliance_status: z.string().optional(),
  findings: z.string().optional(),
  recommendations: z.string().optional(),
  next_inspection_date: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SafetyInspectionFormProps {
  initialData?: any;
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const inspectionTypes = [
  "Annual Safety Inspection",
  "Runway Inspection",
  "Lighting Inspection",
  "Fire Safety Inspection",
  "Security Inspection",
  "Environmental Inspection",
  "Emergency Response Inspection",
  "Other",
];

export const SafetyInspectionForm = ({ initialData, onSubmit, onCancel, isLoading }: SafetyInspectionFormProps) => {
  const { data: aerodromes = [] } = useQuery({
    queryKey: ["aerodrome-certifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("aerodrome_certifications")
        .select("id, aerodrome_name")
        .order("aerodrome_name");
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      aerodrome_id: initialData?.aerodrome_id || "",
      inspection_type: initialData?.inspection_type || "",
      scheduled_date: initialData?.scheduled_date || "",
      completed_date: initialData?.completed_date || "",
      inspector_name: initialData?.inspector_name || "",
      status: initialData?.status || "scheduled",
      compliance_status: initialData?.compliance_status || "pending",
      findings: initialData?.findings || "",
      recommendations: initialData?.recommendations || "",
      next_inspection_date: initialData?.next_inspection_date || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="aerodrome_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aerodrome</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select aerodrome" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {aerodromes.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.aerodrome_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inspection_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inspection Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {inspectionTypes.map((type) => (
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
            name="scheduled_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scheduled Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="completed_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Completed Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inspector_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inspector Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter inspector name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="compliance_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Compliance Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select compliance" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                    <SelectItem value="partial">Partial Compliance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="next_inspection_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Inspection Date</FormLabel>
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
          name="findings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Findings</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter inspection findings" rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recommendations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recommendations</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter recommendations" rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
