
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Directorate, UserRole } from "@/types/auth";

interface RegistrationData {
  fullName: string;
  email: string;
  phoneNumber: string;
  directorate: Directorate;
  role: UserRole;
  password: string;
  confirmPassword: string;
}

interface RegistrationFormProps {
  onBackToLogin: () => void;
}

const RegistrationForm = ({ onBackToLogin }: RegistrationFormProps) => {
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    directorate: "DAWS",
    role: "Technical",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store pending registration (in real app, this would go to backend)
      const pendingRegistrations = JSON.parse(localStorage.getItem("pending_registrations") || "[]");
      const newRegistration = {
        id: Date.now().toString(),
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      
      pendingRegistrations.push(newRegistration);
      localStorage.setItem("pending_registrations", JSON.stringify(pendingRegistrations));

      toast({
        title: "Registration Submitted",
        description: "Your registration has been submitted for admin approval. You will be notified once approved.",
      });

      onBackToLogin();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-ncaa-primary">
          Register for NCAA FSG
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Submit your registration for admin approval
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <Label htmlFor="directorate">Directorate</Label>
          <Select
            value={formData.directorate}
            onValueChange={(value: Directorate) => handleInputChange("directorate", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select directorate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAWS">DAWS</SelectItem>
              <SelectItem value="DAAS">DAAS</SelectItem>
              <SelectItem value="ICT">ICT</SelectItem>
              <SelectItem value="DOLTS">DOLTS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Requested Role</Label>
          <RadioGroup
            value={formData.role}
            onValueChange={(value: UserRole) => handleInputChange("role", value)}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Technical" id="technical" />
              <Label htmlFor="technical">Technical</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Read and View" id="readview" />
              <Label htmlFor="readview">Read and View</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            placeholder="Confirm your password"
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBackToLogin}
            className="flex-1"
          >
            Back to Login
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-ncaa-primary hover:bg-opacity-90"
          >
            {isSubmitting ? "Submitting..." : "Submit Registration"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
