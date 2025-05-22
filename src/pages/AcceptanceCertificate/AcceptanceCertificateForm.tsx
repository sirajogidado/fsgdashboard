
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  certificateNumber: z.string().min(1, "Certificate number is required"),
  aircraftManufacturer: z.string().min(1, "Aircraft manufacturer is required"),
  aircraftType: z.string().min(1, "Aircraft type is required"),
  engineType: z.string().min(1, "Engine type is required"),
  engineManufacturer: z.string().min(1, "Engine manufacturer is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  remarks: z.string().optional(),
  certificateFile: z.any(),
});

type FormValues = z.infer<typeof formSchema>;

interface AcceptanceCertificateFormProps {
  onCancel: () => void;
  editingId: string | null;
}

const AcceptanceCertificateForm: React.FC<AcceptanceCertificateFormProps> = ({ onCancel, editingId }) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      certificateNumber: "",
      aircraftManufacturer: "",
      aircraftType: "",
      engineType: "",
      engineManufacturer: "",
      issueDate: "",
      remarks: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    
    toast({
      title: editingId ? "Certificate Updated" : "Certificate Added",
      description: `Type Acceptance Certificate has been ${editingId ? "updated" : "added"} successfully.`,
    });
    
    onCancel();
  };

  // Mock data for dropdowns
  const manufacturers = ["Boeing", "Airbus", "Bombardier", "Embraer"];
  const aircraftTypes = ["737-800", "A350-900", "Q400", "E190"];
  const engineManufacturers = ["CFM International", "Pratt & Whitney", "Rolls-Royce", "General Electric"];

  return (
    <Card className="p-6 bg-white shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="certificateNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter certificate number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aircraftManufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aircraft Manufacturer</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select aircraft manufacturer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {manufacturers.map((manufacturer) => (
                        <SelectItem key={manufacturer} value={manufacturer}>
                          {manufacturer}
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
              name="aircraftType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aircraft Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select aircraft type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {aircraftTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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
              name="engineType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Engine Type</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter engine type" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="engineManufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Engine Manufacturer</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select engine manufacturer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {engineManufacturers.map((manufacturer) => (
                        <SelectItem key={manufacturer} value={manufacturer}>
                          {manufacturer}
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
              name="certificateFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Certificate</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      onChange={(e) => field.onChange(e.target.files?.[0])} 
                      className="cursor-pointer"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter any additional remarks" 
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingId ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default AcceptanceCertificateForm;
