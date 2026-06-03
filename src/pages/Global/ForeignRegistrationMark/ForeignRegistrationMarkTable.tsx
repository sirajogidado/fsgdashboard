import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { onRecordChanged } from "@/lib/recordEvents";

interface ForeignRegistrationMark { id: string; registration_mark: string; country: string | null; description: string | null; }

interface ForeignRegistrationMarkTableProps { searchQuery: string; onEdit: (id: string) => void; }

const ForeignRegistrationMarkTable = ({ searchQuery, onEdit }: ForeignRegistrationMarkTableProps) => {
  const [data, setData] = useState<ForeignRegistrationMark[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: records } = await supabase.from("foreign_registration_marks").select("*").order("created_at", { ascending: false });
    setData((records as ForeignRegistrationMark[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); const off = onRecordChanged("foreign_registration_marks", fetchData); return off; }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("foreign_registration_marks").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted", description: "Registration mark deleted." }); fetchData(); }
  };

  const columns: ColumnDef<ForeignRegistrationMark>[] = [
    { accessorKey: "registration_mark", header: "Registration Mark" },
    { accessorKey: "country", header: "Country" },
    { accessorKey: "description", header: "Description" },
    { id: "actions", header: "Actions", cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(row.original.id)}>Edit</Button>
        <Button variant="outline" size="sm" onClick={() => handleDelete(row.original.id)} className="text-destructive">Delete</Button>
      </div>
    )},
  ];

  const filteredData = searchQuery ? data.filter(item =>
    (item.registration_mark || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.country || "").toLowerCase().includes(searchQuery.toLowerCase())
  ) : data;

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return <DataTable columns={columns} data={filteredData} />;
};

export default ForeignRegistrationMarkTable;
