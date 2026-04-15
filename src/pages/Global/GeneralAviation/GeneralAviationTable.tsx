import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GeneralAviation { id: string; operator_name: string | null; registration: string | null; aircraft_type: string | null; status: string | null; }

interface GeneralAviationTableProps { searchQuery: string; onEdit: (id: string) => void; }

const GeneralAviationTable = ({ searchQuery, onEdit }: GeneralAviationTableProps) => {
  const [data, setData] = useState<GeneralAviation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: records } = await supabase.from("general_aviation").select("*").order("created_at", { ascending: false });
    setData((records as GeneralAviation[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("general_aviation").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted", description: "General aviation record deleted." }); fetchData(); }
  };

  const columns: ColumnDef<GeneralAviation>[] = [
    { accessorKey: "operator_name", header: "Operator Name" },
    { accessorKey: "registration", header: "Registration Mark" },
    { accessorKey: "aircraft_type", header: "Aircraft Type" },
    { accessorKey: "status", header: "Status" },
    { id: "actions", header: "Actions", cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(row.original.id)}>Edit</Button>
        <Button variant="outline" size="sm" onClick={() => handleDelete(row.original.id)} className="text-destructive">Delete</Button>
      </div>
    )},
  ];

  const filteredData = searchQuery ? data.filter(item =>
    (item.operator_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.registration || "").toLowerCase().includes(searchQuery.toLowerCase())
  ) : data;

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return <DataTable columns={columns} data={filteredData} />;
};

export default GeneralAviationTable;
