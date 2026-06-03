import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { onRecordChanged } from "@/lib/recordEvents";

interface StateOfRegistry { id: string; country_name: string; country_code: string | null; registration_prefix: string | null; }

interface StateOfRegistryTableProps { searchQuery: string; onEdit: (id: string) => void; }

const StateOfRegistryTable = ({ searchQuery, onEdit }: StateOfRegistryTableProps) => {
  const [data, setData] = useState<StateOfRegistry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: records } = await supabase.from("state_of_registry").select("*").order("created_at", { ascending: false });
    setData((records as StateOfRegistry[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); const off = onRecordChanged("state_of_registry", fetchData); return off; }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("state_of_registry").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted", description: "State of registry deleted." }); fetchData(); }
  };

  const columns: ColumnDef<StateOfRegistry>[] = [
    { accessorKey: "country_name", header: "Country Name" },
    { accessorKey: "country_code", header: "Country Code" },
    { accessorKey: "registration_prefix", header: "Registration Prefix" },
    { id: "actions", header: "Actions", cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(row.original.id)}>Edit</Button>
        <Button variant="outline" size="sm" onClick={() => handleDelete(row.original.id)} className="text-destructive">Delete</Button>
      </div>
    )},
  ];

  const filteredData = searchQuery ? data.filter(item =>
    (item.country_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.country_code || "").toLowerCase().includes(searchQuery.toLowerCase())
  ) : data;

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return <DataTable columns={columns} data={filteredData} />;
};

export default StateOfRegistryTable;
