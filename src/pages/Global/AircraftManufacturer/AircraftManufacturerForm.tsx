import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { saveRecord, loadRecord } from "@/lib/saveRecord";

interface Props { onCancel: () => void; editingId: string | null; }

const AircraftManufacturerForm = ({ onCancel, editingId }: Props) => {
  const [formData, setFormData] = useState({ manufacturer_name: "", country: "", description: "" });

  useEffect(() => {
    (async () => {
      if (!editingId) return;
      try {
        const r = await loadRecord("aircraft_manufacturers", editingId);
        setFormData({
          manufacturer_name: r.manufacturer_name ?? "",
          country: r.country ?? "",
          description: r.description ?? "",
        });
      } catch {}
    })();
  }, [editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveRecord("aircraft_manufacturers", editingId, formData);
      toast({ title: editingId ? "Manufacturer Updated" : "Manufacturer Added", description: "Saved successfully." });
      onCancel();
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    }
  };

  const set = (k: keyof typeof formData, v: string) => setFormData((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-medium">{editingId ? "Edit Aircraft Manufacturer" : "Add Aircraft Manufacturer"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Manufacturer Name</Label>
          <Input value={formData.manufacturer_name} onChange={(e) => set("manufacturer_name", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Country</Label>
          <Input value={formData.country} onChange={(e) => set("country", e.target.value)} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea rows={3} value={formData.description} onChange={(e) => set("description", e.target.value)} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{editingId ? "Update" : "Save"}</Button>
      </div>
    </form>
  );
};

export default AircraftManufacturerForm;
