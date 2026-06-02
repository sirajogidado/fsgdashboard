
import React, { useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { saveRecord, loadRecord } from "@/lib/saveRecord";

const formSchema = z.object({
  aocHolder: z.string().min(1, "AOC holder is required"),
  aocCertificate: z.string().min(1, "AOC certificate is required"),
  certificateFile: z.any(),
  issueDate: z.string().min(1, "Issue date is required"),
  validityDate: z.string().min(1, "Validity date is required"),
  opsSpecs: z.any(),
  partG: z.any(),
  status: z.string().min(1, "Status is required"),
});

type FormValues = z.infer<typeof formSchema>;

// Sample AOC data for demonstration
const mockData = [
  {
    id: "1",
    aocHolder: "Airline A",
    aircraftType: "Boeing 737",
    certificateNumber: "AOC-001-2023",
    issueDate: "2023-01-15",
    validityDate: "2024-01-15",
    remarks: "Regular domestic operations",
    operations: "Commercial",
  },
  {
    id: "2",
    aocHolder: "Airline B",
    aircraftType: "Airbus A320",
    certificateNumber: "AOC-002-2023",
    issueDate: "2023-02-20",
    validityDate: "2024-02-20",
    remarks: "International routes only",
    operations: "Commercial",
  },
  {
    id: "3",
    aocHolder: "Airline C",
    aircraftType: "Embraer E190",
    certificateNumber: "AOC-003-2023",
    issueDate: "2023-03-10",
    validityDate: "2023-05-10",
    remarks: "Cargo operations between major hubs",
    operations: "Cargo",
  },
  {
    id: "4",
    aocHolder: "Airline D",
    aircraftType: "Boeing 777",
    certificateNumber: "AOC-004-2023",
    issueDate: "2023-04-05",
    validityDate: "2023-06-30",
    remarks: "VIP charter operations",
    operations: "Private",
  },
];

interface AOCFormProps {
  onCancel: () => void;
  editingId: string | null;
}

const AOCForm = ({ onCancel, editingId }: AOCFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      aocHolder: "",
      aocCertificate: "",
      issueDate: "",
      validityDate: "",
      status: "active",
    },
  });

  useEffect(() => {
    (async () => {
      if (editingId) {
        try {
          const r = await loadRecord("aoc_certificates", editingId);
          form.reset({
            aocHolder: r.operator_name ?? "",
            aocCertificate: r.certificate_number ?? "",
            issueDate: r.issue_date ?? "",
            validityDate: r.expiry_date ?? "",
            status: r.status ?? "active",
          });
        } catch (e) { /* ignore */ }
      } else {
        form.reset({ aocHolder: "", aocCertificate: "", issueDate: "", validityDate: "", status: "active" });
      }
    })();
  }, [editingId, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      await saveRecord("aoc_certificates", editingId, {
        operator_name: data.aocHolder,
        certificate_number: data.aocCertificate,
        issue_date: data.issueDate,
        expiry_date: data.validityDate,
        status: data.status,
      });
      toast({ title: editingId ? "AOC Updated" : "AOC Added", description: "Saved successfully." });
      onCancel();
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    }
  };

  // Mock data for dropdowns - in a real app these would come from global operations
  const generalAviationOperators = ["Ethiopian Airlines", "Kenya Airways", "RwandAir", "Air Tanzania"];
  const statusOptions = ["Active", "Suspended", "Expired", "Revoked"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="aocHolder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AOC Holder</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select AOC holder" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {generalAviationOperators.map((holder) => (
                      <SelectItem key={holder} value={holder}>
                        {holder}
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
            name="aocCertificate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AOC Certificate</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter AOC certificate" />
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
                <FormLabel>AOC Certificate (Upload)</FormLabel>
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
            name="issueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issued Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="validityDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Validity Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="opsSpecs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OPS Specs (Upload)</FormLabel>
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
            name="partG"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Part G (Upload)</FormLabel>
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
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {statusOptions.map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <RadioGroupItem value={status.toLowerCase()} id={status.toLowerCase()} />
                        <FormLabel htmlFor={status.toLowerCase()} className="font-normal">
                          {status}
                        </FormLabel>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{editingId ? "Update" : "Save"}</Button>
        </div>
      </form>
    </Form>
  );
};

export default AOCForm;
