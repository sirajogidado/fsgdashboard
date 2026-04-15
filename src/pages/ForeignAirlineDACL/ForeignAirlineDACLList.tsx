import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface ForeignAirlineDACLListProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

const ForeignAirlineDACLList: React.FC<ForeignAirlineDACLListProps> = ({ searchQuery, onEdit }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: records } = await supabase.from("foreign_airline_dacl").select("*").order("created_at", { ascending: false });
    setData(records || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("foreign_airline_dacl").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted", description: "Foreign Airline DACL record deleted." }); fetchData(); }
  };

  const filteredData = data.filter((item) =>
    (item.airline_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.country || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.permit_number || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "expired": return "bg-red-500";
      case "suspended": return "bg-yellow-500";
      default: return "bg-blue-500";
    }
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Airline Name</TableHead>
            <TableHead className="hidden md:table-cell">Country</TableHead>
            <TableHead>Permit Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.airline_name}</TableCell>
                <TableCell className="hidden md:table-cell">{item.country}</TableCell>
                <TableCell>{item.permit_number}</TableCell>
                <TableCell><Badge className={getStatusColor(item.status)}>{item.status}</Badge></TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(item.id)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan={5} className="text-center py-4">No Foreign Airline DACL records found.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ForeignAirlineDACLList;
