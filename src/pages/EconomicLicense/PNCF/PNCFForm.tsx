import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface PNCFFormProps {
  onCancel: () => void;
  editingId?: string | null;
}

const PNCFForm = ({ onCancel, editingId }: PNCFFormProps) => {
  const [formData, setFormData] = useState({
    operatorType: "",
    selectedOperator: "",
    licenseNumber: "",
    certificate: null as File | null,
    dateOfInitialIssue: "",
    dateOfLastRenewal: "",
    dateOfExpiry: "",
    comment: ""
  });

  // Mock data for AOC and General Aviation
  const aocData = [
    { id: "1", name: "Airline A - AOC-001-2023" },
    { id: "2", name: "Airline B - AOC-002-2023" },
    { id: "3", name: "Airline C - AOC-003-2023" },
  ];

  const generalAviationData = [
    { id: "1", name: "Private Aviation - 5N-ABC" },
    { id: "2", name: "Charter Services - 5N-DEF" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(editingId ? "PNCF record updated successfully!" : "PNCF record created successfully!");
    onCancel();
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
        <CardTitle>{editingId ? "Edit PNCF Record" : "Add New PNCF Record"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Operator Type</Label>
            <RadioGroup
              value={formData.operatorType}
              onValueChange={(value) => handleChange("operatorType", value)}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="existing_aoc" id="existing_aoc" />
                <Label htmlFor="existing_aoc">Existing AOC</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="general_aviation" id="general_aviation" />
                <Label htmlFor="general_aviation">General Aviation</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.operatorType && (
            <div>
              <Label htmlFor="selectedOperator">
                {formData.operatorType === "existing_aoc" ? "Select AOC" : "Select General Aviation"}
              </Label>
              <Select value={formData.selectedOperator} onValueChange={(value) => handleChange("selectedOperator", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${formData.operatorType === "existing_aoc" ? "AOC" : "General Aviation"}`} />
                </SelectTrigger>
                <SelectContent>
                  {(formData.operatorType === "existing_aoc" ? aocData : generalAviationData).map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) => handleChange("licenseNumber", e.target.value)}
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
              <Label htmlFor="dateOfInitialIssue">Date of Initial Issue</Label>
              <Input
                id="dateOfInitialIssue"
                type="date"
                value={formData.dateOfInitialIssue}
                onChange={(e) => handleChange("dateOfInitialIssue", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="dateOfLastRenewal">Date of Last Renewal</Label>
              <Input
                id="dateOfLastRenewal"
                type="date"
                value={formData.dateOfLastRenewal}
                onChange={(e) => handleChange("dateOfLastRenewal", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="dateOfExpiry">Date of Expiry</Label>
              <Input
                id="dateOfExpiry"
                type="date"
                value={formData.dateOfExpiry}
                onChange={(e) => handleChange("dateOfExpiry", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => handleChange("comment", e.target.value)}
              placeholder="Additional comments"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {editingId ? "Update" : "Save"} PNCF Record
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PNCFForm;