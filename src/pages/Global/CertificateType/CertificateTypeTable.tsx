import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { onRecordChanged } from "@/lib/recordEvents";

interface CertificateType { id: string; certificate_name: string; category: string | null; validity: string | null; description: string | null; }

interface CertificateTypeTableProps { searchQuery: string; onEdit: (id: string) => void; }

const CertificateTypeTable = ({ searchQuery, onEdit }: CertificateTypeTableProps) => {
  const [data, setData] = useState<CertificateType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: records } = await supabase.from("certificate_types").select("*").order("created_at", { ascending: false });
    setData((records as CertificateType[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); const off = onRecordChanged("certificate_types", fetchData); return off; }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("certificate_types").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted", description: "Certificate type deleted." }); fetchData(); }
  };

  const columns: ColumnDef<CertificateType>[] = [
    { accessorKey: "certificate_name", header: "Certificate Name" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "validity", header: "Validity Period" },
    { accessorKey: "description", header: "Description" },
    { id: "actions", header: "Actions", cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(row.original.id)}>Edit</Button>
        <Button variant="outline" size="sm" onClick={() => handleDelete(row.original.id)} className="text-destructive">Delete</Button>
      </div>
    )},
  ];

  const filteredData = searchQuery ? data.filter(item =>
    (item.certificate_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  ) : data;

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return <DataTable columns={columns} data={filteredData} />;
};

export default CertificateTypeTable;
