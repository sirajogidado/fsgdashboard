import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  aerodrome_name: z.string().min(1, "Aerodrome name is required"),
  icao_code: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  certificate_number: z.string().min(1, "Certificate number is required"),
  certificate_type: z.string().min(1, "Certificate type is required"),
  issue_date: z.date({ required_error: "Issue date is required" }),
  expiry_date: z.date({ required_error: "Expiry date is required" }),
  status: z.string().min(1, "Status is required"),
  operator_name: z.string().min(1, "Operator name is required"),
  runway_count: z.coerce.number().min(1).optional(),
  runway_length: z.string().optional(),
  category: z.string().optional(),
  last_inspection_date: z.date().optional().nullable(),
  next_inspection_date: z.date().optional().nullable(),
  comments: z.string().optional(),
});

export type AerodromeCertificationFormValues = z.infer<typeof formSchema>;

interface AerodromeCertificationFormProps {
  onSubmit: (data: AerodromeCertificationFormValues) => void;
  initialData?: Partial<AerodromeCertificationFormValues>;
  isLoading?: boolean;
}

const AerodromeCertificationForm: React.FC<AerodromeCertificationFormProps> = ({
  onSubmit,
  initialData,
  isLoading,
}) => {
  const form = useForm<AerodromeCertificationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      aerodrome_name: initialData?.aerodrome_name || "",
      icao_code: initialData?.icao_code || "",
      location: initialData?.location || "",
      certificate_number: initialData?.certificate_number || "",
      certificate_type: initialData?.certificate_type || "",
      issue_date: initialData?.issue_date,
      expiry_date: initialData?.expiry_date,
      status: initialData?.status || "active",
      operator_name: initialData?.operator_name || "",
      runway_count: initialData?.runway_count || 1,
      runway_length: initialData?.runway_length || "",
      category: initialData?.category || "",
      last_inspection_date: initialData?.last_inspection_date,
      next_inspection_date: initialData?.next_inspection_date,
      comments: initialData?.comments || "",
    },
  });

  const certificateTypes = [
    "Aerodrome License",
    "International Airport Certificate",
    "Domestic Airport Certificate",
    "Heliport Certificate",
    "Private Aerodrome Permit",
  ];

  const categories = [
    "Category I",
    "Category II",
    "Category III",
    "Category IIIA",
    "Category IIIB",
    "Category IIIC",
  ];

  const statuses = ["active", "suspended", "expired", "pending"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="aerodrome_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aerodrome Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter aerodrome name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icao_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ICAO Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., DNAA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="operator_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operator Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter operator name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certificate_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate Number *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter certificate number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certificate_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select certificate type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {certificateTypes.map((type) => (
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
            name="issue_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Issue Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiry_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expiry Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
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
            name="runway_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Runways</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="runway_length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Runway Length</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 3600m" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_inspection_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Last Inspection Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="next_inspection_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Next Inspection Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comments</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional comments"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AerodromeCertificationForm;
