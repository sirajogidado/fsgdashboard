
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  operatorType: z.string().min(1, "Operator type is required"),
  existingAocOperator: z.string().optional(),
  foccNumber: z.string().min(1, "FOCC number is required"),
  foccFile: z.any(),
  mccNumber: z.string().min(1, "MCC number is required"),
  mccFile: z.any(),
  aircraftSerialNumber: z.string().min(1, "Aircraft serial number is required"),
  stateOfRegistry: z.string().min(1, "State of registry is required"),
  registeredOwner: z.string().min(1, "Registered owner is required"),
  aircraftManufacturer: z.string().min(1, "Aircraft manufacturer is required"),
  aircraftType: z.string().min(1, "Aircraft type is required"),
  aircraftRegNumber: z.string().min(1, "Aircraft registration number is required"),
  dateOfFirstIssue: z.string().min(1, "Date of first issue is required"),
  renewalDate: z.string().min(1, "Renewal date is required"),
  validityDate: z.string().min(1, "Validity date is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface FOCCMCCFormProps {
  onCancel: () => void;
  editingId: string | null;
}

const FOCCMCCForm: React.FC<FOCCMCCFormProps> = ({ onCancel, editingId }) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      operatorType: "existing_aoc",
      existingAocOperator: "",
      foccNumber: "",
      mccNumber: "",
      aircraftSerialNumber: "",
      stateOfRegistry: "",
      registeredOwner: "",
      aircraftManufacturer: "",
      aircraftType: "",
      aircraftRegNumber: "",
      dateOfFirstIssue: "",
      renewalDate: "",
      validityDate: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    
    toast({
      title: editingId ? "FOCC/MCC Updated" : "FOCC/MCC Added",
      description: `FOCC/MCC has been ${editingId ? "updated" : "added"} successfully.`,
    });
    
    onCancel();
  };

  // Mock data for dropdowns - from global operations
  const generalAviationOperators = ["Ethiopian Airlines", "Kenya Airways", "RwandAir", "Air Tanzania"];
  const stateOfRegistryOptions = ["Ethiopia", "Kenya", "Tanzania", "Rwanda", "Uganda"];
  const aircraftManufacturers = ["Boeing", "Airbus", "Bombardier", "Embraer"];
  const aircraftTypes = ["Boeing 737-800", "Airbus A350-900", "Bombardier Q400", "Embraer E190"];
  const aircraftRegistrationMarks = ["ET-AOP", "ET-AOR", "ET-AOS", "ET-AOT"];

  return (
    <Card className="p-6 bg-white shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="operatorType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Operator Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="existing_aoc" id="existing_aoc" />
                        <FormLabel htmlFor="existing_aoc" className="font-normal">
                          Existing AOC
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="non_aoc_holder" id="non_aoc_holder" />
                        <FormLabel htmlFor="non_aoc_holder" className="font-normal">
                          Non- AOC Holder
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("operatorType") === "existing_aoc" && (
              <FormField
                control={form.control}
                name="existingAocOperator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Existing AOC Operator</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select AOC operator" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {generalAviationOperators.map((operator) => (
                          <SelectItem key={operator} value={operator}>
                            {operator}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="foccNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FOCC Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter FOCC number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="foccFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FOCC Upload</FormLabel>
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
              name="mccNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MCC Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter MCC number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mccFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MCC Upload</FormLabel>
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
              name="aircraftSerialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aircraft Serial Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter aircraft serial number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stateOfRegistry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State of Registry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state of registry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stateOfRegistryOptions.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
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
              name="registeredOwner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registered Owner</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter registered owner" />
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
              name="aircraftRegNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aircraft Reg Number</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select aircraft registration number" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {aircraftRegistrationMarks.map((regNumber) => (
                        <SelectItem key={regNumber} value={regNumber}>
                          {regNumber}
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
              name="dateOfFirstIssue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of First Issue</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="renewalDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Renewal Date</FormLabel>
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

export default FOCCMCCForm;
