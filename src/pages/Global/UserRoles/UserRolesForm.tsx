
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface UserRolesFormProps {
  onCancel: () => void;
  editingId: string | null;
}

const UserRolesForm = ({ onCancel, editingId }: UserRolesFormProps) => {
  const [formData, setFormData] = useState({
    roleName: "",
    description: "",
    permissions: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: editingId ? "User Role Updated" : "User Role Added",
      description: `${formData.roleName} has been ${editingId ? "updated" : "added"} successfully.`,
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
        <Label htmlFor="roleName">Role Name</Label>
        <Input
          id="roleName"
          name="roleName"
          value={formData.roleName}
          onChange={handleInputChange}
          placeholder="Enter role name"
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
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="permissions">Permissions</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, permissions: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select permissions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="read">Read Only</SelectItem>
            <SelectItem value="write">Read & Write</SelectItem>
            <SelectItem value="admin">Administrator</SelectItem>
          </SelectContent>
        </Select>
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

export default UserRolesForm;
