import { supabase } from "@/integrations/supabase/client";
import { emitRecordChanged } from "@/lib/recordEvents";

/**
 * Generic save helper for any Supabase table.
 * If `id` is provided, performs an UPDATE; otherwise an INSERT.
 * Returns the affected row.
 */
export async function saveRecord<T extends Record<string, any>>(
  table: string,
  id: string | null | undefined,
  data: T,
): Promise<any> {
  // strip undefined / File objects (file uploads not persisted yet)
  const clean: Record<string, any> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined) continue;
    if (typeof File !== "undefined" && v instanceof File) continue;
    if (v === "") clean[k] = null;
    else clean[k] = v;
  }

  if (id) {
    const { data: row, error } = await (supabase as any)
      .from(table)
      .update(clean)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    emitRecordChanged(table);
    return row;
  }
  const { data: row, error } = await (supabase as any)
    .from(table)
    .insert(clean)
    .select()
    .single();
  if (error) throw error;
  emitRecordChanged(table);
  return row;
}

export async function loadRecord(table: string, id: string): Promise<any> {
  const { data, error } = await (supabase as any)
    .from(table)
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}
