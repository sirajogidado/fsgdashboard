
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
  aircraftManufacturer: z.string().min(1, "Aircraft manufacturer is required"),
  tcAcceptanceCertNumber: z.string().min(1, "TC Acceptance Approval Certificate Number is required"),
  certificateFile: z.any(),
  dateIssued: z.string().min(1, "Date issued is required"),
  tcHolder: z.string().min(1, "TC holder is required"),
  originalTcIssuedBy: z.string().min(1, "Original TC issued by is required"),
  tcNumber: z.string().min(1, "TC number is required"),
  remark: z.string().optional(),
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
      aircraftManufacturer: "",
      tcAcceptanceCertNumber: "",
      dateIssued: "",
      tcHolder: "",
      originalTcIssuedBy: "",
      tcNumber: "",
      remark: "",
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

  // Mock data for dropdowns - from global operations
  const aircraftManufacturers = ["Boeing", "Airbus", "Bombardier", "Embraer", "Cessna", "Piper"];

  return (
    <Card className="p-6 bg-white shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      {aircraftManufacturers.map((manufacturer) => (
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
              name="tcAcceptanceCertNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TC Acceptance Approval Certificate Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter TC acceptance approval certificate number" />
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
                  <FormLabel>TC Acceptance Approval Certificate (Upload)</FormLabel>
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
              name="dateIssued"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Issued</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tcHolder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TC Holder</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select TC holder" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {aircraftManufacturers.map((manufacturer) => (
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
              name="originalTcIssuedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original TC Issued by</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter original TC issuer" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tcNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TC Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter TC number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Remark</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter remark" 
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
