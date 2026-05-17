import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import {
  getPreferences,
  upsertPreferences,
  NotificationPreferences,
} from "@/lib/notifications";
import { Loader2, Bell, Mail, MessageSquare } from "lucide-react";

const DEFAULTS: NotificationPreferences = {
  email_enabled: true,
  sms_enabled: false,
  email_approvals: true,
  email_expiry: true,
  email_general: true,
  sms_approvals: false,
  sms_expiry: false,
};

const NotificationPreferencesPage = () => {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const p = await getPreferences(user.id);
      if (p) setPrefs({ ...DEFAULTS, ...p });
      setLoading(false);
    };
    load();
  }, [user]);

  const update = (k: keyof NotificationPreferences, v: boolean) =>
    setPrefs((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await upsertPreferences(user.id, prefs);
      toast({ title: "Preferences saved" });
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6" /> Notification Preferences
        </h1>
        <p className="text-muted-foreground">Choose how the platform contacts you</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4" /> Email
          </CardTitle>
          <CardDescription>
            Email delivery activates once your organisation's sender domain is verified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Row label="Email notifications" checked={prefs.email_enabled} onChange={(v) => update("email_enabled", v)} />
          <Separator />
          <Row label="Approval requests & status changes" checked={prefs.email_approvals} onChange={(v) => update("email_approvals", v)} disabled={!prefs.email_enabled} />
          <Row label="Certificate expiry warnings" checked={prefs.email_expiry} onChange={(v) => update("email_expiry", v)} disabled={!prefs.email_enabled} />
          <Row label="General announcements" checked={prefs.email_general} onChange={(v) => update("email_general", v)} disabled={!prefs.email_enabled} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> SMS
          </CardTitle>
          <CardDescription>
            SMS is sent via Twilio. Connect a Twilio account in settings to activate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Row label="SMS notifications" checked={prefs.sms_enabled} onChange={(v) => update("sms_enabled", v)} />
          <Separator />
          <Row label="Approval requests" checked={prefs.sms_approvals} onChange={(v) => update("sms_approvals", v)} disabled={!prefs.sms_enabled} />
          <Row label="Certificate expiry warnings" checked={prefs.sms_expiry} onChange={(v) => update("sms_expiry", v)} disabled={!prefs.sms_enabled} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
          Save preferences
        </Button>
      </div>
    </div>
  );
};

const Row: React.FC<{
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}> = ({ label, checked, onChange, disabled }) => (
  <div className="flex items-center justify-between">
    <Label className={disabled ? "text-muted-foreground" : ""}>{label}</Label>
    <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
  </div>
);

export default NotificationPreferencesPage;
