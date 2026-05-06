
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { callAuthApi } from "@/lib/authApi";

interface RegistrationData {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface RegistrationFormProps {
  onBackToLogin: () => void;
}

const RegistrationForm = ({ onBackToLogin }: RegistrationFormProps) => {
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await callAuthApi("register", {
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        requested_directorate: "DAWS",
        requested_role: "Technical",
      });

      toast({
        title: "Registration Submitted",
        description: "Your registration has been submitted for admin approval. You will be notified once approved and your login credentials will be provided.",
      });

      onBackToLogin();
    } catch (error) {
      console.error('Registration error:', error);
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
          <Label htmlFor="fullName">Full Name *</Label>
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
          <Label htmlFor="email">Email Address *</Label>
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

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your login credentials will be provided by the administrator once your registration is approved.
          </p>
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
