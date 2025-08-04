import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface PAASFormProps {
  onCancel: () => void;
  editingId?: string | null;
}

const PAASForm = ({ onCancel, editingId }: PAASFormProps) => {
  const [formData, setFormData] = useState({
    permitNumber: "",
    applicantName: "",
    serviceType: "",
    validityPeriod: "",
    status: "Active",
    issueDate: "",
    expiryDate: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast.success(editingId ? "PAAS record updated successfully!" : "PAAS record created successfully!");
    onCancel();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingId ? "Edit PAAS Record" : "Add New PAAS Record"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="permitNumber">Permit Number</Label>
              <Input
                id="permitNumber"
                value={formData.permitNumber}
                onChange={(e) => handleChange("permitNumber", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="applicantName">Applicant Name</Label>
              <Input
                id="applicantName"
                value={formData.applicantName}
                onChange={(e) => handleChange("applicantName", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="serviceType">Service Type</Label>
              <Select value={formData.serviceType} onValueChange={(value) => handleChange("serviceType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aerial_photography">Aerial Photography</SelectItem>
                  <SelectItem value="aerial_survey">Aerial Survey</SelectItem>
                  <SelectItem value="crop_spraying">Crop Spraying</SelectItem>
                  <SelectItem value="charter_service">Charter Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="validityPeriod">Validity Period</Label>
              <Input
                id="validityPeriod"
                value={formData.validityPeriod}
                onChange={(e) => handleChange("validityPeriod", e.target.value)}
                placeholder="e.g., 12 months"
                required
              />
            </div>

            <div>
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => handleChange("issueDate", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Revoked">Revoked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Additional details about the permit"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {editingId ? "Update" : "Create"} PAAS Record
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PAASForm;