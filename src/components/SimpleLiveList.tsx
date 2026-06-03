import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { onRecordChanged } from "@/lib/recordEvents";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Loader2, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { emitRecordChanged } from "@/lib/recordEvents";

interface Column {
  key: string;
  label: string;
  format?: (v: any) => React.ReactNode;
}

interface SimpleLiveListProps {
  table: string;
  columns: Column[];
  onEdit?: (id: string) => void;
  emptyText?: string;
}

const SimpleLiveList = ({ table, columns, onEdit, emptyText = "No records yet." }: SimpleLiveListProps) => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from(table).select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const off = onRecordChanged(table, fetchData);
    return off;
  }, [table]);

  const handleDelete = async (id: string) => {
    const { error } = await (supabase as any).from(table).delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Record removed." });
      emitRecordChanged(table);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }
  if (!rows.length) {
    return <div className="text-center py-8 text-muted-foreground text-sm">{emptyText}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((c) => <TableHead key={c.key}>{c.label}</TableHead>)}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            {columns.map((c) => (
              <TableCell key={c.key}>
                {c.format ? c.format(row[c.key]) : (row[c.key] ?? "—")}
              </TableCell>
            ))}
            <TableCell className="text-right space-x-1">
              {onEdit && (
                <Button size="icon" variant="ghost" onClick={() => onEdit(row.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              <Button size="icon" variant="ghost" onClick={() => handleDelete(row.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const dateCol = (v: any) => v ? new Date(v).toLocaleDateString() : "—";
export const statusBadge = (v: any) => (
  <Badge variant="outline" className="capitalize">{v ?? "active"}</Badge>
);

export default SimpleLiveList;
