
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface GeneralAviationFormProps {
  onCancel: () => void;
  editingId: string | null;
}

const GeneralAviationForm = ({ onCancel, editingId }: GeneralAviationFormProps) => {
  const [formData, setFormData] = useState({
    operatorName: "",
    registrationMark: "",
    aircraftType: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: editingId ? "General Aviation Updated" : "General Aviation Added",
      description: `${formData.operatorName} has been ${editingId ? "updated" : "added"} successfully.`,
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
        <Label htmlFor="operatorName">Operator Name</Label>
        <Input
          id="operatorName"
          name="operatorName"
          value={formData.operatorName}
          onChange={handleInputChange}
          placeholder="Enter operator name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="registrationMark">Registration Mark</Label>
        <Input
          id="registrationMark"
          name="registrationMark"
          value={formData.registrationMark}
          onChange={handleInputChange}
          placeholder="Enter registration mark"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="aircraftType">Aircraft Type</Label>
        <Input
          id="aircraftType"
          name="aircraftType"
          value={formData.aircraftType}
          onChange={handleInputChange}
          placeholder="Enter aircraft type"
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

export default GeneralAviationForm;
