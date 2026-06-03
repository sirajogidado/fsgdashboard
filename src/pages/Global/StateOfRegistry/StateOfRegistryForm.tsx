import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { saveRecord, loadRecord } from "@/lib/saveRecord";

interface Props { onCancel: () => void; editingId: string | null; }

const StateOfRegistryForm = ({ onCancel, editingId }: Props) => {
  const [formData, setFormData] = useState({ country_name: "", country_code: "", registration_prefix: "" });

  useEffect(() => {
    (async () => {
      if (!editingId) return;
      try {
        const r = await loadRecord("state_of_registry", editingId);
        setFormData({
          country_name: r.country_name ?? "",
          country_code: r.country_code ?? "",
          registration_prefix: r.registration_prefix ?? "",
        });
      } catch {}
    })();
  }, [editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveRecord("state_of_registry", editingId, formData);
      toast({ title: editingId ? "State of Registry Updated" : "State of Registry Added", description: "Saved successfully." });
      onCancel();
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    }
  };

  const set = (k: keyof typeof formData, v: string) => setFormData((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div className="space-y-2"><Label>Country Name</Label>
        <Input value={formData.country_name} onChange={(e) => set("country_name", e.target.value)} required /></div>
      <div className="space-y-2"><Label>Country Code</Label>
        <Input value={formData.country_code} onChange={(e) => set("country_code", e.target.value)} /></div>
      <div className="space-y-2"><Label>Registration Prefix</Label>
        <Input value={formData.registration_prefix} onChange={(e) => set("registration_prefix", e.target.value)} /></div>
      <div className="flex gap-2">
        <Button type="submit">{editingId ? "Update" : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

export default StateOfRegistryForm;
