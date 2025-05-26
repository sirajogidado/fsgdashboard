
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface ForeignAMOFormProps {
  onCancel: () => void;
  editingId: string | null;
}

const ForeignAMOForm = ({ onCancel, editingId }: ForeignAMOFormProps) => {
  const [formData, setFormData] = useState({
    amoName: "",
    country: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: editingId ? "Foreign AMO Updated" : "Foreign AMO Added",
      description: `${formData.amoName} has been ${editingId ? "updated" : "added"} successfully.`,
    });
    onCancel();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="amoName">AMO Name</Label>
        <Input
          id="amoName"
          name="amoName"
          value={formData.amoName}
          onChange={handleInputChange}
          placeholder="Enter AMO name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          placeholder="Enter country"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter description"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit">
          {editingId ? "Update" : "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ForeignAMOForm;
