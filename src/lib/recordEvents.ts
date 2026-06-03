/**
 * Lightweight cross-component refresh bus.
 * Forms call `emitRecordChanged(table)` after saving.
 * Lists call `onRecordChanged(table, refetch)` to auto-update.
 */
export function emitRecordChanged(table: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("record:changed", { detail: { table } }),
  );
}

export function onRecordChanged(
  table: string | "*",
  cb: () => void,
): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const t = (e as CustomEvent).detail?.table;
    if (table === "*" || t === table) cb();
  };
  window.addEventListener("record:changed", handler);
  return () => window.removeEventListener("record:changed", handler);
}
