
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  aocHolder: z.string().min(1, "AOC holder is required"),
  aircraftType: z.string().min(1, "Aircraft type is required"),
  certificateNumber: z.string().min(1, "Certificate number is required"),
  certificateFile: z.any(),
  issueDate: z.string().min(1, "Issue date is required"),
  validityDate: z.string().min(1, "Validity date is required"),
  opsSpecs: z.any(),
  partG: z.any(),
  remarks: z.string().optional(),
  operations: z.string().min(1, "Operation type is required"),
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
      aircraftType: "",
      certificateNumber: "",
      issueDate: "",
      validityDate: "",
      remarks: "",
      operations: "",
    },
  });

  useEffect(() => {
    if (editingId) {
      const aoc = mockData.find(item => item.id === editingId);
      if (aoc) {
        form.reset({
          aocHolder: aoc.aocHolder,
          aircraftType: aoc.aircraftType,
          certificateNumber: aoc.certificateNumber,
          issueDate: aoc.issueDate,
          validityDate: aoc.validityDate,
          remarks: aoc.remarks || "",
          operations: aoc.operations,
        });
      }
    } else {
      form.reset({
        aocHolder: "",
        aircraftType: "",
        certificateNumber: "",
        issueDate: "",
        validityDate: "",
        remarks: "",
        operations: "",
      });
    }
  }, [editingId, form]);

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    toast({
      title: editingId ? "AOC Updated" : "AOC Added",
      description: editingId 
        ? "The AOC has been successfully updated."
        : "The AOC has been successfully added.",
    });
    onCancel();
  };

  // Mock data for dropdowns - in a real app these would come from an API
  const aocHolders = ["Airline A", "Airline B", "Airline C"];
  const aircraftTypes = ["Boeing 737", "Airbus A320", "Embraer E190"];
  const operationTypes = ["Commercial", "Private", "Cargo"];

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
                    {aocHolders.map((holder) => (
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
            name="aircraftType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aircraft Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select aircraft type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {aircraftTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
            name="certificateNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter certificate number" />
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
                <FormLabel>Certificate File</FormLabel>
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
                <FormLabel>Ops Specs</FormLabel>
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
                <FormLabel>Part G</FormLabel>
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
            name="operations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operations</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select operation type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {operationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
            name="remarks"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Remarks</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Enter any additional remarks" 
                    className="min-h-[100px]"
                  />
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
