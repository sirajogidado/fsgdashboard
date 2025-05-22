
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
    message: "Certificate type name must be at least 2 characters.",
  }),
  code: z.string().min(1, {
    message: "Code is required.",
  }),
  category: z.string().min(2, {
    message: "Category is required.",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CertificateTypeFormProps {
  onCancel: () => void;
  editingId: string | null;
}

// Sample data for demonstration
const sampleData = [
  {
    id: "1",
    name: "Air Operator Certificate",
    code: "AOC",
    category: "Operations",
    description: "Certificate authorizing an operator to carry out specified commercial air transport operations",
  },
  {
    id: "2",
    name: "Airworthiness Certificate",
    code: "CofA",
    category: "Airworthiness",
    description: "Certificate confirming that an aircraft meets its approved design and is in condition for safe operation",
  },
];

const CertificateTypeForm: React.FC<CertificateTypeFormProps> = ({ 
  onCancel,
  editingId
}) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      category: "",
      description: "",
    },
  });

  useEffect(() => {
    if (editingId) {
      const certType = sampleData.find(item => item.id === editingId);
      if (certType) {
        form.reset({
          name: certType.name,
          code: certType.code,
          category: certType.category,
          description: certType.description || "",
        });
      }
    } else {
      form.reset({
        name: "",
        code: "",
        category: "",
        description: "",
      });
    }
  }, [editingId, form]);

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: editingId ? "Certificate Type Updated" : "Certificate Type Added",
      description: editingId 
        ? "Certificate type has been successfully updated."
        : "Certificate type has been successfully added.",
    });
    onCancel();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-medium mb-4">
          {editingId ? "Edit Certificate Type" : "Add Certificate Type"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter certificate type name" {...field} />
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

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
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

export default CertificateTypeForm;
