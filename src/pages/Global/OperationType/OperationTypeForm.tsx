import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { saveRecord, loadRecord } from "@/lib/saveRecord";

interface Props { onCancel: () => void; editingId: string | null; }

const OperationTypeForm = ({ onCancel, editingId }: Props) => {
  const [formData, setFormData] = useState({ operation_type: "", category: "", description: "" });

  useEffect(() => {
    (async () => {
      if (!editingId) return;
      try {
        const r = await loadRecord("operation_types", editingId);
        setFormData({
          operation_type: r.operation_type ?? "",
          category: r.category ?? "",
          description: r.description ?? "",
        });
      } catch {}
    })();
  }, [editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveRecord("operation_types", editingId, formData);
      toast({ title: editingId ? "Operation Type Updated" : "Operation Type Added", description: "Saved successfully." });
      onCancel();
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    }
  };

  const set = (k: keyof typeof formData, v: string) => setFormData((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div className="space-y-2"><Label>Operation Type</Label>
        <Input value={formData.operation_type} onChange={(e) => set("operation_type", e.target.value)} required /></div>
      <div className="space-y-2"><Label>Category</Label>
        <Input value={formData.category} onChange={(e) => set("category", e.target.value)} /></div>
      <div className="space-y-2"><Label>Description</Label>
        <Input value={formData.description} onChange={(e) => set("description", e.target.value)} /></div>
      <div className="flex gap-2">
        <Button type="submit">{editingId ? "Update" : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

export default OperationTypeForm;
