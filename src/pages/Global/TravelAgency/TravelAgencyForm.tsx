
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface TravelAgencyFormProps {
  onCancel: () => void;
  editingId: string | null;
}

const TravelAgencyForm = ({ onCancel, editingId }: TravelAgencyFormProps) => {
  const [formData, setFormData] = useState({
    agencyName: "",
    location: "",
    contactPerson: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: editingId ? "Travel Agency Updated" : "Travel Agency Added",
      description: `${formData.agencyName} has been ${editingId ? "updated" : "added"} successfully.`,
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
        <Label htmlFor="agencyName">Agency Name</Label>
        <Input
          id="agencyName"
          name="agencyName"
          value={formData.agencyName}
          onChange={handleInputChange}
          placeholder="Enter agency name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Enter location"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactPerson">Contact Person</Label>
        <Input
          id="contactPerson"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleInputChange}
          placeholder="Enter contact person"
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

export default TravelAgencyForm;
