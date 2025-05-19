
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  aocHolder: z.string().min(1, "AOC holder is required"),
  aircraftType: z.string().min(1, "Aircraft type is required"),
  certificateNumber: z.string().min(1, "Certificate number is required"),
  certificateFile: z.any(),
  issueDate: z.string().min(1, "Issue date is required"),
  validityDate: z.string().min(1, "Validity date is required"),
  opsSpecs: z.any(),
  partG: z.any(),
  remarks: z.string().optional(),
  operations: z.string().min(1, "Operation type is required"),
});

type FormValues = z.infer<typeof formSchema>;

const AOCForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      aocHolder: "",
      aircraftType: "",
      certificateNumber: "",
      issueDate: "",
      validityDate: "",
      remarks: "",
      operations: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    // In a real application, this would send data to an API
    console.log("Form submitted:", data);
    toast({
      title: "AOC Added",
      description: "The AOC has been successfully added.",
    });
    form.reset();
  };

  // Mock data for dropdowns - in a real app these would come from an API
  const aocHolders = ["Airline A", "Airline B", "Airline C"];
  const aircraftTypes = ["Boeing 737", "Airbus A320", "Embraer E190"];
  const operationTypes = ["Commercial", "Private", "Cargo"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="aocHolder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AOC Holder</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select AOC holder" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {aocHolders.map((holder) => (
                      <SelectItem key={holder} value={holder}>
                        {holder}
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
            name="certificateFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate File</FormLabel>
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
            name="validityDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Validity Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="opsSpecs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ops Specs</FormLabel>
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
            name="partG"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Part G</FormLabel>
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
            name="operations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operations</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select operation type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {operationTypes.map((type) => (
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
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};

export default AOCForm;
