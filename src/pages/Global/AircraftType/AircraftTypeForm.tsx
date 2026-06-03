import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { saveRecord, loadRecord } from "@/lib/saveRecord";

interface Props { onCancel: () => void; editingId: string | null; }

const AircraftTypeForm = ({ onCancel, editingId }: Props) => {
  const [formData, setFormData] = useState({ type_name: "", manufacturer: "", category: "", description: "" });

  useEffect(() => {
    (async () => {
      if (!editingId) return;
      try {
        const r = await loadRecord("aircraft_types", editingId);
        setFormData({
          type_name: r.type_name ?? "",
          manufacturer: r.manufacturer ?? "",
          category: r.category ?? "",
          description: r.description ?? "",
        });
      } catch {}
    })();
  }, [editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveRecord("aircraft_types", editingId, formData);
      toast({ title: editingId ? "Aircraft Type Updated" : "Aircraft Type Added", description: "Saved successfully." });
      onCancel();
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    }
  };

  const set = (k: keyof typeof formData, v: string) => setFormData((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-medium">{editingId ? "Edit Aircraft Type" : "Add Aircraft Type"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Type Name</Label>
          <Input value={formData.type_name} onChange={(e) => set("type_name", e.target.value)} required /></div>
        <div className="space-y-2"><Label>Manufacturer</Label>
          <Input value={formData.manufacturer} onChange={(e) => set("manufacturer", e.target.value)} /></div>
        <div className="space-y-2"><Label>Category</Label>
          <Input value={formData.category} onChange={(e) => set("category", e.target.value)} /></div>
        <div className="space-y-2"><Label>Description</Label>
          <Input value={formData.description} onChange={(e) => set("description", e.target.value)} /></div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{editingId ? "Update" : "Save"}</Button>
      </div>
    </form>
  );
};

export default AircraftTypeForm;
