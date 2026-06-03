import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { onRecordChanged } from "@/lib/recordEvents";

interface TravelAgency { id: string; agency_name: string; location: string | null; contact_person: string | null; description: string | null; }

interface TravelAgencyTableProps { searchQuery: string; onEdit: (id: string) => void; }

const TravelAgencyTable = ({ searchQuery, onEdit }: TravelAgencyTableProps) => {
  const [data, setData] = useState<TravelAgency[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: records } = await supabase.from("travel_agencies").select("*").order("created_at", { ascending: false });
    setData((records as TravelAgency[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); const off = onRecordChanged("travel_agencies", fetchData); return off; }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("travel_agencies").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted", description: "Travel agency deleted." }); fetchData(); }
  };

  const columns: ColumnDef<TravelAgency>[] = [
    { accessorKey: "agency_name", header: "Agency Name" },
    { accessorKey: "location", header: "Location" },
    { accessorKey: "contact_person", header: "Contact Person" },
    { accessorKey: "description", header: "Description" },
    { id: "actions", header: "Actions", cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(row.original.id)}>Edit</Button>
        <Button variant="outline" size="sm" onClick={() => handleDelete(row.original.id)} className="text-destructive">Delete</Button>
      </div>
    )},
  ];

  const filteredData = searchQuery ? data.filter(item =>
    (item.agency_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.location || "").toLowerCase().includes(searchQuery.toLowerCase())
  ) : data;

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return <DataTable columns={columns} data={filteredData} />;
};

export default TravelAgencyTable;
