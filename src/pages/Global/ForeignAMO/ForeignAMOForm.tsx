
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
    message: "AMO name must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country is required.",
  }),
  certificateNumber: z.string().min(2, {
    message: "Certificate number is required.",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ForeignAMOFormProps {
  onCancel: () => void;
  editingId: string | null;
}

// Sample data for demonstration
const sampleData = [
  {
    id: "1",
    name: "Lufthansa Technik",
    country: "Germany",
    certificateNumber: "DE.145.0001",
    description: "Aircraft maintenance organization for Lufthansa fleet",
  },
  {
    id: "2",
    name: "Air France Industries",
    country: "France",
    certificateNumber: "FR.145.0010",
    description: "MRO services for Air France and other airlines",
  },
];

const ForeignAMOForm: React.FC<ForeignAMOFormProps> = ({ 
  onCancel,
  editingId
}) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      country: "",
      certificateNumber: "",
      description: "",
    },
  });

  useEffect(() => {
    if (editingId) {
      const amo = sampleData.find(item => item.id === editingId);
      if (amo) {
        form.reset({
          name: amo.name,
          country: amo.country,
          certificateNumber: amo.certificateNumber,
          description: amo.description || "",
        });
      }
    } else {
      form.reset({
        name: "",
        country: "",
        certificateNumber: "",
        description: "",
      });
    }
  }, [editingId, form]);

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: editingId ? "AMO Updated" : "AMO Added",
      description: editingId 
        ? "Foreign AMO has been successfully updated."
        : "Foreign AMO has been successfully added.",
    });
    onCancel();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-medium mb-4">
          {editingId ? "Edit Foreign AMO" : "Add Foreign AMO"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AMO Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter AMO name" {...field} />
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
            name="certificateNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter certificate number" {...field} />
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

export default ForeignAMOForm;
