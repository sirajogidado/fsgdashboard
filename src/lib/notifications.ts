import { supabase } from "@/integrations/supabase/client";

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  category: string;
  link: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

export async function fetchNotifications(userId: string, limit = 50) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as AppNotification[];
}

export async function markRead(id: string) {
  await supabase
    .from("notifications")
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq("id", id);
}

export async function markAllRead(userId: string) {
  await supabase
    .from("notifications")
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("is_read", false);
}

export async function deleteNotification(id: string) {
  await supabase.from("notifications").delete().eq("id", id);
}

export interface NotificationPreferences {
  email_enabled: boolean;
  sms_enabled: boolean;
  email_approvals: boolean;
  email_expiry: boolean;
  email_general: boolean;
  sms_approvals: boolean;
  sms_expiry: boolean;
}

export async function getPreferences(userId: string): Promise<NotificationPreferences | null> {
  const { data } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return (data as NotificationPreferences) ?? null;
}

export async function upsertPreferences(
  userId: string,
  prefs: Partial<NotificationPreferences>,
) {
  const { data: existing } = await supabase
    .from("notification_preferences")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("notification_preferences")
      .update(prefs)
      .eq("user_id", userId);
  } else {
    await supabase
      .from("notification_preferences")
      .insert({ user_id: userId, ...prefs });
  }
}
