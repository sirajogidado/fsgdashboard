// Secure auth + user management API.
// Replaces direct client access to the public.users and public.pending_registrations tables.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-session-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function publicUser(u: any) {
  if (!u) return null;
  const { password_hash, ...rest } = u;
  return rest;
}

async function getSessionUser(token: string | null) {
  if (!token) return null;
  const { data } = await supabase
    .from("user_sessions")
    .select("user_id, expires_at, users:users(*)")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  return data?.users ?? null;
}

function requireFields(body: any, fields: string[]) {
  for (const f of fields) {
    if (typeof body?.[f] !== "string" || !body[f].trim()) {
      return f;
    }
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const action = body?.action as string;
    const token = req.headers.get("x-session-token");

    // ---------- Public endpoints ----------
    if (action === "login") {
      const missing = requireFields(body, ["email", "password"]);
      if (missing) return json({ error: `Missing ${missing}` }, 400);

      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("email", body.email)
        .eq("password_hash", body.password)
        .eq("is_active", true)
        .maybeSingle();

      if (!user) return json({ error: "Invalid credentials" }, 401);

      const sessionToken = crypto.randomUUID() + crypto.randomUUID();
      await supabase.from("user_sessions").insert({
        user_id: user.id,
        token: sessionToken,
      });

      return json({ user: publicUser(user), token: sessionToken });
    }

    if (action === "register") {
      const missing = requireFields(body, ["full_name", "email"]);
      if (missing) return json({ error: `Missing ${missing}` }, 400);
      if (body.full_name.length > 200 || body.email.length > 320) {
        return json({ error: "Invalid input length" }, 400);
      }
      const { error } = await supabase.from("pending_registrations").insert({
        full_name: body.full_name,
        email: body.email,
        phone_number: body.phone_number ?? null,
        requested_directorate: body.requested_directorate ?? "DAWS",
        requested_role: body.requested_role ?? "Technical",
        status: "pending",
      });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    // ---------- Authenticated endpoints ----------
    const me = await getSessionUser(token);
    if (!me) return json({ error: "Unauthorized" }, 401);

    if (action === "me") {
      return json({ user: publicUser(me) });
    }

    if (action === "logout") {
      if (token) await supabase.from("user_sessions").delete().eq("token", token);
      return json({ ok: true });
    }

    if (action === "update_profile") {
      const update: Record<string, unknown> = {};
      if (typeof body.phone_number === "string") update.phone_number = body.phone_number;
      if (typeof body.profile_image === "string") update.profile_image = body.profile_image;
      if (me.role === "Super User") {
        if (typeof body.name === "string") update.name = body.name;
        if (typeof body.email === "string") update.email = body.email;
        if (typeof body.directorate === "string") update.directorate = body.directorate;
      }
      const { data, error } = await supabase
        .from("users").update(update).eq("id", me.id).select("*").single();
      if (error) return json({ error: error.message }, 400);
      return json({ user: publicUser(data) });
    }

    // ---------- Super User only ----------
    if (me.role !== "Super User") return json({ error: "Forbidden" }, 403);

    if (action === "list_users") {
      const { data, error } = await supabase
        .from("users").select("*").order("created_at", { ascending: false });
      if (error) return json({ error: error.message }, 400);
      return json({ users: (data ?? []).map(publicUser) });
    }

    if (action === "create_user") {
      const missing = requireFields(body, ["name", "email", "password", "directorate", "role"]);
      if (missing) return json({ error: `Missing ${missing}` }, 400);
      const { error } = await supabase.from("users").insert({
        name: body.name,
        email: body.email,
        phone_number: body.phone_number ?? null,
        directorate: body.directorate,
        role: body.role,
        password_hash: body.password,
        is_active: true,
      });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "update_user") {
      if (!body.id) return json({ error: "Missing id" }, 400);
      const update: Record<string, unknown> = {
        name: body.name,
        email: body.email,
        phone_number: body.phone_number,
        directorate: body.directorate,
        role: body.role,
      };
      if (body.password) update.password_hash = body.password;
      const { error } = await supabase.from("users").update(update).eq("id", body.id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "deactivate_user") {
      if (!body.id) return json({ error: "Missing id" }, 400);
      const { error } = await supabase.from("users").update({ is_active: false }).eq("id", body.id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "list_pending_registrations") {
      const { data, error } = await supabase
        .from("pending_registrations").select("*").order("created_at", { ascending: false });
      if (error) return json({ error: error.message }, 400);
      return json({ registrations: data ?? [] });
    }

    if (action === "approve_registration") {
      if (!body.id) return json({ error: "Missing id" }, 400);
      const { error } = await supabase.rpc("approve_pending_registration", {
        registration_id: body.id,
      });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "reject_registration") {
      if (!body.id) return json({ error: "Missing id" }, 400);
      const { error } = await supabase
        .from("pending_registrations")
        .update({ status: "rejected", rejection_reason: body.reason ?? null })
        .eq("id", body.id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error("auth-api error", e);
    return json({ error: (e as Error).message }, 500);
  }
});
