
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
    message: "State name must be at least 2 characters.",
  }),
  code: z.string().min(2, {
    message: "State code is required.",
  }),
  region: z.string().min(2, {
    message: "Region is required.",
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface StateRegistryFormProps {
  onCancel: () => void;
  editingId: string | null;
}

// Sample data for demonstration
const sampleData = [
  {
    id: "1",
    name: "United States",
    code: "US",
    region: "North America",
    notes: "FAA is the regulator",
  },
  {
    id: "2",
    name: "United Kingdom",
    code: "UK",
    region: "Europe",
    notes: "CAA is the regulator",
  },
];

const StateRegistryForm: React.FC<StateRegistryFormProps> = ({ 
  onCancel,
  editingId
}) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      region: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (editingId) {
      const item = sampleData.find(item => item.id === editingId);
      if (item) {
        form.reset({
          name: item.name,
          code: item.code,
          region: item.region,
          notes: item.notes || "",
        });
      }
    } else {
      form.reset({
        name: "",
        code: "",
        region: "",
        notes: "",
      });
    }
  }, [editingId, form]);

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: editingId ? "State Registry Updated" : "State Registry Added",
      description: editingId 
        ? "State registry has been successfully updated."
        : "State registry has been successfully added.",
    });
    onCancel();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-medium mb-4">
          {editingId ? "Edit State Registry" : "Add State Registry"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter state name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter state code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Input placeholder="Enter region" {...field} />
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

export default StateRegistryForm;
