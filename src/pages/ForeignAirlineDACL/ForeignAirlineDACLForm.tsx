
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  airlineName: z.string().min(2, {
    message: "Airline name must be at least 2 characters.",
  }),
  countryOfOrigin: z.string().min(2, {
    message: "Country is required.",
  }),
  aircraftType: z.string().min(1, {
    message: "Aircraft type is required.",
  }),
  licenseNumber: z.string().min(1, {
    message: "License number is required.",
  }),
  issueDate: z.string().min(1, {
    message: "Issue date is required.",
  }),
  expiryDate: z.string().min(1, {
    message: "Expiry date is required.",
  }),
  status: z.string().min(1, {
    message: "Status is required.",
  }),
  remarks: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Sample DACL data for demonstration
const sampleData = [
  {
    id: "1",
    airlineName: "Emirates",
    countryOfOrigin: "United Arab Emirates",
    aircraftType: "Boeing 777",
    licenseNumber: "DACL-001-2023",
    issueDate: "2023-01-15",
    expiryDate: "2024-01-15",
    status: "Active",
    remarks: "Regular flights to Lagos",
  },
  {
    id: "2",
    airlineName: "British Airways",
    countryOfOrigin: "United Kingdom",
    aircraftType: "Airbus A380",
    licenseNumber: "DACL-002-2023",
    issueDate: "2023-02-10",
    expiryDate: "2024-02-10",
    status: "Active",
    remarks: "Weekly flights",
  },
  {
    id: "3",
    airlineName: "Air France",
    countryOfOrigin: "France",
    aircraftType: "Airbus A350",
    licenseNumber: "DACL-003-2023",
    issueDate: "2023-03-05",
    expiryDate: "2023-04-05",
    status: "Expired",
    remarks: "Renewal pending",
  }
];

interface ForeignAirlineDACLFormProps {
  onCancel: () => void;
  editingId: string | null;
}

const ForeignAirlineDACLForm: React.FC<ForeignAirlineDACLFormProps> = ({ 
  onCancel,
  editingId
}) => {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      airlineName: "",
      countryOfOrigin: "",
      aircraftType: "",
      licenseNumber: "",
      issueDate: "",
      expiryDate: "",
      status: "Active",
      remarks: "",
    },
  });

  useEffect(() => {
    if (editingId) {
      const daclRecord = sampleData.find(item => item.id === editingId);
      if (daclRecord) {
        form.reset({
          airlineName: daclRecord.airlineName,
          countryOfOrigin: daclRecord.countryOfOrigin,
          aircraftType: daclRecord.aircraftType,
          licenseNumber: daclRecord.licenseNumber,
          issueDate: daclRecord.issueDate,
          expiryDate: daclRecord.expiryDate,
          status: daclRecord.status,
          remarks: daclRecord.remarks || "",
        });
      }
    } else {
      form.reset({
        airlineName: "",
        countryOfOrigin: "",
        aircraftType: "",
        licenseNumber: "",
        issueDate: "",
        expiryDate: "",
        status: "Active",
        remarks: "",
      });
    }
  }, [editingId, form]);

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: editingId ? "DACL Updated" : "DACL Added",
      description: editingId 
        ? "Foreign Airline DACL has been successfully updated."
        : "Foreign Airline DACL has been successfully added.",
    });
    onCancel();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="airlineName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Airline Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter airline name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="countryOfOrigin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country of Origin</FormLabel>
                <FormControl>
                  <Input placeholder="Enter country of origin" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input placeholder="Enter aircraft type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="licenseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter license number" {...field} />
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Revoked">Revoked</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional remarks"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {editingId ? "Update" : "Submit"} DACL
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ForeignAirlineDACLForm;
