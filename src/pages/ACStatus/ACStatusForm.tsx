
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface ACStatusFormProps {
  onCancel: () => void;
  editingId: string | null;
}

const ACStatusForm: React.FC<ACStatusFormProps> = ({ onCancel, editingId }) => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: editingId ? "Status Updated" : "Status Added",
      description: `Aircraft status has been ${editingId ? "updated" : "added"} successfully.`,
    });
    
    onCancel();
  };
  
  return (
    <Card className="p-6 bg-white shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">This form is under development</h3>
          <p>The ACStatusForm component is being built</p>
          
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
        </div>
      </form>
    </Card>
  );
};

export default ACStatusForm;
