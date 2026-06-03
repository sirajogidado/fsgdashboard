import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { saveRecord, loadRecord } from "@/lib/saveRecord";

interface Props { onCancel: () => void; editingId: string | null; }

const ForeignRegistrationMarkForm = ({ onCancel, editingId }: Props) => {
  const [formData, setFormData] = useState({ registration_mark: "", country: "", description: "" });

  useEffect(() => {
    (async () => {
      if (!editingId) return;
      try {
        const r = await loadRecord("foreign_registration_marks", editingId);
        setFormData({
          registration_mark: r.registration_mark ?? "",
          country: r.country ?? "",
          description: r.description ?? "",
        });
      } catch {}
    })();
  }, [editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveRecord("foreign_registration_marks", editingId, formData);
      toast({ title: editingId ? "Registration Mark Updated" : "Registration Mark Added", description: "Saved successfully." });
      onCancel();
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    }
  };

  const set = (k: keyof typeof formData, v: string) => setFormData((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div className="space-y-2"><Label>Registration Mark</Label>
        <Input value={formData.registration_mark} onChange={(e) => set("registration_mark", e.target.value)} required /></div>
      <div className="space-y-2"><Label>Country</Label>
        <Input value={formData.country} onChange={(e) => set("country", e.target.value)} required /></div>
      <div className="space-y-2"><Label>Description</Label>
        <Input value={formData.description} onChange={(e) => set("description", e.target.value)} /></div>
      <div className="flex gap-2">
        <Button type="submit">{editingId ? "Update" : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

export default ForeignRegistrationMarkForm;
