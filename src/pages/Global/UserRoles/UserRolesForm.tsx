import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { saveRecord, loadRecord } from "@/lib/saveRecord";

interface Props { onCancel: () => void; editingId: string | null; }

const UserRolesForm = ({ onCancel, editingId }: Props) => {
  const [formData, setFormData] = useState({ role_name: "", description: "", permissions: "read" });

  useEffect(() => {
    (async () => {
      if (!editingId) return;
      try {
        const r = await loadRecord("user_roles_config", editingId);
        const perms = Array.isArray(r.permissions) ? (r.permissions[0] ?? "read") : "read";
        setFormData({
          role_name: r.role_name ?? "",
          description: r.description ?? "",
          permissions: perms,
        });
      } catch {}
    })();
  }, [editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveRecord("user_roles_config", editingId, {
        role_name: formData.role_name,
        description: formData.description,
        permissions: [formData.permissions],
      });
      toast({ title: editingId ? "Role Updated" : "Role Added", description: "Saved successfully." });
      onCancel();
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    }
  };

  const set = (k: keyof typeof formData, v: string) => setFormData((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div className="space-y-2"><Label>Role Name</Label>
        <Input value={formData.role_name} onChange={(e) => set("role_name", e.target.value)} required /></div>
      <div className="space-y-2"><Label>Description</Label>
        <Input value={formData.description} onChange={(e) => set("description", e.target.value)} /></div>
      <div className="space-y-2"><Label>Permissions</Label>
        <Select value={formData.permissions} onValueChange={(v) => set("permissions", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="read">Read Only</SelectItem>
            <SelectItem value="write">Read & Write</SelectItem>
            <SelectItem value="admin">Administrator</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button type="submit">{editingId ? "Update" : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

export default UserRolesForm;
