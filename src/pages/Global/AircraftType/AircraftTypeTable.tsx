import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AircraftTypeTableProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const AircraftTypeTable: React.FC<AircraftTypeTableProps> = ({ searchQuery, onEdit }) => {
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: records } = await supabase.from("aircraft_types").select("*").order("created_at", { ascending: false });
    setData(records || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("aircraft_types").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted", description: "Aircraft type deleted." }); fetchData(); }
  };

  const filteredData = data.filter(item =>
    (item.type_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.manufacturer || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Manufacturer</TableHead>
            <TableHead>Aircraft Type</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? filteredData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.manufacturer}</TableCell>
              <TableCell className="font-medium">{item.type_name}</TableCell>
              <TableCell className="hidden md:table-cell">{item.description}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(item.id)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow><TableCell colSpan={4} className="text-center py-4">No aircraft types found.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AircraftTypeTable;
