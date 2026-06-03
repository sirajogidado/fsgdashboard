import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { saveRecord, loadRecord } from "@/lib/saveRecord";

interface Props { onCancel: () => void; editingId: string | null; }

const TravelAgencyForm = ({ onCancel, editingId }: Props) => {
  const [formData, setFormData] = useState({ agency_name: "", location: "", contact_person: "", description: "" });

  useEffect(() => {
    (async () => {
      if (!editingId) return;
      try {
        const r = await loadRecord("travel_agencies", editingId);
        setFormData({
          agency_name: r.agency_name ?? "",
          location: r.location ?? "",
          contact_person: r.contact_person ?? "",
          description: r.description ?? "",
        });
      } catch {}
    })();
  }, [editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveRecord("travel_agencies", editingId, formData);
      toast({ title: editingId ? "Travel Agency Updated" : "Travel Agency Added", description: "Saved successfully." });
      onCancel();
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    }
  };

  const set = (k: keyof typeof formData, v: string) => setFormData((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div className="space-y-2"><Label>Agency Name</Label>
        <Input value={formData.agency_name} onChange={(e) => set("agency_name", e.target.value)} required /></div>
      <div className="space-y-2"><Label>Location</Label>
        <Input value={formData.location} onChange={(e) => set("location", e.target.value)} /></div>
      <div className="space-y-2"><Label>Contact Person</Label>
        <Input value={formData.contact_person} onChange={(e) => set("contact_person", e.target.value)} /></div>
      <div className="space-y-2"><Label>Description</Label>
        <Input value={formData.description} onChange={(e) => set("description", e.target.value)} /></div>
      <div className="flex gap-2">
        <Button type="submit">{editingId ? "Update" : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

export default TravelAgencyForm;
