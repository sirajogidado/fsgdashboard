
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
    message: "Manufacturer name must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country is required.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal('')),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AircraftManufacturerFormProps {
  onCancel: () => void;
  editingId: string | null;
}

// Sample data for demonstration
const sampleData = [
  {
    id: "1",
    name: "Boeing",
    country: "United States",
    website: "https://www.boeing.com",
    description: "Commercial and military aircraft manufacturer",
  },
  {
    id: "2",
    name: "Airbus",
    country: "France/Germany",
    website: "https://www.airbus.com",
    description: "Global aerospace corporation",
  },
  {
    id: "3",
    name: "Embraer",
    country: "Brazil",
    website: "https://www.embraer.com",
    description: "Brazilian aerospace conglomerate",
  },
  {
    id: "4",
    name: "Bombardier",
    country: "Canada",
    website: "https://www.bombardier.com",
    description: "Aviation and rail transport manufacturer",
  },
];

const AircraftManufacturerForm: React.FC<AircraftManufacturerFormProps> = ({ 
  onCancel,
  editingId
}) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      country: "",
      website: "",
      description: "",
    },
  });

  useEffect(() => {
    if (editingId) {
      const manufacturer = sampleData.find(item => item.id === editingId);
      if (manufacturer) {
        form.reset({
          name: manufacturer.name,
          country: manufacturer.country,
          website: manufacturer.website || "",
          description: manufacturer.description || "",
        });
      }
    } else {
      form.reset({
        name: "",
        country: "",
        website: "",
        description: "",
      });
    }
  }, [editingId, form]);

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: editingId ? "Manufacturer Updated" : "Manufacturer Added",
      description: editingId 
        ? "Aircraft manufacturer has been successfully updated."
        : "Aircraft manufacturer has been successfully added.",
    });
    onCancel();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-medium mb-4">
          {editingId ? "Edit Aircraft Manufacturer" : "Add Aircraft Manufacturer"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter manufacturer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Enter country" {...field} />
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description (optional)"
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

export default AircraftManufacturerForm;
