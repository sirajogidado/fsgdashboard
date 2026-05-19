import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type ModuleKey = "approvals" | "expiry";

/**
 * Determines whether the current user can access a restricted module.
 * Access is granted if:
 *  - Role is Super User, OR
 *  - An explicit grant exists in user_module_access, OR
 *  - (approvals only) The user is assigned to or submitted any workflow record.
 */
export function useModuleAccess(moduleKey: ModuleKey) {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const check = async () => {
      if (!user) {
        if (active) {
          setHasAccess(false);
          setLoading(false);
        }
        return;
      }
      if (user.role === "Super User") {
        if (active) {
          setHasAccess(true);
          setLoading(false);
        }
        return;
      }

      // Explicit grant
      const { data: grant } = await supabase
        .from("user_module_access")
        .select("id")
        .eq("user_id", user.id)
        .eq("module_key", moduleKey)
        .maybeSingle();

      if (grant) {
        if (active) {
          setHasAccess(true);
          setLoading(false);
        }
        return;
      }

      // Implicit access for approvals: any workflow involvement
      if (moduleKey === "approvals") {
        const { data: wf } = await supabase
          .from("record_workflow")
          .select("id")
          .or(`assigned_to.eq.${user.id},submitted_by.eq.${user.id}`)
          .limit(1);
        if (active) {
          setHasAccess((wf ?? []).length > 0);
          setLoading(false);
        }
        return;
      }

      if (active) {
        setHasAccess(false);
        setLoading(false);
      }
    };
    check();
    return () => {
      active = false;
    };
  }, [user, moduleKey]);

  return { hasAccess, loading };
}
