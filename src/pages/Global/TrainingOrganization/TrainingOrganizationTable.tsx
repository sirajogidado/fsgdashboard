import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TrainingOrganization { id: string; organization_name: string; country: string | null; category: string | null; description: string | null; }

interface TrainingOrganizationTableProps { searchQuery: string; onEdit: (id: string) => void; }

const TrainingOrganizationTable = ({ searchQuery, onEdit }: TrainingOrganizationTableProps) => {
  const [data, setData] = useState<TrainingOrganization[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: records } = await supabase.from("training_organizations").select("*").order("created_at", { ascending: false });
    setData((records as TrainingOrganization[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("training_organizations").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted", description: "Training organization deleted." }); fetchData(); }
  };

  const columns: ColumnDef<TrainingOrganization>[] = [
    { accessorKey: "organization_name", header: "Organization Name" },
    { accessorKey: "country", header: "Country" },
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
    (item.organization_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.country || "").toLowerCase().includes(searchQuery.toLowerCase())
  ) : data;

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return <DataTable columns={columns} data={filteredData} />;
};

export default TrainingOrganizationTable;
