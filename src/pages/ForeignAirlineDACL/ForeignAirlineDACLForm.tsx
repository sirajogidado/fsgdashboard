import React, { useState, useEffect } from "react";
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
  foreignAirline: z.string().min(1, "Foreign airline is required"),
  daclNumber: z.string().min(1, "DACL number is required"),
  daclCertificate: z.any(),
  daclIssueDate: z.string().min(1, "DACL issue date is required"),
  foreignAocFile: z.any(),
  aocExpiryDate: z.string().min(1, "AOC expiry date is required"),
  country: z.string().min(1, "Country is required"),
  remarks: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ForeignAirlineDACLFormProps {
  onCancel: () => void;
  editingId: string | null;
}

const ForeignAirlineDACLForm: React.FC<ForeignAirlineDACLFormProps> = ({ onCancel, editingId }) => {
  const { toast } = useToast();
  const [lastDaclNumber, setLastDaclNumber] = useState(1);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foreignAirline: "",
      daclNumber: "",
      daclIssueDate: "",
      aocExpiryDate: "",
      country: "",
      remarks: "",
    },
  });

  // Generate DACL number based on format FSG/NCAA/DACL/xxxx
  useEffect(() => {
    const generateDaclNumber = () => {
      const paddedNumber = String(lastDaclNumber).padStart(4, '0');
      return `FSG/NCAA/DACL/${paddedNumber}`;
    };
    
    if (!editingId) {
      form.setValue("daclNumber", generateDaclNumber());
    }
  }, [lastDaclNumber, editingId, form]);

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    
    toast({
      title: editingId ? "DACL Updated" : "DACL Added",
      description: `Foreign Airline DACL has been ${editingId ? "updated" : "added"} successfully.`,
    });
    
    onCancel();
  };

  // Mock data for dropdowns - from global operations
  const foreignAirlines = ["Emirates", "Qatar Airways", "Turkish Airlines", "Lufthansa", "British Airways"];
  const countries = [
    "United Arab Emirates", "Qatar", "Turkey", "Germany", "United Kingdom", 
    "United States", "France", "Netherlands", "Switzerland", "Belgium",
    "Italy", "Spain", "Canada", "Japan", "Singapore", "South Korea",
    "Australia", "Brazil", "Argentina", "Chile", "Mexico", "India",
    "China", "Russia", "Saudi Arabia", "Egypt", "Morocco", "South Africa"
  ];

  return (
    <Card className="p-6 bg-white shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="foreignAirline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foreign Airline</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select foreign airline" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {foreignAirlines.map((airline) => (
                        <SelectItem key={airline} value={airline}>
                          {airline}
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
              name="daclNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DACL Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="FSG/NCAA/DACL/xxxx" readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="daclCertificate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DACL Certificate (Upload)</FormLabel>
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
              name="daclIssueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DACL Issue Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="foreignAocFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foreign AOC & Operation Specification (Upload)</FormLabel>
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
              name="aocExpiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AOC Expiry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
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
              name="remarks"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter remarks" 
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
              {editingId ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default ForeignAirlineDACLForm;