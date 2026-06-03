import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { supabase } from "@/integrations/supabase/client";
import { onRecordChanged } from "@/lib/recordEvents";
import { toast } from "@/components/ui/use-toast";

interface PAASListProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const PAASList = ({ searchQuery, onEdit }: PAASListProps) => {
  const { canEdit, canDelete } = usePermissions();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: records } = await supabase.from("paas_licenses").select("*").order("created_at", { ascending: false });
    setData(records || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); const off = onRecordChanged("paas_licenses", fetchData); return off; }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("paas_licenses").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted", description: "PAAS license deleted." }); fetchData(); }
  };

  const filteredData = data.filter(item =>
    (item.license_number || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.operator_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      expired: "bg-red-100 text-red-800",
      suspended: "bg-yellow-100 text-yellow-800",
    };
    return <Badge className={statusConfig[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>;
  };

  const columns = [
    { accessorKey: "license_number", header: "License Number" },
    { accessorKey: "operator_name", header: "Operator Name" },
    { accessorKey: "issue_date", header: "Issue Date" },
    { accessorKey: "expiry_date", header: "Expiry Date" },
    { accessorKey: "status", header: "Status", cell: ({ row }: any) => getStatusBadge(row.original.status) },
    {
      id: "actions", header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex space-x-2">
          {canEdit() && <Button variant="outline" size="sm" onClick={() => onEdit(row.original.id)}><Edit className="h-4 w-4" /></Button>}
          {canDelete() && <Button variant="outline" size="sm" onClick={() => handleDelete(row.original.id)}><Trash2 className="h-4 w-4" /></Button>}
        </div>
      ),
    },
  ];

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return <DataTable columns={columns} data={filteredData} />;
};

export default PAASList;
