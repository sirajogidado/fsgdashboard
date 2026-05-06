// Thin wrapper around the auth-api edge function.
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "ncaa_session_token";

export const getSessionToken = () => localStorage.getItem(SESSION_KEY);
export const setSessionToken = (t: string) => localStorage.setItem(SESSION_KEY, t);
export const clearSessionToken = () => localStorage.removeItem(SESSION_KEY);

export async function callAuthApi<T = any>(
  action: string,
  payload: Record<string, unknown> = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getSessionToken();
  if (token) headers["x-session-token"] = token;

  const { data, error } = await supabase.functions.invoke("auth-api", {
    body: { action, ...payload },
    headers,
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data as T;
}
