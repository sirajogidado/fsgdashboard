
import React, { useEffect } from "react";
import { saveRecord, loadRecord } from "@/lib/saveRecord";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  holderCriteria: z.string().min(1, "Holder criteria is required"),
  amoHolder: z.string().optional(),
  amoApprovalNumber: z.string().min(1, "AMO approval number is required"),
  amoApprovalUpload: z.any(),
  maintenanceLocation: z.string().min(1, "Maintenance location is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  amoApprovalFile: z.any(),
  extension: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface LocalAMOFormProps {
  onCancel: () => void;
  editingId: string | null;
}

const LocalAMOForm: React.FC<LocalAMOFormProps> = ({ onCancel, editingId }) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      holderCriteria: "non_aoc_holder",
      amoHolder: "",
      amoApprovalNumber: "",
      maintenanceLocation: "",
      expiryDate: "",
      extension: "",
    },
  });

  useEffect(() => {
    (async () => {
      if (!editingId) return;
      try {
        const r = await loadRecord("amo_licenses", editingId);
        form.reset({
          holderCriteria: r.holder_criteria ?? "non_aoc_holder",
          amoHolder: "",
          amoApprovalNumber: r.approval_number ?? "",
          maintenanceLocation: r.maintenance_location ?? "",
          expiryDate: r.expiry_date ?? "",
          extension: "",
        });
      } catch {}
    })();
  }, [editingId, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      await saveRecord("amo_licenses", editingId, {
        holder_criteria: data.holderCriteria,
        approval_number: data.amoApprovalNumber,
        maintenance_location: data.maintenanceLocation,
        expiry_date: data.expiryDate,
        status: "active",
      });
      toast({ title: editingId ? "AMO Updated" : "AMO Added", description: "Saved successfully." });
      onCancel();
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Card className="p-6 bg-white shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="holderCriteria"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Holder Criteria</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="non_aoc_holder" id="non_aoc_holder" />
                        <FormLabel htmlFor="non_aoc_holder" className="font-normal">
                          Non- AOC Holder
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="existing_aoc" id="existing_aoc" />
                        <FormLabel htmlFor="existing_aoc" className="font-normal">
                          Existing AOC
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("holderCriteria") === "existing_aoc" && (
              <FormField
                control={form.control}
                name="amoHolder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AMO Holder</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select general aviation operator" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Ethiopian Airlines", "Kenya Airways", "RwandAir", "Air Tanzania"].map((operator) => (
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
              name="amoApprovalNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AMO Approval Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter AMO approval number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amoApprovalUpload"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AMO Approval Upload</FormLabel>
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
              name="maintenanceLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maintenance Locations</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter maintenance locations" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amoApprovalFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload AMO PM APRVL PG & LEP</FormLabel>
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
              name="extension"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extension</FormLabel>
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

export default LocalAMOForm;
