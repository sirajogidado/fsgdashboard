import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { saveRecord, loadRecord } from "@/lib/saveRecord";

interface Props { onCancel: () => void; editingId: string | null; }

const ForeignAMOForm = ({ onCancel, editingId }: Props) => {
  const [formData, setFormData] = useState({ organization_name: "", country: "", approval_number: "", status: "active" });

  useEffect(() => {
    (async () => {
      if (!editingId) return;
      try {
        const r = await loadRecord("foreign_amo", editingId);
        setFormData({
          organization_name: r.organization_name ?? "",
          country: r.country ?? "",
          approval_number: r.approval_number ?? "",
          status: r.status ?? "active",
        });
      } catch {}
    })();
  }, [editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveRecord("foreign_amo", editingId, formData);
      toast({ title: editingId ? "Foreign AMO Updated" : "Foreign AMO Added", description: "Saved successfully." });
      onCancel();
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    }
  };

  const set = (k: keyof typeof formData, v: string) => setFormData((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div className="space-y-2"><Label>Organization Name</Label>
        <Input value={formData.organization_name} onChange={(e) => set("organization_name", e.target.value)} required /></div>
      <div className="space-y-2"><Label>Country</Label>
        <Input value={formData.country} onChange={(e) => set("country", e.target.value)} required /></div>
      <div className="space-y-2"><Label>Approval Number</Label>
        <Input value={formData.approval_number} onChange={(e) => set("approval_number", e.target.value)} /></div>
      <div className="flex gap-2">
        <Button type="submit">{editingId ? "Update" : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

export default ForeignAMOForm;
