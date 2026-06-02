
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  amoHolder: z.string().min(1, "AMO holder is required"),
  country: z.string().min(1, "Country is required"),
  moeRef: z.string().min(1, "MOE ref is required"),
  approvals: z.string().min(1, "Approvals is required"),
  ratings: z.string().min(1, "Ratings/capabilities is required"),
  amoNumber: z.string().min(1, "AMO Number is required"),
  amoFile: z.any(),
  expireDate: z.string().min(1, "Expire Date is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface ForeignAMOFormProps {
  onCancel: () => void;
  editingId: string | null;
}

const ForeignAMOForm: React.FC<ForeignAMOFormProps> = ({ onCancel, editingId }) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amoHolder: "",
      country: "",
      moeRef: "",
      approvals: "",
      ratings: "",
      amoNumber: "",
      expireDate: "",
    },
  });

  useEffect(() => {
    (async () => {
      if (!editingId) return;
      try {
        const r = await loadRecord("foreign_amo", editingId);
        form.reset({
          amoHolder: r.organization_name ?? "",
          country: r.country ?? "",
          moeRef: "",
          approvals: "",
          ratings: "",
          amoNumber: r.approval_number ?? "",
          expireDate: "",
        });
      } catch {}
    })();
  }, [editingId, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      await saveRecord("foreign_amo", editingId, {
        organization_name: data.amoHolder,
        country: data.country,
        approval_number: data.amoNumber,
        status: "active",
      });
      toast({ title: editingId ? "AMO Updated" : "AMO Added", description: "Saved successfully." });
      onCancel();
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    }
  };

  // Mock data for dropdowns - from Foreign AMO under global operations
  const foreignAmoHolders = ["Lufthansa Technik", "Air France Industries", "Turkish Technic", "Emirates Engineering"];
  const countries = [
    "Germany", "France", "Turkey", "United Arab Emirates", "United States", 
    "United Kingdom", "Netherlands", "Switzerland", "Belgium", "Italy", 
    "Spain", "Canada", "Japan", "Singapore", "South Korea", "Australia"
  ];

  return (
    <Card className="p-6 bg-white shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="amoHolder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AMO Holder</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select AMO holder" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {foreignAmoHolders.map((holder) => (
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
              name="moeRef"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MOE Ref</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter MOE reference" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="approvals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Approvals</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter approvals" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ratings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ratings/capabilities</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter ratings/capabilities" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amoNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AMO Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter AMO number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amoFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload AMO</FormLabel>
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
              name="expireDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expire Date</FormLabel>
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

export default ForeignAMOForm;
