import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building } from "lucide-react";

interface DirectorateFormProps {
  onCancel: () => void;
  editingId: string | null;
  onSuccess: () => void;
}

interface DirectorateData {
  name: string;
  code: string;
}

const DirectorateForm = ({ onCancel, editingId, onSuccess }: DirectorateFormProps) => {
  const [directorateData, setDirectorateData] = useState<DirectorateData>({
    name: "",
    code: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingId) {
      fetchDirectorateData();
    }
  }, [editingId]);

  const fetchDirectorateData = async () => {
    try {
      const { data, error } = await supabase
        .from("directorates")
        .select("*")
        .eq("id", editingId)
        .single();

      if (error) throw error;

      setDirectorateData({
        name: data.name || "",
        code: data.code || "",
      });
    } catch (error) {
      console.error("Error fetching directorate:", error);
      toast({
        title: "Error",
        description: "Failed to fetch directorate data",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("directorates")
          .update(directorateData)
          .eq("id", editingId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Directorate updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("directorates")
          .insert([directorateData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Directorate added successfully",
        });
      }

      onSuccess();
      onCancel();
    } catch (error: any) {
      console.error("Error submitting directorate:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save directorate",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDirectorateData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          {editingId ? "Edit Directorate" : "Add New Directorate"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Directorate Name *</Label>
            <Input
              id="name"
              name="name"
              value={directorateData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter directorate name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Code *</Label>
            <Input
              id="code"
              name="code"
              value={directorateData.code}
              onChange={handleInputChange}
              required
              placeholder="Enter directorate code"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : editingId ? "Update" : "Save"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DirectorateForm;