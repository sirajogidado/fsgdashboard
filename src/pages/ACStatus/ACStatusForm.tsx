
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
  aocHolder: z.string().min(1, "AOC holder is required"),
  aircraftMaker: z.string().min(1, "Aircraft maker is required"),
  registrationMark: z.string().min(1, "Registration mark is required"),
  aircraftType: z.string().min(1, "Aircraft type is required"),
  aircraftSerialNumber: z.string().min(1, "Aircraft serial number is required"),
  yearOfManufacture: z.string().min(1, "Year of manufacture is required"),
  currentRegistrationDate: z.string().min(1, "Current registration date is required"),
  registeredOwner: z.string().min(1, "Registered owner is required"),
  cofaStatus: z.string().min(1, "C of A status is required"),
  cofaFile: z.any(),
  weight: z.string().min(1, "Weight is required"),
  majorChecks: z.string().min(1, "Major checks are required"),
  corFile: z.any(),
  noiseCertFile: z.any(),
  modeSFile: z.any(),
  rvsm: z.string().min(1, "RVSM selection is required"),
  pbn: z.string().min(1, "PBN selection is required"),
  lvo: z.string().min(1, "LVO selection is required"),
  adsb: z.string().min(1, "ADS-B selection is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface ACStatusFormProps {
  onCancel: () => void;
  editingId: string | null;
}

const ACStatusForm: React.FC<ACStatusFormProps> = ({ onCancel, editingId }) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      aocHolder: "",
      aircraftMaker: "",
      registrationMark: "",
      aircraftType: "",
      aircraftSerialNumber: "",
      yearOfManufacture: "",
      currentRegistrationDate: "",
      registeredOwner: "",
      cofaStatus: "",
      weight: "",
      majorChecks: "",
      rvsm: "no",
      pbn: "no",
      lvo: "no",
      adsb: "no",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    
    toast({
      title: editingId ? "Status Updated" : "Status Added",
      description: `Aircraft status has been ${editingId ? "updated" : "added"} successfully.`,
    });
    
    onCancel();
  };

  // Mock data for dropdowns - from global operations
  const generalAviationOperators = ["Ethiopian Airlines", "Kenya Airways", "RwandAir", "Air Tanzania"];
  const aircraftManufacturers = ["Boeing", "Airbus", "Bombardier", "Embraer"];
  const aircraftTypes = ["Boeing 737-800", "Boeing 777-300ER", "Airbus A350-900", "Bombardier Q400"];
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  return (
    <Card className="p-6 bg-white shadow-md">
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
                      {generalAviationOperators.map((holder) => (
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
              name="aircraftMaker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aircraft Maker operated by AOC holder</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select aircraft manufacturer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {aircraftManufacturers.map((maker) => (
                        <SelectItem key={maker} value={maker}>
                          {maker}
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
              name="registrationMark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Mark</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter registration mark" />
                  </FormControl>
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
              name="yearOfManufacture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year of Manufacture</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year of manufacture" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
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
              name="currentRegistrationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Registration Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
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
              name="cofaStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>C of A Status</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cofaFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload C of A</FormLabel>
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
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter weight" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="majorChecks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Major checks</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter major checks" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="corFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload C of R</FormLabel>
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
              name="noiseCertFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Noise Cert.</FormLabel>
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
              name="modeSFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Mode S</FormLabel>
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
              name="rvsm"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>RVSM</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="rvsm-yes" />
                        <FormLabel htmlFor="rvsm-yes" className="font-normal">Yes</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="rvsm-no" />
                        <FormLabel htmlFor="rvsm-no" className="font-normal">No</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pbn"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>PBN</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="pbn-yes" />
                        <FormLabel htmlFor="pbn-yes" className="font-normal">Yes</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="pbn-no" />
                        <FormLabel htmlFor="pbn-no" className="font-normal">No</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lvo"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>LVO</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="lvo-yes" />
                        <FormLabel htmlFor="lvo-yes" className="font-normal">Yes</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="lvo-no" />
                        <FormLabel htmlFor="lvo-no" className="font-normal">No</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adsb"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>ADS-B</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="adsb-yes" />
                        <FormLabel htmlFor="adsb-yes" className="font-normal">Yes</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="adsb-no" />
                        <FormLabel htmlFor="adsb-no" className="font-normal">No</FormLabel>
                      </div>
                    </RadioGroup>
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

export default ACStatusForm;
