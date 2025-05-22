
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  holderCriteria: z.string().min(1, "Holder criteria is required"),
  approvalNumber: z.string().min(1, "AMO approval number is required"),
  approvalFile: z.any(),
  maintenanceLocation: z.string().min(1, "Maintenance location is required"),
  expireDate: z.string().min(1, "Expire date is required"),
  pmApprovalFile: z.any(),
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
      holderCriteria: "existing_aoc",
      approvalNumber: "",
      maintenanceLocation: "",
      expireDate: "",
      extension: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    
    toast({
      title: editingId ? "AMO Updated" : "AMO Added",
      description: `Local AMO has been ${editingId ? "updated" : "added"} successfully.`,
    });
    
    onCancel();
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
                        <RadioGroupItem value="existing_aoc" id="existing_aoc" />
                        <FormLabel htmlFor="existing_aoc" className="font-normal">
                          Existing AOC
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="non_aoc" id="non_aoc" />
                        <FormLabel htmlFor="non_aoc" className="font-normal">
                          Non AOC holder
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="approvalNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AMO approval No.</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter AMO approval number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="approvalFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload AMO Approval</FormLabel>
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
                  <FormLabel>Maintenance Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter maintenance location" />
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

            <FormField
              control={form.control}
              name="pmApprovalFile"
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
