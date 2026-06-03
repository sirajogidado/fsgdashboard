import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { saveRecord, loadRecord } from "@/lib/saveRecord";

interface Props { onCancel: () => void; editingId: string | null; }

const CertificateTypeForm = ({ onCancel, editingId }: Props) => {
  const [formData, setFormData] = useState({ certificate_name: "", category: "", validity: "", description: "" });

  useEffect(() => {
    (async () => {
      if (!editingId) return;
      try {
        const r = await loadRecord("certificate_types", editingId);
        setFormData({
          certificate_name: r.certificate_name ?? "",
          category: r.category ?? "",
          validity: r.validity ?? "",
          description: r.description ?? "",
        });
      } catch {}
    })();
  }, [editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveRecord("certificate_types", editingId, formData);
      toast({ title: editingId ? "Certificate Type Updated" : "Certificate Type Added", description: "Saved successfully." });
      onCancel();
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    }
  };

  const set = (k: keyof typeof formData, v: string) => setFormData((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div className="space-y-2"><Label>Certificate Name</Label>
        <Input value={formData.certificate_name} onChange={(e) => set("certificate_name", e.target.value)} required /></div>
      <div className="space-y-2"><Label>Category</Label>
        <Input value={formData.category} onChange={(e) => set("category", e.target.value)} /></div>
      <div className="space-y-2"><Label>Validity Period</Label>
        <Input value={formData.validity} onChange={(e) => set("validity", e.target.value)} /></div>
      <div className="space-y-2"><Label>Description</Label>
        <Input value={formData.description} onChange={(e) => set("description", e.target.value)} /></div>
      <div className="flex gap-2">
        <Button type="submit">{editingId ? "Update" : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

export default CertificateTypeForm;
