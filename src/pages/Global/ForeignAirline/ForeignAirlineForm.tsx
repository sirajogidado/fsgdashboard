import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { saveRecord, loadRecord } from "@/lib/saveRecord";

interface Props { onCancel: () => void; editingId: string | null; }

const ForeignAirlineForm = ({ onCancel, editingId }: Props) => {
  const [formData, setFormData] = useState({ airline_name: "", country: "", iata_code: "", icao_code: "" });

  useEffect(() => {
    (async () => {
      if (!editingId) return;
      try {
        const r = await loadRecord("foreign_airlines", editingId);
        setFormData({
          airline_name: r.airline_name ?? "",
          country: r.country ?? "",
          iata_code: r.iata_code ?? "",
          icao_code: r.icao_code ?? "",
        });
      } catch {}
    })();
  }, [editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveRecord("foreign_airlines", editingId, formData);
      toast({ title: editingId ? "Foreign Airline Updated" : "Foreign Airline Added", description: "Saved successfully." });
      onCancel();
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    }
  };

  const set = (k: keyof typeof formData, v: string) => setFormData((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div className="space-y-2"><Label>Airline Name</Label>
        <Input value={formData.airline_name} onChange={(e) => set("airline_name", e.target.value)} required /></div>
      <div className="space-y-2"><Label>Country</Label>
        <Input value={formData.country} onChange={(e) => set("country", e.target.value)} /></div>
      <div className="space-y-2"><Label>IATA Code</Label>
        <Input value={formData.iata_code} onChange={(e) => set("iata_code", e.target.value)} /></div>
      <div className="space-y-2"><Label>ICAO Code</Label>
        <Input value={formData.icao_code} onChange={(e) => set("icao_code", e.target.value)} /></div>
      <div className="flex gap-2">
        <Button type="submit">{editingId ? "Update" : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

export default ForeignAirlineForm;
