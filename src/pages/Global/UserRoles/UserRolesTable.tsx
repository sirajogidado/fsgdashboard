import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { onRecordChanged } from "@/lib/recordEvents";

interface UserRole { id: string; role_name: string; description: string | null; permissions: any; }

interface UserRolesTableProps { searchQuery: string; onEdit: (id: string) => void; }

const UserRolesTable = ({ searchQuery, onEdit }: UserRolesTableProps) => {
  const [data, setData] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: records } = await supabase.from("user_roles_config").select("*").order("created_at", { ascending: false });
    setData((records as UserRole[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); const off = onRecordChanged("user_roles_config", fetchData); return off; }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("user_roles_config").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted", description: "User role deleted." }); fetchData(); }
  };

  const columns: ColumnDef<UserRole>[] = [
    { accessorKey: "role_name", header: "Role Name" },
    { accessorKey: "description", header: "Description" },
    { id: "actions", header: "Actions", cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(row.original.id)}>Edit</Button>
        <Button variant="outline" size="sm" onClick={() => handleDelete(row.original.id)} className="text-destructive">Delete</Button>
      </div>
    )},
  ];

  const filteredData = searchQuery ? data.filter(item =>
    (item.role_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  ) : data;

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return <DataTable columns={columns} data={filteredData} />;
};

export default UserRolesTable;
