
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface StateOfRegistryFormProps {
  onCancel: () => void;
  editingId: string | null;
}

const StateOfRegistryForm = ({ onCancel, editingId }: StateOfRegistryFormProps) => {
  const [formData, setFormData] = useState({
    countryName: "",
    countryCode: "",
    registrationPrefix: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: editingId ? "State of Registry Updated" : "State of Registry Added",
      description: `${formData.countryName} has been ${editingId ? "updated" : "added"} successfully.`,
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
        <Label htmlFor="countryName">Country Name</Label>
        <Input
          id="countryName"
          name="countryName"
          value={formData.countryName}
          onChange={handleInputChange}
          placeholder="Enter country name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="countryCode">Country Code</Label>
        <Input
          id="countryCode"
          name="countryCode"
          value={formData.countryCode}
          onChange={handleInputChange}
          placeholder="Enter country code (e.g., NG)"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="registrationPrefix">Registration Prefix</Label>
        <Input
          id="registrationPrefix"
          name="registrationPrefix"
          value={formData.registrationPrefix}
          onChange={handleInputChange}
          placeholder="Enter registration prefix (e.g., 5N)"
          required
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

export default StateOfRegistryForm;
