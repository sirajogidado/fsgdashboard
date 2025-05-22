
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
    message: "Airline name must be at least 2 characters.",
  }),
  iataCode: z.string().min(2, {
    message: "IATA code is required.",
  }),
  icaoCode: z.string().min(3, {
    message: "ICAO code is required.",
  }),
  country: z.string().min(2, {
    message: "Country is required.",
  }),
  headquarters: z.string().min(2, {
    message: "Headquarters is required.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal('')),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ForeignAirlineFormProps {
  onCancel: () => void;
  editingId: string | null;
}

// Sample data for demonstration
const sampleData = [
  {
    id: "1",
    name: "Emirates",
    iataCode: "EK",
    icaoCode: "UAE",
    country: "United Arab Emirates",
    headquarters: "Dubai",
    website: "https://www.emirates.com",
    notes: "Flag carrier of the UAE",
  },
  {
    id: "2",
    name: "British Airways",
    iataCode: "BA",
    icaoCode: "BAW",
    country: "United Kingdom",
    headquarters: "London",
    website: "https://www.britishairways.com",
    notes: "Flag carrier of the UK",
  },
];

const ForeignAirlineForm: React.FC<ForeignAirlineFormProps> = ({ 
  onCancel,
  editingId
}) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      iataCode: "",
      icaoCode: "",
      country: "",
      headquarters: "",
      website: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (editingId) {
      const airline = sampleData.find(item => item.id === editingId);
      if (airline) {
        form.reset({
          name: airline.name,
          iataCode: airline.iataCode,
          icaoCode: airline.icaoCode,
          country: airline.country,
          headquarters: airline.headquarters,
          website: airline.website || "",
          notes: airline.notes || "",
        });
      }
    } else {
      form.reset({
        name: "",
        iataCode: "",
        icaoCode: "",
        country: "",
        headquarters: "",
        website: "",
        notes: "",
      });
    }
  }, [editingId, form]);

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: editingId ? "Airline Updated" : "Airline Added",
      description: editingId 
        ? "Foreign airline has been successfully updated."
        : "Foreign airline has been successfully added.",
    });
    onCancel();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-medium mb-4">
          {editingId ? "Edit Foreign Airline" : "Add Foreign Airline"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
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
            name="iataCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IATA Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter IATA code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icaoCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ICAO Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter ICAO code" {...field} />
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
            name="headquarters"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headquarters</FormLabel>
                <FormControl>
                  <Input placeholder="Enter headquarters" {...field} />
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

export default ForeignAirlineForm;
