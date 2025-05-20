
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  manufacturerId: z.string({
    required_error: "Please select a manufacturer.",
  }),
  typeName: z.string().min(2, {
    message: "Aircraft type must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AircraftTypeFormProps {
  onCancel: () => void;
  editingId: string | null;
}

// Sample manufacturers data
const manufacturers = [
  { id: "1", name: "Boeing" },
  { id: "2", name: "Airbus" },
  { id: "3", name: "Embraer" },
  { id: "4", name: "Bombardier" },
];

// Sample aircraft types data
const sampleTypes = [
  {
    id: "1",
    manufacturerId: "1",
    typeName: "737",
    description: "Twin jet narrow-body airliner",
  },
  {
    id: "2",
    manufacturerId: "1",
    typeName: "777",
    description: "Wide-body twin-engine jet airliner",
  },
  {
    id: "3",
    manufacturerId: "2",
    typeName: "A320",
    description: "Narrow-body commercial passenger jet",
  },
  {
    id: "4",
    manufacturerId: "3",
    typeName: "E190",
    description: "Narrow-body medium-range jet airliner",
  },
];

const AircraftTypeForm: React.FC<AircraftTypeFormProps> = ({
  onCancel,
  editingId,
}) => {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      manufacturerId: "",
      typeName: "",
      description: "",
    },
  });

  useEffect(() => {
    if (editingId) {
      const aircraftType = sampleTypes.find((type) => type.id === editingId);
      if (aircraftType) {
        form.reset({
          manufacturerId: aircraftType.manufacturerId,
          typeName: aircraftType.typeName,
          description: aircraftType.description || "",
        });
      }
    } else {
      form.reset({
        manufacturerId: "",
        typeName: "",
        description: "",
      });
    }
  }, [editingId, form]);

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: editingId ? "Aircraft Type Updated" : "Aircraft Type Added",
      description: editingId
        ? "Aircraft type has been successfully updated."
        : "Aircraft type has been successfully added.",
    });
    onCancel();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-medium mb-4">
          {editingId ? "Edit Aircraft Type" : "Add Aircraft Type"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="manufacturerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aircraft Manufacturer</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manufacturer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {manufacturers.map((manufacturer) => (
                      <SelectItem
                        key={manufacturer.id}
                        value={manufacturer.id}
                      >
                        {manufacturer.name}
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
            name="typeName"
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
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
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

export default AircraftTypeForm;
