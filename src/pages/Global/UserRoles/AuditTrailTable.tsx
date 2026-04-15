import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AuditTrail { id: string; user_name: string | null; action: string; module: string | null; details: string | null; created_at: string | null; ip_address: string | null; }

interface AuditTrailTableProps { searchQuery: string; }

const AuditTrailTable = ({ searchQuery }: AuditTrailTableProps) => {
  const [data, setData] = useState<AuditTrail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data: records } = await supabase.from("audit_trail").select("*").order("created_at", { ascending: false });
      setData((records as AuditTrail[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const columns: ColumnDef<AuditTrail>[] = [
    { accessorKey: "user_name", header: "User Name" },
    { accessorKey: "action", header: "Action", cell: ({ row }) => {
      const action = row.original.action;
      const cls = action === "CREATE" ? "bg-green-100 text-green-800" : action === "UPDATE" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800";
      return <Badge className={cls}>{action}</Badge>;
    }},
    { accessorKey: "module", header: "Module" },
    { accessorKey: "details", header: "Details" },
    { accessorKey: "created_at", header: "Timestamp", cell: ({ row }) => row.original.created_at ? new Date(row.original.created_at).toLocaleString() : "-" },
  ];

  const filteredData = searchQuery ? data.filter(item =>
    (item.user_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.module || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.details || "").toLowerCase().includes(searchQuery.toLowerCase())
  ) : data;

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return <DataTable columns={columns} data={filteredData} />;
};

export default AuditTrailTable;
