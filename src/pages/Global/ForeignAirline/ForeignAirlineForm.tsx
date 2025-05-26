
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface ForeignAirlineFormProps {
  onCancel: () => void;
  editingId: string | null;
}

const ForeignAirlineForm = ({ onCancel, editingId }: ForeignAirlineFormProps) => {
  const [formData, setFormData] = useState({
    airlineName: "",
    country: "",
    iataCode: "",
    icaoCode: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: editingId ? "Foreign Airline Updated" : "Foreign Airline Added",
      description: `${formData.airlineName} has been ${editingId ? "updated" : "added"} successfully.`,
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
        <Label htmlFor="airlineName">Airline Name</Label>
        <Input
          id="airlineName"
          name="airlineName"
          value={formData.airlineName}
          onChange={handleInputChange}
          placeholder="Enter airline name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          placeholder="Enter country"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="iataCode">IATA Code</Label>
        <Input
          id="iataCode"
          name="iataCode"
          value={formData.iataCode}
          onChange={handleInputChange}
          placeholder="Enter IATA code (e.g., BA)"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icaoCode">ICAO Code</Label>
        <Input
          id="icaoCode"
          name="icaoCode"
          value={formData.icaoCode}
          onChange={handleInputChange}
          placeholder="Enter ICAO code (e.g., BAW)"
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

export default ForeignAirlineForm;
