import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { onRecordChanged } from "@/lib/recordEvents";

interface ForeignAirline { id: string; airline_name: string; country: string | null; iata_code: string | null; icao_code: string | null; }

interface ForeignAirlineTableProps { searchQuery: string; onEdit: (id: string) => void; }

const ForeignAirlineTable = ({ searchQuery, onEdit }: ForeignAirlineTableProps) => {
  const [data, setData] = useState<ForeignAirline[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: records } = await supabase.from("foreign_airlines").select("*").order("created_at", { ascending: false });
    setData((records as ForeignAirline[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); const off = onRecordChanged("foreign_airlines", fetchData); return off; }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("foreign_airlines").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted", description: "Foreign airline deleted." }); fetchData(); }
  };

  const columns: ColumnDef<ForeignAirline>[] = [
    { accessorKey: "airline_name", header: "Airline Name" },
    { accessorKey: "country", header: "Country" },
    { accessorKey: "iata_code", header: "IATA Code" },
    { accessorKey: "icao_code", header: "ICAO Code" },
    { id: "actions", header: "Actions", cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(row.original.id)}>Edit</Button>
        <Button variant="outline" size="sm" onClick={() => handleDelete(row.original.id)} className="text-destructive">Delete</Button>
      </div>
    )},
  ];

  const filteredData = searchQuery ? data.filter(item =>
    (item.airline_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.country || "").toLowerCase().includes(searchQuery.toLowerCase())
  ) : data;

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return <DataTable columns={columns} data={filteredData} />;
};

export default ForeignAirlineTable;
