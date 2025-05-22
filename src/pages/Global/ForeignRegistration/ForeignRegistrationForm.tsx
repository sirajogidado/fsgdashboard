
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
  registrationMark: z.string().min(2, {
    message: "Registration mark must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country is required.",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ForeignRegistrationFormProps {
  onCancel: () => void;
  editingId: string | null;
}

// Sample data for demonstration
const sampleData = [
  {
    id: "1",
    registrationMark: "N12345",
    country: "United States",
    description: "Boeing 737 registration",
  },
  {
    id: "2",
    registrationMark: "G-ABCD",
    country: "United Kingdom",
    description: "Airbus A320 registration",
  },
];

const ForeignRegistrationForm: React.FC<ForeignRegistrationFormProps> = ({ 
  onCancel,
  editingId
}) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registrationMark: "",
      country: "",
      description: "",
    },
  });

  useEffect(() => {
    if (editingId) {
      const registration = sampleData.find(item => item.id === editingId);
      if (registration) {
        form.reset({
          registrationMark: registration.registrationMark,
          country: registration.country,
          description: registration.description || "",
        });
      }
    } else {
      form.reset({
        registrationMark: "",
        country: "",
        description: "",
      });
    }
  }, [editingId, form]);

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: editingId ? "Registration Updated" : "Registration Added",
      description: editingId 
        ? "Foreign registration has been successfully updated."
        : "Foreign registration has been successfully added.",
    });
    onCancel();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-medium mb-4">
          {editingId ? "Edit Foreign Registration" : "Add Foreign Registration"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="registrationMark"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Mark</FormLabel>
                <FormControl>
                  <Input placeholder="Enter registration mark" {...field} />
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

export default ForeignRegistrationForm;
