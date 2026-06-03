import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { saveRecord, loadRecord } from "@/lib/saveRecord";

interface Props { onCancel: () => void; editingId: string | null; }

const GeneralAviationForm = ({ onCancel, editingId }: Props) => {
  const [formData, setFormData] = useState({ operator_name: "", registration: "", aircraft_type: "", status: "active" });

  useEffect(() => {
    (async () => {
      if (!editingId) return;
      try {
        const r = await loadRecord("general_aviation", editingId);
        setFormData({
          operator_name: r.operator_name ?? "",
          registration: r.registration ?? "",
          aircraft_type: r.aircraft_type ?? "",
          status: r.status ?? "active",
        });
      } catch {}
    })();
  }, [editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveRecord("general_aviation", editingId, formData);
      toast({ title: editingId ? "General Aviation Updated" : "General Aviation Added", description: "Saved successfully." });
      onCancel();
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    }
  };

  const set = (k: keyof typeof formData, v: string) => setFormData((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div className="space-y-2"><Label>Operator Name</Label>
        <Input value={formData.operator_name} onChange={(e) => set("operator_name", e.target.value)} required /></div>
      <div className="space-y-2"><Label>Registration Mark</Label>
        <Input value={formData.registration} onChange={(e) => set("registration", e.target.value)} required /></div>
      <div className="space-y-2"><Label>Aircraft Type</Label>
        <Input value={formData.aircraft_type} onChange={(e) => set("aircraft_type", e.target.value)} /></div>
      <div className="flex gap-2">
        <Button type="submit">{editingId ? "Update" : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

export default GeneralAviationForm;
