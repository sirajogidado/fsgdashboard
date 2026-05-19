import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string | null;
  userName?: string;
}

const MODULES = [
  { key: "approvals", label: "My Approvals", description: "Access the approvals workflow inbox." },
  { key: "expiry", label: "Expiry & Compliance", description: "Access the expiry tracking dashboard." },
];

const ModuleAccessDialog: React.FC<Props> = ({ open, onOpenChange, userId, userName }) => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [granted, setGranted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open || !userId) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("user_module_access")
        .select("module_key")
        .eq("user_id", userId);
      const map: Record<string, boolean> = {};
      (data ?? []).forEach((r: any) => (map[r.module_key] = true));
      setGranted(map);
      setLoading(false);
    };
    load();
  }, [open, userId]);

  const toggle = (key: string) =>
    setGranted((p) => ({ ...p, [key]: !p[key] }));

  const save = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      // Determine deltas vs DB
      const { data: existing } = await supabase
        .from("user_module_access")
        .select("module_key")
        .eq("user_id", userId);
      const existingSet = new Set((existing ?? []).map((r: any) => r.module_key));

      const toAdd = MODULES.filter((m) => granted[m.key] && !existingSet.has(m.key));
      const toRemove = MODULES.filter((m) => !granted[m.key] && existingSet.has(m.key));

      if (toAdd.length) {
        await supabase.from("user_module_access").insert(
          toAdd.map((m) => ({
            user_id: userId,
            module_key: m.key,
            granted_by: currentUser?.id ?? null,
          })),
        );
      }
      for (const m of toRemove) {
        await supabase
          .from("user_module_access")
          .delete()
          .eq("user_id", userId)
          .eq("module_key", m.key);
      }
      toast({ title: "Access updated", description: `Updated module access for ${userName ?? "user"}.` });
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message ?? "Failed to update access.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Manage Module Access</DialogTitle>
          <DialogDescription>
            Grant {userName ?? "this user"} access to restricted workflow modules.
            Super Users always have full access.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {MODULES.map((m) => (
              <div key={m.key} className="flex items-start justify-between gap-3 border rounded-md p-3">
                <div>
                  <Label className="font-medium">{m.label}</Label>
                  <p className="text-xs text-muted-foreground">{m.description}</p>
                </div>
                <Switch
                  checked={!!granted[m.key]}
                  onCheckedChange={() => toggle(m.key)}
                />
              </div>
            ))}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving || loading}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleAccessDialog;
