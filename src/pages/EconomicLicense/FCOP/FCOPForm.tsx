import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface FCOPFormProps {
  onCancel: () => void;
  editingId?: string | null;
}

const FCOPForm = ({ onCancel, editingId }: FCOPFormProps) => {
  const [formData, setFormData] = useState({
    foreignAirline: "",
    licenseNumber: "",
    certificate: null as File | null,
    part18: "",
    part10: "",
    part17: "",
    status: "",
    fcopIssueDate: "",
    comments: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { saveRecord } = await import("@/lib/saveRecord");
      await saveRecord("fcop_licenses", editingId, {
        operator_name: formData.foreignAirline,
        license_number: formData.licenseNumber,
        issue_date: formData.fcopIssueDate || null,
        status: formData.status || "active",
      });
      toast.success(editingId ? "FCOP record updated successfully!" : "FCOP record created successfully!");
      onCancel();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, certificate: file }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingId ? "Edit FCOP Record" : "Add New FCOP Record"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="foreignAirline">Foreign Airline</Label>
              <Input
                id="foreignAirline"
                value={formData.foreignAirline}
                onChange={(e) => handleChange("foreignAirline", e.target.value)}
                placeholder="Enter foreign airline name"
                required
              />
            </div>

            <div>
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) => handleChange("licenseNumber", e.target.value)}
                placeholder="Enter license number"
                required
              />
            </div>

            <div>
              <Label htmlFor="certificate">Upload Certificate</Label>
              <Input
                id="certificate"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
            </div>

            <div>
              <Label htmlFor="fcopIssueDate">FCOP Issue Date</Label>
              <Input
                id="fcopIssueDate"
                type="date"
                value={formData.fcopIssueDate}
                onChange={(e) => handleChange("fcopIssueDate", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Part 18</Label>
              <RadioGroup
                value={formData.part18}
                onValueChange={(value) => handleChange("part18", value)}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="part18_yes" />
                  <Label htmlFor="part18_yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="part18_no" />
                  <Label htmlFor="part18_no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Part 10</Label>
              <RadioGroup
                value={formData.part10}
                onValueChange={(value) => handleChange("part10", value)}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="part10_yes" />
                  <Label htmlFor="part10_yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="part10_no" />
                  <Label htmlFor="part10_no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Part 17</Label>
              <RadioGroup
                value={formData.part17}
                onValueChange={(value) => handleChange("part17", value)}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="part17_yes" />
                  <Label htmlFor="part17_yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="part17_no" />
                  <Label htmlFor="part17_no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => handleChange("comments", e.target.value)}
              placeholder="Additional comments"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {editingId ? "Update" : "Save"} FCOP Record
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FCOPForm;