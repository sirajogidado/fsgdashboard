
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Agency name must be at least 2 characters.",
  }),
  licenseNumber: z.string().min(2, {
    message: "License number is required.",
  }),
  address: z.string().min(2, {
    message: "Address is required.",
  }),
  contactPerson: z.string().min(2, {
    message: "Contact person is required.",
  }),
  phone: z.string().min(5, {
    message: "Phone number is required.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal('')),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TravelAgencyFormProps {
  onCancel: () => void;
  editingId: string | null;
}

// Sample data for demonstration
const sampleData = [
  {
    id: "1",
    name: "Global Travel Services",
    licenseNumber: "TA-10023",
    address: "123 Main St, New York, NY",
    contactPerson: "John Smith",
    phone: "+1-212-555-0123",
    email: "info@globaltravel.com",
    website: "https://www.globaltravel.com",
    notes: "Corporate travel specialist",
  },
  {
    id: "2",
    name: "Travel Express",
    licenseNumber: "TA-20045",
    address: "456 High St, London, UK",
    contactPerson: "Emma Johnson",
    phone: "+44-20-7123-4567",
    email: "info@travelexpress.com",
    website: "https://www.travelexpress.com",
    notes: "Leisure travel specialist",
  },
];

const TravelAgencyForm: React.FC<TravelAgencyFormProps> = ({ 
  onCancel,
  editingId
}) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      licenseNumber: "",
      address: "",
      contactPerson: "",
      phone: "",
      email: "",
      website: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (editingId) {
      const agency = sampleData.find(item => item.id === editingId);
      if (agency) {
        form.reset({
          name: agency.name,
          licenseNumber: agency.licenseNumber,
          address: agency.address,
          contactPerson: agency.contactPerson,
          phone: agency.phone,
          email: agency.email,
          website: agency.website || "",
          notes: agency.notes || "",
        });
      }
    } else {
      form.reset({
        name: "",
        licenseNumber: "",
        address: "",
        contactPerson: "",
        phone: "",
        email: "",
        website: "",
        notes: "",
      });
    }
  }, [editingId, form]);

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: editingId ? "Travel Agency Updated" : "Travel Agency Added",
      description: editingId 
        ? "Travel agency has been successfully updated."
        : "Travel agency has been successfully added.",
    });
    onCancel();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-medium mb-4">
          {editingId ? "Edit Travel Agency" : "Add Travel Agency"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agency Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter agency name" {...field} />
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
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact person name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="Enter website URL (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter address"
                  {...field}
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter notes (optional)"
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
            {editingId ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TravelAgencyForm;
