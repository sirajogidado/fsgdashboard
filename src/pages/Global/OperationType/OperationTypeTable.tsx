import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { onRecordChanged } from "@/lib/recordEvents";

interface OperationType { id: string; operation_type: string; category: string | null; description: string | null; }

interface OperationTypeTableProps { searchQuery: string; onEdit: (id: string) => void; }

const OperationTypeTable = ({ searchQuery, onEdit }: OperationTypeTableProps) => {
  const [data, setData] = useState<OperationType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: records } = await supabase.from("operation_types").select("*").order("created_at", { ascending: false });
    setData((records as OperationType[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); const off = onRecordChanged("operation_types", fetchData); return off; }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("operation_types").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted", description: "Operation type deleted." }); fetchData(); }
  };

  const columns: ColumnDef<OperationType>[] = [
    { accessorKey: "operation_type", header: "Operation Type" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "description", header: "Description" },
    { id: "actions", header: "Actions", cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(row.original.id)}>Edit</Button>
        <Button variant="outline" size="sm" onClick={() => handleDelete(row.original.id)} className="text-destructive">Delete</Button>
      </div>
    )},
  ];

  const filteredData = searchQuery ? data.filter(item =>
    (item.operation_type || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  ) : data;

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return <DataTable columns={columns} data={filteredData} />;
};

export default OperationTypeTable;
