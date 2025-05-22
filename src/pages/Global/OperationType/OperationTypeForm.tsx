
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
    message: "Operation name must be at least 2 characters.",
  }),
  code: z.string().min(1, {
    message: "Code is required.",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface OperationTypeFormProps {
  onCancel: () => void;
  editingId: string | null;
}

// Sample data for demonstration
const sampleData = [
  {
    id: "1",
    name: "Scheduled Passenger",
    code: "SP",
    description: "Regular scheduled passenger services",
  },
  {
    id: "2",
    name: "Charter Passenger",
    code: "CP",
    description: "Non-scheduled passenger services",
  },
];

const OperationTypeForm: React.FC<OperationTypeFormProps> = ({ 
  onCancel,
  editingId
}) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  useEffect(() => {
    if (editingId) {
      const item = sampleData.find(item => item.id === editingId);
      if (item) {
        form.reset({
          name: item.name,
          code: item.code,
          description: item.description || "",
        });
      }
    } else {
      form.reset({
        name: "",
        code: "",
        description: "",
      });
    }
  }, [editingId, form]);

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: editingId ? "Operation Type Updated" : "Operation Type Added",
      description: editingId 
        ? "Operation type has been successfully updated."
        : "Operation type has been successfully added.",
    });
    onCancel();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-medium mb-4">
          {editingId ? "Edit Operation Type" : "Add Operation Type"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter operation type name" {...field} />
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
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter code" {...field} />
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

export default OperationTypeForm;
