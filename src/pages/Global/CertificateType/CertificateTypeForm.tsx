
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface CertificateTypeFormProps {
  onCancel: () => void;
  editingId: string | null;
}

const CertificateTypeForm = ({ onCancel, editingId }: CertificateTypeFormProps) => {
  const [formData, setFormData] = useState({
    certificateName: "",
    category: "",
    validity: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: editingId ? "Certificate Type Updated" : "Certificate Type Added",
      description: `${formData.certificateName} has been ${editingId ? "updated" : "added"} successfully.`,
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
        <Label htmlFor="certificateName">Certificate Name</Label>
        <Input
          id="certificateName"
          name="certificateName"
          value={formData.certificateName}
          onChange={handleInputChange}
          placeholder="Enter certificate name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          placeholder="Enter category"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="validity">Validity Period</Label>
        <Input
          id="validity"
          name="validity"
          value={formData.validity}
          onChange={handleInputChange}
          placeholder="Enter validity period"
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

export default CertificateTypeForm;
